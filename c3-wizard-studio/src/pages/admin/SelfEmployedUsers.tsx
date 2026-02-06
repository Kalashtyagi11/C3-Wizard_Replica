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
import { Search, Power, Edit, UserCircle, Loader2 } from 'lucide-react';
import { useSelfEmployedProfiles } from '@/hooks/useSelfEmployedProfiles';

export default function AdminSelfEmployedUsers() {
  const { profiles, isLoading, updateProfile } = useSelfEmployedProfiles();
  const [searchTerm, setSearchTerm] = useState('');

  const filteredProfiles = profiles.filter(
    (profile) =>
      profile.ssn.toLowerCase().includes(searchTerm.toLowerCase()) ||
      profile.first_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      profile.last_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      profile.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleToggleStatus = async (profile: typeof profiles[0]) => {
    await updateProfile(profile.id, { is_active: !profile.is_active });
  };

  return (
    <DashboardLayout>
      <div className="mt-16 space-y-6">
        <h1 className="text-2xl font-bold">Self-Employed Users</h1>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <UserCircle className="h-5 w-5" />
                <span>Self-Employed User List</span>
              </div>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search by SSN, name, or email"
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
                    <TableHead>Name</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Mobile</TableHead>
                    <TableHead>Business Name</TableHead>
                    <TableHead>Occupation</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Created</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredProfiles.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={9} className="text-center text-muted-foreground">
                        No self-employed users found
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredProfiles.map((profile) => (
                      <TableRow key={profile.id}>
                        <TableCell className="font-medium">{profile.ssn}</TableCell>
                        <TableCell>
                          {profile.first_name} {profile.last_name}
                        </TableCell>
                        <TableCell>{profile.email || '-'}</TableCell>
                        <TableCell>{profile.mobile || '-'}</TableCell>
                        <TableCell>{profile.business_name || '-'}</TableCell>
                        <TableCell>{profile.occupation || '-'}</TableCell>
                        <TableCell>
                          <Badge variant={profile.is_active ? 'default' : 'secondary'}>
                            {profile.is_active ? 'Active' : 'Inactive'}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          {profile.created_at
                            ? new Date(profile.created_at).toLocaleDateString()
                            : '-'}
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1">
                            <Button variant="ghost" size="icon">
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleToggleStatus(profile)}
                            >
                              <Power className="h-4 w-4" />
                            </Button>
                          </div>
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
