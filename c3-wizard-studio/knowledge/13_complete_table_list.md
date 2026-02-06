# 13. Complete Database Table Reference (LEGACY NAMES)

**Document Version**: 3.0  
**Last Updated**: January 28, 2026  
**Purpose**: Complete list of all 66 production MS SQL tables - **USE EXACT NAMES AS-IS**

---

## 🚨 CRITICAL: KEEP ALL NAMES EXACTLY AS SHOWN

**DO NOT** rename tables or fields. Use the exact names from the legacy MS SQL database.

---

## Production MS SQL Table Inventory (66 Tables)

### Table Statistics from Production

| # | Table Name (USE EXACT) | Columns | Row Count | Category |
|---|------------------------|---------|-----------|----------|
| 1 | `AboutUs` | 2 | 1 | CMS/Content |
| 2 | `AuditLogs` | 21 | 23,337 | Audit/Logs |
| 3 | `Backup_Duplicates_202510` | 44 | 47 | Backup |
| 4 | `BankPaymentsMain` | 7 | 0 | Payment |
| 5 | `BonusPayDetails` | 17 | 78 | Wages & Bonus |
| 6 | `c3_regn_202508041057` | 38 | 887 | Backup |
| 7 | `City` | 12 | 1 | Lookup/Reference |
| 8 | `ContactUs_Log` | 8 | 1 | Audit/Logs |
| 9 | `Country` | 11 | 2 | Lookup/Reference |
| 10 | `CustomErrorLogs` | 7 | 8,416 | Audit/Logs |
| 11 | `DECEMBER_BONUS_EXEMPTED_CONTRIBUTION` | 15 | 6 | Rate/Config |
| 12 | `Deductions_Tax_Table_Details` | 10 | 65 | Rate/Config |
| 13 | `Deductions_Tax_Table_Header` | 22 | 5 | Rate/Config |
| 14 | `EmployeeTCard_Details` | 11 | 0 | Time Card |
| 15 | `EmployeeTCard_Header` | 9 | 0 | Time Card |
| 16 | `EmployeeWorkDurationDetails` | 17 | 0 | Time Card |
| 17 | `ErrorLog` | 6 | 0 | Audit/Logs |
| 18 | `Exception_log` | 11 | 0 | Audit/Logs |
| 19 | `HolidayPayDates` | 6 | 1,168 | Wages & Bonus |
| 20 | `LoginLog` | 10 | 4,218 | Audit/Logs |
| 21 | `Master_Rate_Setting` | 16 | 3 | Rate/Config |
| 22 | `MasterCompany` | 30 | 970 | Company/Employee |
| 23 | `MasterDeductionCodes` | 17 | 3 | Income/Deduction Setup |
| 24 | `MasterEmployee` | 47 | 9,145 | Company/Employee |
| 25 | `MasterEmployeeDeductions` | 20 | 22,485 | Income/Deduction Setup |
| 26 | `MasterEmployeeIncomes` | 18 | 10,856 | Income/Deduction Setup |
| 27 | `MasterEmployeeObligations` | 17 | 37,475 | Income/Deduction Setup |
| 28 | `MasterEmployerCodes` | 11 | 0 | Company/Employee |
| 29 | `MasterEmpType` | 10 | 3 | Company/Employee |
| 30 | `MasterHolidayPayDetails` | 18 | 506 | Wages & Bonus |
| 31 | `MasterIncCodes` | 20 | 0 | Income/Deduction Setup |
| 32 | `MasterObligationCodes` | 10 | 5 | Income/Deduction Setup |
| 33 | `NWD_Master_Rate_Settings` | 9 | 0 | Rate/Config |
| 34 | `OnlinePayments` | 60 | 35 | Payment |
| 35 | `Payroll_Process_Details` | 14 | 0 | Payroll |
| 36 | `Payroll_Process_Header` | 21 | 0 | Payroll |
| 37 | `PROCESS_C3Header` | 46 | 3,337 | C3 Form/Contribution |
| 38 | `PROCESS_C3Header_Backup` | 47 | 2 | Backup |
| 39 | `Process_Contributions` | 44 | 59,591 | C3 Form/Contribution |
| 40 | `Process_Contributions_Backup` | 45 | 2 | Backup |
| 41 | `Process_PayDeductions` | 12 | 0 | Payroll |
| 42 | `Process_PayEmployee` | 34 | 0 | Payroll |
| 43 | `Process_PayIncomes` | 14 | 0 | Payroll |
| 44 | `Process_Payobligations` | 12 | 0 | Payroll |
| 45 | `PROCESS_Self_EmployedC3` | 51 | 41 | C3 Form/Contribution |
| 46 | `PROCESS_Self_EmployedC3_Backup` | 52 | 1 | Backup |
| 47 | `Reconciliation_Cyber_Space` | 61 | 7 | Payment |
| 48 | `Reconciliation_Cyber_Space_Column` | 6 | 180 | Payment |
| 49 | `ReconciliationPayment_Details` | 9 | 0 | Payment |
| 50 | `SECModule` | 17 | 66 | Auth/Security |
| 51 | `SECRole` | 12 | 12 | Auth/Security |
| 52 | `SecurityQuestionAnswer` | 17 | 990 | Auth/Security |
| 53 | `SECUserModule` | 27 | 239 | Auth/Security |
| 54 | `SECUsers` | 31 | 1,025 | Auth/Security |
| 55 | `SECUsersProfile` | 13 | 1,057 | Auth/Security |
| 56 | `Self_Employed_Settings` | 5 | 8 | Rate/Config |
| 57 | `SelfEmployee` | 46 | 21 | Company/Employee |
| 58 | `SiteSettings` | 13 | 2 | Rate/Config |
| 59 | `State` | 12 | 0 | Lookup/Reference |
| 60 | `Table` | 2 | N/A | Legacy (unused) |
| 61 | `TestOnlinePayments` | 42 | 4 | Testing |
| 62 | `UserCardDetail` | 10 | 3 | Payment |
| 63 | `UserOtp` | 6 | 0 | Auth/Security |
| 64 | `UserPermission` | 5 | 855 | Auth/Security |
| 65 | `WageCategories` | 8 | 112 | Wages & Bonus |
| 66 | `WagesPayDetails` | 17 | 0 | Wages & Bonus |

### Summary by Category

| Category | Table Count | Total Rows |
|----------|-------------|------------|
| Auth/Security | 10 | ~4,244 |
| Company/Employee | 5 | ~10,139 |
| Income/Deduction Setup | 6 | ~70,824 |
| C3 Form/Contribution | 3 | ~62,969 |
| Rate/Config | 7 | ~24 |
| Payroll | 6 | 0 |
| Wages & Bonus | 5 | ~1,864 |
| Time Card | 3 | 0 |
| Lookup/Reference | 3 | ~3 |
| Audit/Logs | 5 | ~35,972 |
| Payment | 6 | ~225 |
| CMS/Content | 1 | 1 |
| Backup | 5 | ~939 |
| **TOTAL** | **66** | **~187,000** |

---

## Core Tables to Migrate (Priority Order)

### Phase 1: Auth & Users
| Table | Purpose | Rows |
|-------|---------|------|
| `SECUsers` | User accounts | 1,025 |
| `SECUsersProfile` | User profiles | 1,057 |
| `SECRole` | Role definitions | 12 |
| `SECModule` | System modules | 66 |
| `SECUserModule` | User-module permissions | 239 |
| `UserPermission` | Granular permissions | 855 |

### Phase 2: Companies & Employees
| Table | Purpose | Rows |
|-------|---------|------|
| `MasterCompany` | Company records | 970 |
| `MasterEmployee` | Employee records | 9,145 |
| `SelfEmployee` | Self-employed profiles | 21 |
| `MasterEmpType` | Employee types | 3 |

### Phase 3: Rates & Configuration
| Table | Purpose | Rows |
|-------|---------|------|
| `Master_Rate_Setting` | Contribution rates | 3 |
| `Deductions_Tax_Table_Header` | Tax table headers | 5 |
| `Deductions_Tax_Table_Details` | Levy tier details | 65 |
| `WageCategories` | Wage categories | 112 |
| `Self_Employed_Settings` | Self-employed config | 8 |
| `DECEMBER_BONUS_EXEMPTED_CONTRIBUTION` | Dec bonus rules | 6 |

### Phase 4: C3 Contributions
| Table | Purpose | Rows |
|-------|---------|------|
| `PROCESS_C3Header` | C3 form headers | 3,337 |
| `Process_Contributions` | C3 form details | 59,591 |
| `PROCESS_Self_EmployedC3` | Self-employed C3s | 41 |

### Phase 5: Payments
| Table | Purpose | Rows |
|-------|---------|------|
| `OnlinePayments` | Payment transactions | 35 |
| `BankPaymentsMain` | Bank payments | 0 |
| `UserCardDetail` | Saved cards | 3 |

### Phase 6: Audit & Logs
| Table | Purpose | Rows |
|-------|---------|------|
| `AuditLogs` | Audit trail | 23,337 |
| `LoginLog` | Login history | 4,218 |
| `CustomErrorLogs` | Error logs | 8,416 |

---

## Tables NOT to Migrate

| Table | Reason |
|-------|--------|
| `Table` | Legacy placeholder (unused) |
| `*_Backup` tables | Backup data only |
| `TestOnlinePayments` | Test data only |
| `c3_regn_202508041057` | Registration backup |
| `ErrorLog` | Empty, use CustomErrorLogs |
| `Exception_log` | Empty |

---

## Data Type Mapping (MS-SQL → PostgreSQL)

| MS-SQL Type | PostgreSQL Type | Notes |
|-------------|-----------------|-------|
| `INT` | `INTEGER` | 32-bit integer |
| `BIGINT` | `BIGINT` | 64-bit integer |
| `BIT` | `BOOLEAN` | TRUE/FALSE |
| `VARCHAR(n)` | `VARCHAR(n)` | Variable character |
| `NVARCHAR(n)` | `TEXT` | UTF-8 default in PG |
| `DATETIME` | `TIMESTAMP WITH TIME ZONE` | Date + time |
| `SMALLDATETIME` | `TIMESTAMP WITH TIME ZONE` | Date + time |
| `DATE` | `DATE` | Date only |
| `DECIMAL(p,s)` | `NUMERIC(p,s)` | Fixed precision |
| `FLOAT` | `NUMERIC(18,4)` | Avoid FLOAT |
| `MONEY` | `NUMERIC(18,2)` | Currency |
| `NVARCHAR(MAX)` | `TEXT` | Large text |
| `IMAGE` / `NTEXT` | `TEXT` | Legacy types |

---

## ⚠️ FIELD NAME REMINDER

**DO NOT RENAME FIELDS**. Keep exact names from legacy:

```
CompanyId (NOT company_id)
EmployeeID (NOT employee_id)
Soc_Sec_Num (NOT ssn)
First_Name (NOT first_name)
BirthDate (NOT birth_date)
InsertedOn (NOT created_at)
UpdatedOn (NOT updated_at)
InsertedBy (NOT created_by)
IsActive (NOT is_active)
```

---

## Key Migration Metrics

| Metric | Value |
|--------|-------|
| **Total Production Records** | ~187,000 |
| **Companies (MasterCompany)** | 970 |
| **Employees (MasterEmployee)** | 9,145 |
| **Self-Employed (SelfEmployee)** | 21 |
| **Users (SECUsers)** | 1,025 |
| **C3 Headers (PROCESS_C3Header)** | 3,337 |
| **C3 Details (Process_Contributions)** | 59,591 |
| **Payments (OnlinePayments)** | 35 |
| **Audit Logs (AuditLogs)** | 23,337 |
| **Login History (LoginLog)** | 4,218 |

---

**Last Updated**: January 28, 2026  
**Production Data Source**: SSB.Production database  
**Total Column Count**: ~1,000+ columns across 66 tables

---

## 🔑 NEW SUPABASE-ONLY TABLE

For RLS to work, we need ONE new table:

```sql
-- Role management for Supabase RLS
CREATE TYPE app_role AS ENUM ('admin', 'employer', 'self_employed');

CREATE TABLE user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role app_role NOT NULL,
  UNIQUE (user_id, role)
);
```

This is the ONLY new table. All other tables use legacy names exactly.
