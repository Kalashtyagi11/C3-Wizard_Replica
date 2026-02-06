/**
 * Employer Reports Page
 * 
 * Generates various reports for C3 contributions:
 * - C3 Summary Report
 * - Employee Contribution Report
 * - Payment History Report
 * - All with PDF/Excel export
 */

import { useState } from 'react';
import { DashboardLayout } from '@/components/layout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Skeleton } from '@/components/ui/skeleton';
import { 
  FileText, Download, Loader2, Users, 
  CreditCard, BarChart3
} from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { useQuery } from '@tanstack/react-query';
import { toast } from 'sonner';
import jsPDF from 'jspdf';

const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

export default function Reports() {
  const { companyId } = useAuth();
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 11 }, (_, i) => currentYear - 5 + i);

  // Filters
  const [fromMonth, setFromMonth] = useState(1);
  const [fromYear, setFromYear] = useState(currentYear);
  const [toMonth, setToMonth] = useState(new Date().getMonth() + 1);
  const [toYear, setToYear] = useState(currentYear);
  const [selectedPeriodMonth, setSelectedPeriodMonth] = useState(new Date().getMonth() + 1);
  const [selectedPeriodYear, setSelectedPeriodYear] = useState(currentYear);
  const [isExporting, setIsExporting] = useState(false);

  // Fetch C3 Summary data
  const { data: summaryData, isLoading: summaryLoading } = useQuery({
    queryKey: ['c3-summary', companyId, fromMonth, fromYear, toMonth, toYear],
    queryFn: async () => {
      if (!companyId) return [];
      
      const { data, error } = await supabase
        .from('c3_contribution_headers')
        .select(`
          id,
          period_month,
          period_year,
          total_wages,
          total_ss_employee,
          total_ss_employer,
          total_ei_employee,
          total_ei_employer,
          total_levy_employee,
          total_levy_employer,
          total_pe_employee,
          total_pe_employer,
          grand_total,
          employee_count,
          is_finalized,
          is_submitted,
          schedule_number
        `)
        .eq('company_id', companyId)
        .order('period_year', { ascending: false })
        .order('period_month', { ascending: false });

      if (error) throw error;
      
      // Filter by date range
      return (data || []).filter(c3 => {
        const month = parseInt(c3.period_month || '0');
        const year = parseInt(c3.period_year || '0');
        const fromDate = fromYear * 12 + fromMonth;
        const toDate = toYear * 12 + toMonth;
        const c3Date = year * 12 + month;
        return c3Date >= fromDate && c3Date <= toDate;
      });
    },
    enabled: !!companyId,
  });

  // Fetch Employee Contribution data for selected period
  const { data: employeeData, isLoading: employeeLoading } = useQuery({
    queryKey: ['employee-contributions', companyId, selectedPeriodMonth, selectedPeriodYear],
    queryFn: async () => {
      if (!companyId) return [];
      
      const { data: header } = await supabase
        .from('c3_contribution_headers')
        .select('id')
        .eq('company_id', companyId)
        .eq('period_month', selectedPeriodMonth.toString())
        .eq('period_year', selectedPeriodYear.toString())
        .maybeSingle();

      if (!header) return [];

      const { data: details, error } = await supabase
        .from('c3_contribution_details')
        .select(`
          *,
          c3_employees!c3_contribution_details_employee_id_fkey (
            first_name,
            last_name,
            social_security_number
          )
        `)
        .eq('header_id', header.id);

      if (error) throw error;
      return details || [];
    },
    enabled: !!companyId,
  });

  // Fetch Payment History
  const { data: paymentData, isLoading: paymentLoading } = useQuery({
    queryKey: ['payment-history', companyId],
    queryFn: async () => {
      if (!companyId) return [];
      
      const { data, error } = await supabase
        .from('c3_payments')
        .select(`
          *,
          c3_contribution_headers!inner (
            period_month,
            period_year,
            company_id
          )
        `)
        .eq('c3_contribution_headers.company_id', companyId)
        .order('created_at', { ascending: false })
        .limit(50);

      if (error) throw error;
      return data || [];
    },
    enabled: !!companyId,
  });

  const formatCurrency = (amount: number | null) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'XCD',
      minimumFractionDigits: 2,
    }).format(amount || 0);
  };

  const formatSSN = (ssn: string | null) => {
    if (!ssn) return '---';
    if (ssn.length >= 4) {
      return `XXX-XX-${ssn.slice(-4)}`;
    }
    return ssn;
  };

  const getMonthName = (monthNum: string | null) => {
    if (!monthNum) return '-';
    const num = parseInt(monthNum);
    return MONTHS[num - 1] || monthNum;
  };

  const exportSummaryPDF = async () => {
    setIsExporting(true);
    try {
      const doc = new jsPDF();
      
      // Header
      doc.setFontSize(18);
      doc.text('C3 Summary Report', 14, 22);
      doc.setFontSize(11);
      doc.text(`Period: ${MONTHS[fromMonth - 1]} ${fromYear} - ${MONTHS[toMonth - 1]} ${toYear}`, 14, 32);
      doc.text(`Generated: ${new Date().toLocaleDateString()}`, 14, 38);

      // Table header
      let y = 50;
      doc.setFontSize(10);
      doc.setFont('helvetica', 'bold');
      doc.text('Period', 14, y);
      doc.text('Employees', 45, y);
      doc.text('Wages', 70, y);
      doc.text('SS', 100, y);
      doc.text('Levy', 125, y);
      doc.text('Total', 150, y);
      doc.text('Status', 180, y);

      // Table rows
      doc.setFont('helvetica', 'normal');
      summaryData?.forEach((row, idx) => {
        y = 58 + (idx * 7);
        if (y > 280) {
          doc.addPage();
          y = 20;
        }
        doc.text(`${getMonthName(row.period_month)} ${row.period_year}`, 14, y);
        doc.text(String(row.employee_count || 0), 45, y);
        doc.text(formatCurrency(row.total_wages), 70, y);
        doc.text(formatCurrency((row.total_ss_employee || 0) + (row.total_ss_employer || 0)), 100, y);
        doc.text(formatCurrency((row.total_levy_employee || 0) + (row.total_levy_employer || 0)), 125, y);
        doc.text(formatCurrency(row.grand_total), 150, y);
        doc.text(row.is_submitted ? 'Submitted' : 'Draft', 180, y);
      });

      doc.save(`C3_Summary_Report_${fromYear}_${toYear}.pdf`);
      toast.success('Report exported successfully');
    } catch (error) {
      console.error('Export error:', error);
      toast.error('Failed to export report');
    } finally {
      setIsExporting(false);
    }
  };

  const exportEmployeePDF = async () => {
    setIsExporting(true);
    try {
      const doc = new jsPDF('landscape');
      
      // Header
      doc.setFontSize(18);
      doc.text('Employee Contribution Report', 14, 22);
      doc.setFontSize(11);
      doc.text(`Period: ${MONTHS[selectedPeriodMonth - 1]} ${selectedPeriodYear}`, 14, 32);
      doc.text(`Generated: ${new Date().toLocaleDateString()}`, 14, 38);

      // Table header
      let y = 50;
      doc.setFontSize(9);
      doc.setFont('helvetica', 'bold');
      const headers = ['Name', 'SSN', 'Wages', 'SS(EE)', 'SS(ER)', 'EI(EE)', 'EI(ER)', 'Levy(EE)', 'Levy(ER)', 'PE(EE)', 'PE(ER)', 'Total'];
      let x = 14;
      headers.forEach(h => {
        doc.text(h, x, y);
        x += 23;
      });

      // Table rows
      doc.setFont('helvetica', 'normal');
      employeeData?.forEach((row: Record<string, unknown>, idx: number) => {
        y = 58 + (idx * 6);
        if (y > 190) {
          doc.addPage();
          y = 20;
        }
        x = 14;
        const emp = row.c3_employees as { first_name?: string; last_name?: string } | null;
        doc.text(`${emp?.first_name || ''} ${emp?.last_name || ''}`.substring(0, 15), x, y);
        x += 23;
        doc.text(formatSSN(row.social_security_number as string | null).substring(0, 11), x, y);
        x += 23;
        
        const values = [
          ((row.week1_wages as number) || 0) + ((row.week2_wages as number) || 0) + 
          ((row.week3_wages as number) || 0) + ((row.week4_wages as number) || 0) + ((row.week5_wages as number) || 0),
          row.social_security_employee as number,
          row.social_security_employer as number,
          row.ei_employee as number,
          row.ei_employer as number,
          row.levy_employee as number,
          row.levy_employer as number,
          row.severance_employee as number,
          row.severance_employer as number,
        ];
        
        values.forEach(v => {
          doc.text(formatCurrency(v || 0).replace('XCD', ''), x, y);
          x += 23;
        });

        const total = ((row.social_security_employee as number) || 0) + ((row.social_security_employer as number) || 0) +
                      ((row.ei_employee as number) || 0) + ((row.ei_employer as number) || 0) +
                      ((row.levy_employee as number) || 0) + ((row.levy_employer as number) || 0) +
                      ((row.severance_employee as number) || 0) + ((row.severance_employer as number) || 0);
        doc.text(formatCurrency(total).replace('XCD', ''), x, y);
      });

      doc.save(`Employee_Contributions_${selectedPeriodMonth}_${selectedPeriodYear}.pdf`);
      toast.success('Report exported successfully');
    } catch (error) {
      console.error('Export error:', error);
      toast.error('Failed to export report');
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
            <BarChart3 className="h-6 w-6" />
            Reports
          </h1>
          <p className="text-muted-foreground">
            Generate and export C3 contribution reports
          </p>
        </div>

        <Tabs defaultValue="summary" className="space-y-4">
          <TabsList>
            <TabsTrigger value="summary" className="gap-2">
              <FileText className="h-4 w-4" />
              C3 Summary
            </TabsTrigger>
            <TabsTrigger value="employee" className="gap-2">
              <Users className="h-4 w-4" />
              Employee Contributions
            </TabsTrigger>
            <TabsTrigger value="payments" className="gap-2">
              <CreditCard className="h-4 w-4" />
              Payment History
            </TabsTrigger>
          </TabsList>

          {/* C3 Summary Tab */}
          <TabsContent value="summary">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>C3 Summary Report</CardTitle>
                  <CardDescription>Overview of all C3 submissions</CardDescription>
                </div>
                <Button onClick={exportSummaryPDF} disabled={isExporting || !summaryData?.length}>
                  {isExporting ? (
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  ) : (
                    <Download className="h-4 w-4 mr-2" />
                  )}
                  Export PDF
                </Button>
              </CardHeader>
              <CardContent>
                {/* Date Range Filters */}
                <div className="grid gap-4 md:grid-cols-4 mb-6">
                  <div className="space-y-2">
                    <Label>From Month</Label>
                    <Select value={fromMonth.toString()} onValueChange={(v) => setFromMonth(parseInt(v))}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {MONTHS.map((m, i) => (
                          <SelectItem key={i} value={(i + 1).toString()}>{m}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>From Year</Label>
                    <Select value={fromYear.toString()} onValueChange={(v) => setFromYear(parseInt(v))}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {years.map((y) => (
                          <SelectItem key={y} value={y.toString()}>{y}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>To Month</Label>
                    <Select value={toMonth.toString()} onValueChange={(v) => setToMonth(parseInt(v))}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {MONTHS.map((m, i) => (
                          <SelectItem key={i} value={(i + 1).toString()}>{m}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>To Year</Label>
                    <Select value={toYear.toString()} onValueChange={(v) => setToYear(parseInt(v))}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {years.map((y) => (
                          <SelectItem key={y} value={y.toString()}>{y}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* Summary Table */}
                {summaryLoading ? (
                  <div className="space-y-2">
                    {[1, 2, 3].map((i) => (
                      <Skeleton key={i} className="h-12 w-full" />
                    ))}
                  </div>
                ) : summaryData?.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    No C3 forms found for the selected period
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Period</TableHead>
                          <TableHead className="text-right">Employees</TableHead>
                          <TableHead className="text-right">Total Wages</TableHead>
                          <TableHead className="text-right">Social Security</TableHead>
                          <TableHead className="text-right">Levy</TableHead>
                          <TableHead className="text-right">Severance</TableHead>
                          <TableHead className="text-right">Grand Total</TableHead>
                          <TableHead>Status</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {summaryData?.map((row) => (
                          <TableRow key={row.id}>
                            <TableCell className="font-medium">
                              {getMonthName(row.period_month)} {row.period_year}
                            </TableCell>
                            <TableCell className="text-right">{row.employee_count || 0}</TableCell>
                            <TableCell className="text-right">{formatCurrency(row.total_wages)}</TableCell>
                            <TableCell className="text-right">
                              {formatCurrency((row.total_ss_employee || 0) + (row.total_ss_employer || 0))}
                            </TableCell>
                            <TableCell className="text-right">
                              {formatCurrency((row.total_levy_employee || 0) + (row.total_levy_employer || 0))}
                            </TableCell>
                            <TableCell className="text-right">
                              {formatCurrency((row.total_pe_employee || 0) + (row.total_pe_employer || 0))}
                            </TableCell>
                            <TableCell className="text-right font-bold">
                              {formatCurrency(row.grand_total)}
                            </TableCell>
                            <TableCell>
                              <Badge variant={row.is_submitted ? 'default' : 'secondary'}>
                                {row.is_submitted ? 'Submitted' : 'Draft'}
                              </Badge>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Employee Contributions Tab */}
          <TabsContent value="employee">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>Employee Contribution Report</CardTitle>
                  <CardDescription>Detailed breakdown by employee</CardDescription>
                </div>
                <Button onClick={exportEmployeePDF} disabled={isExporting || !employeeData?.length}>
                  {isExporting ? (
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  ) : (
                    <Download className="h-4 w-4 mr-2" />
                  )}
                  Export PDF
                </Button>
              </CardHeader>
              <CardContent>
                {/* Period Filter */}
                <div className="grid gap-4 md:grid-cols-2 mb-6">
                  <div className="space-y-2">
                    <Label>Month</Label>
                    <Select 
                      value={selectedPeriodMonth.toString()} 
                      onValueChange={(v) => setSelectedPeriodMonth(parseInt(v))}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {MONTHS.map((m, i) => (
                          <SelectItem key={i} value={(i + 1).toString()}>{m}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Year</Label>
                    <Select 
                      value={selectedPeriodYear.toString()} 
                      onValueChange={(v) => setSelectedPeriodYear(parseInt(v))}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {years.map((y) => (
                          <SelectItem key={y} value={y.toString()}>{y}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* Employee Table */}
                {employeeLoading ? (
                  <div className="space-y-2">
                    {[1, 2, 3].map((i) => (
                      <Skeleton key={i} className="h-12 w-full" />
                    ))}
                  </div>
                ) : employeeData?.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    No employee data found for the selected period
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Employee</TableHead>
                          <TableHead>SSN</TableHead>
                          <TableHead className="text-right">Wages</TableHead>
                          <TableHead className="text-right">SS (EE)</TableHead>
                          <TableHead className="text-right">SS (ER)</TableHead>
                          <TableHead className="text-right">Levy (EE)</TableHead>
                          <TableHead className="text-right">Levy (ER)</TableHead>
                          <TableHead className="text-right">Total</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {employeeData?.map((row: Record<string, unknown>) => {
                          const emp = row.c3_employees as { first_name?: string; last_name?: string } | null;
                          const totalWages = ((row.week1_wages as number) || 0) + ((row.week2_wages as number) || 0) + 
                                            ((row.week3_wages as number) || 0) + ((row.week4_wages as number) || 0) + ((row.week5_wages as number) || 0);
                          const total = ((row.social_security_employee as number) || 0) + ((row.social_security_employer as number) || 0) +
                                       ((row.ei_employee as number) || 0) + ((row.ei_employer as number) || 0) +
                                       ((row.levy_employee as number) || 0) + ((row.levy_employer as number) || 0) +
                                       ((row.severance_employee as number) || 0) + ((row.severance_employer as number) || 0);
                          return (
                            <TableRow key={row.id as number}>
                              <TableCell className="font-medium">
                                {emp?.first_name} {emp?.last_name}
                              </TableCell>
                              <TableCell className="font-mono">
                                {formatSSN(row.social_security_number as string | null)}
                              </TableCell>
                              <TableCell className="text-right">{formatCurrency(totalWages)}</TableCell>
                              <TableCell className="text-right">{formatCurrency(row.social_security_employee as number)}</TableCell>
                              <TableCell className="text-right">{formatCurrency(row.social_security_employer as number)}</TableCell>
                              <TableCell className="text-right">{formatCurrency(row.levy_employee as number)}</TableCell>
                              <TableCell className="text-right">{formatCurrency(row.levy_employer as number)}</TableCell>
                              <TableCell className="text-right font-bold">{formatCurrency(total)}</TableCell>
                            </TableRow>
                          );
                        })}
                      </TableBody>
                    </Table>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Payment History Tab */}
          <TabsContent value="payments">
            <Card>
              <CardHeader>
                <CardTitle>Payment History</CardTitle>
                <CardDescription>Record of all C3 payments</CardDescription>
              </CardHeader>
              <CardContent>
                {paymentLoading ? (
                  <div className="space-y-2">
                    {[1, 2, 3].map((i) => (
                      <Skeleton key={i} className="h-12 w-full" />
                    ))}
                  </div>
                ) : paymentData?.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    No payment records found
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Date</TableHead>
                          <TableHead>Period</TableHead>
                          <TableHead className="text-right">Amount</TableHead>
                          <TableHead>Method</TableHead>
                          <TableHead>Transaction ID</TableHead>
                          <TableHead>Status</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {paymentData?.map((payment: Record<string, unknown>) => {
                          const header = payment.c3_contribution_headers as { period_month?: string; period_year?: string } | null;
                          return (
                            <TableRow key={payment.id as number}>
                              <TableCell>
                                {payment.created_at ? new Date(payment.created_at as string).toLocaleDateString() : '-'}
                              </TableCell>
                              <TableCell>
                                {getMonthName(header?.period_month || null)} {header?.period_year}
                              </TableCell>
                              <TableCell className="text-right font-medium">
                                {formatCurrency(payment.amount as number)}
                              </TableCell>
                              <TableCell>{(payment.payment_gateway as string) || '-'}</TableCell>
                              <TableCell className="font-mono text-sm">
                                {(payment.transaction_id as string) || '-'}
                              </TableCell>
                              <TableCell>
                                <Badge variant={(payment.status as string) === 'AUTHORIZED' ? 'default' : 'secondary'}>
                                  {(payment.status as string) || 'Pending'}
                                </Badge>
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
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
}
