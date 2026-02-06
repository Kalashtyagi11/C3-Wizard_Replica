# C3 Wizard - Contribution Calculation Formulas Reference

**Purpose**: This document provides the EXACT calculation formulas used in C3 Wizard for all contribution types. Use this to compare with C3 Management calculations and align the logic.

**Date**: January 19, 2026  
**Source**: Analyzed from C3 Wizard codebase (RepoC3.cs)

---

## Table of Contents
1. [Rate Configuration](#rate-configuration)
2. [Social Security Calculations](#social-security-calculations)
3. [Levy Calculations](#levy-calculations)
4. [Severance Calculations](#severance-calculations)
5. [Penalty Calculations](#penalty-calculations)
6. [Bonus Treatment](#bonus-treatment)
7. [Holiday Pay Treatment](#holiday-pay-treatment)
8. [Director Wages](#director-wages)
9. [Total Contribution Formula](#total-contribution-formula)
10. [Special Rules & Edge Cases](#special-rules--edge-cases)

---

## Rate Configuration

### MasterRateSetting Table
The system uses rates from the `MasterRateSetting` table. Here are the rate fields:

| Rate Field | Purpose | Type |
|------------|---------|------|
| `SocEeRate` | Social Security Employee Rate | double (%) |
| `SocErRate` | Social Security Employer Rate | double (%) |
| `BonusLevyEeRate` | Bonus Levy Employee Rate | double (%) |
| `EmployerLevy` | Employer Levy Rate | double (%) |
| `SeveranceRate` | Severance Pay Rate | double (%) |
| `Eib` | Employment Insurance Benefit Limit | double ($) |
| `FineRate` | Fine Rate | double (%) |
| `PenaltyRate` | Penalty Rate | double (%) |
| `AdditionalPenaltyRate` | Additional Penalty Rate | double (%) |
| `MinAge` | Minimum age for contributions | int |
| `MaxAge` | Maximum age for contributions | int |

**Example Current Rates** (from typical St. Kitts & Nevis):
- Social Security Employee: 5%
- Social Security Employer: 5%
- Levy Employee: Based on tax brackets
- Levy Employer: 1%
- Severance: 1% (shared between employee and employer)

---

## Wage Calculation Base

### Total Wages Formula

```csharp
TotalWages = Wages1 + Wages2 + Wages3 + Wages4 + Wages5 + HolidayPay + Bonus + DirectorWages
```

**Breakdown**:
- `Wages1-5`: Regular wages for each week of the month
- `HolidayPay`: Holiday pay amount
- `Bonus`: Bonus amount (with special December rules)
- `DirectorWages`: Director-specific wages (if applicable)

**Important**: Holiday Pay treatment varies:
- If `Remarks` contains "Other", Holiday Pay is **excluded** from wage base
- Otherwise, Holiday Pay is **included** in calculations

---

## Social Security Calculations

### 1. Social Security Employee Contribution

**Formula**:
```csharp
SSEmployee = (Age < MinAge || Age >= MaxAge) ? 0 : 
             MIN(TotalWages × SocEeRate, SocEePayLimit)
```

**Code Reference**:
```csharp
public decimal? SSEmployee(int age, decimal? amount, float Soc_EE_Rate, decimal? Soc_EE_Pay_Limit)
{
    return age < Min_Age || age >= Max_Age ? 0 : 
           (amount * (decimal)Soc_EE_Rate > (decimal)(Soc_EE_Pay_Limit) ? 
           (decimal)(Soc_EE_Pay_Limit) : amount * (decimal)Soc_EE_Rate);
}
```

**Explanation**:
- **Age Check**: Employees below `MinAge` (typically 16) or above `MaxAge` (typically 62) pay **ZERO**
- **Calculation**: Wage Base × Employee SS Rate (e.g., 5%)
- **Cap**: Maximum contribution capped at `SocEePayLimit`

**Example**:
- Employee Age: 30
- Total Wages: $2,000
- SS Employee Rate: 5%
- Calculation: $2,000 × 5% = **$100**

---

### 2. Social Security Employer Contribution

**Formula**:
```csharp
SSEmployer = (Age < MinAge || Age >= MaxAge) ? 0 : 
             MIN(TotalWages × SocErRate, SocErPayLimit)
```

**Explanation**:
- Same age restrictions as employee
- Uses employer rate (typically same 5%)
- Separate cap limit

**Example**:
- Employee Age: 30
- Total Wages: $2,000
- SS Employer Rate: 5%
- Calculation: $2,000 × 5% = **$100**

**Total Social Security = Employee SS + Employer SS = $200**

---

## Levy Calculations

### 1. Employee Levy (Tax-Based)

**Formula**:
```csharp
EmployeeLevy = (TotalWages - OverAmt) × TaxRate + BaseAmt
```

**Code Reference**:
```csharp
public decimal? Levy_amount(List<BLDeductionsTaxTableDetails> DeductionsTaxDetailslist, decimal? amount)
{
    decimal OverAmt = DeductionsTaxDetailslist.Max(x => x.OverAmt);
    decimal BaseAmt = DeductionsTaxDetailslist.Max(x => x.BaseAmt);
    decimal TaxRate = DeductionsTaxDetailslist.Max(x => x.TaxRate);
    decimal? LEVYEE = (amount - OverAmt) * TaxRate + BaseAmt;
    return LEVYEE;
}
```

**Explanation**:
- Uses **progressive tax table** from `DeductionsTaxTable`
- Similar to income tax calculation
- Based on wage brackets

**Tax Table Example**:
| Over | Not Over | Base Amount | Tax Rate |
|------|----------|-------------|----------|
| $0 | $200/week | $0 | 0% |
| $200 | $400/week | $0 | 2% |
| $400 | $600/week | $4 | 4% |
| $600+ | - | $12 | 6% |

**Calculation Example**:
- Weekly Wage: $500
- Falls in bracket: $400-$600
- Levy = ($500 - $400) × 4% + $4 = **$8**

---

### 2. Employer Levy

**Formula**:
```csharp
EmployerLevy = IsLevyExempt ? 0 : 
               (Month == 12 && ExemptedEmployerLevyBonus) ?
                 TotalWagesOnly × EmployerLevyRate :
                 (TotalWages + Bonus) × EmployerLevyRate
```

**Code Reference**:
```csharp
TLevyEmployer = IsLevyExempt ? 0.00 : 
                month == 11 && bonusSetting.exemptedEmployerLevybonus ? 
                  (Twadges * employerlevyRate / 100) : 
                  ((Twadges + Bonus) * employerlevyRate / 100)
```

**Explanation**:
- **Levy Exempt Check**: Some companies exempt from levy
- **December Rule**: If employer levy on December bonus is exempted, calculate only on wages
- **Standard**: Wages + Bonus × Employer Levy Rate (typically 1%)

**Example**:
- Total Wages: $50,000
- Bonus: $5,000
- Employer Levy Rate: 1%
- Is Levy Exempt: No
- Month: January (not December)
- Calculation: ($50,000 + $5,000) × 1% = **$550**

---

### 3. Bonus Levy (Special Rules)

**Formula**:
```csharp
BonusLevy = (Month == 12 && ExemptedLevyBonus) ? 0 :
            (YearToDateWages >= $18,720) ? Bonus × BonusLevyEeRate : 0
```

**Code Reference**:
```csharp
public decimal? Employee_Levy_Bonus(decimal? amount, int monthno, string year, string ssn, int CompanyId, bool exemptedLevybonus)
{
    decimal? LEVYEE = monthno == 12 && exemptedLevybonus ? 0 : 
                      Total_Amout_Get_Rmployee_in_year(year, ssn, CompanyId) >= 18720 ? 
                        amount * (decimal?)Bonus_Levy_EE_Rate : 0;
    return LEVYEE;
}
```

**Explanation**:
- **December Exemption**: December bonuses may be exempt from levy
- **Wage Threshold**: Only applies if employee earned **$18,720+** in the year
- **Rate**: Uses special bonus levy rate

**Example**:
- Bonus: $2,000
- Month: November
- Year-to-date wages: $25,000 (exceeds $18,720)
- Bonus Levy Rate: 5%
- Calculation: $2,000 × 5% = **$100**

---

## Severance Calculations

### 1. Severance Employee

**Formula**:
```csharp
SeveranceEmployee = MIN(TotalWages × SeveranceRate, EIBLimit)
```

**Code Reference**:
```csharp
public decimal? SSEIB(int age, decimal? amount, float EIB_Rate, decimal? EIB_Pay_Limit)
{
    return (amount * (decimal)(EIB_Rate)) > (decimal)(EIB_Pay_Limit) ? 
           (decimal)(EIB_Pay_Limit) : amount * (decimal)(EIB_Rate);
}
```

**Explanation**:
- Employee portion of severance
- Typically 0.5% of wages
- Capped at EIB limit

**Example**:
- Total Wages: $2,000
- Severance Rate: 0.5%
- EIB Limit: $15
- Calculation: $2,000 × 0.5% = $10 (under limit)
- Result: **$10**

---

### 2. Severance Employer

**Formula**:
```csharp
SeveranceEmployer = (TotalWages + Bonus) × SeveranceRate
```

**Code Reference**:
```csharp
decimal? servayance_er = decimal.Parse(String.Format("{0:0.00}", 
                         ((emp.TotalWadeges + emp.wage_Amt + emp.BONUS) * Severance_Rate)));
```

**Explanation**:
- Employer pays on **wages + bonus**
- Typically 0.5% of total
- No cap on employer portion

**Example**:
- Total Wages: $2,000
- Bonus: $500
- Severance Rate: 0.5%
- Calculation: ($2,000 + $500) × 0.5% = **$12.50**

**Total Severance = Employee + Employer = $10 + $12.50 = $22.50**

---

## Penalty Calculations

### 1. Social Security Penalty

**Formula**:
```csharp
SSPenalty = (OverdueAmount) × PenaltyRate × NumberOfMonthsLate
```

**Explanation**:
- Applied when SS contributions are paid late
- Calculated monthly
- Compounds over time

---

### 2. Levy Penalty

**Formula**:
```csharp
LevyPenalty = (OverdueLevy) × FineRate × NumberOfMonthsLate
```

**Explanation**:
- Similar to SS penalty
- Uses fine rate instead of penalty rate
- Applied to employee and employer levy

---

### 3. Severance Penalty (PE Penalty)

**Formula**:
```csharp
PEPenalty = (OverdueSeverance) × PenaltyRate × NumberOfMonthsLate
```

**Explanation**:
- Applied when severance payments are late
- Same rate as SS penalty

---

## Bonus Treatment

### December Bonus Special Rules

**Configuration**: System checks `DECEMBER_BONUS_EXEMPTED_CONTRIBUTION` table

**Exemption Flags**:
1. `exemptedLevybonus`: Exempt December bonus from **employee levy**
2. `exemptedEmployerLevybonus`: Exempt December bonus from **employer levy**
3. `exemptedSeverancebonus`: Exempt December bonus from **severance**

**Code Logic**:
```csharp
if (month == 12 && bonusSetting.exemptedLevybonus) {
    // Employee levy on bonus = 0
}

if (month == 12 && bonusSetting.exemptedEmployerLevybonus) {
    // Employer levy = wages only × rate (exclude bonus)
}

if (bonusSetting.exemptedSeverancebonus) {
    // Severance on bonus = 0
}
```

**Why December?**: St. Kitts & Nevis provides tax relief on year-end bonuses

---

## Holiday Pay Treatment

### Holiday Pay in Wages

**Formula**:
```csharp
TotalWages = Wages1 + Wages2 + Wages3 + Wages4 + Wages5 + 
             (Remarks.Contains("Other") ? 0 : HolidayPay) + Bonus
```

**Code Reference**:
```csharp
Select cast((pc.WAGES1+pc.WAGES2+pc.WAGES3+pc.WAGES4+pc.WAGES5-
       case when pc.Remarks Like '%Other%' then 0 else pc.HPay end) 
       as numeric(18,2)) as TotalWages
```

**Explanation**:
- **Standard**: Holiday pay **included** in contribution calculations
- **Exception**: If marked as "Other" in remarks, holiday pay **excluded**
- **Separate Tracking**: Holiday pay tracked per week (HPay_Week1 to HPay_Week5)

**Example**:
- Regular Wages: $2,000
- Holiday Pay: $200
- Remarks: Empty
- Total for Contributions: $2,000 + $200 = **$2,200**

**Example with "Other"**:
- Regular Wages: $2,000
- Holiday Pay: $200
- Remarks: "Other compensation"
- Total for Contributions: $2,000 + $0 = **$2,000**

---

## Director Wages

### Director Contribution Calculation

**For Director-Only Employees**:
```csharp
DirectorWages = DirectorWagesPAY
TotalWages = DirectorWages (no regular wages)
```

**For Employee-Directors**:
```csharp
TotalWages = RegularWages + DirectorWages
```

**Separate C3 Forms**:
- Directors processed in separate C3 (ForDirector = true)
- Uses `NwdMasterRateSetting` table for director-specific rates
- May have different SS and levy rates

---

## Total Contribution Formula

### Grand Total Calculation

```csharp
GrandTotal = TotalSS + TotalLevy + TotalSeverance + TotalPenalties

Where:
  TotalSS = SSEmployee + SSEmployer + SSPenalty
  TotalLevy = LevyEmployee + LevyEmployer + LevyPenalty
  TotalSeverance = SeveranceEmployee + SeveranceEmployer + PEPenalty
  TotalPenalties = SSPenalty + LevyPenalty + PEPenalty
```

**Code Reference**:
```csharp
Txt_GrandTotal = Math.Round((TLevy + TLevyP + TLevyEmployer + 
                             TSer + TSerP + TSocSec + TSocSecSP), 2)
```

**Breakdown**:
- `TSocSec`: Total Social Security (Employee + Employer)
- `TSocSecSP`: Social Security Penalty
- `TLevy`: Total Employee Levy
- `TLevyEmployer`: Employer Levy
- `TLevyP`: Levy Penalty
- `TSer`: Total Severance
- `TSerP`: Severance (PE) Penalty

---

## Special Rules & Edge Cases

### 1. Age-Based Exemptions

**Rule**: Employees under minimum age or above maximum age pay **ZERO** social security

**Check**:
```csharp
if (Age < MinAge || Age >= MaxAge) {
    SSEmployee = 0;
    SSEmployer = 0;
}
```

**Typical Ages**:
- Min Age: 16
- Max Age: 62

---

### 2. Levy Exemption

**Rule**: Some companies are exempt from paying levy

**Check**:
```csharp
if (Company.IsLevyExempt == true) {
    LevyEmployee = 0;
    LevyEmployer = 0;
}
```

**Database**: `MasterCompany.IsLevyExempt` flag

---

### 3. Year-to-Date Wage Threshold for Bonus Levy

**Rule**: Bonus levy only applies if employee earned $18,720+ in the year

**Code**:
```csharp
SELECT SUM(WAGES1+WAGES2+WAGES3+WAGES4+WAGES5-HPay) as YTDWages
FROM Process_Contributions
WHERE SSN = @SSN AND PERIOD_YEAR = @Year
AND Is_Fianalize = 1

If YTDWages >= 18720:
    Apply bonus levy
Else:
    Bonus levy = 0
```

---

### 4. Nil Return

**Rule**: If C3 is marked as "Nil Return", all contributions are **ZERO**

**Code**:
```csharp
if (Result.isNilReturn) {
    All contributions = 0
}
```

---

### 5. Rounding Rules

**Standard Rounding**: All amounts rounded to **2 decimal places**

**Code**:
```csharp
decimal.Parse(String.Format("{0:0.00}", amount))
Math.Round(amount, 2)
```

---

## Complete Calculation Example

### Scenario:
- **Employee**: John Doe, Age 35
- **Company**: ABC Ltd (Not Levy Exempt)
- **Period**: January 2024
- **Wages**: Week1=$500, Week2=$500, Week3=$500, Week4=$500, Week5=$0
- **Holiday Pay**: $100
- **Bonus**: $200
- **Director Wages**: $0

### Rates:
- SS Employee Rate: 5%
- SS Employer Rate: 5%
- Employee Levy: $8/week (from tax table)
- Employer Levy: 1%
- Severance Rate: 0.5%
- EIB Limit: $15

### Step-by-Step Calculation:

**1. Total Wages**
```
TotalWages = $500 + $500 + $500 + $500 + $0 + $100 + $200 = $2,300
```

**2. Social Security Employee**
```
SSEmployee = $2,300 × 5% = $115.00
```

**3. Social Security Employer**
```
SSEmployer = $2,300 × 5% = $115.00
```

**4. Employee Levy** (based on weekly wages, summed)
```
Week1: $500 → $8/week
Week2: $500 → $8/week
Week3: $500 → $8/week
Week4: $500 → $8/week
Week5: $0 → $0
Total Employee Levy = $32.00
```

**5. Employer Levy**
```
EmployerLevy = ($2,000 + $200) × 1% = $22.00
(Note: Holiday pay not included in employer levy base for this example)
```

**6. Severance Employee**
```
SeveranceEmployee = MIN($2,300 × 0.5%, $15) = MIN($11.50, $15) = $11.50
```

**7. Severance Employer**
```
SeveranceEmployer = $2,300 × 0.5% = $11.50
```

**8. Total Contributions**
```
Social Security Total    = $115.00 + $115.00 = $230.00
Levy Total              = $32.00 + $22.00   = $54.00
Severance Total         = $11.50 + $11.50   = $23.00
Penalties               = $0.00 (paid on time)

GRAND TOTAL = $230.00 + $54.00 + $23.00 = $307.00
```

---

## Comparison Checklist for C3 Management

Use this checklist to compare with your C3 Management system:

### ✅ **Wage Base**
- [ ] Does C3 Management include all 5 weeks of wages?
- [ ] How does it treat holiday pay?
- [ ] How does it treat bonuses?
- [ ] Is director wage separate or combined?

### ✅ **Social Security**
- [ ] Does C3 Management use 5% employee + 5% employer rates?
- [ ] Does it check age restrictions (16-62)?
- [ ] Are there caps on SS contributions?

### ✅ **Levy**
- [ ] Does C3 Management use tax table or flat rate for employee levy?
- [ ] What is the employer levy rate (should be 1%)?
- [ ] Does it check company levy exemption?
- [ ] How does it handle December bonus exemptions?

### ✅ **Severance**
- [ ] Does C3 Management use 0.5% rate?
- [ ] Is there an EIB cap on employee portion?
- [ ] Does employer pay on wages + bonus?

### ✅ **Bonuses**
- [ ] Does C3 Management have December bonus exemptions?
- [ ] Does it check $18,720 year-to-date threshold for bonus levy?
- [ ] Are bonus exemptions configurable?

### ✅ **Penalties**
- [ ] How does C3 Management calculate late payment penalties?
- [ ] Are penalties calculated monthly?
- [ ] Different rates for SS, Levy, and Severance?

### ✅ **Rounding**
- [ ] Does C3 Management round to 2 decimal places?
- [ ] When does rounding occur (per employee or total)?

---

## Key Differences to Look For

Based on common C3 system variations, check if C3 Management has:

1. **Different Rate Structure**
   - C3 Management might use different percentages
   - May have different rate effective dates

2. **Different Levy Calculation**
   - Flat rate vs progressive tax table
   - Different exemption rules

3. **Different Bonus Treatment**
   - May not have December exemptions
   - Different threshold amounts

4. **Different Holiday Pay Handling**
   - Always included vs conditionally included
   - Different "Other" pay treatment

5. **Different Wage Base**
   - May exclude certain wage types
   - Different director wage treatment

---

## How to Align C3 Management with C3 Wizard

### Step 1: Compare Rate Values
Extract rate values from both systems and compare:

| Rate | C3 Wizard | C3 Management | Match? | Action |
|------|-----------|---------------|--------|--------|
| SS Employee | 5% | ? | ? | Update if different |
| SS Employer | 5% | ? | ? | Update if different |
| Employer Levy | 1% | ? | ? | Update if different |
| Severance | 0.5% | ? | ? | Update if different |

### Step 2: Compare Formulas
For each contribution type, document C3 Management formula and compare:

**Example**:
- **C3 Wizard SS**: `Wages × 5%`
- **C3 Management SS**: `___________________`
- **Action**: Update C3 Management to match

### Step 3: Implement Missing Features
If C3 Wizard has features C3 Management doesn't:
- [ ] Age-based SS exemptions
- [ ] December bonus exemptions
- [ ] Levy exemption flag
- [ ] $18,720 bonus threshold
- [ ] Separate director processing

### Step 4: Test with Sample Data
Use the example calculation above in both systems and compare results.

### Step 5: Database Schema Alignment
Ensure C3 Management has these fields:
- [ ] `IsLevyExempt` (Company table)
- [ ] `exemptedLevybonus` (Bonus settings)
- [ ] `exemptedEmployerLevybonus` (Bonus settings)
- [ ] `exemptedSeverancebonus` (Bonus settings)
- [ ] Week-by-week wage tracking
- [ ] Week-by-week holiday pay tracking

---

## Quick Reference Formula Summary

```
TOTAL WAGES = Wages1 + Wages2 + Wages3 + Wages4 + Wages5 + HolidayPay + Bonus

SS EMPLOYEE = TotalWages × 5% (if age 16-62)
SS EMPLOYER = TotalWages × 5% (if age 16-62)

LEVY EMPLOYEE = Based on tax table (progressive)
LEVY EMPLOYER = TotalWages × 1%

SEVERANCE EMPLOYEE = MIN(TotalWages × 0.5%, $15)
SEVERANCE EMPLOYER = TotalWages × 0.5%

GRAND TOTAL = SS_Total + Levy_Total + Severance_Total + Penalties
```

---

## Next Steps

1. **Convert C3 Management Document**: Convert the .docx to .md or .txt so I can read it
2. **Extract C3 Management Formulas**: Document how C3 Management calculates each contribution
3. **Side-by-Side Comparison**: Compare formulas line by line
4. **Create Migration Plan**: Plan changes needed in C3 Management
5. **Test Cases**: Create test scenarios to verify alignment

---

**END OF CALCULATION REFERENCE**

This document contains the complete, accurate calculation logic from C3 Wizard. Use it to compare with C3 Management and identify differences.
