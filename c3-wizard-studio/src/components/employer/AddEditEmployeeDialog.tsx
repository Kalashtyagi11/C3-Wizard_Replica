/**
 * Add/Edit Employee Dialog
 * Connected to optimised c3_employees table
 */

import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
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

interface AddEditEmployeeDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  employee?: Employee | null;
  onSave: (data: Partial<Employee>) => Promise<void>;
  mode?: 'add' | 'edit';
}

export function AddEditEmployeeDialog({
  open,
  onOpenChange,
  employee,
  onSave,
  mode = 'add',
}: AddEditEmployeeDialogProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState<Partial<Employee>>({});

  useEffect(() => {
    if (employee && mode === 'edit') {
      setFormData({
        first_name: employee.first_name || '',
        middle_name: employee.middle_name || '',
        last_name: employee.last_name || '',
        social_security_number: employee.social_security_number || '',
        email: employee.email || '',
        phone: employee.phone || '',
        mobile: employee.mobile || '',
        department: employee.department || '',
        pay_period: employee.pay_period || 'W',
        gender: employee.gender || '',
        date_of_birth: employee.date_of_birth || '',
        address_line1: employee.address_line1 || '',
        city: employee.city || '',
        country: employee.country || '',
      });
    } else {
      setFormData({
        pay_period: 'W',
        gender: 'M',
      });
    }
  }, [employee, mode, open]);

  const handleInputChange = (field: keyof Employee, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await onSave(formData);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">
            {mode === 'add' ? 'Add New Employee' : 'Edit Employee'}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Basic Info */}
          <div className="grid gap-4 md:grid-cols-3">
            <div className="space-y-2">
              <Label htmlFor="first_name">First Name *</Label>
              <Input
                id="first_name"
                value={formData.first_name || ''}
                onChange={(e) => handleInputChange('first_name', e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="middle_name">Middle Name</Label>
              <Input
                id="middle_name"
                value={formData.middle_name || ''}
                onChange={(e) => handleInputChange('middle_name', e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="last_name">Last Name *</Label>
              <Input
                id="last_name"
                value={formData.last_name || ''}
                onChange={(e) => handleInputChange('last_name', e.target.value)}
                required
              />
            </div>
          </div>

          {/* SSN and Contact */}
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="social_security_number">Social Security Number *</Label>
              <Input
                id="social_security_number"
                value={formData.social_security_number || ''}
                onChange={(e) => handleInputChange('social_security_number', e.target.value)}
                placeholder="XXX-XX-XXXX"
                required
                disabled={mode === 'edit'}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={formData.email || ''}
                onChange={(e) => handleInputChange('email', e.target.value)}
              />
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="phone">Phone</Label>
              <Input
                id="phone"
                value={formData.phone || ''}
                onChange={(e) => handleInputChange('phone', e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="mobile">Mobile</Label>
              <Input
                id="mobile"
                value={formData.mobile || ''}
                onChange={(e) => handleInputChange('mobile', e.target.value)}
              />
            </div>
          </div>

          {/* Work Info */}
          <div className="grid gap-4 md:grid-cols-3">
            <div className="space-y-2">
              <Label htmlFor="department">Department</Label>
              <Input
                id="department"
                value={formData.department || ''}
                onChange={(e) => handleInputChange('department', e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="pay_period">Pay Period *</Label>
              <Select
                value={formData.pay_period || 'W'}
                onValueChange={(value) => handleInputChange('pay_period', value)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="W">Weekly</SelectItem>
                  <SelectItem value="E2W">Bi-Weekly</SelectItem>
                  <SelectItem value="M">Monthly</SelectItem>
                  <SelectItem value="2M">Twice Monthly</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="gender">Gender</Label>
              <Select
                value={formData.gender || ''}
                onValueChange={(value) => handleInputChange('gender', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="M">Male</SelectItem>
                  <SelectItem value="F">Female</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Address */}
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="address_line1">Address</Label>
              <Input
                id="address_line1"
                value={formData.address_line1 || ''}
                onChange={(e) => handleInputChange('address_line1', e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="city">City</Label>
              <Input
                id="city"
                value={formData.city || ''}
                onChange={(e) => handleInputChange('city', e.target.value)}
              />
            </div>
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-2 pt-4">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
              {mode === 'add' ? 'Add Employee' : 'Save Changes'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
