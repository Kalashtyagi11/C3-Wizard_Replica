import { useState } from 'react';
import { DashboardLayout } from '@/components/layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { UserCog, Search, Building2, Download, Eye } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { format } from 'date-fns';

export default function NWDirector() {
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear().toString());
  const [selectedMonth, setSelectedMonth] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  // Fetch directors (employees marked as is_director_only = true)
  const { data: directors = [], isLoading: loadingDirectors } = useQuery({
    queryKey: ['nw-directors', searchTerm],
    queryFn: async () => {
      let query = supabase
        .from('c3_employees')
        .select('*')
        .eq('is_director_only', true)
        .order('last_name', { ascending: true });
      
      if (searchTerm) {
        query = query.or(`first_name.ilike.%${searchTerm}%,last_name.ilike.%${searchTerm}%,social_security_number.ilike.%${searchTerm}%`);
      }
      
      const { data, error } = await query;
      if (error) throw error;
      
      // Get company names
      const companyIds = [...new Set((data || []).map(d => d.company_id).filter(Boolean))];
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
      
      return (data || []).map(d => ({
        ...d,
        company_name: companyMap[d.company_id]?.name,
        reg_number: companyMap[d.company_id]?.regNum,
      }));
    },
  });

  // Fetch C3 contributions for directors
  const { data: directorContributions = [], isLoading: loadingContributions } = useQuery({
    queryKey: ['nw-director-contributions', selectedYear, selectedMonth, directors],
    queryFn: async () => {
      // Get director SSNs first
      const directorSSNs = directors.map((d: any) => d.social_security_number).filter(Boolean);
      
      if (directorSSNs.length === 0) return [];
      
      let query = supabase
        .from('c3_contribution_details')
        .select('*')
        .in('social_security_number', directorSSNs)
        .eq('period_year', selectedYear)
        .order('social_security_number', { ascending: true });
      
      if (selectedMonth) {
        query = query.eq('period_month', selectedMonth);
      }
      
      const { data, error } = await query;
      if (error) throw error;
      return data || [];
    },
    enabled: directors.length > 0,
  });

  const formatCurrency = (amount: number | null) => {
    if (amount === null || amount === undefined) return '-';
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'XCD' }).format(amount);
  };

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
            <h1 className="text-2xl font-bold">Non-Working Director Management</h1>
            <p className="text-muted-foreground">View and manage C3 submissions for non-working directors</p>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardContent className="pt-6">
              <div className="text-2xl font-bold">{directors.length}</div>
              <p className="text-sm text-muted-foreground">Total NW Directors</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="text-2xl font-bold">{directorContributions.length}</div>
              <p className="text-sm text-muted-foreground">C3 Submissions ({selectedYear})</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="text-2xl font-bold">
                {formatCurrency(
                  directorContributions.reduce((sum: number, c: any) => 
                    sum + (c.director_wage || 0), 0
                  )
                )}
              </div>
              <p className="text-sm text-muted-foreground">Total Director Wages</p>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="directors">
          <TabsList>
            <TabsTrigger value="directors" className="gap-2">
              <UserCog className="h-4 w-4" />
              Director List
            </TabsTrigger>
            <TabsTrigger value="contributions" className="gap-2">
              <Building2 className="h-4 w-4" />
              Contributions
            </TabsTrigger>
          </TabsList>

          {/* Directors List Tab */}
          <TabsContent value="directors">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <UserCog className="h-5 w-5" />
                    Non-Working Directors ({directors.length})
                  </CardTitle>
                  <div className="flex gap-2">
                    <div className="relative w-64">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        placeholder="Search directors..."
                        className="pl-10"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                      />
                    </div>
                    <Button variant="outline" onClick={() => exportToCSV(directors, 'nw_directors')}>
                      <Download className="h-4 w-4 mr-2" />
                      Export
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                {loadingDirectors ? (
                  <div className="text-center py-8">Loading directors...</div>
                ) : directors.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    No non-working directors found.
                  </div>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Name</TableHead>
                        <TableHead>SSN</TableHead>
                        <TableHead>Company</TableHead>
                        <TableHead>Reg #</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Appointed</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {directors.map((director: any) => (
                        <TableRow key={director.id}>
                          <TableCell className="font-medium">
                            {`${director.first_name || ''} ${director.middle_name || ''} ${director.last_name || ''}`.trim()}
                          </TableCell>
                          <TableCell className="font-mono">{director.social_security_number || '-'}</TableCell>
                          <TableCell>{director.company_name || '-'}</TableCell>
                          <TableCell>{director.reg_number || '-'}</TableCell>
                          <TableCell>
                            <Badge variant={!director.is_deleted ? 'default' : 'secondary'}>
                              {!director.is_deleted ? 'Active' : 'Inactive'}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            {director.hire_date ? format(new Date(director.hire_date), 'MMM dd, yyyy') : '-'}
                          </TableCell>
                          <TableCell>
                            <Button variant="ghost" size="sm">
                              <Eye className="h-4 w-4" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Contributions Tab */}
          <TabsContent value="contributions">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <Building2 className="h-5 w-5" />
                    Director Contributions
                  </CardTitle>
                  <div className="flex gap-2">
                    <Select value={selectedYear} onValueChange={setSelectedYear}>
                      <SelectTrigger className="w-32">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {[2026, 2025, 2024, 2023, 2022].map(year => (
                          <SelectItem key={year} value={year.toString()}>{year}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <Select value={selectedMonth} onValueChange={setSelectedMonth}>
                      <SelectTrigger className="w-40">
                        <SelectValue placeholder="All Months" />
                      </SelectTrigger>
                      <SelectContent>
                        {months.map(m => (
                          <SelectItem key={m.value} value={m.value}>{m.label}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <Button variant="outline" onClick={() => exportToCSV(directorContributions, 'director_contributions')}>
                      <Download className="h-4 w-4 mr-2" />
                      Export
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                {loadingContributions ? (
                  <div className="text-center py-8">Loading contributions...</div>
                ) : directorContributions.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    No director contributions found for the selected period.
                  </div>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>SSN</TableHead>
                        <TableHead>Period</TableHead>
                        <TableHead>Director Wage</TableHead>
                        <TableHead>SS (EE)</TableHead>
                        <TableHead>SS (ER)</TableHead>
                        <TableHead>Levy (EE)</TableHead>
                        <TableHead>Levy (ER)</TableHead>
                        <TableHead>Severance</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {directorContributions.map((contrib: any) => (
                        <TableRow key={contrib.id}>
                          <TableCell className="font-mono">{contrib.social_security_number || '-'}</TableCell>
                          <TableCell>
                            {months.find(m => m.value === contrib.period_month?.toString())?.label} {contrib.period_year}
                          </TableCell>
                          <TableCell className="font-medium">{formatCurrency(contrib.director_wage)}</TableCell>
                          <TableCell>{formatCurrency(contrib.social_security_employee)}</TableCell>
                          <TableCell>{formatCurrency(contrib.social_security_employer)}</TableCell>
                          <TableCell>{formatCurrency(contrib.levy_employee)}</TableCell>
                          <TableCell>{formatCurrency(contrib.levy_employer)}</TableCell>
                          <TableCell>{formatCurrency((contrib.severance_employee || 0) + (contrib.severance_employer || 0))}</TableCell>
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
