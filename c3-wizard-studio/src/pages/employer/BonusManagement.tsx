/**
 * Bonus Management Page
 * Manage employee bonuses and view bonus reports
 */

import { useState, useEffect } from 'react';
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
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Plus, Loader2, Trash2, Gift, Search } from 'lucide-react';
import { useBonusPay } from '@/hooks/useBonusPay';
import { useEmployees } from '@/hooks/useEmployees';
import { format } from 'date-fns';
import { toast } from 'sonner';

const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

export default function BonusManagement() {
  const { records, isLoading, fetchBonusPay, addBonusPay, deleteBonusPay } = useBonusPay();
  const { employees, fetchEmployees } = useEmployees();
  
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState('');
  const [amount, setAmount] = useState('');
  const [bonusDate, setBonusDate] = useState('');
  const [selectedMonth, setSelectedMonth] = useState((new Date().getMonth() + 1).toString());
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear().toString());
  const [filterMonth, setFilterMonth] = useState('');
  const [filterYear, setFilterYear] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const companyId = 1;
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 5 }, (_, i) => (currentYear - 2 + i).toString());

  useEffect(() => {
    fetchBonusPay(companyId);
    fetchEmployees(companyId);
  }, [fetchBonusPay, fetchEmployees]);

  const handleSearch = () => {
    fetchBonusPay(
      companyId,
      filterMonth || undefined,
      filterYear || undefined
    );
  };

  const handleSubmit = async () => {
    if (!selectedEmployee || !amount || !bonusDate) {
      toast.error('Please fill in all fields');
      return;
    }

    setIsSubmitting(true);
    const { error } = await addBonusPay(
      parseInt(selectedEmployee),
      parseFloat(amount),
      bonusDate,
      selectedMonth,
      selectedYear,
      companyId
    );

    if (error) {
      toast.error(error);
    } else {
      toast.success('Bonus added successfully');
      setIsDialogOpen(false);
      resetForm();
    }
    setIsSubmitting(false);
  };

  const handleDelete = async (bonuspayid: number) => {
    if (confirm('Are you sure you want to delete this bonus record?')) {
      const { error } = await deleteBonusPay(bonuspayid, companyId);
      if (error) {
        toast.error(error);
      } else {
        toast.success('Bonus deleted');
      }
    }
  };

  const resetForm = () => {
    setSelectedEmployee('');
    setAmount('');
    setBonusDate('');
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
    if (ssn.length >= 4) {
      return `XXX-XX-${ssn.slice(-4)}`;
    }
    return ssn;
  };

  const getMonthName = (monthNum: string | null) => {
    if (!monthNum) return '-';
    const num = parseInt(monthNum);
    return MONTHS[num - 1] || monthNum;
  };

  const activeEmployees = employees.filter(e => !e.is_deleted);

  // Calculate totals
  const totalBonus = records.reduce((sum, r) => sum + (r.bonus_amount || 0), 0);

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-[#1a5c4c]">Bonus Management</h1>
            <p className="text-muted-foreground">
              Manage employee bonuses and view bonus reports
            </p>
          </div>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-[#45a049] hover:bg-[#3d8b40]">
                <Plus className="h-4 w-4 mr-2" />
                Add Bonus
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle className="text-[#1a5c4c]">Add Bonus</DialogTitle>
                <DialogDescription>
                  Record a bonus payment for an employee
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
                          {emp.first_name} {emp.last_name} ({formatSSN(emp.social_security_number)})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Month</Label>
                    <Select value={selectedMonth} onValueChange={setSelectedMonth}>
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
                    <Select value={selectedYear} onValueChange={setSelectedYear}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {years.map(year => (
                          <SelectItem key={year} value={year}>
                            {year}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
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
                  <Label>Bonus Date</Label>
                  <Input
                    type="date"
                    value={bonusDate}
                    onChange={(e) => setBonusDate(e.target.value)}
                  />
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Cancel
                </Button>
                <Button 
                  onClick={handleSubmit} 
                  disabled={isSubmitting}
                  className="bg-[#45a049] hover:bg-[#3d8b40]"
                >
                  {isSubmitting && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                  Add Bonus
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        {/* Summary Card */}
        <Card className="bg-gradient-to-r from-[#1a5c4c] to-[#45a049] text-white">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-white/80">Total Bonuses</p>
                <p className="text-3xl font-bold">{formatCurrency(totalBonus)}</p>
              </div>
              <Gift className="h-12 w-12 text-white/60" />
            </div>
          </CardContent>
        </Card>

        {/* Filter Card */}
        <Card>
          <CardHeader>
            <CardTitle className="text-[#1a5c4c]">Search Filters</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="space-y-2">
                <Label>Month</Label>
                <Select value={filterMonth} onValueChange={setFilterMonth}>
                  <SelectTrigger>
                    <SelectValue placeholder="All Months" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">All Months</SelectItem>
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
                <Select value={filterYear} onValueChange={setFilterYear}>
                  <SelectTrigger>
                    <SelectValue placeholder="All Years" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">All Years</SelectItem>
                    {years.map(year => (
                      <SelectItem key={year} value={year}>
                        {year}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-end gap-2 col-span-2">
                <Button onClick={handleSearch} className="bg-[#45a049] hover:bg-[#3d8b40]">
                  <Search className="h-4 w-4 mr-2" />
                  Search
                </Button>
                <Button variant="outline" onClick={() => {
                  setFilterMonth('');
                  setFilterYear('');
                  fetchBonusPay(companyId);
                }}>
                  Reset
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Records Table */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Gift className="h-5 w-5 text-[#1a5c4c]" />
              Bonus Records
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
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-muted">
                      <TableHead>SSN</TableHead>
                      <TableHead>Employee Name</TableHead>
                      <TableHead>Period</TableHead>
                      <TableHead>Amount</TableHead>
                      <TableHead>Bonus Date</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {records.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={6} className="text-center text-muted-foreground py-8">
                          No bonus records found
                        </TableCell>
                      </TableRow>
                    ) : (
                      records.map((record) => (
                        <TableRow key={record.id}>
                          <TableCell className="font-mono">
                            {formatSSN(record.social_security_number)}
                          </TableCell>
                          <TableCell>{record.employee_name}</TableCell>
                          <TableCell>
                            {getMonthName(record.period_month)} {record.period_year}
                          </TableCell>
                          <TableCell className="font-medium">
                            {formatCurrency(record.bonus_amount || 0)}
                          </TableCell>
                          <TableCell>
                            {record.bonus_pay_date 
                              ? format(new Date(record.bonus_pay_date), 'dd-MMM-yyyy')
                              : '-'}
                          </TableCell>
                          <TableCell className="text-right">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleDelete(record.id)}
                              className="text-red-600 hover:text-red-700"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
