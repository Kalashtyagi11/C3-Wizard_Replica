/**
 * Bonus Pay Hook - Connected to optimised c3_bonus_payments table
 */

import { useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface BonusPayRecord {
  id: number;
  legacy_id: number | null;
  employee_id: number | null;
  company_id: number | null;
  bonus_amount: number | null;
  start_date: string | null;
  end_date: string | null;
  bonus_pay_date: string | null;
  period_month: string | null;
  period_year: string | null;
  created_at: string | null;
  // Joined from c3_employees
  employee_name?: string;
  social_security_number?: string;
}

export function useBonusPay() {
  const [records, setRecords] = useState<BonusPayRecord[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchBonusPay = useCallback(async (companyId?: number, month?: string, year?: string) => {
    setIsLoading(true);
    setError(null);

    try {
      let query = supabase
        .from('c3_bonus_payments')
        .select('*')
        .order('bonus_pay_date', { ascending: false });

      if (companyId) {
        query = query.eq('company_id', companyId);
      }
      if (month) {
        query = query.eq('period_month', month);
      }
      if (year) {
        query = query.eq('period_year', year);
      }

      const { data: bonusData, error: queryError } = await query;

      if (queryError) throw queryError;

      // Fetch employees for names
      const { data: employees } = await supabase
        .from('c3_employees')
        .select('id, first_name, last_name, social_security_number');

      // Join employee names
      const enrichedRecords = (bonusData || []).map(record => {
        const employee = employees?.find(e => e.id === record.employee_id);
        return {
          ...record,
          employee_name: employee ? `${employee.first_name} ${employee.last_name}` : 'Unknown',
          social_security_number: employee?.social_security_number,
        } as BonusPayRecord;
      });

      setRecords(enrichedRecords);
    } catch (err) {
      console.error('Error fetching bonus pay:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch bonus records');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const addBonusPay = useCallback(async (
    employeeId: number,
    amount: number,
    bonusPayDate: string,
    month: string,
    year: string,
    companyId: number,
    _insertedBy?: number
  ) => {
    try {
      const { error: insertError } = await supabase
        .from('c3_bonus_payments')
        .insert({
          employee_id: employeeId,
          company_id: companyId,
          bonus_amount: amount,
          bonus_pay_date: bonusPayDate,
          period_month: month,
          period_year: year,
          created_at: new Date().toISOString(),
        });

      if (insertError) throw insertError;

      await fetchBonusPay(companyId, month, year);
      return { error: null };
    } catch (err) {
      console.error('Error adding bonus pay:', err);
      return { error: err instanceof Error ? err.message : 'Failed to add bonus' };
    }
  }, [fetchBonusPay]);

  const deleteBonusPay = useCallback(async (bonusId: number, companyId?: number) => {
    try {
      const { error: deleteError } = await supabase
        .from('c3_bonus_payments')
        .delete()
        .eq('id', bonusId);

      if (deleteError) throw deleteError;

      await fetchBonusPay(companyId);
      return { error: null };
    } catch (err) {
      console.error('Error deleting bonus pay:', err);
      return { error: err instanceof Error ? err.message : 'Failed to delete bonus' };
    }
  }, [fetchBonusPay]);

  return {
    records,
    isLoading,
    error,
    fetchBonusPay,
    addBonusPay,
    deleteBonusPay,
  };
}
