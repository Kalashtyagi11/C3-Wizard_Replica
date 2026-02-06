import { useAuth } from '@/hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Menu, User, KeyRound, LogOut, CreditCard, HelpCircle } from 'lucide-react';
import ssbLogo from '@/assets/ssb-logo.png';

interface DashboardHeaderProps {
  onToggleSidebar: () => void;
  sidebarOpen: boolean;
}

export function DashboardHeader({ onToggleSidebar }: DashboardHeaderProps) {
  const { user, role, signOut } = useAuth();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await signOut();
    navigate('/login');
  };

  const getRoleLabel = () => {
    switch (role) {
      case 'admin': return 'Administrator';
      case 'employer': return 'Employer';
      case 'self_employed': return 'Self-Employed';
      default: return 'User';
    }
  };

  const getInitials = () => {
    const email = user?.email || '';
    return email.substring(0, 2).toUpperCase();
  };

  return (
     <header className="fixed top-0 left-0 right-0 z-50 bg-primary shadow-lg">
      <div className="flex items-center justify-between px-4 py-3">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={onToggleSidebar}
            className="text-white hover:bg-white/10"
          >
            <Menu className="h-5 w-5" />
          </Button>
          
          <div className="flex items-center gap-3">
            <img 
              src={ssbLogo} 
              alt="SSB Logo" 
              className="w-12 h-12 object-contain"
            />
            <div className="text-white">
              <h1 className="text-lg font-bold tracking-wide">C3 WIZARD</h1>
              <p className="text-xs italic opacity-90">Striving for Social Justice</p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <span className="text-white/90 text-sm hidden md:block">
            {getRoleLabel()}
          </span>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="flex items-center gap-2 text-white hover:bg-white/10">
                <Avatar className="h-8 w-8">
                   <AvatarFallback className="bg-primary-foreground text-primary text-sm font-medium">
                    {getInitials()}
                  </AvatarFallback>
                </Avatar>
                <span className="hidden md:block">{user?.email}</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuItem onClick={() => navigate('/profile')}>
                <User className="mr-2 h-4 w-4" />
                My Profile
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => navigate('/change-password')}>
                <KeyRound className="mr-2 h-4 w-4" />
                Change Password
              </DropdownMenuItem>
              {role !== 'admin' && (
                <DropdownMenuItem onClick={() => navigate('/card-details')}>
                  <CreditCard className="mr-2 h-4 w-4" />
                  Card Details
                </DropdownMenuItem>
              )}
              <DropdownMenuItem onClick={() => navigate('/security-questions')}>
                <HelpCircle className="mr-2 h-4 w-4" />
                Question & Answer
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleSignOut} className="text-destructive">
                <LogOut className="mr-2 h-4 w-4" />
                Logout
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}
