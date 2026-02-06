# 🗺️ DATABASE FIRST APPROACH - Complete Migration Mapping

**CRITICAL DOCUMENT**: Field-by-field mapping from MS SQL to Optimized Supabase Schema

**Date**: January 23, 2026  
**Purpose**: Guide database creation and data migration with ZERO data loss  
**Status**: Production-Ready Reference

---

## 🎯 APPROACH OVERVIEW

### **Your Smart Strategy**: ✅ CORRECT!

```
Step 1: CREATE optimized Supabase database FIRST (with Lovable)
Step 2: MIGRATE data from MS SQL to Supabase (using this mapping)
Step 3: VALIDATE everything matches
Step 4: BUILD screens on top of good database
```

**Why This Works**:
- ✅ Good database = Easy screen development
- ✅ Optimized from day 1
- ✅ Migration mapping handles schema differences
- ✅ Can test migration before building UI

---

## 📊 SCHEMA DIFFERENCES (Old → New)

### **Optimization Changes**:

| Change Type | Old (MS SQL) | New (Supabase) | Why |
|-------------|--------------|----------------|-----|
| **Naming** | `SECUsers`, `MasterCompany`, `PROCESS_C3Header` | `c3_users`, `c3_companies`, `c3_contribution_headers` | Consistent `snake_case` + `c3_` prefix |
| **Data Types** | `IDENTITY(1,1)`, `nvarchar(50)`, `smalldatetime` | `SERIAL`, `TEXT`, `TIMESTAMP` | PostgreSQL standard types |
| **Audit** | Partial (some tables missing) | ALL tables have full audit | Consistent audit pattern |
| **Soft Delete** | `IsActive` (bit) | `is_deleted` (boolean) | Clearer semantics |
| **Foreign Keys** | Some missing | Proper constraints | Data integrity  |

---

## 🗂️ TABLE-BY-TABLE MAPPING

### **1. USERS** 🔑 **CRITICAL**

**MS SQL**: `SECUsers` (27 fields)  
**Supabase**: `c3_users` (optimized structure)

| Old Field (MS SQL) | New Field (Supabase) | Type Change | Transformation Rule | Notes |
|-------------------|---------------------|-------------|---------------------|-------|
| `UserId` | `id` | IDENTITY → SERIAL | Direct copy (becomes id) | Primary key |
| `FirstName` | `first_name` | nvarchar(50) → TEXT | Direct copy | - |
| `LastName` | `last_name` | nvarchar(50) → TEXT | Direct copy | - |
| `MiddleName` | `middle_name` | nvarchar(50) → TEXT | Direct copy | - |
| `LoginId` | `username` | nvarchar(50) → TEXT | Direct copy | Unique |
| `Password` | `password_hash` | nvarchar(200) → TEXT | Direct copy (already hashed) | Keep existing hash |
| `EmailId` | `email` | nvarchar(100) → TEXT | Direct copy | - |
| `RoleId` | `role` | int → TEXT | **TRANSFORM**: 1→'admin', 2→'employer', 3→'self_employed' | Map role IDs |
| `IsSelfEmployee` | `is_self_employed` | bit → BOOLEAN | Direct copy | - |
| `parentuserid` | `company_id` | int → INTEGER | Direct copy (for employers) | NULL for self-employed |
| `REG_NUMBER` | `registration_number` | nvarchar(100) → TEXT | Direct copy | Company reg # |
| `token` | `verification_token` | nvarchar(100) → TEXT | Direct copy | Email verification |
| `userstts` | `status` | nvarchar(3) → TEXT | Direct copy ('A'=active, 'I'=inactive) | - |
| `LastLoginTime` | `last_login_at` | datetime → TIMESTAMP | Direct copy | - |
| `Status` | `is_active` | bit → BOOLEAN | Direct copy | **NOT** is_deleted |
| `IsActive` | (part of `is_deleted`) | bit → BOOLEAN | **INVERT**: IsActive=1 → is_deleted=FALSE | Inverted logic |
| `InsertedBy` | `created_by` | int → INTEGER | Direct copy | - |
| `InsertedOn` | `created_at` | datetime → TIMESTAMP | Direct copy | - |
| `UpdatedBy` | `updated_by` | int → INTEGER | Direct copy | - |
| `UpdatedOn` | `updated_at` | datetime → TIMESTAMP | Direct copy | - |
| `UserImage` | `avatar_url` | nvarchar(MAX) → TEXT | Direct copy | - |
| **NEW** | `is_deleted` | - → BOOLEAN | **CALCULATE**: NOT IsActive | New field |
| **SKIP**: `EmpId`, `Department`, `IsLoggedIn`, etc. | - | - | Not needed in new schema | Deprecated fields |

**Migration Query Example**:
```sql
-- Extract from MS SQL
SELECT
  UserId,
  FirstName,
  LastName,
  MiddleName,
  LoginId,
  Password,
  EmailId,
  CASE RoleId 
    WHEN 1 THEN 'admin'
    WHEN 2 THEN 'employer'  
    WHEN 3 THEN 'self_employed'
  END AS role,
  IsSelfEmployee AS is_self_employed,
  parentuserid AS company_id,
  REG_NUMBER AS registration_number,
  token AS verification_token,
  userstts AS status,
  LastLoginTime AS last_login_at,
  Status AS is_active,
  CASE WHEN IsActive = 1 THEN FALSE ELSE TRUE END AS is_deleted,
  InsertedBy AS created_by,
  InsertedOn AS created_at,
  UpdatedBy AS updated_by,
  UpdatedOn AS updated_at,
  UserImage AS avatar_url
FROM SECUsers
WHERE IsActive = 1;  -- Only migrate active users
```

---

### **2. COMPANIES** 🏢

**MS SQL**: `MasterCompany` (26 fields)  
**Supabase**: `c3_companies`

| Old Field | New Field | Transformation |
|-----------|-----------|----------------|
| `Company_Id` | `id` | Direct copy |
| `Company_Name` | `company_name` | Direct copy |
| `Trade_Name` | `trade_name` | Direct copy |
| `REG_NUMBER` | `registration_number` | Direct copy |
| `Address1` | `address_line1` | Direct copy |
| `Address2` | `address_line2` | Direct copy |
| `City` | `city` | Direct copy |
| `State` | `state` | Direct copy |
| `ZIP` | `postal_code` | Direct copy |
| `Country` | `country` | Direct copy |
| `Mobile` | `phone_mobile` | Direct copy |
| `Landline` | `phone_landline` | Direct copy |
| `FAX` | `phone_fax` | Direct copy |
| `Contact_Person` | `contact_person_name` | Direct copy |
| `Email` | `email` | Direct copy |
| `CompanyLogo` | `logo_url` | Direct copy (ntext → TEXT) |
| `IsLevyExempt` | `is_levy_exempt` | Direct copy |
| `IsActive` | (invert to `is_deleted`) | INVERT |
| `InsertedBy` | `created_by` | Direct copy |
| `InsertedOn` | `created_at` | Direct copy |
| `UpdatedBy` | `updated_by` | Direct copy |
| `UpdatedOn` | `updated_at` | Direct copy |

---

### **3. EMPLOYEES** 👥 **LARGE TABLE - CRITICAL**

**MS SQL**: `MasterEmployee` (50 fields)  
**Supabase**: `c3_employees`

| Old Field | New Field | Transformation | Notes |
|-----------|-----------|----------------|-------|
| `EmployeeID` | `id` | Direct copy | Primary key |
| `Soc_Sec_Num` | `ssn` | Direct copy | Format: XXX-XX-XXXX |
| `First_Name` | `first_name` | Direct copy | - |
| `Middle_Name` | `middle_name` | Direct copy | - |
| `Last_Name` | `last_name` | Direct copy | - |
| `BirthDate` | `birth_date` | datetime → DATE | Extract date only |
| `Gender` | `gender` | Direct copy | 'M'/'F' |
| `Address1` | `address_line1` | Direct copy | - |
| `Address2` | `address_line2` | Direct copy | - |
| `City` | `city` | Direct copy | - |
| `State` | `state` | Direct copy | - |
| `Country` | `country` | Direct copy | - |
| `Zip` | `postal_code` | Direct copy | - |
| `Phone` | `phone` | Direct copy | - |
| `Mobile` | `mobile` | Direct copy | - |
| `Email` | `email` | Direct copy | - |
| `TIN` | `tin` | Direct copy | Tax ID |
| `Appint_Date` | `hire_date` | Direct copy | Appointment date |
| `Terminated` | `termination_date` | Direct copy | - |
| `Empl_Status` | `employment_status` | Direct copy | 'A'=Active, 'T'=Terminated |
| `Pay_Period` | `pay_period` | Direct copy | 'W', 'BW', 'M', etc. |
| `occupation` | `occupation` | Direct copy | - |
| `department` | `department` | Direct copy | - |
| `CompanyId` | `company_id` | Direct copy | Foreign key |
| `IsdirectorOnly` | `is_director_only` | Direct copy | Director flag |
| `isemployeeDirector` | `is_employee_director` | Direct copy | Employee + Director |
| `IsLevyExempt` | `is_levy_exempt` | Direct copy | Levy exemption |
| `IsActive` | (invert to `is_deleted`) | INVERT | - |
| `InsertedBy` | `created_by` | Direct copy | - |
| `InsertedOn` | `created_at` | Direct copy | - |
| `UpdatedBy` | `updated_by` | Direct copy | - |
| `UpdatedOn` | `updated_at` | Direct copy | - |

**Critical**:  
- ⚠️ This table likely has **THOUSANDS of records**
- ⚠️ Test migration with sample first
- ⚠️ Verify SSN format consistency
- ⚠️ Check for orphaned records (employees without company)

---

### **4. C3 HEADERS** 📋 **HISTORICAL DATA - CRITICAL**

**MS SQL**: `PROCESS_C3Header`  
**Supabase**: `c3_contribution_headers`

Need to find this table in SQL file. Let me search:

---

### **5. CONTRIBUTION RATES** ⚙️

**MS SQL**: `Master_Rate_Setting`  
**Supabase**: `c3_system_rates`

| Old Field | New Field | Transformation |
|-----------|-----------|----------------|
| `MRSId` | `id` | Direct copy |
| `Soc_EE_Rate` | `ss_employee_rate` | Direct copy (float → DECIMAL(5,4)) |
| `Soc_ER_Rate` | `ss_employer_rate` | Direct copy |
| `EIB` | `ei_employee_rate` | Direct copy |
| (EIB employer) | `ei_employer_rate` | **Same as EIB** (both 1%) |
| `SeveranceRate` | `pe_employee_rate` | Direct copy (PE = Severance) |
| (Severance ER) | `pe_employer_rate` | **Same as employee** |
| `EmployerLevy` | `employer_levy_rate` | Direct copy |
| `Bonus_Levy_EE_Rate` | (NOT USED) | **Replaced by progressive tiers** |
| `Min_Age` | `min_age_ss` | Direct copy (e.g., 16) |
| `Max_Age` | `max_age_ss` | Direct copy (e.g., 62) |
| `FromDate` | `effective_from` | Direct copy |
| `ToDate` | `effective_to` | Direct copy |

**IMPORTANT**: Old system had `Bonus_Levy_EE_Rate` - new system uses `c3_levy_tiers` table with progressive rates!

---

### **6. LEVY TIERS** 📊 **PROGRESSIVE CALCULATION**

**MS SQL**: `Deductions_Tax_Table_Details`  
**Supabase**: `c3_levy_tiers`

| Old Field | New Field | Transformation |
|-----------|-----------|----------------|
| `TaxTabID` | `id` | Direct copy |
| `Over_Amt` | `wage_from` | Direct copy (wage range start) |
| (Next row's Over_Amt) | `wage_to` | **Calculate**: Next tier's wage_from - 0.01 |
| `Tax_Rate` | `levy_rate` | Direct copy (as decimal, e.g., 0.01 for 1%) |
| `Tax_Year` | `tax_year` | Direct copy |
| `Order_No` | `tier_order` | Direct copy |

**Example Transformation**:
```sql
-- Old data (Deductions_Tax_Table_Details):
TaxTabID  Over_Amt  Tax_Rate  Order_No
1         0         0.00      1
2         500       0.01      2
3         1000      0.02      3
4         1500      0.03      4
5         2000      0.04      5
6         2500      0.05      6

-- New data (c3_levy_tiers):
id  wage_from  wage_to    levy_rate  tier_order
1   0          499.99     0.00       1
2   500        999.99     0.01       2
3   1000       1499.99    0.02       3
4   1500       1999.99    0.03       4
5   2000       2499.99    0.04       5
6   2500       999999.99  0.05       6  (last tier open-ended)
```

---

## 🔄 DATA TYPE CONVERSIONS

### **MS SQL → PostgreSQL Type Mapping**:

| MS SQL Type | PostgreSQL Type | Notes |
|-------------|-----------------|-------|
| `IDENTITY(1,1)` | `SERIAL` or `BIGSERIAL` | Auto-increment |
| `INT` | `INTEGER` | 4-byte integer |
| `BIGINT` | `BIGINT` | 8-byte integer |
| `BIT` | `BOOLEAN` | true/false |
| `NVARCHAR(n)` | `TEXT` or `VARCHAR(n)` | Use TEXT for flexibility |
| `VARCHAR(MAX)` | `TEXT` | Unlimited text |
| `DATETIME`, `SMALLDATETIME` | `TIMESTAMP` | With timezone |
| `DATE` | `DATE` | Date only |
| `DECIMAL(18,4)` | `DECIMAL(18,4)` | Same precision |
| `FLOAT` | `DECIMAL(5,4)` | **For rates**: Use DECIMAL for precision |
| `NTEXT` | `TEXT` | Large text |

---

## ⚠️ CRITICAL MIGRATION CHECKS

### **Before Migration**:
```sql
-- Check for NULL in required fields
SELECT COUNT(*) FROM SECUsers WHERE FirstName IS NULL;  -- Should be 0
SELECT COUNT(*) FROM MasterEmployee WHERE Soc_Sec_Num IS NULL;  -- Should be 0
SELECT COUNT(*) FROM MasterCompany WHERE REG_NUMBER IS NULL;  -- Should be 0
```

### **After Migration**:
```sql
-- Verify record counts match
SELECT 'MS SQL Users' AS source, COUNT(*) FROM SECUsers WHERE IsActive=1;
SELECT 'Supabase Users' AS source, COUNT(*) FROM c3_users WHERE is_deleted=FALSE;
-- MUST MATCH!

-- Verify relationships
SELECT COUNT(*) FROM c3_employees e
WHERE NOT EXISTS (SELECT 1 FROM c3_companies c WHERE c.id = e.company_id);
-- MUST BE 0 (no orphaned employees)
```

---

## 📋 MIGRATION SCRIPT STRUCTURE

```javascript
// migration/transform.js

const transformUser = (oldUser) => {
  return {
    id: oldUser.UserId,
    first_name: oldUser.FirstName,
    last_name: oldUser.LastName,
    middle_name: oldUser.MiddleName,
    username: oldUser.LoginId,
    password_hash: oldUser.Password,  // Already hashed
    email: oldUser.EmailId,
    role: mapRole(oldUser.RoleId),  // 1→'admin', 2→'employer', 3→'self_employed'
    is_self_employed: oldUser.IsSelfEmployee,
    company_id: oldUser.parentuserid,
    registration_number: oldUser.REG_NUMBER,
    verification_token: oldUser.token,
    status: oldUser.userstts,
    last_login_at: oldUser.LastLoginTime,
    is_active: oldUser.Status,
    is_deleted: !oldUser.IsActive,  // INVERTED
    created_by: oldUser.InsertedBy,
    created_at: oldUser.InsertedOn,
    updated_by: oldUser.UpdatedBy,
    updated_at: oldUser.UpdatedOn,
    avatar_url: oldUser.UserImage
  };
};

const mapRole = (roleId) => {
  const roleMap = {
    1: 'admin',
    2: 'employer',
    3: 'self_employed'
  };
  return roleMap[roleId] || 'employer';  // Default to employer
};
```

---

## ✅ VALIDATION CHECKLIST

**After creating mapping document**:
- [ ] Every old field mapped to new field (or documented as SKIP)
- [ ] Data type conversions documented
- [ ] Transformation rules clear
- [ ] Foreign key relationships preserved
- [ ] No hardcoded values (rates from DB)
- [ ] Test queries written
- [ ] Sample data transformation tested

**Before production migration**:
- [ ] Test migration on sample data (100 records each table)
- [ ] Verify all counts match
- [ ] Check all relationships intact
- [ ] Spot-check 20 random records manually
- [ ] Run validation queries
- [ ] Performance test (query speed)

---

## 🎯 NEXT STEPS FOR YOU, KALASH

### **Step 1: Review This Mapping** (30 min)
- Read through each table mapping
- Verify transformations make sense
- Flag any questions

### **Step 2: Create Supabase Database with Lovable** (2-3 days)
- Use optimized schema from knowledge files
- Let Lovable build tables
- Verify structure matches this mapping

### **Step 3: Write Migration Scripts** (Week 2)
- Extract data from MS SQL
- Transform using this mapping
- Load into Supabase

### **Step 4: Test Migration** (Week 3)
- Migrate sample data
- Run all validation checks
- Fix any issues

### **Step 5: Production Migration** (Week 4)
- Full migration
- Validation
- Go-live

---

**THIS IS YOUR ROADMAP, KALASH!** 🗺️

**Questions about any mapping?** Let me know! 😊
