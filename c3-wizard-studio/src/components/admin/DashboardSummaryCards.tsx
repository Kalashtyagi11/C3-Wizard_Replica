import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Building2, Users, UserCircle } from 'lucide-react';

interface SummaryData {
  employerPaid: number;
  employerUnpaid: number;
  nwDirectorsPaid: number;
  nwDirectorsUnpaid: number;
  selfEmployedPaid: number;
  selfEmployedUnpaid: number;
}

interface DashboardSummaryCardsProps {
  data: SummaryData;
}

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'XCD',
    minimumFractionDigits: 2,
  }).format(amount);
};

export function DashboardSummaryCards({ data }: DashboardSummaryCardsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {/* Employer Card */}
      <Card className="border-t-4 border-t-[#1a5c4c]">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium flex items-center gap-2">
            <Building2 className="h-4 w-4 text-[#1a5c4c]" />
            Employer
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex justify-between items-center">
            <div className="text-center flex-1">
              <p className="text-xs text-muted-foreground">Paid</p>
              <p className="text-lg font-bold text-green-600">{formatCurrency(data.employerPaid)}</p>
            </div>
            <div className="h-8 w-px bg-border" />
            <div className="text-center flex-1">
              <p className="text-xs text-muted-foreground">Unpaid</p>
              <p className="text-lg font-bold text-red-500">{formatCurrency(data.employerUnpaid)}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* NW Directors Card */}
      <Card className="border-t-4 border-t-blue-500">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium flex items-center gap-2">
            <Users className="h-4 w-4 text-blue-500" />
            NW Directors
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex justify-between items-center">
            <div className="text-center flex-1">
              <p className="text-xs text-muted-foreground">Paid</p>
              <p className="text-lg font-bold text-green-600">{formatCurrency(data.nwDirectorsPaid)}</p>
            </div>
            <div className="h-8 w-px bg-border" />
            <div className="text-center flex-1">
              <p className="text-xs text-muted-foreground">Unpaid</p>
              <p className="text-lg font-bold text-red-500">{formatCurrency(data.nwDirectorsUnpaid)}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Self Employed Card */}
      <Card className="border-t-4 border-t-orange-500">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium flex items-center gap-2">
            <UserCircle className="h-4 w-4 text-orange-500" />
            Self Employed
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex justify-between items-center">
            <div className="text-center flex-1">
              <p className="text-xs text-muted-foreground">Paid</p>
              <p className="text-lg font-bold text-green-600">{formatCurrency(data.selfEmployedPaid)}</p>
            </div>
            <div className="h-8 w-px bg-border" />
            <div className="text-center flex-1">
              <p className="text-xs text-muted-foreground">Unpaid</p>
              <p className="text-lg font-bold text-red-500">{formatCurrency(data.selfEmployedUnpaid)}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
