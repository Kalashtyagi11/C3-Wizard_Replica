/**
 * Bonus Entry Dialog
 * Used within C3 Generation to add bonus for an employee
 * Matches PDF: Select Employee dropdown, Payment Date, Amount
 */

import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Loader2 } from 'lucide-react';
import type { Employee } from '@/hooks/useEmployees';

interface BonusEntryDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  employees: Employee[];
  onSave: (employeeId: number, amount: number, paymentDate: string) => Promise<void>;
  defaultEmployeeId?: number;
}

export function BonusEntryDialog({
  open,
  onOpenChange,
  employees,
  onSave,
  defaultEmployeeId,
}: BonusEntryDialogProps) {
  const [selectedEmployee, setSelectedEmployee] = useState(defaultEmployeeId?.toString() || '');
  const [amount, setAmount] = useState('');
  const [paymentDate, setPaymentDate] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSave = async () => {
    if (!selectedEmployee || !amount || !paymentDate) {
      return;
    }

    setIsSubmitting(true);
    try {
      await onSave(parseInt(selectedEmployee), parseFloat(amount), paymentDate);
      resetForm();
      onOpenChange(false);
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    setSelectedEmployee('');
    setAmount('');
    setPaymentDate('');
  };

  const formatSSN = (ssn: string | null) => {
    if (!ssn) return '';
    return ssn.length >= 4 ? ssn.slice(-6) : ssn;
  };

  return (
    <Dialog open={open} onOpenChange={(o) => { if (!o) resetForm(); onOpenChange(o); }}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Employee Bonus Details</DialogTitle>
          <DialogDescription>
            Add bonus payment for an employee
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label>Select Employee *</Label>
            <Select value={selectedEmployee} onValueChange={setSelectedEmployee}>
              <SelectTrigger>
                <SelectValue placeholder="Select an employee" />
              </SelectTrigger>
              <SelectContent>
                {employees.filter(e => !e.is_deleted).map(emp => (
                  <SelectItem key={emp.id} value={emp.id.toString()}>
                    {formatSSN(emp.social_security_number)} ({emp.first_name} {emp.last_name})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Payment Date *</Label>
            <Input
              type="date"
              value={paymentDate}
              onChange={(e) => setPaymentDate(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label>Amount *</Label>
            <Input
              type="number"
              step="0.01"
              min="0"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="0.00"
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button 
            onClick={handleSave} 
            disabled={isSubmitting || !selectedEmployee || !amount || !paymentDate}
          >
            {isSubmitting && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
            Save
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
