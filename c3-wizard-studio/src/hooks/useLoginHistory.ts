/**
 * Login History Hook - Connected to optimised c3_login_logs table
 */

import { useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import type { Database } from '@/integrations/supabase/types';

// Use database types directly
type DbLoginLog = Database['public']['Tables']['c3_login_logs']['Row'];
export type LoginRecord = DbLoginLog;

export function useLoginHistory() {
  const [loginHistory, setLoginHistory] = useState<LoginRecord[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchLoginHistory = useCallback(async (fromDate?: string, toDate?: string) => {
    setIsLoading(true);
    setError(null);

    try {
      let query = supabase
        .from('c3_login_logs')
        .select('*')
        .order('login_time', { ascending: false })
        .limit(100);

      if (fromDate) {
        query = query.gte('login_time', fromDate);
      }
      if (toDate) {
        query = query.lte('login_time', toDate);
      }

      const { data, error: queryError } = await query;

      if (queryError) {
        throw queryError;
      }

      setLoginHistory(data || []);
    } catch (err) {
      console.error('Error fetching login history:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch login history');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const logLogin = useCallback(async (
    userId: number,
    loginId: string,
    success: boolean,
    ipAddress?: string,
    companyId?: number,
    isSelfEmployed?: boolean
  ) => {
    try {
      const { error: insertError } = await supabase
        .from('c3_login_logs')
        .insert({
          user_id: userId,
          username: loginId,
          login_time: new Date().toISOString(),
          was_successful: success,
          ip_address: ipAddress,
          is_locked: false,
          company_id: companyId,
          is_self_employed: isSelfEmployed ?? false,
        });

      if (insertError) {
        console.error('Error logging login:', insertError);
      }
    } catch (err) {
      console.error('Error logging login:', err);
    }
  }, []);

  return {
    loginHistory,
    isLoading,
    error,
    fetchLoginHistory,
    logLogin,
  };
}
