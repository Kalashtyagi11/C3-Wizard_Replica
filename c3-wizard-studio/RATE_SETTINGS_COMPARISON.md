# 📊 Schema Comparison: Rate Settings

**Date**: January 29, 2026  
**Analysis**: `Master_Rate_Setting` vs `NWD_Master_Rate_Settings`

---

## ❌ ANSWER: The fields are NOT the same.

They are **different tables** serving different purposes, but with **terrible naming inconsistencies**.

| Feature | `Master_Rate_Setting` (Social Security) | `NWD_Master_Rate_Settings` (NWD Levy) |
|---------|-----------------------------------------|---------------------------------------|
| **Core Purpose** | Social Security (SS), Severance, EIB | Only "NWD Levy" |
| **Primary Key** | `MRSId` | `NWDS_Id` |
| **Main Rate** | `Soc_EE_Rate`, `Soc_ER_Rate` | `NWDLevy_Rate` |
| **Levy** | `Bonus_Levy_EE_Rate` | `NWDLevy_Rate` |
| **Dates** | `FromDate`, `ToDate` | `From_Date`, `To_Date` (Inconsistent!) ❌ |
| **Penalty** | `Penalty_Rate` | `Penality_Rate` (TYPO!) ❌ |
| **Structure** | Complex (14+ columns) | Simple (8 columns) |

---

## 📝 Detailed Column Comparison

| Column Type | `Master_Rate_Setting` | `NWD_Master_Rate_Settings` | Status |
|-------------|-----------------------|----------------------------|--------|
| **ID** | `MRSId` | `NWDS_Id` | ❌ Inconsistent |
| **Levy** | `Bonus_Levy_EE_Rate` | `NWDLevy_Rate` | Different Data |
| **Social Security** | `Soc_EE_Rate` | *Missing* | Different Data |
| **Severance** | `SeveranceRate` | *Missing* | Different Data |
| **Dates** | `FromDate` | `From_Date` | ❌ Inconsistent naming |
| **Dates** | `ToDate` | `To_Date` | ❌ Inconsistent naming |
| **Penalty** | `Penalty_Rate` | `Penality_Rate` | ❌ **TYPO IN DB** |
| **Age Limits** | `Min_Age`, `Max_Age` | `Min_Age`, `Max_Age` | ✅ Match |

---

## 💡 OPTIMIZATION PLAN (Lovable should fix this)

These tables **should** be consolidated or at least named consistently.

**Option 1: Consolidated Table (Recommended)**
```sql
CREATE TABLE c3_system_rates (
    id SERIAL PRIMARY KEY,
    rate_type TEXT, -- 'SOCIAL_SECURITY', 'SEVERANCE', 'NWD_LEVY'
    employee_rate DECIMAL,
    employer_rate DECIMAL,
    min_age INT,
    max_age INT,
    penalty_rate DECIMAL,
    effective_from TIMESTAMP,
    effective_to TIMESTAMP,
    is_active BOOLEAN
);
```

**Option 2: Separate but Consistent**
```sql
c3_rates_social_security
c3_rates_nwd_levy
```
*(Both usually share the exact same columns like from_date, to_date, penalty, etc. - current schema is a mess)*

---

### **Conclusion for You**
They are **NOT duplicates**.  
- One handles **Social Security/Severance**.
- One handles **NWD Levy**.
- But the **naming is completely broken** (Typos, Inconsistent underscores).

**This proves why we MUST optimize the database!**
