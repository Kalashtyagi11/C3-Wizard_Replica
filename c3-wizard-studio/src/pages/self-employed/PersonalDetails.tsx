/**
 * Self-Employed Personal Details Page
 * Connected to c3_self_employed table
 */

import { useState, useEffect } from 'react';
import { DashboardLayout } from '@/components/layout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { User, Save, Loader2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'sonner';
import { Skeleton } from '@/components/ui/skeleton';
import type { Database } from '@/integrations/supabase/types';

type SelfEmployedProfile = Database['public']['Tables']['c3_self_employed']['Row'];
type WageCategory = Database['public']['Tables']['c3_wage_categories']['Row'];

export default function PersonalDetails() {
  const { user } = useAuth();
  const [profile, setProfile] = useState<SelfEmployedProfile | null>(null);
  const [wageCategories, setWageCategories] = useState<WageCategory[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [formData, setFormData] = useState<Partial<SelfEmployedProfile>>({});

  useEffect(() => {
    const fetchData = async () => {
      if (!user?.email) return;

      try {
        // Fetch profile
        const { data: profileData, error: profileError } = await supabase
          .from('c3_self_employed')
          .select('*')
          .eq('email', user.email)
          .maybeSingle();

        if (profileError && profileError.code !== 'PGRST116') {
          throw profileError;
        }

        if (profileData) {
          setProfile(profileData);
          setFormData(profileData);
        }

        // Fetch wage categories
        const { data: categories } = await supabase
          .from('c3_wage_categories')
          .select('*')
          .order('category_name');

        setWageCategories(categories || []);
      } catch (err) {
        console.error('Error fetching profile:', err);
        toast.error('Failed to load profile');
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [user]);

  const handleInputChange = (field: keyof SelfEmployedProfile, value: string | number | null) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = async () => {
    if (!profile?.id) {
      toast.error('Profile not found');
      return;
    }

    setIsSaving(true);
    try {
      const { error } = await supabase
        .from('c3_self_employed')
        .update({
          first_name: formData.first_name,
          middle_name: formData.middle_name,
          last_name: formData.last_name,
          gender: formData.gender,
          date_of_birth: formData.date_of_birth,
          phone: formData.phone,
          mobile: formData.mobile,
          address_line1: formData.address_line1,
          address_line2: formData.address_line2,
          city: formData.city,
          state: formData.state,
          country: formData.country,
          postal_code: formData.postal_code,
          tin: formData.tin,
          wage_category_id: formData.wage_category_id,
          occupation: formData.occupation,
          updated_at: new Date().toISOString(),
        })
        .eq('id', profile.id);

      if (error) throw error;

      toast.success('Profile updated successfully');
      setProfile({ ...profile, ...formData } as SelfEmployedProfile);
    } catch (err) {
      console.error('Error saving profile:', err);
      toast.error('Failed to save profile');
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="space-y-6">
          <Skeleton className="h-8 w-64" />
          <Card>
            <CardContent className="pt-6 space-y-4">
              {[1, 2, 3, 4, 5].map((i) => (
                <Skeleton key={i} className="h-12 w-full" />
              ))}
            </CardContent>
          </Card>
        </div>
      </DashboardLayout>
    );
  }

  if (!profile) {
    return (
      <DashboardLayout>
        <div className="space-y-6">
          <h1 className="text-2xl font-bold">Personal Details</h1>
          <Card>
            <CardContent className="py-8 text-center">
              <User className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">
                No self-employed profile found for your account.
              </p>
              <p className="text-sm text-muted-foreground mt-2">
                Please contact support to set up your profile.
              </p>
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
            <h1 className="text-2xl font-bold text-foreground">Personal Details</h1>
            <p className="text-muted-foreground">
              Manage your self-employed profile information
            </p>
          </div>
          <Button onClick={handleSave} disabled={isSaving} className="gap-2">
            {isSaving ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Save className="h-4 w-4" />
            )}
            Save Changes
          </Button>
        </div>

        {/* Basic Information */}
        <Card>
          <CardHeader>
            <CardTitle>Basic Information</CardTitle>
            <CardDescription>Your personal identification details</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <div className="space-y-2">
              <Label htmlFor="social_security_number">Social Security Number</Label>
              <Input
                id="social_security_number"
                value={formData.social_security_number || ''}
                disabled
                className="bg-muted"
              />
              <p className="text-xs text-muted-foreground">Cannot be changed</p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="first_name">First Name</Label>
              <Input
                id="first_name"
                value={formData.first_name || ''}
                onChange={(e) => handleInputChange('first_name', e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="middle_name">Middle Name</Label>
              <Input
                id="middle_name"
                value={formData.middle_name || ''}
                onChange={(e) => handleInputChange('middle_name', e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="last_name">Last Name</Label>
              <Input
                id="last_name"
                value={formData.last_name || ''}
                onChange={(e) => handleInputChange('last_name', e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="gender">Gender</Label>
              <Select
                value={formData.gender || ''}
                onValueChange={(value) => handleInputChange('gender', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select gender" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="M">Male</SelectItem>
                  <SelectItem value="F">Female</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="date_of_birth">Date of Birth</Label>
              <Input
                id="date_of_birth"
                type="date"
                value={formData.date_of_birth?.split('T')[0] || ''}
                onChange={(e) => handleInputChange('date_of_birth', e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="tin">TIN</Label>
              <Input
                id="tin"
                value={formData.tin || ''}
                onChange={(e) => handleInputChange('tin', e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="occupation">Occupation</Label>
              <Input
                id="occupation"
                value={formData.occupation || ''}
                onChange={(e) => handleInputChange('occupation', e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="wage_category_id">Wage Category</Label>
              <Select
                value={formData.wage_category_id?.toString() || ''}
                onValueChange={(value) => handleInputChange('wage_category_id', parseInt(value))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {wageCategories.map((cat) => (
                    <SelectItem key={cat.id} value={cat.id.toString()}>
                      {cat.category_name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Contact Information */}
        <Card>
          <CardHeader>
            <CardTitle>Contact Information</CardTitle>
            <CardDescription>How we can reach you</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={formData.email || ''}
                disabled
                className="bg-muted"
              />
              <p className="text-xs text-muted-foreground">Contact support to change</p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">Phone</Label>
              <Input
                id="phone"
                value={formData.phone || ''}
                onChange={(e) => handleInputChange('phone', e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="mobile">Mobile</Label>
              <Input
                id="mobile"
                value={formData.mobile || ''}
                onChange={(e) => handleInputChange('mobile', e.target.value)}
              />
            </div>
          </CardContent>
        </Card>

        {/* Address */}
        <Card>
          <CardHeader>
            <CardTitle>Address</CardTitle>
            <CardDescription>Your mailing address</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="address_line1">Address Line 1</Label>
              <Input
                id="address_line1"
                value={formData.address_line1 || ''}
                onChange={(e) => handleInputChange('address_line1', e.target.value)}
              />
            </div>
            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="address_line2">Address Line 2</Label>
              <Input
                id="address_line2"
                value={formData.address_line2 || ''}
                onChange={(e) => handleInputChange('address_line2', e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="city">City</Label>
              <Input
                id="city"
                value={formData.city || ''}
                onChange={(e) => handleInputChange('city', e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="state">State/Parish</Label>
              <Input
                id="state"
                value={formData.state || ''}
                onChange={(e) => handleInputChange('state', e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="country">Country</Label>
              <Input
                id="country"
                value={formData.country || ''}
                onChange={(e) => handleInputChange('country', e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="postal_code">Postal Code</Label>
              <Input
                id="postal_code"
                value={formData.postal_code || ''}
                onChange={(e) => handleInputChange('postal_code', e.target.value)}
              />
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
