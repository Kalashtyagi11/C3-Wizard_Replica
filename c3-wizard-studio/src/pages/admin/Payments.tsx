import { useState } from 'react';
import { DashboardLayout } from '@/components/layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { CreditCard, Search, Download, Loader2, FileText } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { format } from 'date-fns';

type PaymentType = 'all' | 'employer' | 'self-employed' | 'nw-director';
type PaymentStatus = 'all' | 'AUTHORIZED' | 'PENDING' | 'DECLINED' | 'OFFLINE';

export default function AdminPayments() {
  const [filters, setFilters] = useState({
    type: 'all' as PaymentType,
    status: 'all' as PaymentStatus,
    fromDate: '',
    toDate: '',
    search: '',
  });

  const { data: payments = [], isLoading } = useQuery({
    queryKey: ['admin-payment-details', filters],
    queryFn: async () => {
      let query = supabase
        .from('c3_payments')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(200);

      if (filters.status !== 'all') {
        query = query.eq('payment_status', filters.status);
      }

      if (filters.fromDate) {
        query = query.gte('created_at', filters.fromDate);
      }

      if (filters.toDate) {
        query = query.lte('created_at', filters.toDate + 'T23:59:59');
      }

      const { data, error } = await query;
      if (error) throw error;
      return data || [];
    },
  });

  const formatCurrency = (amount: number | null | undefined) => {
    if (amount === null || amount === undefined) return '-';
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'XCD' }).format(amount);
  };

  const getStatusBadge = (status: string | null) => {
    if (!status) return <Badge variant="outline">Unknown</Badge>;
    
    const statusMap: Record<string, { variant: 'default' | 'secondary' | 'destructive' | 'outline'; label: string }> = {
      'AUTHORIZED': { variant: 'default', label: 'Authorized' },
      'PENDING': { variant: 'secondary', label: 'Pending' },
      'DECLINED': { variant: 'destructive', label: 'Declined' },
      'FAILED': { variant: 'destructive', label: 'Failed' },
      'OFFLINE': { variant: 'outline', label: 'Offline Payment' },
    };
    
    const config = statusMap[status.toUpperCase()] || { variant: 'outline' as const, label: status };
    return <Badge variant={config.variant}>{config.label}</Badge>;
  };

  const exportToCSV = () => {
    if (payments.length === 0) return;
    
    const headers = ['Payment ID', 'Gateway Transaction ID', 'Amount', 'Status', 'Payment Method', 'Period', 'Date'];
    const csvContent = [
      headers.join(','),
      ...payments.map((p) => [
        p.payment_id || '',
        p.payment_gateway_transaction_id || '',
        p.amount || 0,
        p.payment_status || '',
        p.payment_method || '',
        `${p.period_month || ''}-${p.period_year || ''}`,
        p.created_at ? format(new Date(p.created_at), 'yyyy-MM-dd HH:mm') : '',
      ].join(','))
    ].join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `payment_details_${format(new Date(), 'yyyy-MM-dd')}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const filteredPayments = payments.filter((p) => {
    if (!filters.search) return true;
    const search = filters.search.toLowerCase();
    return (
      (p.payment_id || '').toLowerCase().includes(search) ||
      (p.payment_gateway_transaction_id || '').toLowerCase().includes(search) ||
      (p.cardholder_name || '').toLowerCase().includes(search)
    );
  });

  const getMonthName = (month: string | null) => {
    if (!month) return '-';
    const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 
                        'July', 'August', 'September', 'October', 'November', 'December'];
    const monthNum = parseInt(month);
    return monthNames[monthNum - 1] || month;
  };

  return (
    <DashboardLayout>
      <div className="mt-16 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Payment Details</h1>
            <p className="text-muted-foreground">View all payment transactions</p>
          </div>
          <Button variant="outline" onClick={exportToCSV} disabled={payments.length === 0}>
            <Download className="h-4 w-4 mr-2" />
            Export Excel
          </Button>
        </div>

        {/* Filters */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex flex-wrap gap-4 items-end">
              <div className="space-y-2">
                <Label>Payment Status</Label>
                <Select
                  value={filters.status}
                  onValueChange={(v) => setFilters({ ...filters, status: v as PaymentStatus })}
                >
                  <SelectTrigger className="w-40">
                    <SelectValue placeholder="All Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="AUTHORIZED">Authorized</SelectItem>
                    <SelectItem value="PENDING">Pending</SelectItem>
                    <SelectItem value="DECLINED">Declined</SelectItem>
                    <SelectItem value="OFFLINE">Offline</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Select Type</Label>
                <Select
                  value={filters.type}
                  onValueChange={(v) => setFilters({ ...filters, type: v as PaymentType })}
                >
                  <SelectTrigger className="w-40">
                    <SelectValue placeholder="Select Type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Types</SelectItem>
                    <SelectItem value="employer">Employer</SelectItem>
                    <SelectItem value="nw-director">NW Director</SelectItem>
                    <SelectItem value="self-employed">Self-Employed</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>From Date</Label>
                <Input
                  type="date"
                  value={filters.fromDate}
                  onChange={(e) => setFilters({ ...filters, fromDate: e.target.value })}
                  className="w-40"
                />
              </div>
              <div className="space-y-2">
                <Label>To Date</Label>
                <Input
                  type="date"
                  value={filters.toDate}
                  onChange={(e) => setFilters({ ...filters, toDate: e.target.value })}
                  className="w-40"
                />
              </div>
              <div className="flex-1 space-y-2">
                <Label>Search</Label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search by payment ID or cardholder..."
                    className="pl-10"
                    value={filters.search}
                    onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                  />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Payment List */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CreditCard className="h-5 w-5" />
              Report List ({filteredPayments.length} records)
            </CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            ) : filteredPayments.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                No payment records found
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Month</TableHead>
                      <TableHead>Year</TableHead>
                      <TableHead>Amount</TableHead>
                      <TableHead>Payment Method</TableHead>
                      <TableHead>Card Type</TableHead>
                      <TableHead>Card Last 4</TableHead>
                      <TableHead>Creation Date</TableHead>
                      <TableHead>Gateway Transaction ID</TableHead>
                      <TableHead>Completed At</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Download PDF</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredPayments.map((payment) => (
                      <TableRow key={payment.id}>
                        <TableCell>{getMonthName(payment.period_month)}</TableCell>
                        <TableCell>{payment.period_year || '-'}</TableCell>
                        <TableCell className="font-semibold">
                          {formatCurrency(payment.amount)}
                        </TableCell>
                        <TableCell>{payment.payment_method || '-'}</TableCell>
                        <TableCell>{payment.card_type || '-'}</TableCell>
                        <TableCell>{payment.card_last_four ? `****${payment.card_last_four}` : '-'}</TableCell>
                        <TableCell>
                          {payment.created_at
                            ? format(new Date(payment.created_at), 'dd-MMM-yyyy')
                            : '-'}
                        </TableCell>
                        <TableCell className="font-mono text-xs">
                          {payment.payment_gateway_transaction_id || '-'}
                        </TableCell>
                        <TableCell>
                          {payment.payment_completed_at
                            ? format(new Date(payment.payment_completed_at), 'dd-MMM-yyyy')
                            : '-'}
                        </TableCell>
                        <TableCell>{getStatusBadge(payment.payment_status)}</TableCell>
                        <TableCell>
                          <Button variant="ghost" size="icon">
                            <FileText className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
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
