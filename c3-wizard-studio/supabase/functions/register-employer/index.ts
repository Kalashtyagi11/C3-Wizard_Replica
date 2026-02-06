import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Field length limits based on database schema
const FIELD_LIMITS = {
  registration_number: 50,
  company_name: 255,
  trade_name: 255,
  contact_person: 200,
  city: 100,
  state: 100,
  postal_code: 20,
  country: 100,
  phone: 50,
  mobile: 50,
  username: 100,
};

// Truncate string to max length safely
function truncate(value: string | null | undefined, maxLength: number): string | null {
  if (!value) return null;
  return value.length > maxLength ? value.substring(0, maxLength) : value;
}

interface EmployerRegistrationPayload {
  // Auth credentials
  email: string;
  password: string;
  firstName: string;
  middleName?: string;
  lastName: string;
  
  // Company details
  registrationNo: string;
  companyName: string;
  tradeName?: string;
  contactPerson?: string;
  address1: string;
  address2?: string;
  city: string;
  postalCode?: string;
  country: string;
  phone?: string;
  mobile: string;
  isLevyExempt: boolean;
  
  // User details
  username: string;
  securityQuestion1: string;
  securityAnswer1: string;
  securityQuestion2: string;
  securityAnswer2: string;
}

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
  const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
  
  // Use service_role to bypass RLS for registration
  const supabase = createClient(supabaseUrl, supabaseServiceKey, {
    auth: { autoRefreshToken: false, persistSession: false }
  });

  try {
    const payload: EmployerRegistrationPayload = await req.json();
    
    // Validate required fields
    if (!payload.email || !payload.password || !payload.registrationNo || !payload.companyName) {
      return new Response(JSON.stringify({
        success: false,
        error: 'MISSING_REQUIRED_FIELDS',
        message: 'Email, password, registration number, and company name are required'
      }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    // Step 1: Check if email already exists in c3_users
    const { data: existingUser } = await supabase
      .from('c3_users')
      .select('id')
      .eq('email', payload.email.toLowerCase())
      .maybeSingle();
    
    if (existingUser) {
      return new Response(JSON.stringify({
        success: false,
        error: 'EMAIL_EXISTS',
        message: 'Email address is already registered'
      }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    // Step 2: Check if username already exists
    const { data: existingUsername } = await supabase
      .from('c3_users')
      .select('id')
      .eq('username', payload.username.toLowerCase())
      .maybeSingle();
    
    if (existingUsername) {
      return new Response(JSON.stringify({
        success: false,
        error: 'USERNAME_EXISTS',
        message: 'Username is already taken'
      }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    // Step 3: Check if registration number already exists
    const { data: existingCompany } = await supabase
      .from('c3_companies')
      .select('id')
      .eq('registration_number', payload.registrationNo)
      .eq('is_deleted', false)
      .maybeSingle();
    
    if (existingCompany) {
      return new Response(JSON.stringify({
        success: false,
        error: 'REGISTRATION_EXISTS',
        message: 'Registration number is already registered'
      }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    // Step 4: Create auth user
    const { data: authData, error: authError } = await supabase.auth.admin.createUser({
      email: payload.email,
      password: payload.password,
      email_confirm: true, // Auto-confirm email
      user_metadata: {
        first_name: payload.firstName,
        last_name: payload.lastName,
      }
    });

    if (authError || !authData.user) {
      console.error('Auth user creation failed:', authError);
      return new Response(JSON.stringify({
        success: false,
        error: 'AUTH_CREATION_FAILED',
        message: authError?.message || 'Failed to create authentication account'
      }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    const authUserId = authData.user.id;

    // Step 5: Create company record
    const { data: company, error: companyError } = await supabase
      .from('c3_companies')
      .insert({
        registration_number: truncate(payload.registrationNo, FIELD_LIMITS.registration_number),
        company_name: truncate(payload.companyName, FIELD_LIMITS.company_name) || 'Unknown',
        trade_name: truncate(payload.tradeName, FIELD_LIMITS.trade_name),
        contact_person: truncate(payload.contactPerson, FIELD_LIMITS.contact_person),
        address_line1: payload.address1,
        address_line2: payload.address2 || null,
        city: truncate(payload.city, FIELD_LIMITS.city),
        postal_code: truncate(payload.postalCode, FIELD_LIMITS.postal_code),
        country: truncate(payload.country, FIELD_LIMITS.country),
        phone: truncate(payload.phone, FIELD_LIMITS.phone),
        mobile: truncate(payload.mobile, FIELD_LIMITS.mobile),
        email: payload.email,
        is_levy_exempt: payload.isLevyExempt,
        is_verified: false,
        is_deleted: false,
      })
      .select('id')
      .single();

    if (companyError || !company) {
      console.error('Company creation failed:', companyError);
      // ROLLBACK: Delete the auth user we just created
      await supabase.auth.admin.deleteUser(authUserId);
      
      return new Response(JSON.stringify({
        success: false,
        error: 'COMPANY_CREATION_FAILED',
        message: companyError?.message || 'Failed to create company record'
      }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    // Step 6: Create c3_users record with role assignment
    // role_id 15 = "Company" (Employer role)
    // Note: is_verified = false - requires OTP verification during login
    const { data: userRecord, error: userError } = await supabase
      .from('c3_users')
      .insert({
        auth_user_id: authUserId,
        email: payload.email.toLowerCase(),
        username: truncate(payload.username.toLowerCase(), FIELD_LIMITS.username) || payload.email.toLowerCase().substring(0, 100),
        role_id: 15, // Company (Employer) role - HARDCODED
        user_type: 'employer',
        company_id: company.id,
        is_verified: false, // INACTIVE until OTP verification
        is_email_verified: false,
        is_deleted: false,
      })
      .select('id')
      .single();

    if (userError || !userRecord) {
      console.error('User record creation failed:', userError);
      // ROLLBACK: Delete company and auth user
      await supabase.from('c3_companies').delete().eq('id', company.id);
      await supabase.auth.admin.deleteUser(authUserId);
      
      return new Response(JSON.stringify({
        success: false,
        error: 'USER_CREATION_FAILED',
        message: userError?.message || 'Failed to create user record'
      }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    // Step 7: Generate OTP and store in c3_user_otps
    const otpCode = Math.floor(100000 + Math.random() * 900000).toString();
    const otpExpiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes
    
    await supabase.from('c3_user_otps').insert({
      user_id: userRecord.id,
      otp_code: otpCode,
      otp_type: 'email_verification',
      expires_at: otpExpiresAt.toISOString(),
      is_used: false,
      is_deleted: false,
    });

    // Step 8: Send OTP verification email (critical)
    try {
      await supabase.functions.invoke('send-email', {
        body: {
          to: payload.email,
          template: 'otp_verification',
          data: {
            name: `${payload.firstName} ${payload.lastName}`,
            code: otpCode
          }
        }
      });
    } catch (emailError) {
      console.warn('OTP email failed:', emailError);
    }

    // Step 9: Send welcome email (non-blocking)
    try {
      await supabase.functions.invoke('send-email', {
        body: {
          to: payload.email,
          template: 'welcome_customer',
          data: {
            name: `${payload.firstName} ${payload.lastName}`,
            loginId: payload.email,
            regNumber: payload.registrationNo,
            companyName: payload.companyName,
            loginUrl: `${supabaseUrl.replace('.supabase.co', '')}/login`,
          }
        }
      });
    } catch (emailError) {
      console.warn('Welcome email failed (non-critical):', emailError);
    }

    // Step 10: Send admin notification (non-blocking)
    try {
      await supabase.functions.invoke('send-email', {
        body: {
          to: 'admin@secureserve.biz',
          template: 'welcome_admin_notification',
          data: {
            companyName: payload.companyName,
            regNumber: payload.registrationNo,
            tradeName: payload.tradeName,
            employmentType: 'Employer',
            isLevyExempt: payload.isLevyExempt,
            contactPerson: payload.contactPerson,
            mobile: payload.mobile,
            email: payload.email,
          }
        }
      });
    } catch (emailError) {
      console.warn('Admin notification failed (non-critical):', emailError);
    }

    // Success response
    return new Response(JSON.stringify({
      success: true,
      message: 'Registration successful',
      data: {
        userId: authUserId,
        companyId: company.id,
        email: payload.email,
      }
    }), {
      status: 200,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error('Registration error:', error);
    return new Response(JSON.stringify({
      success: false,
      error: 'SERVER_ERROR',
      message: error instanceof Error ? error.message : 'An unexpected error occurred'
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }
});
