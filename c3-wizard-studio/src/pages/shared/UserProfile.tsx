import { DashboardLayout } from '@/components/layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { useAuth } from '@/hooks/useAuth';
import { Save, X, Upload } from 'lucide-react';
import { useState } from 'react';

export default function UserProfile() {
  const { user } = useAuth();
  const [firstName, setFirstName] = useState('John');
  const [lastName, setLastName] = useState('Doe');
  const [email, setEmail] = useState(user?.email || '');

  const getInitials = () => {
    return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
  };

  return (
    <DashboardLayout>
      <div className="mt-16 space-y-6">
        <h1 className="text-2xl font-bold">User Profile</h1>

        <Card>
          <CardContent className="pt-6">
            <div className="flex flex-col md:flex-row gap-8">
              {/* Profile Picture Section */}
              <div className="flex flex-col items-center space-y-4">
                <Avatar className="h-32 w-32">
                  <AvatarFallback className="text-4xl bg-primary text-primary-foreground">
                    {getInitials()}
                  </AvatarFallback>
                </Avatar>
                <Button variant="outline" size="sm">
                  <Upload className="h-4 w-4 mr-2" />
                  Upload Profile Picture
                </Button>
              </div>

              {/* Profile Form */}
              <div className="flex-1 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="firstName">First Name *</Label>
                    <Input
                      id="firstName"
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      placeholder="Enter first name"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName">Last Name *</Label>
                    <Input
                      id="lastName"
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      placeholder="Enter last name"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email *</Label>
                    <Input
                      id="email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Enter email"
                    />
                  </div>
                </div>

                <div className="flex gap-4">
                  <Button>
                    <Save className="h-4 w-4 mr-2" />
                    Save
                  </Button>
                  <Button variant="outline">
                    <X className="h-4 w-4 mr-2" />
                    Cancel
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
