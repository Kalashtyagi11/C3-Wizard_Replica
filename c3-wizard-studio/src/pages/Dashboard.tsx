import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, LogOut, User, Building2, FileText, DollarSign } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function Dashboard() {
  const { user, role, isLoading, signOut } = useAuth();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await signOut();
    navigate('/login');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  const getRoleLabel = (role: string | null) => {
    switch (role) {
      case 'admin':
        return 'Administrator';
      case 'employer':
        return 'Employer';
      case 'self_employed':
        return 'Self-Employed';
      default:
        return 'User';
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <h1 className="text-xl font-bold text-primary">C3 Wizard</h1>
            {role && (
              <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full">
                {getRoleLabel(role)}
              </span>
            )}
          </div>
          <div className="flex items-center space-x-4">
            <span className="text-sm text-muted-foreground hidden sm:inline">
              {user?.email}
            </span>
            <Button variant="outline" size="sm" onClick={handleSignOut}>
              <LogOut className="h-4 w-4 mr-2" />
              Sign Out
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h2 className="text-2xl font-bold">Welcome to C3 Wizard</h2>
          <p className="text-muted-foreground">
            Manage your social security contributions efficiently
          </p>
        </div>

        {/* Quick Stats */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Profile</CardTitle>
              <User className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{getRoleLabel(role)}</div>
              <p className="text-xs text-muted-foreground">Your account type</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Employees</CardTitle>
              <Building2 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">0</div>
              <p className="text-xs text-muted-foreground">Active employees</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">C3 Forms</CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">0</div>
              <p className="text-xs text-muted-foreground">This year</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Contributions</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">$0.00</div>
              <p className="text-xs text-muted-foreground">YTD total</p>
            </CardContent>
          </Card>
        </div>

        {/* Getting Started */}
        <Card>
          <CardHeader>
            <CardTitle>Getting Started</CardTitle>
            <CardDescription>
              Complete these steps to start using C3 Wizard
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center space-x-4 p-4 rounded-lg bg-muted/50">
                <div className="h-8 w-8 rounded-full bg-primary/20 flex items-center justify-center">
                  <span className="text-sm font-medium text-primary">1</span>
                </div>
                <div>
                  <p className="font-medium">Complete your profile</p>
                  <p className="text-sm text-muted-foreground">Add your contact information and company details</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-4 p-4 rounded-lg bg-muted/50">
                <div className="h-8 w-8 rounded-full bg-muted flex items-center justify-center">
                  <span className="text-sm font-medium text-muted-foreground">2</span>
                </div>
                <div>
                  <p className="font-medium">Add employees</p>
                  <p className="text-sm text-muted-foreground">Register your employees for contribution tracking</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-4 p-4 rounded-lg bg-muted/50">
                <div className="h-8 w-8 rounded-full bg-muted flex items-center justify-center">
                  <span className="text-sm font-medium text-muted-foreground">3</span>
                </div>
                <div>
                  <p className="font-medium">Submit your first C3 form</p>
                  <p className="text-sm text-muted-foreground">Generate and submit monthly contribution reports</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
