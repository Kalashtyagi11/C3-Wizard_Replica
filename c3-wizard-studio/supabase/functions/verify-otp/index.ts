import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Test email override - all emails redirect here during development
const TEST_EMAIL_OVERRIDE = 'kalash@yopmail.com';

// Generate 6-digit OTP
function generateOTP(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
  const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
  
  const supabase = createClient(supabaseUrl, supabaseServiceKey, {
    auth: { autoRefreshToken: false, persistSession: false }
  });

  try {
    const { userId, otpCode, action } = await req.json();
    
    if (!userId) {
      return new Response(JSON.stringify({
        success: false,
        error: 'MISSING_USER_ID',
        message: 'User ID is required'
      }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    // Handle resend action
    if (action === 'resend') {
      return await handleResendOTP(supabase, userId);
    }

    // Validate OTP
    if (!otpCode) {
      return new Response(JSON.stringify({
        success: false,
        error: 'MISSING_OTP',
        message: 'OTP code is required'
      }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    // Get the latest valid OTP for this user
    const { data: otpRecord, error: otpError } = await supabase
      .from('c3_user_otps')
      .select('id, otp_code, expires_at, is_used')
      .eq('user_id', userId)
      .eq('otp_type', 'email_verification')
      .eq('is_used', false)
      .eq('is_deleted', false)
      .gt('expires_at', new Date().toISOString())
      .order('created_at', { ascending: false })
      .limit(1)
      .maybeSingle();

    if (otpError) {
      console.error('Error fetching OTP:', otpError);
      return new Response(JSON.stringify({
        success: false,
        error: 'DATABASE_ERROR',
        message: 'Error validating OTP'
      }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    if (!otpRecord) {
      return new Response(JSON.stringify({
        success: false,
        error: 'OTP_NOT_FOUND',
        message: 'No valid verification code found. Please request a new one.'
      }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    // Validate OTP code
    if (otpRecord.otp_code !== otpCode) {
      return new Response(JSON.stringify({
        success: false,
        error: 'INVALID_OTP',
        message: 'Invalid verification code. Please try again.'
      }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    // Mark OTP as used
    await supabase
      .from('c3_user_otps')
      .update({ 
        is_used: true, 
        used_at: new Date().toISOString() 
      })
      .eq('id', otpRecord.id);

    // Activate the user - set is_verified = true
    const { error: updateError } = await supabase
      .from('c3_users')
      .update({ 
        is_verified: true,
        is_email_verified: true,
        updated_at: new Date().toISOString()
      })
      .eq('id', userId);

    if (updateError) {
      console.error('Error activating user:', updateError);
      return new Response(JSON.stringify({
        success: false,
        error: 'ACTIVATION_FAILED',
        message: 'Failed to activate account'
      }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    // Log the verification in audit
    await supabase.from('c3_audit_logs').insert({
      event_type: 'USER_ACTIVATED',
      action: 'OTP_VERIFICATION',
      user_id: userId,
      message: 'User account activated via OTP verification',
      created_at: new Date().toISOString()
    });

    return new Response(JSON.stringify({
      success: true,
      message: 'Account verified successfully'
    }), {
      status: 200,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error('Verification error:', error);
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

async function handleResendOTP(supabase: any, userId: number) {
  try {
    // Get user email
    const { data: user, error: userError } = await supabase
      .from('c3_users')
      .select('email, username')
      .eq('id', userId)
      .single();

    if (userError || !user) {
      return new Response(JSON.stringify({
        success: false,
        error: 'USER_NOT_FOUND',
        message: 'User not found'
      }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    // Invalidate any existing unused OTPs
    await supabase
      .from('c3_user_otps')
      .update({ is_deleted: true })
      .eq('user_id', userId)
      .eq('otp_type', 'email_verification')
      .eq('is_used', false);

    // Generate new OTP
    const newOtp = generateOTP();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    // Insert new OTP
    const { error: insertError } = await supabase
      .from('c3_user_otps')
      .insert({
        user_id: userId,
        otp_code: newOtp,
        otp_type: 'email_verification',
        expires_at: expiresAt.toISOString(),
        is_used: false,
        is_deleted: false
      });

    if (insertError) {
      console.error('Error inserting OTP:', insertError);
      return new Response(JSON.stringify({
        success: false,
        error: 'OTP_GENERATION_FAILED',
        message: 'Failed to generate new code'
      }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    // Send email with OTP
    await supabase.functions.invoke('send-email', {
        body: {
          to: user.email,
          template: 'otp_verification',
          data: {
            name: user.username,
            code: newOtp
        }
      }
    });

    return new Response(JSON.stringify({
      success: true,
      message: 'Verification code sent'
    }), {
      status: 200,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error('Resend OTP error:', error);
    return new Response(JSON.stringify({
      success: false,
      error: 'SERVER_ERROR',
      message: 'Failed to resend code'
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }
}
