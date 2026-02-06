# C3 Wizard - Knowledge Base Index

**Complete reference guide for C3 Wizard Social Security Contribution Management System**

**For Lovable AI**: This is your primary navigation hub. Read this first to understand the complete knowledge structure.

---

## 🚨 CRITICAL: MIGRATION APPROACH (January 28, 2026)

### **KEEP LEGACY TABLE AND FIELD NAMES EXACTLY AS-IS**

**Why**: To ensure a smooth and conflict-free migration from MS SQL Server to Supabase.

**Rules**:
1. ✅ Keep **EXACT same table names** as MS SQL (e.g., `MasterEmployee`, `PROCESS_C3Header`)
2. ✅ Keep **EXACT same field names** as MS SQL (e.g., `CompanyId`, `Soc_Sec_Num`)
3. ✅ Only apply **data type mappings** (MS SQL → PostgreSQL equivalents)
4. ❌ **NO renaming** tables to `c3_*` prefix
5. ❌ **NO converting** field names to `snake_case`
6. ❌ **NO schema optimization** or consolidation

**Exception**: New Supabase-specific tables (user_roles for RLS) can use proper naming.

---

## 📚 KNOWLEDGE BASE FILES

### **Core System (Files 01-03)**

| # | File | Description | Size |
|---|------|-------------|------|
| 01 | **[Purpose & Scope](01_purpose_scope.md)** | System overview, objectives, target users | 3 KB |
| 02 | **[System Architecture](02_system_architecture.md)** | Tech stack (React + Supabase), migration strategy | 17 KB |
| 03 | **[User Roles & Permissions](03_user_roles_permissions.md)** | 3 roles (Admin, Employer, Self-Employed), RLS policies | 13 KB |

---

### **Database (Files 04-05, 13, 20-21)**

| # | File | Description | Size |
|---|------|-------------|------|
| 04 | **[Database Schema - Part 1](04_database_schema.md)** | Core tables (users, companies, employees, C3 forms) | 14 KB |
| 04.2 | **[Database Schema - Part 2](04_database_schema_part2.md)** | Payments, rates, audit, RLS detailed policies | 17 KB |
| 13 | **[Complete Table List](13_complete_table_list.md)** 🔥 | All 66 production tables with row counts (~187K rows) | 15 KB |
| 20 | **[Migration Naming Guide](20_database_optimization_guide.md)** 🔥 | Keep legacy names, minimal changes | 7 KB |
| 21 | **[Large File Migration Guide](21_large_file_migration_guide.md)** | Git LFS, file splitting, 264MB data migration | 8 KB |

---

### **Business Logic (Files 05, 16)**

| # | File | Description | Size |
|---|------|-------------|------|
| 05 | **[Contribution Calculations](05_contribution_calculations.md)** 🔥 | **CRITICAL**: ALL calculation formulas, caps, special rules | 18 KB |
| 16 | **[Validation Rules](16_validation_rules.md)** | All field validations, error messages, patterns | 14 KB |

---

### **UI/UX (File 09)**

| # | File | Description | Size |
|---|------|-------------|------|
| 09 | **[UI/UX Standards](09_ui_ux_standards.md)** | Mint green theme, shadcn/ui components, responsive design | 14 KB |

---

### **Integration (Files 10-12, 14-15)**

| # | File | Description | Size |
|---|------|-------------|------|
| 10 | **[Payment Processing](10_payment_processing.md)** | CyberSource, PayPal, offline payments | 3 KB |
| 11 | **[BIMA Integration](11_bima_integration.md)** | Complete BIMA API specs, all endpoints | 17 KB |
| 12 | **[Email Notifications](12_email_notifications.md)** | Email templates, notification triggers | 7 KB |
| 14 | **[Security & Authentication](14_security_authentication.md)** | JWT, RLS, encryption, audit logging | 3 KB |
| 15 | **[Authentication Migration](15_authentication_migration.md)** 🔥 | Legacy user migration, role mapping, permissions | 12 KB |

---

### **Architecture (Files 22-25)**

| # | File | Description | Size |
|---|------|-------------|------|
| 22 | **[Current Database Status](22_current_database_status.md)** | Migration status, optimized schema state | 8 KB |
| 23 | **[Optimised Schema Mapping](23_optimised_schema_mapping.md)** | Legacy to optimized table mapping | 10 KB |
| 24 | **[Legacy to Optimised Field Mapping](24_legacy_to_optimised_field_mapping.md)** | Field-level mapping reference | 12 KB |
| 25 | **[Backend-First Architecture](25_backend_first_architecture.md)** 🔥 | **CRITICAL**: All logic in Edge Functions for .NET migration | 8 KB |

---

## 🔥 MOST CRITICAL FILES (Read These First)

1. **`25_backend_first_architecture.md`** - ALL logic in Edge Functions 🔥🔥🔥
2. **`05_contribution_calculations.md`** - ALL calculation formulas 🔥🔥🔥
3. **`13_complete_table_list.md`** - All 66 legacy tables with exact names
4. **`03_user_roles_permissions.md`** - RLS policies
5. **`16_validation_rules.md`** - All validations

---

## 📋 QUICK REFERENCE TABLE

| Need | File | Key Info |
|------|------|----------|
| What is C3 Wizard? | `01_purpose_scope.md` | System overview, goals, users |
| Tech stack? | `02_system_architecture.md` | React + Supabase → .NET migration |
| Who can do what? | `03_user_roles_permissions.md` | Role permission matrix, RLS |
| Legacy table names? | `13_complete_table_list.md` | **All 66 tables - USE EXACT NAMES** |
| **Calculations?** 🔥 | `05_contribution_calculations.md` | **ALL formulas with examples** |
| **Architecture?** 🔥 | `25_backend_first_architecture.md` | **ALL logic in Edge Functions** |
| UI design? | `09_ui_ux_standards.md` | Mint green theme, components |
| Validations? | `16_validation_rules.md` | Field rules, error messages |
| BIMA API? | `11_bima_integration.md` | All endpoints, auth, payloads |
| Payments? | `10_payment_processing.md` | Gateway integration |
| Emails? | `12_email_notifications.md` | Templates, triggers |
| Security? | `14_security_authentication.md` | Auth, RLS, encryption |
| **Auth Migration?** 🔥 | `15_authentication_migration.md` | Legacy users, role mapping |

---

## ⚠️ CRITICAL RULES (NEVER FORGET)

### For Lovable AI:

1. **USE LEGACY TABLE NAMES** - Keep `MasterEmployee`, `PROCESS_C3Header`, etc. exactly as-is
2. **USE LEGACY FIELD NAMES** - Keep `CompanyId`, `Soc_Sec_Num`, etc. exactly as-is
3. **Rates are NEVER hardcoded** - Fetch from `Master_Rate_Setting` table
4. **Every table needs audit columns** - InsertedOn, InsertedBy, UpdatedOn, UpdatedBy, IsActive
5. **Soft delete ONLY** - Never use DELETE, always UPDATE IsActive = 0
6. **RLS on every table** - Employers see own company, Self-Employed see own data, Admins see all
7. **Read calculation formulas** - Never code calculations yourself, read from `05_contribution_calculations.md`
8. **Screen replication** - Use PDF manuals in `PRDs/` folder for exact layouts

---

## 🎯 THREE USER ROLES

| Role | Access Scope | Key Capabilities |
|------|-------------|------------------|
| **Admin** | ALL companies | Manage users, configure rates, reconcile payments, access all data |
| **Employer** | OWN company only | Manage employees, generate C3 forms, process payments |
| **Self-Employed** | OWN data only | Manage profile, submit contributions, process payments |

**See**: `03_user_roles_permissions.md` for complete details

---

## 💰 CONTRIBUTION COMPONENTS

| Component | Employee Rate | Employer Rate | Cap |
|-----------|--------------|---------------|-----|
| Social Security (SS) | From DB | From DB | Employee capped |
| Employment Insurance (EI) | From DB | From DB | Both capped |
| Levy | Progressive (from DB) | From DB | No cap |
| Severance Pay (PE) | From DB | From DB | Employee capped |

**⚠️ ALL rates fetched from `Master_Rate_Setting` and `Deductions_Tax_Table_Details` tables**

**See**: `05_contribution_calculations.md` for complete formulas

---

## 🎨 UI/UX THEME

**Primary Color**: Brand Green `#16A34A`  
**Components**: shadcn/ui  
**Design**: Clean, modern, professional, card-based layouts

> **CRITICAL**: The ONLY allowed brand/theme color is #16A34A.  
> All email branding must match this color. Design enhancements are allowed, but theme color changes are NOT permitted.
> Email sender identities and test emails must be configured via environment variables, not hardcoded.

**See**: `09_ui_ux_standards.md` for complete design system

---

## 🔗 EXTERNAL INTEGRATIONS

1. **BIMA API** - St. Kitts & Nevis Social Security Board
   - Employee import
   - C3 submission
   - Payment posting
   - **See**: `11_bima_integration.md`

2. **Payment Gateways**
   - CyberSource (credit/debit cards)
   - PayPal
   - Offline (bank transfer, check, cash)
   - **See**: `10_payment_processing.md`

3. **Email Service** (To be configured)
   - Registration confirmation
   - OTP verification
   - Password reset
   - Payment receipts
   - **See**: `12_email_notifications.md`

---

## 📌 DEVELOPMENT WORKFLOW

### Phase 1: Foundation
- Read: `02_system_architecture.md`, `13_complete_table_list.md`
- Build: Database (using EXACT legacy table names), Auth, User roles

### Phase 2: Core Features
- Read: `05_contribution_calculations.md` 🔥, `16_validation_rules.md`
- Build: Employee management, C3 generation, Calculations

### Phase 3: Integration
- Read: `10_payment_processing.md`, `11_bima_integration.md`
- Build: Payments, BIMA integration

### Phase 4: Polish
- Read: `09_ui_ux_standards.md`, `12_email_notifications.md`
- Build: UI refinements, Emails, Reports

---

## 🚨 CRITICAL WARNINGS

1. ❌ **NEVER** rename legacy tables (keep `MasterEmployee`, not `c3_employees`)
2. ❌ **NEVER** rename legacy fields (keep `Soc_Sec_Num`, not `ssn`)
3. ❌ **NEVER** hardcode rates (fetch from `Master_Rate_Setting`)
4. ❌ **NEVER** hard delete records (use soft delete)
5. ❌ **NEVER** code calculations yourself (read from knowledge file)
6. ❌ **NEVER** skip RLS policies
7. ❌ **NEVER** allow cross-company data access
8. ❌ **NEVER** allow editing submitted C3 forms
9. ❌ **NEVER** forget December bonus exemption rule
10. ❌ **NEVER** forget age exemption for SS

---

## 📝 NAMING CONVENTIONS

### Legacy Tables (KEEP AS-IS):
- `MasterCompany`, `MasterEmployee`, `PROCESS_C3Header`, etc.

### Legacy Fields (KEEP AS-IS):
- `CompanyId`, `EmployeeID`, `Soc_Sec_Num`, `First_Name`, etc.

### NEW Supabase-only Tables (for RLS):
- `user_roles` (using app_role enum)
- These follow standard Supabase conventions

### API: `/api/module/action` (kebab-case)
### Components: `ComponentName` (PascalCase)
### Functions: `functionName` (camelCase)

---

## 🧪 VALIDATION TEST CASES

Before deploying, verify:

| Test | Input | Expected Output |
|------|-------|----------------|
| Cap Test | High wages | Caps applied correctly |
| Dec Bonus | December, low YTD | Employee levy = $0 on bonus |
| Age Exempt | Age outside range | SS = $0 |
| Holiday Pay | Non-working weeks | Distributed correctly |

**Complete test cases**: `05_contribution_calculations.md`

---

## 📞 HOW TO USE THIS INDEX

### For Lovable AI:
1. **Read this index FIRST** to understand structure
2. **Use EXACT legacy table/field names** from `13_complete_table_list.md`
3. **Cross-reference** multiple files (e.g., Database + Calculations + Validation)
4. **Never assume** - always verify against knowledge files

### For Developers:
- Use as single source of truth
- Reference during implementation
- Consult during code reviews

---

## 📄 DOCUMENT INFO

**Total Files**: 17 knowledge files  
**Total Size**: ~180 KB documentation  
**Last Updated**: January 28, 2026  
**Status**: Production-ready (LEGACY NAMES PRESERVED)

### Production Data Summary
| Metric | Value |
|--------|-------|
| MS SQL Tables | 66 |
| Total Rows | ~187,000 |
| Companies | 970 |
| Employees | 9,145 |
| C3 Contributions | 59,591 |

---

**This knowledge base contains everything needed to build a 100% accurate C3 Wizard replica.**

**IMPORTANT: Use EXACT legacy table and field names for smooth migration!**
