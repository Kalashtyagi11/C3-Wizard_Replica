import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import type { Database } from '@/integrations/supabase/types';

// Use database types directly with company info extension
type DbUser = Database['public']['Tables']['c3_users']['Row'];
export type EmployerUser = DbUser & { 
  company_name?: string | null;
  registration_number?: string | null;
};

export function useEmployerUsers() {
  const { data: users, isLoading, error, refetch } = useQuery({
    queryKey: ['employer-users'],
    queryFn: async () => {
      // Fetch employer users (user_type EMPLOYER)
      const { data: userData, error: userError } = await supabase
        .from('c3_users')
        .select('*')
        .eq('user_type', 'EMPLOYER')
        .order('created_at', { ascending: false });
      
      if (userError) throw userError;

      // Get company names for users with company_id
      const companyIds = (userData || [])
        .map((u) => u.company_id)
        .filter(Boolean) as number[];

      let companiesMap: Record<number, { name: string; regNum: string }> = {};
      
      if (companyIds.length > 0) {
        const { data: companies } = await supabase
          .from('c3_companies')
          .select('id, company_name, registration_number')
          .in('id', companyIds);
        
        if (companies) {
          companiesMap = companies.reduce((acc: Record<number, { name: string; regNum: string }>, c) => {
            if (c.id) acc[c.id] = { name: c.company_name || '', regNum: c.registration_number || '' };
            return acc;
          }, {});
        }
      }

      // Join company info
      return (userData || []).map((user) => ({
        ...user,
        company_name: user.company_id ? companiesMap[user.company_id]?.name : null,
        registration_number: user.company_id ? companiesMap[user.company_id]?.regNum : null,
      })) as EmployerUser[];
    },
  });

  return { users, isLoading, error, refetch };
}
