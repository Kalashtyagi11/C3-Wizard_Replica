/**
 * Wage Categories Hook
 * Connects to optimised c3_wage_categories table
 */

import { useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import type { Database } from '@/integrations/supabase/types';

// Use database types directly
type DbWageCategory = Database['public']['Tables']['c3_wage_categories']['Row'];
export type WageCategory = DbWageCategory;

export function useWageCategories() {
  const [wageCategories, setWageCategories] = useState<WageCategory[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchWageCategories = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const { data, error: fetchError } = await supabase
        .from('c3_wage_categories')
        .select('*, weekly_income, weekly_contribution, is_locked')
        .order('id', { ascending: true });
      
      if (fetchError) throw fetchError;
      setWageCategories(data || []);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to fetch wage categories';
      setError(message);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const createWageCategory = async (categoryData: Partial<WageCategory>) => {
    try {
      const { data, error: insertError } = await supabase
        .from('c3_wage_categories')
        .insert({
          category_code: categoryData.category_code ?? null,
          category_name: categoryData.category_name ?? 'New Category',
          description: categoryData.description ?? null,
          min_wage: categoryData.min_wage ?? null,
          max_wage: categoryData.max_wage ?? null,
          created_at: new Date().toISOString(),
        })
        .select()
        .single();
      
      if (insertError) throw insertError;
      await fetchWageCategories();
      return { category: data, error: null };
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to create wage category';
      return { category: null, error: message };
    }
  };

  const updateWageCategory = async (categoryId: number, updates: Partial<WageCategory>) => {
    try {
      const { error: updateError } = await supabase
        .from('c3_wage_categories')
        .update({ ...updates, updated_at: new Date().toISOString() })
        .eq('id', categoryId);
      
      if (updateError) throw updateError;
      await fetchWageCategories();
      return { error: null };
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to update wage category';
      return { error: message };
    }
  };

  const deleteWageCategory = async (categoryId: number) => {
    try {
      const { error: deleteError } = await supabase
        .from('c3_wage_categories')
        .delete()
        .eq('id', categoryId);
      
      if (deleteError) throw deleteError;
      await fetchWageCategories();
      return { error: null };
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to delete wage category';
      return { error: message };
    }
  };

  return {
    wageCategories,
    categories: wageCategories,
    isLoading,
    error,
    fetchWageCategories,
    fetchCategories: fetchWageCategories,
    createWageCategory,
    updateWageCategory,
    deleteWageCategory,
  };
}
