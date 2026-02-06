import { NavLink, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import {
  LayoutDashboard,
  Building2,
  UserCircle,
  FileText,
  CreditCard,
  RefreshCw,
  Settings,
  Users,
  BarChart3,
  ClipboardList,
  ChevronDown,
  ChevronRight,
  Database,
  LucideIcon,
} from 'lucide-react';
import { useState } from 'react';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';
import { useUserMenus, MenuItem, getRouteForMenuItem } from '@/hooks/useUserMenus';
import { Skeleton } from '@/components/ui/skeleton';

interface DynamicAdminSidebarProps {
  isOpen: boolean;
}

// Map module names/codes to icons
const ICON_MAP: Record<string, LucideIcon> = {
  'DASHBOARD': LayoutDashboard,
  'EMPLOYER DETAILS': Building2,
  'SELF EMPLOYED DETAILS': UserCircle,
  'C3 DETAILS': FileText,
  'C3 CONTRIBUTION': FileText,
  'NW DIRECTOR': FileText,
  'SELF EMPLOYED': FileText,
  'PAYMENTS DETAILS': CreditCard,
  'RECONCILIATION': RefreshCw,
  'SETTINGS': Settings,
  'C3 SETTINGS': Settings,
  'BONUS SETTINGS': Settings,
  'SELF EMPLOYED SETTINGS': Settings,
  'LEVY SETTINGS': Settings,
  'CYBERSOURCE SETTINGS': Settings,
  'MANAGE USERS': Users,
  'ADMINISTRATIVE': Users,
  'EMPLOYER USERS': Users,
  'SELF EMPLOYED USERS': Users,
  'ROLE PERMISSION': Users,
  'ROLE MASTER': Users,
  'USER AUDIT TRAIL': Users,
  'REPORTS': BarChart3,
  'EMPLOYER HISTORY': BarChart3,
  'SELF EMPLOYED HISTORY': BarChart3,
  'PAYMENT HISTORY': BarChart3,
  'RECONCILIATION HISTORY': BarChart3,
  'USERS HISTORY': BarChart3,
  'LOGS': ClipboardList,
  'LOGGED IN HISTORY': ClipboardList,
  'EXCEPTION LOGS': ClipboardList,
  'DATA MIGRATION': Database,
};

const DEFAULT_ICON = FileText;

function getIconForModule(moduleName: string): LucideIcon {
  return ICON_MAP[moduleName.toUpperCase()] || ICON_MAP[moduleName] || DEFAULT_ICON;
}

interface NavItemProps {
  to: string;
  icon: LucideIcon;
  label: string;
  isOpen: boolean;
}

function NavItem({ to, icon: Icon, label, isOpen }: NavItemProps) {
  const location = useLocation();
  const isActive = location.pathname === to || location.pathname.startsWith(to + '/');

  return (
    <NavLink
      to={to}
      className={cn(
        "flex items-center gap-3 px-4 py-3 text-sm font-medium transition-colors",
        "hover:bg-white/10",
        isActive && "bg-white/20 border-l-4 border-white"
      )}
    >
      <Icon className="h-5 w-5 flex-shrink-0" />
      {isOpen && <span>{label}</span>}
    </NavLink>
  );
}

interface CollapsibleNavProps {
  icon: LucideIcon;
  label: string;
  isOpen: boolean;
  children: React.ReactNode;
  defaultOpen?: boolean;
}

function CollapsibleNav({ icon: Icon, label, isOpen, children, defaultOpen = false }: CollapsibleNavProps) {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <Collapsible open={open} onOpenChange={setOpen}>
      <CollapsibleTrigger className="w-full flex items-center gap-3 px-4 py-3 text-sm font-medium transition-colors hover:bg-white/10">
        <Icon className="h-5 w-5 flex-shrink-0" />
        {isOpen && (
          <>
            <span className="flex-1 text-left">{label}</span>
            {open ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
          </>
        )}
      </CollapsibleTrigger>
      {isOpen && (
        <CollapsibleContent className="pl-4 bg-black/10">
          {children}
        </CollapsibleContent>
      )}
    </Collapsible>
  );
}

// Admin-specific route mapping
const ADMIN_ROUTE_MAP: Record<string, string> = {
  'DASHBOARD': '/admin/dashboard',
  'EMPLOYER DETAILS': '/admin/employer-details',
  'SELF EMPLOYED DETAILS': '/admin/self-employed-details',
  'C3 CONTRIBUTION': '/admin/c3/contribution',
  'NW DIRECTOR': '/admin/c3/nw-director',
  'SELF EMPLOYED': '/admin/c3/self-employed',
  'PAYMENTS DETAILS': '/admin/payments',
  'RECONCILIATION': '/admin/reconciliation',
  'C3 SETTINGS': '/admin/settings/c3',
  'BONUS SETTINGS': '/admin/settings/bonus',
  'SELF EMPLOYED SETTINGS': '/admin/settings/self-employed',
  'LEVY SETTINGS': '/admin/settings/levy',
  'CYBERSOURCE SETTINGS': '/admin/settings/cybersource',
  'ADMINISTRATIVE': '/admin/users/administrative',
  'EMPLOYER USERS': '/admin/users/employer',
  'SELF EMPLOYED USERS': '/admin/users/self-employed',
  'ROLE PERMISSION': '/admin/users/role-permission',
  'ROLE MASTER': '/admin/users/role-master',
  'USER AUDIT TRAIL': '/admin/users/audit-trail',
  'EMPLOYER HISTORY': '/admin/reports/employer-history',
  'SELF EMPLOYED HISTORY': '/admin/reports/self-employed-history',
  'PAYMENT HISTORY': '/admin/reports/payment-history',
  'RECONCILIATION HISTORY': '/admin/reports/reconciliation-history',
  'USERS HISTORY': '/admin/reports/user-history',
  'LOGGED IN HISTORY': '/admin/logs/login-history',
  'EXCEPTION LOGS': '/admin/logs/exception',
  'DATA MIGRATION': '/admin/data-migration',
};

function getAdminRoute(item: MenuItem): string {
  const route = ADMIN_ROUTE_MAP[item.module_name.toUpperCase()] || ADMIN_ROUTE_MAP[item.module_name];
  if (route) return route;
  return getRouteForMenuItem(item);
}

// Define submenu groupings
const C3_DETAILS_MODULES = ['C3 CONTRIBUTION', 'NW DIRECTOR', 'SELF EMPLOYED'];
const SETTINGS_MODULES = ['C3 SETTINGS', 'BONUS SETTINGS', 'SELF EMPLOYED SETTINGS', 'LEVY SETTINGS', 'CYBERSOURCE SETTINGS'];
const MANAGE_USERS_MODULES = ['ADMINISTRATIVE', 'EMPLOYER USERS', 'SELF EMPLOYED USERS', 'ROLE PERMISSION', 'ROLE MASTER', 'USER AUDIT TRAIL'];
const REPORTS_MODULES = ['EMPLOYER HISTORY', 'SELF EMPLOYED HISTORY', 'PAYMENT HISTORY', 'RECONCILIATION HISTORY', 'USERS HISTORY'];
const LOGS_MODULES = ['LOGGED IN HISTORY', 'EXCEPTION LOGS'];

export function DynamicAdminSidebar({ isOpen }: DynamicAdminSidebarProps) {
  const { menuItems, isLoading, error } = useUserMenus();

  if (isLoading) {
    return (
      <aside
        className={cn(
           "fixed left-0 top-[60px] h-[calc(100vh-60px)] bg-primary text-primary-foreground transition-all duration-300 overflow-y-auto",
          isOpen ? "w-64" : "w-16"
        )}
      >
        <nav className="py-4 space-y-2">
          {Array.from({ length: 10 }).map((_, i) => (
            <div key={i} className="px-4 py-3">
              <Skeleton className="h-5 w-full bg-white/20" />
            </div>
          ))}
        </nav>
      </aside>
    );
  }

  if (error) {
    console.error('Admin menu loading error:', error);
  }

  // Helper to check if user has access to a module
  const hasAccess = (moduleName: string) => 
    menuItems.some(item => item.module_name.toUpperCase() === moduleName.toUpperCase());

  // Filter items by group
  const c3Items = menuItems.filter(item => C3_DETAILS_MODULES.includes(item.module_name.toUpperCase()));
  const settingsItems = menuItems.filter(item => SETTINGS_MODULES.includes(item.module_name.toUpperCase()));
  const usersItems = menuItems.filter(item => MANAGE_USERS_MODULES.includes(item.module_name.toUpperCase()));
  const reportsItems = menuItems.filter(item => REPORTS_MODULES.includes(item.module_name.toUpperCase()));
  const logsItems = menuItems.filter(item => LOGS_MODULES.includes(item.module_name.toUpperCase()));

  // Top-level items
  const dashboardItem = menuItems.find(item => item.module_name === 'DASHBOARD');
  const employerDetailsItem = menuItems.find(item => item.module_name === 'EMPLOYER DETAILS');
  const selfEmployedDetailsItem = menuItems.find(item => item.module_name === 'SELF EMPLOYED DETAILS');
  const paymentsItem = menuItems.find(item => item.module_name === 'PAYMENTS DETAILS');
  const reconciliationItem = menuItems.find(item => item.module_name === 'RECONCILIATION');
  const dataMigrationItem = menuItems.find(item => item.module_name.toUpperCase() === 'DATA MIGRATION');

  return (
    <aside
      className={cn(
         "fixed left-0 top-[60px] h-[calc(100vh-60px)] bg-primary text-primary-foreground transition-all duration-300 overflow-y-auto",
        isOpen ? "w-64" : "w-16"
      )}
    >
      <nav className="py-4">
        {/* Dashboard */}
        {dashboardItem && (
          <NavItem 
            to={getAdminRoute(dashboardItem)} 
            icon={LayoutDashboard} 
            label="Dashboard" 
            isOpen={isOpen} 
          />
        )}

        {/* Employer Details */}
        {employerDetailsItem && (
          <NavItem 
            to={getAdminRoute(employerDetailsItem)} 
            icon={Building2} 
            label="Employer Details" 
            isOpen={isOpen} 
          />
        )}

        {/* Self Employed Details */}
        {selfEmployedDetailsItem && (
          <NavItem 
            to={getAdminRoute(selfEmployedDetailsItem)} 
            icon={UserCircle} 
            label="Self Employed Details" 
            isOpen={isOpen} 
          />
        )}

        {/* C3 Details */}
        {c3Items.length > 0 && (
          <CollapsibleNav icon={FileText} label="C3 Details" isOpen={isOpen}>
            {c3Items.map(item => (
              <NavItem
                key={item.id}
                to={getAdminRoute(item)}
                icon={getIconForModule(item.module_name)}
                label={item.module_name}
                isOpen={isOpen}
              />
            ))}
          </CollapsibleNav>
        )}

        {/* Payments */}
        {paymentsItem && (
          <NavItem 
            to={getAdminRoute(paymentsItem)} 
            icon={CreditCard} 
            label="Payments Details" 
            isOpen={isOpen} 
          />
        )}

        {/* Reconciliation */}
        {reconciliationItem && (
          <NavItem 
            to={getAdminRoute(reconciliationItem)} 
            icon={RefreshCw} 
            label="Reconciliation" 
            isOpen={isOpen} 
          />
        )}

        {/* Settings */}
        {settingsItems.length > 0 && (
          <CollapsibleNav icon={Settings} label="Settings" isOpen={isOpen}>
            {settingsItems.map(item => (
              <NavItem
                key={item.id}
                to={getAdminRoute(item)}
                icon={Settings}
                label={item.module_name.replace(' SETTINGS', '')}
                isOpen={isOpen}
              />
            ))}
          </CollapsibleNav>
        )}

        {/* Manage Users */}
        {usersItems.length > 0 && (
          <CollapsibleNav icon={Users} label="Manage Users" isOpen={isOpen}>
            {usersItems.map(item => (
              <NavItem
                key={item.id}
                to={getAdminRoute(item)}
                icon={Users}
                label={item.module_name}
                isOpen={isOpen}
              />
            ))}
          </CollapsibleNav>
        )}

        {/* Reports */}
        {reportsItems.length > 0 && (
          <CollapsibleNav icon={BarChart3} label="Reports" isOpen={isOpen}>
            {reportsItems.map(item => (
              <NavItem
                key={item.id}
                to={getAdminRoute(item)}
                icon={BarChart3}
                label={item.module_name}
                isOpen={isOpen}
              />
            ))}
          </CollapsibleNav>
        )}

        {/* Logs */}
        {logsItems.length > 0 && (
          <CollapsibleNav icon={ClipboardList} label="Logs" isOpen={isOpen}>
            {logsItems.map(item => (
              <NavItem
                key={item.id}
                to={getAdminRoute(item)}
                icon={ClipboardList}
                label={item.module_name}
                isOpen={isOpen}
              />
            ))}
          </CollapsibleNav>
        )}

        {/* Data Migration */}
        {dataMigrationItem && (
          <NavItem 
            to={getAdminRoute(dataMigrationItem)} 
            icon={Database} 
            label="Data Migration" 
            isOpen={isOpen} 
          />
        )}
      </nav>
    </aside>
  );
}
