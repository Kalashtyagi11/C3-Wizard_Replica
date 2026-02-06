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
} from 'lucide-react';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';

interface EmployerSidebarProps {
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

export function EmployerSidebar({ isOpen }: EmployerSidebarProps) {
  return (
    <aside
      className={cn(
        "fixed left-0 top-[60px] h-[calc(100vh-60px)] bg-[#1a5c4c] text-white transition-all duration-300 overflow-y-auto",
        isOpen ? "w-64" : "w-16"
      )}
    >
      <nav className="py-4">
        <NavItem to="/employer/dashboard" icon={LayoutDashboard} label="Dashboard" isOpen={isOpen} />
        <NavItem to="/employer/details" icon={Building2} label="Employer Details" isOpen={isOpen} />
        
        <CollapsibleNav icon={FileText} label="C3" isOpen={isOpen} defaultOpen>
          <NavItem to="/employer/employees" icon={Users} label="Employee" isOpen={isOpen} />
          <NavItem to="/employer/holiday-payment" icon={Calendar} label="Holiday/Other Payment" isOpen={isOpen} />
          <NavItem to="/employer/c3" icon={FileText} label="C3 Generation" isOpen={isOpen} />
          <NavItem to="/employer/import-c3" icon={Upload} label="Import C3 File" isOpen={isOpen} />
          <NavItem to="/employer/bonus" icon={Gift} label="Bonus" isOpen={isOpen} />
        </CollapsibleNav>
        
        <NavItem to="/employer/nw-director" icon={UserCircle} label="Non Working Director" isOpen={isOpen} />
        <NavItem to="/employer/payments" icon={CreditCard} label="Payment Details" isOpen={isOpen} />
        <NavItem to="/employer/administration" icon={Settings} label="Administration" isOpen={isOpen} />
        <NavItem to="/employer/profile" icon={UserCircle} label="User Profile" isOpen={isOpen} />
        <NavItem to="/employer/audit-trail" icon={ClipboardList} label="User Audit Trail" isOpen={isOpen} />
        <NavItem to="/employer/login-history" icon={History} label="Logged In History" isOpen={isOpen} />
        <NavItem to="/employer/contact" icon={Phone} label="Contact Us" isOpen={isOpen} />
        <NavItem to="/employer/about" icon={Info} label="About Us" isOpen={isOpen} />
      </nav>
    </aside>
  );
}
