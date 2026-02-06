# Authentication & Legacy User Migration Guide

**Last Updated**: February 2, 2026

This document describes the authentication system architecture and the process for migrating 1,024 legacy users from MS SQL Server to Supabase Auth.

---

## Table of Contents

1. [Authentication Architecture](#authentication-architecture)
2. [Role Mapping](#role-mapping)
3. [Permission System](#permission-system)
4. [Legacy Password Migration](#legacy-password-migration)
5. [.NET Core Identity Compatibility](#net-core-identity-compatibility)
6. [Security Considerations](#security-considerations)

---

## Authentication Architecture

### Login Flow

```
User enters email + password
         │
         ▼
┌─────────────────────┐
│   Supabase Auth     │  ← Validates credentials (bcrypt)
│   (auth.users)      │  ← Issues JWT token
└──────────┬──────────┘
           │
           ▼
┌─────────────────────┐
│     c3_users        │  ← Lookup by auth_user_id OR email
│                     │  ← Get role_id, user_type, company_id
└──────────┬──────────┘
           │
    ┌──────┴──────┐
    ▼             ▼
App Role      Permission Check
(routing)     (menu access)
    │             │
    ▼             ▼
Dashboard     c3_user_permissions + c3_modules
              (CRUD flags per module)
```

### Key Tables

| Table | Purpose |
|-------|---------|
| `auth.users` | Supabase Auth managed user accounts |
| `c3_users` | Application user data with `auth_user_id` link |
| `c3_roles` | Role definitions (12 legacy roles) |
| `c3_user_permissions` | Role-based module access |
| `c3_user_granular_permissions` | User-specific permission overrides |
| `c3_modules` | Menu/module definitions with page URLs |

---

## Role Mapping

### Legacy Roles to App Roles

The system maps 12 legacy role IDs to 3 application roles for routing:

| Role ID | Role Name | App Role | Description |
|---------|-----------|----------|-------------|
| 13 | Administrative | `admin` | SSB Staff - General Admin |
| 14 | Inspector | `admin` | SSB Staff - Field Inspectors |
| 18 | BEMA APIs | `admin` | SSB Staff - API Integration |
| 19 | Finance | `admin` | SSB Staff - Finance Department |
| 20 | MIS | `admin` | SSB Staff - IT/MIS |
| 21 | Compliance | `admin` | SSB Staff - Compliance Officers |
| 22 | Cashiers | `admin` | SSB Staff - Cashier Operations |
| 24 | Administrative | `admin` | SSB Staff - Duplicate of 13 |
| 15 | Company | `employer` | Company Owner/Primary User |
| 16 | Company User | `employer` | Company Staff/Secondary User |
| 23 | Test Payment | `employer` | Test Accounts |
| 17 | Self Employed | `self_employed` | Self-Employed Individuals |

### Role Mapping Logic (useAuth.tsx)

```typescript
const mapRoleIdToAppRole = (roleId: number | null): UserRole => {
  if (!roleId) return null;
  
  // Admin roles (SSB Staff)
  if ([13, 14, 18, 19, 20, 21, 22, 24].includes(roleId)) {
    return 'admin';
  }
  
  // Employer roles (Company users)
  if ([15, 16, 23].includes(roleId)) {
    return 'employer';
  }
  
  // Self-employed
  if (roleId === 17) {
    return 'self_employed';
  }
  
  return null;
};
```

---

## Permission System

### Two-Level Authorization

1. **App Role** (high-level): Determines dashboard/portal routing
2. **Module Permissions** (granular): Controls menu visibility and CRUD actions

### Permission Tables

#### c3_user_permissions (Role-Based)

```sql
SELECT m.module_name, m.page_url, 
       p.can_create, p.can_read, p.can_update, p.can_delete,
       p.can_browse, p.can_export
FROM c3_user_permissions p
JOIN c3_modules m ON m.id = p.module_id
WHERE p.role_id = :roleId 
  AND p.is_deleted = false 
  AND m.is_deleted = false;
```

#### c3_user_granular_permissions (User-Specific Overrides)

```sql
SELECT * FROM c3_user_granular_permissions
WHERE user_id = :userId AND is_deleted = false;
```

### Using Permissions in UI

```typescript
// In sidebar component
const { permissions, hasPermission, canAccessModule } = useUserPermissions(roleId);

// Filter visible menu items
const visibleMenuItems = menuItems.filter(item => 
  canAccessModule(item.path)
);

// Check specific action
const canEditEmployee = hasPermission('EMPLOYEE MANAGEMENT', 'update');
const canDeletePayment = hasPermission('/employer/payments', 'delete');
```

---

## Legacy Password Migration

### Overview

Legacy users have passwords encrypted with AES-256-CBC. The migration function decrypts these and creates Supabase Auth accounts.

### Encryption Algorithm

| Parameter | Value |
|-----------|-------|
| Algorithm | AES-256-CBC |
| Key Derivation | PBKDF2 |
| Iterations | 1000 |
| Hash | SHA-1 |
| Key Size | 256 bits (32 bytes) |
| IV Size | 128 bits (16 bytes) |
| Text Encoding | UTF-16LE (.NET Encoding.Unicode) |

### Required Secrets

⚠️ **SECURITY**: These secrets are stored in Supabase Edge Function secrets, NEVER in code.

| Secret Name | Description |
|-------------|-------------|
| `LEGACY_ENCRYPTION_KEY` | The AES-256 encryption key |
| `LEGACY_ENCRYPTION_SALT` | The PBKDF2 salt (Base64 encoded) |

### Migration Edge Function

**Location**: `supabase/functions/migrate-legacy-users/index.ts`

**Usage**:

```bash
# Dry run (test decryption without creating accounts)
curl -X POST https://PROJECT.supabase.co/functions/v1/migrate-legacy-users \
  -H "Authorization: Bearer SERVICE_ROLE_KEY" \
  -H "Content-Type: application/json" \
  -d '{"dry_run": true, "batch_size": 10}'

# Actual migration (50 users at a time)
curl -X POST https://PROJECT.supabase.co/functions/v1/migrate-legacy-users \
  -H "Authorization: Bearer SERVICE_ROLE_KEY" \
  -H "Content-Type: application/json" \
  -d '{"batch_size": 50}'
```

**Response**:

```json
{
  "success": true,
  "message": "Migration batch completed",
  "migrated": 48,
  "failed": 2,
  "skipped": 0,
  "remaining": 976,
  "errors": [
    {"email": "invalid@example.com", "error": "Decryption failed"}
  ]
}
```

### Migration Tracking

All migration attempts are logged in `c3_migration_logs`:

```sql
SELECT * FROM c3_migration_logs 
ORDER BY migrated_at DESC;
```

---

## .NET Core Identity Compatibility

The authentication design is compatible with future .NET Core Identity migration:

| Supabase Component | .NET Core Equivalent |
|--------------------|---------------------|
| `auth.users` | `AspNetUsers` table |
| `c3_users.role_id` | `AspNetUserRoles` junction |
| `c3_roles` | `AspNetRoles` table |
| JWT claims | Identity ClaimsPrincipal |
| `c3_user_permissions` | Authorization middleware |
| RLS policies | Entity Framework filters |

### Password Migration to .NET

When migrating to .NET Core:

1. **Option A**: Force password reset on first .NET login
2. **Option B**: Use bcrypt hasher in .NET (`BCrypt.Net-Next` NuGet)

Supabase Auth uses bcrypt, which is compatible with .NET via:

```csharp
// NuGet: BCrypt.Net-Next
bool valid = BCrypt.Net.BCrypt.Verify(password, hashedPassword);
```

---

## Security Considerations

### Database Grants

```sql
-- Required for authenticated users
GRANT USAGE ON SCHEMA public TO authenticated;
GRANT SELECT ON public.c3_users TO authenticated;
GRANT SELECT ON public.c3_roles TO authenticated;
GRANT SELECT ON public.c3_modules TO authenticated;
GRANT SELECT ON public.c3_user_permissions TO authenticated;
GRANT SELECT ON public.c3_user_granular_permissions TO authenticated;
```

### RLS Policy on c3_users

```sql
-- Users can only view their own record
CREATE POLICY "users_can_view_own_record"
ON public.c3_users FOR SELECT TO authenticated
USING (
  auth_user_id = auth.uid() 
  OR email = (SELECT email FROM auth.users WHERE id = auth.uid())
);
```

### Secret Management

- ❌ **NEVER** store encryption keys in code
- ❌ **NEVER** commit secrets to version control
- ✅ **ALWAYS** use Supabase Edge Function secrets
- ✅ **ALWAYS** use service role key for migration (not anon key)

---

## Troubleshooting

### Error: 42501 permission denied

**Cause**: Missing GRANT on tables.

**Fix**: Run the database permissions migration to grant SELECT to authenticated role.

### Error: Decryption failed

**Causes**:
1. Missing encryption secrets in environment
2. Corrupted password_hash in database
3. Non-standard encryption in legacy system

**Fix**: Check `c3_migration_logs` for specific error messages.

### Error: Email already exists

**Cause**: User email already in auth.users (possibly from manual creation).

**Fix**: The migration function automatically links existing auth users to c3_users records.

---

## Related Files

- `src/hooks/useAuth.tsx` - Authentication context and role mapping
- `src/hooks/useUserPermissions.ts` - Permission fetching hooks
- `supabase/functions/migrate-legacy-users/index.ts` - Migration edge function
- `knowledge/03_user_roles_permissions.md` - Role definitions
- `knowledge/14_security_authentication.md` - Security overview
