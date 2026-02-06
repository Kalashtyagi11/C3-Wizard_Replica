/**
 * Levy Tiers / December Bonus Exemption Hook
 * Connects to optimised c3_bonus_exemptions table
 */

import { useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import type { Database } from '@/integrations/supabase/types';

// Use database types directly
type DbBonusExemption = Database['public']['Tables']['c3_bonus_exemptions']['Row'];
export type LevyTier = DbBonusExemption;

export function useLevyTiers() {
  const [levyTiers, setLevyTiers] = useState<LevyTier[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchLevyTiers = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const { data, error: fetchError } = await supabase
        .from('c3_bonus_exemptions')
        .select('*')
        .order('year', { ascending: false });
      
      if (fetchError) throw fetchError;
      setLevyTiers(data || []);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to fetch levy tiers';
      setError(message);
      console.error('Error fetching levy tiers:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const getTiersForYear = useCallback((year: number): LevyTier[] => {
    return levyTiers.filter(t => t.year === year);
  }, [levyTiers]);

  const isExemptedForYear = useCallback((year: number, month: number): {
    isExemptedSocialSecurity: boolean;
    isExemptedLevy: boolean;
    isExemptedEmployerLevy: boolean;
    isExemptedSeverance: boolean;
  } => {
    const yearTier = levyTiers.find(t => t.year === year && t.month === month);
    
    return {
      isExemptedSocialSecurity: Boolean(yearTier?.is_social_security_exempted),
      isExemptedLevy: Boolean(yearTier?.is_levy_exempted),
      isExemptedEmployerLevy: Boolean(yearTier?.is_employer_levy_exempted),
      isExemptedSeverance: Boolean(yearTier?.is_severance_exempted),
    };
  }, [levyTiers]);

  const createTier = async (tierData: Partial<LevyTier>) => {
    try {
      const insertData: Database['public']['Tables']['c3_bonus_exemptions']['Insert'] = {
        year: tierData.year ?? new Date().getFullYear(),
        month: tierData.month ?? 12,
        is_social_security_exempted: tierData.is_social_security_exempted ?? false,
        is_levy_exempted: tierData.is_levy_exempted ?? false,
        is_employer_levy_exempted: tierData.is_employer_levy_exempted ?? false,
        is_severance_exempted: tierData.is_severance_exempted ?? false,
        is_locked: false,
        created_at: new Date().toISOString(),
      };
      
      const { data, error: insertError } = await supabase
        .from('c3_bonus_exemptions')
        .insert(insertData)
        .select()
        .single();
      
      if (insertError) throw insertError;
      
      await fetchLevyTiers();
      return { tier: data, error: null };
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to create tier';
      return { tier: null, error: message };
    }
  };

  const updateTier = async (tierId: number, updates: Partial<LevyTier>) => {
    try {
      const { error: updateError } = await supabase
        .from('c3_bonus_exemptions')
        .update({ ...updates, updated_at: new Date().toISOString() })
        .eq('id', tierId);
      
      if (updateError) throw updateError;
      
      await fetchLevyTiers();
      return { error: null };
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to update tier';
      return { error: message };
    }
  };

  const deleteTier = async (tierId: number) => {
    try {
      const { error: deleteError } = await supabase
        .from('c3_bonus_exemptions')
        .delete()
        .eq('id', tierId);
      
      if (deleteError) throw deleteError;
      
      await fetchLevyTiers();
      return { error: null };
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to delete tier';
      return { error: message };
    }
  };

  // Aliases for backward compatibility
  const tiers = levyTiers;
  const fetchTiers = fetchLevyTiers;

  return {
    levyTiers,
    tiers,
    isLoading,
    error,
    fetchLevyTiers,
    fetchTiers,
    getTiersForYear,
    isExemptedForYear,
    createTier,
    updateTier,
    deleteTier,
  };
}
