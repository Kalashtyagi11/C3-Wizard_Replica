import { useState, useEffect } from 'react';
import { DashboardLayout } from '@/components/layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
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
  DialogFooter,
} from '@/components/ui/dialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Plus, Edit, KeyRound, Lock, Search, Loader2, UserCog, ToggleLeft, ToggleRight } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { useAdminUsers, type AdminUser, type Role } from '@/hooks/useAdminUsers';

export default function AdminManageUsers() {
  const { 
    users, 
    roles, 
    isLoading, 
    error,
    fetchUsers, 
    fetchRoles,
    createUser, 
    updateUser, 
    toggleUserStatus,
    resetPassword,
  } = useAdminUsers();

  const [searchTerm, setSearchTerm] = useState('');
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isResetPasswordOpen, setIsResetPasswordOpen] = useState(false);
  const [isChangePasswordOpen, setIsChangePasswordOpen] = useState(false);
  const [isToggleStatusOpen, setIsToggleStatusOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<AdminUser | null>(null);

  // Form state
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    role_id: 1,
    first_name: '',
    last_name: '',
    password: '',
    confirmPassword: '',
  });

  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');

  useEffect(() => {
    fetchUsers();
    fetchRoles();
  }, [fetchUsers, fetchRoles]);

  const resetForm = () => {
    setFormData({
      username: '',
      email: '',
      role_id: 1,
      first_name: '',
      last_name: '',
      password: '',
      confirmPassword: '',
    });
    setNewPassword('');
    setConfirmNewPassword('');
  };

  const filteredUsers = users.filter(
    (user) =>
      (user.username || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (user.email || '').toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleOpenAddDialog = () => {
    resetForm();
    setIsAddDialogOpen(true);
  };

  const handleOpenEditDialog = (user: AdminUser) => {
    setSelectedUser(user);
    setFormData({
      username: user.username || '',
      email: user.email || '',
      role_id: user.role_id || 1,
      first_name: '',
      last_name: '',
      password: '',
      confirmPassword: '',
    });
    setIsEditDialogOpen(true);
  };

  const handleOpenResetPassword = (user: AdminUser) => {
    setSelectedUser(user);
    setNewPassword('');
    setConfirmNewPassword('');
    setIsResetPasswordOpen(true);
  };

  const handleOpenChangePassword = (user: AdminUser) => {
    setSelectedUser(user);
    setNewPassword('');
    setConfirmNewPassword('');
    setIsChangePasswordOpen(true);
  };

  const handleOpenToggleStatus = (user: AdminUser) => {
    setSelectedUser(user);
    setIsToggleStatusOpen(true);
  };

  const handleCreateUser = async () => {
    if (!formData.username || !formData.email) {
      toast.error('Username and email are required');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    const { error } = await createUser({
      username: formData.username,
      email: formData.email,
      role_id: formData.role_id,
      user_type: 'ADMIN',
    });

    if (error) {
      toast.error(error);
    } else {
      toast.success('User created successfully');
      setIsAddDialogOpen(false);
      resetForm();
    }
  };

  const handleUpdateUser = async () => {
    if (!selectedUser) return;

    const { error } = await updateUser(selectedUser.id, {
      username: formData.username,
      email: formData.email,
      role_id: formData.role_id,
    });

    if (error) {
      toast.error(error);
    } else {
      toast.success('User updated successfully');
      setIsEditDialogOpen(false);
      setSelectedUser(null);
    }
  };

  const handleResetPassword = async () => {
    if (!selectedUser) return;

    if (newPassword !== confirmNewPassword) {
      toast.error('Passwords do not match');
      return;
    }

    if (newPassword.length < 6) {
      toast.error('Password must be at least 6 characters');
      return;
    }

    // In production, this would send a reset email. For now, directly update.
    const { error } = await resetPassword(selectedUser.id, newPassword);

    if (error) {
      toast.error(error);
    } else {
      toast.success('Password reset successfully');
      setIsResetPasswordOpen(false);
      setSelectedUser(null);
    }
  };

  const handleChangePassword = async () => {
    if (!selectedUser) return;

    if (newPassword !== confirmNewPassword) {
      toast.error('Passwords do not match');
      return;
    }

    if (newPassword.length < 6) {
      toast.error('Password must be at least 6 characters');
      return;
    }

    const { error } = await resetPassword(selectedUser.id, newPassword);

    if (error) {
      toast.error(error);
    } else {
      toast.success('Password changed successfully');
      setIsChangePasswordOpen(false);
      setSelectedUser(null);
    }
  };

  const handleToggleStatus = async () => {
    if (!selectedUser) return;

    const newStatus = selectedUser.is_deleted === true ? true : false;
    const { error } = await toggleUserStatus(selectedUser.id, newStatus);

    if (error) {
      toast.error(error);
    } else {
      toast.success(`User ${newStatus ? 'activated' : 'deactivated'} successfully`);
      setIsToggleStatusOpen(false);
      setSelectedUser(null);
    }
  };

  const getRoleName = (roleId: number | null) => {
    if (!roleId) return 'Unknown';
    const role = roles.find((r) => r.id === roleId);
    return role?.role_name || 'Unknown';
  };

  return (
    <DashboardLayout>
      <div className="mt-16 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Administrative Users</h1>
            <p className="text-muted-foreground">Manage admin portal users</p>
          </div>
          <Button onClick={handleOpenAddDialog}>
            <Plus className="h-4 w-4 mr-2" />
            Add User
          </Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <UserCog className="h-5 w-5" />
                <span>Admin User List</span>
              </div>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search by username or email"
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
            ) : error ? (
              <div className="text-center py-8 text-destructive">{error}</div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name / Username</TableHead>
                    <TableHead>UserID / LoginId</TableHead>
                    <TableHead>User Role</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>User Status</TableHead>
                    <TableHead>Edit</TableHead>
                    <TableHead>Reset Password</TableHead>
                    <TableHead>Change Password</TableHead>
                    <TableHead>Toggle Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredUsers.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={9} className="text-center text-muted-foreground">
                        No users found
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredUsers.map((user) => (
                      <TableRow key={user.id}>
                        <TableCell className="font-medium">{user.username || 'N/A'}</TableCell>
                        <TableCell>{user.username}</TableCell>
                        <TableCell>
                          <Badge variant="outline">{getRoleName(user.role_id)}</Badge>
                        </TableCell>
                        <TableCell>{user.email || '-'}</TableCell>
                        <TableCell>
                          <Badge variant={!user.is_deleted ? 'default' : 'secondary'}>
                            {!user.is_deleted ? 'Active' : 'Inactive'}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleOpenEditDialog(user)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                        </TableCell>
                        <TableCell>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleOpenResetPassword(user)}
                          >
                            <KeyRound className="h-4 w-4 mr-1" />
                            Reset
                          </Button>
                        </TableCell>
                        <TableCell>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleOpenChangePassword(user)}
                          >
                            <Lock className="h-4 w-4 mr-1" />
                            Change
                          </Button>
                        </TableCell>
                        <TableCell>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleOpenToggleStatus(user)}
                          >
                            {!user.is_deleted ? (
                              <ToggleRight className="h-5 w-5 text-green-600" />
                            ) : (
                              <ToggleLeft className="h-5 w-5 text-muted-foreground" />
                            )}
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>

        {/* Add User Dialog */}
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add Admin User</DialogTitle>
            </DialogHeader>
            <div className="grid grid-cols-2 gap-4 py-4">
              <div className="space-y-2">
                <Label>First Name *</Label>
                <Input
                  value={formData.first_name}
                  onChange={(e) => setFormData({ ...formData, first_name: e.target.value })}
                  placeholder="Enter First Name"
                />
              </div>
              <div className="space-y-2">
                <Label>Last Name *</Label>
                <Input
                  value={formData.last_name}
                  onChange={(e) => setFormData({ ...formData, last_name: e.target.value })}
                  placeholder="Enter Last Name"
                />
              </div>
              <div className="space-y-2">
                <Label>Email *</Label>
                <Input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="Enter Email"
                />
              </div>
              <div className="space-y-2">
                <Label>User Name *</Label>
                <Input
                  value={formData.username}
                  onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                  placeholder="Enter Username"
                />
              </div>
              <div className="space-y-2">
                <Label>Password *</Label>
                <Input
                  type="password"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  placeholder="Enter Password"
                />
              </div>
              <div className="space-y-2">
                <Label>Confirm Password *</Label>
                <Input
                  type="password"
                  value={formData.confirmPassword}
                  onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                  placeholder="Confirm Password"
                />
              </div>
              <div className="space-y-2 col-span-2">
                <Label>User Role *</Label>
                <Select
                  value={formData.role_id.toString()}
                  onValueChange={(val) => setFormData({ ...formData, role_id: parseInt(val) })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select a Role" />
                  </SelectTrigger>
                  <SelectContent>
                    {roles.map((role) => (
                      <SelectItem key={role.id} value={role.id.toString()}>
                        {role.role_name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleCreateUser}>Save</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Edit User Dialog */}
        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Edit User</DialogTitle>
            </DialogHeader>
            <div className="grid grid-cols-2 gap-4 py-4">
              <div className="space-y-2">
                <Label>Username</Label>
                <Input
                  value={formData.username}
                  onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label>Email</Label>
                <Input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                />
              </div>
              <div className="space-y-2 col-span-2">
                <Label>User Role</Label>
                <Select
                  value={formData.role_id.toString()}
                  onValueChange={(val) => setFormData({ ...formData, role_id: parseInt(val) })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select a Role" />
                  </SelectTrigger>
                  <SelectContent>
                    {roles.map((role) => (
                      <SelectItem key={role.id} value={role.id.toString()}>
                        {role.role_name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleUpdateUser}>Update</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Reset Password Dialog */}
        <Dialog open={isResetPasswordOpen} onOpenChange={setIsResetPasswordOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Reset Password for {selectedUser?.username}</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label>New Password *</Label>
                <Input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Enter new password"
                />
              </div>
              <div className="space-y-2">
                <Label>Confirm Password *</Label>
                <Input
                  type="password"
                  value={confirmNewPassword}
                  onChange={(e) => setConfirmNewPassword(e.target.value)}
                  placeholder="Confirm new password"
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsResetPasswordOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleResetPassword}>Reset Password</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Change Password Dialog */}
        <Dialog open={isChangePasswordOpen} onOpenChange={setIsChangePasswordOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Change Password for {selectedUser?.username}</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label>New Password *</Label>
                <Input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Enter new password"
                />
              </div>
              <div className="space-y-2">
                <Label>Confirm Password *</Label>
                <Input
                  type="password"
                  value={confirmNewPassword}
                  onChange={(e) => setConfirmNewPassword(e.target.value)}
                  placeholder="Confirm new password"
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsChangePasswordOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleChangePassword}>Change Password</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Toggle Status Confirmation */}
        <AlertDialog open={isToggleStatusOpen} onOpenChange={setIsToggleStatusOpen}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>
                {selectedUser?.is_deleted ? 'Activate User' : 'Deactivate User'}
              </AlertDialogTitle>
              <AlertDialogDescription>
                Are you sure you want to{' '}
                {selectedUser?.is_deleted ? 'activate' : 'deactivate'} user "{selectedUser?.username}"?
                {!selectedUser?.is_deleted &&
                  ' This will prevent the user from logging in.'}
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={handleToggleStatus}>
                {selectedUser?.is_deleted ? 'Activate' : 'Deactivate'}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </DashboardLayout>
  );
}
