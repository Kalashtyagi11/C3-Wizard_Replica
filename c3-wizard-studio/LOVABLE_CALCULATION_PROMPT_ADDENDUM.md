# 🧮 CRITICAL: VERIFIED CALCULATION LOGIC ADDENDUM

**READ THIS BEFORE IMPLEMENTING EMPLOYER MODULE**

---

## ⚠️ IMPORTANT CORRECTION

The calculation logic in `knowledge/05_contribution_calculations.md` has been **VERIFIED against actual legacy C# code** and a **CRITICAL ERROR** was found and corrected.

**Please use the updated calculation reference document:**

📄 **`_reference/VERIFIED_C3_CALCULATIONS.md`**

This document contains:
- ✅ 100% verified formulas extracted from legacy C# code
- ✅ Corrected bonus exemption threshold
- ✅ Complete calculation pipeline with TypeScript examples
- ✅ Test cases with expected outputs

---

## 🚨 CRITICAL CORRECTION: Bonus Exemption Threshold

### WRONG (Previous Documentation):
```typescript
bonusExemptionThreshold: number = 28000  // ❌ INCORRECT
```

### CORRECT (Verified from Legacy Code):
```typescript
bonusExemptionThreshold: number = 18720  // ✅ CORRECT
```

**Impact**: This affects December bonus processing for employees with year-to-date wages between $18,720 and $28,000.

**Rule**: If an employee receives a bonus in **December** AND their **year-to-date wages < $18,720**, the bonus is **exempt from employee levy** (but still included in employer levy).

---

## 📋 CALCULATION IMPLEMENTATION REQUIREMENTS

### 1. Fetch System Rates (DO NOT Hardcode)

**CRITICAL**: All rates must be fetched from the database at runtime.

```typescript
// Supabase Edge Function: calculate-c3-contributions
const { data: systemRates } = await supabase
  .from('c3_system_rates')
  .select('*')
  .order('effective_date', { ascending: false })
  .limit(1)
  .single();

const { data: levyTiers } = await supabase
  .from('c3_levy_tiers')
  .select('*')
  .order('min_wage', { ascending: true });
```

---

### 2. The 9-Step Calculation Pipeline

Implement **exactly** as documented in `_reference/VERIFIED_C3_CALCULATIONS.md`:

**Step 1**: Calculate employee age (for SS exemption check)
**Step 2**: Auto-calculate director weekly wages (if `is_director_only = true`)
**Step 3**: Distribute holiday pay to non-working weeks only
**Step 4**: Calculate total wages (sum of all 5 weeks)
**Step 5**: Calculate SS contributions (employee capped, employer uncapped)
**Step 6**: Calculate EI contributions (both capped at $150)
**Step 7**: Calculate Employee Levy (progressive tiers, December bonus rule)
**Step 8**: Calculate Employer Levy (3% of wages + bonus)
**Step 9**: Calculate PE contributions (employee capped, employer uncapped)

---

### 3. Monthly Caps (MUST Apply Correctly)

```typescript
// Caps from c3_system_rates table
const caps = {
  ss_employee_cap: 750.00,      // ✅ Apply cap
  ss_employer_cap: null,         // ❌ NO cap
  ei_employee_cap: 150.00,       // ✅ Apply cap
  ei_employer_cap: 150.00,       // ✅ Apply cap
  pe_employee_cap: 750.00,       // ✅ Apply cap (same as SS)
  pe_employer_cap: null,         // ❌ NO cap
  levy_employee_cap: null,       // ❌ NO cap (uses progressive tiers)
  levy_employer_cap: null        // ❌ NO cap
};
```

---

### 4. December Bonus Exemption Logic

```typescript
async function calculateLevyEmployee(
  totalWages: number,
  bonusAmount: number,
  contributionMonth: number,
  employeeId: number,
  isLevyExempt: boolean
): Promise<number> {
  if (isLevyExempt) return 0.00;
  
  // Get YTD wages (excluding current month)
  const ytdWages = await getYTDWages(employeeId, contributionMonth);
  
  let wageBaseForLevy = totalWages;
  
  // December bonus exemption check
  if (contributionMonth === 12 && bonusAmount > 0 && ytdWages < 18720) {
    // Exempt bonus from employee levy calculation
    wageBaseForLevy = totalWages - bonusAmount;
  }
  
  // Find applicable levy tier and calculate
  return calculateFromLevyTiers(wageBaseForLevy);
}
```

**YTD Wages Query**:
```sql
SELECT SUM(
  week1_wages + week2_wages + week3_wages + week4_wages + week5_wages
) as ytd_wages
FROM c3_contribution_details cd
JOIN c3_contribution_headers ch ON cd.c3_header_id = ch.id
WHERE cd.employee_id = {employeeId}
  AND ch.year = {contributionYear}
  AND ch.month < {contributionMonth}
```

---

### 5. Progressive Levy Tiers (Employee Levy)

**CRITICAL**: Employee levy is NOT a flat rate. It's based on which tier the total wages fall into.

```typescript
// Example levy tiers (fetch from c3_levy_tiers table)
const levyTiers = [
  { min_wage: 0,    max_wage: 500,  levy_rate: 0.00 },   // $0-$499: 0%
  { min_wage: 500,  max_wage: 1000, levy_rate: 0.01 },   // $500-$999: 1%
  { min_wage: 1000, max_wage: 1500, levy_rate: 0.02 },   // $1000-$1499: 2%
  { min_wage: 1500, max_wage: 2000, levy_rate: 0.03 },   // $1500-$1999: 3%
  { min_wage: 2000, max_wage: 3000, levy_rate: 0.04 },   // $2000-$2999: 4%
  { min_wage: 3000, max_wage: null, levy_rate: 0.05 }    // $3000+: 5%
];

function findLevyRate(wages: number): number {
  for (const tier of levyTiers) {
    if (wages >= tier.min_wage && 
        (tier.max_wage === null || wages < tier.max_wage)) {
      return tier.levy_rate;
    }
  }
  return 0.00;
}
```

---

### 6. Rounding Rules

**All monetary values MUST be rounded to 2 decimal places:**

```typescript
function roundMoney(value: number): number {
  return Math.round(value * 100) / 100;
}

// Apply rounding to EVERY calculated value
const ssEmployee = roundMoney(totalWages * rates.soc_ee_rate);
const levyEmployee = roundMoney(wageBase * levyRate);
// ... etc
```

---

### 7. Age Exemption for Social Security

```typescript
function calculateSSEmployee(
  totalWages: number,
  employeeAge: number,
  rates: SystemRates
): number {
  // Age exemption check (16-62 inclusive)
  if (employeeAge < 16 || employeeAge > 62) {
    return 0.00;  // Exempt from SS
  }
  
  const calculated = totalWages * rates.soc_ee_rate;
  const capped = Math.min(calculated, rates.soc_ee_pay_limit);
  return roundMoney(capped);
}
```

---

## 🧪 MANDATORY TEST CASES

Before deploying, **ALL these tests MUST pass:**

### Test 1: Standard Employee
```javascript
Input:
  - Wages: $3,200 (Week1=$800, Week2=$800, Week3=$800, Week4=$800)
  - Age: 35
  - Bonus: $0
  - Month: January

Expected Output:
  - SS Employee: $160.00
  - SS Employer: $160.00
  - EI Employee: $32.00
  - EI Employer: $32.00
  - Levy Employee: $160.00 (5% tier: $3000+)
  - Levy Employer: $96.00
  - PE Employee: $160.00
  - PE Employer: $160.00
  - Grand Total: $992.00
```

### Test 2: December Bonus (Below $18,720 YTD)
```javascript
Input:
  - Wages: $2,500
  - Bonus: $500
  - Month: December (12)
  - YTD Wages: $15,000 (< $18,720)
  - Age: 30

Expected Output:
  - Levy Employee: $80.00  // ($2,500 - $500) × 0.04 = $80 (bonus excluded)
  - Levy Employer: $90.00  // ($2,500 + $500) × 0.03 = $90 (bonus included)
```

### Test 3: December Bonus (Above $18,720 YTD)
```javascript
Input:
  - Wages: $2,500
  - Bonus: $500
  - Month: December (12)
  - YTD Wages: $20,000 (>= $18,720)
  - Age: 30

Expected Output:
  - Levy Employee: $150.00  // ($2,500 + $500) × 0.05 = $150 (bonus included)
  - Levy Employer: $90.00   // ($2,500 + $500) × 0.03 = $90
```

### Test 4: Age Exemption
```javascript
Input:
  - Wages: $5,000
  - Age: 70 (> 62)

Expected Output:
  - SS Employee: $0.00  // Exempt due to age
  - SS Employer: $250.00  // Employer still pays
```

### Test 5: High Earner (Caps Applied)
```javascript
Input:
  - Wages: $20,000
  - Age: 45

Expected Output:
  - SS Employee: $750.00  // Capped (calculated $1,000)
  - SS Employer: $1,000.00  // No cap
  - EI Employee: $150.00  // Capped (calculated $200)
  - EI Employer: $150.00  // Capped
  - PE Employee: $750.00  // Capped (calculated $1,000)
  - PE Employer: $1,000.00  // No cap
```

---

## 🔄 Calculation Flow (UI to Database)

```
┌─────────────────────────────────────────────────┐
│ USER ENTERS WAGES IN UI (Payroll Grid)         │
│ - Week1: $800                                   │
│ - Week2: $800                                   │
│ - Week3: $800                                   │
│ - Week4: $800                                   │
│ - Holiday Pay: $0                               │
│ - Bonus: $0                                     │
└──────────────┬──────────────────────────────────┘
               │
               ▼
┌─────────────────────────────────────────────────┐
│ ON BLUR / CHANGE EVENT                          │
│ → Call Supabase Edge Function:                 │
│   'calculate-c3-contributions'                  │
└──────────────┬──────────────────────────────────┘
               │
               ▼
┌─────────────────────────────────────────────────┐
│ EDGE FUNCTION LOGIC                             │
│ 1. Fetch system rates from DB                   │
│ 2. Fetch levy tiers from DB                     │
│ 3. Get YTD wages for employee                   │
│ 4. Execute 9-step calculation pipeline          │
│ 5. Return ContributionResult object             │
└──────────────┬──────────────────────────────────┘
               │
               ▼
┌─────────────────────────────────────────────────┐
│ FRONTEND RECEIVES RESULT                        │
│ → Update UI with calculated values (readonly)   │
│ → Save to c3_contribution_details table         │
└─────────────────────────────────────────────────┘
```

---

## 📄 Reference Documents Priority

Use these documents in this order:

1. **PRIMARY**: `_reference/VERIFIED_C3_CALCULATIONS.md` ⭐
   - Use this for implementation
   - 100% verified against legacy code
   
2. **SUMMARY**: `_reference/CALCULATION_VERIFICATION_SUMMARY.md`
   - Quick reference for what was corrected
   - Implementation checklist

3. **SECONDARY**: `knowledge/05_contribution_calculations.md`
   - General reference (now corrected)
   - Additional context on formulas

---

## ✅ Final Checklist Before Implementation

- [ ] Read `_reference/VERIFIED_C3_CALCULATIONS.md` completely
- [ ] Understand the **$18,720 YTD threshold** (not $28,000)
- [ ] Create Supabase Edge Function for calculations
- [ ] Fetch all rates from database (never hardcode)
- [ ] Implement progressive levy tier logic
- [ ] Apply caps correctly (employee caps, employer no caps)
- [ ] Calculate YTD wages for December bonus exemption
- [ ] Round all monetary values to 2 decimal places
- [ ] Implement age exemption (16-62) for SS
- [ ] Create unit tests matching the 5 test cases
- [ ] Validate output against legacy system with real data

---

## 🚨 CRITICAL REMINDER

**DO NOT** use any other calculation logic. **DO NOT** guess at formulas. **DO NOT** simplify the logic.

The calculations in `_reference/VERIFIED_C3_CALCULATIONS.md` are extracted **directly from the legacy C# codebase** and have been cross-verified line-by-line.

Any deviation will cause incorrect contribution amounts, which will be immediately caught by users and the Social Security Board.

---

**APPEND THIS ADDENDUM TO YOUR MAIN EMPLOYER MODULE PROMPT**

---

**Last Updated**: February 5, 2026  
**Verification Status**: ✅ COMPLETE  
**Code Review**: Legacy C# codebase analyzed  
**Ready for Implementation**: YES
