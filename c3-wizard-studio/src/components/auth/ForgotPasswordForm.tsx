import { useState } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, AlertCircle, ArrowRight, CheckCircle2 } from 'lucide-react';
import { toast } from 'sonner';

export function ForgotPasswordForm() {
  const [step, setStep] = useState<'request' | 'success'>('request');
  const [registrationNo, setRegistrationNo] = useState('');
  const [username, setUsername] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      // First, find the user's email by registration number and username
      // Check in c3_users table
      const { data: userData, error: userError } = await supabase
        .from('c3_users')
        .select('email, id')
        .or(`login_id.eq.${username},email.eq.${username}`)
        .maybeSingle();

      if (userError || !userData) {
        setError('User not found. Please check your registration number and username.');
        setIsLoading(false);
        return;
      }

      // Now send password reset email via Supabase Auth
      const { error: resetError } = await supabase.auth.resetPasswordForEmail(userData.email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });
      
      if (resetError) {
        setError(resetError.message);
        setIsLoading(false);
        return;
      }

      // Also send via our custom email function for better tracking
      await supabase.functions.invoke('send-email', {
        body: {
          to: userData.email,
          template: 'password_reset',
          data: {
            name: username,
            resetUrl: `${window.location.origin}/reset-password`,
          }
        }
      });

      setStep('success');
      toast.success('Password reset instructions sent!');
    } catch {
      setError('An unexpected error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  if (step === 'success') {
    return (
      <Card className="w-full max-w-md shadow-lg border-0">
        <CardHeader className="space-y-1 text-center pb-4">
          <CardTitle className="text-xl font-bold text-primary">
            Check Your Email
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-col items-center gap-4 py-4">
            <CheckCircle2 className="h-12 w-12 text-primary" />
            <p className="text-center text-muted-foreground">
              We've sent password reset instructions to your registered email address. 
              Please check your inbox.
            </p>
          </div>
          <Link to="/login" className="block">
            <Button 
              variant="outline" 
              className="w-full border-primary text-primary hover:bg-primary hover:text-primary-foreground"
            >
              Login Here
            </Button>
          </Link>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-md shadow-lg border-0">
      <CardHeader className="space-y-1 text-center pb-4">
        <CardTitle className="text-xl font-bold text-primary">
          Forgot Password
        </CardTitle>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          
          <div className="space-y-2">
            <Label htmlFor="registrationNo" className="text-foreground">
              Registration No. <span className="text-destructive">*</span>
            </Label>
            <Input
              id="registrationNo"
              type="text"
              placeholder="Registration No."
              value={registrationNo}
              onChange={(e) => setRegistrationNo(e.target.value)}
              required
              disabled={isLoading}
              className="bg-accent/30 border-input"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="username" className="text-foreground">
              User Name <span className="text-destructive">*</span>
            </Label>
            <Input
              id="username"
              type="text"
              placeholder="User Name"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              disabled={isLoading}
              className="bg-accent/30 border-input"
            />
          </div>

          <Button 
            type="submit" 
            variant="outline"
            className="w-full border-primary text-primary hover:bg-primary hover:text-primary-foreground font-medium"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Processing...
              </>
            ) : (
              <>
                Next
                <ArrowRight className="ml-2 h-4 w-4" />
              </>
            )}
          </Button>
          
          <div className="text-center pt-2">
            <p className="text-sm text-muted-foreground">
              If you already have an account, please{' '}
              <Link 
                to="/login" 
                className="text-primary hover:underline font-medium"
              >
                Login Here
              </Link>
            </p>
          </div>
        </CardContent>
      </form>
    </Card>
  );
}
