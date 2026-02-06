# 🔄 DATA MIGRATION GUIDE - MS SQL Server to Supabase

**CRITICAL**: Current C3 Wizard has LIVE PRODUCTION DATA that MUST be migrated to new Supabase system

**Purpose**: Safely migrate all existing data from MS SQL Server to optimized Supabase schema  
**Risk Level**: HIGH - Production data, zero data loss tolerance

---

## ⚠️ CRITICAL REQUIREMENTS

### **1. Zero Data Loss**
- ✅ Every record from old system must exist in new system
- ✅ All relationships must be preserved
- ✅ All historical data must be retained

### **2. Data Integrity**
- ✅ No data corruption during migration
- ✅ All foreign keys properly mapped
- ✅ All calculations remain accurate

### **3. Business Continuity**
- ✅ Minimal downtime (ideally zero)
- ✅ Rollback plan if migration fails
- ✅ Data validation before go-live

---

## 📊 MIGRATION SCOPE

### **What Needs to be Migrated**:

#### **1. Core User Data**
- ✅ `SECUsers` → `c3_users`
- ✅ User profiles, passwords (hashed), roles
- ✅ Last login, account status

#### **2. Company Data**
- ✅ `mastercompany` → `c3_companies`
- ✅ Company profiles, registration numbers
- ✅ Contact information

#### **3. Employee Data** (CRITICAL - Large volume)
- ✅ `MasterEmployee` → `c3_employees`
- ✅ All employee records with SSN, names, birthdates
- ✅ Employment status, hire dates
- ✅ **Estimated volume**: Thousands of records

#### **4. C3 Forms & Contributions** (CRITICAL - Historical data)
- ✅ `PROCESS_C3Header` → `c3_contribution_headers`
- ✅ `Process_Contributions` → `c3_contribution_details`
- ✅ All historical C3 submissions
- ✅ All calculations, statuses
- ✅ **Estimated volume**: Years of data

#### **5. Payments** (CRITICAL - Financial data)
- ✅ `OnlinePayments`, `OfflinePayments` → `c3_payments`
- ✅ Payment records, receipts, reconciliation
- ✅ **Estimated volume**: All payment history

#### **6. Configuration Data**
- ✅ `Master_Rate_Setting` → `c3_system_rates`
- ✅ `Deductions_Tax_Table_Details` → `c3_levy_tiers`
- ✅ Current rates, levy tiers, caps

#### **7. Supporting Data**
- ✅ Bonus records
- ✅ Holiday pay records
- ✅ Audit logs
- ✅ OTP records (recent only)

---

## 🛠️ MIGRATION STRATEGY

### **Phase 1: Planning & Preparation** (Week 1)

#### **Day 1-2: Schema Mapping**
```
Task: Create detailed mapping document

For each old table:
1. Old table name → New table name
2. Old field name → New field name
3. Data type conversion rules
4. Default values for new fields
5. Calculated/derived fields

Example:
OLD: SECUsers.UserName (VARCHAR(50))
NEW: c3_users.username (TEXT)
RULE: Direct copy, trim whitespace

OLD: SECUsers.Password (VARCHAR(MAX))
NEW: c3_users.password_hash (TEXT)
RULE: Already hashed, direct copy (verify hash format)
```

**Deliverable**: `MIGRATION_FIELD_MAPPING.xlsx`

---

#### **Day 3-4: Data Quality Assessment**
```
Task: Analyze current data quality

Check for:
1. Null values in critical fields
2. Duplicate records
3. Orphaned records (foreign keys to non-existent parents)
4. Data format inconsistencies
5. Invalid values (e.g., negative amounts)

Example Queries:
-- Find employees without company
SELECT * FROM MasterEmployee WHERE CompanyId NOT IN (SELECT Id FROM mastercompany)

-- Find C3 headers without details
SELECT * FROM PROCESS_C3Header WHERE Id NOT IN (SELECT C3HeaderId FROM Process_Contributions)

-- Find invalid SSNs
SELECT * FROM MasterEmployee WHERE SSN NOT LIKE '___-__-____'
```

**Deliverable**: `DATA_QUALITY_REPORT.xlsx`

---

#### **Day 5-7: Migration Scripts Development**
```
Task: Write SQL extraction and transformation scripts

For each table:
1. Extraction script (MS SQL)
2. Transformation script (convert format)
3. Load script (Supabase/PostgreSQL)
4. Validation script (verify accuracy)

Tools:
- SQL Server Management Studio (extract)
- Python/Node.js (transform)
- Supabase SQL Editor (load)
```

**Deliverable**: `migration-scripts/` folder

---

### **Phase 2: Test Migration** (Week 2)

#### **Step 1: Create Test Environment**
```
1. Set up separate Supabase project (TEST environment)
2. Deploy optimized schema
3. Do NOT use production Supabase
```

#### **Step 2: Migrate Sample Data**
```
1. Extract 100 companies
2. Extract 1000 employees
3. Extract 500 C3 forms
4. Extract 200 payments
5. Run migration scripts
```

#### **Step 3: Validate Test Migration**
```
Validation Checks:
✓ Record counts match (old vs new)
✓ Random sample verification (pick 20 records, compare manually)
✓ Calculation verification (pick 10 C3 forms, recalculate)
✓ Relationship integrity (all foreign keys valid)
✓ No data corruption (no truncated text, no null where shouldn't be)
```

#### **Step 4: Test Application with Migrated Data**
```
1. Point Lovable app to test database
2. Login with migrated users
3. View migrated employees
4. View historical C3 forms
5. Check calculations
6. Test all workflows
```

**If ANY issues**: Fix scripts, repeat test migration

---

### **Phase 3: Production Migration** (Week 3-4)

#### **Pre-Migration Checklist**:
```
[ ] Test migration successful (100% validation passed)
[ ] All migration scripts tested
[ ] Rollback plan documented
[ ] Database backup taken
[ ] Downtime window scheduled
[ ] Users notified
[ ] Lovable app tested against test data
[ ] Migration team ready
```

---

#### **Migration Day - Timeline**:

**Friday Evening** (6 PM - Midnight):

**6:00 PM**: Announcement
```
"C3 Wizard will be offline for maintenance from 8 PM to 12 AM.
Please complete any pending work by 7:30 PM."
```

**7:00 PM**: Final backup
```
1. Full MS SQL database backup
2. Verify backup integrity
3. Store backup in safe location
```

**7:30 PM**: System freeze
```
1. Set application to read-only mode
2. No new C3 forms
3. No new payments
```

**8:00 PM**: System down
```
1. Take application offline
2. Display maintenance page
```

**8:15 PM**: Data extraction (30-60 min)
```
1. Run extraction scripts for all tables
2. Export to CSV/JSON files
3. Verify file sizes, record counts
```

**9:15 PM**: Data transformation (30 min)
```
1. Run transformation scripts
2. Convert to Supabase format
3. Validate transformed data
```

**9:45 PM**: Data loading (60 min)
```
1. Load data into Supabase (production)
2. Monitor for errors
3. Verify record counts
```

**10:45 PM**: Validation (45 min)
```
1. Run validation queries
2. Compare record counts
3. Sample data verification
4. Calculation spot-checks
```

**11:30 PM**: Application deployment
```
1. Point Lovable app to production Supabase
2. Deploy latest version
3. Smoke test critical workflows
```

**11:50 PM**: Go-live decision
```
IF validation passed:
  - Open system
  - Announce go-live
ELSE:
  - Execute rollback plan
  - Investigate issues
  - Reschedule
```

**Midnight**: System online ✅

---

## 📋 MIGRATION SCRIPTS STRUCTURE

### **Folder Structure**:
```
migration-scripts/
├── 1-extract/
│   ├── extract_users.sql
│   ├── extract_companies.sql
│   ├── extract_employees.sql
│   ├── extract_c3_headers.sql
│   ├── extract_c3_details.sql
│   ├── extract_payments.sql
│   └── extract_rates.sql
├── 2-transform/
│   ├── transform.js (or .py)
│   └── transform_config.json
├── 3-load/
│   ├── load_users.sql
│   ├── load_companies.sql
│   ├── load_employees.sql
│   ├── load_c3_headers.sql
│   ├── load_c3_details.sql
│   ├── load_payments.sql
│   └── load_rates.sql
└── 4-validate/
    ├── validate_counts.sql
    ├── validate_relationships.sql
    └── validate_calculations.sql
```

---

## 🔍 VALIDATION QUERIES

### **1. Record Count Validation**:
```sql
-- MS SQL (Old)
SELECT 'Users' AS Table, COUNT(*) AS Count FROM SECUsers
UNION ALL
SELECT 'Companies', COUNT(*) FROM mastercompany
UNION ALL
SELECT 'Employees', COUNT(*) FROM MasterEmployee
UNION ALL
SELECT 'C3 Headers', COUNT(*) FROM PROCESS_C3Header
UNION ALL
SELECT 'C3 Details', COUNT(*) FROM Process_Contributions
UNION ALL
SELECT 'Payments', COUNT(*) FROM OnlinePayments

-- Supabase (New)
SELECT 'Users' AS table_name, COUNT(*) AS count FROM c3_users
UNION ALL
SELECT 'Companies', COUNT(*) FROM c3_companies
UNION ALL
SELECT 'Employees', COUNT(*) FROM c3_employees
UNION ALL
SELECT 'C3 Headers', COUNT(*) FROM c3_contribution_headers
UNION ALL
SELECT 'C3 Details', COUNT(*) FROM c3_contribution_details
UNION ALL
SELECT 'Payments', COUNT(*) FROM c3_payments;

-- MUST MATCH!
```

---

### **2. Relationship Integrity**:
```sql
-- Check all employees have valid company
SELECT COUNT(*) FROM c3_employees e
WHERE NOT EXISTS (
  SELECT 1 FROM c3_companies c WHERE c.id = e.company_id
);
-- MUST BE 0

-- Check all C3 details have valid header
SELECT COUNT(*) FROM c3_contribution_details d
WHERE NOT EXISTS (
  SELECT 1 FROM c3_contribution_headers h WHERE h.id = d.c3_header_id
);
-- MUST BE 0
```

---

### **3. Sample Data Verification**:
```sql
-- Pick random employee, verify all fields
SELECT * FROM MasterEmployee WHERE Id = 12345; -- Old
SELECT * FROM c3_employees WHERE old_id = 12345; -- New
-- Compare manually: SSN, name, birthdate, etc.
```

---

## 🚨 ROLLBACK PLAN

**If migration fails**:

### **Step 1: Stop new system** (5 min)
```
1. Take Lovable app offline
2. Display maintenance page
```

### **Step 2: Restore old system** (30 min)
```
1. Restore MS SQL database from backup
2. Restart old C3 Wizard application
3. Verify system is functional
```

### **Step 3: Announce rollback** (5 min)
```
"Migration encountered issues. System has been restored.
All data is safe. We will reschedule migration after investigation."
```

### **Step 4: Investigate** (Next day)
```
1. Analyze migration logs
2. Identify root cause
3. Fix scripts
4. Retest
5. Reschedule
```

---

## ✅ POST-MIGRATION CHECKLIST

**Day 1 After Migration**:
```
[ ] Monitor system performance
[ ] Check error logs
[ ] Verify user logins
[ ] Spot-check calculations
[ ] Respond to user issues
```

**Week 1 After Migration**:
```
[ ] Daily data validation
[ ] Monitor for calculation errors
[ ] User acceptance testing
[ ] Performance tuning
```

**Month 1 After Migration**:
```
[ ] Final data quality audit
[ ] Decommission old MS SQL database (keep backup!)
[ ] Archive migration scripts
[ ] Document lessons learned
```

---

## 📊 MIGRATION RISKS & MITIGATION

| Risk | Impact | Probability | Mitigation |
|------|--------|-------------|------------|
| Data loss during migration | CRITICAL | LOW | Multiple backups, validation |
| Calculation errors in migrated data | HIGH | MEDIUM | Spot-check samples, recalculate |
| Schema mismatch | HIGH | LOW | Test migration first |
| Extended downtime | MEDIUM | MEDIUM | Practice run, time estimates |
| Rollback required | MEDIUM | LOW | Tested rollback procedure |

---

## 💡 RECOMMENDATIONS

1. **Do test migration FIRST** - Don't go straight to production
2. **Migrate during low-usage time** - Friday night, weekend
3. **Keep old system backup** - For at least 6 months
4. **Parallel run** - Run both systems for 1 week if possible
5. **User communication** - Over-communicate timeline and expectations

---

## 📞 MIGRATION SUPPORT

**Migration Team**:
- Database Admin (you, Kalash)
- Developer (Lovable + you)
- Tester (you)
- Business owner (available for go/no-go decision)

**Communication**:
- Migration status updates every 30 min
- Instant notification if issues
- Decision point at 11:50 PM (go-live or rollback)

---

**This is a CRITICAL phase. Take time to plan and test thoroughly!** ⚠️

**Do NOT rush production migration!** 🚨
