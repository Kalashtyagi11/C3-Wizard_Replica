import { useState, useEffect } from 'react';
import { DashboardLayout } from '@/components/layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Search, Edit, Users, Building2, Loader2 } from 'lucide-react';
import { useCompanies } from '@/hooks/useCompanies';
import { format } from 'date-fns';

export default function AdminEmployerDetails() {
  const { companies, isLoading, fetchCompanies } = useCompanies();
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchCompanies();
  }, [fetchCompanies]);

  const filteredCompanies = companies.filter(
    (company) =>
      (company.company_name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (company.registration_number || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (company.email || '').toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <DashboardLayout>
      <div className="mt-16 space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">Employer Details</h1>
          <Button variant="outline" onClick={() => window.location.href = '/admin/companies'}>
            <Building2 className="h-4 w-4 mr-2" />
            Company Management
          </Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Employer List</span>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search by employer name or reg number"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 w-80"
                />
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Registration No.</TableHead>
                    <TableHead>C3 Reg. Date</TableHead>
                    <TableHead>Employer Name</TableHead>
                    <TableHead>Trade Name</TableHead>
                    <TableHead>Phone</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Edit</TableHead>
                    <TableHead>Users</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredCompanies.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={9} className="text-center text-muted-foreground">
                        No employers found
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredCompanies.map((company) => (
                      <TableRow key={company.id}>
                        <TableCell className="font-medium">{company.registration_number || '-'}</TableCell>
                        <TableCell>
                          {company.registration_date
                            ? format(new Date(company.registration_date), 'dd-MMM-yyyy')
                            : '-'}
                        </TableCell>
                        <TableCell>{company.company_name}</TableCell>
                        <TableCell>{company.trade_name || '-'}</TableCell>
                        <TableCell>{company.mobile || company.phone || '-'}</TableCell>
                        <TableCell>{company.email || '-'}</TableCell>
                        <TableCell>
                          <Badge variant={!company.is_deleted ? 'default' : 'secondary'}>
                            {!company.is_deleted ? 'Active' : 'Inactive'}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Button variant="ghost" size="icon" onClick={() => window.location.href = '/admin/companies'}>
                            <Edit className="h-4 w-4" />
                          </Button>
                        </TableCell>
                        <TableCell>
                          <Button variant="ghost" size="icon" onClick={() => window.location.href = '/admin/users/employer'}>
                            <Users className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
