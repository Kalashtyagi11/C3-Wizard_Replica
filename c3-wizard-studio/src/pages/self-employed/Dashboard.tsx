/**
 * Self-Employed Dashboard
 * Connected to optimized c3_self_employed and c3_self_employed_contributions tables
 */

import { useEffect, useState } from 'react';
import { DashboardLayout } from '@/components/layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { User, FileText, CreditCard, Plus, TrendingUp, Calendar } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { Skeleton } from '@/components/ui/skeleton';

interface DashboardStats {
  c3Forms: number;
  pendingC3: number;
  totalContributions: number;
  currentMonthContributions: number;
  wageCategory: string | null;
}

interface RecentC3 {
  id: number;
  period_month: string;
  period_year: string;
  declared_income: number;
  is_submitted: boolean;
  is_finalized: boolean;
}

export default function SelfEmployedDashboard() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [recentC3, setRecentC3] = useState<RecentC3[]>([]);
  const [profileName, setProfileName] = useState<string>('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      if (!user?.email) return;

      try {
        // Get self-employed profile from c3_self_employed
        const { data: profile } = await supabase
          .from('c3_self_employed')
          .select('*')
          .eq('email', user.email)
          .maybeSingle();

        if (!profile) {
          setIsLoading(false);
          return;
        }

        setProfileName(`${profile.first_name || ''} ${profile.last_name || ''}`.trim() || 'Self-Employed User');

        // Get wage category name
        let wageCategory = null;
        if (profile.wage_category_id) {
          const { data: category } = await supabase
            .from('c3_wage_categories')
            .select('category_name')
            .eq('id', profile.wage_category_id)
            .single();
          wageCategory = category?.category_name || null;
        }

        // Fetch C3 forms
        const { data: c3Data, count: c3Count } = await supabase
          .from('c3_self_employed_contributions')
          .select('*', { count: 'exact' })
          .eq('social_security_number', profile.social_security_number)
          .order('period_year', { ascending: false })
          .order('period_month', { ascending: false })
          .limit(5);

        // Count pending (not submitted) C3s
        const { count: pendingCount } = await supabase
          .from('c3_self_employed_contributions')
          .select('*', { count: 'exact', head: true })
          .eq('social_security_number', profile.social_security_number)
          .eq('is_submitted', false);

        // Calculate total contributions
        const { data: contributionsData } = await supabase
          .from('c3_self_employed_contributions')
          .select('total_contribution')
          .eq('social_security_number', profile.social_security_number);

        const totalContributions = contributionsData?.reduce((sum, c) => {
          return sum + (c.total_contribution || 0);
        }, 0) || 0;

        // Current month contributions
        const currentMonth = new Date().getMonth() + 1;
        const currentYear = new Date().getFullYear();
        const { data: currentMonthData } = await supabase
          .from('c3_self_employed_contributions')
          .select('total_contribution')
          .eq('social_security_number', profile.social_security_number)
          .eq('period_month', currentMonth.toString())
          .eq('period_year', currentYear.toString());

        const currentMonthContributions = currentMonthData?.reduce((sum, c) => {
          return sum + (c.total_contribution || 0);
        }, 0) || 0;

        setStats({
          c3Forms: c3Count || 0,
          pendingC3: pendingCount || 0,
          totalContributions,
          currentMonthContributions,
          wageCategory,
        });

        setRecentC3(c3Data?.map(c => ({
          id: c.id,
          period_month: c.period_month || '',
          period_year: c.period_year || '',
          declared_income: c.declared_income || 0,
          is_submitted: Boolean(c.is_submitted),
          is_finalized: Boolean(c.is_finalized),
        })) || []);
      } catch (err) {
        console.error('Error fetching dashboard data:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboardData();
  }, [user]);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'XCD',
      minimumFractionDigits: 2,
    }).format(amount);
  };

  const getMonthName = (monthNum: string) => {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const num = parseInt(monthNum);
    return months[num - 1] || monthNum;
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Dashboard</h1>
            <p className="text-muted-foreground">
              {profileName ? `Welcome back, ${profileName}` : 'Overview of your C3 contributions'}
            </p>
          </div>
          <Button onClick={() => navigate('/self-employed/contribution')} className="gap-2">
            <Plus className="h-4 w-4" />
            New Contribution
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Wage Category</CardTitle>
              <User className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <Skeleton className="h-8 w-20" />
              ) : (
                <>
                  <div className="text-lg font-bold truncate">
                    {stats?.wageCategory || 'Not set'}
                  </div>
                  <p className="text-xs text-muted-foreground">Your category</p>
                </>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">C3 Forms</CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <Skeleton className="h-8 w-20" />
              ) : (
                <>
                  <div className="text-2xl font-bold">{stats?.c3Forms ?? 0}</div>
                  <p className="text-xs text-muted-foreground">
                    {stats?.pendingC3 ?? 0} pending
                  </p>
                </>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Contributions</CardTitle>
              <CreditCard className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <Skeleton className="h-8 w-20" />
              ) : (
                <>
                  <div className="text-2xl font-bold">
                    {formatCurrency(stats?.totalContributions ?? 0)}
                  </div>
                  <p className="text-xs text-muted-foreground">All time</p>
                </>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">This Month</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <Skeleton className="h-8 w-20" />
              ) : (
                <>
                  <div className="text-2xl font-bold">
                    {formatCurrency(stats?.currentMonthContributions ?? 0)}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {new Date().toLocaleString('default', { month: 'long', year: 'numeric' })}
                  </p>
                </>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions & Recent C3 */}
        <div className="grid gap-4 lg:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-2">
              <Button 
                variant="outline" 
                className="justify-start gap-2"
                onClick={() => navigate('/self-employed/personal-details')}
              >
                <User className="h-4 w-4" />
                Update Personal Details
              </Button>
              <Button 
                variant="outline" 
                className="justify-start gap-2"
                onClick={() => navigate('/self-employed/contribution')}
              >
                <FileText className="h-4 w-4" />
                Submit New Contribution
              </Button>
              <Button 
                variant="outline" 
                className="justify-start gap-2"
                onClick={() => navigate('/self-employed/payments')}
              >
                <CreditCard className="h-4 w-4" />
                View Payments
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Recent Contributions</CardTitle>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="space-y-2">
                  {[1, 2, 3].map((i) => (
                    <Skeleton key={i} className="h-12 w-full" />
                  ))}
                </div>
              ) : recentC3.length === 0 ? (
                <p className="text-muted-foreground text-center py-4">
                  No contributions yet. Submit your first C3!
                </p>
              ) : (
                <div className="space-y-2">
                  {recentC3.map((c3) => (
                    <div
                      key={c3.id}
                      className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/50 cursor-pointer"
                      onClick={() => navigate(`/self-employed/contribution?id=${c3.id}`)}
                    >
                      <div className="flex items-center gap-3">
                        <Calendar className="h-5 w-5 text-muted-foreground" />
                        <div>
                          <p className="font-medium">
                            {getMonthName(c3.period_month)} {c3.period_year}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            {formatCurrency(c3.declared_income)} income
                          </p>
                        </div>
                      </div>
                      <span
                        className={`px-2 py-1 rounded text-xs ${
                          c3.is_submitted
                            ? 'bg-green-100 text-green-700'
                            : c3.is_finalized
                            ? 'bg-blue-100 text-blue-700'
                            : 'bg-yellow-100 text-yellow-700'
                        }`}
                      >
                        {c3.is_submitted ? 'Submitted' : c3.is_finalized ? 'Finalized' : 'Draft'}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}
