import { useState } from 'react';
import { DashboardLayout } from '@/components/layout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Checkbox } from '@/components/ui/checkbox';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Plus, Pencil, Trash2, Shield, Key } from 'lucide-react';
import { toast } from 'sonner';

interface Role {
  id: string;
  name: string;
  description: string;
  permissions: string[];
  isSystem: boolean;
}

const SYSTEM_ROLES: Role[] = [
  {
    id: 'admin',
    name: 'Administrator',
    description: 'Full system access with all permissions',
    permissions: ['all'],
    isSystem: true,
  },
  {
    id: 'employer',
    name: 'Employer',
    description: 'Employer portal access for C3 management',
    permissions: ['employer:read', 'employer:write', 'c3:create', 'c3:submit', 'payment:create'],
    isSystem: true,
  },
  {
    id: 'self_employed',
    name: 'Self-Employed',
    description: 'Self-employed portal access',
    permissions: ['self_employed:read', 'self_employed:write', 'c3:create', 'c3:submit', 'payment:create'],
    isSystem: true,
  },
];

const ALL_PERMISSIONS = [
  { category: 'Employer', permissions: ['employer:read', 'employer:write', 'employer:delete'] },
  { category: 'Employees', permissions: ['employee:read', 'employee:write', 'employee:delete'] },
  { category: 'C3 Forms', permissions: ['c3:read', 'c3:create', 'c3:edit', 'c3:submit', 'c3:delete'] },
  { category: 'Payments', permissions: ['payment:read', 'payment:create', 'payment:reconcile'] },
  { category: 'Settings', permissions: ['settings:read', 'settings:write'] },
  { category: 'Users', permissions: ['user:read', 'user:write', 'user:delete', 'user:approve'] },
  { category: 'Reports', permissions: ['report:read', 'report:export'] },
];

export default function RoleManagement() {
  const [activeTab, setActiveTab] = useState('roles');
  const [roles, setRoles] = useState<Role[]>(SYSTEM_ROLES);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [editingRole, setEditingRole] = useState<Role | null>(null);
  
  // Form state
  const [roleName, setRoleName] = useState('');
  const [roleDescription, setRoleDescription] = useState('');
  const [selectedPermissions, setSelectedPermissions] = useState<string[]>([]);

  const resetForm = () => {
    setRoleName('');
    setRoleDescription('');
    setSelectedPermissions([]);
    setEditingRole(null);
  };

  const handleSaveRole = () => {
    if (!roleName) {
      toast.error('Role name is required');
      return;
    }

    if (editingRole) {
      setRoles(roles.map(r => 
        r.id === editingRole.id 
          ? { ...r, name: roleName, description: roleDescription, permissions: selectedPermissions }
          : r
      ));
      toast.success('Role updated successfully');
    } else {
      const newRole: Role = {
        id: roleName.toLowerCase().replace(/\s/g, '_'),
        name: roleName,
        description: roleDescription,
        permissions: selectedPermissions,
        isSystem: false,
      };
      setRoles([...roles, newRole]);
      toast.success('Role created successfully');
    }

    setIsAddDialogOpen(false);
    resetForm();
  };

  const handleEditRole = (role: Role) => {
    setEditingRole(role);
    setRoleName(role.name);
    setRoleDescription(role.description);
    setSelectedPermissions(role.permissions);
    setIsAddDialogOpen(true);
  };

  const handleDeleteRole = (roleId: string) => {
    const role = roles.find(r => r.id === roleId);
    if (role?.isSystem) {
      toast.error('Cannot delete system roles');
      return;
    }
    setRoles(roles.filter(r => r.id !== roleId));
    toast.success('Role deleted successfully');
  };

  const togglePermission = (permission: string) => {
    setSelectedPermissions(prev => 
      prev.includes(permission)
        ? prev.filter(p => p !== permission)
        : [...prev, permission]
    );
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Role & Permission Management</h1>
          <p className="text-muted-foreground">Configure user roles and their permissions</p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList>
            <TabsTrigger value="roles" className="flex items-center gap-2">
              <Shield className="h-4 w-4" />
              Roles
            </TabsTrigger>
            <TabsTrigger value="permissions" className="flex items-center gap-2">
              <Key className="h-4 w-4" />
              Permissions Matrix
            </TabsTrigger>
          </TabsList>

          <TabsContent value="roles" className="space-y-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>System Roles</CardTitle>
                  <CardDescription>Manage roles and their assigned permissions</CardDescription>
                </div>
                <Dialog open={isAddDialogOpen} onOpenChange={(open) => {
                  setIsAddDialogOpen(open);
                  if (!open) resetForm();
                }}>
                  <DialogTrigger asChild>
                    <Button>
                      <Plus className="h-4 w-4 mr-2" />
                      Add Role
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-2xl">
                    <DialogHeader>
                      <DialogTitle>{editingRole ? 'Edit Role' : 'Create New Role'}</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label>Role Name *</Label>
                          <Input
                            value={roleName}
                            onChange={(e) => setRoleName(e.target.value)}
                            placeholder="Enter role name"
                            disabled={editingRole?.isSystem}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>Description</Label>
                          <Input
                            value={roleDescription}
                            onChange={(e) => setRoleDescription(e.target.value)}
                            placeholder="Brief description"
                          />
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <Label>Permissions</Label>
                        <div className="border rounded-lg p-4 max-h-64 overflow-y-auto">
                          {ALL_PERMISSIONS.map((category) => (
                            <div key={category.category} className="mb-4">
                              <h4 className="font-medium text-sm mb-2">{category.category}</h4>
                              <div className="grid grid-cols-3 gap-2">
                                {category.permissions.map((perm) => (
                                  <label key={perm} className="flex items-center gap-2 text-sm">
                                    <Checkbox
                                      checked={selectedPermissions.includes(perm) || selectedPermissions.includes('all')}
                                      onCheckedChange={() => togglePermission(perm)}
                                      disabled={editingRole?.isSystem && selectedPermissions.includes('all')}
                                    />
                                    {perm.split(':')[1]}
                                  </label>
                                ))}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                    <DialogFooter>
                      <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                        Cancel
                      </Button>
                      <Button onClick={handleSaveRole}>
                        {editingRole ? 'Update Role' : 'Create Role'}
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Role Name</TableHead>
                      <TableHead>Description</TableHead>
                      <TableHead>Permissions</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {roles.map((role) => (
                      <TableRow key={role.id}>
                        <TableCell className="font-medium">{role.name}</TableCell>
                        <TableCell className="text-muted-foreground">{role.description}</TableCell>
                        <TableCell>
                          <div className="flex flex-wrap gap-1">
                            {role.permissions.includes('all') ? (
                              <Badge>All Permissions</Badge>
                            ) : (
                              role.permissions.slice(0, 3).map(p => (
                                <Badge key={p} variant="outline" className="text-xs">
                                  {p}
                                </Badge>
                              ))
                            )}
                            {role.permissions.length > 3 && !role.permissions.includes('all') && (
                              <Badge variant="secondary">+{role.permissions.length - 3} more</Badge>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          {role.isSystem ? (
                            <Badge variant="secondary">System</Badge>
                          ) : (
                            <Badge variant="outline">Custom</Badge>
                          )}
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-1">
                            <Button size="sm" variant="ghost" onClick={() => handleEditRole(role)}>
                              <Pencil className="h-4 w-4" />
                            </Button>
                            {!role.isSystem && (
                              <Button 
                                size="sm" 
                                variant="ghost" 
                                className="text-destructive"
                                onClick={() => handleDeleteRole(role.id)}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            )}
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="permissions" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Permissions Matrix</CardTitle>
                <CardDescription>Overview of all permissions by role</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-48">Permission</TableHead>
                        {roles.map(role => (
                          <TableHead key={role.id} className="text-center">{role.name}</TableHead>
                        ))}
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {ALL_PERMISSIONS.flatMap(cat => cat.permissions).map(permission => (
                        <TableRow key={permission}>
                          <TableCell className="font-mono text-sm">{permission}</TableCell>
                          {roles.map(role => (
                            <TableCell key={role.id} className="text-center">
                              {role.permissions.includes('all') || role.permissions.includes(permission) ? (
                                <span className="text-green-500">✓</span>
                              ) : (
                                <span className="text-muted-foreground">-</span>
                              )}
                            </TableCell>
                          ))}
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
}
