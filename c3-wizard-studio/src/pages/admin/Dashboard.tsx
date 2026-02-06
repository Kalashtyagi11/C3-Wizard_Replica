import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { DashboardLayout } from '@/components/layout';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Loader2 } from 'lucide-react';
import { useAdminDashboardData } from '@/hooks/useAdminDashboardData';
import { DashboardSummaryCards } from '@/components/admin/DashboardSummaryCards';
import { PaymentStatusSection } from '@/components/admin/PaymentStatusSection';
import { PaymentOverviewChart } from '@/components/admin/PaymentOverviewChart';

export default function AdminDashboard() {
  const { role, isLoading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [selectedYear, setSelectedYear] = useState(String(new Date().getFullYear()));
  const [selectedMonth, setSelectedMonth] = useState('January');

  const { 
    summaryData, 
    selfEmployedPaymentStatus,
    employerChartData,
    nwDirectorChartData,
    selfEmployedChartData,
    isLoading 
  } = useAdminDashboardData(selectedYear, selectedMonth);

  useEffect(() => {
    if (!authLoading && role !== 'admin') {
      navigate('/dashboard');
    }
  }, [role, authLoading, navigate]);

  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const years = ['2024', '2025', '2026'];

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="mt-16 flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <span className="ml-2">Loading dashboard...</span>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="mt-16 space-y-6">
        {/* Header Filters */}
        <div className="flex items-center gap-4 bg-muted/30 p-4 rounded-lg border">
          <Select value={selectedYear} onValueChange={setSelectedYear}>
            <SelectTrigger className="w-28">
              <SelectValue placeholder="Year" />
            </SelectTrigger>
            <SelectContent>
              {years.map(year => (
                <SelectItem key={year} value={year}>{year}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={selectedMonth} onValueChange={setSelectedMonth}>
            <SelectTrigger className="w-32">
              <SelectValue placeholder="Month" />
            </SelectTrigger>
            <SelectContent>
              {months.map(month => (
                <SelectItem key={month} value={month}>{month}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          
          {/* Summary Cards in same row */}
          <div className="flex-1">
            <DashboardSummaryCards data={summaryData} />
          </div>
        </div>

        {/* Payment Status Sections */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <PaymentStatusSection
            title="Employer & NW Director Payment Status"
            icon="employer"
            users={[]} // Will be populated when we have employer payment status
          />
          <PaymentStatusSection
            title="Self Payment Status"
            icon="self-employed"
            users={selfEmployedPaymentStatus}
          />
        </div>

        {/* Payment Overview Charts */}
        <PaymentOverviewChart
          title="Employer Payment Overview"
          icon="employer"
          data={employerChartData}
          year={selectedYear}
        />

        <PaymentOverviewChart
          title="NW Director Payment Overview"
          icon="nw-director"
          data={nwDirectorChartData}
          year={selectedYear}
        />

        <PaymentOverviewChart
          title="Self Employed Payment Overview"
          icon="self-employed"
          data={selfEmployedChartData}
          year={selectedYear}
        />
      </div>
    </DashboardLayout>
  );
}
