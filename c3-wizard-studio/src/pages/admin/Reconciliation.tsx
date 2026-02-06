import { useState } from 'react';
import { DashboardLayout } from '@/components/layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { RefreshCw, Search, FileSpreadsheet } from 'lucide-react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export default function Reconciliation() {
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState('');

  // Fetch payments for reconciliation
  const { data: payments = [], isLoading } = useQuery({
    queryKey: ['reconciliation-payments', searchTerm],
    queryFn: async () => {
      let query = supabase
        .from('c3_payments')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(200);
      
      if (searchTerm) {
        query = query.or(`transaction_id.ilike.%${searchTerm}%,merchant_reference_number.ilike.%${searchTerm}%`);
      }
      
      const { data, error } = await query;
      if (error) throw error;
      return data;
    },
  });

  const formatCurrency = (amount: number | null) => {
    if (amount === null || amount === undefined) return '-';
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'XCD' }).format(amount);
  };

  return (
    <DashboardLayout>
      <div className="mt-16 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Payment Reconciliation</h1>
            <p className="text-muted-foreground">Match and reconcile payment transactions</p>
          </div>
          <Button variant="outline" onClick={() => queryClient.invalidateQueries({ queryKey: ['reconciliation-payments'] })}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardContent className="pt-6">
              <div className="text-2xl font-bold">{payments.length}</div>
              <p className="text-sm text-muted-foreground">Total Payments</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="text-2xl font-bold text-green-600">
                {payments.filter(p => p.payment_status === 'SUCCESS').length}
              </div>
              <p className="text-sm text-muted-foreground">Successful</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="text-2xl font-bold">
                {formatCurrency(payments.reduce((sum, p) => sum + (p.amount || 0), 0))}
              </div>
              <p className="text-sm text-muted-foreground">Total Amount</p>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <FileSpreadsheet className="h-5 w-5" />
                Payment Records
              </CardTitle>
              <div className="relative w-64">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search..."
                  className="pl-10"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="text-center py-8">Loading...</div>
            ) : payments.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">No payments found.</div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Transaction ID</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Date</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {payments.map((payment) => (
                    <TableRow key={payment.id}>
                      <TableCell className="font-mono text-sm">{payment.id}</TableCell>
                      <TableCell className="font-medium">{formatCurrency(payment.amount)}</TableCell>
                      <TableCell>
                        <Badge variant={payment.payment_status === 'SUCCESS' ? 'default' : 'secondary'}>
                          {payment.payment_status || 'Unknown'}
                        </Badge>
                      </TableCell>
                      <TableCell>{payment.created_at || '-'}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
