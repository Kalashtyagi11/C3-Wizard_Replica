/**
 * C3 Preview Modal
 * Displays the SSB Statement of Wages and Contributions format
 * Matches PDF exactly
 */

import { useEffect, useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
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
import { Printer, Download, X, Loader2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { format } from 'date-fns';

interface C3PreviewModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  c3HeaderId: number;
  companyName: string;
  registrationNumber: string;
  address: string;
}

interface C3DetailRow {
  id: number;
  ssn: string;
  employee_name: string;
  pay_period: string;
  week1_wages: number;
  week2_wages: number;
  week3_wages: number;
  week4_wages: number;
  week5_wages: number;
  holiday_pay: number;
  bonus: number;
  total_wages: number;
  levy_employee: number;
  levy_employer: number;
  ss_employee: number;
  ss_employer: number;
  remarks: string;
}

interface C3HeaderData {
  period_month: string;
  period_year: string;
  schedule_number: number;
  employee_count: number;
  total_wages: number;
  total_ss_employee: number;
  total_ss_employer: number;
  total_levy_employee: number;
  total_levy_employer: number;
  total_severance: number;
  total_ss_penalty: number;
  total_levy_penalty: number;
  total_pe_penalty: number;
  grand_total: number;
  is_submitted: boolean;
}

const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

export function C3PreviewModal({
  open,
  onOpenChange,
  c3HeaderId,
  companyName,
  registrationNumber,
  address,
}: C3PreviewModalProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [headerData, setHeaderData] = useState<C3HeaderData | null>(null);
  const [details, setDetails] = useState<C3DetailRow[]>([]);

  useEffect(() => {
    if (open && c3HeaderId) {
      fetchC3Data();
    }
  }, [open, c3HeaderId]);

  const fetchC3Data = async () => {
    setIsLoading(true);
    try {
      // Fetch header
      const { data: header } = await supabase
        .from('c3_contribution_headers')
        .select('*')
        .eq('id', c3HeaderId)
        .single();

      if (header) {
        setHeaderData({
          period_month: header.period_month || '',
          period_year: header.period_year || '',
          schedule_number: header.schedule_number || 1,
          employee_count: header.employee_count || 0,
          total_wages: header.total_wages || 0,
          total_ss_employee: header.total_ss_employee || 0,
          total_ss_employer: header.total_ss_employer || 0,
          total_levy_employee: header.total_levy_employee || 0,
          total_levy_employer: header.total_levy_employer || 0,
          total_severance: header.total_severance || 0,
          total_ss_penalty: header.total_ss_penalty || 0,
          total_levy_penalty: header.total_levy_penalty || 0,
          total_pe_penalty: header.total_pe_penalty || 0,
          grand_total: header.grand_total || 0,
          is_submitted: header.is_submitted || false,
        });
      }

      // Fetch details with employee info
      const { data: detailsData } = await supabase
        .from('c3_contribution_details')
        .select(`
          *,
          c3_employees!inner(
            social_security_number,
            first_name,
            last_name,
            pay_period
          )
        `)
        .eq('header_id', c3HeaderId)
        .eq('is_deleted', false);

      if (detailsData) {
        setDetails(detailsData.map(d => ({
          id: d.id,
          ssn: d.c3_employees?.social_security_number || '',
          employee_name: `${d.c3_employees?.first_name || ''} ${d.c3_employees?.last_name || ''}`.trim(),
          pay_period: d.c3_employees?.pay_period || 'M',
          week1_wages: d.week1_wages || 0,
          week2_wages: d.week2_wages || 0,
          week3_wages: d.week3_wages || 0,
          week4_wages: d.week4_wages || 0,
          week5_wages: d.week5_wages || 0,
          holiday_pay: d.total_holiday_pay || 0,
          bonus: d.bonus_amount || 0,
          total_wages: (d.week1_wages || 0) + (d.week2_wages || 0) + (d.week3_wages || 0) + 
                       (d.week4_wages || 0) + (d.week5_wages || 0),
          levy_employee: d.levy_employee || 0,
          levy_employer: d.levy_employer || 0,
          ss_employee: d.social_security_employee || 0,
          ss_employer: d.social_security_employer || 0,
          remarks: '',
        })));
      }
    } catch (err) {
      console.error('Error fetching C3 data:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'XCD',
      minimumFractionDigits: 2,
    }).format(amount);
  };

  const getMonthName = (monthNum: string) => {
    const num = parseInt(monthNum);
    return MONTHS[num - 1] || monthNum;
  };

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadPDF = () => {
    // TODO: Implement PDF generation with jsPDF
    alert('PDF download coming soon');
  };

  // Calculate summary values
  const accountantGeneralTotal = headerData 
    ? (headerData.total_levy_employee + headerData.total_levy_employer + headerData.total_severance)
    : 0;
  
  const socialSecurityTotal = headerData
    ? (headerData.total_ss_employee + headerData.total_ss_employer)
    : 0;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-center text-lg font-bold">
            THE ST. CHRISTOPHER AND NEVIS - SOCIAL SECURITY BOARD
          </DialogTitle>
          <p className="text-center text-sm text-muted-foreground">
            STATEMENT OF WAGES AND CONTRIBUTIONS
          </p>
        </DialogHeader>

        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin" />
          </div>
        ) : headerData ? (
          <div className="space-y-6 print:p-4" id="c3-preview-content">
            {/* Header Information */}
            <div className="grid grid-cols-2 gap-4 text-sm border-b pb-4">
              <div>
                <p><strong>Name of Employer:</strong> {companyName}</p>
                <p><strong>Trade Name:</strong> {companyName}</p>
                <p><strong>Address:</strong> {address || 'N/A'}</p>
              </div>
              <div className="text-right">
                <p><strong>Employer's Registration No.:</strong> {registrationNumber}</p>
                <p><strong>Period:</strong> {getMonthName(headerData.period_month)} {headerData.period_year}</p>
                <p><strong>Employees:</strong> {headerData.employee_count}</p>
                <Badge variant={headerData.is_submitted ? 'default' : 'secondary'}>
                  {headerData.is_submitted ? 'Submitted' : 'Not Submitted'}
                </Badge>
              </div>
            </div>

            {/* Summary Cards */}
            <div className="grid grid-cols-3 gap-4 text-sm">
              <div className="bg-muted p-4 rounded-lg">
                <p className="text-muted-foreground">(1) Accountant General</p>
                <p className="text-xl font-bold">{formatCurrency(accountantGeneralTotal)}</p>
              </div>
              <div className="bg-muted p-4 rounded-lg">
                <p className="text-muted-foreground">(2) Social Security</p>
                <p className="text-xl font-bold">{formatCurrency(socialSecurityTotal)}</p>
              </div>
              <div className="bg-primary/10 p-4 rounded-lg">
                <p className="text-muted-foreground">Grand Total</p>
                <p className="text-xl font-bold text-primary">{formatCurrency(headerData.grand_total)}</p>
              </div>
            </div>

            {/* Detail Table */}
            <div className="overflow-x-auto border rounded-lg">
              <Table>
                <TableHeader>
                  <TableRow className="bg-muted/50">
                    <TableHead>Name of Employee</TableHead>
                    <TableHead>SSN</TableHead>
                    <TableHead className="text-center">Period</TableHead>
                    <TableHead className="text-center">WK1</TableHead>
                    <TableHead className="text-center">WK2</TableHead>
                    <TableHead className="text-center">WK3</TableHead>
                    <TableHead className="text-center">WK4</TableHead>
                    <TableHead className="text-center">WK5</TableHead>
                    <TableHead className="text-right">Wages/Salaries</TableHead>
                    <TableHead className="text-right">Deduct Levy</TableHead>
                    <TableHead className="text-right">Total SS 11%</TableHead>
                    <TableHead>Remarks</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {details.map((row) => (
                    <TableRow key={row.id}>
                      <TableCell className="font-medium">{row.employee_name}</TableCell>
                      <TableCell className="font-mono text-xs">{row.ssn}</TableCell>
                      <TableCell className="text-center">{row.pay_period}</TableCell>
                      <TableCell className="text-center text-xs">
                        {row.week1_wages > 0 ? '✓' : '-'}
                      </TableCell>
                      <TableCell className="text-center text-xs">
                        {row.week2_wages > 0 ? '✓' : '-'}
                      </TableCell>
                      <TableCell className="text-center text-xs">
                        {row.week3_wages > 0 ? '✓' : '-'}
                      </TableCell>
                      <TableCell className="text-center text-xs">
                        {row.week4_wages > 0 ? '✓' : '-'}
                      </TableCell>
                      <TableCell className="text-center text-xs">
                        {row.week5_wages > 0 ? '✓' : '-'}
                      </TableCell>
                      <TableCell className="text-right font-mono">
                        {formatCurrency(row.total_wages)}
                      </TableCell>
                      <TableCell className="text-right font-mono">
                        {formatCurrency(row.levy_employee)}
                      </TableCell>
                      <TableCell className="text-right font-mono">
                        {formatCurrency(row.ss_employee + row.ss_employer)}
                      </TableCell>
                      <TableCell className="text-xs">{row.remarks}</TableCell>
                    </TableRow>
                  ))}
                  {/* Totals Row */}
                  <TableRow className="bg-muted font-semibold">
                    <TableCell colSpan={8}>TOTALS</TableCell>
                    <TableCell className="text-right font-mono">
                      {formatCurrency(headerData.total_wages)}
                    </TableCell>
                    <TableCell className="text-right font-mono">
                      {formatCurrency(headerData.total_levy_employee)}
                    </TableCell>
                    <TableCell className="text-right font-mono">
                      {formatCurrency(socialSecurityTotal)}
                    </TableCell>
                    <TableCell></TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </div>

            {/* Official Use Section */}
            <div className="border rounded-lg p-4 text-sm space-y-2">
              <h4 className="font-semibold">FOR OFFICIAL USE ONLY</h4>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <p>Employer's 3% of Wages for Levy Contribution: {formatCurrency(headerData.total_levy_employer)}</p>
                  <p>Employee's 1% of Wages for Severance Payments Contribution: {formatCurrency(headerData.total_severance)}</p>
                  <p>Levy Penalty for the month if any: {formatCurrency(headerData.total_levy_penalty)}</p>
                  <p>Severance Penalty for month if any: {formatCurrency(headerData.total_pe_penalty)}</p>
                </div>
                <div className="space-y-1">
                  <p><strong>Total Accountant General:</strong> {formatCurrency(accountantGeneralTotal)}</p>
                  <p>Fines due for the month if any: {formatCurrency(headerData.total_ss_penalty)}</p>
                  <p><strong>Total Social Security Remittance due for the month:</strong> {formatCurrency(socialSecurityTotal)}</p>
                </div>
              </div>
            </div>

            {/* Certification */}
            <div className="border-t pt-4 text-sm">
              <p className="italic">
                I/We hereby certify that the particulars stated above are true and correct to the best of my/our knowledge and belief.
              </p>
              <div className="grid grid-cols-2 gap-8 mt-4">
                <div>
                  <p className="border-b border-dashed pb-8"></p>
                  <p className="text-xs text-muted-foreground">Signature of Employer or Agent</p>
                </div>
                <div>
                  <p className="font-medium">Date: {format(new Date(), 'dd-MMM-yyyy')}</p>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-end gap-3 border-t pt-4 print:hidden">
              <Button variant="outline" onClick={() => onOpenChange(false)}>
                <X className="h-4 w-4 mr-2" />
                Close
              </Button>
              <Button variant="outline" onClick={handlePrint}>
                <Printer className="h-4 w-4 mr-2" />
                Print
              </Button>
              <Button onClick={handleDownloadPDF}>
                <Download className="h-4 w-4 mr-2" />
                Download PDF
              </Button>
            </div>
          </div>
        ) : (
          <div className="text-center py-8 text-muted-foreground">
            No data found for this C3
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
