-- =====================================================
-- COMPREHENSIVE DATABASE SCHEMA MIGRATION
-- Adding remaining ~35 tables to complete the C3 Wizard system
-- =====================================================

-- =====================================================
-- 1. PAYMENT TABLES
-- =====================================================

-- c3_payments table - All payment transactions
CREATE TABLE IF NOT EXISTS c3_payments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  c3_header_id UUID REFERENCES c3_contribution_headers(id),
  company_id UUID REFERENCES c3_companies(id),
  self_employed_profile_id UUID REFERENCES c3_self_employed_profiles(id),
  user_id UUID REFERENCES auth.users(id),
  
  -- Payment Details
  payment_amount DECIMAL(18, 2) NOT NULL,
  payment_amount_usd DECIMAL(18, 2),
  exchange_rate DECIMAL(18, 6),
  
  -- Payment Method
  payment_method TEXT NOT NULL DEFAULT 'CyberSource',
  payment_mode TEXT DEFAULT 'Online',
  
  -- Gateway Transaction Info
  payment_gateway_transaction_id TEXT,
  payment_status TEXT DEFAULT 'PENDING',
  payment_response JSONB,
  
  -- Breakdown
  total_ss_contributions DECIMAL(18, 2) DEFAULT 0,
  total_ei_contributions DECIMAL(18, 2) DEFAULT 0,
  total_levy_contributions DECIMAL(18, 2) DEFAULT 0,
  total_pe_contributions DECIMAL(18, 2) DEFAULT 0,
  total_penalties DECIMAL(18, 2) DEFAULT 0,
  
  -- BIMA Integration
  bima_receipt_number TEXT,
  bima_payment_response JSONB,
  is_bima_posted BOOLEAN DEFAULT FALSE,
  
  -- Offline Payment Details
  check_number TEXT,
  bank_name TEXT,
  transaction_reference TEXT,
  
  -- Receipt
  receipt_number TEXT UNIQUE,
  receipt_pdf_url TEXT,
  
  -- Transaction Dates
  transaction_date TIMESTAMPTZ DEFAULT NOW(),
  authorization_date TIMESTAMPTZ,
  
  -- Audit
  created_at TIMESTAMPTZ DEFAULT NOW(),
  created_by UUID REFERENCES auth.users(id),
  updated_at TIMESTAMPTZ,
  updated_by UUID REFERENCES auth.users(id),
  is_deleted BOOLEAN DEFAULT FALSE
);

ALTER TABLE c3_payments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can manage all payments" ON c3_payments
  FOR ALL USING (has_role(auth.uid(), 'admin'));
  
CREATE POLICY "Employers can view own payments" ON c3_payments
  FOR SELECT USING (
    company_id IN (SELECT company_id FROM c3_employer_company_links WHERE user_id = auth.uid())
    OR has_role(auth.uid(), 'admin')
  );

CREATE POLICY "Self-employed can view own payments" ON c3_payments
  FOR SELECT USING (
    self_employed_profile_id IN (SELECT id FROM c3_self_employed_profiles WHERE user_id = auth.uid())
  );

-- c3_payment_reconciliation table
CREATE TABLE IF NOT EXISTS c3_payment_reconciliation (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  file_path TEXT,
  file_name TEXT,
  upload_date TIMESTAMPTZ DEFAULT NOW(),
  uploaded_by UUID REFERENCES auth.users(id),
  status TEXT DEFAULT 'pending',
  total_records INTEGER DEFAULT 0,
  matched_records INTEGER DEFAULT 0,
  unmatched_records INTEGER DEFAULT 0,
  reconciliation_date DATE,
  reconciliation_notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  created_by UUID REFERENCES auth.users(id),
  is_deleted BOOLEAN DEFAULT FALSE
);

ALTER TABLE c3_payment_reconciliation ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can manage reconciliation" ON c3_payment_reconciliation
  FOR ALL USING (has_role(auth.uid(), 'admin'));

-- c3_payment_reconciliation_details table
CREATE TABLE IF NOT EXISTS c3_payment_reconciliation_details (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  reconciliation_id UUID NOT NULL REFERENCES c3_payment_reconciliation(id) ON DELETE CASCADE,
  transaction_id TEXT,
  transaction_date DATE,
  amount DECIMAL(18, 2),
  payer_name TEXT,
  reference TEXT,
  is_matched BOOLEAN DEFAULT FALSE,
  matched_payment_id UUID REFERENCES c3_payments(id),
  match_confidence TEXT,
  reconciliation_status TEXT,
  admin_notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE c3_payment_reconciliation_details ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can manage reconciliation details" ON c3_payment_reconciliation_details
  FOR ALL USING (has_role(auth.uid(), 'admin'));

-- =====================================================
-- 2. LOGIN AND OTP TABLES
-- =====================================================

-- c3_login_logs table
CREATE TABLE IF NOT EXISTS c3_login_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  login_id TEXT,
  user_id UUID REFERENCES auth.users(id),
  success BOOLEAN NOT NULL,
  failure_reason TEXT,
  ip_address TEXT,
  user_agent TEXT,
  attempted_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE c3_login_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can view all login logs" ON c3_login_logs
  FOR SELECT USING (has_role(auth.uid(), 'admin'));
  
CREATE POLICY "Users can view own login logs" ON c3_login_logs
  FOR SELECT USING (user_id = auth.uid());
  
CREATE POLICY "System can insert login logs" ON c3_login_logs
  FOR INSERT WITH CHECK (true);

-- c3_user_otps table
CREATE TABLE IF NOT EXISTS c3_user_otps (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  otp_code TEXT NOT NULL,
  otp_type TEXT NOT NULL,
  expires_at TIMESTAMPTZ NOT NULL,
  is_used BOOLEAN DEFAULT FALSE,
  used_at TIMESTAMPTZ,
  attempts INTEGER DEFAULT 0,
  max_attempts INTEGER DEFAULT 3,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE c3_user_otps ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own OTPs" ON c3_user_otps
  FOR SELECT USING (user_id = auth.uid());
  
CREATE POLICY "System can manage OTPs" ON c3_user_otps
  FOR ALL USING (true);

-- =====================================================
-- 3. INCOME/DEDUCTION/OBLIGATION CODE TABLES
-- =====================================================

-- c3_income_codes table
CREATE TABLE IF NOT EXISTS c3_income_codes (
  id SERIAL PRIMARY KEY,
  code TEXT UNIQUE NOT NULL,
  description TEXT NOT NULL,
  income_type TEXT,
  is_taxable BOOLEAN DEFAULT TRUE,
  is_active BOOLEAN DEFAULT TRUE,
  display_order INTEGER,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ,
  is_deleted BOOLEAN DEFAULT FALSE
);

ALTER TABLE c3_income_codes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read income codes" ON c3_income_codes
  FOR SELECT USING (true);
CREATE POLICY "Admins can manage income codes" ON c3_income_codes
  FOR ALL USING (has_role(auth.uid(), 'admin'));

-- c3_deduction_codes table
CREATE TABLE IF NOT EXISTS c3_deduction_codes (
  id SERIAL PRIMARY KEY,
  code TEXT UNIQUE NOT NULL,
  description TEXT NOT NULL,
  deduction_type TEXT,
  is_pretax BOOLEAN DEFAULT FALSE,
  is_active BOOLEAN DEFAULT TRUE,
  display_order INTEGER,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ,
  is_deleted BOOLEAN DEFAULT FALSE
);

ALTER TABLE c3_deduction_codes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read deduction codes" ON c3_deduction_codes
  FOR SELECT USING (true);
CREATE POLICY "Admins can manage deduction codes" ON c3_deduction_codes
  FOR ALL USING (has_role(auth.uid(), 'admin'));

-- c3_obligation_codes table
CREATE TABLE IF NOT EXISTS c3_obligation_codes (
  id SERIAL PRIMARY KEY,
  code TEXT UNIQUE NOT NULL,
  description TEXT NOT NULL,
  obligation_type TEXT,
  is_active BOOLEAN DEFAULT TRUE,
  display_order INTEGER,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ,
  is_deleted BOOLEAN DEFAULT FALSE
);

ALTER TABLE c3_obligation_codes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read obligation codes" ON c3_obligation_codes
  FOR SELECT USING (true);
CREATE POLICY "Admins can manage obligation codes" ON c3_obligation_codes
  FOR ALL USING (has_role(auth.uid(), 'admin'));

-- c3_employee_incomes table
CREATE TABLE IF NOT EXISTS c3_employee_incomes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  employee_id UUID NOT NULL REFERENCES c3_employees(id) ON DELETE CASCADE,
  company_id UUID NOT NULL REFERENCES c3_companies(id),
  income_code_id INTEGER REFERENCES c3_income_codes(id),
  amount DECIMAL(18, 2) DEFAULT 0,
  effective_from DATE,
  effective_to DATE,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  created_by UUID REFERENCES auth.users(id),
  updated_at TIMESTAMPTZ,
  is_deleted BOOLEAN DEFAULT FALSE
);

ALTER TABLE c3_employee_incomes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Employers can manage employee incomes" ON c3_employee_incomes
  FOR ALL USING (
    company_id IN (SELECT company_id FROM c3_employer_company_links WHERE user_id = auth.uid())
    OR has_role(auth.uid(), 'admin')
  );

-- c3_employee_deductions table
CREATE TABLE IF NOT EXISTS c3_employee_deductions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  employee_id UUID NOT NULL REFERENCES c3_employees(id) ON DELETE CASCADE,
  company_id UUID NOT NULL REFERENCES c3_companies(id),
  deduction_code_id INTEGER REFERENCES c3_deduction_codes(id),
  amount DECIMAL(18, 2) DEFAULT 0,
  percentage DECIMAL(5, 4),
  effective_from DATE,
  effective_to DATE,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  created_by UUID REFERENCES auth.users(id),
  updated_at TIMESTAMPTZ,
  is_deleted BOOLEAN DEFAULT FALSE
);

ALTER TABLE c3_employee_deductions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Employers can manage employee deductions" ON c3_employee_deductions
  FOR ALL USING (
    company_id IN (SELECT company_id FROM c3_employer_company_links WHERE user_id = auth.uid())
    OR has_role(auth.uid(), 'admin')
  );

-- c3_employee_obligations table
CREATE TABLE IF NOT EXISTS c3_employee_obligations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  employee_id UUID NOT NULL REFERENCES c3_employees(id) ON DELETE CASCADE,
  company_id UUID NOT NULL REFERENCES c3_companies(id),
  obligation_code_id INTEGER REFERENCES c3_obligation_codes(id),
  amount DECIMAL(18, 2) DEFAULT 0,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  created_by UUID REFERENCES auth.users(id),
  updated_at TIMESTAMPTZ,
  is_deleted BOOLEAN DEFAULT FALSE
);

ALTER TABLE c3_employee_obligations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Employers can manage employee obligations" ON c3_employee_obligations
  FOR ALL USING (
    company_id IN (SELECT company_id FROM c3_employer_company_links WHERE user_id = auth.uid())
    OR has_role(auth.uid(), 'admin')
  );

-- =====================================================
-- 4. PAYROLL TABLES
-- =====================================================

-- c3_payroll_headers table
CREATE TABLE IF NOT EXISTS c3_payroll_headers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id UUID NOT NULL REFERENCES c3_companies(id),
  pay_period_start DATE NOT NULL,
  pay_period_end DATE NOT NULL,
  pay_date DATE,
  pay_frequency TEXT NOT NULL,
  status TEXT DEFAULT 'draft',
  total_gross DECIMAL(18, 2) DEFAULT 0,
  total_deductions DECIMAL(18, 2) DEFAULT 0,
  total_net DECIMAL(18, 2) DEFAULT 0,
  total_employer_contributions DECIMAL(18, 2) DEFAULT 0,
  processed_at TIMESTAMPTZ,
  processed_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  created_by UUID REFERENCES auth.users(id),
  updated_at TIMESTAMPTZ,
  updated_by UUID REFERENCES auth.users(id),
  is_deleted BOOLEAN DEFAULT FALSE
);

ALTER TABLE c3_payroll_headers ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Employers can manage payroll" ON c3_payroll_headers
  FOR ALL USING (
    company_id IN (SELECT company_id FROM c3_employer_company_links WHERE user_id = auth.uid())
    OR has_role(auth.uid(), 'admin')
  );

-- c3_payroll_details table
CREATE TABLE IF NOT EXISTS c3_payroll_details (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  payroll_header_id UUID NOT NULL REFERENCES c3_payroll_headers(id) ON DELETE CASCADE,
  employee_id UUID NOT NULL REFERENCES c3_employees(id),
  company_id UUID NOT NULL REFERENCES c3_companies(id),
  
  -- Wages
  regular_hours DECIMAL(8, 2) DEFAULT 0,
  overtime_hours DECIMAL(8, 2) DEFAULT 0,
  regular_pay DECIMAL(18, 2) DEFAULT 0,
  overtime_pay DECIMAL(18, 2) DEFAULT 0,
  gross_pay DECIMAL(18, 2) DEFAULT 0,
  
  -- Contributions (using JSONB for flexibility)
  incomes JSONB DEFAULT '[]',
  deductions JSONB DEFAULT '[]',
  obligations JSONB DEFAULT '[]',
  
  -- Totals
  total_deductions DECIMAL(18, 2) DEFAULT 0,
  net_pay DECIMAL(18, 2) DEFAULT 0,
  
  -- Employer contributions
  employer_ss DECIMAL(18, 2) DEFAULT 0,
  employer_ei DECIMAL(18, 2) DEFAULT 0,
  employer_levy DECIMAL(18, 2) DEFAULT 0,
  employer_pe DECIMAL(18, 2) DEFAULT 0,
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ,
  is_deleted BOOLEAN DEFAULT FALSE
);

ALTER TABLE c3_payroll_details ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Employers can manage payroll details" ON c3_payroll_details
  FOR ALL USING (
    company_id IN (SELECT company_id FROM c3_employer_company_links WHERE user_id = auth.uid())
    OR has_role(auth.uid(), 'admin')
  );

-- =====================================================
-- 5. TIMECARD TABLES
-- =====================================================

-- c3_timecard_headers table
CREATE TABLE IF NOT EXISTS c3_timecard_headers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id UUID NOT NULL REFERENCES c3_companies(id),
  period_start DATE NOT NULL,
  period_end DATE NOT NULL,
  status TEXT DEFAULT 'draft',
  submitted_at TIMESTAMPTZ,
  submitted_by UUID REFERENCES auth.users(id),
  approved_at TIMESTAMPTZ,
  approved_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  created_by UUID REFERENCES auth.users(id),
  is_deleted BOOLEAN DEFAULT FALSE
);

ALTER TABLE c3_timecard_headers ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Employers can manage timecards" ON c3_timecard_headers
  FOR ALL USING (
    company_id IN (SELECT company_id FROM c3_employer_company_links WHERE user_id = auth.uid())
    OR has_role(auth.uid(), 'admin')
  );

-- c3_timecard_details table
CREATE TABLE IF NOT EXISTS c3_timecard_details (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  timecard_header_id UUID NOT NULL REFERENCES c3_timecard_headers(id) ON DELETE CASCADE,
  employee_id UUID NOT NULL REFERENCES c3_employees(id),
  work_date DATE NOT NULL,
  hours_worked DECIMAL(5, 2) DEFAULT 0,
  overtime_hours DECIMAL(5, 2) DEFAULT 0,
  break_minutes INTEGER DEFAULT 0,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ,
  is_deleted BOOLEAN DEFAULT FALSE
);

ALTER TABLE c3_timecard_details ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Employers can manage timecard details" ON c3_timecard_details
  FOR ALL USING (
    timecard_header_id IN (
      SELECT id FROM c3_timecard_headers 
      WHERE company_id IN (SELECT company_id FROM c3_employer_company_links WHERE user_id = auth.uid())
    )
    OR has_role(auth.uid(), 'admin')
  );

-- c3_work_duration_details table
CREATE TABLE IF NOT EXISTS c3_work_duration_details (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  employee_id UUID NOT NULL REFERENCES c3_employees(id),
  company_id UUID NOT NULL REFERENCES c3_companies(id),
  work_date DATE NOT NULL,
  clock_in TIMESTAMPTZ,
  clock_out TIMESTAMPTZ,
  break_start TIMESTAMPTZ,
  break_end TIMESTAMPTZ,
  total_hours DECIMAL(5, 2),
  status TEXT DEFAULT 'pending',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  is_deleted BOOLEAN DEFAULT FALSE
);

ALTER TABLE c3_work_duration_details ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Employers can manage work duration" ON c3_work_duration_details
  FOR ALL USING (
    company_id IN (SELECT company_id FROM c3_employer_company_links WHERE user_id = auth.uid())
    OR has_role(auth.uid(), 'admin')
  );

-- =====================================================
-- 6. BONUS AND HOLIDAY PAY TABLES
-- =====================================================

-- c3_holiday_pay_details table
CREATE TABLE IF NOT EXISTS c3_holiday_pay_details (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id UUID NOT NULL REFERENCES c3_companies(id),
  employee_id UUID NOT NULL REFERENCES c3_employees(id) ON DELETE CASCADE,
  month INTEGER NOT NULL,
  year INTEGER NOT NULL,
  amount DECIMAL(18, 2) NOT NULL,
  week_1_date DATE,
  week_2_date DATE,
  week_3_date DATE,
  week_4_date DATE,
  week_5_date DATE,
  week_1_amount DECIMAL(18, 2) DEFAULT 0,
  week_2_amount DECIMAL(18, 2) DEFAULT 0,
  week_3_amount DECIMAL(18, 2) DEFAULT 0,
  week_4_amount DECIMAL(18, 2) DEFAULT 0,
  week_5_amount DECIMAL(18, 2) DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  created_by UUID REFERENCES auth.users(id),
  updated_at TIMESTAMPTZ,
  is_deleted BOOLEAN DEFAULT FALSE,
  UNIQUE(company_id, employee_id, month, year)
);

ALTER TABLE c3_holiday_pay_details ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Employers can manage holiday pay" ON c3_holiday_pay_details
  FOR ALL USING (
    company_id IN (SELECT company_id FROM c3_employer_company_links WHERE user_id = auth.uid())
    OR has_role(auth.uid(), 'admin')
  );

-- c3_bonus_details table
CREATE TABLE IF NOT EXISTS c3_bonus_details (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id UUID NOT NULL REFERENCES c3_companies(id),
  employee_id UUID NOT NULL REFERENCES c3_employees(id) ON DELETE CASCADE,
  month INTEGER NOT NULL,
  year INTEGER NOT NULL,
  amount DECIMAL(18, 2) NOT NULL,
  bonus_type TEXT,
  bonus_date DATE,
  is_december_bonus BOOLEAN DEFAULT FALSE,
  is_exempt_from_levy BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  created_by UUID REFERENCES auth.users(id),
  updated_at TIMESTAMPTZ,
  is_deleted BOOLEAN DEFAULT FALSE
);

ALTER TABLE c3_bonus_details ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Employers can manage bonus details" ON c3_bonus_details
  FOR ALL USING (
    company_id IN (SELECT company_id FROM c3_employer_company_links WHERE user_id = auth.uid())
    OR has_role(auth.uid(), 'admin')
  );

-- =====================================================
-- 7. LOOKUP/REFERENCE TABLES
-- =====================================================

-- c3_countries table
CREATE TABLE IF NOT EXISTS c3_countries (
  id SERIAL PRIMARY KEY,
  code TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  phone_code TEXT,
  currency_code TEXT,
  is_active BOOLEAN DEFAULT TRUE,
  display_order INTEGER
);

ALTER TABLE c3_countries ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read countries" ON c3_countries
  FOR SELECT USING (true);
CREATE POLICY "Admins can manage countries" ON c3_countries
  FOR ALL USING (has_role(auth.uid(), 'admin'));

-- c3_states table
CREATE TABLE IF NOT EXISTS c3_states (
  id SERIAL PRIMARY KEY,
  country_id INTEGER REFERENCES c3_countries(id),
  code TEXT NOT NULL,
  name TEXT NOT NULL,
  is_active BOOLEAN DEFAULT TRUE,
  display_order INTEGER
);

ALTER TABLE c3_states ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read states" ON c3_states
  FOR SELECT USING (true);
CREATE POLICY "Admins can manage states" ON c3_states
  FOR ALL USING (has_role(auth.uid(), 'admin'));

-- c3_cities table
CREATE TABLE IF NOT EXISTS c3_cities (
  id SERIAL PRIMARY KEY,
  state_id INTEGER REFERENCES c3_states(id),
  name TEXT NOT NULL,
  postal_code TEXT,
  is_active BOOLEAN DEFAULT TRUE,
  display_order INTEGER
);

ALTER TABLE c3_cities ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read cities" ON c3_cities
  FOR SELECT USING (true);
CREATE POLICY "Admins can manage cities" ON c3_cities
  FOR ALL USING (has_role(auth.uid(), 'admin'));

-- =====================================================
-- 8. SELF-EMPLOYED CONTRIBUTION TABLE
-- =====================================================

-- c3_self_employed_contributions table
CREATE TABLE IF NOT EXISTS c3_self_employed_contributions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  c3_header_id UUID REFERENCES c3_contribution_headers(id),
  self_employed_profile_id UUID NOT NULL REFERENCES c3_self_employed_profiles(id),
  month INTEGER NOT NULL,
  year INTEGER NOT NULL,
  wage_category_id INTEGER REFERENCES c3_wage_categories(id),
  weekly_wage DECIMAL(18, 2) DEFAULT 0,
  monthly_wage DECIMAL(18, 2) DEFAULT 0,
  weeks_in_month INTEGER DEFAULT 4,
  total_income DECIMAL(18, 2) DEFAULT 0,
  ss_contribution DECIMAL(18, 2) DEFAULT 0,
  levy_contribution DECIMAL(18, 2) DEFAULT 0,
  pe_contribution DECIMAL(18, 2) DEFAULT 0,
  grand_total DECIMAL(18, 2) DEFAULT 0,
  status TEXT DEFAULT 'draft',
  finalized_at TIMESTAMPTZ,
  submitted_at TIMESTAMPTZ,
  paid_at TIMESTAMPTZ,
  payment_id UUID REFERENCES c3_payments(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  created_by UUID REFERENCES auth.users(id),
  updated_at TIMESTAMPTZ,
  is_deleted BOOLEAN DEFAULT FALSE,
  UNIQUE(self_employed_profile_id, month, year)
);

ALTER TABLE c3_self_employed_contributions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Self-employed can manage own contributions" ON c3_self_employed_contributions
  FOR ALL USING (
    self_employed_profile_id IN (SELECT id FROM c3_self_employed_profiles WHERE user_id = auth.uid())
    OR has_role(auth.uid(), 'admin')
  );

-- =====================================================
-- 9. DIRECTOR RATES TABLE
-- =====================================================

-- c3_director_rates table
CREATE TABLE IF NOT EXISTS c3_director_rates (
  id SERIAL PRIMARY KEY,
  year INTEGER NOT NULL,
  ss_rate DECIMAL(5, 4) NOT NULL,
  levy_rate DECIMAL(5, 4) NOT NULL,
  pe_rate DECIMAL(5, 4) NOT NULL,
  min_annual_salary DECIMAL(18, 2),
  max_annual_salary DECIMAL(18, 2),
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ,
  UNIQUE(year)
);

ALTER TABLE c3_director_rates ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read director rates" ON c3_director_rates
  FOR SELECT USING (true);
CREATE POLICY "Admins can manage director rates" ON c3_director_rates
  FOR ALL USING (has_role(auth.uid(), 'admin'));

-- =====================================================
-- 10. ERROR/EXCEPTION LOGS
-- =====================================================

-- c3_error_logs table
CREATE TABLE IF NOT EXISTS c3_error_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  error_message TEXT NOT NULL,
  error_stack TEXT,
  error_source TEXT,
  user_id UUID REFERENCES auth.users(id),
  request_url TEXT,
  request_method TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE c3_error_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can view error logs" ON c3_error_logs
  FOR SELECT USING (has_role(auth.uid(), 'admin'));
CREATE POLICY "System can insert error logs" ON c3_error_logs
  FOR INSERT WITH CHECK (true);

-- c3_exception_logs table
CREATE TABLE IF NOT EXISTS c3_exception_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  exception_type TEXT NOT NULL,
  exception_message TEXT NOT NULL,
  exception_stack TEXT,
  inner_exception TEXT,
  user_id UUID REFERENCES auth.users(id),
  context_data JSONB,
  severity TEXT DEFAULT 'error',
  is_resolved BOOLEAN DEFAULT FALSE,
  resolved_at TIMESTAMPTZ,
  resolved_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE c3_exception_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can manage exception logs" ON c3_exception_logs
  FOR ALL USING (has_role(auth.uid(), 'admin'));
CREATE POLICY "System can insert exception logs" ON c3_exception_logs
  FOR INSERT WITH CHECK (true);

-- =====================================================
-- 11. CONTACT/CMS TABLES
-- =====================================================

-- c3_contact_logs table
CREATE TABLE IF NOT EXISTS c3_contact_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  subject TEXT,
  message TEXT NOT NULL,
  status TEXT DEFAULT 'new',
  responded_at TIMESTAMPTZ,
  responded_by UUID REFERENCES auth.users(id),
  response_message TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE c3_contact_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can manage contact logs" ON c3_contact_logs
  FOR ALL USING (has_role(auth.uid(), 'admin'));
CREATE POLICY "Anyone can submit contact" ON c3_contact_logs
  FOR INSERT WITH CHECK (true);

-- c3_content_pages table
CREATE TABLE IF NOT EXISTS c3_content_pages (
  id SERIAL PRIMARY KEY,
  page_key TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  content TEXT,
  meta_description TEXT,
  is_published BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ,
  updated_by UUID REFERENCES auth.users(id)
);

ALTER TABLE c3_content_pages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read published pages" ON c3_content_pages
  FOR SELECT USING (is_published = true);
CREATE POLICY "Admins can manage content pages" ON c3_content_pages
  FOR ALL USING (has_role(auth.uid(), 'admin'));

-- c3_site_settings table
CREATE TABLE IF NOT EXISTS c3_site_settings (
  id SERIAL PRIMARY KEY,
  setting_key TEXT UNIQUE NOT NULL,
  setting_value TEXT,
  setting_type TEXT DEFAULT 'string',
  description TEXT,
  is_public BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ
);

ALTER TABLE c3_site_settings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read public settings" ON c3_site_settings
  FOR SELECT USING (is_public = true);
CREATE POLICY "Admins can manage settings" ON c3_site_settings
  FOR ALL USING (has_role(auth.uid(), 'admin'));

-- =====================================================
-- 12. USER PERMISSIONS TABLE
-- =====================================================

-- c3_user_permissions table
CREATE TABLE IF NOT EXISTS c3_user_permissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  module_name TEXT NOT NULL,
  can_view BOOLEAN DEFAULT FALSE,
  can_create BOOLEAN DEFAULT FALSE,
  can_edit BOOLEAN DEFAULT FALSE,
  can_delete BOOLEAN DEFAULT FALSE,
  can_export BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  created_by UUID REFERENCES auth.users(id),
  updated_at TIMESTAMPTZ,
  UNIQUE(user_id, module_name)
);

ALTER TABLE c3_user_permissions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own permissions" ON c3_user_permissions
  FOR SELECT USING (user_id = auth.uid() OR has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can manage permissions" ON c3_user_permissions
  FOR ALL USING (has_role(auth.uid(), 'admin'));

-- =====================================================
-- 13. BIMA INTEGRATION TABLES
-- =====================================================

-- c3_bima_submissions table
CREATE TABLE IF NOT EXISTS c3_bima_submissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  c3_header_id UUID REFERENCES c3_contribution_headers(id),
  submission_type TEXT NOT NULL,
  request_payload JSONB,
  response_payload JSONB,
  status TEXT DEFAULT 'pending',
  bima_receipt_id TEXT,
  schedule_number INTEGER,
  error_message TEXT,
  retry_count INTEGER DEFAULT 0,
  submitted_at TIMESTAMPTZ DEFAULT NOW(),
  submitted_by UUID REFERENCES auth.users(id)
);

ALTER TABLE c3_bima_submissions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can manage BIMA submissions" ON c3_bima_submissions
  FOR ALL USING (has_role(auth.uid(), 'admin'));
CREATE POLICY "Employers can view own submissions" ON c3_bima_submissions
  FOR SELECT USING (
    c3_header_id IN (
      SELECT id FROM c3_contribution_headers 
      WHERE company_id IN (SELECT company_id FROM c3_employer_company_links WHERE user_id = auth.uid())
    )
  );

-- c3_cybersource_reconciliation table
CREATE TABLE IF NOT EXISTS c3_cybersource_reconciliation (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  transaction_id TEXT NOT NULL,
  merchant_reference TEXT,
  amount DECIMAL(18, 2),
  currency TEXT DEFAULT 'XCD',
  status TEXT,
  payment_method TEXT,
  card_last_four TEXT,
  auth_code TEXT,
  transaction_date TIMESTAMPTZ,
  reconciled BOOLEAN DEFAULT FALSE,
  reconciled_at TIMESTAMPTZ,
  matched_payment_id UUID REFERENCES c3_payments(id),
  raw_response JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE c3_cybersource_reconciliation ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can manage cybersource reconciliation" ON c3_cybersource_reconciliation
  FOR ALL USING (has_role(auth.uid(), 'admin'));

-- =====================================================
-- 14. NOTIFICATIONS TABLE
-- =====================================================

-- c3_notifications table
CREATE TABLE IF NOT EXISTS c3_notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id),
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  notification_type TEXT DEFAULT 'info',
  link TEXT,
  is_read BOOLEAN DEFAULT FALSE,
  read_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE c3_notifications ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own notifications" ON c3_notifications
  FOR SELECT USING (user_id = auth.uid());
CREATE POLICY "Users can update own notifications" ON c3_notifications
  FOR UPDATE USING (user_id = auth.uid());
CREATE POLICY "System can insert notifications" ON c3_notifications
  FOR INSERT WITH CHECK (true);

-- =====================================================
-- 15. EMAIL TEMPLATES TABLE
-- =====================================================

-- c3_email_templates table
CREATE TABLE IF NOT EXISTS c3_email_templates (
  id SERIAL PRIMARY KEY,
  template_key TEXT UNIQUE NOT NULL,
  template_name TEXT NOT NULL,
  subject TEXT NOT NULL,
  body_html TEXT NOT NULL,
  body_text TEXT,
  variables JSONB,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ
);

ALTER TABLE c3_email_templates ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can manage email templates" ON c3_email_templates
  FOR ALL USING (has_role(auth.uid(), 'admin'));

-- =====================================================
-- INSERT INITIAL DATA
-- =====================================================

-- Insert default countries
INSERT INTO c3_countries (code, name, phone_code, currency_code, display_order) VALUES
('KN', 'St. Kitts and Nevis', '+1869', 'XCD', 1),
('US', 'United States', '+1', 'USD', 2),
('GB', 'United Kingdom', '+44', 'GBP', 3),
('CA', 'Canada', '+1', 'CAD', 4)
ON CONFLICT (code) DO NOTHING;

-- Insert default states for St. Kitts and Nevis
INSERT INTO c3_states (country_id, code, name, display_order) 
SELECT c.id, 'SK', 'St. Kitts', 1 FROM c3_countries c WHERE c.code = 'KN'
ON CONFLICT DO NOTHING;

INSERT INTO c3_states (country_id, code, name, display_order) 
SELECT c.id, 'NV', 'Nevis', 2 FROM c3_countries c WHERE c.code = 'KN'
ON CONFLICT DO NOTHING;

-- Insert default income codes
INSERT INTO c3_income_codes (code, description, income_type, display_order) VALUES
('REG', 'Regular Wages', 'Wages', 1),
('OT', 'Overtime Pay', 'Wages', 2),
('BONUS', 'Bonus', 'Bonus', 3),
('HPAY', 'Holiday Pay', 'Holiday', 4),
('COMM', 'Commission', 'Commission', 5)
ON CONFLICT (code) DO NOTHING;

-- Insert default deduction codes
INSERT INTO c3_deduction_codes (code, description, deduction_type, display_order) VALUES
('SS', 'Social Security', 'Statutory', 1),
('LEVY', 'Employment Levy', 'Statutory', 2),
('PE', 'Severance/Provident Fund', 'Statutory', 3)
ON CONFLICT (code) DO NOTHING;

-- Insert default obligation codes
INSERT INTO c3_obligation_codes (code, description, obligation_type, display_order) VALUES
('SS_ER', 'Employer Social Security', 'Statutory', 1),
('LEVY_ER', 'Employer Levy', 'Statutory', 2),
('PE_ER', 'Employer Severance', 'Statutory', 3)
ON CONFLICT (code) DO NOTHING;

-- Insert default content pages
INSERT INTO c3_content_pages (page_key, title, content, is_published) VALUES
('about_us', 'About Us', 'C3 Wizard is a comprehensive contribution management system for St. Kitts and Nevis employers and self-employed individuals.', true),
('terms', 'Terms of Service', 'Terms and conditions for using the C3 Wizard platform.', true),
('privacy', 'Privacy Policy', 'Our commitment to protecting your personal information.', true)
ON CONFLICT (page_key) DO NOTHING;

-- Insert default site settings
INSERT INTO c3_site_settings (setting_key, setting_value, setting_type, description, is_public) VALUES
('site_name', 'C3 Wizard', 'string', 'Application name', true),
('support_email', 'support@c3wizard.kn', 'string', 'Support email address', true),
('support_phone', '+1 (869) 465-1234', 'string', 'Support phone number', true),
('enable_bima_integration', 'false', 'boolean', 'Enable BIMA API integration', false),
('bima_test_mode', 'true', 'boolean', 'Use BIMA test environment', false)
ON CONFLICT (setting_key) DO NOTHING;

-- Insert default director rates
INSERT INTO c3_director_rates (year, ss_rate, levy_rate, pe_rate, min_annual_salary) VALUES
(2025, 0.10, 0.03, 0.02, 12000),
(2026, 0.10, 0.03, 0.02, 12000)
ON CONFLICT (year) DO NOTHING;

-- Insert default email templates
INSERT INTO c3_email_templates (template_key, template_name, subject, body_html, variables) VALUES
('welcome', 'Welcome Email', 'Welcome to C3 Wizard', '<h1>Welcome {{name}}!</h1><p>Your account has been created.</p>', '["name", "email"]'),
('c3_submitted', 'C3 Submitted', 'C3 Form Submitted Successfully', '<h1>C3 Form Submitted</h1><p>Your C3 form for {{month}}/{{year}} has been submitted.</p>', '["month", "year", "company_name"]'),
('payment_received', 'Payment Received', 'Payment Confirmation', '<h1>Payment Received</h1><p>We have received your payment of {{amount}} for C3 form {{month}}/{{year}}.</p>', '["amount", "month", "year", "receipt_number"]'),
('password_reset', 'Password Reset', 'Reset Your Password', '<h1>Password Reset</h1><p>Click the link below to reset your password: {{reset_link}}</p>', '["reset_link", "name"]')
ON CONFLICT (template_key) DO NOTHING;

-- =====================================================
-- CREATE INDEXES FOR PERFORMANCE
-- =====================================================

CREATE INDEX IF NOT EXISTS idx_payments_c3_header ON c3_payments(c3_header_id);
CREATE INDEX IF NOT EXISTS idx_payments_company ON c3_payments(company_id);
CREATE INDEX IF NOT EXISTS idx_payments_status ON c3_payments(payment_status);
CREATE INDEX IF NOT EXISTS idx_login_logs_user ON c3_login_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_login_logs_date ON c3_login_logs(attempted_at);
CREATE INDEX IF NOT EXISTS idx_payroll_company ON c3_payroll_headers(company_id);
CREATE INDEX IF NOT EXISTS idx_payroll_details_header ON c3_payroll_details(payroll_header_id);
CREATE INDEX IF NOT EXISTS idx_timecard_company ON c3_timecard_headers(company_id);
CREATE INDEX IF NOT EXISTS idx_se_contributions_profile ON c3_self_employed_contributions(self_employed_profile_id);
CREATE INDEX IF NOT EXISTS idx_notifications_user ON c3_notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_unread ON c3_notifications(user_id, is_read) WHERE is_read = false;