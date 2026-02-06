import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, AlertCircle, Eye, EyeOff } from 'lucide-react';
import { RegistrationTypeDialog } from './RegistrationTypeDialog';
import { OTPVerificationDialog } from './OTPVerificationDialog';
import { supabase } from '@/integrations/supabase/client';
 import ssbLogo from '@/assets/ssb-logo.png';

interface UnverifiedUser {
  id: number;
  email: string;
}

export function LoginForm() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [loginSuccessful, setLoginSuccessful] = useState(false);
  const [showRegistrationDialog, setShowRegistrationDialog] = useState(false);
  const [showOTPDialog, setShowOTPDialog] = useState(false);
  const [unverifiedUser, setUnverifiedUser] = useState<UnverifiedUser | null>(null);
  const { signIn, signOut, role, user } = useAuth();
  const navigate = useNavigate();

  // Navigate after role is loaded
  useEffect(() => {
    if (loginSuccessful && user && role) {
      navigate('/dashboard');
    }
  }, [loginSuccessful, user, role, navigate]);

  // Prevent the UI from getting stuck forever if role resolution fails.
  useEffect(() => {
    if (!loginSuccessful) return;
    if (!user) return;
    if (role) return;

    const timeout = window.setTimeout(() => {
      setIsLoading(false);
      setLoginSuccessful(false);
      setError('Login succeeded, but we could not load your access role. Please try again.');
    }, 8000);

    return () => window.clearTimeout(timeout);
  }, [loginSuccessful, user, role]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      // Step 1: Resolve username to email (supports both username and email login)
      let loginEmail = username;
      
      // Check if input looks like an email (contains @)
      if (!username.includes('@')) {
        // It's a username, registration number, or SSN - use secure RPC function
        // This function uses SECURITY DEFINER to bypass RLS for anonymous users
        const { data: foundEmail, error: lookupError } = await supabase
          .rpc('lookup_email_for_login', { login_identifier: username });
        
        if (lookupError || !foundEmail) {
          setError('Account not found. Please check your username, registration number, or SSN.');
          setIsLoading(false);
          return;
        }
        
        loginEmail = foundEmail;
      }

      // Step 2: Authenticate with email
      const { error } = await signIn(loginEmail, password);
      if (error) {
        setError(error.message);
        setIsLoading(false);
        return;
      }

      // Step 3: Check if user is verified (is_verified = true)
      const { data: userData, error: userError } = await supabase
        .from('c3_users')
        .select('id, email, is_verified')
        .eq('email', loginEmail.toLowerCase())
        .maybeSingle();

      if (userError) {
        console.error('Error checking user verification status:', userError);
        setLoginSuccessful(true);
        return;
      }

      // If user not verified, show OTP dialog and sign them out
      if (userData && userData.is_verified === false) {
        // Sign out the user - they shouldn't be logged in until verified
        await signOut();
        
        setUnverifiedUser({ 
          id: userData.id, 
          email: userData.email || loginEmail 
        });
        setShowOTPDialog(true);
        setIsLoading(false);
        
        // Resend OTP for this user
        try {
          await supabase.functions.invoke('verify-otp', {
            body: { userId: userData.id, action: 'resend' }
          });
        } catch (otpError) {
          console.warn('Failed to auto-resend OTP:', otpError);
        }
        return;
      }

      // User is verified - proceed with login
      setLoginSuccessful(true);
    } catch {
      setError('An unexpected error occurred');
      setIsLoading(false);
    }
  };

  const handleOTPVerified = async () => {
    setShowOTPDialog(false);
    setUnverifiedUser(null);
    
    // Now sign in again after verification
    try {
      const { error } = await signIn(unverifiedUser?.email || username, password);
      if (error) {
        setError('Verification successful! Please log in again.');
      } else {
        setLoginSuccessful(true);
        setIsLoading(true);
      }
    } catch {
      setError('Verification successful! Please log in again.');
    }
  };

  return (
    <>
       <div className="w-full max-w-md bg-card rounded-lg shadow-lg p-8">
         {/* Logo and Header */}
         <div className="flex flex-col items-center mb-6">
           <img 
             src={ssbLogo} 
             alt="Social Security Board Logo" 
             className="w-20 h-20 object-contain mb-2"
           />
           <p className="text-xs text-primary italic">Striving for Social Justice</p>
         </div>
         
         <h1 className="text-2xl font-bold text-center text-foreground mb-6">
           Login to your Account
         </h1>
         
        <form onSubmit={handleSubmit}>
           <div className="space-y-4">
            {error && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
            
            <div className="space-y-2">
               <Label htmlFor="username" className="text-sm font-medium text-foreground">
                 User Name <span className="text-destructive">*</span>
              </Label>
              <Input
                id="username"
                type="text"
                 placeholder=""
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                disabled={isLoading}
                 className="bg-accent/50 border-0 h-12"
              />
            </div>
            
            <div className="space-y-2">
               <Label htmlFor="password" className="text-sm font-medium text-foreground">
                Password <span className="text-destructive">*</span>
              </Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                   placeholder=""
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  disabled={isLoading}
                   className="bg-accent/50 border-0 h-12 pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  tabIndex={-1}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            <Button 
              type="submit" 
              variant="outline"
               className="w-full h-12 border-2 border-input bg-white text-primary hover:bg-primary hover:text-primary-foreground font-semibold mt-2"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Logging in...
                </>
              ) : (
                'Login'
              )}
            </Button>
            
             <div className="space-y-3 pt-4">
               <p className="text-sm text-muted-foreground text-left">
                Do not have an account?{' '}
                <button 
                  type="button"
                  onClick={() => setShowRegistrationDialog(true)}
                  className="text-primary hover:underline font-medium"
                >
                  Create an Account
                </button>
              </p>
              <Link 
                to="/forgot-password" 
                 className="text-sm text-primary hover:underline block text-left"
              >
                Forgot Password?
              </Link>
            </div>
           </div>
        </form>
       </div>

      <RegistrationTypeDialog 
        open={showRegistrationDialog} 
        onOpenChange={setShowRegistrationDialog} 
      />

      {unverifiedUser && (
        <OTPVerificationDialog
          open={showOTPDialog}
          onOpenChange={(open) => {
            setShowOTPDialog(open);
            if (!open) {
              setUnverifiedUser(null);
            }
          }}
          email={unverifiedUser.email}
          userId={unverifiedUser.id}
          onVerified={handleOTPVerified}
        />
      )}
    </>
  );
}
