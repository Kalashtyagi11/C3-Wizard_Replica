/**
 * Non-Working Director C3 Module
 * 
 * Manages C3 contributions for non-working directors.
 * Directors are subject ONLY to the Social Services Levy (not SS, EI, or PE).
 * 
 * Key Business Rules:
 * - Directors pay 3% Levy on their monthly remuneration
 * - No Social Security contributions
 * - No Employment Insurance contributions  
 * - No Severance contributions
 */

import { useState, useEffect } from 'react';
import { DashboardLayout } from '@/components/layout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Skeleton } from '@/components/ui/skeleton';
import { 
  UserCog, Plus, Save, Send, Loader2,
  Briefcase, Calendar
} from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useEmployees } from '@/hooks/useEmployees';
import { supabase } from '@/integrations/supabase/client';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

interface DirectorContribution {
  id?: number;
  employee_id: number;
  employee_name: string;
  ssn: string;
  monthly_remuneration: number;
  levy_amount: number; // 3% of monthly remuneration
}

export default function NWDirector() {
  const { companyId } = useAuth();
  const queryClient = useQueryClient();
  const { employees } = useEmployees();
  
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [contributions, setContributions] = useState<DirectorContribution[]>([]);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [newDirectorId, setNewDirectorId] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 11 }, (_, i) => currentYear - 5 + i);

  // Filter employees to only show directors
  const directorEmployees = employees.filter(e => e.is_director_only && !e.is_deleted);

  // Fetch existing NW Director C3 for selected period
  const { data: existingC3, isLoading } = useQuery({
    queryKey: ['nw-director-c3', companyId, selectedMonth, selectedYear],
    queryFn: async () => {
      if (!companyId) return null;
      
      const { data: header } = await supabase
        .from('c3_contribution_headers')
        .select('*, c3_contribution_details(*)')
        .eq('company_id', companyId)
        .eq('period_month', selectedMonth.toString())
        .eq('period_year', selectedYear.toString())
        .eq('is_for_director', true)
        .maybeSingle();
      
      return header;
    },
    enabled: !!companyId,
  });

  // Load contributions when period changes or existing C3 is fetched
  useEffect(() => {
    if (existingC3?.c3_contribution_details) {
      const details = existingC3.c3_contribution_details as Array<{
        id: number;
        employee_id: number | null;
        director_wage: number | null;
        levy_employer: number | null;
      }>;
      const loadedContributions: DirectorContribution[] = details.map((detail) => {
        const emp = employees.find(e => e.id === detail.employee_id);
        return {
          id: detail.id,
          employee_id: detail.employee_id || 0,
          employee_name: emp ? `${emp.first_name} ${emp.last_name}` : 'Unknown',
          ssn: emp?.social_security_number || '',
          monthly_remuneration: detail.director_wage || 0,
          levy_amount: detail.levy_employer || 0,
        };
      });
      setContributions(loadedContributions);
    } else {
      // Initialize with all director employees using allowances as monthly salary
      const initialContributions = directorEmployees.map(emp => {
        const monthlyWage = emp.allowances || 0;
        return {
          employee_id: emp.id,
          employee_name: `${emp.first_name} ${emp.last_name}`,
          ssn: emp.social_security_number || '',
          monthly_remuneration: monthlyWage,
          levy_amount: monthlyWage * 0.03, // 3% levy
        };
      });
      setContributions(initialContributions);
    }
  }, [existingC3, directorEmployees, employees]);

  const handleRemunerationChange = (employeeId: number, value: number) => {
    setContributions(prev => 
      prev.map(c => 
        c.employee_id === employeeId
          ? { ...c, monthly_remuneration: value, levy_amount: value * 0.03 }
          : c
      )
    );
  };

  const handleAddDirector = () => {
    if (!newDirectorId) return;
    
    const emp = employees.find(e => e.id === parseInt(newDirectorId));
    if (!emp) return;

    const monthlyWage = emp.allowances || 0;
    
    setContributions(prev => [
      ...prev,
      {
        employee_id: emp.id,
        employee_name: `${emp.first_name} ${emp.last_name}`,
        ssn: emp.social_security_number || '',
        monthly_remuneration: monthlyWage,
        levy_amount: monthlyWage * 0.03,
      },
    ]);
    
    setIsAddDialogOpen(false);
    setNewDirectorId('');
  };

  const calculateTotals = () => {
    return contributions.reduce(
      (acc, c) => ({
        totalRemuneration: acc.totalRemuneration + c.monthly_remuneration,
        totalLevy: acc.totalLevy + c.levy_amount,
      }),
      { totalRemuneration: 0, totalLevy: 0 }
    );
  };

  const handleSave = async () => {
    if (!companyId) return;
    setIsSubmitting(true);

    try {
      // Create or update C3 header
      let headerId = existingC3?.id;

      if (!headerId) {
        const { data: newHeader, error: headerError } = await supabase
          .from('c3_contribution_headers')
          .insert({
            company_id: companyId,
            period_month: selectedMonth.toString(),
            period_year: selectedYear.toString(),
            is_for_director: true,
            is_finalized: false,
            is_submitted: false,
            total_levy_employer: calculateTotals().totalLevy,
            grand_total: calculateTotals().totalLevy,
            employee_count: contributions.length,
          })
          .select()
          .single();

        if (headerError) throw headerError;
        headerId = newHeader.id;
      } else {
        // Update existing header
        await supabase
          .from('c3_contribution_headers')
          .update({
            total_levy_employer: calculateTotals().totalLevy,
            grand_total: calculateTotals().totalLevy,
            employee_count: contributions.length,
            updated_at: new Date().toISOString(),
          })
          .eq('id', headerId);
      }

      // Delete existing details and insert new ones
      await supabase
        .from('c3_contribution_details')
        .delete()
        .eq('header_id', headerId);

      const details = contributions.map(c => ({
        header_id: headerId,
        employee_id: c.employee_id,
        social_security_number: c.ssn,
        director_wage: c.monthly_remuneration,
        levy_employer: c.levy_amount,
        // All other contributions are 0 for NW Directors
        social_security_employee: 0,
        social_security_employer: 0,
        ei_employee: 0,
        ei_employer: 0,
        levy_employee: 0,
        severance_employee: 0,
        severance_employer: 0,
      }));

      const { error: detailsError } = await supabase
        .from('c3_contribution_details')
        .insert(details);

      if (detailsError) throw detailsError;

      toast.success('NW Director C3 saved successfully');
      queryClient.invalidateQueries({ queryKey: ['nw-director-c3'] });
    } catch (error) {
      console.error('Error saving NW Director C3:', error);
      toast.error('Failed to save NW Director C3');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSubmit = async () => {
    await handleSave();
    
    if (existingC3?.id) {
      try {
        await supabase
          .from('c3_contribution_headers')
          .update({
            is_finalized: true,
            is_submitted: true,
            finalized_at: new Date().toISOString(),
            submitted_at: new Date().toISOString(),
          })
          .eq('id', existingC3.id);

        toast.success('NW Director C3 submitted successfully');
        queryClient.invalidateQueries({ queryKey: ['nw-director-c3'] });
      } catch {
        toast.error('Failed to submit NW Director C3');
      }
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'XCD',
      minimumFractionDigits: 2,
    }).format(amount);
  };

  const formatSSN = (ssn: string | null) => {
    if (!ssn) return '---';
    if (ssn.length >= 4) {
      return `XXX-XX-${ssn.slice(-4)}`;
    }
    return ssn;
  };

  const totals = calculateTotals();

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="space-y-6">
          <Skeleton className="h-8 w-64" />
          <Card>
            <CardContent className="pt-6 space-y-4">
              {[1, 2, 3].map((i) => (
                <Skeleton key={i} className="h-12 w-full" />
              ))}
            </CardContent>
          </Card>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
              <UserCog className="h-6 w-6" />
              Non-Working Director
            </h1>
            <p className="text-muted-foreground">
              Manage C3 contributions for non-working directors (Levy only)
            </p>
          </div>
        </div>

        {/* Period Selection */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Contribution Period
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-3">
              <div className="space-y-2">
                <Label>Month</Label>
                <Select
                  value={selectedMonth.toString()}
                  onValueChange={(v) => setSelectedMonth(parseInt(v))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {MONTHS.map((month, idx) => (
                      <SelectItem key={idx} value={(idx + 1).toString()}>
                        {month}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Year</Label>
                <Select
                  value={selectedYear.toString()}
                  onValueChange={(v) => setSelectedYear(parseInt(v))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {years.map((year) => (
                      <SelectItem key={year} value={year.toString()}>
                        {year}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-end">
                {existingC3 && (
                  <Badge variant={existingC3.is_submitted ? 'default' : 'secondary'}>
                    {existingC3.is_submitted ? 'Submitted' : 'Draft'}
                  </Badge>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Director Contributions Table */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Briefcase className="h-5 w-5" />
                Director Contributions
              </CardTitle>
              <CardDescription>
                Enter monthly remuneration for each non-working director
              </CardDescription>
            </div>
            <Button 
              variant="outline" 
              onClick={() => setIsAddDialogOpen(true)}
              disabled={existingC3?.is_submitted}
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Director
            </Button>
          </CardHeader>
          <CardContent>
            {contributions.length === 0 ? (
              <div className="text-center py-8">
                <UserCog className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <p className="text-muted-foreground">
                  No non-working directors found. Add directors from the Employee Management page.
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Director Name</TableHead>
                      <TableHead>SSN</TableHead>
                      <TableHead className="text-right">Monthly Remuneration</TableHead>
                      <TableHead className="text-right">Levy (3%)</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {contributions.map((contribution) => (
                      <TableRow key={contribution.employee_id}>
                        <TableCell className="font-medium">
                          {contribution.employee_name}
                        </TableCell>
                        <TableCell className="font-mono">
                          {formatSSN(contribution.ssn)}
                        </TableCell>
                        <TableCell className="text-right">
                          <Input
                            type="number"
                            min="0"
                            step="0.01"
                            className="w-32 text-right ml-auto"
                            value={contribution.monthly_remuneration || ''}
                            disabled={existingC3?.is_submitted}
                            onChange={(e) => 
                              handleRemunerationChange(
                                contribution.employee_id, 
                                parseFloat(e.target.value) || 0
                              )
                            }
                          />
                        </TableCell>
                        <TableCell className="text-right font-medium">
                          {formatCurrency(contribution.levy_amount)}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}

            {/* Totals */}
            {contributions.length > 0 && (
              <div className="mt-6 border-t pt-4">
                <div className="flex justify-end gap-8">
                  <div className="text-right">
                    <p className="text-sm text-muted-foreground">Total Remuneration</p>
                    <p className="text-lg font-semibold">{formatCurrency(totals.totalRemuneration)}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-muted-foreground">Total Levy (3%)</p>
                    <p className="text-xl font-bold text-primary">{formatCurrency(totals.totalLevy)}</p>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="flex justify-end gap-2">
          <Button 
            variant="outline" 
            onClick={handleSave}
            disabled={isSubmitting || existingC3?.is_submitted || contributions.length === 0}
          >
            {isSubmitting ? (
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            ) : (
              <Save className="h-4 w-4 mr-2" />
            )}
            Save Draft
          </Button>
          <Button 
            onClick={handleSubmit}
            disabled={isSubmitting || existingC3?.is_submitted || contributions.length === 0}
          >
            {isSubmitting ? (
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            ) : (
              <Send className="h-4 w-4 mr-2" />
            )}
            Submit C3
          </Button>
        </div>

        {/* Add Director Dialog */}
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add Director</DialogTitle>
              <DialogDescription>
                Select a director to add to this C3 period
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label>Director</Label>
                <Select value={newDirectorId} onValueChange={setNewDirectorId}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a director..." />
                  </SelectTrigger>
                  <SelectContent>
                    {directorEmployees
                      .filter(e => !contributions.some(c => c.employee_id === e.id))
                      .map((emp) => (
                        <SelectItem key={emp.id} value={emp.id.toString()}>
                          {emp.first_name} {emp.last_name}
                        </SelectItem>
                      ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleAddDirector} disabled={!newDirectorId}>
                Add Director
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </DashboardLayout>
  );
}
