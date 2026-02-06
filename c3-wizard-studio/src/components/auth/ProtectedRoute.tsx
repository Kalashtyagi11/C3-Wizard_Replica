import { ReactNode } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { Loader2 } from 'lucide-react';

interface ProtectedRouteProps {
  children: ReactNode;
  allowedRoles?: ('admin' | 'employer' | 'self_employed')[];
}

export function ProtectedRoute({ children, allowedRoles }: ProtectedRouteProps) {
  const { user, role, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!user) {
    // Redirect to login, but save the attempted URL
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Check role-based access if roles are specified
  if (allowedRoles && role && !allowedRoles.includes(role)) {
    // User is logged in but doesn't have permission
    return <Navigate to="/dashboard" replace />;
  }

  return <>{children}</>;
}
