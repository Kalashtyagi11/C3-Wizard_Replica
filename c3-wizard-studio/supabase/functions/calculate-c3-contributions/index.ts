/**
 * C3 Contribution Calculation Edge Function
 * 
 * BACKEND-FIRST ARCHITECTURE:
 * All business logic for C3 calculations is in this Edge Function.
 * Frontend is UI-only and calls this API.
 * 
 * This function:
 * 1. Fetches system rates from c3_system_rates (data-driven)
 * 2. Fetches levy tiers from c3_levy_tiers (data-driven)
 * 3. Calculates SS, EI, Levy, PE contributions per employee
 * 4. Applies all business rules (age exemption, December bonus exemption)
 * 5. Saves results to c3_contribution_details
 * 6. Updates c3_contribution_headers with totals
 * 
 * CRITICAL: Uses $18,720 threshold for December bonus exemption (verified from legacy code)
 */

import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Interfaces
interface SystemRates {
  soc_ee_rate: number;         // Social Security Employee Rate (0.05 = 5%)
  soc_er_rate: number;         // Social Security Employer Rate (0.05 = 5%)
  eib_rate: number;            // Employment Insurance Rate (0.01 = 1%)
  eib_cap: number;             // EI Monthly Cap (150)
  soc_ee_cap: number;          // SS Employee Monthly Cap (750)
  severance_rate: number;      // Severance/PE Rate (0.05 = 5%)
  severance_cap: number;       // PE Employee Cap (750)
  employer_levy_rate: number;  // Employer Levy Rate (0.03 = 3%)
  min_age: number;             // Minimum age for SS (16)
  max_age: number;             // Maximum age for SS (62)
  december_bonus_threshold: number; // YTD threshold for bonus exemption (18720)
}

interface LevyTier {
  threshold_amount: number;
  tax_rate: number;
  tier_order: number;
}

interface EmployeeWageInput {
  employee_id: number;
  week1_wages: number;
  week2_wages: number;
  week3_wages: number;
  week4_wages: number;
  week5_wages: number;
  week1_worked: boolean;
  week2_worked: boolean;
  week3_worked: boolean;
  week4_worked: boolean;
  week5_worked: boolean;
  holiday_pay: number;
  bonus: number;
}

interface EmployeeRecord {
  id: number;
  social_security_number: string | null;
  first_name: string | null;
  last_name: string | null;
  date_of_birth: string | null;
  is_director: boolean | null;
  is_director_only: boolean | null;
  is_levy_exempt: boolean | null;
}

interface CalculationRequest {
  c3_header_id: number;
  company_id: number;
  month: number;
  year: number;
  employees: EmployeeWageInput[];
  save_to_db?: boolean;
}

interface CalculationResult {
  employee_id: number;
  ssn: string;
  first_name: string;
  last_name: string;
  date_of_birth: string;
  age: number;
  
  // Wages
  week1_wages: number;
  week2_wages: number;
  week3_wages: number;
  week4_wages: number;
  week5_wages: number;
  total_wages: number;
  holiday_pay: number;
  bonus: number;
  
  // Employee Contributions
  ss_employee: number;
  ei_employee: number;
  levy_employee: number;
  pe_employee: number;
  total_employee: number;
  
  // Employer Contributions
  ss_employer: number;
  ei_employer: number;
  levy_employer: number;
  pe_employer: number;
  total_employer: number;
  
  // Grand Total
  grand_total: number;
  
  // Flags
  is_age_exempt: boolean;
  is_levy_exempt: boolean;
  is_december_bonus_exempt: boolean;
}

// Utility: Round to 2 decimal places
function round2(value: number): number {
  return Math.round(value * 100) / 100;
}

// Calculate age as of reference date
function calculateAge(birthDate: Date, referenceDate: Date): number {
  let age = referenceDate.getFullYear() - birthDate.getFullYear();
  const monthDiff = referenceDate.getMonth() - birthDate.getMonth();
  
  if (monthDiff < 0 || (monthDiff === 0 && referenceDate.getDate() < birthDate.getDate())) {
    age--;
  }
  
  return age;
}

// Get YTD wages for an employee (for December bonus exemption check)
async function getYTDWages(
  supabase: any,
  employeeId: number,
  year: number,
  currentMonth: number
): Promise<number> {
  const { data } = await supabase
    .from('c3_contribution_details')
    .select('week1_wages, week2_wages, week3_wages, week4_wages, week5_wages, header_id')
    .eq('employee_id', employeeId);
  
  if (!data || data.length === 0) return 0;
  
  // Get header IDs for this year, months before current
  const { data: headers } = await supabase
    .from('c3_contribution_headers')
    .select('id')
    .eq('period_year', year.toString())
    .lt('period_month', currentMonth.toString());
  
  if (!headers || headers.length === 0) return 0;
  
  const headerIds = new Set(headers.map((h: any) => h.id));
  
  let ytd = 0;
  for (const detail of data) {
    if (headerIds.has(detail.header_id)) {
      ytd += (detail.week1_wages || 0) + (detail.week2_wages || 0) + 
             (detail.week3_wages || 0) + (detail.week4_wages || 0) + 
             (detail.week5_wages || 0);
    }
  }
  
  return ytd;
}

// Main calculation function
async function calculateContributions(
  supabase: any,
  request: CalculationRequest
): Promise<{ results: CalculationResult[]; totals: any; error: string | null }> {
  try {
    // Step 1: Fetch system rates from database (DATA-DRIVEN)
    const { data: ratesData, error: ratesError } = await supabase
      .from('c3_system_rates')
      .select('*')
      .order('effective_from', { ascending: false })
      .limit(1);
    
    if (ratesError || !ratesData || ratesData.length === 0) {
      console.log('Using default rates - no rates found in database');
    }
    
    const dbRates = ratesData?.[0];
    
    // Map database rates to our interface
    // Note: Database stores rates as percentages (5.00 = 5%), we need decimals (0.05)
    const rates: SystemRates = {
      soc_ee_rate: (dbRates?.employee_rate ?? 5) / 100,      // 5% -> 0.05
      soc_er_rate: (dbRates?.employer_rate ?? 5) / 100,      // 5% -> 0.05
      eib_rate: (dbRates?.eib_rate ?? 1) / 100,              // 1% -> 0.01
      eib_cap: 150,                                           // $150 monthly cap
      soc_ee_cap: 750,                                        // $750 monthly cap
      severance_rate: (dbRates?.severance_rate ?? 5) / 100,  // 5% -> 0.05 (was stored as 0.01 = 1%)
      severance_cap: 750,                                     // $750 monthly cap
      employer_levy_rate: 0.03,                               // 3% flat rate
      min_age: dbRates?.min_age ?? 16,
      max_age: dbRates?.max_age ?? 62,
      december_bonus_threshold: 18720,  // CRITICAL: Verified from legacy code, NOT $28,000
    };
    
    console.log('System rates loaded:', rates);
    
    // Step 2: Fetch levy tiers from database (DATA-DRIVEN)
    const { data: levyTiersData } = await supabase
      .from('c3_levy_tiers')
      .select('threshold_amount, tax_rate, tier_order')
      .eq('pay_period', 'M')  // Monthly tiers
      .order('tier_order', { ascending: true });
    
    // Default progressive levy tiers if none found
    // These match the documented tiers from VERIFIED_C3_CALCULATIONS.md
    const defaultLevyTiers: LevyTier[] = [
      { threshold_amount: 0, tax_rate: 0.00, tier_order: 0 },      // $0-$499: 0%
      { threshold_amount: 500, tax_rate: 0.01, tier_order: 1 },    // $500-$999: 1%
      { threshold_amount: 1000, tax_rate: 0.02, tier_order: 2 },   // $1000-$1499: 2%
      { threshold_amount: 1500, tax_rate: 0.03, tier_order: 3 },   // $1500-$1999: 3%
      { threshold_amount: 2000, tax_rate: 0.04, tier_order: 4 },   // $2000-$2999: 4%
      { threshold_amount: 3000, tax_rate: 0.05, tier_order: 5 },   // $3000+: 5%
    ];
    
    const levyTiers: LevyTier[] = levyTiersData && levyTiersData.length > 0 
      ? levyTiersData 
      : defaultLevyTiers;
    
    console.log('Levy tiers loaded:', levyTiers.length);
    
    // Step 3: Fetch employee details
    const employeeIds = request.employees.map(e => e.employee_id);
    const { data: employeesData, error: empError } = await supabase
      .from('c3_employees')
      .select('id, social_security_number, first_name, last_name, date_of_birth, is_director, is_director_only, is_levy_exempt')
      .in('id', employeeIds);
    
    if (empError) {
      throw new Error(`Failed to fetch employees: ${empError.message}`);
    }
    
    const employeeMap = new Map<number, EmployeeRecord>(
      (employeesData as EmployeeRecord[] || []).map((e) => [e.id, e])
    );
    
    // Step 4: Calculate contributions for each employee
    const results: CalculationResult[] = [];
    const referenceDate = new Date(request.year, request.month - 1, 15); // Mid-month reference
    
    for (const input of request.employees) {
      const employee = employeeMap.get(input.employee_id);
      if (!employee || !employee.date_of_birth) {
        console.warn(`Employee ${input.employee_id} not found or missing birth date, skipping`);
        continue;
      }
      
      const birthDate = new Date(employee.date_of_birth);
      const age = calculateAge(birthDate, referenceDate);
      const isAgeExempt = age < rates.min_age || age > rates.max_age;
      const isLevyExempt = Boolean(employee.is_levy_exempt);
      
      // Calculate total wages
      const totalWages = round2(
        input.week1_wages + input.week2_wages + input.week3_wages + 
        input.week4_wages + input.week5_wages
      );
      
      // Get YTD wages for December bonus exemption check
      let isDecemberBonusExempt = false;
      if (request.month === 12 && input.bonus > 0) {
        const ytdWages = await getYTDWages(supabase, input.employee_id, request.year, request.month);
        isDecemberBonusExempt = ytdWages < rates.december_bonus_threshold;
        console.log(`Employee ${input.employee_id}: YTD=$${ytdWages}, threshold=$${rates.december_bonus_threshold}, exempt=${isDecemberBonusExempt}`);
      }
      
      // === SOCIAL SECURITY ===
      // SS Employee: 5% of wages, capped at $750, age 16-62
      let ss_employee = 0;
      if (!isAgeExempt) {
        const calculated = totalWages * rates.soc_ee_rate;
        ss_employee = round2(Math.min(calculated, rates.soc_ee_cap));
      }
      
      // SS Employer: 5% of wages, NO CAP (but still age exempt)
      let ss_employer = 0;
      if (!isAgeExempt) {
        ss_employer = round2(totalWages * rates.soc_er_rate);
      }
      
      // === EMPLOYMENT INSURANCE ===
      // EI Employee: 1% of wages, capped at $150
      const ei_calc = totalWages * rates.eib_rate;
      const ei_employee = round2(Math.min(ei_calc, rates.eib_cap));
      
      // EI Employer: 1% of wages, capped at $150
      const ei_employer = round2(Math.min(ei_calc, rates.eib_cap));
      
      // === EMPLOYEE LEVY (Progressive) ===
      let levy_employee = 0;
      if (!isLevyExempt) {
        // Base for levy calculation
        let levyBase = totalWages + input.holiday_pay;
        
        // December bonus exemption: exclude bonus from employee levy if YTD < $18,720
        if (!isDecemberBonusExempt && input.bonus > 0) {
          levyBase += input.bonus;
        }
        
        // Find applicable tier
        let applicableRate = 0;
        for (let i = levyTiers.length - 1; i >= 0; i--) {
          if (levyBase >= levyTiers[i].threshold_amount) {
            applicableRate = levyTiers[i].tax_rate;
            break;
          }
        }
        
        levy_employee = round2(levyBase * applicableRate);
      }
      
      // === EMPLOYER LEVY ===
      // 3% of (wages + holiday + bonus), NO CAP, bonus ALWAYS included
      let levy_employer = 0;
      if (!isLevyExempt) {
        const levyBase = totalWages + input.holiday_pay + input.bonus;
        levy_employer = round2(levyBase * rates.employer_levy_rate);
      }
      
      // === SEVERANCE PAY / PE ===
      // PE Employee: 5% of wages, capped at $750
      const pe_calc = totalWages * rates.severance_rate;
      const pe_employee = round2(Math.min(pe_calc, rates.severance_cap));
      
      // PE Employer: 5% of wages, NO CAP
      const pe_employer = round2(totalWages * rates.severance_rate);
      
      // === TOTALS ===
      const total_employee = round2(ss_employee + ei_employee + levy_employee + pe_employee);
      const total_employer = round2(ss_employer + ei_employer + levy_employer + pe_employer);
      const grand_total = round2(total_employee + total_employer);
      
      results.push({
        employee_id: input.employee_id,
        ssn: employee.social_security_number || '',
        first_name: employee.first_name || '',
        last_name: employee.last_name || '',
        date_of_birth: employee.date_of_birth || '',
        age,
        
        week1_wages: input.week1_wages,
        week2_wages: input.week2_wages,
        week3_wages: input.week3_wages,
        week4_wages: input.week4_wages,
        week5_wages: input.week5_wages,
        total_wages: totalWages,
        holiday_pay: input.holiday_pay,
        bonus: input.bonus,
        
        ss_employee,
        ei_employee,
        levy_employee,
        pe_employee,
        total_employee,
        
        ss_employer,
        ei_employer,
        levy_employer,
        pe_employer,
        total_employer,
        
        grand_total,
        
        is_age_exempt: isAgeExempt,
        is_levy_exempt: isLevyExempt,
        is_december_bonus_exempt: isDecemberBonusExempt,
      });
    }
    
    // Step 5: Calculate totals
    const totals = {
      employee_count: results.length,
      total_wages: round2(results.reduce((sum, r) => sum + r.total_wages, 0)),
      total_holiday_pay: round2(results.reduce((sum, r) => sum + r.holiday_pay, 0)),
      total_bonus: round2(results.reduce((sum, r) => sum + r.bonus, 0)),
      total_ss_employee: round2(results.reduce((sum, r) => sum + r.ss_employee, 0)),
      total_ss_employer: round2(results.reduce((sum, r) => sum + r.ss_employer, 0)),
      total_ei_employee: round2(results.reduce((sum, r) => sum + r.ei_employee, 0)),
      total_ei_employer: round2(results.reduce((sum, r) => sum + r.ei_employer, 0)),
      total_levy_employee: round2(results.reduce((sum, r) => sum + r.levy_employee, 0)),
      total_levy_employer: round2(results.reduce((sum, r) => sum + r.levy_employer, 0)),
      total_pe_employee: round2(results.reduce((sum, r) => sum + r.pe_employee, 0)),
      total_pe_employer: round2(results.reduce((sum, r) => sum + r.pe_employer, 0)),
      total_employee: round2(results.reduce((sum, r) => sum + r.total_employee, 0)),
      total_employer: round2(results.reduce((sum, r) => sum + r.total_employer, 0)),
      grand_total: round2(results.reduce((sum, r) => sum + r.grand_total, 0)),
    };
    
    // Step 6: Save to database if requested
    if (request.save_to_db && request.c3_header_id) {
      // Delete existing details for this header (for recalculation)
      await supabase
        .from('c3_contribution_details')
        .delete()
        .eq('header_id', request.c3_header_id);
      
      // Insert new details
      const detailInserts = results.map(r => ({
        header_id: request.c3_header_id,
        employee_id: r.employee_id,
        social_security_number: r.ssn,
        period_month: request.month.toString(),
        period_year: request.year.toString(),
        week1_wages: r.week1_wages,
        week2_wages: r.week2_wages,
        week3_wages: r.week3_wages,
        week4_wages: r.week4_wages,
        week5_wages: r.week5_wages,
        total_holiday_pay: r.holiday_pay,
        bonus_amount: r.bonus,
        social_security_employee: r.ss_employee,
        social_security_employer: r.ss_employer,
        social_security_total: round2(r.ss_employee + r.ss_employer),
        ei_employee: r.ei_employee,
        ei_employer: r.ei_employer,
        levy_employee: r.levy_employee,
        levy_employer: r.levy_employer,
        severance_employee: r.pe_employee,
        severance_employer: r.pe_employer,
        is_finalized: false,
        is_submitted: false,
        created_at: new Date().toISOString(),
      }));
      
      if (detailInserts.length > 0) {
        const { error: insertError } = await supabase
          .from('c3_contribution_details')
          .insert(detailInserts);
        
        if (insertError) {
          console.error('Failed to insert details:', insertError);
        }
      }
      
      // Update header totals
      const { error: headerError } = await supabase
        .from('c3_contribution_headers')
        .update({
          employee_count: totals.employee_count,
          total_wages: totals.total_wages,
          total_holiday_pay: totals.total_holiday_pay,
          total_bonus: totals.total_bonus,
          total_ss_employee: totals.total_ss_employee,
          total_ss_employer: totals.total_ss_employer,
          total_social_security: round2(totals.total_ss_employee + totals.total_ss_employer),
          total_ei_employee: totals.total_ei_employee,
          total_ei_employer: totals.total_ei_employer,
          total_levy_employee: totals.total_levy_employee,
          total_levy_employer: totals.total_levy_employer,
          total_pe_employee: totals.total_pe_employee,
          total_pe_employer: totals.total_pe_employer,
          total_severance: round2(totals.total_pe_employee + totals.total_pe_employer),
          grand_total: totals.grand_total,
          updated_at: new Date().toISOString(),
        })
        .eq('id', request.c3_header_id);
      
      if (headerError) {
        console.error('Failed to update header:', headerError);
      }
    }
    
    return { results, totals, error: null };
    
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    console.error('Calculation error:', message);
    return { results: [], totals: null, error: message };
  }
}

serve(async (req) => {
  // Handle CORS
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }
  
  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);
    
    const request: CalculationRequest = await req.json();
    
    console.log(`Processing C3 calculation for company ${request.company_id}, period ${request.month}/${request.year}`);
    console.log(`Employees to process: ${request.employees.length}`);
    
    const { results, totals, error } = await calculateContributions(supabase, request);
    
    if (error) {
      return new Response(JSON.stringify({ error, results: [], totals: null }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      });
    }
    
    return new Response(JSON.stringify({
      success: true,
      results,
      totals,
      rates_used: {
        ss_rate: '5%',
        ei_rate: '1%',
        pe_rate: '5%',
        employer_levy_rate: '3%',
        ss_cap: 750,
        ei_cap: 150,
        pe_cap: 750,
        december_threshold: 18720,
      },
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    });
    
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Internal server error';
    console.error('Edge function error:', message);
    
    return new Response(JSON.stringify({ error: message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 500,
    });
  }
});
