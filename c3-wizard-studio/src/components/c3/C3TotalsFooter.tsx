/**
 * C3 Totals Footer Component
 * 
 * Displays the summary totals for a C3 form with breakdown
 * of employee and employer contributions.
 */

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Users, DollarSign, Building2, Calculator } from 'lucide-react';
import { CalculationTotals } from '@/hooks/useC3Generation';

interface C3TotalsFooterProps {
  totals: CalculationTotals | null;
  month: number;
  year: number;
}

const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

export function C3TotalsFooter({ totals, month, year }: C3TotalsFooterProps) {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'XCD',
      minimumFractionDigits: 2,
    }).format(amount);
  };

  if (!totals) {
    return null;
  }

  return (
    <div className="space-y-4">
      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-lg bg-primary/10">
                <Users className="h-4 w-4 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Employees</p>
                <p className="text-2xl font-bold">{totals.employee_count}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-lg bg-primary/10">
                <DollarSign className="h-4 w-4 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Wages</p>
                <p className="text-2xl font-bold">{formatCurrency(totals.total_wages)}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-lg bg-accent">
                <Building2 className="h-4 w-4 text-accent-foreground" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Period</p>
                <p className="text-lg font-bold">{MONTHS[month - 1]} {year}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-primary text-primary-foreground">
          <CardContent className="pt-6">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-lg bg-primary-foreground/20">
                <Calculator className="h-4 w-4" />
              </div>
              <div>
                <p className="text-sm opacity-90">Grand Total</p>
                <p className="text-2xl font-bold">{formatCurrency(totals.grand_total)}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Breakdown */}
      <div className="grid gap-4 md:grid-cols-2">
        {/* Employee Contributions */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <Users className="h-4 w-4" />
              Employee Contributions (Deductions)
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Social Security (5%)</span>
              <span className="font-medium">{formatCurrency(totals.total_ss_employee)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Employment Insurance (1%)</span>
              <span className="font-medium">{formatCurrency(totals.total_ei_employee)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Social Services Levy (0-5%)</span>
              <span className="font-medium">{formatCurrency(totals.total_levy_employee)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Severance/PE (5%)</span>
              <span className="font-medium">{formatCurrency(totals.total_pe_employee)}</span>
            </div>
            <Separator />
            <div className="flex justify-between">
              <span className="font-medium">Total Employee</span>
              <span className="font-bold text-primary">{formatCurrency(totals.total_employee)}</span>
            </div>
          </CardContent>
        </Card>

        {/* Employer Contributions */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <Building2 className="h-4 w-4" />
              Employer Contributions
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Social Security (5%)</span>
              <span className="font-medium">{formatCurrency(totals.total_ss_employer)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Employment Insurance (1%)</span>
              <span className="font-medium">{formatCurrency(totals.total_ei_employer)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Social Services Levy (3%)</span>
              <span className="font-medium">{formatCurrency(totals.total_levy_employer)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Severance/PE (5%)</span>
              <span className="font-medium">{formatCurrency(totals.total_pe_employer)}</span>
            </div>
            <Separator />
            <div className="flex justify-between">
              <span className="font-medium">Total Employer</span>
              <span className="font-bold text-primary">{formatCurrency(totals.total_employer)}</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Holiday Pay and Bonus if applicable */}
      {(totals.total_holiday_pay > 0 || totals.total_bonus > 0) && (
        <Card>
          <CardContent className="pt-6">
            <div className="flex gap-8 justify-center">
              {totals.total_holiday_pay > 0 && (
                <div className="text-center">
                  <p className="text-sm text-muted-foreground">Total Holiday Pay</p>
                  <p className="text-lg font-semibold">{formatCurrency(totals.total_holiday_pay)}</p>
                </div>
              )}
              {totals.total_bonus > 0 && (
                <div className="text-center">
                  <p className="text-sm text-muted-foreground">Total Bonus</p>
                  <p className="text-lg font-semibold">{formatCurrency(totals.total_bonus)}</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
