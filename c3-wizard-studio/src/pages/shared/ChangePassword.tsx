import { DashboardLayout } from '@/components/layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { KeyRound } from 'lucide-react';
import { useState } from 'react';

export default function ChangePassword() {
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleSubmit = () => {
    // Handle password change
    console.log('Password change submitted');
  };

  return (
    <DashboardLayout>
      <div className="mt-16 space-y-6">
        <h1 className="text-2xl font-bold">Change Password</h1>

        <Card className="max-w-md">
          <CardHeader>
            <CardTitle>Change Password</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="oldPassword">Old Password *</Label>
                <Input
                  id="oldPassword"
                  type="password"
                  value={oldPassword}
                  onChange={(e) => setOldPassword(e.target.value)}
                  placeholder="Enter old password"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="newPassword">New Password *</Label>
                <Input
                  id="newPassword"
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Enter new password"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirm Password *</Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Confirm new password"
                />
              </div>
              <Button onClick={handleSubmit} className="w-full">
                <KeyRound className="h-4 w-4 mr-2" />
                Change Password
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
