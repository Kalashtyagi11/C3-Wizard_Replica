/**
 * Self-Employed Payments Page
 * Connected to c3_payments table
 */

import { useState, useEffect } from 'react';
import { DashboardLayout } from '@/components/layout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { CreditCard, Download, Eye, Calendar, CheckCircle, XCircle, Clock } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { Skeleton } from '@/components/ui/skeleton';
import { format } from 'date-fns';
import type { Database } from '@/integrations/supabase/types';

type Payment = Database['public']['Tables']['c3_payments']['Row'];

export default function SelfEmployedPayments() {
  const { user } = useAuth();
  const [payments, setPayments] = useState<Payment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [totalPaid, setTotalPaid] = useState(0);

  useEffect(() => {
    const fetchPayments = async () => {
      if (!user?.email) return;

      try {
        // Get self-employed profile to find user ID
        const { data: profile } = await supabase
          .from('c3_self_employed')
          .select('id, social_security_number')
          .eq('email', user.email)
          .maybeSingle();

        if (!profile) {
          setIsLoading(false);
          return;
        }

        // Fetch payments for this user
        const { data: paymentsData } = await supabase
          .from('c3_payments')
          .select('*')
          .eq('user_id', profile.id)
          .order('created_at', { ascending: false });

        setPayments(paymentsData || []);

        // Calculate total paid
        const total = (paymentsData || [])
          .filter((p) => p.payment_status?.toLowerCase() === 'completed' || p.payment_status?.toLowerCase() === 'success')
          .reduce((sum, p) => sum + (p.amount || 0), 0);
        setTotalPaid(total);
      } catch (err) {
        console.error('Error fetching payments:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPayments();
  }, [user]);

  const formatCurrency = (amount: number | null, currency: string | null = 'XCD') => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency || 'XCD',
      minimumFractionDigits: 2,
    }).format(amount || 0);
  };

  const formatDate = (dateStr: string | null) => {
    if (!dateStr) return 'N/A';
    try {
      return format(new Date(dateStr), 'MMM d, yyyy h:mm a');
    } catch {
      return dateStr;
    }
  };

  const getStatusBadge = (status: string | null) => {
    const statusLower = status?.toLowerCase() || '';
    if (statusLower === 'completed' || statusLower === 'success') {
      return (
        <Badge className="bg-green-100 text-green-700 hover:bg-green-100">
          <CheckCircle className="h-3 w-3 mr-1" />
          Completed
        </Badge>
      );
    } else if (statusLower === 'pending') {
      return (
        <Badge className="bg-yellow-100 text-yellow-700 hover:bg-yellow-100">
          <Clock className="h-3 w-3 mr-1" />
          Pending
        </Badge>
      );
    } else if (statusLower === 'failed' || statusLower === 'declined') {
      return (
        <Badge className="bg-red-100 text-red-700 hover:bg-red-100">
          <XCircle className="h-3 w-3 mr-1" />
          Failed
        </Badge>
      );
    }
    return <Badge variant="secondary">{status || 'Unknown'}</Badge>;
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Payments</h1>
          <p className="text-muted-foreground">
            View your payment history and transactions
          </p>
        </div>

        {/* Summary Cards */}
        <div className="grid gap-4 md:grid-cols-3">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Paid</CardTitle>
              <CreditCard className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <Skeleton className="h-8 w-24" />
              ) : (
                <div className="text-2xl font-bold">{formatCurrency(totalPaid)}</div>
              )}
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Transactions</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <Skeleton className="h-8 w-16" />
              ) : (
                <div className="text-2xl font-bold">{payments.length}</div>
              )}
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Successful</CardTitle>
              <CheckCircle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <Skeleton className="h-8 w-16" />
              ) : (
                <div className="text-2xl font-bold">
                  {payments.filter((p) => 
                    p.payment_status?.toLowerCase() === 'completed' || 
                    p.payment_status?.toLowerCase() === 'success'
                  ).length}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Payments Table */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CreditCard className="h-5 w-5" />
              Payment History
            </CardTitle>
            <CardDescription>All your C3 contribution payments</CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="space-y-2">
                {[1, 2, 3, 4, 5].map((i) => (
                  <Skeleton key={i} className="h-12 w-full" />
                ))}
              </div>
            ) : payments.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <CreditCard className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>No payments found.</p>
                <p className="text-sm mt-1">Your payment history will appear here after you submit a C3.</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Date</TableHead>
                      <TableHead>Payment ID</TableHead>
                      <TableHead>Description</TableHead>
                      <TableHead>Amount</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {payments.map((payment) => (
                      <TableRow key={payment.id}>
                        <TableCell className="whitespace-nowrap">
                          {formatDate(payment.created_at)}
                        </TableCell>
                        <TableCell className="font-mono text-sm">
                          {payment.id}
                        </TableCell>
                        <TableCell>{payment.payment_type || 'C3 Contribution'}</TableCell>
                        <TableCell className="font-medium">
                          {formatCurrency(payment.amount, payment.currency)}
                        </TableCell>
                        <TableCell>{getStatusBadge(payment.payment_status)}</TableCell>
                        <TableCell className="text-right">
                          <Button variant="ghost" size="sm">
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="sm">
                            <Download className="h-4 w-4" />
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
