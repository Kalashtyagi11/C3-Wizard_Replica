-- First create the update_updated_at_column function if it doesn't exist
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create email_templates table for dynamic email template management
CREATE TABLE public.email_templates (
  id SERIAL PRIMARY KEY,
  template_key VARCHAR(100) NOT NULL UNIQUE,
  template_name VARCHAR(200) NOT NULL,
  subject VARCHAR(500) NOT NULL,
  html_body TEXT NOT NULL,
  text_body TEXT,
  from_module VARCHAR(50) NOT NULL DEFAULT 'notifications',
  variables JSONB DEFAULT '[]'::jsonb,
  is_active BOOLEAN NOT NULL DEFAULT true,
  is_deleted BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  created_by INTEGER,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_by INTEGER
);

-- Add comments for documentation
COMMENT ON TABLE public.email_templates IS 'Stores email templates for dynamic email content management';
COMMENT ON COLUMN public.email_templates.template_key IS 'Unique identifier used in code (e.g., welcome_customer, otp_verification)';
COMMENT ON COLUMN public.email_templates.from_module IS 'Email module for from address (registration, identity, finance, etc.)';
COMMENT ON COLUMN public.email_templates.variables IS 'JSON array of variable names used in template';

-- Enable RLS
ALTER TABLE public.email_templates ENABLE ROW LEVEL SECURITY;

-- Allow public read access for edge functions (using service role)
CREATE POLICY "Anyone can read active templates"
ON public.email_templates
FOR SELECT
USING (is_active = true AND is_deleted = false);

-- Create updated_at trigger
CREATE TRIGGER update_email_templates_updated_at
  BEFORE UPDATE ON public.email_templates
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Create index for faster lookups
CREATE INDEX idx_email_templates_key ON public.email_templates(template_key) WHERE is_deleted = false AND is_active = true;

-- Insert default templates
INSERT INTO public.email_templates (template_key, template_name, subject, html_body, from_module, variables) VALUES
('welcome_customer', 'Welcome Customer Email', 'C3 Remittances — Account Information', 
'<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
  <div style="background: #0d9488; color: white; padding: 20px; text-align: center;"><h1>Welcome to C3 Wizard</h1></div>
  <div style="padding: 20px; background: #f9fafb;">
    <p>Dear {{name}},</p>
    <p>Your account has been successfully created.</p>
    <div style="background: white; padding: 15px; border-radius: 4px; margin: 10px 0;">
      <p><strong>Login ID:</strong> {{loginId}}</p>
      <p><strong>Registration Number:</strong> {{regNumber}}</p>
      <p><strong>Country:</strong> {{country}}</p>
    </div>
    <p>You can now log in to the C3 Wizard portal.</p>
    <p><a href="{{loginUrl}}" style="display: inline-block; padding: 12px 24px; background: #0d9488; color: white; text-decoration: none; border-radius: 4px;">Login to Portal</a></p>
  </div>
  <div style="padding: 20px; text-align: center; font-size: 12px; color: #666;"><p>St. Kitts & Nevis Social Security Board</p></div>
</div>', 'registration', '["name", "loginId", "regNumber", "country", "loginUrl"]'),

('welcome_admin_notification', 'New Registration Admin Alert', 'New C3 Wizard Portal Registration Request {{regNumber}} {{companyName}}',
'<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
  <div style="background: #0d9488; color: white; padding: 20px; text-align: center;"><h1>New Registration Alert</h1></div>
  <div style="padding: 20px; background: #f9fafb;">
    <p>A new registration has been submitted:</p>
    <div style="background: white; padding: 15px; border-radius: 4px; margin: 10px 0;">
      <p><strong>Company Name:</strong> {{companyName}}</p>
      <p><strong>Registration Number:</strong> {{regNumber}}</p>
      <p><strong>Trade Name:</strong> {{tradeName}}</p>
      <p><strong>Type:</strong> {{employmentType}}</p>
      <p><strong>Contact Person:</strong> {{contactPerson}}</p>
      <p><strong>Mobile:</strong> {{mobile}}</p>
      <p><strong>Email:</strong> {{email}}</p>
    </div>
  </div>
  <div style="padding: 20px; text-align: center; font-size: 12px; color: #666;"><p>C3 Wizard Admin Notification</p></div>
</div>', 'internal', '["companyName", "regNumber", "tradeName", "employmentType", "contactPerson", "mobile", "email"]'),

('otp_verification', 'OTP Verification Email', 'C3 Remittances — Login OTP',
'<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
  <div style="background: #0d9488; color: white; padding: 20px; text-align: center;"><h1>Verification Code</h1></div>
  <div style="padding: 20px; background: #f9fafb;">
    <p>Dear {{name}},</p>
    <p>Your verification code is:</p>
    <div style="background: white; padding: 15px; border-radius: 4px; margin: 10px 0; text-align: center; font-size: 32px; font-weight: bold; letter-spacing: 5px;">{{code}}</div>
    <p>This code will expire in 10 minutes.</p>
  </div>
  <div style="padding: 20px; text-align: center; font-size: 12px; color: #666;"><p>St. Kitts & Nevis Social Security Board</p></div>
</div>', 'identity', '["name", "code"]'),

('password_reset', 'Password Reset Email', 'C3 Wizard Reset Your Password!',
'<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
  <div style="background: #0d9488; color: white; padding: 20px; text-align: center;"><h1>Password Reset</h1></div>
  <div style="padding: 20px; background: #f9fafb;">
    <p>Dear {{name}},</p>
    <p>You requested to reset your password. Click the button below:</p>
    <p style="text-align: center;"><a href="{{resetUrl}}" style="display: inline-block; padding: 12px 24px; background: #0d9488; color: white; text-decoration: none; border-radius: 4px;">Reset Password</a></p>
    <p>This link will expire in 1 hour.</p>
  </div>
  <div style="padding: 20px; text-align: center; font-size: 12px; color: #666;"><p>St. Kitts & Nevis Social Security Board</p></div>
</div>', 'identity', '["name", "resetUrl"]'),

('payment_receipt', 'Payment Receipt Email', 'C3 Remittances Transaction {{name}}',
'<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
  <div style="background: #0d9488; color: white; padding: 20px; text-align: center;"><h1>Payment Receipt</h1></div>
  <div style="padding: 20px; background: #f9fafb;">
    <p>Dear {{name}},</p>
    <p>Your payment has been processed successfully.</p>
    <div style="background: white; padding: 15px; border-radius: 4px; margin: 10px 0;">
      <p><strong>Receipt Number:</strong> {{receiptNumber}}</p>
      <p><strong>Amount:</strong> ${{amount}}</p>
      <p><strong>Date:</strong> {{date}}</p>
      <p><strong>Period:</strong> {{period}}</p>
      <p><strong>Status:</strong> {{paymentStatus}}</p>
    </div>
  </div>
  <div style="padding: 20px; text-align: center; font-size: 12px; color: #666;"><p>St. Kitts & Nevis Social Security Board</p></div>
</div>', 'finance', '["name", "receiptNumber", "amount", "date", "period", "paymentStatus"]'),

('account_activation', 'Account Activation Email', 'C3 Remittances — Account Activation',
'<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
  <div style="background: #0d9488; color: white; padding: 20px; text-align: center;"><h1>Account Activated</h1></div>
  <div style="padding: 20px; background: #f9fafb;">
    <p>Dear {{name}},</p>
    <p>Your C3 Wizard account has been <strong>activated</strong>.</p>
    <p><a href="{{loginUrl}}" style="display: inline-block; padding: 12px 24px; background: #0d9488; color: white; text-decoration: none; border-radius: 4px;">Login Now</a></p>
  </div>
  <div style="padding: 20px; text-align: center; font-size: 12px; color: #666;"><p>St. Kitts & Nevis Social Security Board</p></div>
</div>', 'registration', '["name", "loginUrl"]'),

('account_deactivation', 'Account Deactivation Email', 'C3 Remittances — Account Deactivation',
'<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
  <div style="background: #dc2626; color: white; padding: 20px; text-align: center;"><h1>Account Deactivated</h1></div>
  <div style="padding: 20px; background: #f9fafb;">
    <p>Dear {{name}},</p>
    <p>Your C3 Wizard account has been <strong>deactivated</strong>.</p>
    <p>If you believe this is an error, please contact support.</p>
  </div>
  <div style="padding: 20px; text-align: center; font-size: 12px; color: #666;"><p>St. Kitts & Nevis Social Security Board</p></div>
</div>', 'registration', '["name"]'),

('c3_submission_confirmation', 'C3 Form Submitted', 'C3 Form Submitted - {{period}}',
'<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
  <div style="background: #0d9488; color: white; padding: 20px; text-align: center;"><h1>C3 Form Submitted</h1></div>
  <div style="padding: 20px; background: #f9fafb;">
    <p>Dear {{name}},</p>
    <p>Your C3 contribution form has been submitted.</p>
    <div style="background: white; padding: 15px; border-radius: 4px; margin: 10px 0;">
      <p><strong>Period:</strong> {{period}}</p>
      <p><strong>Employees:</strong> {{employeeCount}}</p>
      <p><strong>Total Amount:</strong> ${{totalAmount}}</p>
    </div>
  </div>
  <div style="padding: 20px; text-align: center; font-size: 12px; color: #666;"><p>St. Kitts & Nevis Social Security Board</p></div>
</div>', 'contributions', '["name", "period", "employeeCount", "totalAmount"]');