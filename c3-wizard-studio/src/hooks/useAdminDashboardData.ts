import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface SummaryData {
  employerPaid: number;
  employerUnpaid: number;
  nwDirectorsPaid: number;
  nwDirectorsUnpaid: number;
  selfEmployedPaid: number;
  selfEmployedUnpaid: number;
}

interface PaymentUser {
  id: number;
  name: string;
  period: string;
  status: 'Paid' | 'Unpaid';
}

interface ChartData {
  month: string;
  paid: number;
  unpaid: number;
}

const MONTH_ABBR = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

export function useAdminDashboardData(year: string, _month: string) {
  const [summaryData, setSummaryData] = useState<SummaryData>({
    employerPaid: 0, employerUnpaid: 0, nwDirectorsPaid: 0, nwDirectorsUnpaid: 0, selfEmployedPaid: 0, selfEmployedUnpaid: 0,
  });
  const [employerPaymentStatus, setEmployerPaymentStatus] = useState<PaymentUser[]>([]);
  const [selfEmployedPaymentStatus, setSelfEmployedPaymentStatus] = useState<PaymentUser[]>([]);
  const [employerChartData, setEmployerChartData] = useState<ChartData[]>([]);
  const [nwDirectorChartData, setNwDirectorChartData] = useState<ChartData[]>([]);
  const [selfEmployedChartData, setSelfEmployedChartData] = useState<ChartData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const createEmptyChartData = (): ChartData[] => MONTH_ABBR.map(m => ({ month: m, paid: 0, unpaid: 0 }));

      const { data: employerContributions } = await supabase
        .from('c3_contribution_details')
        .select('social_security_total, levy_employee, levy_employer, severance_employee, severance_employer, is_submitted, is_finalized, period_month')
        .eq('period_year', year);

      let empPaid = 0, empUnpaid = 0;
      const empChartData = createEmptyChartData();

      employerContributions?.forEach(contrib => {
        const total = (contrib.social_security_total || 0) + (contrib.levy_employee || 0) + (contrib.levy_employer || 0) + 
                     (contrib.severance_employee || 0) + (contrib.severance_employer || 0);
        const isPaid = contrib.is_submitted === true || contrib.is_finalized === true;
        if (isPaid) { empPaid += total; } else { empUnpaid += total; }
        const monthIndex = contrib.period_month ? parseInt(contrib.period_month) - 1 : -1;
        if (monthIndex >= 0 && monthIndex < 12) {
          if (isPaid) { empChartData[monthIndex].paid += total; } else { empChartData[monthIndex].unpaid += total; }
        }
      });

      const { data: selfEmployedContribs } = await supabase
        .from('c3_self_employed_contributions')
        .select('total_contribution, is_submitted, is_finalized, period_month')
        .eq('period_year', year);

      let sePaid = 0, seUnpaid = 0;
      const seChartData = createEmptyChartData();

      selfEmployedContribs?.forEach(contrib => {
        const total = contrib.total_contribution || 0;
        const isPaid = contrib.is_submitted === true || contrib.is_finalized === true;
        if (isPaid) { sePaid += total; } else { seUnpaid += total; }
        const monthIndex = contrib.period_month ? parseInt(contrib.period_month) - 1 : -1;
        if (monthIndex >= 0 && monthIndex < 12) {
          if (isPaid) { seChartData[monthIndex].paid += total; } else { seChartData[monthIndex].unpaid += total; }
        }
      });

      setSummaryData({
        employerPaid: empPaid, employerUnpaid: empUnpaid, nwDirectorsPaid: 0, nwDirectorsUnpaid: 0, selfEmployedPaid: sePaid, selfEmployedUnpaid: seUnpaid,
      });
      setEmployerChartData(empChartData);
      setNwDirectorChartData(createEmptyChartData());
      setSelfEmployedChartData(seChartData);
      setSelfEmployedPaymentStatus([]);
      setEmployerPaymentStatus([]);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch dashboard data');
    } finally {
      setIsLoading(false);
    }
  }, [year]);

  useEffect(() => { fetchData(); }, [fetchData]);

  return {
    summaryData, employerPaymentStatus, selfEmployedPaymentStatus, employerChartData, nwDirectorChartData, selfEmployedChartData, isLoading, error, refetch: fetchData,
  };
}
