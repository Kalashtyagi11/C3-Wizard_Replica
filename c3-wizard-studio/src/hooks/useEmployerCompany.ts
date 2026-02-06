import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import type { Database } from '@/integrations/supabase/types';

// Use database types directly
type DbCompany = Database['public']['Tables']['c3_companies']['Row'];
type DbUser = Database['public']['Tables']['c3_users']['Row'];

export type EmployerCompany = DbCompany;
export type CompanyUser = Pick<DbUser, 'id' | 'username' | 'email' | 'is_deleted' | 'last_login_at'>;

export function useEmployerCompany(companyId?: number) {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch company details by id
  const { data: company, isLoading: companyLoading } = useQuery({
    queryKey: ['employer-company', companyId],
    queryFn: async () => {
      if (!companyId) return null;
      
      const { data, error } = await supabase
        .from('c3_companies')
        .select('*')
        .eq('id', companyId)
        .maybeSingle();
      
      if (error) throw error;
      return data;
    },
    enabled: !!companyId,
  });

  // Fetch users associated with this company
  const { data: companyUsers, isLoading: usersLoading } = useQuery({
    queryKey: ['company-users', companyId],
    queryFn: async () => {
      if (!companyId) return [];
      
      const { data, error } = await supabase
        .from('c3_users')
        .select('id, username, email, is_deleted, last_login_at')
        .eq('company_id', companyId);
      
      if (error) throw error;
      return data as CompanyUser[];
    },
    enabled: !!companyId,
  });

  // Update company details
  const updateCompany = useMutation({
    mutationFn: async (updates: Partial<EmployerCompany>) => {
      if (!company?.id) throw new Error('No company to update');
      
      const { error } = await supabase
        .from('c3_companies')
        .update({ ...updates, updated_at: new Date().toISOString() })
        .eq('id', company.id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['employer-company', companyId] });
      toast({ title: 'Company details updated successfully' });
    },
    onError: (error) => {
      toast({ title: 'Failed to update company', description: error.message, variant: 'destructive' });
    },
  });

  return {
    company,
    companyUsers,
    isLoading: companyLoading || usersLoading,
    updateCompany,
  };
}
