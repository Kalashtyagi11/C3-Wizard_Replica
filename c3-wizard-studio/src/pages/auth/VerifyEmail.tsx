import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { AuthLayout } from '@/components/auth/AuthLayout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { InputOTP, InputOTPGroup, InputOTPSlot } from '@/components/ui/input-otp';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, CheckCircle, Mail, RefreshCw } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export default function VerifyEmail() {
  const navigate = useNavigate();
  const location = useLocation();
  const [otp, setOtp] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [attemptsRemaining, setAttemptsRemaining] = useState(3);
  const [countdown, setCountdown] = useState(0);
  const [isVerified, setIsVerified] = useState(false);

  // Get email from location state
  const email = location.state?.email || '';

  useEffect(() => {
    if (!email) {
      navigate('/login');
    }
  }, [email, navigate]);

  // Countdown timer for resend button
  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);

  const handleVerify = async () => {
    if (otp.length !== 6) {
      setError('Please enter the complete 6-digit code');
      return;
    }

    setIsVerifying(true);
    setError(null);

    try {
      // Call edge function to verify OTP
      const { data, error: verifyError } = await supabase.functions.invoke('validate-registration', {
        body: {
          action: 'verify_otp',
          payload: { email, otp }
        }
      });

      if (verifyError || !data.success) {
        const remaining = attemptsRemaining - 1;
        setAttemptsRemaining(remaining);
        
        if (remaining <= 0) {
          setError('Maximum attempts reached. Please request a new code.');
        } else {
          setError(`Invalid OTP. ${remaining} attempts remaining.`);
        }
        return;
      }

      setIsVerified(true);
      toast.success('Email verified successfully!');
      
      // Redirect to login after a short delay
      setTimeout(() => {
        navigate('/login', { 
          state: { message: 'Email verified! You can now log in.' }
        });
      }, 2000);

    } catch (err) {
      setError('Verification failed. Please try again.');
    } finally {
      setIsVerifying(false);
    }
  };

  const handleResendOTP = async () => {
    if (countdown > 0) return;

    setIsResending(true);
    setError(null);

    try {
      const { data, error: resendError } = await supabase.functions.invoke('send-email', {
        body: {
          to: email,
          template: 'verification_otp',
          data: { email }
        }
      });

      if (resendError) throw resendError;

      toast.success('Verification code sent!');
      setCountdown(60); // 60 second countdown before can resend again
      setAttemptsRemaining(3); // Reset attempts
      setOtp('');

    } catch (err) {
      setError('Failed to resend code. Please try again.');
    } finally {
      setIsResending(false);
    }
  };

  if (isVerified) {
    return (
      <AuthLayout>
        <Card className="w-full max-w-md shadow-lg border-0">
          <CardContent className="pt-8 pb-8">
            <div className="flex flex-col items-center gap-4 text-center">
              <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
                <CheckCircle className="h-8 w-8 text-primary" />
              </div>
              <h2 className="text-xl font-bold text-gray-800">Email Verified!</h2>
              <p className="text-muted-foreground">
                Your account has been activated. Redirecting to login...
              </p>
            </div>
          </CardContent>
        </Card>
      </AuthLayout>
    );
  }

  return (
    <AuthLayout>
      <Card className="w-full max-w-md shadow-lg border-0">
        <CardHeader className="space-y-1 text-center pb-4">
          <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
            <Mail className="h-8 w-8 text-primary" />
          </div>
          <CardTitle className="text-xl font-bold text-gray-800">
            Verification Details
          </CardTitle>
          <CardDescription className="text-sm">
            Your account is not yet active. A verification code has been sent to your registered email address. 
            Please enter the code below to activate your account.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <div className="flex flex-col items-center gap-4">
            <p className="text-sm text-muted-foreground">
              Enter the 6-digit code sent to <strong>{email}</strong>
            </p>
            
            <InputOTP
              maxLength={6}
              value={otp}
              onChange={setOtp}
              disabled={isVerifying || attemptsRemaining <= 0}
            >
              <InputOTPGroup>
                <InputOTPSlot index={0} />
                <InputOTPSlot index={1} />
                <InputOTPSlot index={2} />
                <InputOTPSlot index={3} />
                <InputOTPSlot index={4} />
                <InputOTPSlot index={5} />
              </InputOTPGroup>
            </InputOTP>

            <p className="text-xs text-muted-foreground">
              Code expires in 10 minutes
            </p>
          </div>

          <div className="space-y-3">
            <Button 
              className="w-full" 
              onClick={handleVerify}
              disabled={isVerifying || otp.length !== 6 || attemptsRemaining <= 0}
            >
              {isVerifying ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Verifying...
                </>
              ) : (
                'Verify & Continue'
              )}
            </Button>

            <Button
              variant="outline"
              className="w-full"
              onClick={handleResendOTP}
              disabled={isResending || countdown > 0}
            >
              {isResending ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Sending...
                </>
              ) : countdown > 0 ? (
                <>
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Resend in {countdown}s
                </>
              ) : (
                <>
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Resend Verification Code
                </>
              )}
            </Button>
          </div>

          <div className="text-center">
            <Button 
              variant="link" 
              onClick={() => navigate('/login')}
              className="text-sm text-muted-foreground"
            >
              If Already Have An Account? Please Login Here
            </Button>
          </div>
        </CardContent>
      </Card>
    </AuthLayout>
  );
}
