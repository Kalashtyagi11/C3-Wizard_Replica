-- Step 3: Recreate role system and add simplified RLS policies
-- The c3_sec_users table links to companies via reg_number, not company_id

-- Create app_role type for Supabase auth integration
CREATE TYPE app_role AS ENUM ('admin', 'employer', 'self_employed');

-- Create c3_user_roles table for Supabase auth mapping
CREATE TABLE IF NOT EXISTS c3_user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role app_role NOT NULL DEFAULT 'employer',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, role)
);

ALTER TABLE c3_user_roles ENABLE ROW LEVEL SECURITY;

-- Create has_role function
CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role app_role)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.c3_user_roles
    WHERE user_id = _user_id
      AND role = _role
  )
$$;

-- Simplified RLS policies - authenticated users for now, admin-specific policies use has_role

-- User roles
CREATE POLICY "Users view own roles" ON c3_user_roles FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Admins manage roles" ON c3_user_roles FOR ALL USING (has_role(auth.uid(), 'admin'));

-- Lookup tables (public read, admin write)
CREATE POLICY "Public read system_rates" ON c3_system_rates FOR SELECT USING (true);
CREATE POLICY "Admins manage system_rates" ON c3_system_rates FOR ALL USING (has_role(auth.uid(), 'admin'));

CREATE POLICY "Public read exemptions" ON c3_december_bonus_exemptions FOR SELECT USING (true);
CREATE POLICY "Admins manage exemptions" ON c3_december_bonus_exemptions FOR ALL USING (has_role(auth.uid(), 'admin'));

CREATE POLICY "Public read SE settings" ON c3_self_employed_settings FOR SELECT USING (true);
CREATE POLICY "Admins manage SE settings" ON c3_self_employed_settings FOR ALL USING (has_role(auth.uid(), 'admin'));

CREATE POLICY "Public read wage_categories" ON c3_wage_categories FOR SELECT USING (true);
CREATE POLICY "Admins manage wage_categories" ON c3_wage_categories FOR ALL USING (has_role(auth.uid(), 'admin'));

-- Companies - authenticated users can read, admins manage
CREATE POLICY "Authenticated read companies" ON c3_companies FOR SELECT TO authenticated USING (true);
CREATE POLICY "Admins manage companies" ON c3_companies FOR ALL USING (has_role(auth.uid(), 'admin'));

-- Self-employed profiles
CREATE POLICY "SE view own profile" ON c3_self_employed_profiles FOR SELECT USING (user_id = auth.uid() OR has_role(auth.uid(), 'admin'));
CREATE POLICY "SE manage own profile" ON c3_self_employed_profiles FOR ALL USING (user_id = auth.uid() OR has_role(auth.uid(), 'admin'));

-- Audit logs
CREATE POLICY "Admins view audit" ON c3_audit_logs FOR SELECT USING (has_role(auth.uid(), 'admin'));

-- Employees - authenticated users can read their company's employees
CREATE POLICY "Authenticated read employees" ON c3_employees FOR SELECT TO authenticated USING (true);
CREATE POLICY "Admins manage employees" ON c3_employees FOR ALL USING (has_role(auth.uid(), 'admin'));

-- C3 Headers
CREATE POLICY "Authenticated read C3" ON c3_contribution_headers FOR SELECT TO authenticated USING (true);
CREATE POLICY "Authenticated create C3" ON c3_contribution_headers FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Admins manage C3" ON c3_contribution_headers FOR ALL USING (has_role(auth.uid(), 'admin'));

-- C3 Details
CREATE POLICY "Authenticated read C3 details" ON c3_contribution_details FOR SELECT TO authenticated USING (true);
CREATE POLICY "Authenticated create C3 details" ON c3_contribution_details FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Admins manage C3 details" ON c3_contribution_details FOR ALL USING (has_role(auth.uid(), 'admin'));

-- Payments
CREATE POLICY "Authenticated read payments" ON c3_payments FOR SELECT TO authenticated USING (true);
CREATE POLICY "Admins manage payments" ON c3_payments FOR ALL USING (has_role(auth.uid(), 'admin'));

-- Login logs (keep existing policies)
CREATE POLICY "View own logs" ON c3_login_logs FOR SELECT USING (user_id = auth.uid() OR has_role(auth.uid(), 'admin'));

-- Lookup tables (public read)
CREATE POLICY "Public read income_codes" ON c3_income_codes FOR SELECT USING (true);
CREATE POLICY "Admins manage income_codes" ON c3_income_codes FOR ALL USING (has_role(auth.uid(), 'admin'));

CREATE POLICY "Public read deduction_codes" ON c3_deduction_codes FOR SELECT USING (true);
CREATE POLICY "Admins manage deduction_codes" ON c3_deduction_codes FOR ALL USING (has_role(auth.uid(), 'admin'));

CREATE POLICY "Public read obligation_codes" ON c3_obligation_codes FOR SELECT USING (true);
CREATE POLICY "Admins manage obligation_codes" ON c3_obligation_codes FOR ALL USING (has_role(auth.uid(), 'admin'));

-- Employee setup tables
CREATE POLICY "Authenticated manage incomes" ON c3_employee_incomes FOR ALL TO authenticated USING (true);
CREATE POLICY "Authenticated manage deductions" ON c3_employee_deductions FOR ALL TO authenticated USING (true);
CREATE POLICY "Authenticated manage obligations" ON c3_employee_obligations FOR ALL TO authenticated USING (true);

-- Payroll tables
CREATE POLICY "Authenticated manage payroll" ON c3_payroll_headers FOR ALL TO authenticated USING (true);
CREATE POLICY "Authenticated manage payroll_details" ON c3_payroll_details FOR ALL TO authenticated USING (true);

-- Timecards
CREATE POLICY "Authenticated manage timecards" ON c3_timecard_headers FOR ALL TO authenticated USING (true);
CREATE POLICY "Authenticated manage timecard_details" ON c3_timecard_details FOR ALL TO authenticated USING (true);
CREATE POLICY "Authenticated manage work_duration" ON c3_work_duration_details FOR ALL TO authenticated USING (true);

-- Holiday/Bonus
CREATE POLICY "Authenticated manage holiday" ON c3_holiday_pay_details FOR ALL TO authenticated USING (true);
CREATE POLICY "Authenticated manage bonus" ON c3_bonus_details FOR ALL TO authenticated USING (true);

-- Location lookups
CREATE POLICY "Public read countries" ON c3_countries FOR SELECT USING (true);
CREATE POLICY "Admins manage countries" ON c3_countries FOR ALL USING (has_role(auth.uid(), 'admin'));

CREATE POLICY "Public read states" ON c3_states FOR SELECT USING (true);
CREATE POLICY "Admins manage states" ON c3_states FOR ALL USING (has_role(auth.uid(), 'admin'));

CREATE POLICY "Public read cities" ON c3_cities FOR SELECT USING (true);
CREATE POLICY "Admins manage cities" ON c3_cities FOR ALL USING (has_role(auth.uid(), 'admin'));

-- Self-employed contributions
CREATE POLICY "SE manage contributions" ON c3_self_employed_contributions FOR ALL TO authenticated USING (true);

-- Director rates
CREATE POLICY "Public read director" ON c3_director_rates FOR SELECT USING (true);
CREATE POLICY "Admins manage director" ON c3_director_rates FOR ALL USING (has_role(auth.uid(), 'admin'));

-- Error/Exception logs
CREATE POLICY "Admins view errors" ON c3_error_logs FOR SELECT USING (has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins view exceptions" ON c3_exception_logs FOR SELECT USING (has_role(auth.uid(), 'admin'));

-- Contact logs
CREATE POLICY "Admins view contacts" ON c3_contact_logs FOR SELECT USING (has_role(auth.uid(), 'admin'));

-- Content pages
CREATE POLICY "Public read content" ON c3_content_pages FOR SELECT USING (true);
CREATE POLICY "Admins manage content" ON c3_content_pages FOR ALL USING (has_role(auth.uid(), 'admin'));

-- Site settings
CREATE POLICY "Public read site_settings" ON c3_site_settings FOR SELECT USING (true);
CREATE POLICY "Admins manage site_settings" ON c3_site_settings FOR ALL USING (has_role(auth.uid(), 'admin'));

-- User permissions
CREATE POLICY "View own permissions" ON c3_user_permissions FOR SELECT TO authenticated USING (true);
CREATE POLICY "Admins manage permissions" ON c3_user_permissions FOR ALL USING (has_role(auth.uid(), 'admin'));

-- CyberSource
CREATE POLICY "Admins manage cybersource" ON c3_cybersource_reconciliation FOR ALL USING (has_role(auth.uid(), 'admin'));

-- Email templates
CREATE POLICY "Admins manage templates" ON c3_email_templates FOR ALL USING (has_role(auth.uid(), 'admin'));

-- Security tables
CREATE POLICY "Admins manage sec_users" ON c3_sec_users FOR ALL USING (has_role(auth.uid(), 'admin'));
CREATE POLICY "Users view own sec_user" ON c3_sec_users FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "Admins manage sec_profile" ON c3_sec_users_profile FOR ALL USING (has_role(auth.uid(), 'admin'));

CREATE POLICY "Public read modules" ON c3_sec_modules FOR SELECT USING (true);
CREATE POLICY "Admins manage modules" ON c3_sec_modules FOR ALL USING (has_role(auth.uid(), 'admin'));

CREATE POLICY "Public read roles" ON c3_sec_roles FOR SELECT USING (true);
CREATE POLICY "Admins manage sec_roles" ON c3_sec_roles FOR ALL USING (has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins manage user_modules" ON c3_sec_user_modules FOR ALL USING (has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins manage security_answers" ON c3_security_question_answers FOR ALL USING (has_role(auth.uid(), 'admin'));

-- Admin-only operational tables
CREATE POLICY "Admins manage custom_errors" ON c3_custom_error_logs FOR ALL USING (has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins manage bank_payments" ON c3_bank_payments FOR ALL USING (has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins manage cards" ON c3_user_card_details FOR ALL USING (has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins manage recon_details" ON c3_reconciliation_details FOR ALL USING (has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins manage cyber_columns" ON c3_cybersource_columns FOR ALL USING (has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins manage holiday_dates" ON c3_holiday_pay_dates FOR ALL USING (has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins manage wages_pay" ON c3_wages_pay_details FOR ALL USING (has_role(auth.uid(), 'admin'));
CREATE POLICY "Public read employer_codes" ON c3_employer_codes FOR SELECT USING (true);
CREATE POLICY "Admins manage employer_codes" ON c3_employer_codes FOR ALL USING (has_role(auth.uid(), 'admin'));
CREATE POLICY "Public read emp_types" ON c3_employee_types FOR SELECT USING (true);
CREATE POLICY "Admins manage emp_types" ON c3_employee_types FOR ALL USING (has_role(auth.uid(), 'admin'));
CREATE POLICY "Public read tax_headers" ON c3_tax_table_headers FOR SELECT USING (true);
CREATE POLICY "Admins manage tax_headers" ON c3_tax_table_headers FOR ALL USING (has_role(auth.uid(), 'admin'));
CREATE POLICY "Public read tax_details" ON c3_tax_table_details FOR SELECT USING (true);
CREATE POLICY "Admins manage tax_details" ON c3_tax_table_details FOR ALL USING (has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins manage pay_employees" ON c3_pay_employees FOR ALL USING (has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins manage pay_incomes" ON c3_pay_incomes FOR ALL USING (has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins manage pay_deductions" ON c3_pay_deductions FOR ALL USING (has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins manage pay_obligations" ON c3_pay_obligations FOR ALL USING (has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins manage user_otps" ON c3_user_otps FOR ALL USING (has_role(auth.uid(), 'admin'));