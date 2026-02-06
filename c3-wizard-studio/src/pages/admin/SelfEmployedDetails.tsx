import { useState } from 'react';
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
import { Search, Edit, Users, Loader2, UserCircle } from 'lucide-react';
import { useSelfEmployedProfiles } from '@/hooks/useSelfEmployedProfiles';
import { format } from 'date-fns';

export default function AdminSelfEmployedDetails() {
  const { profiles, isLoading } = useSelfEmployedProfiles();
  const [searchTerm, setSearchTerm] = useState('');

  const filteredProfiles = profiles.filter(
    (profile) =>
      profile.ssn.toLowerCase().includes(searchTerm.toLowerCase()) ||
      profile.first_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      profile.last_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      profile.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <DashboardLayout>
      <div className="mt-16 space-y-6">
        <h1 className="text-2xl font-bold">Self Employed Details</h1>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <UserCircle className="h-5 w-5" />
                <span>Self Employed List</span>
              </div>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search by self employer name or SSN"
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
                    <TableHead>SSN</TableHead>
                    <TableHead>C3 Reg. Date</TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Mobile</TableHead>
                    <TableHead>Business Name</TableHead>
                    <TableHead>User Status</TableHead>
                    <TableHead>Edit</TableHead>
                    <TableHead>Users</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredProfiles.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={9} className="text-center text-muted-foreground">
                        No self-employed found
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredProfiles.map((profile) => (
                      <TableRow key={profile.id}>
                        <TableCell className="font-medium">{profile.ssn}</TableCell>
                        <TableCell>
                          {profile.created_at
                            ? format(new Date(profile.created_at), 'dd-MMM-yyyy')
                            : '-'}
                        </TableCell>
                        <TableCell>
                          {profile.first_name} {profile.last_name}
                        </TableCell>
                        <TableCell>{profile.email || '-'}</TableCell>
                        <TableCell>{profile.mobile || '-'}</TableCell>
                        <TableCell>{profile.business_name || '-'}</TableCell>
                        <TableCell>
                          <Badge variant={profile.is_active ? 'default' : 'secondary'}>
                            {profile.is_active ? 'Active' : 'Inactive'}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Button variant="ghost" size="icon">
                            <Edit className="h-4 w-4" />
                          </Button>
                        </TableCell>
                        <TableCell>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => window.location.href = '/admin/users/self-employed'}
                          >
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
