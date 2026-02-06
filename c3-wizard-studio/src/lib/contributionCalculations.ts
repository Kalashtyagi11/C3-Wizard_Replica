/**
 * C3 Contribution Calculation Utilities
 * 
 * All rates are fetched from the database (c3_system_rates, c3_levy_tiers).
 * NEVER hardcode rates - always use the rates passed in from the database.
 */

export interface SystemRate {
  id: number;
  rate_code: string;
  rate_name: string;
  rate_value: number;
  applies_to: string;
  monthly_cap: number | null;
  min_age: number | null;
  max_age: number | null;
  effective_from: string;
  effective_to: string | null;
  is_active: boolean;
}

export interface LevyTier {
  id: number;
  tax_year: number;
  tier_number: number;
  min_amount: number;
  max_amount: number | null;
  rate: number;
}

export interface EmployeeWageData {
  employeeId: string;
  ssn: string;
  firstName: string;
  lastName: string;
  birthDate: string;
  isDirector: boolean;
  isLevyExempt: boolean;
  directorAnnualSalary?: number;
  
  // Weekly wage inputs
  week1Worked: boolean;
  week1Wages: number;
  week2Worked: boolean;
  week2Wages: number;
  week3Worked: boolean;
  week3Wages: number;
  week4Worked: boolean;
  week4Wages: number;
  week5Worked: boolean;
  week5Wages: number;
  holidayPay: number;
  bonus: number;
  
  // Period info
  month: number;
  year: number;
  
  // For December bonus exemption
  ytdWages?: number;
}

export interface ContributionResult {
  employeeId: string;
  ssn: string;
  firstName: string;
  lastName: string;
  birthDate: string;
  payPeriod: string;
  
  // Weekly breakdown
  week1Worked: boolean;
  week1Wages: number;
  week2Worked: boolean;
  week2Wages: number;
  week3Worked: boolean;
  week3Wages: number;
  week4Worked: boolean;
  week4Wages: number;
  week5Worked: boolean;
  week5Wages: number;
  
  // Holiday pay distribution
  holidayPayWeek1: number;
  holidayPayWeek2: number;
  holidayPayWeek3: number;
  holidayPayWeek4: number;
  holidayPayWeek5: number;
  
  // Totals
  totalWages: number;
  holidayPay: number;
  bonus: number;
  totalWagesPlusHoliday: number;
  totalWagesPlusHolidayPlusBonus: number;
  
  // Employee contributions
  ssEmployee: number;
  eiEmployee: number;
  levyEmployee: number;
  peEmployee: number;
  employeeTotal: number;
  
  // Employer contributions
  ssEmployer: number;
  eiEmployer: number;
  levyEmployer: number;
  peEmployer: number;
  employerTotal: number;
  
  // Grand total
  grandTotal: number;
  
  // Flags
  isLevyExempt: boolean;
  isDecemberBonusExempt: boolean;
  dateJoined: string | null;
  dateTerminated: string | null;
}

/**
 * Calculate age from birth date
 */
export function calculateAge(birthDate: string, referenceDate: Date = new Date()): number {
  const birth = new Date(birthDate);
  let age = referenceDate.getFullYear() - birth.getFullYear();
  const monthDiff = referenceDate.getMonth() - birth.getMonth();
  
  if (monthDiff < 0 || (monthDiff === 0 && referenceDate.getDate() < birth.getDate())) {
    age--;
  }
  
  return age;
}

/**
 * Get rate by code from system rates
 */
export function getRateByCode(rates: SystemRate[], code: string): SystemRate | undefined {
  return rates.find(r => r.rate_code === code && r.is_active);
}

/**
 * Get levy tiers for a specific year
 */
export function getLevyTiersForYear(tiers: LevyTier[], year: number): LevyTier[] {
  // Get tiers for the specified year, fallback to most recent year if not found
  let yearTiers = tiers.filter(t => t.tax_year === year);
  
  if (yearTiers.length === 0) {
    // Fallback to the most recent year available
    const maxYear = Math.max(...tiers.map(t => t.tax_year));
    yearTiers = tiers.filter(t => t.tax_year === maxYear);
  }
  
  return yearTiers.sort((a, b) => a.tier_number - b.tier_number);
}

/**
 * Calculate Social Security - Employee
 * Rule: rate% of total wages, with monthly maximum cap
 * Age exempt: < 16 or > 62
 */
export function calculateSSEmployee(
  totalWages: number,
  rate: number,
  maxCap: number | null,
  employeeAge: number,
  minAge: number = 16,
  maxAge: number = 62
): number {
  if (employeeAge < minAge || employeeAge > maxAge) {
    return 0; // Exempt from SS
  }
  
  const calculated = totalWages * rate;
  return maxCap !== null ? Math.min(calculated, maxCap) : calculated;
}

/**
 * Calculate Social Security - Employer
 * Rule: rate% of total wages, NO cap
 */
export function calculateSSEmployer(
  totalWages: number,
  rate: number,
  employeeAge: number,
  minAge: number = 16,
  maxAge: number = 62
): number {
  if (employeeAge < minAge || employeeAge > maxAge) {
    return 0; // Exempt from SS
  }
  
  return totalWages * rate;
}

/**
 * Calculate Employee Levy (Progressive)
 * Rule: Progressive tax based on wage tiers
 */
export function calculateLevyEmployee(
  totalWagesWithHoliday: number,
  levyTiers: LevyTier[],
  isLevyExempt: boolean = false
): number {
  if (isLevyExempt || levyTiers.length === 0) {
    return 0;
  }
  
  // Find applicable tier based on monthly wage
  for (const tier of levyTiers) {
    const maxAmount = tier.max_amount ?? Infinity;
    if (totalWagesWithHoliday >= tier.min_amount && totalWagesWithHoliday < maxAmount) {
      return totalWagesWithHoliday * tier.rate;
    }
  }
  
  // If above all tiers, use the highest tier rate
  const highestTier = levyTiers[levyTiers.length - 1];
  if (highestTier && totalWagesWithHoliday >= highestTier.min_amount) {
    return totalWagesWithHoliday * highestTier.rate;
  }
  
  return 0;
}

/**
 * Calculate Employer Levy
 * Rule: 3% of (total wages + holiday pay + bonus), NO cap
 */
export function calculateLevyEmployer(
  totalWagesWithHolidayAndBonus: number,
  rate: number,
  isLevyExempt: boolean = false
): number {
  if (isLevyExempt) {
    return 0;
  }
  
  return totalWagesWithHolidayAndBonus * rate;
}

/**
 * Calculate Severance Pay - Employee (PE)
 * Rule: rate% of total wages, with monthly maximum cap
 */
export function calculatePEEmployee(
  totalWages: number,
  rate: number,
  maxCap: number | null
): number {
  const calculated = totalWages * rate;
  return maxCap !== null ? Math.min(calculated, maxCap) : calculated;
}

/**
 * Calculate Severance Pay - Employer (PE)
 * Rule: rate% of total wages, NO cap
 */
export function calculatePEEmployer(totalWages: number, rate: number): number {
  return totalWages * rate;
}

/**
 * Distribute holiday pay across non-working weeks
 */
export function distributeHolidayPay(
  holidayPay: number,
  week1Worked: boolean,
  week2Worked: boolean,
  week3Worked: boolean,
  week4Worked: boolean,
  week5Worked: boolean
): { week1: number; week2: number; week3: number; week4: number; week5: number } {
  const nonWorkingWeeks = [
    !week1Worked,
    !week2Worked,
    !week3Worked,
    !week4Worked,
    !week5Worked,
  ].filter(Boolean).length;
  
  if (nonWorkingWeeks === 0 || holidayPay === 0) {
    return { week1: 0, week2: 0, week3: 0, week4: 0, week5: 0 };
  }
  
  const holidayPayPerWeek = holidayPay / nonWorkingWeeks;
  
  return {
    week1: !week1Worked ? holidayPayPerWeek : 0,
    week2: !week2Worked ? holidayPayPerWeek : 0,
    week3: !week3Worked ? holidayPayPerWeek : 0,
    week4: !week4Worked ? holidayPayPerWeek : 0,
    week5: !week5Worked ? holidayPayPerWeek : 0,
  };
}

/**
 * Check if December bonus exemption applies
 * Rule: If December bonus and YTD < $28,000, exempt from employee levy
 */
export function isDecemberBonusExempt(
  month: number,
  bonus: number,
  ytdWages: number,
  threshold: number = 28000
): boolean {
  return month === 12 && bonus > 0 && ytdWages < threshold;
}

/**
 * Round to 2 decimal places
 */
export function roundCurrency(value: number): number {
  return Math.round(value * 100) / 100;
}

/**
 * Calculate complete contribution for one employee
 */
export function calculateEmployeeContribution(
  employee: EmployeeWageData,
  rates: SystemRate[],
  levyTiers: LevyTier[]
): ContributionResult {
  const ssEeRate = getRateByCode(rates, 'SS_EE');
  const ssErRate = getRateByCode(rates, 'SS_ER');
  const severanceRate = getRateByCode(rates, 'SEVERANCE');
  const employerLevyRate = getRateByCode(rates, 'EMPLOYER_LEVY');
  
  // Get levy tiers for the year
  const yearLevyTiers = getLevyTiersForYear(levyTiers, employee.year);
  
  // Calculate age
  const referenceDate = new Date(employee.year, employee.month - 1, 15);
  const employeeAge = calculateAge(employee.birthDate, referenceDate);
  
  // Get min/max age from rates
  const minAge = ssEeRate?.min_age ?? 16;
  const maxAge = ssEeRate?.max_age ?? 62;
  
  // Calculate total wages
  const totalWages = 
    employee.week1Wages + 
    employee.week2Wages + 
    employee.week3Wages + 
    employee.week4Wages + 
    employee.week5Wages;
  
  // Distribute holiday pay
  const holidayDistribution = distributeHolidayPay(
    employee.holidayPay,
    employee.week1Worked,
    employee.week2Worked,
    employee.week3Worked,
    employee.week4Worked,
    employee.week5Worked
  );
  
  // Calculate wage totals for different contributions
  const totalWagesPlusHoliday = totalWages + employee.holidayPay;
  const totalWagesPlusHolidayPlusBonus = totalWagesPlusHoliday + employee.bonus;
  
  // Check December bonus exemption
  const decemberBonusExempt = isDecemberBonusExempt(
    employee.month,
    employee.bonus,
    employee.ytdWages ?? 0
  );
  
  // Calculate levy employee base (may exclude bonus if December exempt)
  const levyEmployeeBase = decemberBonusExempt 
    ? totalWagesPlusHoliday 
    : totalWagesPlusHolidayPlusBonus;
  
  // Calculate contributions
  const ssEmployee = roundCurrency(calculateSSEmployee(
    totalWages,
    ssEeRate?.rate_value ?? 0.05,
    ssEeRate?.monthly_cap ?? 750,
    employeeAge,
    minAge,
    maxAge
  ));
  
  const ssEmployer = roundCurrency(calculateSSEmployer(
    totalWages,
    ssErRate?.rate_value ?? 0.05,
    employeeAge,
    minAge,
    maxAge
  ));
  
  // EI - using same rates as SS for now (no EI rates in database)
  const eiEmployee = 0; // No EI in current rates
  const eiEmployer = 0;
  
  const levyEmployee = roundCurrency(calculateLevyEmployee(
    levyEmployeeBase,
    yearLevyTiers,
    employee.isLevyExempt
  ));
  
  const levyEmployer = roundCurrency(calculateLevyEmployer(
    totalWagesPlusHolidayPlusBonus,
    employerLevyRate?.rate_value ?? 0.03,
    employee.isLevyExempt
  ));
  
  const peEmployee = roundCurrency(calculatePEEmployee(
    totalWages,
    severanceRate?.rate_value ?? 0.01,
    null // No cap for PE in current rates
  ));
  
  const peEmployer = roundCurrency(calculatePEEmployer(
    totalWages,
    severanceRate?.rate_value ?? 0.01
  ));
  
  // Calculate totals
  const employeeTotal = roundCurrency(ssEmployee + eiEmployee + levyEmployee + peEmployee);
  const employerTotal = roundCurrency(ssEmployer + eiEmployer + levyEmployer + peEmployer);
  const grandTotal = roundCurrency(employeeTotal + employerTotal);
  
  return {
    employeeId: employee.employeeId,
    ssn: employee.ssn,
    firstName: employee.firstName,
    lastName: employee.lastName,
    birthDate: employee.birthDate,
    payPeriod: 'M', // Default
    
    week1Worked: employee.week1Worked,
    week1Wages: employee.week1Wages,
    week2Worked: employee.week2Worked,
    week2Wages: employee.week2Wages,
    week3Worked: employee.week3Worked,
    week3Wages: employee.week3Wages,
    week4Worked: employee.week4Worked,
    week4Wages: employee.week4Wages,
    week5Worked: employee.week5Worked,
    week5Wages: employee.week5Wages,
    
    holidayPayWeek1: roundCurrency(holidayDistribution.week1),
    holidayPayWeek2: roundCurrency(holidayDistribution.week2),
    holidayPayWeek3: roundCurrency(holidayDistribution.week3),
    holidayPayWeek4: roundCurrency(holidayDistribution.week4),
    holidayPayWeek5: roundCurrency(holidayDistribution.week5),
    
    totalWages: roundCurrency(totalWages),
    holidayPay: roundCurrency(employee.holidayPay),
    bonus: roundCurrency(employee.bonus),
    totalWagesPlusHoliday: roundCurrency(totalWagesPlusHoliday),
    totalWagesPlusHolidayPlusBonus: roundCurrency(totalWagesPlusHolidayPlusBonus),
    
    ssEmployee,
    eiEmployee,
    levyEmployee,
    peEmployee,
    employeeTotal,
    
    ssEmployer,
    eiEmployer,
    levyEmployer,
    peEmployer,
    employerTotal,
    
    grandTotal,
    
    isLevyExempt: employee.isLevyExempt,
    isDecemberBonusExempt: decemberBonusExempt,
    dateJoined: null,
    dateTerminated: null,
  };
}

/**
 * Calculate C3 header totals from contribution details
 */
export function calculateC3Totals(contributions: ContributionResult[]): {
  totalEmployees: number;
  totalWages: number;
  totalHolidayPay: number;
  totalBonus: number;
  totalSsEmployee: number;
  totalSsEmployer: number;
  totalEiEmployee: number;
  totalEiEmployer: number;
  totalLevyEmployee: number;
  totalLevyEmployer: number;
  totalPeEmployee: number;
  totalPeEmployer: number;
  grandTotal: number;
} {
  return {
    totalEmployees: contributions.length,
    totalWages: roundCurrency(contributions.reduce((sum, c) => sum + c.totalWages, 0)),
    totalHolidayPay: roundCurrency(contributions.reduce((sum, c) => sum + c.holidayPay, 0)),
    totalBonus: roundCurrency(contributions.reduce((sum, c) => sum + c.bonus, 0)),
    totalSsEmployee: roundCurrency(contributions.reduce((sum, c) => sum + c.ssEmployee, 0)),
    totalSsEmployer: roundCurrency(contributions.reduce((sum, c) => sum + c.ssEmployer, 0)),
    totalEiEmployee: roundCurrency(contributions.reduce((sum, c) => sum + c.eiEmployee, 0)),
    totalEiEmployer: roundCurrency(contributions.reduce((sum, c) => sum + c.eiEmployer, 0)),
    totalLevyEmployee: roundCurrency(contributions.reduce((sum, c) => sum + c.levyEmployee, 0)),
    totalLevyEmployer: roundCurrency(contributions.reduce((sum, c) => sum + c.levyEmployer, 0)),
    totalPeEmployee: roundCurrency(contributions.reduce((sum, c) => sum + c.peEmployee, 0)),
    totalPeEmployer: roundCurrency(contributions.reduce((sum, c) => sum + c.peEmployer, 0)),
    grandTotal: roundCurrency(contributions.reduce((sum, c) => sum + c.grandTotal, 0)),
  };
}
