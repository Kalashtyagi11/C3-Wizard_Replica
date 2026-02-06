import { useState } from 'react';
import { DashboardLayout } from '@/components/layout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import { Building2, Edit2, Save, X, Phone, Mail, MapPin } from 'lucide-react';
import { useEmployerCompany } from '@/hooks/useEmployerCompany';
import { useAuth } from '@/hooks/useAuth';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export default function EmployerDetailsPage() {
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
  
  const { company, isLoading, updateCompany } = useEmployerCompany(companyId);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    contact_person: '',
    mobile: '',
    phone: '',
    email: '',
    address_line1: '',
    address_line2: '',
    city: '',
  });

  const handleEdit = () => {
    if (company) {
      setFormData({
        contact_person: company.contact_person || '',
        mobile: company.mobile || '',
        phone: company.phone || '',
        email: company.email || '',
        address_line1: company.address_line1 || '',
        address_line2: company.address_line2 || '',
        city: company.city || '',
      });
    }
    setIsEditing(true);
  };

  const handleSave = async () => {
    await updateCompany.mutateAsync(formData);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setIsEditing(false);
  };

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="space-y-6">
          <Skeleton className="h-8 w-64" />
          <Skeleton className="h-64 w-full" />
        </div>
      </DashboardLayout>
    );
  }

  if (!company) {
    return (
      <DashboardLayout>
        <div className="space-y-6">
          <h1 className="text-2xl font-bold text-foreground">Employer Details</h1>
          <Card>
            <CardContent className="py-12 text-center">
              <Building2 className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <p className="text-muted-foreground">No company information found</p>
            </CardContent>
          </Card>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Employer Details</h1>
            <p className="text-muted-foreground">View and manage your company information</p>
          </div>
          {!isEditing && (
            <Button onClick={handleEdit}>
              <Edit2 className="h-4 w-4 mr-2" />
              Edit Details
            </Button>
          )}
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {/* Company Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Building2 className="h-5 w-5" />
                Company Information
              </CardTitle>
              <CardDescription>Basic company details</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4">
                <div>
                  <Label className="text-muted-foreground">Company Name</Label>
                  <p className="font-medium">{company.company_name || '-'}</p>
                </div>
                <div>
                  <Label className="text-muted-foreground">Trade Name</Label>
                  <p className="font-medium">{company.trade_name || '-'}</p>
                </div>
                <div>
                  <Label className="text-muted-foreground">Registration Number</Label>
                  <p className="font-mono">{company.registration_number || '-'}</p>
                </div>
                <div>
                  <Label className="text-muted-foreground">Status</Label>
                  <div className="mt-1">
                    <Badge variant={!company.is_deleted ? 'default' : 'secondary'}>
                      {!company.is_deleted ? 'Active' : 'Inactive'}
                    </Badge>
                    {company.is_levy_exempt && (
                      <Badge variant="outline" className="ml-2">Levy Exempt</Badge>
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Contact Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Phone className="h-5 w-5" />
                Contact Information
              </CardTitle>
              <CardDescription>Contact person and communication details</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {isEditing ? (
                <div className="grid gap-4">
                  <div>
                    <Label htmlFor="contact_person">Contact Person</Label>
                    <Input
                      id="contact_person"
                      value={formData.contact_person}
                      onChange={(e) => setFormData({ ...formData, contact_person: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="mobile">Mobile</Label>
                      <Input
                        id="mobile"
                        value={formData.mobile}
                        onChange={(e) => setFormData({ ...formData, mobile: e.target.value })}
                      />
                    </div>
                    <div>
                      <Label htmlFor="phone">Phone</Label>
                      <Input
                        id="phone"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      />
                    </div>
                  </div>
                </div>
              ) : (
                <div className="grid gap-4">
                  <div>
                    <Label className="text-muted-foreground">Contact Person</Label>
                    <p className="font-medium">{company.contact_person || '-'}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Mail className="h-4 w-4 text-muted-foreground" />
                    <span>{company.email || '-'}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone className="h-4 w-4 text-muted-foreground" />
                    <span>{company.mobile || company.phone || '-'}</span>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Address */}
          <Card className="md:col-span-2">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="h-5 w-5" />
                Address
              </CardTitle>
            </CardHeader>
            <CardContent>
              {isEditing ? (
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="md:col-span-2">
                    <Label htmlFor="address_line1">Address Line 1</Label>
                    <Input
                      id="address_line1"
                      value={formData.address_line1}
                      onChange={(e) => setFormData({ ...formData, address_line1: e.target.value })}
                    />
                  </div>
                  <div className="md:col-span-2">
                    <Label htmlFor="address_line2">Address Line 2</Label>
                    <Input
                      id="address_line2"
                      value={formData.address_line2}
                      onChange={(e) => setFormData({ ...formData, address_line2: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label htmlFor="city">City</Label>
                    <Input
                      id="city"
                      value={formData.city}
                      onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                    />
                  </div>
                </div>
              ) : (
                <div>
                  <p>{company.address_line1 || '-'}</p>
                  {company.address_line2 && <p>{company.address_line2}</p>}
                  <p>
                    {[company.city, company.state, company.postal_code].filter(Boolean).join(', ') || '-'}
                  </p>
                  <p>{company.country || 'St. Kitts & Nevis'}</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {isEditing && (
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={handleCancel}>
              <X className="h-4 w-4 mr-2" />
              Cancel
            </Button>
            <Button onClick={handleSave} disabled={updateCompany.isPending}>
              <Save className="h-4 w-4 mr-2" />
              Save Changes
            </Button>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
