/**
 * Delete Employee Dialog
 * Connected to masteremployee table
 */

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import type { Employee } from '@/hooks/useEmployees';

interface DeleteEmployeeDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  employee: Employee | null;
  onConfirm: () => Promise<void>;
  isLoading?: boolean;
}

export function DeleteEmployeeDialog({
  open,
  onOpenChange,
  employee,
  onConfirm,
  isLoading = false,
}: DeleteEmployeeDialogProps) {
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Deactivate Employee</AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to deactivate{' '}
            <span className="font-semibold">
              {employee?.first_name || ''} {employee?.last_name || ''}
            </span>
            ? The employee will be marked as inactive but data will be preserved.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isLoading}>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={onConfirm}
            disabled={isLoading}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
          >
            {isLoading ? 'Deactivating...' : 'Deactivate'}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
