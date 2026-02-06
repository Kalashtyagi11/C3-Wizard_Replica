/**
 * Holiday Pay Hook - Connected to optimised c3_holiday_pay_dates table
 */

import { useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface HolidayPayRecord {
  id: number;
  legacy_id: number | null;
  holiday_payment_id: number | null;
  employee_id: number | null;
  company_id: number | null;
  amount: number | null;
  holiday_pay_date: string | null;
  // Joined from c3_employees
  employee_name?: string;
  social_security_number?: string;
}

export function useHolidayPay() {
  const [records, setRecords] = useState<HolidayPayRecord[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchHolidayPay = useCallback(async (companyId?: number) => {
    setIsLoading(true);
    setError(null);

    try {
      let query = supabase
        .from('c3_holiday_pay_dates')
        .select('*')
        .order('holiday_pay_date', { ascending: false });

      if (companyId) {
        query = query.eq('company_id', companyId);
      }

      const { data: holidayData, error: queryError } = await query;

      if (queryError) throw queryError;

      // Fetch employees for names
      const { data: employees } = await supabase
        .from('c3_employees')
        .select('id, first_name, last_name, social_security_number');

      // Join employee names
      const enrichedRecords = (holidayData || []).map(record => {
        const employee = employees?.find(e => e.id === record.employee_id);
        return {
          ...record,
          employee_name: employee ? `${employee.first_name} ${employee.last_name}` : 'Unknown',
          social_security_number: employee?.social_security_number,
        };
      });

      setRecords(enrichedRecords);
    } catch (err) {
      console.error('Error fetching holiday pay:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch holiday pay records');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const addHolidayPay = useCallback(async (
    employeeId: number,
    amount: number,
    holidayPayDate: string,
    companyId: number
  ) => {
    try {
      const { error: insertError } = await supabase
        .from('c3_holiday_pay_dates')
        .insert({
          employee_id: employeeId,
          company_id: companyId,
          amount,
          holiday_pay_date: holidayPayDate,
          created_at: new Date().toISOString(),
        });

      if (insertError) throw insertError;

      await fetchHolidayPay(companyId);
      return { error: null };
    } catch (err) {
      console.error('Error adding holiday pay:', err);
      return { error: err instanceof Error ? err.message : 'Failed to add holiday pay' };
    }
  }, [fetchHolidayPay]);

  const deleteHolidayPay = useCallback(async (id: number, companyId?: number) => {
    try {
      const { error: deleteError } = await supabase
        .from('c3_holiday_pay_dates')
        .delete()
        .eq('id', id);

      if (deleteError) throw deleteError;

      await fetchHolidayPay(companyId);
      return { error: null };
    } catch (err) {
      console.error('Error deleting holiday pay:', err);
      return { error: err instanceof Error ? err.message : 'Failed to delete holiday pay' };
    }
  }, [fetchHolidayPay]);

  return {
    records,
    isLoading,
    error,
    fetchHolidayPay,
    addHolidayPay,
    deleteHolidayPay,
  };
}
