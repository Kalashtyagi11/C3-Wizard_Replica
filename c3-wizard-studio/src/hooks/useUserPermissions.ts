import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

/**
 * Module Permission Interface
 * 
 * Represents a user's access permissions for a specific module.
 * Permissions are based on role_id from c3_user_permissions table.
 */
export interface ModulePermission {
  module_id: number;
  module_name: string;
  module_code: string;
  page_url: string | null;
  icon: string | null;
  parent_id: number | null;
  display_order: number;
  can_create: boolean;
  can_read: boolean;
  can_update: boolean;
  can_delete: boolean;
  can_browse: boolean;
  can_export: boolean;
}

interface UseUserPermissionsResult {
  permissions: ModulePermission[];
  isLoading: boolean;
  error: Error | null;
  hasPermission: (moduleNameOrUrl: string, action: 'create' | 'read' | 'update' | 'delete' | 'browse' | 'export') => boolean;
  canAccessModule: (moduleNameOrUrl: string) => boolean;
}

/**
 * Hook to fetch and manage user permissions based on role_id.
 * 
 * Queries c3_user_permissions joined with c3_modules to get:
 * - Which modules the user can access
 * - What actions (CRUD) they can perform in each module
 * 
 * @param roleId - The user's role_id from c3_users table
 */
export function useUserPermissions(roleId: number | null): UseUserPermissionsResult {
  const [permissions, setPermissions] = useState<ModulePermission[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    async function fetchPermissions() {
      if (!roleId) {
        setPermissions([]);
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        setError(null);

        // Query permissions with module details
        const { data, error: queryError } = await supabase
          .from('c3_user_permissions')
          .select(`
            module_id,
            can_create,
            can_read,
            can_update,
            can_delete,
            can_browse,
            can_export,
            c3_modules!inner (
              id,
              module_name,
              module_code,
              page_url,
              icon,
              parent_id,
              display_order
            )
          `)
          .eq('role_id', roleId)
          .eq('is_deleted', false);

        if (queryError) {
          throw new Error(queryError.message);
        }

        // Transform the data to flat structure
        const modulePermissions: ModulePermission[] = (data || []).map((item: any) => ({
          module_id: item.module_id,
          module_name: item.c3_modules.module_name,
          module_code: item.c3_modules.module_code,
          page_url: item.c3_modules.page_url,
          icon: item.c3_modules.icon,
          parent_id: item.c3_modules.parent_id,
          display_order: item.c3_modules.display_order || 0,
          can_create: item.can_create ?? false,
          can_read: item.can_read ?? false,
          can_update: item.can_update ?? false,
          can_delete: item.can_delete ?? false,
          can_browse: item.can_browse ?? false,
          can_export: item.can_export ?? false,
        }));

        // Sort by display order
        modulePermissions.sort((a, b) => a.display_order - b.display_order);

        setPermissions(modulePermissions);
      } catch (err) {
        console.error('Error fetching permissions:', err);
        setError(err instanceof Error ? err : new Error('Failed to fetch permissions'));
      } finally {
        setIsLoading(false);
      }
    }

    fetchPermissions();
  }, [roleId]);

  /**
   * Check if user has a specific permission for a module.
   * 
   * @param moduleNameOrUrl - Module name or page URL to check
   * @param action - The action to check (create, read, update, delete, browse, export)
   */
  const hasPermission = (
    moduleNameOrUrl: string,
    action: 'create' | 'read' | 'update' | 'delete' | 'browse' | 'export'
  ): boolean => {
    const permission = permissions.find(
      (p) =>
        p.module_name.toLowerCase() === moduleNameOrUrl.toLowerCase() ||
        p.page_url === moduleNameOrUrl
    );

    if (!permission) return false;

    switch (action) {
      case 'create':
        return permission.can_create;
      case 'read':
        return permission.can_read;
      case 'update':
        return permission.can_update;
      case 'delete':
        return permission.can_delete;
      case 'browse':
        return permission.can_browse;
      case 'export':
        return permission.can_export;
      default:
        return false;
    }
  };

  /**
   * Check if user can access a module (has read permission).
   * 
   * @param moduleNameOrUrl - Module name or page URL to check
   */
  const canAccessModule = (moduleNameOrUrl: string): boolean => {
    return hasPermission(moduleNameOrUrl, 'read');
  };

  return {
    permissions,
    isLoading,
    error,
    hasPermission,
    canAccessModule,
  };
}

/**
 * Hook to fetch user-specific granular permissions.
 * These override role-based permissions for specific users.
 * 
 * @param userId - The user's id from c3_users table
 */
export function useGranularPermissions(userId: number | null) {
  const [permissions, setPermissions] = useState<Record<string, unknown>[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    async function fetchGranularPermissions() {
      if (!userId) {
        setPermissions([]);
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        setError(null);

        // Use raw fetch to avoid type instantiation issues
        const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
        const supabaseKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;
        
        const response = await fetch(
          `${supabaseUrl}/rest/v1/c3_user_granular_permissions?user_id=eq.${userId}&is_deleted=eq.false`,
          {
            headers: {
              apikey: supabaseKey,
              Authorization: `Bearer ${supabaseKey}`,
              Accept: 'application/json',
            },
          }
        );

        if (!response.ok) {
          throw new Error(`Failed to fetch: ${response.statusText}`);
        }

        const data = await response.json();
        setPermissions(data || []);
      } catch (err) {
        console.error('Error fetching granular permissions:', err);
        setError(err instanceof Error ? err : new Error('Failed to fetch granular permissions'));
      } finally {
        setIsLoading(false);
      }
    }

    fetchGranularPermissions();
  }, [userId]);

  return { permissions, isLoading, error };
}
