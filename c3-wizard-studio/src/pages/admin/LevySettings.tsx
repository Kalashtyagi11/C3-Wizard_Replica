import { useState } from 'react';
import { DashboardLayout } from '@/components/layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Layers, Plus, Edit, Trash2 } from 'lucide-react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import type { Database } from '@/integrations/supabase/types';

// Use database types directly
type DbLevyTier = Database['public']['Tables']['c3_levy_tiers']['Row'];
type LevyTier = DbLevyTier;

export default function AdminLevySettings() {
  const queryClient = useQueryClient();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingTier, setEditingTier] = useState<LevyTier | null>(null);
  const [selectedYear, setSelectedYear] = useState<string>('2025');
  const [formData, setFormData] = useState({
    tax_year: '2025',
    deduction_code: 'LEVY',
    pay_period: 'W',
    marital_status: 'S',
    threshold_amount: '',
    base_amount: '',
    tax_rate: '',
    tier_order: '',
  });

  const { data: tiers = [], isLoading } = useQuery({
    queryKey: ['levy-tiers', selectedYear],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('c3_levy_tiers')
        .select('*')
        .eq('deduction_code', 'LEVY')
        .eq('tax_year', selectedYear)
        .order('tier_order', { ascending: true });
      
      if (error) throw error;
      return data;
    },
  });

  const { data: years = [] } = useQuery({
    queryKey: ['levy-years'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('c3_levy_tiers')
        .select('tax_year')
        .eq('deduction_code', 'LEVY')
        .order('tax_year', { ascending: false });
      
      if (error) throw error;
      const uniqueYears = [...new Set(data.map(d => d.tax_year).filter(Boolean))];
      return uniqueYears as string[];
    },
  });

  const saveMutation = useMutation({
    mutationFn: async (data: Database['public']['Tables']['c3_levy_tiers']['Insert']) => {
      if (editingTier) {
        const { error } = await supabase
          .from('c3_levy_tiers')
          .update(data)
          .eq('id', editingTier.id);
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('c3_levy_tiers')
          .insert(data);
        if (error) throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['levy-tiers'] });
      queryClient.invalidateQueries({ queryKey: ['levy-years'] });
      toast.success(editingTier ? 'Tier updated successfully' : 'Tier created successfully');
      handleCloseDialog();
    },
    onError: (error) => {
      toast.error('Failed to save tier: ' + (error as Error).message);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: number) => {
      const { error } = await supabase
        .from('c3_levy_tiers')
        .delete()
        .eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['levy-tiers'] });
      toast.success('Tier deleted successfully');
    },
    onError: (error) => {
      toast.error('Failed to delete tier: ' + (error as Error).message);
    },
  });

  const handleOpenDialog = (tier?: LevyTier) => {
    if (tier) {
      setEditingTier(tier);
      setFormData({
        tax_year: tier.tax_year || '2025',
        deduction_code: tier.deduction_code || 'LEVY',
        pay_period: tier.pay_period || 'W',
        marital_status: tier.marital_status || 'S',
        threshold_amount: tier.threshold_amount?.toString() || '',
        base_amount: tier.base_amount?.toString() || '',
        tax_rate: tier.tax_rate?.toString() || '',
        tier_order: tier.tier_order?.toString() || '',
      });
    } else {
      setEditingTier(null);
      const nextOrder = tiers.length > 0 ? Math.max(...tiers.map(t => t.tier_order || 0)) + 1 : 1;
      setFormData({
        tax_year: selectedYear,
        deduction_code: 'LEVY',
        pay_period: 'W',
        marital_status: 'S',
        threshold_amount: '',
        base_amount: '0',
        tax_rate: '',
        tier_order: nextOrder.toString(),
      });
    }
    setIsDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    setEditingTier(null);
  };

  const handleSubmit = () => {
    const data: Database['public']['Tables']['c3_levy_tiers']['Insert'] = {
      tax_year: formData.tax_year,
      deduction_code: formData.deduction_code,
      pay_period: formData.pay_period,
      marital_status: formData.marital_status,
      threshold_amount: parseFloat(formData.threshold_amount) || 0,
      base_amount: parseFloat(formData.base_amount) || 0,
      tax_rate: parseFloat(formData.tax_rate) || 0,
      tier_order: parseInt(formData.tier_order) || 1,
    };
    saveMutation.mutate(data);
  };

  const formatCurrency = (amount: number | null) => {
    if (amount === null) return '-';
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'XCD' }).format(amount);
  };

  return (
    <DashboardLayout>
      <div className="mt-16 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Levy Settings</h1>
            <p className="text-muted-foreground">Configure progressive levy tax tiers by year</p>
          </div>
          <div className="flex gap-2">
            <Select value={selectedYear} onValueChange={setSelectedYear}>
              <SelectTrigger className="w-32">
                <SelectValue placeholder="Year" />
              </SelectTrigger>
              <SelectContent>
                {years.map((year) => (
                  <SelectItem key={year} value={year}>{year}</SelectItem>
                ))}
                <SelectItem value="2026">2026</SelectItem>
              </SelectContent>
            </Select>
            <Button onClick={() => handleOpenDialog()}>
              <Plus className="h-4 w-4 mr-2" />
              Add Tier
            </Button>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Layers className="h-5 w-5" />
              Levy Tiers for {selectedYear}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="text-center py-8">Loading levy tiers...</div>
            ) : tiers.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                No levy tiers found for {selectedYear}. Add one to get started.
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Order</TableHead>
                    <TableHead>Threshold Amount (Weekly)</TableHead>
                    <TableHead>Base Amount</TableHead>
                    <TableHead>Tax Rate</TableHead>
                    <TableHead>Pay Period</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {tiers.map((tier) => (
                    <TableRow key={tier.id}>
                      <TableCell>{tier.tier_order}</TableCell>
                      <TableCell>{formatCurrency(tier.threshold_amount)}</TableCell>
                      <TableCell>{formatCurrency(tier.base_amount)}</TableCell>
                      <TableCell>{tier.tax_rate}%</TableCell>
                      <TableCell>{tier.pay_period === 'W' ? 'Weekly' : tier.pay_period}</TableCell>
                      <TableCell>
                        <div className="flex gap-1">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleOpenDialog(tier)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                              if (confirm('Are you sure you want to delete this tier?')) {
                                deleteMutation.mutate(tier.id);
                              }
                            }}
                          >
                            <Trash2 className="h-4 w-4 text-destructive" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}

            <div className="mt-4 p-4 bg-muted rounded-lg">
              <h4 className="font-medium mb-2">How Levy Calculation Works:</h4>
              <p className="text-sm text-muted-foreground">
                The progressive levy is calculated by applying different rates to income above certain thresholds.
                For each tier, if weekly wages exceed the "Threshold Amount", the applicable rate is applied to the excess.
                The tiers are processed in order from lowest to highest threshold.
              </p>
            </div>
          </CardContent>
        </Card>

        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {editingTier ? 'Edit Levy Tier' : 'Add New Levy Tier'}
              </DialogTitle>
            </DialogHeader>
            
            <div className="grid grid-cols-2 gap-4 py-4">
              <div className="space-y-2">
                <Label>Tax Year</Label>
                <Input
                  value={formData.tax_year}
                  onChange={(e) => setFormData({ ...formData, tax_year: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label>Tier Order</Label>
                <Input
                  type="number"
                  value={formData.tier_order}
                  onChange={(e) => setFormData({ ...formData, tier_order: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label>Threshold Amount (Weekly)</Label>
                <Input
                  type="number"
                  step="0.01"
                  value={formData.threshold_amount}
                  onChange={(e) => setFormData({ ...formData, threshold_amount: e.target.value })}
                  placeholder="e.g., 538.46"
                />
              </div>
              <div className="space-y-2">
                <Label>Base Amount</Label>
                <Input
                  type="number"
                  step="0.01"
                  value={formData.base_amount}
                  onChange={(e) => setFormData({ ...formData, base_amount: e.target.value })}
                  placeholder="e.g., 0"
                />
              </div>
              <div className="space-y-2">
                <Label>Tax Rate (%)</Label>
                <Input
                  type="number"
                  step="0.01"
                  value={formData.tax_rate}
                  onChange={(e) => setFormData({ ...formData, tax_rate: e.target.value })}
                  placeholder="e.g., 6"
                />
              </div>
              <div className="space-y-2">
                <Label>Pay Period</Label>
                <Select
                  value={formData.pay_period}
                  onValueChange={(value) => setFormData({ ...formData, pay_period: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="W">Weekly</SelectItem>
                    <SelectItem value="B">Bi-Weekly</SelectItem>
                    <SelectItem value="M">Monthly</SelectItem>
                  </SelectContent>
                </Select>
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
