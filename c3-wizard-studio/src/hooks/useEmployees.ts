/**
 * Employee Management Hook
 * Connects to optimised c3_employees table
 */

import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';
import type { Database } from '@/integrations/supabase/types';

// Use database types directly
type DbEmployee = Database['public']['Tables']['c3_employees']['Row'];
export type Employee = DbEmployee;

export function useEmployees() {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [companyId, setCompanyId] = useState<number | null>(null);
  const { user, role } = useAuth();

  // Get company ID for employer users from c3_users table
  useEffect(() => {
    const getCompanyId = async () => {
      if (!user || role !== 'employer') return;
      
      try {
        // Get the company via c3_users -> c3_companies
        const { data: c3User } = await supabase
          .from('c3_users')
          .select('company_id')
          .eq('email', user.email)
          .single();
        
        if (c3User?.company_id) {
          setCompanyId(c3User.company_id);
        }
      } catch (err) {
        console.error('Error fetching company ID:', err);
      }
    };
    
    getCompanyId();
  }, [user, role]);

  const fetchEmployees = useCallback(async (filterCompanyId?: number) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const targetCompanyId = filterCompanyId ?? companyId;
      
      let query = supabase
        .from('c3_employees')
        .select('*')
        .eq('is_deleted', false)
        .order('last_name', { ascending: true });
      
      if (targetCompanyId) {
        query = query.eq('company_id', targetCompanyId);
      }
      
      const { data, error: fetchError } = await query;
      
      if (fetchError) throw fetchError;
      setEmployees(data || []);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to fetch employees';
      setError(message);
      console.error('Error fetching employees:', err);
    } finally {
      setIsLoading(false);
    }
  }, [companyId]);

  const addEmployee = async (employeeData: Partial<Employee>) => {
    try {
      const targetCompanyId = employeeData.company_id ?? companyId;
      if (!targetCompanyId) {
        return { employee: null, error: 'Company ID is required' };
      }

      const insertData: Database['public']['Tables']['c3_employees']['Insert'] = {
        company_id: targetCompanyId,
        first_name: employeeData.first_name ?? 'Unknown',
        last_name: employeeData.last_name ?? 'Unknown',
        middle_name: employeeData.middle_name ?? null,
        social_security_number: employeeData.social_security_number ?? null,
        date_of_birth: employeeData.date_of_birth ?? null,
        gender: employeeData.gender ?? null,
        marital_status: employeeData.marital_status ?? null,
        email: employeeData.email ?? null,
        phone: employeeData.phone ?? null,
        mobile: employeeData.mobile ?? null,
        address_line1: employeeData.address_line1 ?? null,
        address_line2: employeeData.address_line2 ?? null,
        city: employeeData.city ?? null,
        state: employeeData.state ?? null,
        country: employeeData.country ?? null,
        postal_code: employeeData.postal_code ?? null,
        hire_date: employeeData.hire_date ?? null,
        termination_date: employeeData.termination_date ?? null,
        department: employeeData.department ?? null,
        occupation: employeeData.occupation ?? null,
        employment_status: employeeData.employment_status ?? null,
        pay_period: employeeData.pay_period ?? null,
        employee_code: employeeData.employee_code ?? null,
        bank_account_number: employeeData.bank_account_number ?? null,
        tin: employeeData.tin ?? null,
        is_director: employeeData.is_director ?? null,
        is_director_only: employeeData.is_director_only ?? null,
        is_levy_exempt: employeeData.is_levy_exempt ?? null,
        is_deleted: false,
        created_at: new Date().toISOString(),
      };
      
      const { data, error: insertError } = await supabase
        .from('c3_employees')
        .insert(insertData)
        .select()
        .single();
      
      if (insertError) throw insertError;
      
      await fetchEmployees();
      return { employee: data, error: null };
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to add employee';
      return { employee: null, error: message };
    }
  };

  const updateEmployee = async (employeeId: number, updates: Partial<Employee>) => {
    try {
      const updateData = {
        ...updates,
        updated_at: new Date().toISOString(),
      };
      
      const { error: updateError } = await supabase
        .from('c3_employees')
        .update(updateData)
        .eq('id', employeeId);
      
      if (updateError) throw updateError;
      
      await fetchEmployees();
      return { error: null };
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to update employee';
      return { error: message };
    }
  };

  const deleteEmployee = async (employeeId: number) => {
    try {
      // Soft delete - set is_deleted to true
      const { error: deleteError } = await supabase
        .from('c3_employees')
        .update({ is_deleted: true, updated_at: new Date().toISOString() })
        .eq('id', employeeId);
      
      if (deleteError) throw deleteError;
      
      await fetchEmployees();
      return { error: null };
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to delete employee';
      return { error: message };
    }
  };

  // Auto-fetch when companyId is set
  useEffect(() => {
    if (companyId) {
      fetchEmployees();
    }
  }, [companyId, fetchEmployees]);

  return {
    employees,
    isLoading,
    error,
    companyId,
    fetchEmployees,
    addEmployee,
    updateEmployee,
    deleteEmployee,
  };
}
