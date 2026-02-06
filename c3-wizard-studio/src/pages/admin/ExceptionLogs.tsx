import { useState } from 'react';
import { DashboardLayout } from '@/components/layout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { AlertTriangle, Search, RefreshCw, Bug, Server } from 'lucide-react';
import { useExceptionLogs } from '@/hooks/useExceptionLogs';
import { format } from 'date-fns';

export default function ExceptionLogs() {
  const { logs, customLogs, isLoading, refetch } = useExceptionLogs(200);
  const [searchTerm, setSearchTerm] = useState('');

  const filteredLogs = logs?.filter(log => {
    const search = searchTerm.toLowerCase();
    return log.error_description?.toLowerCase().includes(search);
  });

  const filteredCustomLogs = customLogs?.filter(log => {
    const search = searchTerm.toLowerCase();
    return (
      log.error_message?.toLowerCase().includes(search) ||
      log.controller_name?.toLowerCase().includes(search)
    );
  });

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Exception Logs</h1>
            <p className="text-muted-foreground">View and analyze system exceptions and errors</p>
          </div>
          <Button variant="outline" onClick={() => refetch()} disabled={isLoading}>
            <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
        </div>

        <Tabs defaultValue="exceptions">
          <TabsList>
            <TabsTrigger value="exceptions" className="flex items-center gap-2">
              <AlertTriangle className="h-4 w-4" />
              Exception Logs ({logs?.length || 0})
            </TabsTrigger>
            <TabsTrigger value="errors" className="flex items-center gap-2">
              <Bug className="h-4 w-4" />
              Custom Error Logs ({customLogs?.length || 0})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="exceptions">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      <Server className="h-5 w-5" />
                      System Exceptions
                    </CardTitle>
                    <CardDescription>
                      Runtime exceptions from the application
                    </CardDescription>
                  </div>
                  <div className="relative w-64">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search errors..."
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
                      <Skeleton key={i} className="h-16 w-full" />
                    ))}
                  </div>
                ) : filteredLogs?.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-12 text-center">
                    <AlertTriangle className="h-12 w-12 text-muted-foreground/50 mb-4" />
                    <p className="text-lg font-medium text-muted-foreground">No exceptions logged</p>
                    <p className="text-sm text-muted-foreground">The system is running without errors</p>
                  </div>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-[100px]">ID</TableHead>
                        <TableHead>Error Description</TableHead>
                        <TableHead>User ID</TableHead>
                        <TableHead>Company ID</TableHead>
                        <TableHead>Type</TableHead>
                        <TableHead>Date</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredLogs?.map((log) => (
                        <TableRow key={log.id}>
                          <TableCell className="font-mono text-sm">{log.id}</TableCell>
                          <TableCell className="max-w-md">
                            <p className="text-sm text-destructive line-clamp-2">
                              {log.error_description || 'No description'}
                            </p>
                          </TableCell>
                          <TableCell>{log.user_id || '-'}</TableCell>
                          <TableCell>{log.company_id || '-'}</TableCell>
                          <TableCell>
                            <Badge variant={log.is_self_employed ? 'outline' : 'secondary'}>
                              {log.is_self_employed ? 'Self-Employed' : 'Employer'}
                            </Badge>
                          </TableCell>
                          <TableCell className="whitespace-nowrap">
                            {log.created_at 
                              ? format(new Date(log.created_at), 'MMM d, yyyy HH:mm')
                              : '-'
                            }
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="errors">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      <Bug className="h-5 w-5" />
                      Custom Error Logs
                    </CardTitle>
                    <CardDescription>
                      Application-level error tracking
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <div className="space-y-2">
                    {[...Array(5)].map((_, i) => (
                      <Skeleton key={i} className="h-16 w-full" />
                    ))}
                  </div>
                ) : filteredCustomLogs?.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-12 text-center">
                    <Bug className="h-12 w-12 text-muted-foreground/50 mb-4" />
                    <p className="text-lg font-medium text-muted-foreground">No custom errors logged</p>
                  </div>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-[80px]">ID</TableHead>
                        <TableHead>Controller</TableHead>
                        <TableHead>Method</TableHead>
                        <TableHead>Error Message</TableHead>
                        <TableHead>Date</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredCustomLogs?.map((log) => (
                        <TableRow key={log.id}>
                          <TableCell className="font-mono text-sm">{log.id}</TableCell>
                          <TableCell className="font-mono text-sm">{log.controller_name || '-'}</TableCell>
                          <TableCell className="font-mono text-sm">{log.method_name || '-'}</TableCell>
                          <TableCell className="max-w-md">
                            <p className="text-sm text-destructive line-clamp-2">
                              {log.error_message || 'No message'}
                            </p>
                          </TableCell>
                          <TableCell className="whitespace-nowrap">
                            {log.logged_at 
                              ? format(new Date(log.logged_at), 'MMM d, yyyy HH:mm')
                              : '-'
                            }
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
}
