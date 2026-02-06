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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Search, Loader2, RefreshCw } from 'lucide-react';
import { useAuditLogs, AuditLog } from '@/hooks/useAuditLogs';
import { format } from 'date-fns';
import { Badge } from '@/components/ui/badge';

export default function AuditTrail() {
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');
  const [selectedTable, setSelectedTable] = useState('');
  const [selectedAction, setSelectedAction] = useState('');
  
  const { logs, isLoading, fetchLogs } = useAuditLogs();

  useEffect(() => {
    fetchLogs();
  }, [fetchLogs]);

  const handleSearch = () => {
    fetchLogs(
      fromDate || undefined,
      toDate || undefined,
      selectedTable || undefined,
      selectedAction || undefined
    );
  };

  const handleReset = () => {
    setFromDate('');
    setToDate('');
    setSelectedTable('');
    setSelectedAction('');
    fetchLogs();
  };

  const getActionBadge = (action: string | null) => {
    if (!action) return <Badge variant="outline">Unknown</Badge>;
    
    const lowerAction = action.toLowerCase();
    if (lowerAction.includes('create') || lowerAction.includes('insert') || lowerAction.includes('add')) {
      return <Badge className="bg-green-600">{action}</Badge>;
    }
    if (lowerAction.includes('update') || lowerAction.includes('edit') || lowerAction.includes('modify')) {
      return <Badge className="bg-blue-600">{action}</Badge>;
    }
    if (lowerAction.includes('delete') || lowerAction.includes('remove')) {
      return <Badge className="bg-red-600">{action}</Badge>;
    }
    return <Badge variant="outline">{action}</Badge>;
  };

  const formatDateTime = (dateStr: string | null) => {
    if (!dateStr) return '-';
    try {
      return format(new Date(dateStr), 'dd-MMM-yyyy HH:mm:ss');
    } catch {
      return dateStr;
    }
  };

  // Get unique tables and actions for filters
  const uniqueTables = [...new Set(logs.map(l => l.table_name).filter(Boolean))];
  const uniqueActions = [...new Set(logs.map(l => l.action).filter(Boolean))];

  return (
    <DashboardLayout>
      <div className="mt-16 space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-[#1a5c4c]">Audit Trail</h1>
          <Button variant="outline" onClick={() => fetchLogs()}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="text-[#1a5c4c]">Search Filters</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
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
              <div className="space-y-2">
                <Label>Table</Label>
                <Select value={selectedTable} onValueChange={setSelectedTable}>
                  <SelectTrigger>
                    <SelectValue placeholder="All Tables" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">All Tables</SelectItem>
                    {uniqueTables.map(table => (
                      <SelectItem key={table} value={table!}>{table}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Action</Label>
                <Select value={selectedAction} onValueChange={setSelectedAction}>
                  <SelectTrigger>
                    <SelectValue placeholder="All Actions" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">All Actions</SelectItem>
                    {uniqueActions.map(action => (
                      <SelectItem key={action} value={action!}>{action}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-end gap-2">
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
              <CardTitle className="text-[#1a5c4c]">Audit Records</CardTitle>
              <span className="text-sm text-muted-foreground">{logs.length} records found</span>
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
                      <TableHead>User</TableHead>
                      <TableHead>Action</TableHead>
                      <TableHead>Table</TableHead>
                      <TableHead>Column</TableHead>
                      <TableHead>Old Value</TableHead>
                      <TableHead>New Value</TableHead>
                      <TableHead>IP Address</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {logs.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={8} className="text-center text-muted-foreground py-8">
                          No audit records found
                        </TableCell>
                      </TableRow>
                    ) : (
                      logs.map((record: AuditLog) => (
                        <TableRow key={record.id}>
                          <TableCell className="whitespace-nowrap">
                            {formatDateTime(record.created_at)}
                          </TableCell>
                          <TableCell>{record.username || '-'}</TableCell>
                          <TableCell>{getActionBadge(record.action)}</TableCell>
                          <TableCell>{record.table_name || '-'}</TableCell>
                          <TableCell>{record.column_name || '-'}</TableCell>
                          <TableCell className="max-w-32 truncate" title={record.old_value || ''}>
                            {record.old_value || '-'}
                          </TableCell>
                          <TableCell className="max-w-32 truncate" title={record.new_value || ''}>
                            {record.new_value || '-'}
                          </TableCell>
                          <TableCell>{record.ip_address || '-'}</TableCell>
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
