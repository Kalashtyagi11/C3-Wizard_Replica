import { useState, useEffect } from 'react';
import { DashboardLayout } from '@/components/layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Search, Eye, Trash2, FileText, Loader2, Undo2 } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { format } from 'date-fns';
import { toast } from 'sonner';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';

export default function AdminC3Contribution() {
  const queryClient = useQueryClient();
  const [selectedCompanyId, setSelectedCompanyId] = useState<string>('');
  const [periodFrom, setPeriodFrom] = useState('');
  const [periodTo, setPeriodTo] = useState('');
  const [selectedC3, setSelectedC3] = useState<any>(null);
  const [isUnsubmitOpen, setIsUnsubmitOpen] = useState(false);

  // Fetch companies for dropdown
  const { data: companies = [] } = useQuery({
    queryKey: ['admin-companies-list'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('c3_companies')
        .select('id, company_name, registration_number')
        .eq('is_deleted', false)
        .order('company_name', { ascending: true });
      
      if (error) throw error;
      return data || [];
    },
  });

  // Fetch C3 headers
  const { data: c3Reports = [], isLoading } = useQuery({
    queryKey: ['admin-c3-contributions', selectedCompanyId, periodFrom, periodTo],
    queryFn: async () => {
      let query = supabase
        .from('c3_contribution_headers')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(100);

      if (selectedCompanyId) {
        query = query.eq('company_id', parseInt(selectedCompanyId));
      }

      if (periodFrom) {
        query = query.gte('created_at', periodFrom);
      }

      if (periodTo) {
        query = query.lte('created_at', periodTo + 'T23:59:59');
      }

      const { data, error } = await query;
      if (error) throw error;
      
      // Fetch company names separately
      const companyIds = [...new Set((data || []).map((d) => d.company_id).filter(Boolean))] as number[];
      let companyMap: Record<number, { name: string; regNum: string }> = {};
      
      if (companyIds.length > 0) {
        const { data: companiesData } = await supabase
          .from('c3_companies')
          .select('id, company_name, registration_number')
          .in('id', companyIds);
        
        if (companiesData) {
          companyMap = companiesData.reduce((acc, c) => {
            acc[c.id] = { name: c.company_name || '', regNum: c.registration_number || '' };
            return acc;
          }, {} as Record<number, { name: string; regNum: string }>);
        }
      }
      
      return (data || []).map((c3) => ({
        ...c3,
        company_name: c3.company_id ? companyMap[c3.company_id]?.name : null,
        reg_number: c3.company_id ? companyMap[c3.company_id]?.regNum : null,
      }));
    },
  });

  // Unsubmit mutation
  const unsubmitMutation = useMutation({
    mutationFn: async (c3Id: number) => {
      const { error } = await supabase
        .from('c3_contribution_headers')
        .update({
          is_submitted: false,
          submitted_at: null,
          submitted_by: null,
          updated_at: new Date().toISOString(),
        })
        .eq('id', c3Id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-c3-contributions'] });
      toast.success('C3 unsubmitted successfully');
      setIsUnsubmitOpen(false);
      setSelectedC3(null);
    },
    onError: (error) => {
      toast.error('Failed to unsubmit C3: ' + (error as Error).message);
    },
  });

  const formatCurrency = (amount: number | null) => {
    if (amount === null || amount === undefined) return '-';
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'XCD' }).format(amount);
  };

  const getMonthName = (month: string | null) => {
    if (!month) return '-';
    const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 
                        'July', 'August', 'September', 'October', 'November', 'December'];
    const monthNum = parseInt(month);
    return monthNames[monthNum - 1] || month;
  };

  const handleUnsubmit = (c3: any) => {
    setSelectedC3(c3);
    setIsUnsubmitOpen(true);
  };

  return (
    <DashboardLayout>
      <div className="mt-16 space-y-6">
        <h1 className="text-2xl font-bold">C3 Contribution</h1>

        {/* Filters */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-end gap-4">
              <div className="flex-1">
                <Label className="mb-2 block">Select Employer</Label>
                <Select value={selectedCompanyId} onValueChange={setSelectedCompanyId}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select Employer" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">All Employers</SelectItem>
                    {companies.map((company) => (
                      <SelectItem key={company.id} value={company.id.toString()}>
                        {company.company_name} ({company.registration_number || 'N/A'})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label className="mb-2 block">Period From:</Label>
                <Input
                  type="date"
                  value={periodFrom}
                  onChange={(e) => setPeriodFrom(e.target.value)}
                />
              </div>
              <div>
                <Label className="mb-2 block">Period To:</Label>
                <Input
                  type="date"
                  value={periodTo}
                  onChange={(e) => setPeriodTo(e.target.value)}
                />
              </div>
              <Button variant="outline">
                <Search className="h-4 w-4 mr-2" />
                Search
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Report List */}
        <Card>
          <CardHeader>
            <CardTitle>Report List ({c3Reports.length} records)</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            ) : c3Reports.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                No C3 records found
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Month</TableHead>
                      <TableHead>Year</TableHead>
                      <TableHead>Company</TableHead>
                      <TableHead>Wages</TableHead>
                      <TableHead>Social Security</TableHead>
                      <TableHead>Levy</TableHead>
                      <TableHead>Severance</TableHead>
                      <TableHead>Total</TableHead>
                      <TableHead>Creation Date</TableHead>
                      <TableHead>Schedule</TableHead>
                      <TableHead>Is Nil</TableHead>
                      <TableHead>Notes</TableHead>
                      <TableHead>Is Submitted</TableHead>
                      <TableHead>Preview</TableHead>
                      <TableHead>Unsubmit</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {c3Reports.map((report: any) => (
                      <TableRow key={report.id}>
                        <TableCell>{getMonthName(report.period_month)}</TableCell>
                        <TableCell>{report.period_year}</TableCell>
                        <TableCell className="max-w-[150px] truncate">
                          {report.company_name || '-'}
                        </TableCell>
                        <TableCell>{formatCurrency(report.total_wages)}</TableCell>
                        <TableCell>{formatCurrency(report.total_social_security)}</TableCell>
                        <TableCell>
                          {formatCurrency((report.total_levy_employee || 0) + (report.total_levy_employer || 0))}
                        </TableCell>
                        <TableCell>{formatCurrency(report.total_severance)}</TableCell>
                        <TableCell className="font-semibold">
                          {formatCurrency(
                            (report.total_social_security || 0) + 
                            (report.total_levy_employee || 0) + 
                            (report.total_levy_employer || 0) + 
                            (report.total_severance || 0) +
                            (report.total_ss_penalty || 0) +
                            (report.total_levy_penalty || 0)
                          )}
                        </TableCell>
                        <TableCell>
                          {report.created_at ? format(new Date(report.created_at), 'dd-MMM-yyyy') : '-'}
                        </TableCell>
                        <TableCell>{report.schedule_number || '-'}</TableCell>
                        <TableCell>
                          {report.is_nil_return ? (
                            <Badge variant="secondary">Yes</Badge>
                          ) : (
                            <span className="text-muted-foreground">No</span>
                          )}
                        </TableCell>
                        <TableCell>
                          {report.notes && <FileText className="h-4 w-4 text-primary" />}
                        </TableCell>
                        <TableCell>
                          <Badge variant={report.is_submitted ? 'default' : 'secondary'}>
                            {report.is_submitted ? 'Yes' : 'No'}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Button variant="ghost" size="icon">
                            <Eye className="h-4 w-4" />
                          </Button>
                        </TableCell>
                        <TableCell>
                          {report.is_submitted && (
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleUnsubmit(report)}
                            >
                              <Undo2 className="h-4 w-4 text-orange-500" />
                            </Button>
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Unsubmit Confirmation Dialog */}
        <AlertDialog open={isUnsubmitOpen} onOpenChange={setIsUnsubmitOpen}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Unsubmit C3 Form</AlertDialogTitle>
              <AlertDialogDescription>
                Are you sure you want to unsubmit this C3 form for{' '}
                <strong>{getMonthName(selectedC3?.period_month)} {selectedC3?.period_year}</strong>?
                <br /><br />
                This will allow the employer to make changes and resubmit the form.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction
                onClick={() => selectedC3 && unsubmitMutation.mutate(selectedC3.id)}
                disabled={unsubmitMutation.isPending}
              >
                {unsubmitMutation.isPending ? 'Processing...' : 'Unsubmit'}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </DashboardLayout>
  );
}
