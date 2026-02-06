import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Building2, Users, UserCircle } from 'lucide-react';

interface ChartData {
  month: string;
  paid: number;
  unpaid: number;
}

interface PaymentOverviewChartProps {
  title: string;
  icon: 'employer' | 'nw-director' | 'self-employed';
  data: ChartData[];
  year: string;
}

export function PaymentOverviewChart({ title, icon, data, year }: PaymentOverviewChartProps) {
  const icons = {
    'employer': Building2,
    'nw-director': Users,
    'self-employed': UserCircle,
  };
  
  const Icon = icons[icon];

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-sm font-medium flex items-center gap-2">
          <Icon className="h-4 w-4 text-[#1a5c4c]" />
          {title} ({year})
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
              <XAxis 
                dataKey="month" 
                tick={{ fontSize: 10 }}
                angle={-45}
                textAnchor="end"
                height={60}
              />
              <YAxis tick={{ fontSize: 10 }} />
              <Tooltip 
                formatter={(value: number) => [
                  new Intl.NumberFormat('en-US', {
                    style: 'currency',
                    currency: 'XCD',
                  }).format(value),
                ]}
              />
              <Legend />
              <Bar dataKey="paid" name="Paid" fill="#22c55e" radius={[4, 4, 0, 0]} />
              <Bar dataKey="unpaid" name="Unpaid" fill="#ef4444" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
