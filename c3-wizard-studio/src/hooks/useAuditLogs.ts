/**
 * Audit Logs Hook - Connected to optimised c3_audit_logs table
 */

import { useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface AuditLog {
  id: number;
  legacy_id: number | null;
  event_type: string | null;
  table_name: string | null;
  column_name: string | null;
  old_value: string | null;
  new_value: string | null;
  url: string | null;
  controller: string | null;
  action: string | null;
  area: string | null;
  ip_address: string | null;
  record_id: number | null;
  created_by: number | null;
  created_at: string | null;
  message: string | null;
  username: string | null;
}

export function useAuditLogs() {
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchLogs = useCallback(async (
    fromDate?: string,
    toDate?: string,
    tableName?: string,
    action?: string,
    limit: number = 100
  ) => {
    setIsLoading(true);
    setError(null);

    try {
      let query = supabase
        .from('c3_audit_logs')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(limit);

      if (fromDate) {
        query = query.gte('created_at', fromDate);
      }
      if (toDate) {
        query = query.lte('created_at', toDate);
      }
      if (tableName) {
        query = query.eq('table_name', tableName);
      }
      if (action) {
        query = query.eq('action', action);
      }

      const { data, error: queryError } = await query;

      if (queryError) {
        throw queryError;
      }

      setLogs((data || []) as AuditLog[]);
    } catch (err) {
      console.error('Error fetching audit logs:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch audit logs');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const logAction = useCallback(async (
    actionName: string,
    tableName?: string,
    recordId?: number,
    details?: string,
    oldValue?: string,
    newValue?: string
  ) => {
    try {
      const { error: insertError } = await supabase
        .from('c3_audit_logs')
        .insert({
          event_type: 'action',
          action: actionName,
          table_name: tableName,
          record_id: recordId,
          message: details,
          old_value: oldValue,
          new_value: newValue,
          created_at: new Date().toISOString(),
        });

      if (insertError) {
        console.error('Error logging action:', insertError);
      }
    } catch (err) {
      console.error('Error logging action:', err);
    }
  }, []);

  return {
    logs,
    isLoading,
    error,
    fetchLogs,
    logAction,
  };
}
