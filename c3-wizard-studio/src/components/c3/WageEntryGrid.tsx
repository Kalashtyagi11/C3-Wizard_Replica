/**
 * C3 Wage Entry Grid Component
 * 
 * Editable data grid for entering employee wages with:
 * - Auto-save on blur
 * - Real-time calculation updates via Edge Function
 * - Director-only wage auto-calculation
 * - Worked week checkboxes
 */

import { useState, useCallback } from 'react';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
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
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Loader2, Gift, Umbrella, AlertCircle } from 'lucide-react';
import { EmployeeWageInput, CalculationResult } from '@/hooks/useC3Generation';
import { Employee } from '@/hooks/useEmployees';

interface WageEntryGridProps {
  employees: Employee[];
  employeeWages: Map<number, EmployeeWageInput>;
  calculatedResults: CalculationResult[];
  onWageChange: (employeeId: number, field: keyof EmployeeWageInput, value: number | boolean) => void;
  onCalculate: (employeeId: number) => Promise<void>;
}

export function WageEntryGrid({
  employees,
  employeeWages,
  calculatedResults,
  onWageChange,
  onCalculate,
}: WageEntryGridProps) {
  const [calculatingRow, setCalculatingRow] = useState<number | null>(null);
  const [bonusDialogOpen, setBonusDialogOpen] = useState(false);
  const [holidayDialogOpen, setHolidayDialogOpen] = useState(false);
  const [selectedEmployeeId, setSelectedEmployeeId] = useState<number | null>(null);
  const [bonusAmount, setBonusAmount] = useState('');
  const [holidayAmount, setHolidayAmount] = useState('');

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

  const calculateAge = (dob: string | null): number => {
    if (!dob) return 0;
    const birthDate = new Date(dob);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  };

  const getEmployeeResult = (employeeId: number): CalculationResult | undefined => {
    return calculatedResults.find((r) => r.employee_id === employeeId);
  };

  const getTotalWages = (wageData: EmployeeWageInput): number => {
    return (
      wageData.week1_wages +
      wageData.week2_wages +
      wageData.week3_wages +
      wageData.week4_wages +
      wageData.week5_wages
    );
  };

  const handleBlur = useCallback(
    async (employeeId: number) => {
      setCalculatingRow(employeeId);
      await onCalculate(employeeId);
      setCalculatingRow(null);
    },
    [onCalculate]
  );

  const handleOpenBonusDialog = (employeeId: number) => {
    setSelectedEmployeeId(employeeId);
    const current = employeeWages.get(employeeId)?.bonus || 0;
    setBonusAmount(current > 0 ? current.toString() : '');
    setBonusDialogOpen(true);
  };

  const handleOpenHolidayDialog = (employeeId: number) => {
    setSelectedEmployeeId(employeeId);
    const current = employeeWages.get(employeeId)?.holiday_pay || 0;
    setHolidayAmount(current > 0 ? current.toString() : '');
    setHolidayDialogOpen(true);
  };

  const handleBonusSave = async () => {
    if (selectedEmployeeId) {
      onWageChange(selectedEmployeeId, 'bonus', parseFloat(bonusAmount) || 0);
      await handleBlur(selectedEmployeeId);
    }
    setBonusDialogOpen(false);
    setBonusAmount('');
  };

  const handleHolidaySave = async () => {
    if (selectedEmployeeId) {
      onWageChange(selectedEmployeeId, 'holiday_pay', parseFloat(holidayAmount) || 0);
      await handleBlur(selectedEmployeeId);
    }
    setHolidayDialogOpen(false);
    setHolidayAmount('');
  };

  const getEmptyWageData = (employeeId: number): EmployeeWageInput => ({
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

  const getSelectedEmployeeName = () => {
    if (!selectedEmployeeId) return '';
    const emp = employees.find((e) => e.id === selectedEmployeeId);
    return emp ? `${emp.first_name} ${emp.last_name}` : '';
  };

  return (
    <TooltipProvider>
      <div className="space-y-4">
        <div className="overflow-x-auto border rounded-lg">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/50">
                <TableHead className="min-w-[200px] sticky left-0 bg-muted/50">Employee</TableHead>
                <TableHead className="text-center w-20">W1</TableHead>
                <TableHead className="text-center w-10">✓</TableHead>
                <TableHead className="text-center w-20">W2</TableHead>
                <TableHead className="text-center w-10">✓</TableHead>
                <TableHead className="text-center w-20">W3</TableHead>
                <TableHead className="text-center w-10">✓</TableHead>
                <TableHead className="text-center w-20">W4</TableHead>
                <TableHead className="text-center w-10">✓</TableHead>
                <TableHead className="text-center w-20">W5</TableHead>
                <TableHead className="text-center w-10">✓</TableHead>
                <TableHead className="text-center w-24">Holiday</TableHead>
                <TableHead className="text-center w-24">Bonus</TableHead>
                <TableHead className="text-right w-28">Total Wages</TableHead>
                <TableHead className="text-right w-24">SS (EE)</TableHead>
                <TableHead className="text-right w-24">Levy (EE)</TableHead>
                <TableHead className="text-right w-28">EE Total</TableHead>
                <TableHead className="text-right w-28">ER Total</TableHead>
                <TableHead className="text-right w-32">Grand Total</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {employees.map((emp) => {
                const wageData = employeeWages.get(emp.id) || getEmptyWageData(emp.id);
                const result = getEmployeeResult(emp.id);
                const age = calculateAge(emp.date_of_birth);
                const isDirectorOnly = emp.is_director_only;
                const isRowCalculating = calculatingRow === emp.id;
                const isAgeExempt = age < 16 || age >= 62;

                // For director-only employees, wages are set externally or use allowances field
                // Directors typically have their monthly salary entered as a single wage value
                const directorMonthlyWage = isDirectorOnly ? (emp.allowances || 0) : null;
                const directorWeeklyWage = directorMonthlyWage ? directorMonthlyWage / 4 : null;

                return (
                  <TableRow 
                    key={emp.id} 
                    className={isRowCalculating ? 'bg-muted/30' : undefined}
                  >
                    <TableCell className="sticky left-0 bg-background">
                      <div className="flex items-center gap-2">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-medium">
                              {emp.first_name} {emp.last_name}
                            </span>
                            {isDirectorOnly && (
                              <Badge variant="outline" className="text-xs">Director</Badge>
                            )}
                          </div>
                          <div className="flex items-center gap-2 text-xs text-muted-foreground">
                            <span className="font-mono">{formatSSN(emp.social_security_number)}</span>
                            <span>• Age: {age}</span>
                            {isAgeExempt && (
                              <Tooltip>
                                <TooltipTrigger>
                                  <AlertCircle className="h-3 w-3 text-amber-500" />
                                </TooltipTrigger>
                                <TooltipContent>
                                  Age exempt from Social Security (under 16 or 62+)
                                </TooltipContent>
                              </Tooltip>
                            )}
                            {emp.is_levy_exempt && (
                              <Badge variant="secondary" className="text-xs">Levy Exempt</Badge>
                            )}
                          </div>
                        </div>
                      </div>
                    </TableCell>

                    {/* Week 1 */}
                    <TableCell>
                      <Input
                        type="number"
                        min="0"
                        step="0.01"
                        className="w-20 text-right text-sm"
                        value={isDirectorOnly && directorWeeklyWage ? directorWeeklyWage.toFixed(2) : (wageData.week1_wages || '')}
                        disabled={isDirectorOnly && !!directorWeeklyWage}
                        onChange={(e) => onWageChange(emp.id, 'week1_wages', parseFloat(e.target.value) || 0)}
                        onBlur={() => handleBlur(emp.id)}
                      />
                    </TableCell>
                    <TableCell className="text-center">
                      <Checkbox
                        checked={wageData.week1_worked || wageData.week1_wages > 0}
                        onCheckedChange={(checked) => onWageChange(emp.id, 'week1_worked', checked as boolean)}
                        disabled={isDirectorOnly && !!directorWeeklyWage}
                      />
                    </TableCell>

                    {/* Week 2 */}
                    <TableCell>
                      <Input
                        type="number"
                        min="0"
                        step="0.01"
                        className="w-20 text-right text-sm"
                        value={isDirectorOnly && directorWeeklyWage ? directorWeeklyWage.toFixed(2) : (wageData.week2_wages || '')}
                        disabled={isDirectorOnly && !!directorWeeklyWage}
                        onChange={(e) => onWageChange(emp.id, 'week2_wages', parseFloat(e.target.value) || 0)}
                        onBlur={() => handleBlur(emp.id)}
                      />
                    </TableCell>
                    <TableCell className="text-center">
                      <Checkbox
                        checked={wageData.week2_worked || wageData.week2_wages > 0}
                        onCheckedChange={(checked) => onWageChange(emp.id, 'week2_worked', checked as boolean)}
                        disabled={isDirectorOnly && !!directorWeeklyWage}
                      />
                    </TableCell>

                    {/* Week 3 */}
                    <TableCell>
                      <Input
                        type="number"
                        min="0"
                        step="0.01"
                        className="w-20 text-right text-sm"
                        value={isDirectorOnly && directorWeeklyWage ? directorWeeklyWage.toFixed(2) : (wageData.week3_wages || '')}
                        disabled={isDirectorOnly && !!directorWeeklyWage}
                        onChange={(e) => onWageChange(emp.id, 'week3_wages', parseFloat(e.target.value) || 0)}
                        onBlur={() => handleBlur(emp.id)}
                      />
                    </TableCell>
                    <TableCell className="text-center">
                      <Checkbox
                        checked={wageData.week3_worked || wageData.week3_wages > 0}
                        onCheckedChange={(checked) => onWageChange(emp.id, 'week3_worked', checked as boolean)}
                        disabled={isDirectorOnly && !!directorWeeklyWage}
                      />
                    </TableCell>

                    {/* Week 4 */}
                    <TableCell>
                      <Input
                        type="number"
                        min="0"
                        step="0.01"
                        className="w-20 text-right text-sm"
                        value={isDirectorOnly && directorWeeklyWage ? directorWeeklyWage.toFixed(2) : (wageData.week4_wages || '')}
                        disabled={isDirectorOnly && !!directorWeeklyWage}
                        onChange={(e) => onWageChange(emp.id, 'week4_wages', parseFloat(e.target.value) || 0)}
                        onBlur={() => handleBlur(emp.id)}
                      />
                    </TableCell>
                    <TableCell className="text-center">
                      <Checkbox
                        checked={wageData.week4_worked || wageData.week4_wages > 0}
                        onCheckedChange={(checked) => onWageChange(emp.id, 'week4_worked', checked as boolean)}
                        disabled={isDirectorOnly && !!directorWeeklyWage}
                      />
                    </TableCell>

                    {/* Week 5 */}
                    <TableCell>
                      <Input
                        type="number"
                        min="0"
                        step="0.01"
                        className="w-20 text-right text-sm"
                        value={isDirectorOnly ? '0.00' : (wageData.week5_wages || '')}
                        disabled={isDirectorOnly}
                        onChange={(e) => onWageChange(emp.id, 'week5_wages', parseFloat(e.target.value) || 0)}
                        onBlur={() => handleBlur(emp.id)}
                      />
                    </TableCell>
                    <TableCell className="text-center">
                      <Checkbox
                        checked={wageData.week5_worked || wageData.week5_wages > 0}
                        onCheckedChange={(checked) => onWageChange(emp.id, 'week5_worked', checked as boolean)}
                        disabled={isDirectorOnly}
                      />
                    </TableCell>

                    {/* Holiday Pay */}
                    <TableCell>
                      <Button
                        variant="outline"
                        size="sm"
                        className="w-full gap-1 text-xs"
                        onClick={() => handleOpenHolidayDialog(emp.id)}
                      >
                        <Umbrella className="h-3 w-3" />
                        {wageData.holiday_pay > 0 ? formatCurrency(wageData.holiday_pay) : 'Add'}
                      </Button>
                    </TableCell>

                    {/* Bonus */}
                    <TableCell>
                      <Button
                        variant="outline"
                        size="sm"
                        className="w-full gap-1 text-xs"
                        onClick={() => handleOpenBonusDialog(emp.id)}
                      >
                        <Gift className="h-3 w-3" />
                        {wageData.bonus > 0 ? formatCurrency(wageData.bonus) : 'Add'}
                      </Button>
                    </TableCell>

                    {/* Calculated Values */}
                    <TableCell className="text-right font-medium">
                      {isRowCalculating ? (
                        <Loader2 className="h-4 w-4 animate-spin ml-auto" />
                      ) : (
                        formatCurrency(result?.total_wages || getTotalWages(wageData))
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      {result?.is_age_exempt ? (
                        <span className="text-muted-foreground text-xs">Exempt</span>
                      ) : (
                        formatCurrency(result?.ss_employee || 0)
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      {result?.is_levy_exempt ? (
                        <span className="text-muted-foreground text-xs">Exempt</span>
                      ) : (
                        formatCurrency(result?.levy_employee || 0)
                      )}
                    </TableCell>
                    <TableCell className="text-right font-medium">
                      {formatCurrency(result?.total_employee || 0)}
                    </TableCell>
                    <TableCell className="text-right font-medium">
                      {formatCurrency(result?.total_employer || 0)}
                    </TableCell>
                    <TableCell className="text-right font-bold text-primary">
                      {formatCurrency(result?.grand_total || 0)}
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>

        {/* Bonus Dialog */}
        <Dialog open={bonusDialogOpen} onOpenChange={setBonusDialogOpen}>
          <DialogContent className="max-w-sm">
            <DialogHeader>
              <DialogTitle>Add Bonus</DialogTitle>
              <DialogDescription>
                Enter bonus amount for {getSelectedEmployeeName()}
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label>Bonus Amount</Label>
                <Input
                  type="number"
                  min="0"
                  step="0.01"
                  value={bonusAmount}
                  onChange={(e) => setBonusAmount(e.target.value)}
                  placeholder="0.00"
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setBonusDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleBonusSave}>
                Save
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Holiday Pay Dialog */}
        <Dialog open={holidayDialogOpen} onOpenChange={setHolidayDialogOpen}>
          <DialogContent className="max-w-sm">
            <DialogHeader>
              <DialogTitle>Add Holiday Pay</DialogTitle>
              <DialogDescription>
                Enter holiday pay amount for {getSelectedEmployeeName()}
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label>Holiday Pay Amount</Label>
                <Input
                  type="number"
                  min="0"
                  step="0.01"
                  value={holidayAmount}
                  onChange={(e) => setHolidayAmount(e.target.value)}
                  placeholder="0.00"
                />
              </div>
              <p className="text-xs text-muted-foreground">
                Holiday pay will be distributed to non-working weeks automatically.
              </p>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setHolidayDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleHolidaySave}>
                Save
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </TooltipProvider>
  );
}
