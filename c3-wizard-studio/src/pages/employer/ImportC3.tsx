/**
 * TEMPORARY PLACEHOLDER
 * 
 * This page is disabled until the database schema is rebuilt with legacy table names.
 */

import { DashboardLayout } from '@/components/layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertCircle, Upload } from 'lucide-react';

export default function ImportC3() {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Import C3</h1>
          <p className="text-muted-foreground">
            Import C3 data from external files
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Upload className="h-5 w-5" />
              Import File
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col items-center justify-center py-8 text-center">
              <AlertCircle className="h-12 w-12 text-yellow-500 mb-4" />
              <p className="text-muted-foreground">
                This feature is temporarily unavailable while the database schema is being rebuilt.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
