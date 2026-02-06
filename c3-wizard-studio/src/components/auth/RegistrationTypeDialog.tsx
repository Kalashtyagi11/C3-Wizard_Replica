import { useNavigate } from 'react-router-dom';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Building2, User } from 'lucide-react';

interface RegistrationTypeDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function RegistrationTypeDialog({ open, onOpenChange }: RegistrationTypeDialogProps) {
  const navigate = useNavigate();

  const handleSelectType = (type: 'employer' | 'self-employed') => {
    onOpenChange(false);
    navigate(`/signup?type=${type}`);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-lg font-semibold">Select Registration Type</DialogTitle>
        </DialogHeader>
        
        <div className="py-4">
          <p className="text-sm text-muted-foreground mb-6">
            Please select the type of account you want to create:
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4">
            <Button
              variant="outline"
              className="flex-1 h-auto py-4 border-primary text-primary hover:bg-primary hover:text-primary-foreground"
              onClick={() => handleSelectType('employer')}
            >
              <Building2 className="mr-2 h-5 w-5" />
              Employer Registration
            </Button>
            
            <Button
              variant="outline"
              className="flex-1 h-auto py-4 border-primary text-primary hover:bg-primary hover:text-primary-foreground"
              onClick={() => handleSelectType('self-employed')}
            >
              <User className="mr-2 h-5 w-5" />
              Self Employed Registration
            </Button>
          </div>
        </div>
        
        <div className="flex justify-end">
          <Button 
            variant="outline" 
            onClick={() => onOpenChange(false)}
            className="border-destructive text-destructive hover:bg-destructive hover:text-destructive-foreground"
          >
            Cancel
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
