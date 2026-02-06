/**
 * Admin User Management Hook
 * Connects to optimised c3_users and c3_roles tables
 */

import { useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface Role {
  id: number;
  legacy_id: number | null;
  role_name: string | null;
  role_code: string | null;
  description: string | null;
  is_deleted: boolean | null;
  is_system_role: boolean | null;
}

export interface AdminUser {
  id: number;
  legacy_id: number | null;
  username: string | null;
  email: string | null;
  role_id: number | null;
  company_id: number | null;
  user_type: string | null;
  is_deleted: boolean | null;
  last_login_at: string | null;
  created_at: string | null;
  updated_at: string | null;
  role?: Role | null;
}

export function useAdminUsers(roleFilter?: number) {
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [roles, setRoles] = useState<Role[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchRoles = useCallback(async () => {
    try {
      const { data, error: fetchError } = await supabase
        .from('c3_roles')
        .select('*')
        .order('role_name', { ascending: true });
      
      if (fetchError) throw fetchError;
      setRoles((data || []) as Role[]);
    } catch (err) {
      console.error('Error fetching roles:', err);
    }
  }, []);

  const fetchUsers = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      // Fetch users
      let query = supabase
        .from('c3_users')
        .select('*')
        .order('username', { ascending: true });
      
      if (roleFilter) {
        query = query.eq('role_id', roleFilter);
      }
      
      const { data: usersData, error: fetchError } = await query;
      
      if (fetchError) throw fetchError;

      // Fetch all roles separately
      const { data: rolesData } = await supabase
        .from('c3_roles')
        .select('*');
      
      // Map roles to users manually
      const usersWithRoles = (usersData || []).map(user => ({
        ...user,
        role: rolesData?.find(r => r.id === user.role_id) || null,
      })) as AdminUser[];
      
      setUsers(usersWithRoles);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to fetch users';
      setError(message);
      console.error('Error fetching users:', err);
    } finally {
      setIsLoading(false);
    }
  }, [roleFilter]);

  const createUser = async (userData: Partial<AdminUser>) => {
    try {
      const insertData = {
        username: userData.username ?? null,
        email: userData.email ?? null,
        role_id: userData.role_id ?? 1,
        company_id: userData.company_id ?? null,
        user_type: userData.user_type ?? 'EMPLOYER',
        is_deleted: false,
        created_at: new Date().toISOString(),
      };
      
      const { data, error: insertError } = await supabase
        .from('c3_users')
        .insert(insertData)
        .select()
        .single();
      
      if (insertError) throw insertError;
      
      await fetchUsers();
      return { user: data, error: null };
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to create user';
      return { user: null, error: message };
    }
  };

  const updateUser = async (userId: number, updates: Partial<AdminUser>) => {
    try {
      const updateData = {
        ...updates,
        updated_at: new Date().toISOString(),
      };
      
      const { error: updateError } = await supabase
        .from('c3_users')
        .update(updateData)
        .eq('id', userId);
      
      if (updateError) throw updateError;
      
      await fetchUsers();
      return { error: null };
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to update user';
      return { error: message };
    }
  };

  const assignCompanyToEmployer = async (userId: number, companyId: number) => {
    try {
      const { error: updateError } = await supabase
        .from('c3_users')
        .update({
          company_id: companyId,
          updated_at: new Date().toISOString(),
        })
        .eq('id', userId);
      
      if (updateError) throw updateError;
      
      await fetchUsers();
      return { error: null };
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to assign company';
      return { error: message };
    }
  };

  const updateUserRole = async (userId: number, roleId: number) => {
    try {
      const { error: updateError } = await supabase
        .from('c3_users')
        .update({
          role_id: roleId,
          updated_at: new Date().toISOString(),
        })
        .eq('id', userId);
      
      if (updateError) throw updateError;
      
      await fetchUsers();
      return { error: null };
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to update user role';
      return { error: message };
    }
  };

  const toggleUserStatus = async (userId: number, isActive: boolean) => {
    try {
      const { error: updateError } = await supabase
        .from('c3_users')
        .update({
          is_deleted: !isActive,
          updated_at: new Date().toISOString(),
        })
        .eq('id', userId);
      
      if (updateError) throw updateError;
      
      await fetchUsers();
      return { error: null };
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to toggle user status';
      return { error: message };
    }
  };

  const resetPassword = async (userId: number, newPassword: string) => {
    try {
      const { error: updateError } = await supabase
        .from('c3_users')
        .update({
          password_hash: newPassword,
          password_updated_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        })
        .eq('id', userId);
      
      if (updateError) throw updateError;
      
      return { error: null };
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to reset password';
      return { error: message };
    }
  };

  const deleteUser = async (userId: number) => {
    try {
      // Soft delete
      const { error: deleteError } = await supabase
        .from('c3_users')
        .update({
          is_deleted: true,
          updated_at: new Date().toISOString(),
        })
        .eq('id', userId);
      
      if (deleteError) throw deleteError;
      
      await fetchUsers();
      return { error: null };
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to delete user';
      return { error: message };
    }
  };

  return {
    users,
    roles,
    isLoading,
    error,
    fetchUsers,
    fetchRoles,
    createUser,
    updateUser,
    assignCompanyToEmployer,
    updateUserRole,
    toggleUserStatus,
    resetPassword,
    deleteUser,
  };
}
