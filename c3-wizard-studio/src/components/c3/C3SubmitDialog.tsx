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
import { Badge } from '@/components/ui/badge';
import { CheckCircle, AlertTriangle, Send } from 'lucide-react';

interface C3SubmitDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
  month: number;
  year: number;
  totalAmount: number;
  employeeCount: number;
  isSubmitting: boolean;
}

const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

export function C3SubmitDialog({
  open,
  onOpenChange,
  onConfirm,
  month,
  year,
  totalAmount,
  employeeCount,
  isSubmitting,
}: C3SubmitDialogProps) {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'XCD',
    }).format(value);
  };

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle className="flex items-center gap-2 text-[#1a5c4c]">
            <Send className="h-5 w-5" />
            Finalize & Submit C3 Form
          </AlertDialogTitle>
          <AlertDialogDescription className="space-y-4">
            <p>
              You are about to finalize and submit the C3 contribution form for:
            </p>
            
            <div className="bg-muted rounded-lg p-4 space-y-2">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Period:</span>
                <Badge variant="secondary">{MONTHS[month - 1]} {year}</Badge>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Employees:</span>
                <span className="font-medium">{employeeCount}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Total Amount:</span>
                <span className="font-semibold text-[#1a5c4c]">{formatCurrency(totalAmount)}</span>
              </div>
            </div>

            <div className="flex items-start gap-2 p-3 bg-amber-50 rounded-lg text-amber-800 text-sm">
              <AlertTriangle className="h-4 w-4 mt-0.5 flex-shrink-0" />
              <div>
                <strong>Important:</strong> Once submitted, this C3 form cannot be edited. 
                Please ensure all wage information is correct before proceeding.
              </div>
            </div>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isSubmitting}>Cancel</AlertDialogCancel>
          <AlertDialogAction 
            onClick={onConfirm}
            disabled={isSubmitting}
            className="bg-[#45a049] hover:bg-[#3d8b40]"
          >
            {isSubmitting ? 'Submitting...' : 'Finalize & Submit'}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
