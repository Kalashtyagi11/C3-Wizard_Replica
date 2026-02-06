import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import type { Database } from '@/integrations/supabase/types';

// Use database types directly
type DbExceptionLog = Database['public']['Tables']['c3_exception_logs']['Row'];
export type ExceptionLog = DbExceptionLog;

export function useExceptionLogs(limit: number = 100) {
  const { data: logs, isLoading, error, refetch } = useQuery({
    queryKey: ['exception-logs', limit],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('c3_exception_logs')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(limit);
      
      if (error) throw error;
      return data;
    },
  });

  // Also fetch from c3_error_logs as fallback
  const { data: customLogs } = useQuery({
    queryKey: ['custom-error-logs', limit],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('c3_error_logs')
        .select('*')
        .order('logged_at', { ascending: false })
        .limit(limit);
      
      if (error) throw error;
      return data;
    },
  });

  return { 
    logs: logs || [], 
    customLogs: customLogs || [],
    isLoading, 
    error, 
    refetch 
  };
}
