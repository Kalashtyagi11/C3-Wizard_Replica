import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import type { Database } from '@/integrations/supabase/types';

type DbWageCategory = Database['public']['Tables']['c3_wage_categories']['Row'];
type DbSelfEmployedSettings = Database['public']['Tables']['c3_self_employed_settings']['Row'];

export type WageCategory = DbWageCategory;
export type SelfEmployedSetting = DbSelfEmployedSettings;

export function useWageCategorySettings() {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch self-employed settings
  const { data: settings, isLoading: settingsLoading } = useQuery({
    queryKey: ['self-employed-settings'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('c3_self_employed_settings')
        .select('*')
        .order('id', { ascending: false });
      
      if (error) throw error;
      return data;
    },
  });

  // Fetch wage categories with new columns
  const { data: categories, isLoading: categoriesLoading } = useQuery({
    queryKey: ['wage-categories'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('c3_wage_categories')
        .select('*, weekly_income, weekly_contribution, is_locked')
        .order('id', { ascending: true });
      
      if (error) throw error;
      return data;
    },
  });

  // Update wage category
  const updateCategory = useMutation({
    mutationFn: async (category: Partial<WageCategory> & { id: number }) => {
      const { error } = await supabase
        .from('c3_wage_categories')
        .update({
          min_wage: category.min_wage,
          max_wage: category.max_wage,
          description: category.description,
          updated_at: new Date().toISOString(),
        })
        .eq('id', category.id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['wage-categories'] });
      toast({ title: 'Wage category updated successfully' });
    },
    onError: (error) => {
      toast({ title: 'Failed to update wage category', description: error.message, variant: 'destructive' });
    },
  });

  return {
    settings,
    categories,
    isLoading: settingsLoading || categoriesLoading,
    updateCategory,
  };
}
