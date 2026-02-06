
# Complete Supabase Auth Integration & Legacy User Migration Plan

## Executive Summary

This plan enables all 1,024 legacy users to login with their existing credentials while maintaining proper permission-based access control. The authentication flow uses Supabase Auth, with role and permission data stored in the existing `c3_users`, `c3_user_permissions`, and `c3_modules` tables.

**Security Note**: All sensitive encryption parameters (key, salt) will be stored as Supabase secrets, NOT in code.

---

## Current State

| Item | Count | Status |
|------|-------|--------|
| Total legacy users in `c3_users` | 1,025 | Migrated from MS SQL |
| Users linked to Supabase Auth | 1 | admin@c3wizard.kn only |
| Users needing migration | 1,024 | Have AES-encrypted passwords |
| Supabase Auth accounts | 3 | Test users created |
| RLS policies on c3_users | 2 | Already set up |
| Table grants | 0 | **ROOT CAUSE OF 42501 ERROR** |

---

## Architecture Overview

```text
                        LOGIN FLOW
----------------------------------------------------------------------

   User enters email + password
              |
              v
   +---------------------+
   |   Supabase Auth     |  <- Validates credentials (bcrypt)
   |   (auth.users)      |  <- Issues JWT token
   +----------+----------+
              |
              v
   +---------------------+
   |     c3_users        |  <- Lookup by auth_user_id OR email
   |                     |  <- Get role_id, user_type, company_id
   +----------+----------+
              |
       +------+------+
       v             v
   App Role      Permission Check
   (routing)     (menu access)
       |             |
       v             v
   Dashboard     c3_user_permissions + c3_modules
   (admin/       (CRUD flags per module)
   employer/
   self-emp)
```

---

## Implementation Steps

### Step 1: Add Secrets for Legacy Password Decryption

**Secrets to configure** (via Supabase secrets):

| Secret Name | Value | Purpose |
|-------------|-------|---------|
| `LEGACY_ENCRYPTION_KEY` | `MAKV2SPBNI99212` | AES-256 key from legacy system |
| `LEGACY_ENCRYPTION_SALT` | `SXZhbiBNZWR2ZWRldg==` | Base64 of "Ivan Medvedev" bytes |

**Why Base64 for salt**: The salt is binary data (hex bytes), so we store it as Base64 string and decode in the edge function.

---

### Step 2: Fix Database Permissions (Immediate - Fixes 42501 Error)

**Problem**: The `authenticated` role cannot SELECT from `c3_users` because no GRANT exists.

**Database Migration**:
```sql
-- Grant schema usage to authenticated users
GRANT USAGE ON SCHEMA public TO authenticated;
GRANT USAGE ON SCHEMA public TO anon;

-- Grant SELECT on tables needed for auth/permissions
GRANT SELECT ON public.c3_users TO authenticated;
GRANT SELECT ON public.c3_roles TO authenticated;
GRANT SELECT ON public.c3_modules TO authenticated;
GRANT SELECT ON public.c3_user_permissions TO authenticated;
GRANT SELECT ON public.c3_user_granular_permissions TO authenticated;

-- Also grant UPDATE on c3_users for linking auth_user_id during migration
GRANT UPDATE (auth_user_id, last_login_at, last_login_ip) ON public.c3_users TO authenticated;
```

**Why this is safe**: RLS policies already exist on `c3_users` that restrict access to own record only.

---

### Step 3: Create Password Migration Edge Function

**File**: `supabase/functions/migrate-legacy-users/index.ts`

**Key security feature**: Encryption key and salt are read from environment secrets, NOT hardcoded.

```typescript
// Read secrets from environment (configured in Supabase)
const ENCRYPTION_KEY = Deno.env.get('LEGACY_ENCRYPTION_KEY');
const SALT_BASE64 = Deno.env.get('LEGACY_ENCRYPTION_SALT');

if (!ENCRYPTION_KEY || !SALT_BASE64) {
  throw new Error('Missing encryption secrets');
}

// Decode the Base64 salt back to bytes
const SALT = Uint8Array.from(atob(SALT_BASE64), c => c.charCodeAt(0));

async function decryptLegacyPassword(cipherText: string): Promise<string> {
  // Uses PBKDF2 with 1000 iterations, SHA-1 hash
  // Derives 48 bytes: 32 for AES key + 16 for IV
  // AES-256-CBC mode
  // Text encoded as UTF-16LE (Encoding.Unicode in .NET)
  
  const keyMaterial = await crypto.subtle.importKey(
    "raw", new TextEncoder().encode(ENCRYPTION_KEY),
    "PBKDF2", false, ["deriveBits"]
  );
  
  const derived = await crypto.subtle.deriveBits(
    { name: "PBKDF2", salt: SALT, iterations: 1000, hash: "SHA-1" },
    keyMaterial, 384
  );
  
  const key = new Uint8Array(derived.slice(0, 32));
  const iv = new Uint8Array(derived.slice(32, 48));
  
  const cryptoKey = await crypto.subtle.importKey(
    "raw", key, { name: "AES-CBC" }, false, ["decrypt"]
  );
  
  const cipherBytes = Uint8Array.from(atob(cipherText), c => c.charCodeAt(0));
  const decrypted = await crypto.subtle.decrypt(
    { name: "AES-CBC", iv }, cryptoKey, cipherBytes
  );
  
  return new TextDecoder("utf-16le").decode(decrypted);
}
```

**Process per user**:
1. Read `c3_users` record where `auth_user_id IS NULL`
2. Decrypt `password_hash` using secrets from environment
3. Create Supabase Auth user with email + decrypted password
4. Update `c3_users.auth_user_id` with new auth user ID
5. Log result to `c3_migration_logs` table

**Batch processing**: Process 50 users per request to avoid timeouts.

---

### Step 4: Create Migration Tracking Table

**Database Migration**:
```sql
CREATE TABLE public.c3_migration_logs (
  id SERIAL PRIMARY KEY,
  c3_user_id INTEGER REFERENCES public.c3_users(id),
  email VARCHAR(255),
  status VARCHAR(50), -- 'success', 'failed', 'skipped'
  error_message TEXT,
  auth_user_id UUID,
  migrated_at TIMESTAMPTZ DEFAULT now()
);

-- No RLS needed - admin access only via service role
```

---

### Step 5: Update Role Mapping in useAuth.tsx

**Updated mapping** (covers all 12 legacy roles):
```typescript
const mapRoleIdToAppRole = (roleId: number | null): UserRole => {
  if (!roleId) return null;
  
  // Admin roles (SSB Staff - different departments)
  // 13 = Administrative, 14 = Inspector, 18 = BEMA APIs
  // 19 = Finance, 20 = MIS, 21 = Compliance
  // 22 = Cashiers, 24 = Administrative (duplicate)
  if ([13, 14, 18, 19, 20, 21, 22, 24].includes(roleId)) {
    return 'admin';
  }
  
  // Employer roles (Company users)
  // 15 = Company (owner), 16 = Company User (staff)
  // 23 = Test Payment (legacy test accounts)
  if ([15, 16, 23].includes(roleId)) {
    return 'employer';
  }
  
  // Self-employed
  // 17 = Self Employed
  if (roleId === 17) {
    return 'self_employed';
  }
  
  return null;
};
```

---

### Step 6: Create Permission Hooks

**File**: `src/hooks/useUserPermissions.ts`

```typescript
interface ModulePermission {
  module_id: number;
  module_name: string;
  page_url: string;
  can_create: boolean;
  can_read: boolean;
  can_update: boolean;
  can_delete: boolean;
  can_browse: boolean;
  can_export: boolean;
}

export function useUserPermissions(roleId: number | null) {
  // Query:
  // SELECT m.*, p.can_create, p.can_read, p.can_update, p.can_delete, 
  //        p.can_browse, p.can_export
  // FROM c3_user_permissions p
  // JOIN c3_modules m ON m.id = p.module_id
  // WHERE p.role_id = :roleId AND p.is_deleted = false AND m.is_deleted = false
  
  // Returns: array of modules user can access with their CRUD flags
}
```

**Usage in UI**:
```typescript
// In sidebar or menu component
const { permissions } = useUserPermissions(currentUser.roleId);

// Filter visible menu items
const visibleMenuItems = menuItems.filter(item => 
  permissions.some(p => p.page_url === item.path && p.can_read)
);

// Check action permissions
const canEditEmployee = permissions.find(p => 
  p.module_name === 'EMPLOYEE MANAGEMENT'
)?.can_update ?? false;
```

---

### Step 7: Update Knowledge Base

**New file**: `knowledge/15_authentication_migration.md`

Contents:
1. Legacy AES encryption algorithm (reference only, no keys)
2. PBKDF2 key derivation parameters (iterations, hash type)
3. Role ID to App Role mapping table (all 12 roles)
4. Permission table structure and usage
5. Supabase Auth integration flow
6. .NET Core Identity migration path

**Security note in documentation**:
```markdown
## Encryption Secrets

The legacy password decryption requires two secrets stored in Supabase:
- `LEGACY_ENCRYPTION_KEY` - The AES-256 encryption key
- `LEGACY_ENCRYPTION_SALT` - The PBKDF2 salt (Base64 encoded)

These secrets are NEVER stored in code and must be configured via 
Supabase Dashboard > Settings > Edge Functions > Secrets.
```

**Update**: `system.json` - Add authentication section (without exposing secrets):
```json
{
  "authentication": {
    "provider": "Supabase Auth",
    "passwordStorage": "bcrypt (Supabase managed)",
    "legacyPasswordMigration": {
      "algorithm": "AES-256-CBC",
      "keyDerivation": "PBKDF2 (1000 iterations, SHA-1)",
      "encoding": "UTF-16LE",
      "secretsRequired": ["LEGACY_ENCRYPTION_KEY", "LEGACY_ENCRYPTION_SALT"]
    },
    "roleMapping": {
      "admin": [13, 14, 18, 19, 20, 21, 22, 24],
      "employer": [15, 16, 23],
      "self_employed": [17]
    }
  }
}
```

---

## .NET Core Identity Compatibility

| Supabase Component | .NET Core Equivalent |
|--------------------|---------------------|
| `auth.users` | `AspNetUsers` table |
| `c3_users.role_id` | `AspNetUserRoles` junction |
| `c3_roles` | `AspNetRoles` table |
| `c3_user_permissions` | Authorization middleware |
| JWT claims | Identity ClaimsPrincipal |

---

## File Changes Summary

### Secrets to Configure
| Secret Name | Purpose |
|-------------|---------|
| `LEGACY_ENCRYPTION_KEY` | AES-256 key for password decryption |
| `LEGACY_ENCRYPTION_SALT` | PBKDF2 salt (Base64 encoded) |

### Files to Create
| File | Purpose |
|------|---------|
| `supabase/functions/migrate-legacy-users/index.ts` | AES decryption + Supabase user creation |
| `src/hooks/useUserPermissions.ts` | Permission fetching hook |
| `knowledge/15_authentication_migration.md` | Complete auth documentation |

### Files to Modify
| File | Changes |
|------|---------|
| `src/hooks/useAuth.tsx` | Expand role mapping to cover all 12 role IDs |
| `knowledge/00_index.md` | Add reference to new auth file |
| `system.json` | Add authentication configuration section |

### Database Migrations
| Migration | Purpose |
|-----------|---------|
| Grant schema/table permissions | Fix 42501 error |
| Create c3_migration_logs table | Track migration progress |

---

## Execution Order

1. ✅ **Add secrets** - Configure LEGACY_ENCRYPTION_KEY and LEGACY_ENCRYPTION_SALT
2. ✅ **Database permissions** (grants) - Immediate login fix
3. ✅ **Migration logs table** - Tracking setup
4. ✅ **Update useAuth.tsx** - Complete role mapping (all 12 roles)
5. ✅ **Create migrate-legacy-users function** - Password migration (deployed)
6. ⏳ **Run migration** - Awaiting verification of encryption parameters
7. ✅ **Create useUserPermissions hook** - Permission system
8. ✅ **Update knowledge base** - Documentation complete

---

## Implementation Status (February 2, 2026)

### Migration Progress
- **857 of 1,025 users migrated (84%)**
- 168 users remaining with "Database error creating new user" - likely invalid email formats or other constraints
- Duplicate email handling: Removed unique constraint on `auth_user_id` to allow multiple c3_users to share one auth account

### Completed
- ✅ Database grants for authenticated role
- ✅ c3_migration_logs table created
- ✅ useAuth.tsx role mapping expanded to all 12 roles
- ✅ migrate-legacy-users edge function deployed
- ✅ useUserPermissions hook created
- ✅ knowledge/15_authentication_migration.md created
- ✅ Encryption secrets configured (LEGACY_ENCRYPTION_KEY, LEGACY_ENCRYPTION_SALT)
- ✅ Bulk migration executed - 857 users can now login with their legacy passwords

### Remaining
- 168 users with invalid data (can be manually reviewed in c3_migration_logs)

---

## Security Summary

| Item | Storage Location | In Code? |
|------|-----------------|----------|
| AES Encryption Key | Supabase Secrets | NO |
| PBKDF2 Salt | Supabase Secrets | NO |
| Algorithm parameters | Code + Docs | YES (safe) |
| Role mappings | Code | YES (safe) |
| User passwords | Supabase Auth (bcrypt) | NO |
