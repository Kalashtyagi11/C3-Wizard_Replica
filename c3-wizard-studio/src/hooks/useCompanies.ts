/**
 * Company Management Hook
 * Connects to optimised c3_companies table
 */

import { useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import type { Database } from '@/integrations/supabase/types';

// Use database types directly
type DbCompany = Database['public']['Tables']['c3_companies']['Row'];
export type Company = DbCompany;

export function useCompanies() {
  const [companies, setCompanies] = useState<Company[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchCompanies = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const { data, error: fetchError } = await supabase
        .from('c3_companies')
        .select('*')
        .eq('is_deleted', false)
        .order('company_name', { ascending: true });
      
      if (fetchError) throw fetchError;
      setCompanies(data || []);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to fetch companies';
      setError(message);
      console.error('Error fetching companies:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const getCompanyById = async (companyId: number) => {
    try {
      const { data, error: fetchError } = await supabase
        .from('c3_companies')
        .select('*')
        .eq('id', companyId)
        .single();
      
      if (fetchError) throw fetchError;
      return { company: data, error: null };
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to fetch company';
      return { company: null, error: message };
    }
  };

  const createCompany = async (companyData: Partial<Company>) => {
    try {
      const insertData = {
        company_name: companyData.company_name ?? 'New Company',
        trade_name: companyData.trade_name ?? null,
        registration_number: companyData.registration_number ?? null,
        address_line1: companyData.address_line1 ?? null,
        address_line2: companyData.address_line2 ?? null,
        city: companyData.city ?? null,
        state: companyData.state ?? null,
        country: companyData.country ?? null,
        postal_code: companyData.postal_code ?? null,
        email: companyData.email ?? null,
        mobile: companyData.mobile ?? null,
        phone: companyData.phone ?? null,
        fax: companyData.fax ?? null,
        contact_person: companyData.contact_person ?? null,
        is_deleted: false,
        created_at: new Date().toISOString(),
      };
      
      const { data, error: insertError } = await supabase
        .from('c3_companies')
        .insert(insertData)
        .select()
        .single();
      
      if (insertError) throw insertError;
      
      await fetchCompanies();
      return { company: data, error: null };
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to create company';
      return { company: null, error: message };
    }
  };

  const updateCompany = async (companyId: number, updates: Partial<Company>) => {
    try {
      const updateData = {
        ...updates,
        updated_at: new Date().toISOString(),
      };
      
      const { error: updateError } = await supabase
        .from('c3_companies')
        .update(updateData)
        .eq('id', companyId);
      
      if (updateError) throw updateError;
      
      await fetchCompanies();
      return { error: null };
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to update company';
      return { error: message };
    }
  };

  const deleteCompany = async (companyId: number) => {
    try {
      // Soft delete - set is_deleted to true
      const { error: deleteError } = await supabase
        .from('c3_companies')
        .update({ is_deleted: true, updated_at: new Date().toISOString() })
        .eq('id', companyId);
      
      if (deleteError) throw deleteError;
      
      await fetchCompanies();
      return { error: null };
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to delete company';
      return { error: message };
    }
  };

  return {
    companies,
    isLoading,
    error,
    fetchCompanies,
    getCompanyById,
    createCompany,
    updateCompany,
    deleteCompany,
  };
}
