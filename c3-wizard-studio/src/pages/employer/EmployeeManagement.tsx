/**
 * Employee Management Page
 * Full CRUD connected to c3_employees table
 */

import { useState } from 'react';
import { DashboardLayout } from '@/components/layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Users, Plus, Search, Edit, Trash2 } from 'lucide-react';
import { useEmployees, Employee } from '@/hooks/useEmployees';
import { AddEditEmployeeDialog } from '@/components/employer/AddEditEmployeeDialog';
import { DeleteEmployeeDialog } from '@/components/employer/DeleteEmployeeDialog';
import { Skeleton } from '@/components/ui/skeleton';
import { toast } from 'sonner';

export default function EmployeeManagement() {
  const { employees, isLoading, error, addEmployee, updateEmployee, deleteEmployee } = useEmployees();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [payPeriodFilter, setPayPeriodFilter] = useState<string>('all');
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  // Filter employees
  const filteredEmployees = employees.filter((emp) => {
    const matchesSearch =
      searchTerm === '' ||
      `${emp.first_name} ${emp.last_name}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
      emp.social_security_number?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      emp.employee_code?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus =
      statusFilter === 'all' ||
      (statusFilter === 'active' && !emp.is_deleted) ||
      (statusFilter === 'inactive' && emp.is_deleted);

    const matchesPayPeriod =
      payPeriodFilter === 'all' || emp.pay_period === payPeriodFilter;

    return matchesSearch && matchesStatus && matchesPayPeriod;
  });

  const handleAddEmployee = async (data: Partial<Employee>) => {
    const result = await addEmployee(data);
    if (result.error) {
      toast.error(result.error);
    } else {
      toast.success('Employee added successfully');
      setIsAddDialogOpen(false);
    }
  };

  const handleUpdateEmployee = async (data: Partial<Employee>) => {
    if (!selectedEmployee) return;
    const result = await updateEmployee(selectedEmployee.id, data);
    if (result.error) {
      toast.error(result.error);
    } else {
      toast.success('Employee updated successfully');
      setIsEditDialogOpen(false);
      setSelectedEmployee(null);
    }
  };

  const handleDeleteEmployee = async () => {
    if (!selectedEmployee) return;
    const result = await deleteEmployee(selectedEmployee.id);
    if (result.error) {
      toast.error(result.error);
    } else {
      toast.success('Employee deactivated successfully');
      setIsDeleteDialogOpen(false);
      setSelectedEmployee(null);
    }
  };

  const formatSSN = (ssn: string | null) => {
    if (!ssn) return '---';
    // Mask SSN: show only last 4 digits
    if (ssn.length >= 4) {
      return `XXX-XX-${ssn.slice(-4)}`;
    }
    return ssn;
  };

  const getPayPeriodLabel = (code: string | null) => {
    const labels: Record<string, string> = {
      'W': 'Weekly',
      'E2W': 'Bi-Weekly',
      'M': 'Monthly',
      '2M': 'Twice Monthly',
    };
    return labels[code || ''] || code || 'N/A';
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Employee Management</h1>
            <p className="text-muted-foreground">
              Manage your company's employees
            </p>
          </div>
          <Button onClick={() => setIsAddDialogOpen(true)} className="gap-2">
            <Plus className="h-4 w-4" />
            Add Employee
          </Button>
        </div>

        {/* Filters */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex flex-col gap-4 md:flex-row md:items-center">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search by name, SSN, or employee code..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-9"
                />
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-[150px]">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                </SelectContent>
              </Select>
              <Select value={payPeriodFilter} onValueChange={setPayPeriodFilter}>
                <SelectTrigger className="w-[150px]">
                  <SelectValue placeholder="Pay Period" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Periods</SelectItem>
                  <SelectItem value="W">Weekly</SelectItem>
                  <SelectItem value="E2W">Bi-Weekly</SelectItem>
                  <SelectItem value="M">Monthly</SelectItem>
                  <SelectItem value="2M">Twice Monthly</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Employee Table */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Employees ({filteredEmployees.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="space-y-2">
                {[1, 2, 3, 4, 5].map((i) => (
                  <Skeleton key={i} className="h-12 w-full" />
                ))}
              </div>
            ) : error ? (
              <div className="text-center py-8 text-destructive">
                {error}
              </div>
            ) : filteredEmployees.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                {employees.length === 0
                  ? 'No employees found. Add your first employee!'
                  : 'No employees match your search criteria.'}
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>SSN</TableHead>
                      <TableHead>Name</TableHead>
                      <TableHead>Department</TableHead>
                      <TableHead>Pay Period</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredEmployees.map((emp) => (
                      <TableRow key={emp.id}>
                        <TableCell className="font-mono">
                          {formatSSN(emp.social_security_number)}
                        </TableCell>
                        <TableCell>
                          <div>
                            <p className="font-medium">
                              {emp.first_name} {emp.middle_name ? `${emp.middle_name} ` : ''}{emp.last_name}
                            </p>
                            <p className="text-sm text-muted-foreground">
                              {emp.email || emp.employee_code || 'No email'}
                            </p>
                          </div>
                        </TableCell>
                        <TableCell>{emp.department || 'N/A'}</TableCell>
                        <TableCell>{getPayPeriodLabel(emp.pay_period)}</TableCell>
                        <TableCell>
                          <Badge variant={!emp.is_deleted ? 'default' : 'secondary'}>
                            {!emp.is_deleted ? 'Active' : 'Inactive'}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => {
                                setSelectedEmployee(emp);
                                setIsEditDialogOpen(true);
                              }}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => {
                                setSelectedEmployee(emp);
                                setIsDeleteDialogOpen(true);
                              }}
                            >
                              <Trash2 className="h-4 w-4 text-destructive" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Add Employee Dialog */}
        <AddEditEmployeeDialog
          open={isAddDialogOpen}
          onOpenChange={setIsAddDialogOpen}
          onSave={handleAddEmployee}
          mode="add"
        />

        {/* Edit Employee Dialog */}
        <AddEditEmployeeDialog
          open={isEditDialogOpen}
          onOpenChange={setIsEditDialogOpen}
          onSave={handleUpdateEmployee}
          employee={selectedEmployee}
          mode="edit"
        />

        {/* Delete Confirmation Dialog */}
        <DeleteEmployeeDialog
          open={isDeleteDialogOpen}
          onOpenChange={setIsDeleteDialogOpen}
          onConfirm={handleDeleteEmployee}
          employee={selectedEmployee}
        />
      </div>
    </DashboardLayout>
  );
}
