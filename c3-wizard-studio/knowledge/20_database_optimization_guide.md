# 20. Migration Naming Convention Guide

**Document Version**: 3.0  
**Last Updated**: January 28, 2026  
**Purpose**: Naming convention for migrating MS SQL to Supabase with consistent `c3_` prefix and snake_case

---

## 🎯 NAMING CONVENTION RULES

### Tables: `c3_` prefix + snake_case of original name

```
MS SQL Table Name       → PostgreSQL Table Name
----------------------------------------------------
MasterCompany          → c3_master_company
MasterEmployee         → c3_master_employee
PROCESS_C3Header       → c3_process_c3_header
Process_Contributions  → c3_process_contributions
SECUsers               → c3_sec_users
OnlinePayments         → c3_online_payments
Master_Rate_Setting    → c3_master_rate_setting
SelfEmployee           → c3_self_employee
```

### Fields: snake_case of original name (NO renaming the meaning)

```
MS SQL Field Name      → PostgreSQL Field Name
----------------------------------------------------
CompanyId              → company_id
EmployeeID             → employee_id
Soc_Sec_Num           → soc_sec_num
First_Name            → first_name
BirthDate             → birth_date
InsertedOn            → inserted_on
UpdatedOn             → updated_on
IsActive              → is_active
```

---

## ✅ KEY PRINCIPLES

1. **Tables get `c3_` prefix** - Every table starts with `c3_`
2. **snake_case everywhere** - Both tables and fields use snake_case
3. **Keep original meaning** - Don't rename `Soc_Sec_Num` to `ssn`, just convert to `soc_sec_num`
4. **Preserve data structure** - Same columns, same relationships

---

## ❌ WHAT NOT TO DO

### DON'T Change Field Meanings
```sql
-- ❌ WRONG: Changing the meaning
soc_sec_num → ssn  -- Don't rename to different word!
First_Name → fname  -- Keep original meaning!

-- ✅ CORRECT: Just convert case
Soc_Sec_Num → soc_sec_num
First_Name → first_name
```

### DON'T Keep Mixed Case
```sql
-- ❌ WRONG: Mixed case
CompanyId, company_Id, COMPANYID

-- ✅ CORRECT: Consistent snake_case
company_id
```

### DON'T Consolidate Tables
```sql
-- ❌ WRONG: Merging multiple tables
CREATE TABLE c3_payroll (incomes JSONB, deductions JSONB);

-- ✅ CORRECT: Keep separate tables with c3_ prefix
CREATE TABLE c3_payroll_process_header (...);
CREATE TABLE c3_payroll_process_details (...);
CREATE TABLE c3_process_pay_employee (...);
```

---

## 📋 DATA TYPE MAPPING

| MS SQL Type | PostgreSQL Type | Notes |
|-------------|-----------------|-------|
| `INT` | `INTEGER` | Direct conversion |
| `BIGINT` | `BIGINT` | Direct conversion |
| `BIT` | `BOOLEAN` | TRUE/FALSE |
| `VARCHAR(n)` | `VARCHAR(n)` | Same |
| `NVARCHAR(n)` | `TEXT` | UTF-8 default in PG |
| `DATETIME` | `TIMESTAMP WITH TIME ZONE` | Date + time |
| `DATE` | `DATE` | Same |
| `DECIMAL(p,s)` | `NUMERIC(p,s)` | Same precision |
| `MONEY` | `NUMERIC(18,2)` | Currency |

---

## 📋 COMPLETE TABLE NAME MAPPING

| # | MS SQL Name | PostgreSQL Name |
|---|-------------|-----------------|
| 1 | `AboutUs` | `c3_about_us` |
| 2 | `AuditLogs` | `c3_audit_logs` |
| 3 | `BankPaymentsMain` | `c3_bank_payments_main` |
| 4 | `BonusPayDetails` | `c3_bonus_pay_details` |
| 5 | `City` | `c3_city` |
| 6 | `ContactUs_Log` | `c3_contact_us_log` |
| 7 | `Country` | `c3_country` |
| 8 | `CustomErrorLogs` | `c3_custom_error_logs` |
| 9 | `DECEMBER_BONUS_EXEMPTED_CONTRIBUTION` | `c3_december_bonus_exempted_contribution` |
| 10 | `Deductions_Tax_Table_Details` | `c3_deductions_tax_table_details` |
| 11 | `Deductions_Tax_Table_Header` | `c3_deductions_tax_table_header` |
| 12 | `EmployeeTCard_Details` | `c3_employee_t_card_details` |
| 13 | `EmployeeTCard_Header` | `c3_employee_t_card_header` |
| 14 | `EmployeeWorkDurationDetails` | `c3_employee_work_duration_details` |
| 15 | `ErrorLog` | `c3_error_log` |
| 16 | `Exception_log` | `c3_exception_log` |
| 17 | `HolidayPayDates` | `c3_holiday_pay_dates` |
| 18 | `LoginLog` | `c3_login_log` |
| 19 | `Master_Rate_Setting` | `c3_master_rate_setting` |
| 20 | `MasterCompany` | `c3_master_company` |
| 21 | `MasterDeductionCodes` | `c3_master_deduction_codes` |
| 22 | `MasterEmployee` | `c3_master_employee` |
| 23 | `MasterEmployeeDeductions` | `c3_master_employee_deductions` |
| 24 | `MasterEmployeeIncomes` | `c3_master_employee_incomes` |
| 25 | `MasterEmployeeObligations` | `c3_master_employee_obligations` |
| 26 | `MasterEmployerCodes` | `c3_master_employer_codes` |
| 27 | `MasterEmpType` | `c3_master_emp_type` |
| 28 | `MasterHolidayPayDetails` | `c3_master_holiday_pay_details` |
| 29 | `MasterIncCodes` | `c3_master_inc_codes` |
| 30 | `MasterObligationCodes` | `c3_master_obligation_codes` |
| 31 | `NWD_Master_Rate_Settings` | `c3_nwd_master_rate_settings` |
| 32 | `OnlinePayments` | `c3_online_payments` |
| 33 | `Payroll_Process_Details` | `c3_payroll_process_details` |
| 34 | `Payroll_Process_Header` | `c3_payroll_process_header` |
| 35 | `PROCESS_C3Header` | `c3_process_c3_header` |
| 36 | `Process_Contributions` | `c3_process_contributions` |
| 37 | `Process_PayDeductions` | `c3_process_pay_deductions` |
| 38 | `Process_PayEmployee` | `c3_process_pay_employee` |
| 39 | `Process_PayIncomes` | `c3_process_pay_incomes` |
| 40 | `Process_Payobligations` | `c3_process_pay_obligations` |
| 41 | `PROCESS_Self_EmployedC3` | `c3_process_self_employed_c3` |
| 42 | `Reconciliation_Cyber_Space` | `c3_reconciliation_cyber_space` |
| 43 | `Reconciliation_Cyber_Space_Column` | `c3_reconciliation_cyber_space_column` |
| 44 | `ReconciliationPayment_Details` | `c3_reconciliation_payment_details` |
| 45 | `SECModule` | `c3_sec_module` |
| 46 | `SECRole` | `c3_sec_role` |
| 47 | `SecurityQuestionAnswer` | `c3_security_question_answer` |
| 48 | `SECUserModule` | `c3_sec_user_module` |
| 49 | `SECUsers` | `c3_sec_users` |
| 50 | `SECUsersProfile` | `c3_sec_users_profile` |
| 51 | `Self_Employed_Settings` | `c3_self_employed_settings` |
| 52 | `SelfEmployee` | `c3_self_employee` |
| 53 | `SiteSettings` | `c3_site_settings` |
| 54 | `State` | `c3_state` |
| 55 | `UserCardDetail` | `c3_user_card_detail` |
| 56 | `UserOtp` | `c3_user_otp` |
| 57 | `UserPermission` | `c3_user_permission` |
| 58 | `WageCategories` | `c3_wage_categories` |
| 59 | `WagesPayDetails` | `c3_wages_pay_details` |

---

## 🆕 SUPABASE-ONLY TABLES

These tables are NEW (for Supabase RLS) and use same convention:

| New Table | Purpose |
|-----------|---------|
| `user_roles` | Supabase RLS role management |
| `app_role` (enum) | Role type enum |

```sql
CREATE TYPE app_role AS ENUM ('admin', 'employer', 'self_employed');

CREATE TABLE user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role app_role NOT NULL,
  UNIQUE (user_id, role)
);
```

---

## 💡 SUMMARY

| Aspect | Rule |
|--------|------|
| Table Names | `c3_` + snake_case of original (e.g., `c3_master_employee`) |
| Field Names | snake_case of original (e.g., `company_id`) |
| Data Types | Convert MS SQL → PostgreSQL |
| Meaning | Keep SAME meaning, just change case |

---

**Last Updated**: January 28, 2026  
**Status**: Active naming convention guide
