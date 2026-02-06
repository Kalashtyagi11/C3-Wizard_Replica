import { NavLink, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import {
  LayoutDashboard,
  UserCircle,
  FileText,
  CreditCard,
  ClipboardList,
  History,
  Phone,
  Info,
} from 'lucide-react';

interface SelfEmployedSidebarProps {
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

export function SelfEmployedSidebar({ isOpen }: SelfEmployedSidebarProps) {
  return (
    <aside
      className={cn(
         "fixed left-0 top-[60px] h-[calc(100vh-60px)] bg-primary text-primary-foreground transition-all duration-300 overflow-y-auto",
        isOpen ? "w-64" : "w-16"
      )}
    >
      <nav className="py-4">
        <NavItem to="/self-employed/dashboard" icon={LayoutDashboard} label="Dashboard" isOpen={isOpen} />
        <NavItem to="/self-employed/personal-details" icon={UserCircle} label="Personal Details" isOpen={isOpen} />
        <NavItem to="/self-employed/contribution" icon={FileText} label="Self Employee Contribution" isOpen={isOpen} />
        <NavItem to="/self-employed/payments" icon={CreditCard} label="Payments Details" isOpen={isOpen} />
        <NavItem to="/self-employed/profile" icon={UserCircle} label="User Profile" isOpen={isOpen} />
        <NavItem to="/self-employed/audit-trail" icon={ClipboardList} label="User Audit Trail" isOpen={isOpen} />
        <NavItem to="/self-employed/login-history" icon={History} label="Logged In History" isOpen={isOpen} />
        <NavItem to="/self-employed/contact" icon={Phone} label="Contact Us" isOpen={isOpen} />
        <NavItem to="/self-employed/about" icon={Info} label="About Us" isOpen={isOpen} />
      </nav>
    </aside>
  );
}
