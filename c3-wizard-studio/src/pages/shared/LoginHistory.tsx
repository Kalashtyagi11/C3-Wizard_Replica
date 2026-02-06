import { useState, useEffect } from 'react';
import { DashboardLayout } from '@/components/layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
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
import { Search, Loader2, RefreshCw } from 'lucide-react';
import { useLoginHistory, LoginRecord } from '@/hooks/useLoginHistory';
import { format } from 'date-fns';
import { Badge } from '@/components/ui/badge';

export default function LoginHistory() {
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');
  
  const { loginHistory, isLoading, fetchLoginHistory } = useLoginHistory();

  useEffect(() => {
    fetchLoginHistory();
  }, [fetchLoginHistory]);

  const handleSearch = () => {
    fetchLoginHistory(fromDate || undefined, toDate || undefined);
  };

  const handleReset = () => {
    setFromDate('');
    setToDate('');
    fetchLoginHistory();
  };

  const getSuccessBadge = (success: boolean | null) => {
    return success 
      ? <Badge className="bg-green-600">Success</Badge>
      : <Badge className="bg-red-600">Failed</Badge>;
  };

  const formatDateTime = (dateStr: string | null) => {
    if (!dateStr) return '-';
    try {
      return format(new Date(dateStr), 'dd-MMM-yyyy HH:mm:ss');
    } catch {
      return dateStr;
    }
  };

  return (
    <DashboardLayout>
      <div className="mt-16 space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-[#1a5c4c]">Login History</h1>
          <Button variant="outline" onClick={() => fetchLoginHistory()}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="text-[#1a5c4c]">Search Filters</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="space-y-2">
                <Label>From Date</Label>
                <Input
                  type="date"
                  value={fromDate}
                  onChange={(e) => setFromDate(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label>To Date</Label>
                <Input
                  type="date"
                  value={toDate}
                  onChange={(e) => setToDate(e.target.value)}
                />
              </div>
              <div className="flex items-end gap-2 col-span-2">
                <Button onClick={handleSearch} className="bg-[#45a049] hover:bg-[#3d8b40]">
                  <Search className="h-4 w-4 mr-2" />
                  Search
                </Button>
                <Button variant="outline" onClick={handleReset}>
                  Reset
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-[#1a5c4c]">Login Records</CardTitle>
              <span className="text-sm text-muted-foreground">{loginHistory.length} records found</span>
            </div>
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
                      <TableHead>Date & Time</TableHead>
                      <TableHead>User / Login ID</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>IP Address</TableHead>
                      <TableHead>Logout Time</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {loginHistory.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={5} className="text-center text-muted-foreground py-8">
                          No login records found
                        </TableCell>
                      </TableRow>
                    ) : (
                      loginHistory.map((record: LoginRecord) => (
                        <TableRow key={record.id}>
                          <TableCell className="whitespace-nowrap">
                            {formatDateTime(record.login_time)}
                          </TableCell>
                          <TableCell>{record.username || '-'}</TableCell>
                          <TableCell>{getSuccessBadge(record.was_successful)}</TableCell>
                          <TableCell>{record.ip_address || '-'}</TableCell>
                          <TableCell>{formatDateTime(record.logout_time)}</TableCell>
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
