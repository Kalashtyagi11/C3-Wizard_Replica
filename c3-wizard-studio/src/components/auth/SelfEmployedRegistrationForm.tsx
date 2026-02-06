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

// Wage categories - fetched from c3_wage_categories table
interface WageCategory {
  id: number;
  category_code: string | null;
  category_name: string;
  weekly_income: number | null;
  weekly_contribution: number | null;
  is_locked: boolean | null;
}

// Format wage category for display - matches legacy format exactly:
// "A (Weekly Income : 200.00, Weekly Contribution : 20.00)"
function formatWageCategoryDisplay(category: WageCategory): string {
  const income = category.weekly_income?.toFixed(2) ?? '0.00';
  const contribution = category.weekly_contribution?.toFixed(2) ?? '0.00';
  return `${category.category_code} (Weekly Income : ${income}, Weekly Contribution : ${contribution} )`;
}

// Convert date string from various formats to YYYY-MM-DD for HTML date input
function formatDateForInput(dateStr: string | null | undefined): string {
  if (!dateStr) return '';
  
  // Try to parse the date - BIMA might return formats like:
  // "1990-01-15", "01/15/1990", "15-01-1990", "1990-01-15T00:00:00", etc.
  try {
    // Handle ISO format with time
    if (dateStr.includes('T')) {
      dateStr = dateStr.split('T')[0];
    }
    
    // Try parsing as-is first (ISO format YYYY-MM-DD)
    const isoMatch = dateStr.match(/^(\d{4})-(\d{2})-(\d{2})$/);
    if (isoMatch) {
      return dateStr; // Already in correct format
    }
    
    // Handle slash-separated formats (BIMA returns DD/MM/YYYY e.g. 25/09/1959)
    const slashMatch = dateStr.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})$/);
    if (slashMatch) {
      const [, a, b, year] = slashMatch;
      const n1 = Number(a);
      const n2 = Number(b);

      // Disambiguate:
      // - if first part > 12 => it's definitely DD/MM
      // - if second part > 12 => it's definitely MM/DD
      // - otherwise default to DD/MM (regional default)
      const isDayFirst = n1 > 12 ? true : n2 > 12 ? false : true;
      const day = isDayFirst ? a : b;
      const month = isDayFirst ? b : a;

      return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
    }
    
    // Try DD-MM-YYYY or DD/MM/YYYY format
    const euMatch = dateStr.match(/^(\d{1,2})[-\/](\d{1,2})[-\/](\d{4})$/);
    if (euMatch) {
      const [, day, month, year] = euMatch;
      return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
    }
    
    // Fallback: try Date parsing
    const date = new Date(dateStr);
    if (!isNaN(date.getTime())) {
      return date.toISOString().split('T')[0];
    }
    
    return '';
  } catch {
    return '';
  }
}

// Validation schema
const selfEmployedSchema = z.object({
  // Self Employed Basic Details
  ssn: z.string()
    .min(1, 'Social Security Number is required')
    .max(9, 'SSN cannot exceed 9 digits')
    .regex(/^\d{6,9}$/, 'SSN must be 6-9 digits'),
  email: z.string().email('Invalid email address'),
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  dateOfBirth: z.string().min(1, 'Date of birth is required'),
  wageCategory: z.string().min(1, 'Wage category is required'),
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
  tin: z.string().optional(),
  
  // Address Details
  address1: z.string().min(1, 'Address is required'),
  address2: z.string().optional(),
  city: z.string().min(1, 'City is required'),
  postalCode: z.string().optional(),
  country: z.string().default('St. Kitts and Nevis'),
  
  // User Profile Details
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

type SelfEmployedFormData = z.infer<typeof selfEmployedSchema>;

export function SelfEmployedRegistrationForm() {
  const navigate = useNavigate();
  const { signUp } = useAuth();
  const { isValidating, selfEmployedData, validationError, isValidated, validateSelfEmployed } = useRegistrationValidation();
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [profileImage, setProfileImage] = useState<File | null>(null);
  const [wageCategories, setWageCategories] = useState<WageCategory[]>([]);
  
  // Allowed file types for image uploads
  const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
  const MAX_FILE_SIZE = 2 * 1024 * 1024; // 2MB
  
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
  
  // Format phone/mobile - only allow digits
  const formatPhoneNumber = (value: string) => {
    return value.replace(/\D/g, '').slice(0, 10);
  };

  // Fetch wage categories on mount - filter by is_locked=true (active categories only)
  useEffect(() => {
    const fetchWageCategories = async () => {
      const { data, error } = await supabase
        .from('c3_wage_categories')
        .select('id, category_code, category_name, weekly_income, weekly_contribution, is_locked')
        .eq('is_deleted', false)
        .eq('is_locked', true)
        .order('weekly_income', { ascending: true });
      
      if (!error && data) {
        // Remove duplicates by category_code (keep first occurrence)
        const uniqueCategories = data.reduce((acc: WageCategory[], cat) => {
          if (!acc.find(c => c.category_code === cat.category_code)) {
            acc.push(cat as WageCategory);
          }
          return acc;
        }, []);
        setWageCategories(uniqueCategories);
      }
    };
    fetchWageCategories();
  }, []);

  const form = useForm<SelfEmployedFormData>({
    resolver: zodResolver(selfEmployedSchema),
    defaultValues: {
      ssn: '',
      email: '',
      firstName: '',
      lastName: '',
      dateOfBirth: '',
      wageCategory: '',
      mobile: '',
      phone: '',
      tin: '',
      address1: '',
      address2: '',
      city: '',
      postalCode: '',
      country: 'St. Kitts and Nevis',
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
    if (selfEmployedData) {
       // Only populate fields if BIMA returns non-empty values
       // This preserves user-entered data and allows editing
       if (selfEmployedData.firstName) form.setValue('firstName', selfEmployedData.firstName);
       if (selfEmployedData.lastName) form.setValue('lastName', selfEmployedData.lastName);
       const formattedDob = formatDateForInput(selfEmployedData.dateOfBirth);
       if (formattedDob) form.setValue('dateOfBirth', formattedDob);
       if (selfEmployedData.address1) form.setValue('address1', selfEmployedData.address1);
       if (selfEmployedData.address2) form.setValue('address2', selfEmployedData.address2);
       if (selfEmployedData.city) form.setValue('city', selfEmployedData.city);
       if (selfEmployedData.phone) form.setValue('phone', selfEmployedData.phone);
       if (selfEmployedData.mobile) form.setValue('mobile', selfEmployedData.mobile);
       if (selfEmployedData.tin) form.setValue('tin', selfEmployedData.tin);
      
      // BIMA returns wageCategory as a code (e.g., "B")
      // We need to find the matching category by code and set the form value to its ID
      if (selfEmployedData.wageCategory && wageCategories.length > 0) {
        const matchedCategory = wageCategories.find(
          cat => cat.category_code?.toUpperCase() === selfEmployedData.wageCategory?.toUpperCase()
        );
        if (matchedCategory) {
          form.setValue('wageCategory', matchedCategory.id.toString());
        }
      }
      // Set username to email prefix by default
      if (selfEmployedData.email) {
        const emailPrefix = selfEmployedData.email.split('@')[0];
        form.setValue('username', emailPrefix);
      }
    }
  }, [selfEmployedData, form, wageCategories]);

  const handleValidate = async () => {
    const ssn = form.getValues('ssn');
    const email = form.getValues('email');
    
    if (!ssn) {
      toast.error('Please enter Social Security Number to validate');
      return;
    }
    
    if (!email) {
      toast.error('Please enter Email address to validate');
      return;
    }
    
    // Strip dashes and spaces from SSN before sending to BIMA API
    const cleanedSSN = ssn.replace(/[-\s]/g, '');
    
    const result = await validateSelfEmployed(cleanedSSN, email);
    if (result.success) {
      toast.success('Validation successful! Details loaded.');
    } else {
      toast.error(result.message);
    }
  };

  const onSubmit = async (data: SelfEmployedFormData) => {
    if (!isValidated) {
      toast.error('Please validate your SSN first');
      return;
    }

    setIsSubmitting(true);

    try {
      // Use atomic edge function for registration
      // This creates: auth.users + c3_self_employed + c3_users in a single transaction
      const { data: result, error } = await supabase.functions.invoke('register-self-employed', {
        body: {
          email: data.email,
          password: data.password,
          firstName: data.firstName,
          lastName: data.lastName,
          ssn: data.ssn,
          dateOfBirth: data.dateOfBirth,
          wageCategoryId: parseInt(data.wageCategory),
          tin: data.tin || null,
          address1: data.address1,
          address2: data.address2 || null,
          city: data.city,
          postalCode: data.postalCode || null,
          country: data.country,
          phone: data.phone || null,
          mobile: data.mobile,
          username: data.username,
          securityQuestion1: data.securityQuestion1,
          securityAnswer1: data.securityAnswer1,
          securityQuestion2: data.securityQuestion2,
          securityAnswer2: data.securityAnswer2,
        }
      });

      if (error) {
        console.error('Registration error:', error);
        toast.error('An error occurred during registration');
        return;
      }

      if (!result.success) {
        // Handle specific error codes
        switch (result.error) {
          case 'EMAIL_EXISTS':
            toast.error('Email address is already registered');
            break;
          case 'USERNAME_EXISTS':
            toast.error('Username is already taken');
            break;
          case 'SSN_EXISTS':
            toast.error('Social Security Number is already registered');
            break;
          default:
            toast.error(result.message || 'Registration failed');
        }
        return;
      }

      toast.success('Thank you for registering! Your account is not yet active. A verification code has been sent to your registered email. Please check your inbox to activate your account.');
      navigate('/login');
    } catch (error) {
      console.error('Registration error:', error);
      toast.error('An error occurred during registration');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Format SSN as user types (XXX-XX-XXXX)
  const formatSSN = (value: string) => {
     // Remove any non-digit characters and return plain digits only
     return value.replace(/\D/g, '').slice(0, 9);
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

        {/* Self Employed Basic Details */}
        <div className="space-y-4">
          <h3 className="text-sm font-semibold text-muted-foreground border-b pb-2">
            Self Employed Basic Details
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="ssn"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Social Security Number <span className="text-destructive">*</span></FormLabel>
                  <FormControl>
                    <Input 
                      {...field} 
                      disabled={isValidated}
                       placeholder="Enter SSN (digits only)"
                       maxLength={9}
                      onChange={(e) => field.onChange(formatSSN(e.target.value))}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
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

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
              name="dateOfBirth"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Date of Birth <span className="text-destructive">*</span></FormLabel>
                  <FormControl>
                    <Input {...field} type="date" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="wageCategory"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Wage Category <span className="text-destructive">*</span></FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select wage category" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent className="bg-background border shadow-lg">
                      {wageCategories.map((cat) => (
                        <SelectItem key={cat.id} value={cat.id.toString()}>
                          {formatWageCategoryDisplay(cat)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
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
              name="tin"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tin Number</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="Tin Number" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
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
                  <FormLabel>Address1 <span className="text-destructive">*</span></FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="Address1" />
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
                htmlFor="profile-upload-se" 
                className="text-xs text-primary cursor-pointer hover:underline"
              >
                Upload Profile Picture
              </Label>
              <input
                id="profile-upload-se"
                type="file"
                accept=".jpg,.jpeg,.png,.gif,.webp"
                className="hidden"
                onChange={handleProfileUpload}
              />
            </div>

            <div className="md:col-span-2 space-y-4">
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
