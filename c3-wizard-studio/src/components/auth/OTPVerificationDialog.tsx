import { useState, useRef, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, AlertCircle, CheckCircle } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface OTPVerificationDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  email: string;
  userId: number;
  onVerified: () => void;
}

export function OTPVerificationDialog({ 
  open, 
  onOpenChange, 
  email,
  userId,
  onVerified 
}: OTPVerificationDialogProps) {
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [isVerifying, setIsVerifying] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [resendCooldown, setResendCooldown] = useState(0);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Countdown timer for resend
  useEffect(() => {
    if (resendCooldown > 0) {
      const timer = setTimeout(() => setResendCooldown(resendCooldown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [resendCooldown]);

  // Focus first input when dialog opens
  useEffect(() => {
    if (open) {
      setTimeout(() => inputRefs.current[0]?.focus(), 100);
    }
  }, [open]);

  const handleInputChange = (index: number, value: string) => {
    // Only allow digits
    if (!/^\d*$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value.slice(-1); // Only take last character
    setOtp(newOtp);
    setError(null);

    // Auto-focus next input
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text').slice(0, 6);
    if (/^\d+$/.test(pastedData)) {
      const newOtp = [...otp];
      pastedData.split('').forEach((char, i) => {
        if (i < 6) newOtp[i] = char;
      });
      setOtp(newOtp);
      // Focus last filled input or next empty one
      const lastIndex = Math.min(pastedData.length, 5);
      inputRefs.current[lastIndex]?.focus();
    }
  };

  const handleVerify = async () => {
    const otpCode = otp.join('');
    if (otpCode.length !== 6) {
      setError('Please enter all 6 digits');
      return;
    }

    setIsVerifying(true);
    setError(null);

    try {
      const { data, error: verifyError } = await supabase.functions.invoke('verify-otp', {
        body: { userId, otpCode }
      });

      if (verifyError || !data?.success) {
        setError(data?.message || 'Invalid or expired verification code');
        setOtp(['', '', '', '', '', '']);
        inputRefs.current[0]?.focus();
        return;
      }

      toast.success('Account verified successfully!');
      onVerified();
    } catch {
      setError('Verification failed. Please try again.');
    } finally {
      setIsVerifying(false);
    }
  };

  const handleResendOTP = async () => {
    setIsResending(true);
    setError(null);

    try {
      const { data, error: resendError } = await supabase.functions.invoke('verify-otp', {
        body: { userId, action: 'resend' }
      });

      if (resendError || !data?.success) {
        toast.error(data?.message || 'Failed to resend code');
        return;
      }

      toast.success('Verification code resent! Check your email.');
      setResendCooldown(60); // 60 second cooldown
      setOtp(['', '', '', '', '', '']);
      inputRefs.current[0]?.focus();
    } catch {
      toast.error('Failed to resend code');
    } finally {
      setIsResending(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-center">
            Verify Your Account
          </DialogTitle>
          <DialogDescription className="text-center">
            A verification code has been sent to <strong>{email}</strong>. 
            Please enter the 6-digit code to activate your account.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <div className="flex justify-center gap-2">
            {otp.map((digit, index) => (
              <Input
                key={index}
                ref={el => inputRefs.current[index] = el}
                type="text"
                inputMode="numeric"
                maxLength={1}
                value={digit}
                onChange={(e) => handleInputChange(index, e.target.value)}
                onKeyDown={(e) => handleKeyDown(index, e)}
                onPaste={handlePaste}
                className="w-12 h-12 text-center text-xl font-bold"
                disabled={isVerifying}
              />
            ))}
          </div>

          <Button 
            onClick={handleVerify} 
            className="w-full bg-primary hover:bg-primary/90"
            disabled={isVerifying || otp.some(d => !d)}
          >
            {isVerifying ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Verifying...
              </>
            ) : (
              <>
                <CheckCircle className="mr-2 h-4 w-4" />
                Verify Account
              </>
            )}
          </Button>

          <div className="text-center">
            <p className="text-sm text-muted-foreground mb-2">
              Didn't receive the code?
            </p>
            <Button
              variant="link"
              onClick={handleResendOTP}
              disabled={isResending || resendCooldown > 0}
              className="text-primary"
            >
              {isResending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Sending...
                </>
              ) : resendCooldown > 0 ? (
                `Resend in ${resendCooldown}s`
              ) : (
                'Resend Code'
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
