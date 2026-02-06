import { useState } from 'react';
import { DashboardLayout } from '@/components/layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Gift, Plus, Edit, Lock, Unlock } from 'lucide-react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import type { Database } from '@/integrations/supabase/types';

// Use database types directly
type DbBonusExemption = Database['public']['Tables']['c3_bonus_exemptions']['Row'];
type BonusExemption = DbBonusExemption;

export default function BonusSettings() {
  const queryClient = useQueryClient();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingRecord, setEditingRecord] = useState<BonusExemption | null>(null);
  const [formData, setFormData] = useState({
    year: new Date().getFullYear().toString(),
    month: '12',
    is_levy_exempted: true,
    is_employer_levy_exempted: false,
    is_severance_exempted: false,
    is_social_security_exempted: false,
  });

  const { data: exemptions = [], isLoading } = useQuery({
    queryKey: ['bonus-exemptions'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('c3_bonus_exemptions')
        .select('*')
        .order('year', { ascending: false });
      
      if (error) throw error;
      return data;
    },
  });

  const saveMutation = useMutation({
    mutationFn: async (data: Database['public']['Tables']['c3_bonus_exemptions']['Insert']) => {
      if (editingRecord) {
        const { error } = await supabase
          .from('c3_bonus_exemptions')
          .update(data)
          .eq('id', editingRecord.id);
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('c3_bonus_exemptions')
          .insert(data);
        if (error) throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['bonus-exemptions'] });
      toast.success(editingRecord ? 'Exemption updated' : 'Exemption created');
      handleCloseDialog();
    },
    onError: (error) => {
      toast.error('Failed to save: ' + (error as Error).message);
    },
  });

  const handleOpenDialog = (record?: BonusExemption) => {
    if (record) {
      setEditingRecord(record);
      setFormData({
        year: record.year?.toString() || new Date().getFullYear().toString(),
        month: record.month?.toString() || '12',
        is_levy_exempted: record.is_levy_exempted ?? true,
        is_employer_levy_exempted: record.is_employer_levy_exempted ?? false,
        is_severance_exempted: record.is_severance_exempted ?? false,
        is_social_security_exempted: record.is_social_security_exempted ?? false,
      });
    } else {
      setEditingRecord(null);
      setFormData({
        year: new Date().getFullYear().toString(),
        month: '12',
        is_levy_exempted: true,
        is_employer_levy_exempted: false,
        is_severance_exempted: false,
        is_social_security_exempted: false,
      });
    }
    setIsDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    setEditingRecord(null);
  };

  const handleSubmit = () => {
    const data: Database['public']['Tables']['c3_bonus_exemptions']['Insert'] = {
      year: parseInt(formData.year),
      month: parseInt(formData.month),
      is_levy_exempted: formData.is_levy_exempted,
      is_employer_levy_exempted: formData.is_employer_levy_exempted,
      is_severance_exempted: formData.is_severance_exempted,
      is_social_security_exempted: formData.is_social_security_exempted,
      created_at: new Date().toISOString(),
    };
    saveMutation.mutate(data);
  };

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  return (
    <DashboardLayout>
      <div className="mt-16 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Bonus Settings</h1>
            <p className="text-muted-foreground">Configure December bonus exemption thresholds by year</p>
          </div>
          <Button onClick={() => handleOpenDialog()}>
            <Plus className="h-4 w-4 mr-2" />
            Add Exemption Year
          </Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Gift className="h-5 w-5" />
              Bonus Exemption Configuration
            </CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="text-center py-8">Loading exemptions...</div>
            ) : exemptions.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                No bonus exemption configurations found. Add one to get started.
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Year</TableHead>
                    <TableHead>Month</TableHead>
                    <TableHead>Levy Exempt</TableHead>
                    <TableHead>Employer Levy Exempt</TableHead>
                    <TableHead>Severance Exempt</TableHead>
                    <TableHead>SS Exempt</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {exemptions.map((record) => (
                    <TableRow key={record.id}>
                      <TableCell className="font-medium">{record.year}</TableCell>
                      <TableCell>{record.month ? monthNames[record.month - 1] : '-'}</TableCell>
                      <TableCell>
                        <Badge variant={record.is_levy_exempted ? 'default' : 'outline'}>
                          {record.is_levy_exempted ? 'Yes' : 'No'}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant={record.is_employer_levy_exempted ? 'default' : 'outline'}>
                          {record.is_employer_levy_exempted ? 'Yes' : 'No'}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant={record.is_severance_exempted ? 'default' : 'outline'}>
                          {record.is_severance_exempted ? 'Yes' : 'No'}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant={record.is_social_security_exempted ? 'default' : 'outline'}>
                          {record.is_social_security_exempted ? 'Yes' : 'No'}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {record.is_locked ? (
                          <Badge variant="secondary" className="gap-1">
                            <Lock className="h-3 w-3" /> Locked
                          </Badge>
                        ) : (
                          <Badge variant="outline" className="gap-1">
                            <Unlock className="h-3 w-3" /> Active
                          </Badge>
                        )}
                      </TableCell>
                      <TableCell>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleOpenDialog(record)}
                          disabled={record.is_locked ?? false}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}

            <div className="mt-4 p-4 bg-muted rounded-lg">
              <h4 className="font-medium mb-2">December Bonus Exemption Rules:</h4>
              <p className="text-sm text-muted-foreground">
                When enabled, employees who earn less than $28,000 annually will be exempt from 
                employee levy on their December bonus. This is typically applied only to the 
                December period (month 12) each year.
              </p>
            </div>
          </CardContent>
        </Card>

        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {editingRecord ? 'Edit Bonus Exemption' : 'Add Bonus Exemption Year'}
              </DialogTitle>
            </DialogHeader>
            
            <div className="space-y-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Year</Label>
                  <Input
                    type="number"
                    value={formData.year}
                    onChange={(e) => setFormData({ ...formData, year: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Month</Label>
                  <Input
                    type="number"
                    min="1"
                    max="12"
                    value={formData.month}
                    onChange={(e) => setFormData({ ...formData, month: e.target.value })}
                  />
                </div>
              </div>

              <div className="space-y-4 border-t pt-4">
                <h4 className="font-medium">Exemption Settings</h4>
                
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Employee Levy Exempt</Label>
                    <p className="text-sm text-muted-foreground">Exempt employee portion of levy</p>
                  </div>
                  <Switch
                    checked={formData.is_levy_exempted}
                    onCheckedChange={(checked) => setFormData({ ...formData, is_levy_exempted: checked })}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label>Employer Levy Exempt</Label>
                    <p className="text-sm text-muted-foreground">Exempt employer portion of levy</p>
                  </div>
                  <Switch
                    checked={formData.is_employer_levy_exempted}
                    onCheckedChange={(checked) => setFormData({ ...formData, is_employer_levy_exempted: checked })}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label>Severance Exempt</Label>
                    <p className="text-sm text-muted-foreground">Exempt from severance contribution</p>
                  </div>
                  <Switch
                    checked={formData.is_severance_exempted}
                    onCheckedChange={(checked) => setFormData({ ...formData, is_severance_exempted: checked })}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label>Social Security Exempt</Label>
                    <p className="text-sm text-muted-foreground">Exempt from social security contribution</p>
                  </div>
                  <Switch
                    checked={formData.is_social_security_exempted}
                    onCheckedChange={(checked) => setFormData({ ...formData, is_social_security_exempted: checked })}
                  />
                </div>
              </div>
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={handleCloseDialog}>
                Cancel
              </Button>
              <Button onClick={handleSubmit} disabled={saveMutation.isPending}>
                {saveMutation.isPending ? 'Saving...' : 'Save'}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </DashboardLayout>
  );
}
