import { useState } from 'react';
import { DashboardLayout } from '@/components/layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Settings, Plus, Edit, Lock, Unlock } from 'lucide-react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { format } from 'date-fns';
import type { Database } from '@/integrations/supabase/types';

// Use database types directly
type DbSystemRate = Database['public']['Tables']['c3_system_rates']['Row'];

export default function AdminSystemRates() {
  const queryClient = useQueryClient();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingRate, setEditingRate] = useState<DbSystemRate | null>(null);
  const [formData, setFormData] = useState({
    employee_rate: '',
    employer_rate: '',
    eib_rate: '',
    severance_rate: '',
    bonus_levy_rate: '',
    fine_rate: '',
    additional_fine_rate: '',
    penalty_rate: '',
    additional_penalty_rate: '',
    min_age: '',
    max_age: '',
    effective_from: '',
    effective_to: '',
  });

  const { data: rates = [], isLoading } = useQuery({
    queryKey: ['system-rates'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('c3_system_rates')
        .select('*')
        .order('effective_from', { ascending: false });
      
      if (error) throw error;
      return data;
    },
  });

  const saveMutation = useMutation({
    mutationFn: async (data: Database['public']['Tables']['c3_system_rates']['Insert']) => {
      if (editingRate) {
        const { error } = await supabase
          .from('c3_system_rates')
          .update(data)
          .eq('id', editingRate.id);
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('c3_system_rates')
          .insert(data);
        if (error) throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['system-rates'] });
      toast.success(editingRate ? 'Rate updated' : 'Rate created');
      handleCloseDialog();
    },
    onError: (error) => {
      toast.error('Failed to save: ' + (error as Error).message);
    },
  });

  const handleOpenDialog = (rate?: DbSystemRate) => {
    if (rate) {
      setEditingRate(rate);
      setFormData({
        employee_rate: rate.employee_rate?.toString() || '',
        employer_rate: rate.employer_rate?.toString() || '',
        eib_rate: rate.eib_rate?.toString() || '',
        severance_rate: rate.severance_rate?.toString() || '',
        bonus_levy_rate: rate.bonus_levy_rate?.toString() || '',
        fine_rate: rate.fine_rate?.toString() || '',
        additional_fine_rate: rate.additional_fine_rate?.toString() || '',
        penalty_rate: rate.penalty_rate?.toString() || '',
        additional_penalty_rate: rate.additional_penalty_rate?.toString() || '',
        min_age: rate.min_age?.toString() || '',
        max_age: rate.max_age?.toString() || '',
        effective_from: rate.effective_from ? format(new Date(rate.effective_from), 'yyyy-MM-dd') : '',
        effective_to: rate.effective_to ? format(new Date(rate.effective_to), 'yyyy-MM-dd') : '',
      });
    } else {
      setEditingRate(null);
      setFormData({
        employee_rate: '5',
        employer_rate: '5',
        eib_rate: '1',
        severance_rate: '5',
        bonus_levy_rate: '0',
        fine_rate: '0',
        additional_fine_rate: '0',
        penalty_rate: '0',
        additional_penalty_rate: '0',
        min_age: '16',
        max_age: '62',
        effective_from: format(new Date(), 'yyyy-MM-dd'),
        effective_to: '',
      });
    }
    setIsDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    setEditingRate(null);
  };

  const handleSubmit = () => {
    const data: Database['public']['Tables']['c3_system_rates']['Insert'] = {
      rate_type: 'standard',
      effective_from: formData.effective_from || new Date().toISOString(),
      effective_to: formData.effective_to || null,
      employee_rate: parseFloat(formData.employee_rate) || 0,
      employer_rate: parseFloat(formData.employer_rate) || 0,
      eib_rate: parseFloat(formData.eib_rate) || 0,
      severance_rate: parseFloat(formData.severance_rate) || 0,
      bonus_levy_rate: parseFloat(formData.bonus_levy_rate) || 0,
      fine_rate: parseFloat(formData.fine_rate) || 0,
      additional_fine_rate: parseFloat(formData.additional_fine_rate) || 0,
      penalty_rate: parseFloat(formData.penalty_rate) || 0,
      additional_penalty_rate: parseFloat(formData.additional_penalty_rate) || 0,
      min_age: parseInt(formData.min_age) || 16,
      max_age: parseInt(formData.max_age) || 62,
    };
    saveMutation.mutate(data);
  };

  return (
    <DashboardLayout>
      <div className="mt-16 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">System Rates Configuration</h1>
            <p className="text-muted-foreground">Manage contribution rates and penalties</p>
          </div>
          <Button onClick={() => handleOpenDialog()}>
            <Plus className="h-4 w-4 mr-2" />
            Add Rate Period
          </Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="h-5 w-5" />
              Rate Configuration History
            </CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="text-center py-8">Loading rates...</div>
            ) : rates.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                No rate configurations found. Add one to get started.
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Period</TableHead>
                    <TableHead>SS (EE/ER)</TableHead>
                    <TableHead>EIB</TableHead>
                    <TableHead>Severance</TableHead>
                    <TableHead>Age Range</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {rates.map((rate) => (
                    <TableRow key={rate.id}>
                      <TableCell>
                        {rate.effective_from ? format(new Date(rate.effective_from), 'MMM yyyy') : 'N/A'} 
                        {' - '}
                        {rate.effective_to ? format(new Date(rate.effective_to), 'MMM yyyy') : 'Present'}
                      </TableCell>
                      <TableCell>
                        {rate.employee_rate}% / {rate.employer_rate}%
                      </TableCell>
                      <TableCell>{rate.eib_rate}%</TableCell>
                      <TableCell>{rate.severance_rate}%</TableCell>
                      <TableCell>{rate.min_age} - {rate.max_age}</TableCell>
                      <TableCell>
                        {rate.is_locked ? (
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
                          onClick={() => handleOpenDialog(rate)}
                          disabled={rate.is_locked ?? false}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>

        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {editingRate ? 'Edit Rate Period' : 'Add New Rate Period'}
              </DialogTitle>
            </DialogHeader>
            
            <div className="grid grid-cols-2 gap-4 py-4">
              <div className="space-y-2">
                <Label>From Date</Label>
                <Input
                  type="date"
                  value={formData.effective_from}
                  onChange={(e) => setFormData({ ...formData, effective_from: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label>To Date</Label>
                <Input
                  type="date"
                  value={formData.effective_to}
                  onChange={(e) => setFormData({ ...formData, effective_to: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label>Employee Rate (%)</Label>
                <Input
                  type="number"
                  step="0.01"
                  value={formData.employee_rate}
                  onChange={(e) => setFormData({ ...formData, employee_rate: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label>Employer Rate (%)</Label>
                <Input
                  type="number"
                  step="0.01"
                  value={formData.employer_rate}
                  onChange={(e) => setFormData({ ...formData, employer_rate: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label>EIB (%)</Label>
                <Input
                  type="number"
                  step="0.01"
                  value={formData.eib_rate}
                  onChange={(e) => setFormData({ ...formData, eib_rate: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label>Severance (%)</Label>
                <Input
                  type="number"
                  step="0.01"
                  value={formData.severance_rate}
                  onChange={(e) => setFormData({ ...formData, severance_rate: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label>Min Age</Label>
                <Input
                  type="number"
                  value={formData.min_age}
                  onChange={(e) => setFormData({ ...formData, min_age: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label>Max Age</Label>
                <Input
                  type="number"
                  value={formData.max_age}
                  onChange={(e) => setFormData({ ...formData, max_age: e.target.value })}
                />
              </div>
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={handleCloseDialog}>Cancel</Button>
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
