-- =====================================================
-- SECURITY FIX: Complete RLS setup (corrected column names)
-- =====================================================

-- Helper functions (CREATE OR REPLACE is idempotent)
CREATE OR REPLACE FUNCTION public.is_admin(user_auth_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path TO 'public'
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.c3_users 
    WHERE auth_user_id = user_auth_id 
      AND role_id IN (13, 14, 18, 19, 20, 21, 22, 24)
      AND is_deleted = false
  );
$$;

CREATE OR REPLACE FUNCTION public.get_user_self_employed_id(user_auth_id uuid)
RETURNS integer
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path TO 'public'
AS $$
  SELECT self_employed_id FROM public.c3_users WHERE auth_user_id = user_auth_id LIMIT 1;
$$;

-- =====================================================
-- TABLES WITHOUT RLS - Enable RLS and add policies
-- =====================================================

-- c3_about_us
ALTER TABLE public.c3_about_us ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Public can read about us" ON public.c3_about_us;
DROP POLICY IF EXISTS "Admins can manage about us" ON public.c3_about_us;
CREATE POLICY "Public can read about us" ON public.c3_about_us FOR SELECT USING (true);
CREATE POLICY "Admins can manage about us" ON public.c3_about_us FOR ALL USING (is_admin(auth.uid()));

-- c3_cities
ALTER TABLE public.c3_cities ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Public can read cities" ON public.c3_cities;
DROP POLICY IF EXISTS "Admins can manage cities" ON public.c3_cities;
CREATE POLICY "Public can read cities" ON public.c3_cities FOR SELECT USING (true);
CREATE POLICY "Admins can manage cities" ON public.c3_cities FOR ALL USING (is_admin(auth.uid()));

-- c3_countries
ALTER TABLE public.c3_countries ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Public can read countries" ON public.c3_countries;
DROP POLICY IF EXISTS "Admins can manage countries" ON public.c3_countries;
CREATE POLICY "Public can read countries" ON public.c3_countries FOR SELECT USING (true);
CREATE POLICY "Admins can manage countries" ON public.c3_countries FOR ALL USING (is_admin(auth.uid()));

-- c3_states
ALTER TABLE public.c3_states ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Public can read states" ON public.c3_states;
DROP POLICY IF EXISTS "Admins can manage states" ON public.c3_states;
CREATE POLICY "Public can read states" ON public.c3_states FOR SELECT USING (true);
CREATE POLICY "Admins can manage states" ON public.c3_states FOR ALL USING (is_admin(auth.uid()));

-- c3_employee_types
ALTER TABLE public.c3_employee_types ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Authenticated can read employee types" ON public.c3_employee_types;
DROP POLICY IF EXISTS "Admins can manage employee types" ON public.c3_employee_types;
CREATE POLICY "Authenticated can read employee types" ON public.c3_employee_types FOR SELECT TO authenticated USING (true);
CREATE POLICY "Admins can manage employee types" ON public.c3_employee_types FOR ALL USING (is_admin(auth.uid()));

-- c3_roles
ALTER TABLE public.c3_roles ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Authenticated can read roles" ON public.c3_roles;
DROP POLICY IF EXISTS "Admins can manage roles" ON public.c3_roles;
CREATE POLICY "Authenticated can read roles" ON public.c3_roles FOR SELECT TO authenticated USING (true);
CREATE POLICY "Admins can manage roles" ON public.c3_roles FOR ALL USING (is_admin(auth.uid()));

-- c3_modules
ALTER TABLE public.c3_modules ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Authenticated can read modules" ON public.c3_modules;
DROP POLICY IF EXISTS "Admins can manage modules" ON public.c3_modules;
CREATE POLICY "Authenticated can read modules" ON public.c3_modules FOR SELECT TO authenticated USING (true);
CREATE POLICY "Admins can manage modules" ON public.c3_modules FOR ALL USING (is_admin(auth.uid()));

-- c3_system_rates
ALTER TABLE public.c3_system_rates ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Authenticated can read system rates" ON public.c3_system_rates;
DROP POLICY IF EXISTS "Admins can manage system rates" ON public.c3_system_rates;
CREATE POLICY "Authenticated can read system rates" ON public.c3_system_rates FOR SELECT TO authenticated USING (true);
CREATE POLICY "Admins can manage system rates" ON public.c3_system_rates FOR ALL USING (is_admin(auth.uid()));

-- c3_levy_tiers
ALTER TABLE public.c3_levy_tiers ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Authenticated can read levy tiers" ON public.c3_levy_tiers;
DROP POLICY IF EXISTS "Admins can manage levy tiers" ON public.c3_levy_tiers;
CREATE POLICY "Authenticated can read levy tiers" ON public.c3_levy_tiers FOR SELECT TO authenticated USING (true);
CREATE POLICY "Admins can manage levy tiers" ON public.c3_levy_tiers FOR ALL USING (is_admin(auth.uid()));

-- c3_levy_allowances
ALTER TABLE public.c3_levy_allowances ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Authenticated can read levy allowances" ON public.c3_levy_allowances;
DROP POLICY IF EXISTS "Admins can manage levy allowances" ON public.c3_levy_allowances;
CREATE POLICY "Authenticated can read levy allowances" ON public.c3_levy_allowances FOR SELECT TO authenticated USING (true);
CREATE POLICY "Admins can manage levy allowances" ON public.c3_levy_allowances FOR ALL USING (is_admin(auth.uid()));

-- c3_employer_codes
ALTER TABLE public.c3_employer_codes ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Authenticated can read employer codes" ON public.c3_employer_codes;
DROP POLICY IF EXISTS "Admins can manage employer codes" ON public.c3_employer_codes;
CREATE POLICY "Authenticated can read employer codes" ON public.c3_employer_codes FOR SELECT TO authenticated USING (true);
CREATE POLICY "Admins can manage employer codes" ON public.c3_employer_codes FOR ALL USING (is_admin(auth.uid()));

-- c3_nwd_rate_settings
ALTER TABLE public.c3_nwd_rate_settings ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Authenticated can read nwd rates" ON public.c3_nwd_rate_settings;
DROP POLICY IF EXISTS "Admins can manage nwd rates" ON public.c3_nwd_rate_settings;
CREATE POLICY "Authenticated can read nwd rates" ON public.c3_nwd_rate_settings FOR SELECT TO authenticated USING (true);
CREATE POLICY "Admins can manage nwd rates" ON public.c3_nwd_rate_settings FOR ALL USING (is_admin(auth.uid()));

-- c3_bonus_exemptions
ALTER TABLE public.c3_bonus_exemptions ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Authenticated can read bonus exemptions" ON public.c3_bonus_exemptions;
DROP POLICY IF EXISTS "Admins can manage bonus exemptions" ON public.c3_bonus_exemptions;
CREATE POLICY "Authenticated can read bonus exemptions" ON public.c3_bonus_exemptions FOR SELECT TO authenticated USING (true);
CREATE POLICY "Admins can manage bonus exemptions" ON public.c3_bonus_exemptions FOR ALL USING (is_admin(auth.uid()));

-- c3_deduction_codes
ALTER TABLE public.c3_deduction_codes ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Authenticated can read deduction codes" ON public.c3_deduction_codes;
DROP POLICY IF EXISTS "Admins can manage deduction codes" ON public.c3_deduction_codes;
CREATE POLICY "Authenticated can read deduction codes" ON public.c3_deduction_codes FOR SELECT TO authenticated USING (true);
CREATE POLICY "Admins can manage deduction codes" ON public.c3_deduction_codes FOR ALL USING (is_admin(auth.uid()));

-- c3_income_codes
ALTER TABLE public.c3_income_codes ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Authenticated can read income codes" ON public.c3_income_codes;
DROP POLICY IF EXISTS "Admins can manage income codes" ON public.c3_income_codes;
CREATE POLICY "Authenticated can read income codes" ON public.c3_income_codes FOR SELECT TO authenticated USING (true);
CREATE POLICY "Admins can manage income codes" ON public.c3_income_codes FOR ALL USING (is_admin(auth.uid()));

-- c3_obligation_codes
ALTER TABLE public.c3_obligation_codes ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Authenticated can read obligation codes" ON public.c3_obligation_codes;
DROP POLICY IF EXISTS "Admins can manage obligation codes" ON public.c3_obligation_codes;
CREATE POLICY "Authenticated can read obligation codes" ON public.c3_obligation_codes FOR SELECT TO authenticated USING (true);
CREATE POLICY "Admins can manage obligation codes" ON public.c3_obligation_codes FOR ALL USING (is_admin(auth.uid()));

-- c3_site_settings
ALTER TABLE public.c3_site_settings ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Authenticated can read site settings" ON public.c3_site_settings;
DROP POLICY IF EXISTS "Admins can manage site settings" ON public.c3_site_settings;
CREATE POLICY "Authenticated can read site settings" ON public.c3_site_settings FOR SELECT TO authenticated USING (true);
CREATE POLICY "Admins can manage site settings" ON public.c3_site_settings FOR ALL USING (is_admin(auth.uid()));

-- c3_self_employed_settings
ALTER TABLE public.c3_self_employed_settings ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Public can read self employed settings" ON public.c3_self_employed_settings;
DROP POLICY IF EXISTS "Admins can manage self employed settings" ON public.c3_self_employed_settings;
CREATE POLICY "Public can read self employed settings" ON public.c3_self_employed_settings FOR SELECT USING (true);
CREATE POLICY "Admins can manage self employed settings" ON public.c3_self_employed_settings FOR ALL USING (is_admin(auth.uid()));

-- c3_audit_logs
ALTER TABLE public.c3_audit_logs ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Admins can read audit logs" ON public.c3_audit_logs;
DROP POLICY IF EXISTS "System can insert audit logs" ON public.c3_audit_logs;
CREATE POLICY "Admins can read audit logs" ON public.c3_audit_logs FOR SELECT USING (is_admin(auth.uid()));
CREATE POLICY "System can insert audit logs" ON public.c3_audit_logs FOR INSERT TO authenticated WITH CHECK (true);

-- c3_login_logs
ALTER TABLE public.c3_login_logs ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Admins can read login logs" ON public.c3_login_logs;
DROP POLICY IF EXISTS "System can insert login logs" ON public.c3_login_logs;
CREATE POLICY "Admins can read login logs" ON public.c3_login_logs FOR SELECT USING (is_admin(auth.uid()));
CREATE POLICY "System can insert login logs" ON public.c3_login_logs FOR INSERT TO authenticated WITH CHECK (true);

-- c3_error_logs
ALTER TABLE public.c3_error_logs ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Admins can read error logs" ON public.c3_error_logs;
DROP POLICY IF EXISTS "System can insert error logs" ON public.c3_error_logs;
CREATE POLICY "Admins can read error logs" ON public.c3_error_logs FOR SELECT USING (is_admin(auth.uid()));
CREATE POLICY "System can insert error logs" ON public.c3_error_logs FOR INSERT TO authenticated WITH CHECK (true);

-- c3_exception_logs
ALTER TABLE public.c3_exception_logs ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Admins can manage exception logs" ON public.c3_exception_logs;
CREATE POLICY "Admins can manage exception logs" ON public.c3_exception_logs FOR ALL USING (is_admin(auth.uid()));

-- c3_contact_logs
ALTER TABLE public.c3_contact_logs ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Admins can read contact logs" ON public.c3_contact_logs;
DROP POLICY IF EXISTS "Users can create contact logs" ON public.c3_contact_logs;
CREATE POLICY "Admins can read contact logs" ON public.c3_contact_logs FOR SELECT USING (is_admin(auth.uid()));
CREATE POLICY "Users can create contact logs" ON public.c3_contact_logs FOR INSERT TO authenticated WITH CHECK (true);

-- c3_migration_logs
ALTER TABLE public.c3_migration_logs ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Admins can manage migration logs" ON public.c3_migration_logs;
CREATE POLICY "Admins can manage migration logs" ON public.c3_migration_logs FOR ALL USING (is_admin(auth.uid()));

-- c3_bonus_payments
ALTER TABLE public.c3_bonus_payments ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Company users can view bonus payments" ON public.c3_bonus_payments;
DROP POLICY IF EXISTS "Company users can manage bonus payments" ON public.c3_bonus_payments;
CREATE POLICY "Company users can view bonus payments" ON public.c3_bonus_payments FOR SELECT USING (company_id = get_user_company_id(auth.uid()) OR is_admin(auth.uid()));
CREATE POLICY "Company users can manage bonus payments" ON public.c3_bonus_payments FOR ALL USING (company_id = get_user_company_id(auth.uid()) OR is_admin(auth.uid()));

-- c3_holiday_payments
ALTER TABLE public.c3_holiday_payments ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Company users can view holiday payments" ON public.c3_holiday_payments;
DROP POLICY IF EXISTS "Company users can manage holiday payments" ON public.c3_holiday_payments;
CREATE POLICY "Company users can view holiday payments" ON public.c3_holiday_payments FOR SELECT USING (company_id = get_user_company_id(auth.uid()) OR is_admin(auth.uid()));
CREATE POLICY "Company users can manage holiday payments" ON public.c3_holiday_payments FOR ALL USING (company_id = get_user_company_id(auth.uid()) OR is_admin(auth.uid()));

-- c3_holiday_pay_dates
ALTER TABLE public.c3_holiday_pay_dates ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Company users can view holiday pay dates" ON public.c3_holiday_pay_dates;
DROP POLICY IF EXISTS "Company users can manage holiday pay dates" ON public.c3_holiday_pay_dates;
CREATE POLICY "Company users can view holiday pay dates" ON public.c3_holiday_pay_dates FOR SELECT USING (company_id = get_user_company_id(auth.uid()) OR is_admin(auth.uid()));
CREATE POLICY "Company users can manage holiday pay dates" ON public.c3_holiday_pay_dates FOR ALL USING (company_id = get_user_company_id(auth.uid()) OR is_admin(auth.uid()));

-- c3_contribution_headers
ALTER TABLE public.c3_contribution_headers ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Company users can view contributions" ON public.c3_contribution_headers;
DROP POLICY IF EXISTS "Company users can manage contributions" ON public.c3_contribution_headers;
CREATE POLICY "Company users can view contributions" ON public.c3_contribution_headers FOR SELECT USING (company_id = get_user_company_id(auth.uid()) OR is_admin(auth.uid()));
CREATE POLICY "Company users can manage contributions" ON public.c3_contribution_headers FOR ALL USING (company_id = get_user_company_id(auth.uid()) OR is_admin(auth.uid()));

-- c3_contribution_details (uses header_id)
ALTER TABLE public.c3_contribution_details ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Company users can view contribution details" ON public.c3_contribution_details;
DROP POLICY IF EXISTS "Company users can manage contribution details" ON public.c3_contribution_details;
CREATE POLICY "Company users can view contribution details" ON public.c3_contribution_details FOR SELECT USING (EXISTS (SELECT 1 FROM c3_contribution_headers h WHERE h.id = c3_contribution_details.header_id AND (h.company_id = get_user_company_id(auth.uid()) OR is_admin(auth.uid()))));
CREATE POLICY "Company users can manage contribution details" ON public.c3_contribution_details FOR ALL USING (EXISTS (SELECT 1 FROM c3_contribution_headers h WHERE h.id = c3_contribution_details.header_id AND (h.company_id = get_user_company_id(auth.uid()) OR is_admin(auth.uid()))));

-- c3_payments
ALTER TABLE public.c3_payments ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Company users can view payments" ON public.c3_payments;
DROP POLICY IF EXISTS "Company users can create payments" ON public.c3_payments;
DROP POLICY IF EXISTS "Admins can manage payments" ON public.c3_payments;
CREATE POLICY "Company users can view payments" ON public.c3_payments FOR SELECT USING (company_id = get_user_company_id(auth.uid()) OR is_admin(auth.uid()));
CREATE POLICY "Company users can create payments" ON public.c3_payments FOR INSERT TO authenticated WITH CHECK (company_id = get_user_company_id(auth.uid()) OR is_admin(auth.uid()));
CREATE POLICY "Admins can manage payments" ON public.c3_payments FOR ALL USING (is_admin(auth.uid()));

-- c3_bank_payments
ALTER TABLE public.c3_bank_payments ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Admins can manage bank payments" ON public.c3_bank_payments;
CREATE POLICY "Admins can manage bank payments" ON public.c3_bank_payments FOR ALL USING (is_admin(auth.uid()));

-- c3_reconciliation_records
ALTER TABLE public.c3_reconciliation_records ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Admins can manage reconciliation records" ON public.c3_reconciliation_records;
CREATE POLICY "Admins can manage reconciliation records" ON public.c3_reconciliation_records FOR ALL USING (is_admin(auth.uid()));

-- c3_reconciliation_columns
ALTER TABLE public.c3_reconciliation_columns ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Admins can manage reconciliation columns" ON public.c3_reconciliation_columns;
CREATE POLICY "Admins can manage reconciliation columns" ON public.c3_reconciliation_columns FOR ALL USING (is_admin(auth.uid()));

-- c3_reconciliation_payment_details
ALTER TABLE public.c3_reconciliation_payment_details ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Admins can manage reconciliation payment details" ON public.c3_reconciliation_payment_details;
CREATE POLICY "Admins can manage reconciliation payment details" ON public.c3_reconciliation_payment_details FOR ALL USING (is_admin(auth.uid()));

-- c3_timecard_headers
ALTER TABLE public.c3_timecard_headers ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Company users can view timecard headers" ON public.c3_timecard_headers;
DROP POLICY IF EXISTS "Company users can manage timecard headers" ON public.c3_timecard_headers;
CREATE POLICY "Company users can view timecard headers" ON public.c3_timecard_headers FOR SELECT USING (company_id = get_user_company_id(auth.uid()) OR is_admin(auth.uid()));
CREATE POLICY "Company users can manage timecard headers" ON public.c3_timecard_headers FOR ALL USING (company_id = get_user_company_id(auth.uid()) OR is_admin(auth.uid()));

-- c3_timecard_details (uses timecard_header_id - CORRECTED)
ALTER TABLE public.c3_timecard_details ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Company users can view timecard details" ON public.c3_timecard_details;
DROP POLICY IF EXISTS "Company users can manage timecard details" ON public.c3_timecard_details;
CREATE POLICY "Company users can view timecard details" ON public.c3_timecard_details FOR SELECT USING (EXISTS (SELECT 1 FROM c3_timecard_headers h WHERE h.id = c3_timecard_details.timecard_header_id AND (h.company_id = get_user_company_id(auth.uid()) OR is_admin(auth.uid()))));
CREATE POLICY "Company users can manage timecard details" ON public.c3_timecard_details FOR ALL USING (EXISTS (SELECT 1 FROM c3_timecard_headers h WHERE h.id = c3_timecard_details.timecard_header_id AND (h.company_id = get_user_company_id(auth.uid()) OR is_admin(auth.uid()))));

-- c3_work_duration_details
ALTER TABLE public.c3_work_duration_details ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Company users can view work duration" ON public.c3_work_duration_details;
DROP POLICY IF EXISTS "Company users can manage work duration" ON public.c3_work_duration_details;
CREATE POLICY "Company users can view work duration" ON public.c3_work_duration_details FOR SELECT USING (company_id = get_user_company_id(auth.uid()) OR is_admin(auth.uid()));
CREATE POLICY "Company users can manage work duration" ON public.c3_work_duration_details FOR ALL USING (company_id = get_user_company_id(auth.uid()) OR is_admin(auth.uid()));

-- c3_wages_details
ALTER TABLE public.c3_wages_details ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Company users can view wages" ON public.c3_wages_details;
DROP POLICY IF EXISTS "Company users can manage wages" ON public.c3_wages_details;
CREATE POLICY "Company users can view wages" ON public.c3_wages_details FOR SELECT USING (company_id = get_user_company_id(auth.uid()) OR is_admin(auth.uid()));
CREATE POLICY "Company users can manage wages" ON public.c3_wages_details FOR ALL USING (company_id = get_user_company_id(auth.uid()) OR is_admin(auth.uid()));

-- c3_employee_deductions
ALTER TABLE public.c3_employee_deductions ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Company users can view employee deductions" ON public.c3_employee_deductions;
DROP POLICY IF EXISTS "Company users can manage employee deductions" ON public.c3_employee_deductions;
CREATE POLICY "Company users can view employee deductions" ON public.c3_employee_deductions FOR SELECT USING (EXISTS (SELECT 1 FROM c3_employees e WHERE e.id = c3_employee_deductions.employee_id AND (e.company_id = get_user_company_id(auth.uid()) OR is_admin(auth.uid()))));
CREATE POLICY "Company users can manage employee deductions" ON public.c3_employee_deductions FOR ALL USING (EXISTS (SELECT 1 FROM c3_employees e WHERE e.id = c3_employee_deductions.employee_id AND (e.company_id = get_user_company_id(auth.uid()) OR is_admin(auth.uid()))));

-- c3_employee_incomes
ALTER TABLE public.c3_employee_incomes ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Company users can view employee incomes" ON public.c3_employee_incomes;
DROP POLICY IF EXISTS "Company users can manage employee incomes" ON public.c3_employee_incomes;
CREATE POLICY "Company users can view employee incomes" ON public.c3_employee_incomes FOR SELECT USING (EXISTS (SELECT 1 FROM c3_employees e WHERE e.id = c3_employee_incomes.employee_id AND (e.company_id = get_user_company_id(auth.uid()) OR is_admin(auth.uid()))));
CREATE POLICY "Company users can manage employee incomes" ON public.c3_employee_incomes FOR ALL USING (EXISTS (SELECT 1 FROM c3_employees e WHERE e.id = c3_employee_incomes.employee_id AND (e.company_id = get_user_company_id(auth.uid()) OR is_admin(auth.uid()))));

-- c3_employee_obligations
ALTER TABLE public.c3_employee_obligations ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Company users can view employee obligations" ON public.c3_employee_obligations;
DROP POLICY IF EXISTS "Company users can manage employee obligations" ON public.c3_employee_obligations;
CREATE POLICY "Company users can view employee obligations" ON public.c3_employee_obligations FOR SELECT USING (EXISTS (SELECT 1 FROM c3_employees e WHERE e.id = c3_employee_obligations.employee_id AND (e.company_id = get_user_company_id(auth.uid()) OR is_admin(auth.uid()))));
CREATE POLICY "Company users can manage employee obligations" ON public.c3_employee_obligations FOR ALL USING (EXISTS (SELECT 1 FROM c3_employees e WHERE e.id = c3_employee_obligations.employee_id AND (e.company_id = get_user_company_id(auth.uid()) OR is_admin(auth.uid()))));

-- c3_payroll_headers
ALTER TABLE public.c3_payroll_headers ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Company users can view payroll headers" ON public.c3_payroll_headers;
DROP POLICY IF EXISTS "Company users can manage payroll headers" ON public.c3_payroll_headers;
CREATE POLICY "Company users can view payroll headers" ON public.c3_payroll_headers FOR SELECT USING (company_id = get_user_company_id(auth.uid()) OR is_admin(auth.uid()));
CREATE POLICY "Company users can manage payroll headers" ON public.c3_payroll_headers FOR ALL USING (company_id = get_user_company_id(auth.uid()) OR is_admin(auth.uid()));

-- c3_payroll_details
ALTER TABLE public.c3_payroll_details ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Company users can view payroll details" ON public.c3_payroll_details;
DROP POLICY IF EXISTS "Company users can manage payroll details" ON public.c3_payroll_details;
CREATE POLICY "Company users can view payroll details" ON public.c3_payroll_details FOR SELECT USING (EXISTS (SELECT 1 FROM c3_payroll_headers h WHERE h.id = c3_payroll_details.payroll_header_id AND (h.company_id = get_user_company_id(auth.uid()) OR is_admin(auth.uid()))));
CREATE POLICY "Company users can manage payroll details" ON public.c3_payroll_details FOR ALL USING (EXISTS (SELECT 1 FROM c3_payroll_headers h WHERE h.id = c3_payroll_details.payroll_header_id AND (h.company_id = get_user_company_id(auth.uid()) OR is_admin(auth.uid()))));

-- c3_payroll_employees
ALTER TABLE public.c3_payroll_employees ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Company users can view payroll employees" ON public.c3_payroll_employees;
DROP POLICY IF EXISTS "Company users can manage payroll employees" ON public.c3_payroll_employees;
CREATE POLICY "Company users can view payroll employees" ON public.c3_payroll_employees FOR SELECT USING (EXISTS (SELECT 1 FROM c3_payroll_headers h WHERE h.id = c3_payroll_employees.payroll_header_id AND (h.company_id = get_user_company_id(auth.uid()) OR is_admin(auth.uid()))));
CREATE POLICY "Company users can manage payroll employees" ON public.c3_payroll_employees FOR ALL USING (EXISTS (SELECT 1 FROM c3_payroll_headers h WHERE h.id = c3_payroll_employees.payroll_header_id AND (h.company_id = get_user_company_id(auth.uid()) OR is_admin(auth.uid()))));

-- c3_payroll_deductions
ALTER TABLE public.c3_payroll_deductions ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Company users can view payroll deductions" ON public.c3_payroll_deductions;
DROP POLICY IF EXISTS "Company users can manage payroll deductions" ON public.c3_payroll_deductions;
CREATE POLICY "Company users can view payroll deductions" ON public.c3_payroll_deductions FOR SELECT USING (EXISTS (SELECT 1 FROM c3_payroll_employees pe JOIN c3_payroll_headers h ON h.id = pe.payroll_header_id WHERE pe.id = c3_payroll_deductions.payroll_employee_id AND (h.company_id = get_user_company_id(auth.uid()) OR is_admin(auth.uid()))));
CREATE POLICY "Company users can manage payroll deductions" ON public.c3_payroll_deductions FOR ALL USING (EXISTS (SELECT 1 FROM c3_payroll_employees pe JOIN c3_payroll_headers h ON h.id = pe.payroll_header_id WHERE pe.id = c3_payroll_deductions.payroll_employee_id AND (h.company_id = get_user_company_id(auth.uid()) OR is_admin(auth.uid()))));

-- c3_payroll_incomes
ALTER TABLE public.c3_payroll_incomes ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Company users can view payroll incomes" ON public.c3_payroll_incomes;
DROP POLICY IF EXISTS "Company users can manage payroll incomes" ON public.c3_payroll_incomes;
CREATE POLICY "Company users can view payroll incomes" ON public.c3_payroll_incomes FOR SELECT USING (EXISTS (SELECT 1 FROM c3_payroll_employees pe JOIN c3_payroll_headers h ON h.id = pe.payroll_header_id WHERE pe.id = c3_payroll_incomes.payroll_employee_id AND (h.company_id = get_user_company_id(auth.uid()) OR is_admin(auth.uid()))));
CREATE POLICY "Company users can manage payroll incomes" ON public.c3_payroll_incomes FOR ALL USING (EXISTS (SELECT 1 FROM c3_payroll_employees pe JOIN c3_payroll_headers h ON h.id = pe.payroll_header_id WHERE pe.id = c3_payroll_incomes.payroll_employee_id AND (h.company_id = get_user_company_id(auth.uid()) OR is_admin(auth.uid()))));

-- c3_payroll_obligations
ALTER TABLE public.c3_payroll_obligations ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Company users can view payroll obligations" ON public.c3_payroll_obligations;
DROP POLICY IF EXISTS "Company users can manage payroll obligations" ON public.c3_payroll_obligations;
CREATE POLICY "Company users can view payroll obligations" ON public.c3_payroll_obligations FOR SELECT USING (EXISTS (SELECT 1 FROM c3_payroll_employees pe JOIN c3_payroll_headers h ON h.id = pe.payroll_header_id WHERE pe.id = c3_payroll_obligations.payroll_employee_id AND (h.company_id = get_user_company_id(auth.uid()) OR is_admin(auth.uid()))));
CREATE POLICY "Company users can manage payroll obligations" ON public.c3_payroll_obligations FOR ALL USING (EXISTS (SELECT 1 FROM c3_payroll_employees pe JOIN c3_payroll_headers h ON h.id = pe.payroll_header_id WHERE pe.id = c3_payroll_obligations.payroll_employee_id AND (h.company_id = get_user_company_id(auth.uid()) OR is_admin(auth.uid()))));

-- c3_self_employed
ALTER TABLE public.c3_self_employed ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Self-employed can view own record" ON public.c3_self_employed;
DROP POLICY IF EXISTS "Self-employed can update own record" ON public.c3_self_employed;
DROP POLICY IF EXISTS "Registration can create self-employed" ON public.c3_self_employed;
DROP POLICY IF EXISTS "Admins can delete self-employed" ON public.c3_self_employed;
CREATE POLICY "Self-employed can view own record" ON public.c3_self_employed FOR SELECT USING (id = get_user_self_employed_id(auth.uid()) OR is_admin(auth.uid()));
CREATE POLICY "Self-employed can update own record" ON public.c3_self_employed FOR UPDATE USING (id = get_user_self_employed_id(auth.uid()) OR is_admin(auth.uid()));
CREATE POLICY "Registration can create self-employed" ON public.c3_self_employed FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Admins can delete self-employed" ON public.c3_self_employed FOR DELETE USING (is_admin(auth.uid()));

-- c3_self_employed_contributions
ALTER TABLE public.c3_self_employed_contributions ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Self-employed can view contributions" ON public.c3_self_employed_contributions;
DROP POLICY IF EXISTS "Self-employed can create contributions" ON public.c3_self_employed_contributions;
DROP POLICY IF EXISTS "Self-employed can update contributions" ON public.c3_self_employed_contributions;
DROP POLICY IF EXISTS "Admins can delete contributions" ON public.c3_self_employed_contributions;
CREATE POLICY "Self-employed can view contributions" ON public.c3_self_employed_contributions FOR SELECT USING (self_employed_id = get_user_self_employed_id(auth.uid()) OR is_admin(auth.uid()));
CREATE POLICY "Self-employed can create contributions" ON public.c3_self_employed_contributions FOR INSERT TO authenticated WITH CHECK (self_employed_id = get_user_self_employed_id(auth.uid()) OR is_admin(auth.uid()));
CREATE POLICY "Self-employed can update contributions" ON public.c3_self_employed_contributions FOR UPDATE USING (self_employed_id = get_user_self_employed_id(auth.uid()) OR is_admin(auth.uid()));
CREATE POLICY "Admins can delete contributions" ON public.c3_self_employed_contributions FOR DELETE USING (is_admin(auth.uid()));

-- c3_user_profiles
ALTER TABLE public.c3_user_profiles ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Users can view own profile" ON public.c3_user_profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON public.c3_user_profiles;
DROP POLICY IF EXISTS "Users can insert own profile" ON public.c3_user_profiles;
CREATE POLICY "Users can view own profile" ON public.c3_user_profiles FOR SELECT USING (EXISTS (SELECT 1 FROM c3_users u WHERE u.id = c3_user_profiles.user_id AND u.auth_user_id = auth.uid()) OR is_admin(auth.uid()));
CREATE POLICY "Users can update own profile" ON public.c3_user_profiles FOR UPDATE USING (EXISTS (SELECT 1 FROM c3_users u WHERE u.id = c3_user_profiles.user_id AND u.auth_user_id = auth.uid()) OR is_admin(auth.uid()));
CREATE POLICY "Users can insert own profile" ON public.c3_user_profiles FOR INSERT TO authenticated WITH CHECK (EXISTS (SELECT 1 FROM c3_users u WHERE u.id = c3_user_profiles.user_id AND u.auth_user_id = auth.uid()) OR is_admin(auth.uid()));

-- c3_user_permissions
ALTER TABLE public.c3_user_permissions ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Users can view own permissions" ON public.c3_user_permissions;
DROP POLICY IF EXISTS "Admins can manage permissions" ON public.c3_user_permissions;
CREATE POLICY "Users can view own permissions" ON public.c3_user_permissions FOR SELECT USING (EXISTS (SELECT 1 FROM c3_users u WHERE u.id = c3_user_permissions.user_id AND u.auth_user_id = auth.uid()) OR is_admin(auth.uid()));
CREATE POLICY "Admins can manage permissions" ON public.c3_user_permissions FOR ALL USING (is_admin(auth.uid()));

-- c3_user_granular_permissions
ALTER TABLE public.c3_user_granular_permissions ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Users can view own granular permissions" ON public.c3_user_granular_permissions;
DROP POLICY IF EXISTS "Admins can manage granular permissions" ON public.c3_user_granular_permissions;
CREATE POLICY "Users can view own granular permissions" ON public.c3_user_granular_permissions FOR SELECT USING (EXISTS (SELECT 1 FROM c3_users u WHERE u.id = c3_user_granular_permissions.user_id AND u.auth_user_id = auth.uid()) OR is_admin(auth.uid()));
CREATE POLICY "Admins can manage granular permissions" ON public.c3_user_granular_permissions FOR ALL USING (is_admin(auth.uid()));

-- c3_user_otps
ALTER TABLE public.c3_user_otps ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Users can view own OTPs" ON public.c3_user_otps;
DROP POLICY IF EXISTS "System can insert OTPs" ON public.c3_user_otps;
DROP POLICY IF EXISTS "Admins can manage OTPs" ON public.c3_user_otps;
CREATE POLICY "Users can view own OTPs" ON public.c3_user_otps FOR SELECT USING (EXISTS (SELECT 1 FROM c3_users u WHERE u.id = c3_user_otps.user_id AND u.auth_user_id = auth.uid()));
CREATE POLICY "System can insert OTPs" ON public.c3_user_otps FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Admins can manage OTPs" ON public.c3_user_otps FOR ALL USING (is_admin(auth.uid()));

-- c3_security_questions
ALTER TABLE public.c3_security_questions ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Public can read security questions" ON public.c3_security_questions;
DROP POLICY IF EXISTS "Admins can manage security questions" ON public.c3_security_questions;
CREATE POLICY "Public can read security questions" ON public.c3_security_questions FOR SELECT USING (true);
CREATE POLICY "Admins can manage security questions" ON public.c3_security_questions FOR ALL USING (is_admin(auth.uid()));

-- c3_saved_cards
ALTER TABLE public.c3_saved_cards ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Users can view own saved cards" ON public.c3_saved_cards;
DROP POLICY IF EXISTS "Users can insert own saved cards" ON public.c3_saved_cards;
DROP POLICY IF EXISTS "Users can update own saved cards" ON public.c3_saved_cards;
DROP POLICY IF EXISTS "Users can delete own saved cards" ON public.c3_saved_cards;
CREATE POLICY "Users can view own saved cards" ON public.c3_saved_cards FOR SELECT USING (EXISTS (SELECT 1 FROM c3_users u WHERE u.id = c3_saved_cards.user_id AND u.auth_user_id = auth.uid()) OR is_admin(auth.uid()));
CREATE POLICY "Users can insert own saved cards" ON public.c3_saved_cards FOR INSERT TO authenticated WITH CHECK (EXISTS (SELECT 1 FROM c3_users u WHERE u.id = c3_saved_cards.user_id AND u.auth_user_id = auth.uid()) OR is_admin(auth.uid()));
CREATE POLICY "Users can update own saved cards" ON public.c3_saved_cards FOR UPDATE USING (EXISTS (SELECT 1 FROM c3_users u WHERE u.id = c3_saved_cards.user_id AND u.auth_user_id = auth.uid()) OR is_admin(auth.uid()));
CREATE POLICY "Users can delete own saved cards" ON public.c3_saved_cards FOR DELETE USING (EXISTS (SELECT 1 FROM c3_users u WHERE u.id = c3_saved_cards.user_id AND u.auth_user_id = auth.uid()) OR is_admin(auth.uid()));

-- c3_temp_registrations
ALTER TABLE public.c3_temp_registrations ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Public can create temp registrations" ON public.c3_temp_registrations;
DROP POLICY IF EXISTS "Admins can manage temp registrations" ON public.c3_temp_registrations;
CREATE POLICY "Public can create temp registrations" ON public.c3_temp_registrations FOR INSERT WITH CHECK (true);
CREATE POLICY "Admins can manage temp registrations" ON public.c3_temp_registrations FOR ALL USING (is_admin(auth.uid()));

-- Grant statements
GRANT SELECT ON ALL TABLES IN SCHEMA public TO authenticated;
GRANT ALL ON ALL TABLES IN SCHEMA public TO service_role;