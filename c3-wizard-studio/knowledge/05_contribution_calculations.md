# 5. Contribution Calculations

## Overview

This document defines **all contribution calculation formulas** used in C3 Wizard. These calculations are the core business logic of the system and must be implemented **exactly** as specified to ensure regulatory compliance.

---

## Contribution Components

St. Kitts & Nevis social security contributions consist of **8 components**:

| Component | Code | Employee | Employer | Has Max Cap | Progressive |
|-----------|------|----------|----------|-------------|-------------|
| Social Security | SS | 5% | 5% | Yes (Ee) | No |
| Employment Insurance | EI | 1% | 1% | Yes (Both) | No |
| Employee Levy | LEVY_EE | Variable | - | No | **Yes** |
| Employer Levy | LEVY_ER | - | 3% | No | No |
| Severance Pay (PE) | PE | 5% | 5% | Yes (Ee) | No |

**Total Contribution** = SS(Ee+Er) + EI(Ee+Er) + LEVY(Ee+Er) + PE(Ee+Er)

---

## Rate Configuration

Rates are stored in `c3_system_rates` table and can be updated by admins:

```typescript
interface SystemRates {
  // Basic rates (percentages as decimals)
  ss_employee_rate: number;        // 0.05 (5%)
  ss_employer_rate: number;        // 0.05 (5%)
  ei_employee_rate: number;        // 0.01 (1%)
  ei_employer_rate: number;        // 0.01 (1%)
  levy_employer_rate: number;      // 0.03 (3%)
  pe_employee_rate: number;        // 0.05 (5%)
  pe_employer_rate: number;        // 0.05 (5%)
  
  // Maximum caps (monthly amounts in XCD)
  max_ss_employee_monthly: number; // e.g., 750.00
  max_ei_employee_monthly: number; // e.g., 150.00
  max_ei_employer_monthly: number; // e.g., 150.00
  max_pe_employee_monthly: number; // e.g., 750.00
  
  // Levy tiers (for employee progressive tax)
  levy_tiers: LevyTier[];
  
  // Penalty rates
  ss_penalty_rate: number;         // e.g., 0.02 per month
  levy_penalty_rate: number;
  pe_penalty_rate: number;
  
  // Special thresholds
  bonus_exemption_ytd_threshold: number;  // 28,000.00
  ss_min_age: number;              // 16
  ss_max_age: number;              // 62
  
  effective_date: Date;            // When these rates take effect
}

interface LevyTier {
  min_wage: number;   // Tier minimum (inclusive)
  max_wage: number | null;  // Tier maximum (exclusive), null = no limit
  rate: number;       // Levy rate for this tier (as decimal)
}

// Example levy tiers (sample - verify with actual regulations)
const levyTiers: LevyTier[] = [
  { min_wage: 0, max_wage: 500, rate: 0.00 },       // $0-$499.99: 0%
  { min_wage: 500, max_wage: 1000, rate: 0.01 },    // $500-$999.99: 1%
  { min_wage: 1000, max_wage: 1500, rate: 0.02 },   // $1000-$1499.99: 2%
  { min_wage: 1500, max_wage: 2000, rate: 0.03 },   // $1500-$1999.99: 3%
  { min_wage: 2000, max_wage: 3000, rate: 0.04 },   // $2000-$2999.99: 4%
  { min_wage: 3000, max_wage: null, rate: 0.05 },   // $3000+: 5%
];
```

---

## Calculation Formulas

### 1. Social Security (Employee)

**Rule**: 5% of total wages, with monthly maximum cap

```typescript
function calculateSSEmployee(totalWages: number, rate: number, maxCap: number): number {
  const calculated = totalWages * rate;
  return Math.min(calculated, maxCap);  // Apply cap
}

// Example:
// Wages = $10,000, Rate = 5%, Cap = $750
// Calculated = $10,000 × 0.05 = $500
// Final = min($500, $750) = $500 ✓

// Wages = $20,000, Rate = 5%, Cap = $750
// Calculated = $20,000 × 0.05 = $1,000
// Final = min($1,000, $750) = $750 ✓ (capped)
```

**Age Exemption**: If employee age < 16 or > 62, SS = $0

```typescript
function calculateSSEmployee(
  totalWages: number, 
  rate: number, 
  maxCap: number,
  employeeAge: number,
  minAge: number = 16,
  maxAge: number = 62
): number {
  if (employeeAge < minAge || employeeAge > maxAge) {
    return 0;  // Exempt from SS
  }
  const calculated = totalWages * rate;
  return Math.min(calculated, maxCap);
}
```

---

### 2. Social Security (Employer)

**Rule**: 5% of total wages, **no cap**

```typescript
function calculateSSEmployer(totalWages: number, rate: number): number {
  return totalWages * rate;
}

// Example:
// Wages = $20,000, Rate = 5%
// SS Employer = $20,000 × 0.05 = $1,000
```

---

### 3. Employment Insurance (Employee)

**Rule**: 1% of total wages, with monthly maximum cap

```typescript
function calculateEIEmployee(totalWages: number, rate: number, maxCap: number): number {
  const calculated = totalWages * rate;
  return Math.min(calculated, maxCap);
}

// Example:
// Wages = $18,000, Rate = 1%, Cap = $150
// Calculated = $18,000 × 0.01 = $180
// Final = min($180, $150) = $150 ✓ (capped)
```

---

### 4. Employment Insurance (Employer)

**Rule**: 1% of total wages, with monthly maximum cap

```typescript
function calculateEIEmployer(totalWages: number, rate: number, maxCap: number): number {
  const calculated = totalWages * rate;
  return Math.min(calculated, maxCap);
}

// Example (same as employee):
// Wages = $18,000, Rate = 1%, Cap = $150
// EI Employer = min($180, $150) = $150
```

---

### 5. Employee Levy (Progressive)

**Rule**: Progressive tax based on wage tiers, **no cap**

```typescript
function calculateLevyEmployee(totalWages: number, levyTiers: LevyTier[]): number {
  // Find applicable tier
  for (const tier of levyTiers) {
    if (totalWages >= tier.min_wage && (tier.max_wage === null || totalWages < tier.max_wage)) {
      return totalWages * tier.rate;
    }
  }
  return 0; // Should never reach here if tiers are complete
}

// Example with sample tiers:
// Wages = $800 → Tier: $500-$999.99 (1%) → Levy = $800 × 0.01 = $8
// Wages = $1,200 → Tier: $1000-$1499.99 (2%) → Levy = $1,200 × 0.02 = $24
// Wages = $4,500 → Tier: $3000+ (5%) → Levy = $4,500 × 0.05 = $225
```

---

### 6. Employer Levy

**Rule**: 3% of (total wages + bonuses), **no cap**

```typescript
function calculateLevyEmployer(
  totalWages: number, 
  totalBonuses: number, 
  rate: number
): number {
  return (totalWages + totalBonuses) * rate;
}

// Example:
// Wages = $5,000, Bonus = $500, Rate = 3%
// Levy = ($5,000 + $500) × 0.03 = $165
```

**📌 CRITICAL**: Bonuses are **included** in employer levy calculation!

---

### 7. Severance Pay / PE (Employee)

**Rule**: 5% of total wages, with monthly maximum cap

```typescript
function calculatePEEmployee(totalWages: number, rate: number, maxCap: number): number {
  const calculated = totalWages * rate;
  return Math.min(calculated, maxCap);
}

// Example:
// Wages = $12,000, Rate = 5%, Cap = $750
// Calculated = $12,000 × 0.05 = $600
// Final = min($600, $750) = $600 ✓
```

---

### 8. Severance Pay / PE (Employer)

**Rule**: 5% of total wages, **no cap**

```typescript
function calculatePEEmployer(totalWages: number, rate: number): number {
  return totalWages * rate;
}
```

---

## Special Calculation Rules

### Bonus Exemption (December)

**Rule**: If an employee receives a bonus in December AND their year-to-date wages < $18,720, the bonus is **exempt from employee levy** (but still included in employer levy).

```typescript
function calculateLevyEmployeeWithBonusExemption(
  totalWages: number,
  bonus: number,
  levyTiers: LevyTier[],
  ytdWages: number,
  bonusExemptionThreshold: number = 18720,  // VERIFIED: Legacy code uses $18,720 NOT $28,000
  isDecember: boolean
): number {
  let wageBaseForLevy = totalWages;
  
  // Check if December bonus exemption applies
  if (isDecember && bonus > 0 && ytdWages < bonusExemptionThreshold) {
    // Exclude bonus from employee levy calculation
    wageBaseForLevy = totalWages - bonus;
  }
  
  return calculateLevyEmployee(wageBaseForLevy, levyTiers);
}

// Example 1: December, YTD = $15,000 (< $18,720)
// Wages = $2,000, Bonus = $500
// Wage base = $2,000 - $500 = $1,500 (bonus excluded)
// Employee Levy = $1,500 × tier rate

// Example 2: December, YTD = $20,000 (≥ $18,720)
// Wages = $2,000, Bonus = $500
// Wage base = $2,000 + $500 = $2,500 (bonus included)
// Employee Levy = $2,500 × tier rate
```

**Employer Levy**: Bonus is **always** included regardless of YTD

---

### Holiday Pay Distribution

**Rule**: Holiday pay should be distributed across non-working weeks for levy calculation purposes.

```typescript
interface WeeklyWages {
  week1: number;
  week2: number;
  week3: number;
  week4: number;
  week5: number;
  workedWeek1: boolean;
  workedWeek2: boolean;
  workedWeek3: boolean;
  workedWeek4: boolean;
  workedWeek5: boolean;
  holidayPay: number;
}

function distributeHolidayPay(wages: WeeklyWages): WeeklyWages {
  const nonWorkingWeeks = [
    !wages.workedWeek1,
    !wages.workedWeek2,
    !wages.workedWeek3,
    !wages.workedWeek4,
    !wages.workedWeek5,
  ].filter(Boolean).length;
  
  if (nonWorkingWeeks === 0 || wages.holidayPay === 0) {
    return wages; // No distribution needed
  }
  
  const holidayPayPerWeek = wages.holidayPay / nonWorkingWeeks;
  
  return {
    ...wages,
    week1: !wages.workedWeek1 ? wages.week1 + holidayPayPerWeek : wages.week1,
    week2: !wages.workedWeek2 ? wages.week2 + holidayPayPerWeek : wages.week2,
    week3: !wages.workedWeek3 ? wages.week3 + holidayPayPerWeek : wages.week3,
    week4: !wages.workedWeek4 ? wages.week4 + holidayPayPerWeek : wages.week4,
    week5: !wages.workedWeek5 ? wages.week5 + holidayPayPerWeek : wages.week5,
  };
}

// Example:
// Worked weeks: 1, 2, 4 (did not work weeks 3, 5)
// Holiday pay: $400
// Distribution: $400 ÷ 2 = $200 per non-working week
// Week 3 += $200, Week 5 += $200
```

**Purpose**: Ensures levy is calculated on evenly distributed income

---

### Director Wage Calculation

**Rule**: Non-working directors have auto-calculated weekly wages from annual salary

```typescript
function calculateDirectorWeeklyWage(annualSalary: number, weeksInMonth: number = 4): number {
  const monthlyWage = annualSalary / 12;
  const weeklyWage = monthlyWage / weeksInMonth;
  return weeklyWage;
}

// Example:
// Director annual salary: $60,000
// Monthly wage: $60,000 ÷ 12 = $5,000
// Weekly wage: $5,000 ÷ 4 = $1,250
// C3 form: Week1 = $1,250, Week2 = $1,250, Week3 = $1,250, Week4 = $1,250
```

---

## Penalty Calculations

### Late Submission Penalties

Penalties apply when C3 forms are submitted after the due date.

**Due Date**: 15th of the month following the contribution period
- Example: January 2026 C3 is due by February 15, 2026

```typescript
function calculatePenalties(
  contribution: ContributionBreakdown,
  submittedDate: Date,
  dueDate: Date,
  penaltyRates: { ss: number; levy: number; pe: number }
): PenaltyBreakdown {
  if (submittedDate <= dueDate) {
    return { ssPenalty: 0, levyPenalty: 0, pePenalty: 0 };
  }
  
  const daysLate = Math.floor(
    (submittedDate.getTime() - dueDate.getTime()) / (1000 * 60 * 60 * 24)
  );
  const monthsLate = Math.ceil(daysLate / 30);
  
  return {
    ssPenalty: (contribution.ssEmployee + contribution.ssEmployer) * penaltyRates.ss * monthsLate,
    levyPenalty: (contribution.levyEmployee + contribution.levyEmployer) * penaltyRates.levy * monthsLate,
    pePenalty: (contribution.peEmployee + contribution.peEmployer) * penaltyRates.pe * monthsLate,
  };
}

// Example:
// Due: Feb 15, 2026
// Submitted: Mar 20, 2026 (33 days late = 2 months)
// SS Total = $1,000, Penalty Rate = 2% per month
// SS Penalty = $1,000 × 0.02 × 2 = $40
```

---

## Complete Calculation Pipeline

Here's the complete calculation flow for one employee's C3 contribution:

```typescript
interface EmployeeWageData {
  employeeId: number;
  ssn: string;
  firstName: string;
  lastName: string;
  birthDate: Date;
  isDirector: boolean;
  isLevyExempt: boolean;
  directorAnnualSalary?: number;
  
  // Wage inputs
  week1Wages: number;
  week2Wages: number;
  week3Wages: number;
  week4Wages: number;
  week5Wages: number;
  workedWeek1: boolean;
  workedWeek2: boolean;
  workedWeek3: boolean;
  workedWeek4: boolean;
  workedWeek5: boolean;
  holidayPay: number;
  bonus: number;
  
  // Period info
  contributionPeriod: { month: number; year: number };
}

interface ContributionResult {
  employeeId: number;
  
  // Input summary
  totalWages: number;
  totalBonus: number;
  totalHolidayPay: number;
  
  // Contributions
  ssEmployee: number;
  ssEmployer: number;
  eiEmployee: number;
  eiEmployer: number;
  levyEmployee: number;
  levyEmployer: number;
  peEmployee: number;
  peEmployer: number;
  
  // Totals
  totalEmployee: number;
  totalEmployer: number;
  grandTotal: number;
}

async function calculateEmployeeContribution(
  employeeData: EmployeeWageData,
  rates: SystemRates
): Promise<ContributionResult> {
  // 1. Calculate director wages if applicable
  let wages = { ...employeeData };
  if (employeeData.isDirector && employeeData.directorAnnualSalary) {
    const weeklyWage = calculateDirectorWeeklyWage(employeeData.directorAnnualSalary);
    wages.week1Wages = weeklyWage;
    wages.week2Wages = weeklyWage;
    wages.week3Wages = weeklyWage;
    wages.week4Wages = weeklyWage;
    wages.week5Wages = 0; // 4 weeks only
  }
  
  // 2. Distribute holiday pay
  wages = distributeHolidayPay(wages);
  
  // 3. Calculate total wages
  const totalWages = 
    wages.week1Wages + 
    wages.week2Wages + 
    wages.week3Wages + 
    wages.week4Wages + 
    wages.week5Wages;
  
  // 4. Calculate employee age
  const employeeAge = calculateAge(employeeData.birthDate);
  
  // 5. Calculate each contribution component
  const ssEmployee = calculateSSEmployee(
    totalWages, 
    rates.ss_employee_rate, 
    rates.max_ss_employee_monthly,
    employeeAge,
    rates.ss_min_age,
    rates.ss_max_age
  );
  
  const ssEmployer = calculateSSEmployer(totalWages, rates.ss_employer_rate);
  
  const eiEmployee = calculateEIEmployee(
    totalWages, 
    rates.ei_employee_rate, 
    rates.max_ei_employee_monthly
  );
  
  const eiEmployer = calculateEIEmployer(
    totalWages, 
    rates.ei_employer_rate, 
    rates.max_ei_employer_monthly
  );
  
  // 6. Calculate levy (check exemption)
  let levyEmployee = 0;
  if (!employeeData.isLevyExempt) {
    const ytdWages = await getYTDWages(employeeData.employeeId, employeeData.contributionPeriod);
    const isDecember = employeeData.contributionPeriod.month === 12;
    levyEmployee = calculateLevyEmployeeWithBonusExemption(
      totalWages,
      wages.bonus,
      rates.levy_tiers,
      ytdWages,
      rates.bonus_exemption_ytd_threshold,
      isDecember
    );
  }
  
  const levyEmployer = calculateLevyEmployer(
    totalWages, 
    wages.bonus, 
    rates.levy_employer_rate
  );
  
  const peEmployee = calculatePEEmployee(
    totalWages, 
    rates.pe_employee_rate, 
    rates.max_pe_employee_monthly
  );
  
  const peEmployer = calculatePEEmployer(totalWages, rates.pe_employer_rate);
  
  // 7. Calculate totals
  const totalEmployee = ssEmployee + eiEmployee + levyEmployee + peEmployee;
  const totalEmployer = ssEmployer + eiEmployer + levyEmployer + peEmployer;
  const grandTotal = totalEmployee + totalEmployer;
  
  return {
    employeeId: employeeData.employeeId,
    totalWages,
    totalBonus: wages.bonus,
    totalHolidayPay: wages.holidayPay,
    ssEmployee,
    ssEmployer,
    eiEmployee,
    eiEmployer,
    levyEmployee,
    levyEmployer,
    peEmployee,
    peEmployer,
    totalEmployee,
    totalEmployer,
    grandTotal,
  };
}
```

---

## Validation Rules

Before accepting wage input, validate:

### Wage Validation
```typescript
// Weekly wages must be >= 0
if (wages < 0) throw new Error("Wages cannot be negative");

// If week worked = true, wages should be > 0
if (workedWeek && wages === 0) {
  warn("Week marked as worked but wages = $0");
}

// If week worked = false, wages should be 0 (unless holiday pay distributed)
if (!workedWeek && wages > 0 && holidayPay === 0) {
  warn("Week marked as not worked but wages > $0");
}
```

### Bonus Validation
```typescript
// Bonus must be >= 0
if (bonus < 0) throw new Error("Bonus cannot be negative");

// Warn if December bonus > threshold (may trigger exemption)
if (isDecember && bonus > 5000) {
  warn("Large December bonus detected - verify bonus exemption applies");
}
```

### Holiday Pay Validation
```typescript
// Holiday pay must be >= 0
if (holidayPay < 0) throw new Error("Holiday pay cannot be negative");

// If holiday pay > 0, must have at least one non-working week
const nonWorkingWeeks = [!week1, !week2, !week3, !week4, !week5].filter(Boolean).length;
if (holidayPay > 0 && nonWorkingWeeks === 0) {
  throw new Error("Holiday pay requires at least one non-working week");
}
```

---

## Testing Checklist

Test all these scenarios:

✅ **Basic Calculations**
- [ ] Low wage employee (below all caps)
- [ ] High wage employee (exceeds all caps)
- [ ] Multiple wage tiers for levy

✅ **Special Cases**
- [ ] Employee age < 16 (SS exempt)
- [ ] Employee age > 62 (SS exempt)
- [ ] Employee with levy exemption flag
- [ ] Non-working director with annual salary

✅ **Bonus Scenarios**
- [ ] December bonus, YTD < $28k (employee levy exempt)
- [ ] December bonus, YTD ≥ $28k (employee levy NOT exempt)
- [ ] Non-December bonus (always included)

✅ **Holiday Pay**
- [ ] Holiday pay distributed across 2 non-working weeks
- [ ] Holiday pay distributed across 1 non-working week
- [ ] No holiday pay (all weeks worked)

✅ **Edge Cases**
- [ ] Zero wages (all weeks = $0)
- [ ] Partial month (employee started mid-month)
- [ ] 5-week month vs 4-week month
- [ ] Negative values (should reject)

---

**Next**: See [16_calculation_formulas_reference.md](16_calculation_formulas_reference.md) for even more detailed formula derivations and regulatory references.
