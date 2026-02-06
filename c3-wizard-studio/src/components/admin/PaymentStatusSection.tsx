import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Building2, UserCircle } from 'lucide-react';

interface PaymentUser {
  id: number;
  name: string;
  period: string;
  status: 'Paid' | 'Unpaid';
}

interface PaymentStatusSectionProps {
  title: string;
  icon: 'employer' | 'self-employed';
  users: PaymentUser[];
}

export function PaymentStatusSection({ title, icon, users }: PaymentStatusSectionProps) {
  const Icon = icon === 'employer' ? Building2 : UserCircle;
  
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-sm font-medium flex items-center gap-2">
          <Icon className="h-4 w-4 text-[#1a5c4c]" />
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent>
        {users.length === 0 ? (
          <p className="text-sm text-muted-foreground text-center py-4">No records found</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {users.map((user) => (
              <div
                key={user.id}
                className="flex items-center justify-between p-3 border rounded-lg bg-muted/30"
              >
                <div className="flex items-center gap-3">
                  <Avatar className="h-8 w-8">
                    <AvatarFallback className="bg-[#1a5c4c] text-white text-xs">
                      {getInitials(user.name)}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="text-sm font-medium">{user.name}</p>
                    <p className="text-xs text-muted-foreground">{user.period}</p>
                  </div>
                </div>
                <Badge 
                  variant={user.status === 'Paid' ? 'default' : 'destructive'}
                  className={user.status === 'Paid' ? 'bg-green-500 hover:bg-green-600' : ''}
                >
                  {user.status}
                </Badge>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
