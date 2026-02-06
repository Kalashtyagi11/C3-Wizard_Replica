/**
 * Self-Employed C3 Contribution Hook
 * Connects to optimised c3_self_employed_contributions and c3_self_employed tables
 */

import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';
import { useSystemRates } from './useSystemRates';
import type { Database } from '@/integrations/supabase/types';
import { roundCurrency } from '@/lib/contributionCalculations';

type SelfEmployedC3 = Database['public']['Tables']['c3_self_employed_contributions']['Row'];
type SelfEmployed = Database['public']['Tables']['c3_self_employed']['Row'];

export interface SelfEmployedContributionResult {
  ssn: string;
  name: string;
  weeksWorked: boolean[];
  weeklyWages: number[];
  totalIncome: number;
  ssContribution: number;
  levyContribution: number;
  peContribution: number;
  grandTotal: number;
}

export function useSelfEmployedC3() {
  const [contributions, setContributions] = useState<SelfEmployedC3[]>([]);
  const [currentContribution, setCurrentContribution] = useState<SelfEmployedC3 | null>(null);
  const [calculationResult, setCalculationResult] = useState<SelfEmployedContributionResult | null>(null);
  const [profile, setProfile] = useState<SelfEmployed | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const { user } = useAuth();
  const { rates, fetchRates } = useSystemRates();

  // Get self-employed profile
  useEffect(() => {
    const getProfile = async () => {
      if (!user) return;
      
      try {
        const { data: profileData } = await supabase
          .from('c3_self_employed')
          .select('*')
          .eq('email', user.email)
          .single();
        
        if (profileData) {
          setProfile(profileData);
        }
      } catch (err) {
        console.error('Error fetching self-employed profile:', err);
      }
    };
    
    getProfile();
  }, [user]);

  useEffect(() => {
    fetchRates();
  }, [fetchRates]);

  const fetchContributions = useCallback(async () => {
    if (!profile) return;
    
    setIsLoading(true);
    setError(null);
    
    try {
      const { data, error: fetchError } = await supabase
        .from('c3_self_employed_contributions')
        .select('*')
        .eq('social_security_number', profile.social_security_number)
        .order('period_year', { ascending: false });
      
      if (fetchError) throw fetchError;
      setContributions(data || []);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to fetch contributions';
      setError(message);
    } finally {
      setIsLoading(false);
    }
  }, [profile]);

  const createContribution = async (month: number, year: number) => {
    try {
      if (!profile) {
        return { headerId: null, error: 'No self-employed profile found' };
      }

      const { data: existing } = await supabase
        .from('c3_self_employed_contributions')
        .select('id')
        .eq('social_security_number', profile.social_security_number)
        .eq('period_month', month.toString())
        .eq('period_year', year.toString())
        .single();

      if (existing) {
        return { headerId: null, error: `Contribution already exists for ${month}/${year}` };
      }

      const { data, error: insertError } = await supabase
        .from('c3_self_employed_contributions')
        .insert({
          social_security_number: profile.social_security_number ?? null,
          self_employed_id: profile.id,
          wage_category_id: profile.wage_category_id ?? null,
          period_month: month.toString(),
          period_year: year.toString(),
          is_submitted: false,
          is_finalized: false,
          created_at: new Date().toISOString(),
        })
        .select()
        .single();

      if (insertError) throw insertError;

      setCurrentContribution(data);
      await fetchContributions();
      return { headerId: data.id, error: null };
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to create contribution';
      return { headerId: null, error: message };
    }
  };

  const calculateContribution = async (
    _month: number,
    _year: number,
    weeksWorked: boolean[],
    weeklyWages: number[]
  ): Promise<SelfEmployedContributionResult | null> => {
    if (!profile) return null;
    
    try {
      const totalWages = weeklyWages.reduce((sum, wage, index) => 
        weeksWorked[index] ? sum + wage : sum, 0
      );
      
      const currentRate = rates[0];
      const ssRate = currentRate?.employee_rate ?? 0.05;
      const ssErRate = currentRate?.employer_rate ?? 0.05;
      const severanceRate = currentRate?.severance_rate ?? 0.01;
      
      const ssContribution = roundCurrency(totalWages * (ssRate + ssErRate));
      const levyContribution = roundCurrency(totalWages * 0.02);
      const peContribution = roundCurrency(totalWages * (severanceRate * 2));
      const grandTotal = roundCurrency(ssContribution + levyContribution + peContribution);
      
      const result: SelfEmployedContributionResult = {
        ssn: profile.social_security_number || '',
        name: `${profile.first_name} ${profile.last_name}`,
        weeksWorked,
        weeklyWages,
        totalIncome: roundCurrency(totalWages),
        ssContribution,
        levyContribution,
        peContribution,
        grandTotal,
      };
      
      setCalculationResult(result);
      return result;
    } catch (err) {
      console.error('Error calculating contribution:', err);
      return null;
    }
  };

  const saveContribution = async (headerId: number, result: SelfEmployedContributionResult) => {
    try {
      const { error: updateError } = await supabase
        .from('c3_self_employed_contributions')
        .update({
          declared_income: result.totalIncome,
          total_contribution: result.grandTotal,
          social_security_contribution: result.ssContribution,
          levy_contribution: result.levyContribution,
          updated_at: new Date().toISOString(),
        })
        .eq('id', headerId);
      
      if (updateError) throw updateError;
      await fetchContributions();
      return { error: null };
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to save contribution';
      return { error: message };
    }
  };

  const finalizeContribution = async (headerId: number) => {
    try {
      const { error: updateError } = await supabase
        .from('c3_self_employed_contributions')
        .update({
          is_finalized: true,
          finalized_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        })
        .eq('id', headerId);
      
      if (updateError) throw updateError;
      await fetchContributions();
      return { error: null };
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to finalize contribution';
      return { error: message };
    }
  };

  const submitContribution = async (headerId: number) => {
    try {
      const { error: updateError } = await supabase
        .from('c3_self_employed_contributions')
        .update({
          is_submitted: true,
          submitted_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        })
        .eq('id', headerId);
      
      if (updateError) throw updateError;
      await fetchContributions();
      return { error: null };
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to submit contribution';
      return { error: message };
    }
  };

  const deleteContribution = async (headerId: number) => {
    try {
      const { error: deleteError } = await supabase
        .from('c3_self_employed_contributions')
        .update({ is_deleted: true, updated_at: new Date().toISOString() })
        .eq('id', headerId);
      
      if (deleteError) throw deleteError;
      await fetchContributions();
      return { error: null };
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to delete contribution';
      return { error: message };
    }
  };

  const updateProfile = async (profileData: Partial<SelfEmployed>) => {
    if (!profile) return { error: 'No profile found' };
    
    try {
      const { error: updateError } = await supabase
        .from('c3_self_employed')
        .update({ ...profileData, updated_at: new Date().toISOString() })
        .eq('id', profile.id);
      
      if (updateError) throw updateError;
      
      const { data } = await supabase
        .from('c3_self_employed')
        .select('*')
        .eq('id', profile.id)
        .single();
      
      if (data) setProfile(data);
      return { error: null };
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to update profile';
      return { error: message };
    }
  };

  useEffect(() => {
    if (profile) {
      fetchContributions();
    }
  }, [profile, fetchContributions]);

  return {
    contributions,
    currentContribution,
    calculationResult,
    profile,
    wageCategory: null,
    isLoading,
    error,
    fetchContributions,
    createContribution,
    calculateContribution,
    saveContribution,
    finalizeContribution,
    submitContribution,
    deleteContribution,
    updateProfile,
  };
}
