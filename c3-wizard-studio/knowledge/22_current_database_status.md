# 22. Current Database Status & Future Optimization Plan

**Document Version**: 1.0  
**Last Updated**: January 29, 2026  
**Purpose**: Document the current database state and future optimization plans

---

## 🚨 CURRENT STATUS (January 2026)

### Database Structure: Exact MS SQL Replica

Due to time constraints, the current Supabase database is an **exact lowercase replica** of the MS SQL legacy database:

```
MS SQL Table Name       → Supabase Table Name (lowercase)
------------------------------------------------------------
MasterCompany          → mastercompany
MasterEmployee         → masteremployee
PROCESS_C3Header       → process_c3header
Process_Contributions  → process_contributions
SECUsers               → secusers
OnlinePayments         → onlinepayments
Master_Rate_Setting    → master_rate_setting
SelfEmployee           → selfemployee
```

### Column Names: Lowercase with Original Structure

```
MS SQL Column Name     → Supabase Column Name (lowercase)
------------------------------------------------------------
CompanyId              → companyid
EmployeeID             → employeeid
Soc_Sec_Num           → soc_sec_num
First_Name            → first_name
InsertedOn            → insertedon
IsActive              → isactive
```

---

## ✅ Production Data Migrated

| Table                 | Row Count | Status          |
| --------------------- | --------- | --------------- |
| masteremployee        | 9,145     | ✅ Migrated     |
| mastercompany         | 970       | ✅ Migrated     |
| process_c3header      | 3,339     | ✅ Migrated     |
| process_contributions | 59,591    | ✅ Migrated     |
| secusers              | 1,025     | ✅ Migrated     |
| onlinepayments        | 35        | ✅ Migrated     |
| **Total Tables**      | 66        | ✅ All migrated |

---

## 🔮 FUTURE OPTIMIZATION PLAN

**The user plans to optimize the database structure in the future.**

### Proposed Changes (NOT YET IMPLEMENTED):

1. **Table naming**: May add `c3_` prefix and proper snake_case
2. **Column naming**: May standardize to proper snake_case
3. **Schema optimization**: May consolidate related tables
4. **Index optimization**: May add performance indexes
5. **Foreign keys**: May add proper relationships

### When Optimization Will Happen:

- **Phase 1**: Build complete application functionality (CURRENT)
- **Phase 2**: Test all features with production data
- **Phase 3**: Optimize database structure (FUTURE)
- **Phase 4**: Update application code to match (FUTURE)

---

## 🎯 FOR LOVABLE AI

### Current Implementation Rules:

1. **Use lowercase table names**: `masteremployee`, NOT `MasterEmployee`
2. **Use lowercase column names**: `employeeid`, NOT `EmployeeID`
3. **Types mismatch**: The `types.ts` may have different casing - use raw SQL if needed
4. **Don't refactor database**: Build features with current structure first
5. **Document any issues**: Note problems for future optimization phase

### Table Name Reference:

| Feature         | Use This Table                 |
| --------------- | ------------------------------ |
| Employees       | `masteremployee`               |
| Companies       | `mastercompany`                |
| C3 Headers      | `process_c3header`             |
| C3 Details      | `process_contributions`        |
| Users           | `secusers`                     |
| Payments        | `onlinepayments`               |
| Rates           | `master_rate_setting`          |
| Self-Employed   | `selfemployee`                 |
| Self-Emp C3     | `process_self_employedc3`      |
| Levy Tiers      | `deductions_tax_table_details` |
| Wage Categories | `wagecategories`               |
| Audit Logs      | `auditlogs`                    |
| Login History   | `loginlog`                     |

---

## ⚠️ TYPES.TS MISMATCH

The auto-generated `types.ts` file may have PascalCase table names that don't match the actual database. When this happens:

1. **Don't manually edit types.ts** (it's auto-generated)
2. **Use raw SQL queries** if Supabase client doesn't work
3. **Request types regeneration** if needed
4. **Or wait for database optimization** phase

---

**Last Updated**: January 29, 2026  
**Status**: Active development with legacy schema
