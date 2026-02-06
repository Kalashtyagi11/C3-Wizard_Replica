import { useState } from 'react';
import { DashboardLayout } from '@/components/layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { History, Search, Loader2, Building2, User, UserCog, Download } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { format } from 'date-fns';

type LogTab = 'admin' | 'employer' | 'self-employed';

export default function LoggedInHistory() {
  const [activeTab, setActiveTab] = useState<LogTab>('admin');
  const [filters, setFilters] = useState({
    fromDate: format(new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), 'yyyy-MM-dd'),
    toDate: format(new Date(), 'yyyy-MM-dd'),
    search: '',
    companyId: '',
  });

  // Fetch companies for employer filter
  const { data: companies = [] } = useQuery({
    queryKey: ['login-history-companies'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('c3_companies')
        .select('id, company_name, registration_number')
        .eq('is_deleted', false)
        .order('company_name', { ascending: true });
      
      if (error) throw error;
      return data || [];
    },
    enabled: activeTab === 'employer',
  });

  // Fetch login history from c3_login_logs
  const { data: loginHistory = [], isLoading } = useQuery({
    queryKey: ['admin-login-history', activeTab, filters],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('c3_login_logs')
        .select('*')
        .gte('login_time', filters.fromDate)
        .lte('login_time', filters.toDate + 'T23:59:59')
        .order('login_time', { ascending: false })
        .limit(200);

      if (error) throw error;
      return data || [];
    },
  });

  const filteredHistory = loginHistory.filter((log: any) => {
    if (!filters.search) return true;
    const search = filters.search.toLowerCase();
    return (
      (log.username || '').toLowerCase().includes(search) ||
      (log.email || '').toLowerCase().includes(search)
    );
  });

  const exportToCSV = () => {
    if (filteredHistory.length === 0) return;
    
    const headers = ['Username', 'Email', 'Login Time', 'Logout Time', 'IP Address', 'User Agent'];
    const csvContent = [
      headers.join(','),
      ...filteredHistory.map((log: any) => [
        log.username || '',
        log.email || '',
        log.login_time ? format(new Date(log.login_time), 'yyyy-MM-dd HH:mm:ss') : '',
        log.logout_time ? format(new Date(log.logout_time), 'yyyy-MM-dd HH:mm:ss') : 'N/A',
        log.ip_address || '',
        (log.user_agent || '').replace(/,/g, ';'),
      ].join(','))
    ].join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `login_history_${activeTab}_${format(new Date(), 'yyyy-MM-dd')}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <DashboardLayout>
      <div className="mt-16 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Logged In History</h1>
            <p className="text-muted-foreground">View login/logout activity for all users</p>
          </div>
          <Button variant="outline" onClick={exportToCSV} disabled={filteredHistory.length === 0}>
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
        </div>

        <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as LogTab)}>
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="admin" className="gap-2">
              <UserCog className="h-4 w-4" />
              Admin Logs
            </TabsTrigger>
            <TabsTrigger value="employer" className="gap-2">
              <Building2 className="h-4 w-4" />
              Employer Logs
            </TabsTrigger>
            <TabsTrigger value="self-employed" className="gap-2">
              <User className="h-4 w-4" />
              Self-Employed Logs
            </TabsTrigger>
          </TabsList>

          {/* Filters */}
          <Card className="mt-4">
            <CardContent className="pt-4">
              <div className="flex flex-wrap gap-4 items-end">
                {activeTab === 'employer' && (
                  <div className="space-y-2">
                    <Label>Select Employer</Label>
                    <Select
                      value={filters.companyId}
                      onValueChange={(v) => setFilters({ ...filters, companyId: v })}
                    >
                      <SelectTrigger className="w-64">
                        <SelectValue placeholder="All Employers" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="">All Employers</SelectItem>
                        {companies.map((company) => (
                          <SelectItem key={company.id} value={company.id.toString()}>
                            {company.company_name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                )}
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
                      placeholder="Search by username or email..."
                      className="pl-10"
                      value={filters.search}
                      onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* All tabs share the same content structure */}
          <TabsContent value={activeTab}>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <History className="h-5 w-5" />
                  Login History ({filteredHistory.length} records)
                </CardTitle>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <div className="flex items-center justify-center py-8">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                  </div>
                ) : filteredHistory.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    No login records found for the selected filters
                  </div>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Username</TableHead>
                        <TableHead>Email ID</TableHead>
                        <TableHead>Login Time</TableHead>
                        <TableHead>Logout Time</TableHead>
                        <TableHead>IP Address</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredHistory.map((log: any) => (
                        <TableRow key={log.id}>
                          <TableCell className="font-medium">{log.username || '-'}</TableCell>
                          <TableCell>{log.email || '-'}</TableCell>
                          <TableCell>
                            {log.login_time
                              ? format(new Date(log.login_time), 'dd-MMM-yyyy HH:mm:ss')
                              : '-'}
                          </TableCell>
                          <TableCell>
                            {log.logout_time
                              ? format(new Date(log.logout_time), 'dd-MMM-yyyy HH:mm:ss')
                              : 'N/A'}
                          </TableCell>
                          <TableCell className="font-mono text-xs">{log.ip_address || '-'}</TableCell>
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
