/**
 * C3 Form Generation Hook
 * 
 * BACKEND-FIRST ARCHITECTURE:
 * This hook calls the calculate-c3-contributions Edge Function for ALL calculations.
 * No business logic is performed on the frontend.
 */

import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';
import { useEmployees, Employee } from './useEmployees';
import type { Database } from '@/integrations/supabase/types';

type DbC3Header = Database['public']['Tables']['c3_contribution_headers']['Row'];
type DbC3Detail = Database['public']['Tables']['c3_contribution_details']['Row'];

export type C3Header = DbC3Header;
export type C3Detail = DbC3Detail;

export interface EmployeeWageInput {
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

export interface CalculationResult {
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

export interface CalculationTotals {
  employee_count: number;
  total_wages: number;
  total_holiday_pay: number;
  total_bonus: number;
  total_ss_employee: number;
  total_ss_employer: number;
  total_ei_employee: number;
  total_ei_employer: number;
  total_levy_employee: number;
  total_levy_employer: number;
  total_pe_employee: number;
  total_pe_employer: number;
  total_employee: number;
  total_employer: number;
  grand_total: number;
}

export interface C3FormData {
  month: number;
  year: number;
  employees: EmployeeWageInput[];
  isNilReturn?: boolean;
}

export function useC3Generation() {
  const [c3Headers, setC3Headers] = useState<C3Header[]>([]);
  const [c3Details, setC3Details] = useState<C3Detail[]>([]);
  const [currentC3, setCurrentC3] = useState<C3Header | null>(null);
  const [calculatedResults, setCalculatedResults] = useState<CalculationResult[]>([]);
  const [calculatedTotals, setCalculatedTotals] = useState<CalculationTotals | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isCalculating, setIsCalculating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const { role, companyId: authCompanyId } = useAuth();
  const { employees, companyId: empCompanyId } = useEmployees();
  
  const companyId = authCompanyId ?? empCompanyId;

  const fetchC3Headers = useCallback(async (filterCompanyId?: number) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const targetCompanyId = filterCompanyId ?? companyId;
      
      let query = supabase
        .from('c3_contribution_headers')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (targetCompanyId && role === 'employer') {
        query = query.eq('company_id', targetCompanyId);
      }
      
      const { data, error: fetchError } = await query;
      if (fetchError) throw fetchError;
      setC3Headers(data || []);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to fetch C3 headers';
      setError(message);
    } finally {
      setIsLoading(false);
    }
  }, [companyId, role]);

  const fetchC3Details = useCallback(async (headerId: number) => {
    setIsLoading(true);
    try {
      const { data, error: fetchError } = await supabase
        .from('c3_contribution_details')
        .select('*')
        .eq('header_id', headerId);
      
      if (fetchError) throw fetchError;
      setC3Details(data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch C3 details');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const createC3Header = async (month: number, year: number, isNilReturn: boolean = false) => {
    try {
      if (!companyId) return { headerId: null, error: 'No company ID found' };

      // Check if C3 already exists for this period
      const { data: existing } = await supabase
        .from('c3_contribution_headers')
        .select('id')
        .eq('company_id', companyId)
        .eq('period_month', month.toString())
        .eq('period_year', year.toString())
        .maybeSingle();

      if (existing) return { headerId: existing.id, error: null, exists: true };

      const { data, error: insertError } = await supabase
        .from('c3_contribution_headers')
        .insert({
          company_id: companyId,
          period_month: month.toString(),
          period_year: year.toString(),
          is_submitted: false,
          is_finalized: false,
          is_nil_return: isNilReturn,
          created_at: new Date().toISOString(),
        })
        .select()
        .single();

      if (insertError) throw insertError;
      setCurrentC3(data);
      return { headerId: data.id, error: null, exists: false };
    } catch (err) {
      return { headerId: null, error: err instanceof Error ? err.message : 'Failed to create C3 header', exists: false };
    }
  };

  /**
   * Calculate contributions using the backend Edge Function
   * ALL business logic is performed server-side
   */
  const calculateContributions = async (
    headerId: number | null,
    formData: C3FormData,
    saveToDb: boolean = false
  ): Promise<{ results: CalculationResult[]; totals: CalculationTotals | null; error: string | null }> => {
    setIsCalculating(true);
    setError(null);
    
    try {
      if (!companyId) {
        throw new Error('No company ID found');
      }

      // Call the Edge Function for calculations
      const { data, error: funcError } = await supabase.functions.invoke('calculate-c3-contributions', {
        body: {
          c3_header_id: headerId,
          company_id: companyId,
          month: formData.month,
          year: formData.year,
          employees: formData.employees,
          save_to_db: saveToDb,
        },
      });

      if (funcError) {
        throw new Error(funcError.message || 'Calculation failed');
      }

      if (data.error) {
        throw new Error(data.error);
      }

      const results: CalculationResult[] = data.results || [];
      const totals: CalculationTotals = data.totals || null;

      setCalculatedResults(results);
      setCalculatedTotals(totals);

      console.log('Calculation complete:', { 
        employees: results.length, 
        grandTotal: totals?.grand_total,
        rates: data.rates_used 
      });

      return { results, totals, error: null };
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Calculation failed';
      setError(message);
      return { results: [], totals: null, error: message };
    } finally {
      setIsCalculating(false);
    }
  };

  /**
   * Generate a complete C3 form
   * Creates header, calculates contributions, saves everything to database
   */
  const generateC3 = async (formData: C3FormData): Promise<{ headerId: number | null; error: string | null }> => {
    try {
      // Step 1: Create or get existing C3 header
      const { headerId, error: headerError, exists } = await createC3Header(
        formData.month, 
        formData.year,
        formData.isNilReturn
      );
      
      if (headerError || !headerId) {
        return { headerId: null, error: headerError || 'Failed to create C3 header' };
      }

      // Step 2: Calculate and save contributions (if not nil return)
      if (!formData.isNilReturn && formData.employees.length > 0) {
        const { error: calcError } = await calculateContributions(headerId, formData, true);
        if (calcError) {
          return { headerId, error: calcError };
        }
      }

      // Step 3: Refresh headers list
      await fetchC3Headers();
      
      return { headerId, error: null };
    } catch (err) {
      return { headerId: null, error: err instanceof Error ? err.message : 'Failed to generate C3' };
    }
  };

  const finalizeC3 = async (headerId: number) => {
    try {
      const { error: updateError } = await supabase
        .from('c3_contribution_headers')
        .update({
          is_finalized: true,
          finalized_at: new Date().toISOString(),
        })
        .eq('id', headerId);
      
      if (updateError) throw updateError;
      await fetchC3Headers();
      return { error: null };
    } catch (err) {
      return { error: err instanceof Error ? err.message : 'Failed to finalize C3' };
    }
  };

  const submitC3 = async (headerId: number) => {
    try {
      const { error: updateError } = await supabase
        .from('c3_contribution_headers')
        .update({
          is_submitted: true,
          submitted_at: new Date().toISOString(),
        })
        .eq('id', headerId);
      
      if (updateError) throw updateError;
      await fetchC3Headers();
      return { error: null };
    } catch (err) {
      return { error: err instanceof Error ? err.message : 'Failed to submit C3' };
    }
  };

  const deleteC3 = async (headerId: number) => {
    try {
      // Delete details first (foreign key constraint)
      await supabase.from('c3_contribution_details').delete().eq('header_id', headerId);
      
      // Delete header
      const { error: deleteError } = await supabase
        .from('c3_contribution_headers')
        .delete()
        .eq('id', headerId);
      
      if (deleteError) throw deleteError;
      await fetchC3Headers();
      return { error: null };
    } catch (err) {
      return { error: err instanceof Error ? err.message : 'Failed to delete C3' };
    }
  };

  // Load C3 headers on mount if company ID is available
  useEffect(() => {
    if (companyId) {
      fetchC3Headers(companyId);
    }
  }, [companyId, fetchC3Headers]);

  return {
    // Data
    c3Headers,
    c3Details,
    currentC3,
    calculatedResults,
    calculatedTotals,
    employees,
    companyId,
    
    // State
    isLoading,
    isCalculating,
    error,
    
    // Actions
    fetchC3Headers,
    fetchC3Details,
    createC3Header,
    calculateContributions,
    generateC3,
    finalizeC3,
    submitC3,
    deleteC3,
  };
}
