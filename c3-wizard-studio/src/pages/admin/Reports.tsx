import { useState } from 'react';
import { DashboardLayout } from '@/components/layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { FileText, Download, Search, Building2, User, CreditCard } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { format } from 'date-fns';

type ReportTab = 'employer' | 'self-employed' | 'payment' | 'user';

interface ReportsProps {
  type?: ReportTab;
}

export default function Reports({ type }: ReportsProps) {
  const [activeTab, setActiveTab] = useState<ReportTab>(type || 'employer');
  const [filters, setFilters] = useState({
    year: new Date().getFullYear().toString(),
    month: '',
    status: '',
    search: '',
  });

  // Employer C3 History
  const { data: employerC3 = [], isLoading: loadingEmployer } = useQuery({
    queryKey: ['admin-employer-c3', filters],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('c3_contribution_headers')
        .select('*')
        .eq('period_year', filters.year)
        .order('created_at', { ascending: false })
        .limit(100);
      
      if (error) throw error;
      
      // Fetch company data separately
      const companyIds = [...new Set((data || []).map((d) => d.company_id).filter(Boolean))] as number[];
      let companyMap: Record<number, { name: string; regNum: string }> = {};
      
      if (companyIds.length > 0) {
        const { data: companies } = await supabase
          .from('c3_companies')
          .select('id, company_name, registration_number')
          .in('id', companyIds);
        
        if (companies) {
          companyMap = companies.reduce((acc, c) => {
            acc[c.id] = { name: c.company_name || '', regNum: c.registration_number || '' };
            return acc;
          }, {} as Record<number, { name: string; regNum: string }>);
        }
      }
      
      // Merge company data
      return (data || []).map((c3) => ({
        ...c3,
        company_name: c3.company_id ? companyMap[c3.company_id]?.name : null,
        reg_number: c3.company_id ? companyMap[c3.company_id]?.regNum : null,
      }));
    },
    enabled: activeTab === 'employer',
  });

  // Self-Employed C3 History
  const { data: selfEmployedC3 = [], isLoading: loadingSelfEmployed } = useQuery({
    queryKey: ['admin-self-employed-c3', filters],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('c3_self_employed_contributions')
        .select('*')
        .eq('period_year', filters.year)
        .order('created_at', { ascending: false })
        .limit(100);
      
      if (error) throw error;
      if (!data || data.length === 0) return [];
      
      // Fetch all self-employed users in a single query
      const selfEmployeeIds = [...new Set(data.map((c) => c.self_employed_id).filter(Boolean))] as number[];
      let selfEmployeeMap: Record<number, { first_name: string; last_name: string; ssn: string }> = {};
      
      if (selfEmployeeIds.length > 0) {
        const { data: selfEmployees } = await supabase
          .from('c3_self_employed')
          .select('id, first_name, last_name, social_security_number')
          .in('id', selfEmployeeIds);
        
        if (selfEmployees) {
          selfEmployeeMap = selfEmployees.reduce((acc, se) => {
            acc[se.id] = { first_name: se.first_name || '', last_name: se.last_name || '', ssn: se.social_security_number || '' };
            return acc;
          }, {} as Record<number, { first_name: string; last_name: string; ssn: string }>);
        }
      }
      
      // Merge self-employed data
      return data.map((c3) => ({
        ...c3,
        self_employee_name: c3.self_employed_id ? `${selfEmployeeMap[c3.self_employed_id]?.first_name || ''} ${selfEmployeeMap[c3.self_employed_id]?.last_name || ''}`.trim() : null,
        self_employee_ssn: c3.self_employed_id ? selfEmployeeMap[c3.self_employed_id]?.ssn : null,
      }));
    },
    enabled: activeTab === 'self-employed',
  });

  // Payment History
  const { data: payments = [], isLoading: loadingPayments } = useQuery({
    queryKey: ['admin-payments', filters],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('c3_payments')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(100);
      
      if (error) throw error;
      return data;
    },
    enabled: activeTab === 'payment',
  });

  // Users History
  const { data: users = [], isLoading: loadingUsers } = useQuery({
    queryKey: ['admin-users-report', filters.search],
    queryFn: async () => {
      let query = supabase
        .from('c3_users')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(100);
      
      if (filters.search) {
        query = query.or(`email.ilike.%${filters.search}%,username.ilike.%${filters.search}%`);
      }
      
      const { data, error } = await query;
      if (error) throw error;
      return data;
    },
    enabled: activeTab === 'user',
  });

  const exportToCSV = (data: any[], filename: string) => {
    if (data.length === 0) return;
    
    const headers = Object.keys(data[0]);
    const csvContent = [
      headers.join(','),
      ...data.map(row => headers.map(h => JSON.stringify(row[h] || '')).join(','))
    ].join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${filename}_${format(new Date(), 'yyyy-MM-dd')}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const formatCurrency = (amount: number | null) => {
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
    };
    
    const config = statusMap[status.toUpperCase()] || { variant: 'outline' as const, label: status };
    return <Badge variant={config.variant}>{config.label}</Badge>;
  };

  const months = [
    { value: '', label: 'All Months' },
    { value: '1', label: 'January' },
    { value: '2', label: 'February' },
    { value: '3', label: 'March' },
    { value: '4', label: 'April' },
    { value: '5', label: 'May' },
    { value: '6', label: 'June' },
    { value: '7', label: 'July' },
    { value: '8', label: 'August' },
    { value: '9', label: 'September' },
    { value: '10', label: 'October' },
    { value: '11', label: 'November' },
    { value: '12', label: 'December' },
  ];

  return (
    <DashboardLayout>
      <div className="mt-16 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Reports</h1>
            <p className="text-muted-foreground">View and export historical records</p>
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as ReportTab)}>
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="employer" className="gap-2">
              <Building2 className="h-4 w-4" />
              Employer C3
            </TabsTrigger>
            <TabsTrigger value="self-employed" className="gap-2">
              <User className="h-4 w-4" />
              Self-Employed C3
            </TabsTrigger>
            <TabsTrigger value="payment" className="gap-2">
              <CreditCard className="h-4 w-4" />
              Payments
            </TabsTrigger>
            <TabsTrigger value="user" className="gap-2">
              <User className="h-4 w-4" />
              Users
            </TabsTrigger>
          </TabsList>

          {/* Filters */}
          <Card className="mt-4">
            <CardContent className="pt-4">
              <div className="flex gap-4 items-end">
                <div className="space-y-2">
                  <Label>Year</Label>
                  <Select value={filters.year} onValueChange={(v) => setFilters({ ...filters, year: v })}>
                    <SelectTrigger className="w-32">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {[2026, 2025, 2024, 2023, 2022].map(year => (
                        <SelectItem key={year} value={year.toString()}>{year}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                {(activeTab === 'employer' || activeTab === 'self-employed') && (
                  <div className="space-y-2">
                    <Label>Month</Label>
                    <Select value={filters.month} onValueChange={(v) => setFilters({ ...filters, month: v })}>
                      <SelectTrigger className="w-40">
                        <SelectValue placeholder="All Months" />
                      </SelectTrigger>
                      <SelectContent>
                        {months.map(m => (
                          <SelectItem key={m.value} value={m.value}>{m.label}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                )}
                <div className="flex-1 space-y-2">
                  <Label>Search</Label>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search..."
                      className="pl-10"
                      value={filters.search}
                      onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Employer C3 Tab */}
          <TabsContent value="employer">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  Employer C3 History ({employerC3.length} records)
                </CardTitle>
                <Button variant="outline" onClick={() => exportToCSV(employerC3, 'employer_c3_history')}>
                  <Download className="h-4 w-4 mr-2" />
                  Export CSV
                </Button>
              </CardHeader>
              <CardContent>
                {loadingEmployer ? (
                  <div className="text-center py-8">Loading...</div>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Company</TableHead>
                        <TableHead>Reg #</TableHead>
                        <TableHead>Period</TableHead>
                        <TableHead>Total SS</TableHead>
                        <TableHead>Total Levy</TableHead>
                        <TableHead>Total Severance</TableHead>
                        <TableHead>Created</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {employerC3.map((c3: any) => (
                        <TableRow key={c3.id}>
                          <TableCell>{c3.company_name || 'N/A'}</TableCell>
                          <TableCell>{c3.reg_number || '-'}</TableCell>
                          <TableCell>{months.find(m => m.value === c3.period_month?.toString())?.label} {c3.period_year}</TableCell>
                          <TableCell>{formatCurrency(c3.total_social_security)}</TableCell>
                          <TableCell>{formatCurrency((c3.total_levy_employee || 0) + (c3.total_levy_employer || 0))}</TableCell>
                          <TableCell>{formatCurrency(c3.total_severance)}</TableCell>
                          <TableCell>{c3.created_at ? format(new Date(c3.created_at), 'MMM dd, yyyy') : '-'}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Self-Employed C3 Tab */}
          <TabsContent value="self-employed">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  Self-Employed C3 History ({selfEmployedC3.length} records)
                </CardTitle>
                <Button variant="outline" onClick={() => exportToCSV(selfEmployedC3, 'self_employed_c3_history')}>
                  <Download className="h-4 w-4 mr-2" />
                  Export CSV
                </Button>
              </CardHeader>
              <CardContent>
                {loadingSelfEmployed ? (
                  <div className="text-center py-8">Loading...</div>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Name</TableHead>
                        <TableHead>SSN</TableHead>
                        <TableHead>Period</TableHead>
                        <TableHead>Total SS</TableHead>
                        <TableHead>Total Levy</TableHead>
                        <TableHead>Total Severance</TableHead>
                        <TableHead>Created</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {selfEmployedC3.map((c3: any) => (
                        <TableRow key={c3.id}>
                          <TableCell>{c3.self_employee_name || 'N/A'}</TableCell>
                          <TableCell>{c3.self_employee_ssn || '-'}</TableCell>
                          <TableCell>{months.find(m => m.value === c3.period_month?.toString())?.label} {c3.period_year}</TableCell>
                          <TableCell>{formatCurrency(c3.total_social_security)}</TableCell>
                          <TableCell>{formatCurrency(c3.total_levy)}</TableCell>
                          <TableCell>{formatCurrency(c3.total_severance)}</TableCell>
                          <TableCell>{c3.created_at ? format(new Date(c3.created_at), 'MMM dd, yyyy') : '-'}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Payments Tab */}
          <TabsContent value="payment">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <CreditCard className="h-5 w-5" />
                  Payment History ({payments.length} records)
                </CardTitle>
                <Button variant="outline" onClick={() => exportToCSV(payments, 'payment_history')}>
                  <Download className="h-4 w-4 mr-2" />
                  Export CSV
                </Button>
              </CardHeader>
              <CardContent>
                {loadingPayments ? (
                  <div className="text-center py-8">Loading...</div>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Transaction ID</TableHead>
                        <TableHead>Mode</TableHead>
                        <TableHead>Amount</TableHead>
                        <TableHead>SS</TableHead>
                        <TableHead>Levy</TableHead>
                        <TableHead>Severance</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Date</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {payments.map((payment: any) => (
                        <TableRow key={payment.id}>
                          <TableCell className="font-mono text-sm">{payment.transaction_id || '-'}</TableCell>
                          <TableCell>{payment.payment_mode || '-'}</TableCell>
                          <TableCell className="font-medium">{formatCurrency(payment.amount)}</TableCell>
                          <TableCell>{formatCurrency(payment.total_social_security)}</TableCell>
                          <TableCell>{formatCurrency(payment.total_levy)}</TableCell>
                          <TableCell>{formatCurrency(payment.total_severance)}</TableCell>
                          <TableCell>{getStatusBadge(payment.status)}</TableCell>
                          <TableCell>{payment.created_at ? format(new Date(payment.created_at), 'MMM dd, yyyy') : '-'}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Users Tab */}
          <TabsContent value="user">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <User className="h-5 w-5" />
                  Users History ({users.length} records)
                </CardTitle>
                <Button variant="outline" onClick={() => exportToCSV(users, 'users_history')}>
                  <Download className="h-4 w-4 mr-2" />
                  Export CSV
                </Button>
              </CardHeader>
              <CardContent>
                {loadingUsers ? (
                  <div className="text-center py-8">Loading...</div>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Username</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead>Role</TableHead>
                        <TableHead>Type</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Last Login</TableHead>
                        <TableHead>Created</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {users.map((user: any) => (
                        <TableRow key={user.id}>
                          <TableCell className="font-medium">{user.username || '-'}</TableCell>
                          <TableCell>{user.email || '-'}</TableCell>
                          <TableCell>{user.role_id || '-'}</TableCell>
                          <TableCell>
                            <Badge variant="outline">{user.user_type || 'UNKNOWN'}</Badge>
                          </TableCell>
                          <TableCell>
                            <Badge variant={!user.is_deleted ? 'default' : 'secondary'}>
                              {!user.is_deleted ? 'Active' : 'Inactive'}
                            </Badge>
                          </TableCell>
                          <TableCell>{user.last_login_at ? format(new Date(user.last_login_at), 'MMM dd, yyyy') : 'Never'}</TableCell>
                          <TableCell>{user.created_at ? format(new Date(user.created_at), 'MMM dd, yyyy') : '-'}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
}
