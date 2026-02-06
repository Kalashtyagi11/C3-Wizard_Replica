import { useState, useEffect } from 'react';
import { DashboardLayout } from '@/components/layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Search, Plus, Edit, Trash2, Building2, Loader2 } from 'lucide-react';
import { useCompanies, Company } from '@/hooks/useCompanies';

export default function AdminCompanyManagement() {
  const { companies, isLoading, fetchCompanies, createCompany, updateCompany, deleteCompany } = useCompanies();
  const [searchTerm, setSearchTerm] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingCompany, setEditingCompany] = useState<Company | null>(null);
  const [formData, setFormData] = useState<Partial<Company>>({
    company_name: '',
    registration_number: '',
    trade_name: '',
    address_line1: '',
    address_line2: '',
    city: '',
    state: '',
    postal_code: '',
    country: 'KN',
    email: '',
    mobile: '',
    phone: '',
    fax: '',
    contact_person: '',
  });
  const [isSaving, setIsSaving] = useState(false);

  // Fetch companies on mount
  useEffect(() => {
    fetchCompanies();
  }, [fetchCompanies]);

  const filteredCompanies = companies.filter(
    (company) =>
      (company.company_name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (company.registration_number || '').toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleOpenDialog = (company?: Company) => {
    if (company) {
      setEditingCompany(company);
      setFormData(company);
    } else {
      setEditingCompany(null);
      setFormData({
        company_name: '',
        registration_number: '',
        trade_name: '',
        address_line1: '',
        address_line2: '',
        city: '',
        state: '',
        postal_code: '',
        country: 'KN',
        email: '',
        mobile: '',
        phone: '',
        fax: '',
        contact_person: '',
      });
    }
    setIsDialogOpen(true);
  };

  const handleSubmit = async () => {
    if (!formData.company_name || !formData.registration_number) {
      return;
    }

    setIsSaving(true);
    try {
      if (editingCompany) {
        await updateCompany(editingCompany.id, formData);
      } else {
        await createCompany({ ...formData, company_name: formData.company_name || '' });
      }
      setIsDialogOpen(false);
    } catch (err) {
      // Error handled in hook
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (company: Company) => {
    if (window.confirm(`Are you sure you want to delete ${company.company_name}?`)) {
      await deleteCompany(company.id);
    }
  };

  return (
    <DashboardLayout>
      <div className="mt-16 space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">Company Management</h1>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={() => handleOpenDialog()}>
                <Plus className="h-4 w-4 mr-2" />
                Add Company
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>
                  {editingCompany ? 'Edit Company' : 'Add New Company'}
                </DialogTitle>
              </DialogHeader>
              <Tabs defaultValue="basic" className="mt-4">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="basic">Basic Info</TabsTrigger>
                  <TabsTrigger value="contact">Contact</TabsTrigger>
                  <TabsTrigger value="address">Address</TabsTrigger>
                </TabsList>

                <TabsContent value="basic" className="space-y-4 mt-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="company_name">Company Name *</Label>
                      <Input
                        id="company_name"
                        value={formData.company_name || ''}
                        onChange={(e) =>
                          setFormData({ ...formData, company_name: e.target.value })
                        }
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="registration_number">Registration Number *</Label>
                      <Input
                        id="registration_number"
                        value={formData.registration_number || ''}
                        onChange={(e) =>
                          setFormData({ ...formData, registration_number: e.target.value })
                        }
                        required
                        disabled={!!editingCompany}
                      />
                    </div>
                    <div>
                      <Label htmlFor="trade_name">Trade Name</Label>
                      <Input
                        id="trade_name"
                        value={formData.trade_name || ''}
                        onChange={(e) =>
                          setFormData({ ...formData, trade_name: e.target.value })
                        }
                      />
                    </div>
                    <div>
                      <Label htmlFor="contact_person">Contact Person</Label>
                      <Input
                        id="contact_person"
                        value={formData.contact_person || ''}
                        onChange={(e) =>
                          setFormData({ ...formData, contact_person: e.target.value })
                        }
                      />
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="contact" className="space-y-4 mt-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="mobile">Mobile</Label>
                      <Input
                        id="mobile"
                        value={formData.mobile || ''}
                        onChange={(e) => setFormData({ ...formData, mobile: e.target.value })}
                      />
                    </div>
                    <div>
                      <Label htmlFor="phone">Phone</Label>
                      <Input
                        id="phone"
                        value={formData.phone || ''}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      />
                    </div>
                    <div>
                      <Label htmlFor="fax">Fax</Label>
                      <Input
                        id="fax"
                        value={formData.fax || ''}
                        onChange={(e) => setFormData({ ...formData, fax: e.target.value })}
                      />
                    </div>
                    <div>
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        type="email"
                        value={formData.email || ''}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      />
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="address" className="space-y-4 mt-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="col-span-2">
                      <Label htmlFor="address_line1">Address Line 1</Label>
                      <Input
                        id="address_line1"
                        value={formData.address_line1 || ''}
                        onChange={(e) =>
                          setFormData({ ...formData, address_line1: e.target.value })
                        }
                      />
                    </div>
                    <div className="col-span-2">
                      <Label htmlFor="address_line2">Address Line 2</Label>
                      <Input
                        id="address_line2"
                        value={formData.address_line2 || ''}
                        onChange={(e) =>
                          setFormData({ ...formData, address_line2: e.target.value })
                        }
                      />
                    </div>
                    <div>
                      <Label htmlFor="city">City</Label>
                      <Input
                        id="city"
                        value={formData.city || ''}
                        onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                      />
                    </div>
                    <div>
                      <Label htmlFor="state">State/Region</Label>
                      <Input
                        id="state"
                        value={formData.state || ''}
                        onChange={(e) =>
                          setFormData({ ...formData, state: e.target.value })
                        }
                      />
                    </div>
                    <div>
                      <Label htmlFor="postal_code">Postal Code</Label>
                      <Input
                        id="postal_code"
                        value={formData.postal_code || ''}
                        onChange={(e) =>
                          setFormData({ ...formData, postal_code: e.target.value })
                        }
                      />
                    </div>
                    <div>
                      <Label htmlFor="country">Country</Label>
                      <Select
                        value={formData.country || 'KN'}
                        onValueChange={(value) =>
                          setFormData({ ...formData, country: value })
                        }
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select country" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="KN">St. Kitts and Nevis</SelectItem>
                          <SelectItem value="US">United States</SelectItem>
                          <SelectItem value="GB">United Kingdom</SelectItem>
                          <SelectItem value="CA">Canada</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </TabsContent>
              </Tabs>

              <div className="flex justify-end gap-2 mt-6">
                <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleSubmit} disabled={isSaving}>
                  {isSaving && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                  {editingCompany ? 'Update' : 'Create'}
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Building2 className="h-5 w-5" />
                <span>Companies</span>
              </div>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search by name or registration number"
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
                    <TableHead>Registration No.</TableHead>
                    <TableHead>Company Name</TableHead>
                    <TableHead>Trade Name</TableHead>
                    <TableHead>Contact Person</TableHead>
                    <TableHead>Phone</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredCompanies.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={8} className="text-center text-muted-foreground">
                        No companies found
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredCompanies.map((company) => (
                      <TableRow key={company.id}>
                        <TableCell className="font-medium">
                          {company.registration_number || '-'}
                        </TableCell>
                        <TableCell>{company.company_name}</TableCell>
                        <TableCell>{company.trade_name || '-'}</TableCell>
                        <TableCell>{company.contact_person || '-'}</TableCell>
                        <TableCell>{company.mobile || company.phone || '-'}</TableCell>
                        <TableCell>{company.email || '-'}</TableCell>
                        <TableCell>
                          <Badge
                            variant={!company.is_deleted ? 'default' : 'secondary'}
                          >
                            {!company.is_deleted ? 'Active' : 'Inactive'}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1">
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleOpenDialog(company)}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="text-destructive"
                              onClick={() => handleDelete(company)}
                            >
                              <Trash2 className="h-4 w-4" />
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
