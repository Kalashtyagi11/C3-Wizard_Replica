import { ReactNode, useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { DynamicAdminSidebar } from './DynamicAdminSidebar';
import { DynamicEmployerSidebar } from './DynamicEmployerSidebar';
import { SelfEmployedSidebar } from './SelfEmployedSidebar';
import { DashboardHeader } from './DashboardHeader';
import { cn } from '@/lib/utils';

interface DashboardLayoutProps {
  children: ReactNode;
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  const { role } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const renderSidebar = () => {
    switch (role) {
      case 'admin':
        return <DynamicAdminSidebar isOpen={sidebarOpen} />;
      case 'employer':
        return <DynamicEmployerSidebar isOpen={sidebarOpen} />;
      case 'self_employed':
        return <SelfEmployedSidebar isOpen={sidebarOpen} />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <DashboardHeader 
        onToggleSidebar={() => setSidebarOpen(!sidebarOpen)} 
        sidebarOpen={sidebarOpen}
      />
      <div className="flex">
        {renderSidebar()}
        <main className={cn(
          "flex-1 p-6 transition-all duration-300",
          sidebarOpen ? "ml-64" : "ml-16"
        )}>
          {children}
        </main>
      </div>
    </div>
  );
}
