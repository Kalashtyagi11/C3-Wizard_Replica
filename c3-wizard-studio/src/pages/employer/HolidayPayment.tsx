/**
 * Holiday Payment Page
 * Manage holiday pay distributions for employees
 * Uses existing c3_bonus_payments table for now (will migrate later)
 */

import { useState, useEffect, useCallback } from 'react';
import { DashboardLayout } from '@/components/layout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Plus, Loader2, Trash2, Calendar, Eye, Edit } from 'lucide-react';
import { useHolidayPay } from '@/hooks/useHolidayPay';
import { useEmployees } from '@/hooks/useEmployees';
import { format } from 'date-fns';
import { toast } from 'sonner';

export default function HolidayPayment() {
  const { records, isLoading, fetchHolidayPay, addHolidayPay, deleteHolidayPay } = useHolidayPay();
  const { employees, fetchEmployees, companyId } = useEmployees();
  
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState('');
  const [amount, setAmount] = useState('');
  const [paymentDate, setPaymentDate] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (companyId) {
      fetchHolidayPay(companyId);
      fetchEmployees(companyId);
    }
  }, [companyId, fetchHolidayPay, fetchEmployees]);

  const handleSubmit = async () => {
    if (!selectedEmployee || !amount || !paymentDate) {
      toast.error('Please fill in all fields');
      return;
    }

    setIsSubmitting(true);
    const { error } = await addHolidayPay(
      parseInt(selectedEmployee),
      parseFloat(amount),
      paymentDate,
      companyId || 1
    );

    if (error) {
      toast.error(error);
    } else {
      toast.success('Holiday pay added successfully');
      setIsDialogOpen(false);
      resetForm();
    }
    setIsSubmitting(false);
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this holiday pay record?')) return;
    const { error } = await deleteHolidayPay(id, companyId || 1);
    if (error) {
      toast.error(error);
    } else {
      toast.success('Holiday pay deleted');
    }
  };

  const resetForm = () => {
    setSelectedEmployee('');
    setAmount('');
    setPaymentDate('');
  };

  const formatCurrency = (value: number | null) => {
    if (value === null) return '-';
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'XCD',
    }).format(value);
  };

  const formatSSN = (ssn: string | null | undefined) => {
    if (!ssn) return '---';
    return ssn.length >= 4 ? ssn.slice(-6) : ssn;
  };

  const activeEmployees = employees.filter(e => !e.is_deleted);

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Holiday Payment List</h1>
            <p className="text-muted-foreground">
              Manage holiday pay distributions for employees
            </p>
          </div>
          <Button onClick={() => setIsDialogOpen(true)} className="gap-2">
            <Plus className="h-4 w-4" />
            Add Holiday/Other Pay
          </Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Holiday Pay Records
            </CardTitle>
            <CardDescription>
              {records.length} records found
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="h-6 w-6 animate-spin text-primary" />
              </div>
            ) : records.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground">
                <Calendar className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>No holiday pay records found</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-muted/50">
                      <TableHead>SSN</TableHead>
                      <TableHead>Employee Name</TableHead>
                      <TableHead className="text-right">Amount</TableHead>
                      <TableHead>Payment Date</TableHead>
                      <TableHead className="text-center">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {records.map((record) => (
                      <TableRow key={record.id}>
                        <TableCell className="font-mono">
                          {formatSSN(record.social_security_number)}
                        </TableCell>
                        <TableCell className="font-medium">
                          {record.employee_name}
                        </TableCell>
                        <TableCell className="text-right font-mono">
                          {formatCurrency(record.amount)}
                        </TableCell>
                        <TableCell>
                          {record.holiday_pay_date 
                            ? format(new Date(record.holiday_pay_date), 'dd-MMM-yyyy')
                            : '-'}
                        </TableCell>
                        <TableCell className="text-center">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleDelete(record.id)}
                            className="h-8 w-8 text-destructive"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Add Dialog */}
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Add Holiday/Other Pay</DialogTitle>
              <DialogDescription>
                Record holiday pay for an employee
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label>Employee</Label>
                <Select value={selectedEmployee} onValueChange={setSelectedEmployee}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select an employee" />
                  </SelectTrigger>
                  <SelectContent>
                    {activeEmployees.map(emp => (
                      <SelectItem key={emp.id} value={emp.id.toString()}>
                        {formatSSN(emp.social_security_number)} ({emp.first_name} {emp.last_name})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Amount (XCD)</Label>
                <Input
                  type="number"
                  step="0.01"
                  min="0"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="0.00"
                />
              </div>
              <div className="space-y-2">
                <Label>Payment Date</Label>
                <Input
                  type="date"
                  value={paymentDate}
                  onChange={(e) => setPaymentDate(e.target.value)}
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleSubmit} disabled={isSubmitting}>
                {isSubmitting && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                Save
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </DashboardLayout>
  );
}
