import { DashboardLayout } from '@/components/layout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Users, UserCog, Building2 } from 'lucide-react';
import { useEmployerCompany } from '@/hooks/useEmployerCompany';
import { useAuth } from '@/hooks/useAuth';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { format } from 'date-fns';

export default function Administration() {
  const { user } = useAuth();
  
  // Get company_id from c3_users by email
  const { data: currentUser } = useQuery({
    queryKey: ['current-user', user?.email],
    queryFn: async () => {
      if (!user?.email) return null;
      const { data } = await supabase
        .from('c3_users')
        .select('company_id')
        .eq('email', user.email)
        .maybeSingle();
      return data;
    },
    enabled: !!user?.email,
  });
  
  const companyId = currentUser?.company_id || undefined;
  
  const { company, companyUsers, isLoading } = useEmployerCompany(companyId);

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Administration</h1>
          <p className="text-muted-foreground">
            Manage company users and settings
          </p>
        </div>

        <Tabs defaultValue="users">
          <TabsList>
            <TabsTrigger value="users" className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              Company Users
            </TabsTrigger>
            <TabsTrigger value="settings" className="flex items-center gap-2">
              <UserCog className="h-4 w-4" />
              Settings
            </TabsTrigger>
          </TabsList>

          <TabsContent value="users" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Company Users</CardTitle>
                <CardDescription>
                  Users who have access to your company's portal
                </CardDescription>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <div className="space-y-2">
                    {[...Array(3)].map((_, i) => (
                      <Skeleton key={i} className="h-12 w-full" />
                    ))}
                  </div>
                ) : companyUsers?.length === 0 ? (
                  <div className="py-8 text-center">
                    <Users className="h-12 w-12 mx-auto text-muted-foreground/50 mb-4" />
                    <p className="text-muted-foreground">No users found for this company</p>
                  </div>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Username</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead>Last Login</TableHead>
                        <TableHead>Status</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {companyUsers?.map((user) => (
                        <TableRow key={user.id}>
                          <TableCell className="font-medium">{user.username}</TableCell>
                          <TableCell>{user.email || '-'}</TableCell>
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
                    </TableBody>
                  </Table>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="settings" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Company Information</CardTitle>
                <CardDescription>
                  View your company details
                </CardDescription>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <div className="space-y-4">
                    <Skeleton className="h-6 w-48" />
                    <Skeleton className="h-6 w-64" />
                    <Skeleton className="h-6 w-32" />
                  </div>
                ) : company ? (
                  <div className="grid gap-6 md:grid-cols-2">
                    <div className="space-y-4">
                      <div>
                        <p className="text-sm text-muted-foreground">Company Name</p>
                        <p className="font-medium">{company.company_name}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Trade Name</p>
                        <p className="font-medium">{company.trade_name || '-'}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Registration Number</p>
                        <p className="font-mono">{company.registration_number || '-'}</p>
                      </div>
                    </div>
                    <div className="space-y-4">
                      <div>
                        <p className="text-sm text-muted-foreground">Contact Person</p>
                        <p className="font-medium">{company.contact_person || '-'}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Email</p>
                        <p className="font-medium">{company.email || '-'}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Status</p>
                        <div className="flex gap-2 mt-1">
                          <Badge variant={!company.is_deleted ? 'default' : 'secondary'}>
                            {!company.is_deleted ? 'Active' : 'Inactive'}
                          </Badge>
                          {company.is_levy_exempt && (
                            <Badge variant="outline">Levy Exempt</Badge>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="py-8 text-center">
                    <Building2 className="h-12 w-12 mx-auto text-muted-foreground/50 mb-4" />
                    <p className="text-muted-foreground">No company information available</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
}
