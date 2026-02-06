import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useAuth } from '@/hooks/useAuth';
import { useRegistrationValidation } from '@/hooks/useRegistrationValidation';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Loader2, AlertCircle, Search, Eye, EyeOff, ArrowLeft, UserPlus, Upload } from 'lucide-react';
import { toast } from 'sonner';

// Security questions list
const SECURITY_QUESTIONS = [
  "What is your mother's maiden name?",
  "What was the name of your first pet?",
  "What city were you born in?",
  "What is your favorite movie?",
  "What was your childhood nickname?",
  "What is the name of your favorite teacher?",
  "What is your favorite book?",
  "What is the make of your first car?",
];

// Validation schema
const employerSchema = z.object({
  // Organization Basic Details
  registrationNo: z.string()
    .min(1, 'Registration number is required')
    .max(6, 'Registration number cannot exceed 6 digits')
    .regex(/^\d{1,6}$/, 'Registration number must be numeric (max 6 digits)'),
  email: z.string().email('Invalid email address'),
  tradeName: z.string().optional(),
  contactPerson: z.string().optional(),
  mobile: z.string()
    .optional()
    .refine((val) => !val || val.length === 0 || (val.length >= 7 && val.length <= 10), {
      message: 'Mobile number must be 7-10 digits',
    }),
  phone: z.string()
    .optional()
    .refine((val) => !val || val.length === 0 || (val.length >= 7 && val.length <= 15), {
      message: 'Phone number must be 7-15 digits',
    }),
  companyName: z.string().min(1, 'Company name is required'),
  isLevyExempt: z.boolean().default(false),
  
  // Address Details
  address1: z.string().min(1, 'Address is required'),
  address2: z.string().optional(),
  city: z.string().min(1, 'City is required'),
  postalCode: z.string().optional(),
  country: z.string().default('St. Kitts and Nevis'),
  
  // User Profile Details
  firstName: z.string().min(1, 'First name is required'),
  middleName: z.string().optional(),
  lastName: z.string().min(1, 'Last name is required'),
  username: z.string().min(3, 'Username must be at least 3 characters'),
  password: z.string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
    .regex(/[0-9]/, 'Password must contain at least one number')
    .regex(/[!@#$%^&*]/, 'Password must contain at least one special character (!@#$%^&*)'),
  confirmPassword: z.string(),
  securityQuestion1: z.string().min(1, 'Security question is required'),
  securityAnswer1: z.string().min(1, 'Answer is required'),
  securityQuestion2: z.string().min(1, 'Security question is required'),
  securityAnswer2: z.string().min(1, 'Answer is required'),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ['confirmPassword'],
}).refine((data) => data.securityQuestion1 !== data.securityQuestion2, {
  message: 'Please select two different security questions',
  path: ['securityQuestion2'],
}).refine((data) => (data.mobile && data.mobile.trim() !== '') || (data.phone && data.phone.trim() !== ''), {
  message: 'Either mobile number or phone number is required',
  path: ['mobile'],
});

type EmployerFormData = z.infer<typeof employerSchema>;

export function EmployerRegistrationForm() {
  const navigate = useNavigate();
  const { signUp } = useAuth();
  const { isValidating, employerData, validationError, isValidated, validateEmployer } = useRegistrationValidation();
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [profileImage, setProfileImage] = useState<File | null>(null);
  
  // Allowed file types for image uploads
  const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
  const MAX_FILE_SIZE = 2 * 1024 * 1024; // 2MB
  
  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
      toast.error('Invalid file type. Please upload an image (JPG, PNG, GIF, or WebP)');
      e.target.value = '';
      return;
    }
    
    if (file.size > MAX_FILE_SIZE) {
      toast.error('File size too large. Maximum size is 2MB');
      e.target.value = '';
      return;
    }
    
    setLogoFile(file);
  };
  
  const handleProfileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
      toast.error('Invalid file type. Please upload an image (JPG, PNG, GIF, or WebP)');
      e.target.value = '';
      return;
    }
    
    if (file.size > MAX_FILE_SIZE) {
      toast.error('File size too large. Maximum size is 2MB');
      e.target.value = '';
      return;
    }
    
    setProfileImage(file);
  };
  
  // Format registration number - only allow digits, max 6
  const formatRegistrationNo = (value: string) => {
    return value.replace(/\D/g, '').slice(0, 6);
  };
  
  // Format phone/mobile - only allow digits
  const formatPhoneNumber = (value: string) => {
    return value.replace(/\D/g, '').slice(0, 10);
  };

  const form = useForm<EmployerFormData>({
    resolver: zodResolver(employerSchema),
    defaultValues: {
      registrationNo: '',
      email: '',
      tradeName: '',
      contactPerson: '',
      mobile: '',
      phone: '',
      companyName: '',
      isLevyExempt: false,
      address1: '',
      address2: '',
      city: '',
      postalCode: '',
      country: 'St. Kitts and Nevis',
      firstName: '',
      middleName: '',
      lastName: '',
      username: '',
      password: '',
      confirmPassword: '',
      securityQuestion1: '',
      securityAnswer1: '',
      securityQuestion2: '',
      securityAnswer2: '',
    },
  });

  // Populate form when BIMA data is received
  useEffect(() => {
    if (employerData) {
       // Only populate fields if BIMA returns non-empty values
       // This preserves user-entered data and allows editing
       if (employerData.companyName) form.setValue('companyName', employerData.companyName);
       if (employerData.tradeName) form.setValue('tradeName', employerData.tradeName);
       if (employerData.contactPerson) form.setValue('contactPerson', employerData.contactPerson);
       if (employerData.address1) form.setValue('address1', employerData.address1);
       if (employerData.address2) form.setValue('address2', employerData.address2);
       if (employerData.city) form.setValue('city', employerData.city);
       if (employerData.postalCode) form.setValue('postalCode', employerData.postalCode);
       if (employerData.phone) form.setValue('phone', employerData.phone);
       if (employerData.mobile) form.setValue('mobile', employerData.mobile);
       if (employerData.isLevyExempt !== undefined) form.setValue('isLevyExempt', employerData.isLevyExempt);
    }
  }, [employerData, form]);

  const handleValidate = async () => {
    const registrationNo = form.getValues('registrationNo');
    const email = form.getValues('email');
    
    if (!registrationNo) {
      toast.error('Please enter Registration Number to validate');
      return;
    }
    
    if (!email) {
      toast.error('Please enter Email address to validate');
      return;
    }
    
    const result = await validateEmployer(registrationNo, email);
    if (result.success) {
      toast.success('Validation successful! Company details loaded.');
    } else {
      toast.error(result.message);
    }
  };

  const onSubmit = async (data: EmployerFormData) => {
    if (!isValidated) {
      toast.error('Please validate your registration number first');
      return;
    }

    setIsSubmitting(true);

    try {
      // Call the Edge Function for atomic registration
      // This handles: auth user creation, company creation, c3_users creation
      // with proper rollback if anything fails
      const { data: result, error: functionError } = await supabase.functions.invoke('register-employer', {
        body: {
          email: data.email,
          password: data.password,
          firstName: data.firstName,
          middleName: data.middleName || null,
          lastName: data.lastName,
          registrationNo: data.registrationNo,
          companyName: data.companyName,
          tradeName: data.tradeName || null,
          contactPerson: data.contactPerson || null,
          address1: data.address1,
          address2: data.address2 || null,
          city: data.city,
          postalCode: data.postalCode || null,
          country: data.country,
          phone: data.phone || null,
          mobile: data.mobile,
          isLevyExempt: data.isLevyExempt,
          username: data.username,
          securityQuestion1: data.securityQuestion1,
          securityAnswer1: data.securityAnswer1,
          securityQuestion2: data.securityQuestion2,
          securityAnswer2: data.securityAnswer2,
        }
      });

      if (functionError) {
        console.error('Registration function error:', functionError);
        toast.error('Registration failed: ' + functionError.message);
        setIsSubmitting(false);
        return;
      }

      if (!result?.success) {
        console.error('Registration failed:', result);
        toast.error(result?.message || 'Registration failed');
        setIsSubmitting(false);
        return;
      }

      // Registration successful - user is inactive until OTP verification during login
      toast.success('Thank you for registering! Your account is not yet active. A verification code has been sent to your registered email. Please check your inbox to activate your account.');
      navigate('/login');
    } catch (error) {
      console.error('Registration error:', error);
      toast.error('An error occurred during registration');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        {validationError && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{validationError}</AlertDescription>
          </Alert>
        )}

        {/* Organization Basic Details */}
        <div className="space-y-4">
          <h3 className="text-sm font-semibold text-muted-foreground border-b pb-2">
            Organization Basic Details
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex gap-2">
              <FormField
                control={form.control}
                name="registrationNo"
                render={({ field }) => (
                  <FormItem className="flex-1">
                    <FormLabel>Registration No. <span className="text-destructive">*</span></FormLabel>
                    <FormControl>
                      <Input 
                        {...field} 
                        disabled={isValidated} 
                        placeholder="Registration No. (max 6 digits)"
                        maxLength={6}
                        onChange={(e) => field.onChange(formatRegistrationNo(e.target.value))}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            <div className="flex gap-2">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem className="flex-1">
                    <FormLabel>Email <span className="text-destructive">*</span></FormLabel>
                    <div className="flex gap-2">
                      <FormControl>
                        <Input {...field} type="email" disabled={isValidated} placeholder="Email" />
                      </FormControl>
                      <Button 
                        type="button" 
                        variant="outline"
                        size="icon"
                        onClick={handleValidate}
                        disabled={isValidating || isValidated}
                      >
                        {isValidating ? <Loader2 className="h-4 w-4 animate-spin" /> : <Search className="h-4 w-4" />}
                      </Button>
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex flex-col items-center justify-center p-4 border rounded-lg">
              <div className="w-16 h-16 bg-muted rounded-lg flex items-center justify-center mb-2">
                {logoFile ? (
                  <img src={URL.createObjectURL(logoFile)} alt="Logo" className="w-full h-full object-cover rounded-lg" />
                ) : (
                  <Upload className="h-6 w-6 text-muted-foreground" />
                )}
              </div>
              <Label 
                htmlFor="logo-upload" 
                className="text-xs text-primary cursor-pointer hover:underline"
              >
                Upload Company Logo
              </Label>
              <input
                id="logo-upload"
                type="file"
                accept=".jpg,.jpeg,.png,.gif,.webp"
                className="hidden"
                onChange={handleLogoUpload}
              />
            </div>

            <div className="md:col-span-2 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="tradeName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Trade Name</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="Trade Name" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="contactPerson"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Contact Person <span className="text-destructive">*</span></FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="Contact Person" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div>
                <Label className="text-sm text-muted-foreground">
                  Either Enter The Mobile Number OR Phone Number <span className="text-destructive">*</span>
                </Label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
                  <FormField
                    control={form.control}
                    name="mobile"
                    render={({ field }) => (
                      <FormItem>
                        <div className="flex">
                          <div className="flex items-center px-3 bg-muted border border-r-0 rounded-l-md">
                            <span className="text-sm">🇰🇳 +1869</span>
                          </div>
                          <FormControl>
                            <Input 
                              {...field} 
                              className="rounded-l-none" 
                              placeholder="Mobile Number (7-10 digits)"
                              maxLength={10}
                              onChange={(e) => field.onChange(formatPhoneNumber(e.target.value))}
                            />
                          </FormControl>
                        </div>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="phone"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                        <Input 
                          {...field} 
                          placeholder="Phone Number (7-15 digits)"
                          maxLength={15}
                          onChange={(e) => field.onChange(e.target.value.replace(/\D/g, '').slice(0, 15))}
                        />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="companyName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Name of Company <span className="text-destructive">*</span></FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="Name of Company" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="isLevyExempt"
                  render={({ field }) => (
                    <FormItem className="flex items-center space-x-2 pt-6">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <FormLabel className="text-sm font-normal">Is Levy Exempt?</FormLabel>
                    </FormItem>
                  )}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Address Details */}
        <div className="space-y-4">
          <h3 className="text-sm font-semibold text-muted-foreground border-b pb-2">
            Address Details
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="address1"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Address #1 <span className="text-destructive">*</span></FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="Address #1" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="address2"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Address #2</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="Address #2" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="city"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>City <span className="text-destructive">*</span></FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="City" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="postalCode"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Postal Code</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="Postal Code" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="country"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Country</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select country" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="St. Kitts and Nevis">St. Kitts and Nevis</SelectItem>
                      <SelectItem value="Other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>

        {/* User Profile Details */}
        <div className="space-y-4">
          <h3 className="text-sm font-semibold text-muted-foreground border-b pb-2">
            User Profile Details
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex flex-col items-center justify-center p-4 border rounded-lg">
              <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mb-2">
                {profileImage ? (
                  <img src={URL.createObjectURL(profileImage)} alt="Profile" className="w-full h-full object-cover rounded-full" />
                ) : (
                  <Upload className="h-6 w-6 text-muted-foreground" />
                )}
              </div>
              <Label 
                htmlFor="profile-upload" 
                className="text-xs text-primary cursor-pointer hover:underline"
              >
                Upload Profile Image
              </Label>
              <input
                id="profile-upload"
                type="file"
                accept=".jpg,.jpeg,.png,.gif,.webp"
                className="hidden"
                onChange={handleProfileUpload}
              />
            </div>

            <div className="md:col-span-2 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <FormField
                  control={form.control}
                  name="firstName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>First Name <span className="text-destructive">*</span></FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="First Name" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="middleName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Middle Name</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="Middle Name" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="username"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>User Name <span className="text-destructive">*</span></FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="User Name" className="bg-muted" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="lastName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Last Name <span className="text-destructive">*</span></FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="Last Name" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Password <span className="text-destructive">*</span></FormLabel>
                      <div className="relative">
                        <FormControl>
                          <Input 
                            {...field} 
                            type={showPassword ? 'text' : 'password'} 
                            placeholder="Password"
                            className="pr-10 [&::-ms-reveal]:hidden [&::-webkit-contacts-auto-fill-button]:hidden [&::-webkit-credentials-auto-fill-button]:hidden"
                            autoComplete="new-password"
                          />
                        </FormControl>
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                        >
                          {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </button>
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="confirmPassword"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Confirm Password <span className="text-destructive">*</span></FormLabel>
                      <div className="relative">
                        <FormControl>
                          <Input 
                            {...field} 
                            type={showConfirmPassword ? 'text' : 'password'} 
                            placeholder="Confirm Password"
                            className="pr-10 [&::-ms-reveal]:hidden [&::-webkit-contacts-auto-fill-button]:hidden [&::-webkit-credentials-auto-fill-button]:hidden"
                            autoComplete="new-password"
                          />
                        </FormControl>
                        <button
                          type="button"
                          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                        >
                          {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </button>
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="securityQuestion1"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Security Question #1 <span className="text-destructive">*</span></FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a question" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {SECURITY_QUESTIONS.map((q, i) => (
                            <SelectItem key={i} value={q}>{q}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="securityAnswer1"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Answer #1 <span className="text-destructive">*</span></FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="Answer #1" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="securityQuestion2"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Security Question #2 <span className="text-destructive">*</span></FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a question" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {SECURITY_QUESTIONS.map((q, i) => (
                            <SelectItem key={i} value={q}>{q}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="securityAnswer2"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Answer #2 <span className="text-destructive">*</span></FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="Answer #2" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex justify-end gap-4 pt-4 border-t">
          <Link to="/login">
            <Button type="button" variant="outline" className="border-destructive text-destructive hover:bg-destructive hover:text-destructive-foreground">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back To Login
            </Button>
          </Link>
          
          <Button 
            type="submit" 
            disabled={isSubmitting || !isValidated}
            className="bg-primary hover:bg-primary/90"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Registering...
              </>
            ) : (
              <>
                <UserPlus className="mr-2 h-4 w-4" />
                Register
              </>
            )}
          </Button>
        </div>
      </form>
    </Form>
  );
}
