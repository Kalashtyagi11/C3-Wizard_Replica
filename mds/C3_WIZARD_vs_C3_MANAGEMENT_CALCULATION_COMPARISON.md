# C3 Wizard vs C3 Management - Calculation Comparison Report

## Executive Summary

This document compares the contribution calculation logic between **C3 Wizard** and **C3 Management** systems to identify differences and required changes to align C3 Management with C3 Wizard.

---

## Implementation Approach Comparison

### C3 Wizard
- **Hybrid Approach**: Uses BOTH stored procedures AND C# code
- **Stored Procedures Used For**:
  - `get_C3Genrated_data` - Data retrieval
  - `C3Header_Insert_One` / `C3Header_Update` - Header CRUD operations
  - `Process_Contributions_Insert_One` - Employee contribution data insertion
  - `get_C3Genrated_Employee_Data` - Employee data retrieval
  - `Holiday_Pay_Employee_Select_All` - Holiday pay data retrieval
  - `Get_Master_C3_Setting_Rates` - Rate configuration retrieval

- **C# Code Contains**:
  - **ALL CALCULATION LOGIC** is in C# methods (NOT in stored procedures)
  - `SSEmployee()` - Employee SS calculation
  - `SSEIB()` - Employer EI/SS calculation
  - `CalculateLevyEmployee()` - Employee levy calculation
  - `Employee_Levy_Bonus()` - Bonus levy calculation
  - `Levy_amount()` - General levy calculation
  - `Total_Amout_Get_Rmployee_in_year()` - YTD wage calculation
  - Holiday pay distribution logic
  - Bonus exemption logic
  - Director-specific wage calculation
  - Age-based exemptions
  - Penalty calculations

### C3 Management
- **Stored Procedure Approach**: Uses stored procedures extensively
- **Stored Procedures Used For**:
  - `usp_ValidateC3Contributor` - Contributor validation
  - `usp_SaveC3Draft` - Draft saving
  - `usp_UpdateC3Record` - Record updates
  - `usp_DeleteC3Employee` - Employee deletion
  - **Likely** contains calculation logic in stored procedures (needs verification)

- **Application Code Contains**:
  - Business orchestration
  - Data validation
  - API endpoints
  - Database operation calls

---

## Rate Configuration Comparison

| Rate Type | C3 Wizard | C3 Management | Match? |
|-----------|-----------|---------------|--------|
| **Table Name** | `MasterRateSetting` | `MI_Tb_SSC_Rates` | ❌ Different |
| **Employee SS** | `SocEeRate` (5%) | `employee_ss_percentage` (5%) | ✅ Same rate |
| **Employer SS** | `SocErRate` (5%) | `employer_ss_percentage` (5%) | ✅ Same rate |
| **Employee PE** | `SeveranceRate` (1%) | `employee_pe_percentage` (1%) | ✅ Same rate |
| **Employer EI** | `Eib` (1%) | `employer_ei_percentage` (1%) | ✅ Same rate |
| **Employer Levy** | `EmployerLevy` (3%) | `employer_levy_percentage` (3%) | ✅ Same rate |
| **Age Range** | `MinAge` (16) / `MaxAge` (62) | Implied 16-62 | ✅ Same |

**Finding**: Both systems use the same percentage rates, but different table structures.

---

## Calculation Formula Comparison

### 1. Social Security Employee Contribution

#### C3 Wizard Formula
```
SSEmployee = (Age < 16 || Age >= 62) ? 0 :
             MIN(TotalWages × 5%, SocEePayLimit)
```
- Has **maximum cap** (`SocEePayLimit` from `MasterRateSetting`)
- Age-based exemption (< 16 or >= 62)
- Applied to total wages (weekly wages sum)

#### C3 Management Formula
```
ip_ss_amt = (Age < 16 || Age >= 62) ? 0 :
            TotalWages × 5%
```
- **NO maximum cap** mentioned
- Same age-based exemption
- Applied to total wages

**DIFFERENCE**: ❌ C3 Wizard has a **maximum cap** on employee SS, C3 Management does not mention it.

---

### 2. Employer Social Security & EI Contribution

#### C3 Wizard Formula
```
For Ages 16-62:
  er_ss_amt = TotalWages × 5%
  er_ei_amt = MIN(TotalWages × 1%, Eib limit)

For Ages < 16 or >= 62:
  er_ss_amt = 0
  er_ei_amt = TotalWages × 1%
```
- Employer SS has age exemption
- Employer EI has **maximum cap** (`Eib` limit)
- EI still applies even for exempt ages

#### C3 Management Formula
```
For Ages 16-62:
  er_ss_amt = TotalWages × 5%
  er_ei_amt = TotalWages × 1%

For Ages < 16 or >= 62:
  er_ss_amt = 0
  er_ei_amt = TotalWages × 1%
```
- Same age exemption for employer SS
- **NO cap** on employer EI mentioned

**DIFFERENCE**: ❌ C3 Wizard has an **EI cap**, C3 Management does not mention it.

---

### 3. Employee Levy Calculation

#### C3 Wizard Formula
```
Employee Levy = Progressive tax calculation using DeductionsTaxTable

For Weekly (W):
  Levy = SUM(Levy for Week 1-5 individually)
  
For Each Week:
  - Find tax bracket where over_amt <= weekly_wage
  - Levy = base_amt + ((weekly_wage - over_amt + 0.01) × tax_rate)
  
For Monthly (M):
  Levy = Calculate on total wages (all weeks combined)
  
For Bi-Weekly (E2W) / Twice Monthly (2M):
  Levy = Calculate for each period separately
```
- Uses progressive tax table (`DeductionsTaxTable`)
- Different calculation method based on pay period
- Weekly calculations are done **per week**

#### C3 Management Formula
```
Employee Levy = Progressive tax calculation using MI_Tb_Deductions_Tax_Table_Details

For Weekly (1):
  Levy = SUM(Levy for Week 1-5 individually)
  
For Each Week:
  - Find tax bracket where over_amt <= weekly_wage
  - Levy = base_amt + ((weekly_wage - over_amt + 0.01) × tax_rate)
  
For Monthly (3):
  Levy = Calculate on total wages (all weeks combined)
  
For Bi-Weekly (2) / Twice Monthly (4):
  Levy = Calculate for each period separately
```
- Uses progressive tax table (`MI_Tb_Deductions_Tax_Table_Details`)
- Same calculation logic
- Different pay period codes

**DIFFERENCE**: ✅ **Same logic**, different table names and pay period codes

| Pay Period | C3 Wizard | C3 Management |
|------------|-----------|---------------|
| Weekly | "W" | "1" |
| Every 2 Weeks | "E2W" | "2" |
| Monthly | "M" | "3" |
| Twice Monthly | "2M" | "4" |

---

### 4. Employer Levy Calculation

#### C3 Wizard Formula
```
Employer Levy = (TotalWages + Bonus) × 3%

Note: Employer levy includes bonus in calculation
```
- Fixed 3% on wages + bonus
- Bonus is **included** in employer levy

#### C3 Management Formula
```
Employer Levy = TotalWages × 3%
```
- Fixed 3% on total wages
- **No mention** of bonus inclusion

**DIFFERENCE**: ❌ C3 Wizard **includes bonus** in employer levy, C3 Management does not mention it.

---

### 5. Severance (PE) Calculation

#### C3 Wizard Formula
```
Employee PE = MIN(TotalWages × 1%, Eib limit)
```
- 1% of total wages
- Has **maximum cap** (`Eib` limit)

#### C3 Management Formula
```
Employee PE = TotalWages × 1%
```
- 1% of total wages
- **NO cap** mentioned

**DIFFERENCE**: ❌ C3 Wizard has a **maximum cap** on PE, C3 Management does not mention it.

---

### 6. Bonus Treatment

#### C3 Wizard - Complex Bonus Logic
```
1. Check if bonus is exempted:
   - Query DECEMBER_BONUS_EXEMPTED_CONTRIBUTION table
   - If exempted: Bonus NOT included in SS/PE calculations
   - If not exempted: Bonus included in all calculations

2. YTD Wage Check for Levy:
   - Calculate employee's YTD wages (current year up to contribution month)
   - If YTD < $28,000: Employee levy on bonus = 0
   - If YTD >= $28,000: Employee levy on bonus calculated normally

3. Employer Levy on Bonus:
   - ALWAYS applied (3% of bonus)
   - Regardless of exemption status

4. Bonus Distribution:
   - If bonus exempted: Added as separate "bonus week" in response
   - If not exempted: Distributed across working weeks
```

#### C3 Management - No Bonus Logic
```
- wages_paid6 (Holiday Pay) field exists but NOT used in calculations
- wages_paid7 (Bonus Pay) field exists but NOT used in calculations
- Documentation states: "The calculation logic for Holiday Pay and Bonus Pay is currently 
  under discussion and has NOT been implemented yet in the system"
```

**DIFFERENCE**: ❌ **MAJOR DIFFERENCE** - C3 Wizard has comprehensive bonus handling logic, C3 Management has **NO bonus logic implemented**.

---

### 7. Holiday Pay Treatment

#### C3 Wizard - Complex Holiday Pay Logic
```
1. Identify non-working weeks (weeks with $0 wages and not marked as worked)

2. Distribute holiday pay across non-working weeks:
   - Split total holiday pay equally among non-working weeks
   - Update wages for those weeks with distributed amount

3. Recalculate contributions:
   - Employee levy recalculated with distributed holiday pay
   - SS, PE, and employer contributions recalculated

4. Holiday pay stored separately:
   - HPay_Week1 through HPay_Week5 fields
   - Original wages preserved in WAGES1-WAGES5
   - Distributed amounts added to weeks
```

#### C3 Management - No Holiday Pay Logic
```
- wages_paid6 (Holiday Pay) field exists but NOT used in calculations
- Documentation states: "The calculation logic for Holiday Pay is currently under discussion 
  and has NOT been implemented yet"
- Field stored in database but excluded from all calculations
```

**DIFFERENCE**: ❌ **MAJOR DIFFERENCE** - C3 Wizard has comprehensive holiday pay distribution logic, C3 Management has **NO holiday pay logic implemented**.

---

### 8. Director-Specific Processing

#### C3 Wizard - Director Logic
```
1. Check if employee is director:
   - IsemployeeDirector flag in MasterEmployee table

2. If director AND no wages entered:
   - Check if director salary exists in MasterEmployee.Salary
   - If salary exists and > 0:
     - Calculate monthly wage = Salary / 12
     - Distribute across 4 weeks (monthly wage / 4 per week)
     - Week 5 gets remainder if exists
   - Apply all contribution calculations to distributed wages

3. If director with wages entered:
   - Process normally like regular employee
```

#### C3 Management - No Director Logic
```
- No mention of director-specific processing
- No automatic wage calculation for directors
- No special handling for non-working directors
```

**DIFFERENCE**: ❌ **MAJOR DIFFERENCE** - C3 Wizard has director auto-wage calculation, C3 Management has **NO director-specific logic**.

---

### 9. Penalty Calculation

#### C3 Wizard Formula
```
1. Determine Due Date:
   Due Date = Last day of month following contribution period
   Example: March 2025 period → Due Date = April 30, 2025

2. Calculate Months Late:
   If date_received > Due Date:
     Months Late = DATEDIFF(Month, Due Date, Date Received)
     If Months Late < 1: Months Late = 1
   Else:
     Months Late = 0

3. Retrieve Penalty Rates from MasterRateSetting:
   - FineRate: First month SS penalty (5%)
   - PenaltyRate: First month Levy/PE penalty (10%)
   - AdditionalPenaltyRate: Subsequent months penalty (1%)

4. Calculate Penalties:
   SS Fine = SS Total × 5% × Months Late
   Levy Penalty = Levy Total × (10% + (Months Late - 1) × 1%)
   PE Penalty = PE Total × (10% + (Months Late - 1) × 1%)
```

#### C3 Management Formula
```
1. Determine Due Date:
   Due Date = Last day of month following contribution period
   (Same as C3 Wizard)

2. Calculate Months Late:
   (Same logic as C3 Wizard)

3. Retrieve Penalty Rates from MI_Tb_Penalty:
   - First Month: 5% for SSC, 10% for Levy/PE
   - Subsequent Months: 5% for SSC, 1% for Levy/PE

4. Calculate Penalties:
   SS Fine = SS Total × (5% + (Months Late - 1) × 5%)
   Levy Penalty = Levy Total × (10% + (Months Late - 1) × 1%)
   PE Penalty = PE Total × (10% + (Months Late - 1) × 1%)
```

**DIFFERENCE**: ❌ **Different SS penalty calculation**

| Contribution | C3 Wizard | C3 Management | Match? |
|--------------|-----------|---------------|--------|
| **SS Fine** | 5% × Months Late | 5% first + 5% subsequent months | ❌ Different |
| **Levy Penalty** | 10% first + 1% subsequent | 10% first + 1% subsequent | ✅ Same |
| **PE Penalty** | 10% first + 1% subsequent | 10% first + 1% subsequent | ✅ Same |

---

### 10. Age-Based Exemptions

#### C3 Wizard
```
MinAge = 16 (from MasterRateSetting)
MaxAge = 62 (from MasterRateSetting)

Employee SS = 0 if Age < MinAge OR Age >= MaxAge
Employer SS = 0 if Age < MinAge OR Age >= MaxAge
Employer EI = Always calculated (even for exempt ages)
Employee PE = Always calculated (no age exemption)
Employee Levy = Always calculated (no age exemption)
Employer Levy = Always calculated (no age exemption)
```

#### C3 Management
```
Age Range = 16-62 (implied, not configurable)

Same exemption logic:
- Employee SS = 0 if Age < 16 OR Age >= 62
- Employer SS = 0 if Age < 16 OR Age >= 62
- Employer EI = Always calculated
- Employee PE = Always calculated
- Employee Levy = Always calculated
- Employer Levy = Always calculated
```

**DIFFERENCE**: ✅ **Same logic**, but C3 Wizard's ages are configurable via `MasterRateSetting`.

---

### 11. Rounding Rules

#### C3 Wizard
```
All amounts rounded to 2 decimal places using String.Format("{0:0.00}", amount)
Applied at every calculation step
```

#### C3 Management
```
All amounts stored as DECIMAL(10,2) or NUMERIC(10,2)
Rounding applied at database level
```

**DIFFERENCE**: ✅ **Same result** - both round to 2 decimal places.

---

## Summary of Key Differences

### ❌ Critical Differences (Must Fix in C3 Management)

1. **Maximum Caps Missing**:
   - C3 Wizard has `SocEePayLimit` cap for employee SS
   - C3 Wizard has `Eib` cap for employer EI and employee PE
   - **Action**: Add cap logic to C3 Management calculations

2. **Bonus Treatment**:
   - C3 Wizard has comprehensive bonus logic (exemptions, YTD check, employer levy inclusion)
   - C3 Management has **NO bonus logic** implemented
   - **Action**: Implement full bonus handling logic in C3 Management

3. **Holiday Pay Distribution**:
   - C3 Wizard distributes holiday pay across non-working weeks
   - C3 Management has **NO holiday pay logic** implemented
   - **Action**: Implement holiday pay distribution logic in C3 Management

4. **Director Auto-Wage Calculation**:
   - C3 Wizard auto-calculates wages for non-working directors from salary
   - C3 Management has **NO director logic**
   - **Action**: Implement director-specific processing in C3 Management

5. **Employer Levy Includes Bonus**:
   - C3 Wizard: `Employer Levy = (Wages + Bonus) × 3%`
   - C3 Management: `Employer Levy = Wages × 3%`
   - **Action**: Include bonus in employer levy calculation

6. **SS Penalty Calculation**:
   - C3 Wizard: `SS Fine = SS Total × 5% × Months Late`
   - C3 Management: `SS Fine = SS Total × (5% first + 5% × (Months Late - 1))`
   - **Action**: Change C3 Management to use 5% flat rate per month (or clarify which is correct)

### ✅ Matches (No Changes Needed)

1. Rate percentages (5%, 5%, 1%, 1%, 3%)
2. Employee levy progressive tax logic
3. Age-based exemptions (ages 16-62)
4. Levy and PE penalty calculations
5. Rounding to 2 decimal places

---

## Where is the Logic in C3 Wizard Code?

### Calculation Logic Location

**ALL calculation logic is in C# code** in the following file:
```
c3Api/c3Api/C3WizardRepository/Repository/RepoC3.cs
```

### Key Methods:

| Method | Line Range | Purpose |
|--------|-----------|---------|
| `SSEmployee()` | ~5100 | Employee SS calculation with age and cap checks |
| `SSEIB()` | ~5120 | Employer SS & EI calculation with cap |
| `CalculateLevyEmployee()` | ~5300-5600 | Employee levy progressive tax calculation |
| `Employee_Levy_Bonus()` | ~5630 | Bonus levy with YTD wage check |
| `Levy_amount()` | ~5720 | General levy calculation helper |
| `Total_Amout_Get_Rmployee_in_year()` | ~5830 | YTD wage calculation for bonus levy exemption |
| Main Calculation Method | ~1750-1920 | Orchestrates all calculations and saves to DB |

### Stored Procedures are Used For:

1. **Data Retrieval**:
   - `get_C3Genrated_data` - Retrieve C3 header records
   - `get_C3Genrated_Employee_Data` - Retrieve employee contribution records
   - `Get_Master_C3_Setting_Rates` - Get rate configuration
   - `Holiday_Pay_Employee_Select_All` - Get holiday pay data

2. **Data Persistence**:
   - `C3Header_Insert_One` - Insert new C3 header
   - `C3Header_Update` - Update existing C3 header
   - `Process_Contributions_Insert_One` - Insert employee contribution record
   - `C3Header_Finalize` - Mark C3 as finalized

3. **Validation**:
   - `ValidateC3SettingExists` - Check if rate settings exist for date range
   - `EditValidateC3SettingExists` - Validate rate settings during edit

**Important**: The stored procedures in C3 Wizard do **NOT contain calculation logic**. All formulas, business rules, and calculation logic are in the C# code. Stored procedures are purely for CRUD operations.

---

## Recommendations for C3 Management

### 1. Move Calculation Logic to Application Code
- **Current**: Calculations likely in stored procedures
- **Target**: Move to application code (like C3 Wizard)
- **Benefit**: Easier to maintain, test, and modify

### 2. Implement Missing Features

Priority 1 - Critical:
- [ ] Add maximum cap logic for SS, EI, and PE
- [ ] Implement bonus handling logic
- [ ] Include bonus in employer levy calculation
- [ ] Align SS penalty calculation formula

Priority 2 - Important:
- [ ] Implement holiday pay distribution
- [ ] Add director auto-wage calculation
- [ ] Add YTD wage tracking for bonus levy exemption

Priority 3 - Nice to Have:
- [ ] Make age ranges configurable
- [ ] Add bonus exemption table support

### 3. Testing Checklist

After implementing changes, test:
- [ ] Employee with age < 16 (SS should be 0)
- [ ] Employee with age >= 62 (SS should be 0)
- [ ] Employee with wages exceeding SS/EI/PE caps
- [ ] Employee with bonus (all exemption scenarios)
- [ ] Employee with holiday pay distribution
- [ ] Non-working director with salary
- [ ] Late submission penalties (various months late)
- [ ] YTD wage < $28,000 with bonus (no employee levy on bonus)
- [ ] YTD wage >= $28,000 with bonus (levy on bonus applies)

---

## Next Steps

1. **Verify Stored Procedure Contents**:
   - Review C3 Management stored procedures to confirm they contain calculation logic
   - Document exact calculation formulas currently in use

2. **Create Migration Plan**:
   - Prioritize changes based on business impact
   - Plan phased rollout if needed

3. **Set Up Test Environment**:
   - Create test cases covering all calculation scenarios
   - Compare outputs between C3 Wizard and updated C3 Management

4. **Code Implementation**:
   - Move calculations from stored procedures to application code
   - Implement missing features (bonus, holiday pay, director logic, caps)
   - Update penalty formulas

5. **Validation**:
   - Run parallel calculations in both systems
   - Verify results match exactly
   - Document any intentional differences

---

## Conclusion

The primary differences between C3 Wizard and C3 Management are:

1. **Implementation Approach**: C3 Wizard uses C# code for calculations, C3 Management likely uses stored procedures
2. **Missing Features**: Bonus handling, holiday pay distribution, director logic
3. **Missing Caps**: Maximum limits on SS, EI, and PE contributions
4. **Penalty Formula**: Different SS penalty calculation method

To align C3 Management with C3 Wizard, you need to:
- Implement all calculation logic in application code (not stored procedures)
- Add bonus handling with exemption logic
- Add holiday pay distribution across non-working weeks
- Add director auto-wage calculation
- Add maximum caps for SS, EI, and PE
- Update SS penalty formula to match C3 Wizard
- Include bonus in employer levy calculation

**Estimated Effort**: Medium to Large (depending on current stored procedure complexity)
**Risk Level**: Medium (requires careful testing of all calculation scenarios)
**Business Impact**: High (affects all contribution calculations)
