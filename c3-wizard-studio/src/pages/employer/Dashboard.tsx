/**
 * Employer Dashboard
 * Main dashboard showing C3 Contribution grid per the legacy system
 * Matches PDF screens exactly
 */

import { useEffect, useState, useCallback } from 'react';
import { DashboardLayout } from '@/components/layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useNavigate } from 'react-router-dom';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { 
  Plus, Edit, Eye, Send, CreditCard, FileText,
  Loader2, AlertCircle, CheckCircle2
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { Skeleton } from '@/components/ui/skeleton';
import { format } from 'date-fns';
import { toast } from 'sonner';

interface C3ContributionRow {
  id: number;
  period_month: string;
  period_year: string;
  total_wages: number;
  total_ss_employee: number;
  total_ss_employer: number;
  total_levy_employee: number;
  total_levy_employer: number;
  total_ss_penalty: number;
  total_levy_penalty: number;
  total_pe_penalty: number;
  total_severance: number;
  grand_total: number;
  created_at: string;
  schedule_number: number | null;
  is_nil_return: boolean;
  is_finalized: boolean;
  is_submitted: boolean;
  employee_count: number;
}

const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

export default function EmployerDashboard() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [c3Records, setC3Records] = useState<C3ContributionRow[]>([]);
  const [companyId, setCompanyId] = useState<number | null>(null);
  const [companyName, setCompanyName] = useState<string>('');
  const [isLoading, setIsLoading] = useState(true);

  const fetchDashboardData = useCallback(async () => {
    if (!user?.email) return;

    try {
      // Get user's company from c3_users
      const { data: currentUser } = await supabase
        .from('c3_users')
        .select('company_id')
        .eq('email', user.email)
        .maybeSingle();

      if (!currentUser?.company_id) {
        setIsLoading(false);
        return;
      }

      const { data: company } = await supabase
        .from('c3_companies')
        .select('id, company_name')
        .eq('id', currentUser.company_id)
        .single();

      if (!company) {
        setIsLoading(false);
        return;
      }

      setCompanyId(company.id);
      setCompanyName(company.company_name || 'Unknown Company');

      // Fetch C3 contribution headers with all necessary columns
      const { data: c3Data } = await supabase
        .from('c3_contribution_headers')
        .select(`
          id,
          period_month,
          period_year,
          total_wages,
          total_ss_employee,
          total_ss_employer,
          total_levy_employee,
          total_levy_employer,
          total_ss_penalty,
          total_levy_penalty,
          total_pe_penalty,
          total_severance,
          grand_total,
          created_at,
          schedule_number,
          is_nil_return,
          is_finalized,
          is_submitted,
          employee_count
        `)
        .eq('company_id', company.id)
        .eq('is_deleted', false)
        .order('period_year', { ascending: false })
        .order('period_month', { ascending: false });

      setC3Records(c3Data?.map(c => ({
        id: c.id,
        period_month: c.period_month || '',
        period_year: c.period_year || '',
        total_wages: c.total_wages || 0,
        total_ss_employee: c.total_ss_employee || 0,
        total_ss_employer: c.total_ss_employer || 0,
        total_levy_employee: c.total_levy_employee || 0,
        total_levy_employer: c.total_levy_employer || 0,
        total_ss_penalty: c.total_ss_penalty || 0,
        total_levy_penalty: c.total_levy_penalty || 0,
        total_pe_penalty: c.total_pe_penalty || 0,
        total_severance: c.total_severance || 0,
        grand_total: c.grand_total || 0,
        created_at: c.created_at || '',
        schedule_number: c.schedule_number,
        is_nil_return: Boolean(c.is_nil_return),
        is_finalized: Boolean(c.is_finalized),
        is_submitted: Boolean(c.is_submitted),
        employee_count: c.employee_count || 0,
      })) || []);
    } catch (err) {
      console.error('Error fetching dashboard data:', err);
      toast.error('Failed to load dashboard data');
    } finally {
      setIsLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'XCD',
      minimumFractionDigits: 2,
    }).format(amount);
  };

  const getMonthName = (monthNum: string) => {
    const num = parseInt(monthNum);
    return MONTHS[num - 1] || monthNum;
  };

  const formatDate = (dateStr: string) => {
    if (!dateStr) return 'N/A';
    try {
      return format(new Date(dateStr), 'dd-MMM-yyyy');
    } catch {
      return dateStr;
    }
  };

  const handleEditC3 = (c3Id: number) => {
    navigate(`/employer/c3?id=${c3Id}`);
  };

  const handlePreviewC3 = (c3Id: number) => {
    navigate(`/employer/c3?id=${c3Id}&preview=true`);
  };

  const handleSubmitC3 = async (c3Id: number) => {
    try {
      const { error } = await supabase
        .from('c3_contribution_headers')
        .update({
          is_submitted: true,
          submitted_at: new Date().toISOString(),
        })
        .eq('id', c3Id);

      if (error) throw error;
      toast.success('C3 submitted successfully');
      fetchDashboardData();
    } catch (err) {
      toast.error('Failed to submit C3');
    }
  };

  const handlePayment = (c3Id: number) => {
    navigate(`/employer/payments?c3_id=${c3Id}`);
  };

  const getPaymentStatus = (record: C3ContributionRow) => {
    if (record.is_nil_return) {
      return { label: 'Nil Return', color: 'bg-gray-100 text-gray-700' };
    }
    if (record.is_submitted) {
      return { label: 'Paid', color: 'bg-green-100 text-green-700' };
    }
    return { label: 'Not Submitted', color: 'bg-amber-100 text-amber-700' };
  };

  const calculateTotalSS = (record: C3ContributionRow) => {
    return (record.total_ss_employee || 0) + (record.total_ss_employer || 0);
  };

  const calculateTotalLevy = (record: C3ContributionRow) => {
    return (record.total_levy_employee || 0) + (record.total_levy_employer || 0);
  };

  const calculateTotalFines = (record: C3ContributionRow) => {
    return (record.total_ss_penalty || 0) + (record.total_levy_penalty || 0) + (record.total_pe_penalty || 0);
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Dashboard</h1>
            <p className="text-muted-foreground">
              {companyName && `Welcome, ${companyName}`}
            </p>
          </div>
          <Button onClick={() => navigate('/employer/c3')} className="gap-2">
            <Plus className="h-4 w-4" />
            Generate C3
          </Button>
        </div>

        {/* C3 Contribution Table - Matching PDF layout exactly */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-lg">
              <FileText className="h-5 w-5" />
              C3 Contribution
            </CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="space-y-2">
                {[1, 2, 3, 4, 5].map((i) => (
                  <Skeleton key={i} className="h-12 w-full" />
                ))}
              </div>
            ) : c3Records.length === 0 ? (
              <div className="text-center py-12">
                <FileText className="h-16 w-16 mx-auto mb-4 text-muted-foreground/50" />
                <h3 className="text-lg font-medium mb-2">No C3 Forms Found</h3>
                <p className="text-muted-foreground mb-4">
                  Get started by generating your first C3 contribution form
                </p>
                <Button onClick={() => navigate('/employer/c3')}>
                  <Plus className="h-4 w-4 mr-2" />
                  Generate C3
                </Button>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-muted/50">
                      <TableHead className="font-semibold">Month</TableHead>
                      <TableHead className="font-semibold">Year</TableHead>
                      <TableHead className="font-semibold text-right">Wages</TableHead>
                      <TableHead className="font-semibold text-right">Social Security</TableHead>
                      <TableHead className="font-semibold text-right">Levy</TableHead>
                      <TableHead className="font-semibold text-right">Fines & Penalties</TableHead>
                      <TableHead className="font-semibold text-right">Severance</TableHead>
                      <TableHead className="font-semibold text-right">Total</TableHead>
                      <TableHead className="font-semibold">Creation Date</TableHead>
                      <TableHead className="font-semibold text-center">Schedule</TableHead>
                      <TableHead className="font-semibold text-center">Edit</TableHead>
                      <TableHead className="font-semibold text-center">Preview</TableHead>
                      <TableHead className="font-semibold text-center">Submit</TableHead>
                      <TableHead className="font-semibold">Payment</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {c3Records.map((record) => {
                      const paymentStatus = getPaymentStatus(record);
                      return (
                        <TableRow key={record.id} className="hover:bg-muted/30">
                          <TableCell className="font-medium">
                            {getMonthName(record.period_month)}
                          </TableCell>
                          <TableCell>{record.period_year}</TableCell>
                          <TableCell className="text-right font-mono">
                            {formatCurrency(record.total_wages)}
                          </TableCell>
                          <TableCell className="text-right font-mono">
                            {formatCurrency(calculateTotalSS(record))}
                          </TableCell>
                          <TableCell className="text-right font-mono">
                            {formatCurrency(calculateTotalLevy(record))}
                          </TableCell>
                          <TableCell className="text-right font-mono">
                            {formatCurrency(calculateTotalFines(record))}
                          </TableCell>
                          <TableCell className="text-right font-mono">
                            {formatCurrency(record.total_severance)}
                          </TableCell>
                          <TableCell className="text-right font-mono font-semibold">
                            {formatCurrency(record.grand_total)}
                          </TableCell>
                          <TableCell className="whitespace-nowrap">
                            {formatDate(record.created_at)}
                          </TableCell>
                          <TableCell className="text-center">
                            {record.schedule_number || 1}
                          </TableCell>
                          <TableCell className="text-center">
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleEditC3(record.id)}
                              disabled={record.is_submitted}
                              className="h-8 w-8"
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                          </TableCell>
                          <TableCell className="text-center">
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handlePreviewC3(record.id)}
                              className="h-8 w-8"
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                          </TableCell>
                          <TableCell className="text-center">
                            {record.is_submitted ? (
                              <CheckCircle2 className="h-5 w-5 text-green-600 mx-auto" />
                            ) : record.is_nil_return ? (
                              <span className="text-xs text-muted-foreground">Nil Return</span>
                            ) : (
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => handleSubmitC3(record.id)}
                                className="h-8 w-8"
                              >
                                <Send className="h-4 w-4" />
                              </Button>
                            )}
                          </TableCell>
                          <TableCell>
                            <Badge className={paymentStatus.color}>
                              {paymentStatus.label}
                            </Badge>
                            {!record.is_submitted && !record.is_nil_return && (
                              <Button
                                variant="link"
                                size="sm"
                                onClick={() => handlePayment(record.id)}
                                className="ml-2 text-xs p-0 h-auto"
                              >
                                Pay
                              </Button>
                            )}
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
