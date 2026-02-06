# 23. Optimised Schema Mapping Guide

**Document Version**: 2.0  
**Last Updated**: January 29, 2026  
**Purpose**: Complete mapping between legacy `public` schema and new `optimised_c3wizard` schema

---

## ✅ OPTIMISED SCHEMA COMPLETE

**Schema Name**: `optimised_c3wizard`  
**Total Tables Created**: 58 optimised tables  
**Naming Convention**: `c3_` prefix + snake_case

---

## 📋 COMPLETE TABLE MAPPING (58 Tables)

| # | Legacy Table (public) | Optimised Table (optimised_c3wizard) | Status |
|---|----------------------|--------------------------------------|--------|
| **LOOKUP/REFERENCE** ||||
| 1 | `country` | `c3_countries` | ✅ Created |
| 2 | `state` | `c3_states` | ✅ Created |
| 3 | `city` | `c3_cities` | ✅ Created |
| 4 | `masteremptype` | `c3_employee_types` | ✅ Created |
| 5 | `wagecategories` | `c3_wage_categories` | ✅ Created |
| **ROLES & PERMISSIONS** ||||
| 6 | `secrole` | `c3_roles` | ✅ Created |
| 7 | `secmodule` | `c3_modules` | ✅ Created |
| **RATES & CONFIG** ||||
| 8 | `master_rate_setting` | `c3_system_rates` | ✅ Created |
| 9 | `deductions_tax_table_details` | `c3_levy_tiers` | ✅ Created |
| 10 | `deductions_tax_table_header` | `c3_levy_allowances` | ✅ Created |
| 11 | `december_bonus_exempted_contribution` | `c3_bonus_exemptions` | ✅ Created |
| 12 | `self_employed_settings` | `c3_self_employed_settings` | ✅ Created |
| 13 | `sitesettings` | `c3_site_settings` | ✅ Created |
| **USERS & AUTH** ||||
| 14 | `secusers` | `c3_users` | ✅ Created |
| 15 | `secusersprofile` | `c3_user_profiles` | ✅ Created |
| 16 | `secusermodule` | `c3_user_permissions` | ✅ Created |
| 17 | `securityquestionanswer` | `c3_security_questions` | ✅ Created |
| 18 | `userotp` | `c3_user_otps` | ✅ Created |
| 19 | `userpermission` | `c3_user_granular_permissions` | ✅ Created |
| **COMPANIES & EMPLOYEES** ||||
| 20 | `mastercompany` | `c3_companies` | ✅ Created |
| 21 | `masteremployee` | `c3_employees` | ✅ Created |
| 22 | `selfemployee` | `c3_self_employed` | ✅ Created |
| **C3 CONTRIBUTIONS** ||||
| 23 | `process_c3header` | `c3_contribution_headers` | ✅ Created |
| 24 | `process_contributions` | `c3_contribution_details` | ✅ Created |
| 25 | `process_self_employedc3` | `c3_self_employed_contributions` | ✅ Created |
| **BONUS & HOLIDAY** ||||
| 26 | `bonuspaydetails` | `c3_bonus_payments` | ✅ Created |
| 27 | `masterholidaypaydetails` | `c3_holiday_payments` | ✅ Created |
| 28 | `holidaypaydates` | `c3_holiday_pay_dates` | ✅ Created |
| **PAYMENTS** ||||
| 29 | `onlinepayments` | `c3_payments` | ✅ Created |
| 30 | `bankpaymentsmain` | `c3_bank_payments` | ✅ Created |
| 31 | `usercarddetail` | `c3_saved_cards` | ✅ Created |
| 32 | `reconciliation_cyber_space` | `c3_reconciliation_records` | ✅ Created |
| 33 | `reconciliationpayment_details` | `c3_reconciliation_payment_details` | ✅ Created |
| 34 | `reconciliation_cyber_space_column` | `c3_reconciliation_columns` | ✅ Created |
| **AUDIT & LOGS** ||||
| 35 | `auditlogs` | `c3_audit_logs` | ✅ Created |
| 36 | `loginlog` | `c3_login_logs` | ✅ Created |
| 37 | `customerrorlogs` | `c3_error_logs` | ✅ Created |
| 38 | `exception_log` | `c3_exception_logs` | ✅ Created |
| **CMS & MISC** ||||
| 39 | `aboutus` | `c3_about_us` | ✅ Created |
| 40 | `contactus_log` | `c3_contact_logs` | ✅ Created |
| 41 | `c3_regn_*` | `c3_temp_registrations` | ✅ Created |
| **INCOME/DEDUCTION/OBLIGATION CODES** ||||
| 42 | `masterdeductioncodes` | `c3_deduction_codes` | ✅ Created |
| 43 | `masterinccodes` | `c3_income_codes` | ✅ Created |
| 44 | `masterobligationcodes` | `c3_obligation_codes` | ✅ Created |
| **EMPLOYEE INCOME/DEDUCTIONS/OBLIGATIONS** ||||
| 45 | `masteremployeedeductions` | `c3_employee_deductions` | ✅ Created |
| 46 | `masteremployeeincomes` | `c3_employee_incomes` | ✅ Created |
| 47 | `masteremployeeobligations` | `c3_employee_obligations` | ✅ Created |
| **EMPLOYER CODES & NWD** ||||
| 48 | `masteremployercodes` | `c3_employer_codes` | ✅ Created |
| 49 | `nwd_master_rate_settings` | `c3_nwd_rate_settings` | ✅ Created |
| **PAYROLL PROCESSING** ||||
| 50 | `payroll_process_header` | `c3_payroll_headers` | ✅ Created |
| 51 | `payroll_process_details` | `c3_payroll_details` | ✅ Created |
| 52 | `process_payemployee` | `c3_payroll_employees` | ✅ Created |
| 53 | `process_payincomes` | `c3_payroll_incomes` | ✅ Created |
| 54 | `process_paydeductions` | `c3_payroll_deductions` | ✅ Created |
| 55 | `process_payobligations` | `c3_payroll_obligations` | ✅ Created |
| **TIME CARD** ||||
| 56 | `employeetcard_header` | `c3_timecard_headers` | ✅ Created |
| 57 | `employeetcard_details` | `c3_timecard_details` | ✅ Created |
| 58 | `employeeworkdurationdetails` | `c3_work_duration_details` | ✅ Created |
| **WAGES** ||||
| 59 | `wagespaydetails` | `c3_wages_details` | ✅ Created |

---

## ❌ EXCLUDED TABLES (8 Tables)

| # | Legacy Table | Reason Excluded |
|---|--------------|-----------------|
| 1 | `Table` | Legacy placeholder (unused, 2 cols) |
| 2 | `Backup_Duplicates_202510` | Backup data only |
| 3 | `PROCESS_C3Header_Backup` | Backup data only |
| 4 | `Process_Contributions_Backup` | Backup data only |
| 5 | `PROCESS_Self_EmployedC3_Backup` | Backup data only |
| 6 | `TestOnlinePayments` | Test data only |
| 7 | `c3_regn_202508041057` | Registration backup |
| 8 | `ErrorLog` | Empty (0 rows), using CustomErrorLogs |

---

## 📊 LEGACY TABLE COUNT RECONCILIATION

| Category | Legacy Count | Optimised Count | Excluded |
|----------|--------------|-----------------|----------|
| Total Tables | 66 | 58 | 8 |
| Backup/Test Tables | 8 | 0 | 8 |
| Production Tables | 58 | 58 | 0 |

---

## 🔄 KEY COLUMN MAPPINGS

### Users Table (`secusers` → `c3_users`)

| Legacy Column | Optimised Column | Notes |
|--------------|------------------|-------|
| `userid` | `id` + `legacy_id` | SERIAL PK, legacy_id stores old value |
| `loginid` | `username` | Clearer naming |
| `password` | `password_hash` | More descriptive |
| `emailid` | `email` | Standard naming |
| `roleid` | `role_id` | FK to c3_roles |
| `companyid` | `company_id` | FK to c3_companies |
| `isactive` (bit) | `is_deleted` (boolean) | Inverted logic |
| `insertedon` | `created_at` | Standard naming |
| `updatedon` | `updated_at` | Standard naming |

### Employees Table (`masteremployee` → `c3_employees`)

| Legacy Column | Optimised Column | Notes |
|--------------|------------------|-------|
| `employeeid` | `id` + `legacy_id` | SERIAL PK |
| `companyid` | `company_id` | FK to c3_companies |
| `soc_sec_num` | `social_security_number` | Full name |
| `first_name` | `first_name` | Same |
| `last_name` | `last_name` | Same |
| `birthdate` | `date_of_birth` | Standard naming |
| `appint_date` | `hire_date` | Clearer |
| `isactive` | `is_deleted` | Inverted |
| `isemployeedirector` | `is_director` | Shorter |
| `isdirectoronly` | `is_director_only` | Same meaning |
| `islevyexempt` | `is_levy_exempt` | Same meaning |

### C3 Headers (`process_c3header` → `c3_contribution_headers`)

| Legacy Column | Optimised Column | Notes |
|--------------|------------------|-------|
| `c3headerid` | `id` + `legacy_id` | SERIAL PK |
| `employerid` | `company_id` | FK to c3_companies |
| `periodd_month` | `period_month` | Fixed typo |
| `period_year` | `period_year` | Same |
| `is_fianalize` | `is_finalized` | Fixed typo |
| `is_submitted` | `is_submitted` | Same |
| `fordirector` | `is_for_director` | Clearer |

---

## 📊 IMPROVEMENTS MADE

### 1. Naming Convention
- ✅ All tables have `c3_` prefix
- ✅ All names use `snake_case`
- ✅ No mixed casing
- ✅ Fixed typos (`fianalize` → `finalized`, `periodd` → `period`)

### 2. Data Types
- ✅ `bit` → `BOOLEAN`
- ✅ `datetime` → `TIMESTAMPTZ`
- ✅ `nvarchar` → `VARCHAR` or `TEXT`
- ✅ Proper `NUMERIC(18,2)` for money

### 3. Audit Columns (Standardised)
Every table now has:
- `created_at TIMESTAMPTZ DEFAULT NOW()`
- `created_by INTEGER`
- `updated_at TIMESTAMPTZ DEFAULT NOW()`
- `updated_by INTEGER`
- `is_deleted BOOLEAN DEFAULT FALSE`

### 4. Foreign Keys
- ✅ Proper FK constraints with references
- ✅ ON DELETE CASCADE where appropriate
- ✅ Self-referencing FKs for hierarchies

### 5. Indexes
- ✅ All PKs indexed automatically
- ✅ FKs indexed for join performance
- ✅ Search columns indexed (email, SSN, etc.)
- ✅ Date columns indexed for filtering

---

## 🚀 NEXT STEPS: DATA MIGRATION

### Step 1: Legacy ID Mapping
Each optimised table has a `legacy_id` column to store the original ID from the legacy table. This enables:
- Traceability back to source data
- Migration verification
- Rollback if needed

### Step 2: Data Transformation Scripts
SQL scripts needed:
```sql
-- Example: Migrate users
INSERT INTO optimised_c3wizard.c3_users (
    username, email, password_hash, role_id, user_type,
    is_deleted, created_at, legacy_id
)
SELECT 
    loginid,
    emailid,
    password,
    roleid,
    CASE 
        WHEN isselfemployed = '1' THEN 'SELF_EMPLOYED'
        WHEN roleid = 1 THEN 'ADMIN'
        ELSE 'EMPLOYER'
    END,
    CASE WHEN isactive = '0' THEN TRUE ELSE FALSE END,
    insertedon,
    userid
FROM public.secusers;
```

### Step 3: Verification Queries
```sql
-- Verify row counts match
SELECT 
    (SELECT COUNT(*) FROM public.secusers) as legacy_count,
    (SELECT COUNT(*) FROM optimised_c3wizard.c3_users) as optimised_count;
```

---

## ⚠️ NOTES

1. **RLS Not Yet Enabled**: New tables don't have RLS yet - will add when ready
2. **`optimised_c3wizard` Schema**: Tables are in separate schema, not affecting `public`
3. **Legacy Data Untouched**: All data in `public` schema remains intact
4. **After Verification**: Will rename schemas as planned

---

## ✅ SCHEMA TRANSITION COMPLETE

**Last Updated**: January 30, 2026  
**Status**: ✅ Schema renamed (legacy ↔ public swap), ✅ Data migration complete, ✅ Gap analysis resolved, 🔄 Hook refactoring in progress

### Schema Transition (January 30, 2026)
- `public` schema renamed to `legacy` (67 tables)
- `optimised_c3wizard` tables moved to `public` (59 tables with `c3_` prefix)
- Application hooks being refactored to use new optimised table names

### Migration Summary

| Category | Tables | Total Records |
|----------|--------|---------------|
| Users & Auth | 6 | 5,320 |
| Companies & Employees | 4 | 80,682 |
| C3 Contributions | 3 | 64,779 |
| Payments & Reconciliation | 4 | 231 |
| Audit & Logs | 4 | 35,987 |
| Configuration | 10 | 210 |
| Bonus/Holiday | 3 | 1,752 |
| Codes & Misc | 5 | 8 |
| Temp Registrations | 1 | 887 |
| **TOTAL** | **58** | **~190,000** |

### Gap Analysis & Fixes Applied (January 30, 2026)

| Issue | Status | Action Taken |
|-------|--------|--------------|
| c3_contribution_details duplicates | ✅ FIXED | Removed 6,154 duplicate rows |
| c3_security_questions count | ✅ CORRECT | 990→1976 is expected (2 questions split) |
| c3_user_profiles count | ✅ CORRECT | 32 orphan profiles correctly excluded |
| c3_temp_registrations missing | ✅ FIXED | Migrated 887 rows |
| Empty tables | ✅ CORRECT | Legacy tables also empty |

### Idempotency Constraints Added

Unique constraints on `legacy_id` added to 27 core tables to prevent duplicate insertions on future ETL runs:
- Core: `c3_users`, `c3_companies`, `c3_employees`
- Contributions: `c3_contribution_headers`, `c3_contribution_details`, `c3_self_employed_contributions`
- Financial: `c3_employee_deductions`, `c3_employee_incomes`, `c3_employee_obligations`
- Payments: `c3_payments`, `c3_bonus_payments`, `c3_holiday_payments`
- Audit: `c3_audit_logs`, `c3_login_logs`, `c3_error_logs`, `c3_exception_logs`
- Config: `c3_roles`, `c3_modules`, `c3_system_rates`, `c3_levy_tiers`, `c3_levy_allowances`, `c3_wage_categories`
- Other: `c3_self_employed`, `c3_user_profiles`, `c3_user_permissions`, `c3_countries`, `c3_holiday_pay_dates`, `c3_contact_logs`

### Notes
- Row counts now match 1:1 between legacy and optimised schemas
- Empty legacy tables (states, payroll, timecards) result in empty optimised tables
- All records have `legacy_id` for traceability back to original data
