import { useState } from 'react';
import { DashboardLayout } from '@/components/layout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { DollarSign, Calendar } from 'lucide-react';
import { useWageCategorySettings } from '@/hooks/useWageCategorySettings';

export default function AdminWageCategorySettings() {
  const { settings, categories, isLoading } = useWageCategorySettings();

  return (
    <DashboardLayout>
      <div className="mt-16 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Self-Employed Settings</h1>
            <p className="text-muted-foreground">Manage wage categories for self-employed contributors</p>
          </div>
        </div>

        {/* Wage Categories */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <DollarSign className="h-5 w-5" />
              Wage Categories
            </CardTitle>
            <CardDescription>Weekly income tiers</CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="space-y-2">
                {[...Array(5)].map((_, i) => (
                  <Skeleton key={i} className="h-12 w-full" />
                ))}
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Category Code</TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead className="text-right">Weekly Income</TableHead>
                    <TableHead className="text-right">Weekly Contribution</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {categories?.map((category) => (
                    <TableRow key={category.id}>
                      <TableCell className="font-medium">{category.category_code}</TableCell>
                      <TableCell>{category.category_name}</TableCell>
                      <TableCell className="text-right">${(category as { weekly_income?: number }).weekly_income?.toFixed(2) || category.min_wage?.toFixed(2) || '0.00'}</TableCell>
                      <TableCell className="text-right">${(category as { weekly_contribution?: number }).weekly_contribution?.toFixed(2) || category.max_wage?.toFixed(2) || '0.00'}</TableCell>
                      <TableCell>{category.description || '-'}</TableCell>
                      <TableCell>
                        <Badge variant={category.is_deleted ? 'secondary' : 'outline'}>
                          {category.is_deleted ? 'Inactive' : 'Active'}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                  {categories?.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center text-muted-foreground py-8">
                        No wage categories found
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
