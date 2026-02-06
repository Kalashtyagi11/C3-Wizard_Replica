/**
 * Self-Employed Contribution Page
 * Connected to process_self_employedc3 table
 */

import { useState } from 'react';
import { DashboardLayout } from '@/components/layout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
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
import { FileText, Calculator, Save, Send, Loader2, History } from 'lucide-react';
import { useSelfEmployedC3 } from '@/hooks/useSelfEmployedC3';
import { toast } from 'sonner';
import { Skeleton } from '@/components/ui/skeleton';

const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

export default function Contribution() {
  const {
    contributions,
    profile,
    wageCategory,
    calculationResult,
    isLoading,
    createContribution,
    calculateContribution,
    saveContribution,
    finalizeContribution,
    submitContribution,
  } = useSelfEmployedC3();

  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [weeksWorked, setWeeksWorked] = useState([false, false, false, false, false]);
  const [weeklyWages, setWeeklyWages] = useState([0, 0, 0, 0, 0]);
  const [currentC3Id, setCurrentC3Id] = useState<number | null>(null);
  const [isCalculating, setIsCalculating] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [showHistory, setShowHistory] = useState(false);

  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 11 }, (_, i) => currentYear - 5 + i);

  const handleWeekToggle = (weekIndex: number) => {
    const newWeeksWorked = [...weeksWorked];
    newWeeksWorked[weekIndex] = !newWeeksWorked[weekIndex];
    setWeeksWorked(newWeeksWorked);
  };

  const handleWageChange = (weekIndex: number, value: string) => {
    const amount = parseFloat(value) || 0;
    const newWages = [...weeklyWages];
    newWages[weekIndex] = amount;
    setWeeklyWages(newWages);
    
    // Auto-check week if amount entered
    if (amount > 0 && !weeksWorked[weekIndex]) {
      const newWeeksWorked = [...weeksWorked];
      newWeeksWorked[weekIndex] = true;
      setWeeksWorked(newWeeksWorked);
    }
  };

  const handleCalculate = async () => {
    setIsCalculating(true);
    try {
      const result = await calculateContribution(selectedMonth, selectedYear, weeksWorked, weeklyWages);
      if (result) {
        toast.success('Contribution calculated successfully');
      }
    } catch {
      toast.error('Failed to calculate contribution');
    } finally {
      setIsCalculating(false);
    }
  };

  const handleCreateNew = async () => {
    setIsSaving(true);
    try {
      const { headerId, error } = await createContribution(selectedMonth, selectedYear);
      if (error) {
        toast.error(error);
      } else if (headerId) {
        setCurrentC3Id(headerId);
        toast.success('C3 form created');
      }
    } catch {
      toast.error('Failed to create C3');
    } finally {
      setIsSaving(false);
    }
  };

  const handleSave = async () => {
    if (!currentC3Id || !calculationResult) {
      toast.error('Please calculate first');
      return;
    }
    
    setIsSaving(true);
    try {
      const { error } = await saveContribution(currentC3Id, calculationResult);
      if (error) {
        toast.error(error);
      } else {
        toast.success('Contribution saved');
      }
    } catch {
      toast.error('Failed to save');
    } finally {
      setIsSaving(false);
    }
  };

  const handleFinalize = async () => {
    if (!currentC3Id) return;
    
    setIsSaving(true);
    try {
      const { error } = await finalizeContribution(currentC3Id);
      if (error) {
        toast.error(error);
      } else {
        toast.success('C3 finalized');
      }
    } catch {
      toast.error('Failed to finalize');
    } finally {
      setIsSaving(false);
    }
  };

  const handleSubmit = async () => {
    if (!currentC3Id) return;
    
    setIsSaving(true);
    try {
      const { error } = await submitContribution(currentC3Id);
      if (error) {
        toast.error(error);
      } else {
        toast.success('C3 submitted successfully');
      }
    } catch {
      toast.error('Failed to submit');
    } finally {
      setIsSaving(false);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'XCD',
      minimumFractionDigits: 2,
    }).format(amount);
  };

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="space-y-6">
          <Skeleton className="h-8 w-64" />
          <Card>
            <CardContent className="pt-6 space-y-4">
              {[1, 2, 3, 4, 5].map((i) => (
                <Skeleton key={i} className="h-12 w-full" />
              ))}
            </CardContent>
          </Card>
        </div>
      </DashboardLayout>
    );
  }

  if (!profile) {
    return (
      <DashboardLayout>
        <div className="space-y-6">
          <h1 className="text-2xl font-bold">C3 Contribution</h1>
          <Card>
            <CardContent className="py-8 text-center">
              <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">
                No self-employed profile found. Please set up your profile first.
              </p>
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
            <h1 className="text-2xl font-bold text-foreground">C3 Contribution</h1>
            <p className="text-muted-foreground">
              Submit your monthly social security contributions
            </p>
          </div>
          <Button
            variant="outline"
            onClick={() => setShowHistory(!showHistory)}
            className="gap-2"
          >
            <History className="h-4 w-4" />
            {showHistory ? 'New C3' : 'View History'}
          </Button>
        </div>

        {showHistory ? (
          /* Contribution History */
          <Card>
            <CardHeader>
              <CardTitle>Contribution History</CardTitle>
              <CardDescription>Your previous C3 submissions</CardDescription>
            </CardHeader>
            <CardContent>
              {contributions.length === 0 ? (
                <p className="text-muted-foreground text-center py-4">
                  No previous contributions found.
                </p>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Period</TableHead>
                      <TableHead>Total Wages</TableHead>
                      <TableHead>Contributions</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {contributions.map((c) => (
                      <TableRow key={c.id}>
                        <TableCell>
                          {MONTHS[parseInt(c.period_month || '1') - 1]} {c.period_year}
                        </TableCell>
                        <TableCell>{formatCurrency(c.declared_income || 0)}</TableCell>
                        <TableCell>{formatCurrency(c.total_contribution || 0)}</TableCell>
                        <TableCell>
                          <span
                            className={`px-2 py-1 rounded text-xs ${
                              c.is_submitted
                                ? 'bg-green-100 text-green-700'
                                : c.is_finalized
                                ? 'bg-blue-100 text-blue-700'
                                : 'bg-yellow-100 text-yellow-700'
                            }`}
                          >
                            {c.is_submitted ? 'Submitted' : c.is_finalized ? 'Finalized' : 'Draft'}
                          </span>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        ) : (
          <>
            {/* Period Selection */}
            <Card>
              <CardHeader>
                <CardTitle>Select Period</CardTitle>
                <CardDescription>Choose the month and year for your contribution</CardDescription>
              </CardHeader>
              <CardContent className="flex gap-4">
                <div className="space-y-2 flex-1">
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
                <div className="space-y-2 flex-1">
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
                  <Button onClick={handleCreateNew} disabled={isSaving}>
                    {isSaving ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Start C3'}
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Weekly Wages Entry */}
            <Card>
              <CardHeader>
            <CardTitle>Weekly Wages</CardTitle>
                <CardDescription>
                  Enter your wages for each week. Category: {wageCategory?.category || 'Not set'} 
                  {wageCategory && ` ($${wageCategory.weeklycontribution?.toFixed(2)}/week)`}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[100px]">Week</TableHead>
                      <TableHead className="w-[100px]">Worked</TableHead>
                      <TableHead>Wages ($XCD)</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {[1, 2, 3, 4, 5].map((week, idx) => (
                      <TableRow key={week}>
                        <TableCell className="font-medium">Week {week}</TableCell>
                        <TableCell>
                          <Checkbox
                            checked={weeksWorked[idx]}
                            onCheckedChange={() => handleWeekToggle(idx)}
                          />
                        </TableCell>
                        <TableCell>
                          <Input
                            type="number"
                            step="0.01"
                            min="0"
                            value={weeklyWages[idx] || ''}
                            onChange={(e) => handleWageChange(idx, e.target.value)}
                            placeholder="0.00"
                            className="max-w-[200px]"
                          />
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
                <div className="mt-4 flex justify-end">
                  <Button onClick={handleCalculate} disabled={isCalculating} className="gap-2">
                    {isCalculating ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Calculator className="h-4 w-4" />
                    )}
                    Calculate
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Calculation Results */}
            {calculationResult && (
              <Card>
                <CardHeader>
                  <CardTitle>Contribution Summary</CardTitle>
                  <CardDescription>
                    For {MONTHS[selectedMonth - 1]} {selectedYear}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                    <div className="p-4 border rounded-lg">
                      <p className="text-sm text-muted-foreground">Total Income</p>
                      <p className="text-2xl font-bold">{formatCurrency(calculationResult.totalIncome)}</p>
                    </div>
                    <div className="p-4 border rounded-lg">
                      <p className="text-sm text-muted-foreground">Social Security</p>
                      <p className="text-2xl font-bold">{formatCurrency(calculationResult.ssContribution)}</p>
                    </div>
                    <div className="p-4 border rounded-lg">
                      <p className="text-sm text-muted-foreground">Levy</p>
                      <p className="text-2xl font-bold">{formatCurrency(calculationResult.levyContribution)}</p>
                    </div>
                    <div className="p-4 border rounded-lg">
                      <p className="text-sm text-muted-foreground">Severance (PE)</p>
                      <p className="text-2xl font-bold">{formatCurrency(calculationResult.peContribution)}</p>
                    </div>
                  </div>
                  <div className="mt-4 p-4 bg-primary/10 rounded-lg">
                    <div className="flex justify-between items-center">
                      <p className="text-lg font-medium">Grand Total</p>
                      <p className="text-3xl font-bold text-primary">
                        {formatCurrency(calculationResult.grandTotal)}
                      </p>
                    </div>
                  </div>
                  <div className="mt-6 flex gap-2 justify-end">
                    <Button variant="outline" onClick={handleSave} disabled={isSaving}>
                      <Save className="h-4 w-4 mr-2" />
                      Save Draft
                    </Button>
                    <Button variant="outline" onClick={handleFinalize} disabled={isSaving}>
                      Finalize
                    </Button>
                    <Button onClick={handleSubmit} disabled={isSaving}>
                      <Send className="h-4 w-4 mr-2" />
                      Submit & Pay
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}
          </>
        )}
      </div>
    </DashboardLayout>
  );
}
