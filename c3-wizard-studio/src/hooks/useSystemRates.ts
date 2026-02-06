/**
 * System Rates Hook
 * Connects to optimised c3_system_rates table
 */

import { useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import type { Database } from '@/integrations/supabase/types';

// Use database types directly
type DbSystemRate = Database['public']['Tables']['c3_system_rates']['Row'];
export type SystemRate = DbSystemRate;

export function useSystemRates() {
  const [rates, setRates] = useState<SystemRate[]>([]);
  const [currentRate, setCurrentRate] = useState<SystemRate | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchRates = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const { data, error: fetchError } = await supabase
        .from('c3_system_rates')
        .select('*')
        .order('effective_from', { ascending: false });
      
      if (fetchError) throw fetchError;
      setRates(data || []);
      
      // Set current active rate
      setCurrentRate(data?.[0] || null);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to fetch rates';
      setError(message);
      console.error('Error fetching rates:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const getRateForDate = useCallback((date: Date): SystemRate | null => {
    return rates.find(r => {
      const fromDate = r.effective_from ? new Date(r.effective_from) : null;
      const toDate = r.effective_to ? new Date(r.effective_to) : null;
      
      if (fromDate && date < fromDate) return false;
      if (toDate && date > toDate) return false;
      return true;
    }) || rates[0] || null;
  }, [rates]);

  const createRate = async (rateData: Partial<SystemRate>) => {
    try {
      const insertData: Database['public']['Tables']['c3_system_rates']['Insert'] = {
        effective_from: rateData.effective_from ?? new Date().toISOString(),
        rate_type: rateData.rate_type ?? 'standard',
      };
      
      const { data, error: insertError } = await supabase
        .from('c3_system_rates')
        .insert(insertData)
        .select()
        .single();
      
      if (insertError) throw insertError;
      await fetchRates();
      return { rate: data, error: null };
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to create rate';
      return { rate: null, error: message };
    }
  };

  const updateRate = async (rateId: number, updates: Partial<SystemRate>) => {
    try {
      const { error: updateError } = await supabase
        .from('c3_system_rates')
        .update({ ...updates, updated_at: new Date().toISOString() })
        .eq('id', rateId);
      
      if (updateError) throw updateError;
      await fetchRates();
      return { error: null };
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to update rate';
      return { error: message };
    }
  };

  return {
    rates,
    currentRate,
    isLoading,
    error,
    fetchRates,
    getRateForDate,
    createRate,
    updateRate,
  };
}
