/**
 * Holiday Pay Entry Dialog
 * Used within C3 Generation to add holiday pay for an employee
 * Matches PDF: Select Employee, Is Director toggle, Amount, From/To Date
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
import { Checkbox } from '@/components/ui/checkbox';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Loader2 } from 'lucide-react';
import type { Employee } from '@/hooks/useEmployees';

interface HolidayPayEntryDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  employees: Employee[];
  onSave: (data: {
    employeeId: number;
    amount: number;
    fromDate: string;
    toDate: string;
    isDirector: boolean;
  }) => Promise<void>;
  defaultEmployeeId?: number;
}

export function HolidayPayEntryDialog({
  open,
  onOpenChange,
  employees,
  onSave,
  defaultEmployeeId,
}: HolidayPayEntryDialogProps) {
  const [selectedEmployee, setSelectedEmployee] = useState(defaultEmployeeId?.toString() || '');
  const [amount, setAmount] = useState('');
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');
  const [isDirector, setIsDirector] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSave = async () => {
    if (!selectedEmployee || !amount || !fromDate || !toDate) {
      return;
    }

    setIsSubmitting(true);
    try {
      await onSave({
        employeeId: parseInt(selectedEmployee),
        amount: parseFloat(amount),
        fromDate,
        toDate,
        isDirector,
      });
      resetForm();
      onOpenChange(false);
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    setSelectedEmployee('');
    setAmount('');
    setFromDate('');
    setToDate('');
    setIsDirector(false);
  };

  const formatSSN = (ssn: string | null) => {
    if (!ssn) return '';
    return ssn.length >= 4 ? ssn.slice(-6) : ssn;
  };

  return (
    <Dialog open={open} onOpenChange={(o) => { if (!o) resetForm(); onOpenChange(o); }}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Employee Holiday/Other Pay</DialogTitle>
          <DialogDescription>
            Add holiday pay for an employee
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

          <div className="flex items-center space-x-2">
            <Checkbox
              id="working-director"
              checked={isDirector}
              onCheckedChange={(checked) => setIsDirector(checked as boolean)}
            />
            <Label htmlFor="working-director">Working Director?</Label>
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

          <div className="space-y-2">
            <Label>From Date *</Label>
            <Input
              type="date"
              value={fromDate}
              onChange={(e) => setFromDate(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label>To Date *</Label>
            <Input
              type="date"
              value={toDate}
              onChange={(e) => setToDate(e.target.value)}
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button 
            onClick={handleSave} 
            disabled={isSubmitting || !selectedEmployee || !amount || !fromDate || !toDate}
          >
            {isSubmitting && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
            Save
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
