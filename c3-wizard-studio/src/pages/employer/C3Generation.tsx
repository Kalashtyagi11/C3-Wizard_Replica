/**
 * C3 Generation Page
 * Multi-step wizard for generating C3 contribution forms
 * 
 * BACKEND-FIRST: All calculations are performed by the calculate-c3-contributions Edge Function
 */

import { useState, useEffect } from 'react';
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
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Calculator, Save, Send, Loader2, ChevronRight, 
  ChevronLeft, Check, Users, Calendar, CreditCard, History 
} from 'lucide-react';
import { useC3Generation, EmployeeWageInput, CalculationResult } from '@/hooks/useC3Generation';
import { Skeleton } from '@/components/ui/skeleton';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';

const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

const STEPS = [
  { id: 1, title: 'Select Period', icon: Calendar },
  { id: 2, title: 'Select Employees', icon: Users },
  { id: 3, title: 'Enter Wages', icon: CreditCard },
  { id: 4, title: 'Review & Submit', icon: Check },
];

export default function C3Generation() {
  const navigate = useNavigate();
  const {
    c3Headers,
    employees,
    companyId,
    isLoading,
    isCalculating,
    calculatedResults,
    calculatedTotals,
    fetchC3Headers,
    generateC3,
    calculateContributions,
  } = useC3Generation();

  const [currentStep, setCurrentStep] = useState(1);
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [selectedEmployees, setSelectedEmployees] = useState<Set<number>>(new Set());
  const [employeeWages, setEmployeeWages] = useState<Map<number, EmployeeWageInput>>(new Map());
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [nilReturn, setNilReturn] = useState(false);

  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 11 }, (_, i) => currentYear - 5 + i);
  const activeEmployees = employees.filter((e) => !e.is_deleted);

  useEffect(() => {
    if (companyId) {
      fetchC3Headers(companyId);
    }
  }, [companyId, fetchC3Headers]);

  const handleEmployeeToggle = (employeeId: number) => {
    const newSelected = new Set(selectedEmployees);
    if (newSelected.has(employeeId)) {
      newSelected.delete(employeeId);
    } else {
      newSelected.add(employeeId);
    }
    setSelectedEmployees(newSelected);
  };

  const handleSelectAllEmployees = () => {
    if (selectedEmployees.size === activeEmployees.length) {
      setSelectedEmployees(new Set());
    } else {
      setSelectedEmployees(new Set(activeEmployees.map((e) => e.id)));
    }
  };

  const createEmptyWageData = (employeeId: number): EmployeeWageInput => ({
    employee_id: employeeId,
    week1_wages: 0,
    week2_wages: 0,
    week3_wages: 0,
    week4_wages: 0,
    week5_wages: 0,
    week1_worked: false,
    week2_worked: false,
    week3_worked: false,
    week4_worked: false,
    week5_worked: false,
    holiday_pay: 0,
    bonus: 0,
  });

  const handleWageChange = (employeeId: number, field: keyof EmployeeWageInput, value: number | boolean) => {
    const current = employeeWages.get(employeeId) || createEmptyWageData(employeeId);
    
    // If changing a wage field, also set worked = true if value > 0
    if (typeof value === 'number' && field.toString().includes('wages')) {
      const weekNum = field.toString().replace('week', '').replace('_wages', '');
      const workedField = `week${weekNum}_worked` as keyof EmployeeWageInput;
      setEmployeeWages(new Map(employeeWages.set(employeeId, {
        ...current,
        [field]: value,
        [workedField]: value > 0,
      })));
    } else {
      setEmployeeWages(new Map(employeeWages.set(employeeId, {
        ...current,
        [field]: value,
      })));
    }
  };

  const initializeEmployeeWages = () => {
    const newWages = new Map<number, EmployeeWageInput>();
    selectedEmployees.forEach((id) => {
      newWages.set(id, createEmptyWageData(id));
    });
    setEmployeeWages(newWages);
  };

  const handleNextStep = () => {
    if (currentStep === 1 && selectedEmployees.size === 0 && !nilReturn) {
      toast.error('Please select at least one employee or enable Nil Return');
      return;
    }
    if (currentStep === 2) {
      initializeEmployeeWages();
    }
    setCurrentStep((prev) => Math.min(prev + 1, 4));
  };

  const handlePrevStep = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 1));
  };

  const handleCalculate = async () => {
    // Convert Map to array for the API
    const employeesArray = Array.from(employeeWages.values());
    
    const { error } = await calculateContributions(null, {
      month: selectedMonth,
      year: selectedYear,
      employees: employeesArray,
    });
    
    if (error) {
      toast.error(error);
    } else {
      toast.success('Contributions calculated');
    }
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      const employeesArray = Array.from(employeeWages.values());
      
      const { error } = await generateC3({
        month: selectedMonth,
        year: selectedYear,
        employees: employeesArray,
        isNilReturn: nilReturn,
      });
      
      if (error) {
        toast.error(error);
      } else {
        toast.success('C3 generated successfully');
        navigate('/employer/payments');
      }
    } catch {
      toast.error('Failed to generate C3');
    } finally {
      setIsSubmitting(false);
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

  const getMonthName = (monthNum: string) => {
    const num = parseInt(monthNum);
    return MONTHS[num - 1] || monthNum;
  };

  const getEmployeeName = (employeeId: number): string => {
    const emp = employees.find(e => e.id === employeeId);
    return emp ? `${emp.first_name} ${emp.last_name}` : 'Unknown';
  };

  const getTotalWages = (wageData: EmployeeWageInput): number => {
    return wageData.week1_wages + wageData.week2_wages + wageData.week3_wages + 
           wageData.week4_wages + wageData.week5_wages;
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

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground">C3 Generation</h1>
            <p className="text-muted-foreground">
              Generate monthly contribution forms
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
          /* C3 History */
          <Card>
            <CardHeader>
              <CardTitle>C3 History</CardTitle>
              <CardDescription>Your previous C3 submissions</CardDescription>
            </CardHeader>
            <CardContent>
              {c3Headers.length === 0 ? (
                <p className="text-muted-foreground text-center py-4">
                  No previous C3 forms found.
                </p>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Period</TableHead>
                      <TableHead>Total Wages</TableHead>
                      <TableHead>Grand Total</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Created</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {c3Headers.map((c3) => (
                      <TableRow key={c3.id}>
                        <TableCell>
                          {getMonthName(c3.period_month || '')} {c3.period_year}
                        </TableCell>
                        <TableCell>{formatCurrency(c3.total_wages || 0)}</TableCell>
                        <TableCell>{formatCurrency(c3.grand_total || 0)}</TableCell>
                        <TableCell>
                          <Badge
                            variant={c3.is_submitted ? 'default' : c3.is_finalized ? 'secondary' : 'outline'}
                          >
                            {c3.is_submitted ? 'Submitted' : c3.is_finalized ? 'Finalized' : 'Draft'}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          {c3.created_at ? new Date(c3.created_at).toLocaleDateString() : 'N/A'}
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
            {/* Step Progress */}
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between mb-4">
                  {STEPS.map((step, index) => (
                    <div key={step.id} className="flex items-center">
                      <div
                        className={`flex items-center justify-center w-10 h-10 rounded-full ${
                          currentStep >= step.id
                            ? 'bg-primary text-primary-foreground'
                            : 'bg-muted text-muted-foreground'
                        }`}
                      >
                        <step.icon className="h-5 w-5" />
                      </div>
                      <span
                        className={`ml-2 text-sm font-medium ${
                          currentStep >= step.id ? 'text-foreground' : 'text-muted-foreground'
                        }`}
                      >
                        {step.title}
                      </span>
                      {index < STEPS.length - 1 && (
                        <ChevronRight className="mx-4 h-4 w-4 text-muted-foreground" />
                      )}
                    </div>
                  ))}
                </div>
                <Progress value={(currentStep / STEPS.length) * 100} className="h-2" />
              </CardContent>
            </Card>

            {/* Step 1: Select Period */}
            {currentStep === 1 && (
              <Card>
                <CardHeader>
                  <CardTitle>Select Period</CardTitle>
                  <CardDescription>Choose the month and year for your C3</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid gap-4 md:grid-cols-2">
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
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="nil-return"
                      checked={nilReturn}
                      onCheckedChange={(checked) => setNilReturn(checked as boolean)}
                    />
                    <Label htmlFor="nil-return">Nil Return (No employees worked this period)</Label>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Step 2: Select Employees */}
            {currentStep === 2 && (
              <Card>
                <CardHeader>
                  <CardTitle>Select Employees</CardTitle>
                  <CardDescription>
                    Choose which employees to include in this C3 ({selectedEmployees.size} selected)
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="mb-4">
                    <Button variant="outline" onClick={handleSelectAllEmployees}>
                      {selectedEmployees.size === activeEmployees.length ? 'Deselect All' : 'Select All'}
                    </Button>
                  </div>
                  <div className="overflow-x-auto max-h-96">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead className="w-12">Select</TableHead>
                          <TableHead>SSN</TableHead>
                          <TableHead>Name</TableHead>
                          <TableHead>Department</TableHead>
                          <TableHead>Pay Period</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {activeEmployees.map((emp) => (
                          <TableRow key={emp.id}>
                            <TableCell>
                              <Checkbox
                                checked={selectedEmployees.has(emp.id)}
                                onCheckedChange={() => handleEmployeeToggle(emp.id)}
                              />
                            </TableCell>
                            <TableCell className="font-mono">{formatSSN(emp.social_security_number)}</TableCell>
                            <TableCell>
                              {emp.first_name} {emp.last_name}
                            </TableCell>
                            <TableCell>{emp.department || 'N/A'}</TableCell>
                            <TableCell>{emp.pay_period || 'M'}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Step 3: Enter Wages */}
            {currentStep === 3 && (
              <Card>
                <CardHeader>
                  <CardTitle>Enter Wages</CardTitle>
                  <CardDescription>
                    Enter weekly wages, holiday pay, and bonus for each employee
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead className="min-w-[150px]">Employee</TableHead>
                          <TableHead className="text-center">Week 1</TableHead>
                          <TableHead className="text-center">Week 2</TableHead>
                          <TableHead className="text-center">Week 3</TableHead>
                          <TableHead className="text-center">Week 4</TableHead>
                          <TableHead className="text-center">Week 5</TableHead>
                          <TableHead className="text-center">Holiday</TableHead>
                          <TableHead className="text-center">Bonus</TableHead>
                          <TableHead className="text-right">Total</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {Array.from(selectedEmployees).map((empId) => {
                          const wageData = employeeWages.get(empId) || createEmptyWageData(empId);
                          return (
                            <TableRow key={empId}>
                              <TableCell className="font-medium">
                                {getEmployeeName(empId)}
                              </TableCell>
                              <TableCell>
                                <Input
                                  type="number"
                                  min="0"
                                  step="0.01"
                                  className="w-24 text-right"
                                  value={wageData.week1_wages || ''}
                                  onChange={(e) => handleWageChange(empId, 'week1_wages', parseFloat(e.target.value) || 0)}
                                />
                              </TableCell>
                              <TableCell>
                                <Input
                                  type="number"
                                  min="0"
                                  step="0.01"
                                  className="w-24 text-right"
                                  value={wageData.week2_wages || ''}
                                  onChange={(e) => handleWageChange(empId, 'week2_wages', parseFloat(e.target.value) || 0)}
                                />
                              </TableCell>
                              <TableCell>
                                <Input
                                  type="number"
                                  min="0"
                                  step="0.01"
                                  className="w-24 text-right"
                                  value={wageData.week3_wages || ''}
                                  onChange={(e) => handleWageChange(empId, 'week3_wages', parseFloat(e.target.value) || 0)}
                                />
                              </TableCell>
                              <TableCell>
                                <Input
                                  type="number"
                                  min="0"
                                  step="0.01"
                                  className="w-24 text-right"
                                  value={wageData.week4_wages || ''}
                                  onChange={(e) => handleWageChange(empId, 'week4_wages', parseFloat(e.target.value) || 0)}
                                />
                              </TableCell>
                              <TableCell>
                                <Input
                                  type="number"
                                  min="0"
                                  step="0.01"
                                  className="w-24 text-right"
                                  value={wageData.week5_wages || ''}
                                  onChange={(e) => handleWageChange(empId, 'week5_wages', parseFloat(e.target.value) || 0)}
                                />
                              </TableCell>
                              <TableCell>
                                <Input
                                  type="number"
                                  min="0"
                                  step="0.01"
                                  className="w-24 text-right"
                                  value={wageData.holiday_pay || ''}
                                  onChange={(e) => handleWageChange(empId, 'holiday_pay', parseFloat(e.target.value) || 0)}
                                />
                              </TableCell>
                              <TableCell>
                                <Input
                                  type="number"
                                  min="0"
                                  step="0.01"
                                  className="w-24 text-right"
                                  value={wageData.bonus || ''}
                                  onChange={(e) => handleWageChange(empId, 'bonus', parseFloat(e.target.value) || 0)}
                                />
                              </TableCell>
                              <TableCell className="text-right font-medium">
                                {formatCurrency(getTotalWages(wageData) + wageData.holiday_pay + wageData.bonus)}
                              </TableCell>
                            </TableRow>
                          );
                        })}
                      </TableBody>
                    </Table>
                  </div>
                  
                  <div className="mt-4 flex justify-end">
                    <Button onClick={handleCalculate} disabled={isCalculating} className="gap-2">
                      {isCalculating ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <Calculator className="h-4 w-4" />
                      )}
                      Calculate Contributions
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Step 4: Review & Submit */}
            {currentStep === 4 && (
              <Card>
                <CardHeader>
                  <CardTitle>Review & Submit</CardTitle>
                  <CardDescription>
                    Review the calculated contributions and submit your C3
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Summary Cards */}
                  <div className="grid gap-4 md:grid-cols-4">
                    <Card>
                      <CardContent className="pt-4">
                        <p className="text-sm text-muted-foreground">Period</p>
                        <p className="text-lg font-bold">{MONTHS[selectedMonth - 1]} {selectedYear}</p>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardContent className="pt-4">
                        <p className="text-sm text-muted-foreground">Employees</p>
                        <p className="text-lg font-bold">{calculatedTotals?.employee_count || selectedEmployees.size}</p>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardContent className="pt-4">
                        <p className="text-sm text-muted-foreground">Total Wages</p>
                        <p className="text-lg font-bold">{formatCurrency(calculatedTotals?.total_wages || 0)}</p>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardContent className="pt-4">
                        <p className="text-sm text-muted-foreground">Grand Total</p>
                        <p className="text-lg font-bold text-primary">{formatCurrency(calculatedTotals?.grand_total || 0)}</p>
                      </CardContent>
                    </Card>
                  </div>

                  {/* Contribution Breakdown */}
                  {calculatedTotals && (
                    <div className="grid gap-4 md:grid-cols-2">
                      <Card>
                        <CardHeader className="pb-2">
                          <CardTitle className="text-base">Employee Contributions</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-2 text-sm">
                          <div className="flex justify-between">
                            <span>Social Security:</span>
                            <span className="font-medium">{formatCurrency(calculatedTotals.total_ss_employee)}</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Employment Insurance:</span>
                            <span className="font-medium">{formatCurrency(calculatedTotals.total_ei_employee)}</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Levy:</span>
                            <span className="font-medium">{formatCurrency(calculatedTotals.total_levy_employee)}</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Severance:</span>
                            <span className="font-medium">{formatCurrency(calculatedTotals.total_pe_employee)}</span>
                          </div>
                          <div className="flex justify-between border-t pt-2">
                            <span className="font-medium">Total:</span>
                            <span className="font-bold">{formatCurrency(calculatedTotals.total_employee)}</span>
                          </div>
                        </CardContent>
                      </Card>
                      <Card>
                        <CardHeader className="pb-2">
                          <CardTitle className="text-base">Employer Contributions</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-2 text-sm">
                          <div className="flex justify-between">
                            <span>Social Security:</span>
                            <span className="font-medium">{formatCurrency(calculatedTotals.total_ss_employer)}</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Employment Insurance:</span>
                            <span className="font-medium">{formatCurrency(calculatedTotals.total_ei_employer)}</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Levy:</span>
                            <span className="font-medium">{formatCurrency(calculatedTotals.total_levy_employer)}</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Severance:</span>
                            <span className="font-medium">{formatCurrency(calculatedTotals.total_pe_employer)}</span>
                          </div>
                          <div className="flex justify-between border-t pt-2">
                            <span className="font-medium">Total:</span>
                            <span className="font-bold">{formatCurrency(calculatedTotals.total_employer)}</span>
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  )}

                  {/* Employee Details Table */}
                  {calculatedResults.length > 0 && (
                    <div className="overflow-x-auto">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Employee</TableHead>
                            <TableHead className="text-right">Wages</TableHead>
                            <TableHead className="text-right">SS (EE)</TableHead>
                            <TableHead className="text-right">EI (EE)</TableHead>
                            <TableHead className="text-right">Levy (EE)</TableHead>
                            <TableHead className="text-right">PE (EE)</TableHead>
                            <TableHead className="text-right">EE Total</TableHead>
                            <TableHead className="text-right">ER Total</TableHead>
                            <TableHead className="text-right">Grand Total</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {calculatedResults.map((result: CalculationResult) => (
                            <TableRow key={result.employee_id}>
                              <TableCell>
                                <div>
                                  <p className="font-medium">{result.first_name} {result.last_name}</p>
                                  <p className="text-xs text-muted-foreground">Age: {result.age}</p>
                                </div>
                              </TableCell>
                              <TableCell className="text-right">{formatCurrency(result.total_wages)}</TableCell>
                              <TableCell className="text-right">
                                {result.is_age_exempt ? (
                                  <span className="text-muted-foreground">Exempt</span>
                                ) : (
                                  formatCurrency(result.ss_employee)
                                )}
                              </TableCell>
                              <TableCell className="text-right">{formatCurrency(result.ei_employee)}</TableCell>
                              <TableCell className="text-right">
                                {result.is_levy_exempt ? (
                                  <span className="text-muted-foreground">Exempt</span>
                                ) : (
                                  formatCurrency(result.levy_employee)
                                )}
                              </TableCell>
                              <TableCell className="text-right">{formatCurrency(result.pe_employee)}</TableCell>
                              <TableCell className="text-right font-medium">{formatCurrency(result.total_employee)}</TableCell>
                              <TableCell className="text-right font-medium">{formatCurrency(result.total_employer)}</TableCell>
                              <TableCell className="text-right font-bold">{formatCurrency(result.grand_total)}</TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}

            {/* Navigation Buttons */}
            <div className="flex justify-between">
              <Button
                variant="outline"
                onClick={handlePrevStep}
                disabled={currentStep === 1}
                className="gap-2"
              >
                <ChevronLeft className="h-4 w-4" />
                Previous
              </Button>
              
              {currentStep < 4 ? (
                <Button onClick={handleNextStep} className="gap-2">
                  Next
                  <ChevronRight className="h-4 w-4" />
                </Button>
              ) : (
                <div className="flex gap-2">
                  <Button variant="outline" onClick={handleCalculate} disabled={isCalculating} className="gap-2">
                    {isCalculating ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Calculator className="h-4 w-4" />
                    )}
                    Recalculate
                  </Button>
                  <Button onClick={handleSubmit} disabled={isSubmitting} className="gap-2">
                    {isSubmitting ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Send className="h-4 w-4" />
                    )}
                    Submit C3
                  </Button>
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </DashboardLayout>
  );
}
