/**
 * TEMPORARY PLACEHOLDER - Schema migration in progress
 */
import { DashboardLayout } from '@/components/layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Shield } from 'lucide-react';

export default function AboutUs() {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <h1 className="text-2xl font-bold">About Us</h1>
        <Card><CardHeader><CardTitle className="flex items-center gap-2"><Shield className="h-5 w-5" />Social Security Board</CardTitle></CardHeader>
          <CardContent><p className="text-muted-foreground">Content will be available after schema migration.</p></CardContent></Card>
      </div>
    </DashboardLayout>
  );
}
