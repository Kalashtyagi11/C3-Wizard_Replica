-- Email Templates Table (based on knowledge/12_email_notifications.md)
-- Stores templates for emails, PDFs, and SMS notifications

CREATE TABLE public.email_templates (
    id SERIAL PRIMARY KEY,
    template_code VARCHAR(100) NOT NULL UNIQUE,
    template_type VARCHAR(20) NOT NULL DEFAULT 'email' CHECK (template_type IN ('email', 'pdf', 'sms')),
    template_name VARCHAR(255) NOT NULL,
    legacy_template VARCHAR(255),
    subject VARCHAR(500),
    html_body TEXT,
    text_body TEXT,
    variables JSONB DEFAULT '[]',
    description TEXT,
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    created_by INTEGER,
    updated_by INTEGER
);

-- Create indexes
CREATE INDEX idx_email_templates_code ON public.email_templates(template_code);
CREATE INDEX idx_email_templates_type ON public.email_templates(template_type);
CREATE INDEX idx_email_templates_active ON public.email_templates(is_active);

-- Enable RLS
ALTER TABLE public.email_templates ENABLE ROW LEVEL SECURITY;

-- RLS Policies (using existing has_role function)
CREATE POLICY "Admins can manage email templates"
ON public.email_templates
FOR ALL
USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Authenticated users can read active templates"
ON public.email_templates
FOR SELECT
USING (auth.role() = 'authenticated' AND is_active = true);

-- Insert default templates based on knowledge/12_email_notifications.md
INSERT INTO public.email_templates (template_code, template_type, template_name, legacy_template, subject, html_body, text_body, variables, description) VALUES
('welcome_customer', 'email', 'Registration Confirmation', 'WelcomeCustomer.cshtml', 'C3 Remittances — Account Information',
'<!DOCTYPE html><html><head><meta charset="utf-8"><style>body{font-family:Arial,sans-serif;line-height:1.6;color:#333}.container{max-width:600px;margin:0 auto;padding:20px}.header{background:linear-gradient(135deg,#1a5c4c,#2a7c6c);color:white;padding:20px;text-align:center;border-radius:8px 8px 0 0}.content{background:#f9f9f9;padding:30px;border-radius:0 0 8px 8px}.info-box{background:white;padding:20px;border-radius:6px;margin:20px 0;border-left:4px solid #1a5c4c}.footer{text-align:center;padding:20px;color:#666;font-size:12px}.highlight{color:#1a5c4c;font-weight:bold}</style></head><body><div class="container"><div class="header"><h1>Welcome to C3 Wizard</h1><p>St. Kitts & Nevis Social Security Board</p></div><div class="content"><p>Dear <strong>{{name}}</strong>,</p><p>Thank you for registering with the C3 Wizard Portal. Your account has been created successfully.</p><div class="info-box"><p><strong>Account Details:</strong></p><p>Login ID: <span class="highlight">{{login_id}}</span></p><p>Registration Number: <span class="highlight">{{reg_number}}</span></p><p>Country: {{country}}</p></div><p>Please keep this information safe.</p></div><div class="footer"><p>© Social Security Board, St. Kitts and Nevis</p><p>Contact: info@ssb.kn | +1 (869) 465-2535</p></div></div></body></html>',
'Dear {{name}}, Thank you for registering. Login ID: {{login_id}}, Registration: {{reg_number}}', '["name", "login_id", "reg_number", "country"]', 'Email sent to customers after successful registration'),

('new_registration_alert', 'email', 'New Registration Alert (Admin)', 'Welcome.cshtml', 'New C3 Wizard Portal Registration Request {{reg_number}} {{company_name}}',
'<!DOCTYPE html><html><head><meta charset="utf-8"><style>body{font-family:Arial,sans-serif;line-height:1.6;color:#333}.container{max-width:600px;margin:0 auto;padding:20px}.header{background:#1a5c4c;color:white;padding:20px;text-align:center}.content{padding:30px;background:#f5f5f5}.detail-table{width:100%;border-collapse:collapse;margin:20px 0}.detail-table th,.detail-table td{padding:12px;text-align:left;border-bottom:1px solid #ddd}.detail-table th{background:#e0e0e0;width:40%}.alert-badge{display:inline-block;padding:5px 15px;background:#ff9800;color:white;border-radius:4px}</style></head><body><div class="container"><div class="header"><h1>New Registration Request</h1></div><div class="content"><p><span class="alert-badge">ACTION REQUIRED</span></p><table class="detail-table"><tr><th>Company Name</th><td>{{company_name}}</td></tr><tr><th>Registration Number</th><td>{{reg_number}}</td></tr><tr><th>Trade Name</th><td>{{trade_name}}</td></tr><tr><th>Employment Type</th><td>{{employment_type}}</td></tr><tr><th>Contact Person</th><td>{{contact_person}}</td></tr><tr><th>Email</th><td>{{email_id}}</td></tr></table></div></div></body></html>',
'New Registration: {{company_name}} ({{reg_number}})', '["company_name", "reg_number", "trade_name", "employment_type", "is_levy_exempt", "contact_person", "mobile", "email_id"]', 'Notification sent to SSB Admin for new registrations'),

('account_verification', 'email', 'Account Verification Code', 'verifictionTemplate.cshtml', 'C3 Remittances — Account Activation',
'<!DOCTYPE html><html><head><meta charset="utf-8"><style>body{font-family:Arial,sans-serif;line-height:1.6;color:#333}.container{max-width:600px;margin:0 auto;padding:20px}.header{background:linear-gradient(135deg,#1a5c4c,#2a7c6c);color:white;padding:20px;text-align:center;border-radius:8px 8px 0 0}.content{background:#f9f9f9;padding:30px;border-radius:0 0 8px 8px}.code-box{background:#1a5c4c;color:white;font-size:32px;letter-spacing:8px;padding:20px;text-align:center;border-radius:8px;margin:30px 0;font-family:monospace}.warning{color:#ff6b6b;font-size:14px}.footer{text-align:center;padding:20px;color:#666;font-size:12px}</style></head><body><div class="container"><div class="header"><h1>Verify Your Account</h1></div><div class="content"><p>Hello <strong>{{name}}</strong>,</p><p>Please use the following verification code:</p><div class="code-box">{{activation_code}}</div><p class="warning">⚠️ This code expires in 10 minutes.</p></div><div class="footer"><p>© Social Security Board, St. Kitts and Nevis</p></div></div></body></html>',
'Hello {{name}}, Your verification code is: {{activation_code}}. Expires in 10 minutes.', '["name", "activation_code"]', 'Verification code sent during registration'),

('otp_verification', 'email', 'Login OTP Verification', 'OtpVerificationLogin.cshtml', 'C3 Remittances — Login Otp',
'<!DOCTYPE html><html><head><meta charset="utf-8"><style>body{font-family:Arial,sans-serif;line-height:1.6;color:#333}.container{max-width:600px;margin:0 auto;padding:20px}.header{background:linear-gradient(135deg,#1a5c4c,#2a7c6c);color:white;padding:20px;text-align:center;border-radius:8px 8px 0 0}.content{background:#f9f9f9;padding:30px;border-radius:0 0 8px 8px}.code-box{background:#1a5c4c;color:white;font-size:36px;letter-spacing:10px;padding:25px;text-align:center;border-radius:8px;margin:30px 0;font-family:monospace}.warning{color:#ff6b6b;font-size:14px}.footer{text-align:center;padding:20px;color:#666;font-size:12px}</style></head><body><div class="container"><div class="header"><h1>Login Verification</h1></div><div class="content"><p>Hello <strong>{{name}}</strong>,</p><p>Your one-time password (OTP) is:</p><div class="code-box">{{activation_code}}</div><p class="warning">⚠️ Expires in 10 minutes. Do not share.</p></div><div class="footer"><p>© Social Security Board, St. Kitts and Nevis</p></div></div></body></html>',
'Hello {{name}}, Your OTP is: {{activation_code}}. Expires in 10 minutes.', '["name", "activation_code"]', 'OTP sent for login two-factor authentication'),

('payment_receipt', 'email', 'Payment Receipt', 'payment.cshtml', 'C3 Remittances Transaction {{name}}',
'<!DOCTYPE html><html><head><meta charset="utf-8"><style>body{font-family:Arial,sans-serif;line-height:1.6;color:#333}.container{max-width:600px;margin:0 auto;padding:20px}.header{background:linear-gradient(135deg,#10b981,#059669);color:white;padding:20px;text-align:center;border-radius:8px 8px 0 0}.content{background:#f9f9f9;padding:30px;border-radius:0 0 8px 8px}.success-badge{display:inline-block;padding:10px 20px;background:#10b981;color:white;border-radius:20px;font-weight:bold}.receipt-table{width:100%;border-collapse:collapse;margin:20px 0}.receipt-table th,.receipt-table td{padding:12px;border-bottom:1px solid #ddd}.receipt-table th{background:#e8f5e9;text-align:left}.total-row{background:#10b981;color:white;font-weight:bold}.footer{text-align:center;padding:20px;color:#666;font-size:12px}</style></head><body><div class="container"><div class="header"><h1>Payment Confirmation</h1><p>Social Security Board - St. Kitts and Nevis</p></div><div class="content"><p style="text-align:center"><span class="success-badge">✓ {{payment_status}}</span></p><p>Dear <strong>{{name}}</strong>,</p><p>Your payment has been processed successfully.</p><table class="receipt-table"><tr><th>Receipt Number</th><td>{{receipt_number}}</td></tr><tr><th>Transaction ID</th><td>{{transaction_id}}</td></tr><tr><th>Registration Number</th><td>{{reg_no}}</td></tr><tr><th>Payment Period</th><td>{{pay_c3_period}}</td></tr><tr><th>Date</th><td>{{date}}</td></tr><tr class="total-row"><th>Amount Paid</th><td>${{amount}}</td></tr></table><p>Thank you for your contribution!</p></div><div class="footer"><p>© Social Security Board, St. Kitts and Nevis</p></div></div></body></html>',
'Payment Confirmation. Receipt: {{receipt_number}}, Amount: ${{amount}}', '["name", "receipt_number", "transaction_id", "reg_no", "payment_status", "amount", "date", "pay_c3_period", "payment_header_details"]', 'Payment receipt sent to customer'),

('payment_alert_admin', 'email', 'Payment Alert (Admin)', 'payment.cshtml', 'C3 Remittances Transaction Alert - Payment received from {{name}}',
'<!DOCTYPE html><html><head><meta charset="utf-8"><style>body{font-family:Arial,sans-serif;line-height:1.6;color:#333}.container{max-width:600px;margin:0 auto;padding:20px}.header{background:#1a5c4c;color:white;padding:20px;text-align:center}.content{padding:30px;background:#f5f5f5}.alert-box{background:#e8f5e9;border-left:4px solid #10b981;padding:15px;margin:20px 0}.detail-table{width:100%;border-collapse:collapse}.detail-table th,.detail-table td{padding:10px;border-bottom:1px solid #ddd}.detail-table th{text-align:left;background:#e0e0e0}</style></head><body><div class="container"><div class="header"><h1>Payment Received</h1></div><div class="content"><div class="alert-box"><strong>New Payment Alert:</strong> ${{amount}} received from {{name}}</div><table class="detail-table"><tr><th>Receipt</th><td>{{receipt_number}}</td></tr><tr><th>Transaction ID</th><td>{{transaction_id}}</td></tr><tr><th>Date</th><td>{{date}}</td></tr></table></div></div></body></html>',
'Payment Alert: ${{amount}} from {{name}}', '["name", "receipt_number", "transaction_id", "reg_no", "payment_status", "amount", "date", "pay_c3_period"]', 'Payment notification sent to SSB Admin'),

('password_reset', 'email', 'Password Reset', 'WelcomeCustomerResetMail.cshtml', 'C3 Wizard Reset Your Password!',
'<!DOCTYPE html><html><head><meta charset="utf-8"><style>body{font-family:Arial,sans-serif;line-height:1.6;color:#333}.container{max-width:600px;margin:0 auto;padding:20px}.header{background:linear-gradient(135deg,#1a5c4c,#2a7c6c);color:white;padding:20px;text-align:center;border-radius:8px 8px 0 0}.content{background:#f9f9f9;padding:30px;border-radius:0 0 8px 8px}.btn{display:inline-block;padding:15px 30px;background:#1a5c4c;color:white;text-decoration:none;border-radius:6px;font-weight:bold;margin:20px 0}.warning{color:#ff6b6b;font-size:14px}.footer{text-align:center;padding:20px;color:#666;font-size:12px}</style></head><body><div class="container"><div class="header"><h1>Reset Your Password</h1></div><div class="content"><p>Hello <strong>{{name}}</strong>,</p><p>We received a request to reset your password.</p><p style="text-align:center"><a href="{{reset_password_url}}" class="btn">Reset Password</a></p><p class="warning">⚠️ This link expires in 1 hour.</p></div><div class="footer"><p>© Social Security Board, St. Kitts and Nevis</p></div></div></body></html>',
'Hello {{name}}, Reset your password: {{reset_password_url}}', '["name", "reset_password_url"]', 'Password reset link sent to user'),

('account_status_change', 'email', 'Account Status Change', 'activationTemplate.cshtml', 'C3 Remittances — Account {{status_text}}',
'<!DOCTYPE html><html><head><meta charset="utf-8"><style>body{font-family:Arial,sans-serif;line-height:1.6;color:#333}.container{max-width:600px;margin:0 auto;padding:20px}.header{background:linear-gradient(135deg,#1a5c4c,#2a7c6c);color:white;padding:20px;text-align:center;border-radius:8px 8px 0 0}.content{background:#f9f9f9;padding:30px;border-radius:0 0 8px 8px}.status-active{color:#10b981;font-weight:bold;font-size:18px}.status-inactive{color:#ef4444;font-weight:bold;font-size:18px}.footer{text-align:center;padding:20px;color:#666;font-size:12px}</style></head><body><div class="container"><div class="header"><h1>Account Status Update</h1></div><div class="content"><p>Hello <strong>{{first_name}}</strong>,</p><p>Your account status has been updated.</p><p>New Status: <span class="{{status_class}}">{{status_text}}</span></p></div><div class="footer"><p>© Social Security Board, St. Kitts and Nevis</p></div></div></body></html>',
'Hello {{first_name}}, Your account status: {{status_text}}', '["first_name", "is_active", "status_text", "status_class"]', 'Sent when admin changes user account status'),

('contact_complaint', 'email', 'Contact Us / Complaint', 'complaint.cshtml', 'Complaint from {{name}}',
'<!DOCTYPE html><html><head><meta charset="utf-8"><style>body{font-family:Arial,sans-serif;line-height:1.6;color:#333}.container{max-width:600px;margin:0 auto;padding:20px}.header{background:#1a5c4c;color:white;padding:20px;text-align:center}.content{padding:30px;background:#f5f5f5}.message-box{background:white;padding:20px;border-radius:6px;border-left:4px solid #ff9800;margin:20px 0}.detail-table{width:100%}.detail-table td{padding:8px 0}.detail-table td:first-child{font-weight:bold;width:40%}</style></head><body><div class="container"><div class="header"><h1>Customer Feedback / Complaint</h1></div><div class="content"><table class="detail-table"><tr><td>Contact Person:</td><td>{{contact_person}}</td></tr><tr><td>Company:</td><td>{{company_name}}</td></tr><tr><td>Registration No:</td><td>{{reg_no}}</td></tr><tr><td>Mobile:</td><td>{{mobile}}</td></tr></table><div class="message-box"><strong>Message:</strong><p>{{description}}</p></div></div></div></body></html>',
'Complaint from {{contact_person}} ({{company_name}}): {{description}}', '["contact_person", "company_name", "reg_no", "mobile", "description"]', 'Complaint/feedback submitted via Contact Us form'),

('payment_receipt_pdf', 'pdf', 'Payment Receipt PDF', 'payment.cshtml', NULL,
'<!DOCTYPE html><html><head><meta charset="utf-8"><style>body{font-family:Arial,sans-serif;font-size:12px;color:#333;padding:40px}.header{text-align:center;padding:20px;background:linear-gradient(135deg,#10b981,#059669);color:white;border-radius:8px}.header h1{margin:0;font-size:24px}.receipt-info{display:flex;justify-content:space-between;margin:30px 0;padding:20px;background:#f5f5f5;border-radius:6px}.breakdown{margin:30px 0}.breakdown table{width:100%;border-collapse:collapse}.breakdown th,.breakdown td{padding:12px;border-bottom:1px solid #ddd}.breakdown th{background:#f5f5f5;text-align:left}.total-row{background:#10b981;color:white;font-weight:bold}.footer{text-align:center;margin-top:40px;padding-top:20px;border-top:1px solid #ddd;font-size:10px;color:#666}</style></head><body><div class="header"><h1>PAYMENT RECEIPT</h1><p>Social Security Board - St. Kitts and Nevis</p></div><p><strong>Receipt No:</strong> {{receipt_number}} | <strong>Transaction ID:</strong> {{transaction_id}} | <strong>Date:</strong> {{date}}</p><p><strong>Payer:</strong> {{name}} | <strong>Registration:</strong> {{reg_no}} | <strong>Period:</strong> {{pay_c3_period}}</p><div class="breakdown"><table><thead><tr><th>Description</th><th style="text-align:right">Amount</th></tr></thead><tbody>{{payment_rows}}</tbody><tfoot><tr class="total-row"><td>TOTAL</td><td style="text-align:right">${{amount}}</td></tr></tfoot></table></div><div class="footer"><p>This is a computer-generated receipt.</p><p>© Social Security Board | info@ssb.kn | +1 (869) 465-2535</p></div></body></html>',
NULL, '["name", "receipt_number", "transaction_id", "reg_no", "payment_status", "amount", "date", "pay_c3_period", "payment_rows"]', 'PDF template for payment receipts'),

('c3_form_pdf', 'pdf', 'C3 Contribution Form PDF', NULL, NULL,
'<!DOCTYPE html><html><head><meta charset="utf-8"><style>body{font-family:Arial,sans-serif;font-size:10px;padding:20px}.header{text-align:center;margin-bottom:20px;padding-bottom:10px;border-bottom:2px solid #1a5c4c}.header h1{color:#1a5c4c;font-size:18px;margin-bottom:5px}table{width:100%;border-collapse:collapse;font-size:9px;margin-bottom:20px}th{background:#1a5c4c;color:white;padding:6px 4px;text-align:center;border:1px solid #1a5c4c}td{padding:4px;border:1px solid #ddd;text-align:center}.totals-row{background:#e8f5e9;font-weight:bold}.summary{margin-top:20px;padding:15px;background:#f5f5f5;border-radius:4px}.grand-total{font-size:14px;font-weight:bold;color:#1a5c4c;border-top:2px solid #1a5c4c;padding-top:10px;margin-top:10px}</style></head><body><div class="header"><h1>ST. KITTS AND NEVIS SOCIAL SECURITY BOARD</h1><h2>C3 Contribution Return Form</h2></div><p><strong>Employer:</strong> {{company_name}} | <strong>Reg No:</strong> {{reg_number}} | <strong>Period:</strong> {{period}} | <strong>Schedule:</strong> {{schedule_number}}</p>{{employee_table}}<div class="summary"><h3>CONTRIBUTION SUMMARY</h3>{{summary_content}}<div class="grand-total">GRAND TOTAL: ${{grand_total}}</div></div><p style="font-size:9px;color:#666;margin-top:30px">Generated: {{generated_at}} | By: {{generated_by}}</p></body></html>',
NULL, '["company_name", "reg_number", "period", "schedule_number", "employee_table", "summary_content", "grand_total", "generated_at", "generated_by"]', 'PDF template for C3 contribution forms');

-- Add updated_at trigger
CREATE OR REPLACE FUNCTION update_email_templates_timestamp()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_email_templates_updated_at
    BEFORE UPDATE ON public.email_templates
    FOR EACH ROW
    EXECUTE FUNCTION update_email_templates_timestamp();