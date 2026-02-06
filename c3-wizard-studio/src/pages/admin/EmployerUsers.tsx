import { useState } from 'react';
import { DashboardLayout } from '@/components/layout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Users, Search, RefreshCw, Building2 } from 'lucide-react';
import { useEmployerUsers } from '@/hooks/useEmployerUsers';
import { format } from 'date-fns';

export default function AdminEmployerUsers() {
  const { users, isLoading, refetch } = useEmployerUsers();
  const [searchTerm, setSearchTerm] = useState('');

  const filteredUsers = users?.filter(user => {
    const search = searchTerm.toLowerCase();
    return (
      user.username?.toLowerCase().includes(search) ||
      user.email?.toLowerCase().includes(search) ||
      user.company_name?.toLowerCase().includes(search) ||
      user.registration_number?.toLowerCase().includes(search)
    );
  });

  return (
    <DashboardLayout>
      <div className="mt-16 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Employer Users</h1>
            <p className="text-muted-foreground">Manage users associated with employer accounts</p>
          </div>
          <Button variant="outline" onClick={() => refetch()} disabled={isLoading}>
            <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
        </div>

        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  Employer User List
                </CardTitle>
                <CardDescription>
                  {users?.length || 0} employer users registered
                </CardDescription>
              </div>
              <div className="relative w-64">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search users..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-9"
                />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="space-y-2">
                {[...Array(5)].map((_, i) => (
                  <Skeleton key={i} className="h-12 w-full" />
                ))}
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Username</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>
                      <div className="flex items-center gap-1">
                        <Building2 className="h-4 w-4" />
                        Company
                      </div>
                    </TableHead>
                    <TableHead>Reg Number</TableHead>
                    <TableHead>Last Login</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredUsers?.map((user) => (
                    <TableRow key={user.id}>
                      <TableCell className="font-mono text-sm">{user.username}</TableCell>
                      <TableCell>{user.email || '-'}</TableCell>
                      <TableCell>{user.company_name || '-'}</TableCell>
                      <TableCell className="font-mono text-sm">{user.registration_number || '-'}</TableCell>
                      <TableCell>
                        {user.last_login_at 
                          ? format(new Date(user.last_login_at), 'MMM d, yyyy HH:mm')
                          : 'Never'
                        }
                      </TableCell>
                      <TableCell>
                        <Badge variant={!user.is_deleted ? 'default' : 'secondary'}>
                          {!user.is_deleted ? 'Active' : 'Inactive'}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                  {filteredUsers?.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center text-muted-foreground py-8">
                        {searchTerm ? 'No users match your search' : 'No employer users found'}
                      </TableCell>
                    </TableRow>
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
