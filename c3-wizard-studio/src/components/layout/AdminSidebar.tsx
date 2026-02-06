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
} from 'lucide-react';
import { useState } from 'react';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';

interface AdminSidebarProps {
  isOpen: boolean;
}

interface NavItemProps {
  to: string;
  icon: React.ElementType;
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
  icon: React.ElementType;
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

export function AdminSidebar({ isOpen }: AdminSidebarProps) {
  return (
    <aside
      className={cn(
        "fixed left-0 top-[60px] h-[calc(100vh-60px)] bg-[#1a5c4c] text-white transition-all duration-300 overflow-y-auto",
        isOpen ? "w-64" : "w-16"
      )}
    >
      <nav className="py-4">
        <NavItem to="/admin/dashboard" icon={LayoutDashboard} label="Dashboard" isOpen={isOpen} />
        <NavItem to="/admin/employer-details" icon={Building2} label="Employer Details" isOpen={isOpen} />
        <NavItem to="/admin/self-employed-details" icon={UserCircle} label="Self Employed Details" isOpen={isOpen} />
        
        <CollapsibleNav icon={FileText} label="C3 Details" isOpen={isOpen}>
          <NavItem to="/admin/c3/contribution" icon={FileText} label="C3 Contribution" isOpen={isOpen} />
          <NavItem to="/admin/c3/nw-director" icon={FileText} label="NW Director" isOpen={isOpen} />
          <NavItem to="/admin/c3/self-employed" icon={FileText} label="Self Employed" isOpen={isOpen} />
        </CollapsibleNav>

        <NavItem to="/admin/payments" icon={CreditCard} label="Payments Details" isOpen={isOpen} />
        <NavItem to="/admin/reconciliation" icon={RefreshCw} label="Reconciliation" isOpen={isOpen} />

        <CollapsibleNav icon={Settings} label="Settings" isOpen={isOpen}>
          <NavItem to="/admin/settings/c3" icon={Settings} label="C3 Settings" isOpen={isOpen} />
          <NavItem to="/admin/settings/bonus" icon={Settings} label="Bonus Settings" isOpen={isOpen} />
          <NavItem to="/admin/settings/self-employed" icon={Settings} label="Self Employed Settings" isOpen={isOpen} />
          <NavItem to="/admin/settings/levy" icon={Settings} label="Levy Settings" isOpen={isOpen} />
          <NavItem to="/admin/settings/cybersource" icon={Settings} label="Cybersource Settings" isOpen={isOpen} />
        </CollapsibleNav>

        <CollapsibleNav icon={Users} label="Manage Users" isOpen={isOpen}>
          <NavItem to="/admin/users/administrative" icon={Users} label="Administrative" isOpen={isOpen} />
          <NavItem to="/admin/users/employer" icon={Users} label="Employer Users" isOpen={isOpen} />
          <NavItem to="/admin/users/self-employed" icon={Users} label="Self Employed Users" isOpen={isOpen} />
          <NavItem to="/admin/users/role-permission" icon={Users} label="Role Permission" isOpen={isOpen} />
          <NavItem to="/admin/users/role-master" icon={Users} label="Role Master" isOpen={isOpen} />
          <NavItem to="/admin/users/audit-trail" icon={Users} label="User Audit Trail" isOpen={isOpen} />
        </CollapsibleNav>

        <CollapsibleNav icon={BarChart3} label="Reports" isOpen={isOpen}>
          <NavItem to="/admin/reports/employer-history" icon={BarChart3} label="Employer History" isOpen={isOpen} />
          <NavItem to="/admin/reports/self-employed-history" icon={BarChart3} label="Self Employed History" isOpen={isOpen} />
          <NavItem to="/admin/reports/payment-history" icon={BarChart3} label="Payment History" isOpen={isOpen} />
          <NavItem to="/admin/reports/reconciliation-history" icon={BarChart3} label="Reconciliation History" isOpen={isOpen} />
          <NavItem to="/admin/reports/user-history" icon={BarChart3} label="Users History" isOpen={isOpen} />
        </CollapsibleNav>

        <CollapsibleNav icon={ClipboardList} label="Logs" isOpen={isOpen}>
          <NavItem to="/admin/logs/login-history" icon={ClipboardList} label="Logged In History" isOpen={isOpen} />
          <NavItem to="/admin/logs/exception" icon={ClipboardList} label="Exception Logs" isOpen={isOpen} />
        </CollapsibleNav>

        <NavItem to="/admin/data-migration" icon={Database} label="Data Migration" isOpen={isOpen} />
      </nav>
    </aside>
  );
}
