import { useState, useEffect, useMemo } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';

/**
 * Menu Item Interface
 * Represents a menu item from c3_modules with permission flags
 */
export interface MenuItem {
  id: number;
  module_code: string;
  module_name: string;
  page_url: string | null;
  icon: string | null;
  parent_id: number | null;
  module_level: number;
  can_create: boolean;
  can_read: boolean;
  can_update: boolean;
  can_delete: boolean;
  can_browse: boolean;
  can_export: boolean;
}

/**
 * Menu tree node with children for hierarchical menus
 */
export interface MenuTreeNode extends MenuItem {
  children: MenuTreeNode[];
}

interface UseUserMenusResult {
  menuItems: MenuItem[];
  menuTree: MenuTreeNode[];
  isLoading: boolean;
  error: Error | null;
  hasMenuAccess: (moduleCodeOrUrl: string) => boolean;
  getMenuByUrl: (url: string) => MenuItem | undefined;
}

// Role IDs from legacy system
const ADMIN_ROLE_IDS = [13, 14, 24]; // Administrative, Inspector, Administrative_12
const EMPLOYER_ROLE_IDS = [15, 16]; // Company, Company User
const SELF_EMPLOYED_ROLE_ID = 17;

/**
 * Hook to fetch user's accessible menus based on role and permissions.
 * 
 * Logic:
 * 1. Get user's role_id from c3_users
 * 2. Query c3_user_permissions + c3_modules for that role
 * 3. Return menu items user can access (where can_read = true)
 */
export function useUserMenus(): UseUserMenusResult {
  const { user, role: appRole } = useAuth();
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    async function fetchUserMenus() {
      if (!user?.id) {
        setMenuItems([]);
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        setError(null);

        // Step 1: Get user's role_id from c3_users
        const { data: userData, error: userError } = await supabase
          .from('c3_users')
          .select('id, role_id, company_id, user_type')
          .eq('auth_user_id', user.id)
          .eq('is_deleted', false)
          .single();

        if (userError) {
          console.error('Error fetching user data:', userError);
          throw new Error('Failed to fetch user data');
        }

        if (!userData?.role_id) {
          console.warn('User has no role_id assigned');
          setMenuItems([]);
          setIsLoading(false);
          return;
        }

        const roleId = userData.role_id;

        // Step 2: Query permissions for this role with module details
        const { data: permissionData, error: permError } = await supabase
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
              module_code,
              module_name,
              page_url,
              icon,
              parent_id,
              module_level
            )
          `)
          .eq('role_id', roleId)
          .eq('is_deleted', false)
          .eq('can_read', true); // Only menus user can read/access

        if (permError) {
          console.error('Error fetching permissions:', permError);
          throw new Error('Failed to fetch menu permissions');
        }

        // Transform to flat menu items
        const items: MenuItem[] = (permissionData || []).map((perm: any) => ({
          id: perm.c3_modules.id,
          module_code: perm.c3_modules.module_code,
          module_name: perm.c3_modules.module_name,
          page_url: perm.c3_modules.page_url,
          icon: perm.c3_modules.icon,
          parent_id: perm.c3_modules.parent_id,
          module_level: perm.c3_modules.module_level || 0,
          can_create: perm.can_create ?? false,
          can_read: perm.can_read ?? false,
          can_update: perm.can_update ?? false,
          can_delete: perm.can_delete ?? false,
          can_browse: perm.can_browse ?? false,
          can_export: perm.can_export ?? false,
        }));

        // Sort by module_level
        items.sort((a, b) => a.module_level - b.module_level);

        setMenuItems(items);
      } catch (err) {
        console.error('Error in useUserMenus:', err);
        setError(err instanceof Error ? err : new Error('Failed to fetch menus'));
      } finally {
        setIsLoading(false);
      }
    }

    fetchUserMenus();
  }, [user?.id]);

  /**
   * Build hierarchical menu tree from flat items
   */
  const menuTree = useMemo(() => {
    const itemMap = new Map<number, MenuTreeNode>();
    const roots: MenuTreeNode[] = [];

    // First pass: create all nodes
    menuItems.forEach(item => {
      itemMap.set(item.id, { ...item, children: [] });
    });

    // Second pass: build tree
    menuItems.forEach(item => {
      const node = itemMap.get(item.id)!;
      if (item.parent_id && itemMap.has(item.parent_id)) {
        itemMap.get(item.parent_id)!.children.push(node);
      } else {
        roots.push(node);
      }
    });

    return roots;
  }, [menuItems]);

  /**
   * Check if user has access to a specific menu
   */
  const hasMenuAccess = (moduleCodeOrUrl: string): boolean => {
    return menuItems.some(
      item =>
        item.module_code === moduleCodeOrUrl ||
        item.page_url === moduleCodeOrUrl ||
        item.module_name.toLowerCase() === moduleCodeOrUrl.toLowerCase()
    );
  };

  /**
   * Get menu item by URL path
   */
  const getMenuByUrl = (url: string): MenuItem | undefined => {
    return menuItems.find(item => item.page_url === url);
  };

  return {
    menuItems,
    menuTree,
    isLoading,
    error,
    hasMenuAccess,
    getMenuByUrl,
  };
}

/**
 * Menu URL mapping from legacy module names to new React routes
 * This maps the legacy page_url or module_name to our app routes
 */
export const MENU_ROUTE_MAP: Record<string, string> = {
  // Employer Routes
  'DASHBOARD': '/employer/dashboard',
  'EMPLOYER DETAILS': '/employer/details',
  'EMPLOYEE': '/employer/employees',
  'HOLIDAY/OTHER PAYMENT': '/employer/holiday-payment',
  'C3 GENERATION': '/employer/c3',
  'Import C3 File': '/employer/import-c3',
  'BONUS': '/employer/bonus',
  'NON WORKING DIRECTOR': '/employer/nw-director',
  'NW DIRECTOR': '/employer/nw-director',
  'PAYMENTS DETAILS': '/employer/payments',
  'ADMINISTRATION': '/employer/administration',
  'USER PROFILE': '/employer/profile',
  'USER AUDIT TRAIL': '/employer/audit-trail',
  'LOGGED IN HISTORY': '/employer/login-history',
  'CONTACT US': '/employer/contact',
  'ABOUT US': '/employer/about',
  'C3': '/employer/c3',
  
  // Self-Employed Routes
  'PERSONAL DETAILS': '/self-employed/details',
  'SELF EMPLOYEE CONTRIBUTION': '/self-employed/contribution',
  
  // Admin Routes - mapping module names to admin paths
  'dashboard_33': '/admin/dashboard',
  'employer_details_34': '/admin/employer-details',
  'self_employed_details_56': '/admin/self-employed-details',
  'c3_contribution_36': '/admin/c3/contribution',
  'nw_director_37': '/admin/c3/nw-director',
  'self_employed_38': '/admin/c3/self-employed',
  'payments_details_39': '/admin/payments',
  'reconciliation_52': '/admin/reconciliation',
  'settings_40': '/admin/settings',
  'manage_users_45': '/admin/users',
};

/**
 * Get the React route for a menu item
 */
export function getRouteForMenuItem(item: MenuItem): string {
  // First check if module_name maps to a route
  if (MENU_ROUTE_MAP[item.module_name]) {
    return MENU_ROUTE_MAP[item.module_name];
  }
  // Then check module_code
  if (MENU_ROUTE_MAP[item.module_code]) {
    return MENU_ROUTE_MAP[item.module_code];
  }
  // Fallback to page_url if it's a valid path
  if (item.page_url && item.page_url.startsWith('/')) {
    return item.page_url;
  }
  // Default fallback
  return '#';
}
