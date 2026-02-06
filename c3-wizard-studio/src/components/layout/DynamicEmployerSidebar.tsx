import { NavLink, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { useState } from 'react';
import {
  LayoutDashboard,
  Building2,
  Users,
  FileText,
  CreditCard,
  UserCircle,
  ClipboardList,
  History,
  Phone,
  Info,
  ChevronDown,
  ChevronRight,
  Gift,
  Calendar,
  Settings,
  Upload,
  LucideIcon,
} from 'lucide-react';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';
import { useUserMenus, MenuItem, getRouteForMenuItem } from '@/hooks/useUserMenus';
import { Skeleton } from '@/components/ui/skeleton';

interface DynamicEmployerSidebarProps {
  isOpen: boolean;
}

// Map module names to icons
const ICON_MAP: Record<string, LucideIcon> = {
  'DASHBOARD': LayoutDashboard,
  'EMPLOYER DETAILS': Building2,
  'EMPLOYEE': Users,
  'HOLIDAY/OTHER PAYMENT': Calendar,
  'C3 GENERATION': FileText,
  'Import C3 File': Upload,
  'BONUS': Gift,
  'C3': FileText,
  'NON WORKING DIRECTOR': UserCircle,
  'NW DIRECTOR': UserCircle,
  'PAYMENTS DETAILS': CreditCard,
  'ADMINISTRATION': Settings,
  'USER PROFILE': UserCircle,
  'USER AUDIT TRAIL': ClipboardList,
  'LOGGED IN HISTORY': History,
  'CONTACT US': Phone,
  'ABOUT US': Info,
};

// Default icon for unmapped modules
const DEFAULT_ICON = FileText;

function getIconForModule(moduleName: string): LucideIcon {
  return ICON_MAP[moduleName] || DEFAULT_ICON;
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

// Define C3 submenu items for grouping
const C3_SUBMENU_MODULES = ['EMPLOYEE', 'HOLIDAY/OTHER PAYMENT', 'C3 GENERATION', 'Import C3 File', 'BONUS'];

export function DynamicEmployerSidebar({ isOpen }: DynamicEmployerSidebarProps) {
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
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="px-4 py-3">
              <Skeleton className="h-5 w-full bg-white/20" />
            </div>
          ))}
        </nav>
      </aside>
    );
  }

  if (error) {
    console.error('Menu loading error:', error);
  }

  // Separate C3 submenu items from top-level items
  const c3SubItems = menuItems.filter(item => C3_SUBMENU_MODULES.includes(item.module_name));
  const topLevelItems = menuItems.filter(item => !C3_SUBMENU_MODULES.includes(item.module_name));

  // Check if user has access to C3 parent menu
  const hasC3Access = menuItems.some(item => item.module_name === 'C3' || c3SubItems.length > 0);

  // Group items by logical sections
  const dashboardItem = topLevelItems.find(item => item.module_name === 'DASHBOARD');
  const employerDetailsItem = topLevelItems.find(item => item.module_name === 'EMPLOYER DETAILS');
  const nwDirectorItem = topLevelItems.find(item => 
    item.module_name === 'NON WORKING DIRECTOR' || item.module_name === 'NW DIRECTOR'
  );
  const paymentsItem = topLevelItems.find(item => item.module_name === 'PAYMENTS DETAILS');
  const adminItem = topLevelItems.find(item => item.module_name === 'ADMINISTRATION');
  const profileItem = topLevelItems.find(item => item.module_name === 'USER PROFILE');
  const auditItem = topLevelItems.find(item => item.module_name === 'USER AUDIT TRAIL');
  const loginHistoryItem = topLevelItems.find(item => item.module_name === 'LOGGED IN HISTORY');
  const contactItem = topLevelItems.find(item => item.module_name === 'CONTACT US');
  const aboutItem = topLevelItems.find(item => item.module_name === 'ABOUT US');

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
            to={getRouteForMenuItem(dashboardItem)} 
            icon={getIconForModule(dashboardItem.module_name)} 
            label={dashboardItem.module_name} 
            isOpen={isOpen} 
          />
        )}

        {/* Employer Details */}
        {employerDetailsItem && (
          <NavItem 
            to={getRouteForMenuItem(employerDetailsItem)} 
            icon={getIconForModule(employerDetailsItem.module_name)} 
            label={employerDetailsItem.module_name} 
            isOpen={isOpen} 
          />
        )}

        {/* C3 Collapsible Section */}
        {hasC3Access && c3SubItems.length > 0 && (
          <CollapsibleNav icon={FileText} label="C3" isOpen={isOpen} defaultOpen>
            {c3SubItems.map(item => (
              <NavItem
                key={item.id}
                to={getRouteForMenuItem(item)}
                icon={getIconForModule(item.module_name)}
                label={item.module_name}
                isOpen={isOpen}
              />
            ))}
          </CollapsibleNav>
        )}

        {/* NW Director */}
        {nwDirectorItem && (
          <NavItem 
            to={getRouteForMenuItem(nwDirectorItem)} 
            icon={getIconForModule(nwDirectorItem.module_name)} 
            label="Non Working Director" 
            isOpen={isOpen} 
          />
        )}

        {/* Payment Details */}
        {paymentsItem && (
          <NavItem 
            to={getRouteForMenuItem(paymentsItem)} 
            icon={getIconForModule(paymentsItem.module_name)} 
            label="Payment Details" 
            isOpen={isOpen} 
          />
        )}

        {/* Administration */}
        {adminItem && (
          <NavItem 
            to={getRouteForMenuItem(adminItem)} 
            icon={getIconForModule(adminItem.module_name)} 
            label={adminItem.module_name} 
            isOpen={isOpen} 
          />
        )}

        {/* User Profile */}
        {profileItem && (
          <NavItem 
            to={getRouteForMenuItem(profileItem)} 
            icon={getIconForModule(profileItem.module_name)} 
            label={profileItem.module_name} 
            isOpen={isOpen} 
          />
        )}

        {/* Audit Trail */}
        {auditItem && (
          <NavItem 
            to={getRouteForMenuItem(auditItem)} 
            icon={getIconForModule(auditItem.module_name)} 
            label={auditItem.module_name} 
            isOpen={isOpen} 
          />
        )}

        {/* Login History */}
        {loginHistoryItem && (
          <NavItem 
            to={getRouteForMenuItem(loginHistoryItem)} 
            icon={getIconForModule(loginHistoryItem.module_name)} 
            label={loginHistoryItem.module_name} 
            isOpen={isOpen} 
          />
        )}

        {/* Contact Us */}
        {contactItem && (
          <NavItem 
            to={getRouteForMenuItem(contactItem)} 
            icon={getIconForModule(contactItem.module_name)} 
            label={contactItem.module_name} 
            isOpen={isOpen} 
          />
        )}

        {/* About Us */}
        {aboutItem && (
          <NavItem 
            to={getRouteForMenuItem(aboutItem)} 
            icon={getIconForModule(aboutItem.module_name)} 
            label={aboutItem.module_name} 
            isOpen={isOpen} 
          />
        )}
      </nav>
    </aside>
  );
}
