-- Drop all triggers first
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP TRIGGER IF EXISTS update_c3_employees_updated_at ON public.c3_employees;
DROP TRIGGER IF EXISTS update_c3_contribution_headers_updated_at ON public.c3_contribution_headers;
DROP TRIGGER IF EXISTS update_c3_contribution_details_updated_at ON public.c3_contribution_details;

-- Drop all RLS policies (they depend on has_role function)
DO $$ 
DECLARE
    r RECORD;
BEGIN
    FOR r IN (SELECT schemaname, tablename, policyname FROM pg_policies WHERE schemaname = 'public') LOOP
        EXECUTE format('DROP POLICY IF EXISTS %I ON %I.%I', r.policyname, r.schemaname, r.tablename);
    END LOOP;
END $$;

-- Drop all functions with CASCADE
DROP FUNCTION IF EXISTS public.has_role(uuid, app_role) CASCADE;
DROP FUNCTION IF EXISTS public.handle_new_user() CASCADE;
DROP FUNCTION IF EXISTS public.update_employee_updated_at() CASCADE;
DROP FUNCTION IF EXISTS public.update_c3_header_updated_at() CASCADE;
DROP FUNCTION IF EXISTS public.update_c3_detail_updated_at() CASCADE;

-- Drop all c3_ tables
DROP TABLE IF EXISTS public.c3_audit_logs CASCADE;
DROP TABLE IF EXISTS public.c3_bank_payments CASCADE;
DROP TABLE IF EXISTS public.c3_bonus_details CASCADE;
DROP TABLE IF EXISTS public.c3_cities CASCADE;
DROP TABLE IF EXISTS public.c3_companies CASCADE;
DROP TABLE IF EXISTS public.c3_contact_logs CASCADE;
DROP TABLE IF EXISTS public.c3_content_pages CASCADE;
DROP TABLE IF EXISTS public.c3_contribution_details CASCADE;
DROP TABLE IF EXISTS public.c3_contribution_headers CASCADE;
DROP TABLE IF EXISTS public.c3_countries CASCADE;
DROP TABLE IF EXISTS public.c3_custom_error_logs CASCADE;
DROP TABLE IF EXISTS public.c3_cybersource_columns CASCADE;
DROP TABLE IF EXISTS public.c3_cybersource_reconciliation CASCADE;
DROP TABLE IF EXISTS public.c3_december_bonus_exemptions CASCADE;
DROP TABLE IF EXISTS public.c3_deduction_codes CASCADE;
DROP TABLE IF EXISTS public.c3_director_rates CASCADE;
DROP TABLE IF EXISTS public.c3_email_templates CASCADE;
DROP TABLE IF EXISTS public.c3_employee_deductions CASCADE;
DROP TABLE IF EXISTS public.c3_employee_incomes CASCADE;
DROP TABLE IF EXISTS public.c3_employee_obligations CASCADE;
DROP TABLE IF EXISTS public.c3_employee_types CASCADE;
DROP TABLE IF EXISTS public.c3_employees CASCADE;
DROP TABLE IF EXISTS public.c3_employer_codes CASCADE;
DROP TABLE IF EXISTS public.c3_employer_company_links CASCADE;
DROP TABLE IF EXISTS public.c3_error_logs CASCADE;
DROP TABLE IF EXISTS public.c3_exception_logs CASCADE;
DROP TABLE IF EXISTS public.c3_holiday_pay_dates CASCADE;
DROP TABLE IF EXISTS public.c3_holiday_pay_details CASCADE;
DROP TABLE IF EXISTS public.c3_income_codes CASCADE;
DROP TABLE IF EXISTS public.c3_levy_tiers CASCADE;
DROP TABLE IF EXISTS public.c3_login_logs CASCADE;
DROP TABLE IF EXISTS public.c3_obligation_codes CASCADE;
DROP TABLE IF EXISTS public.c3_payments CASCADE;
DROP TABLE IF EXISTS public.c3_payroll_details CASCADE;
DROP TABLE IF EXISTS public.c3_payroll_headers CASCADE;
DROP TABLE IF EXISTS public.c3_profiles CASCADE;
DROP TABLE IF EXISTS public.c3_reconciliation_details CASCADE;
DROP TABLE IF EXISTS public.c3_sec_modules CASCADE;
DROP TABLE IF EXISTS public.c3_sec_roles CASCADE;
DROP TABLE IF EXISTS public.c3_sec_user_modules CASCADE;
DROP TABLE IF EXISTS public.c3_sec_users CASCADE;
DROP TABLE IF EXISTS public.c3_sec_users_profile CASCADE;
DROP TABLE IF EXISTS public.c3_security_questions CASCADE;
DROP TABLE IF EXISTS public.c3_security_question_answers CASCADE;
DROP TABLE IF EXISTS public.c3_self_employed_profiles CASCADE;
DROP TABLE IF EXISTS public.c3_self_employed_settings CASCADE;
DROP TABLE IF EXISTS public.c3_site_settings CASCADE;
DROP TABLE IF EXISTS public.c3_states CASCADE;
DROP TABLE IF EXISTS public.c3_system_rates CASCADE;
DROP TABLE IF EXISTS public.c3_user_cards CASCADE;
DROP TABLE IF EXISTS public.c3_user_card_details CASCADE;
DROP TABLE IF EXISTS public.c3_user_otp CASCADE;
DROP TABLE IF EXISTS public.c3_user_otps CASCADE;
DROP TABLE IF EXISTS public.c3_user_permissions CASCADE;
DROP TABLE IF EXISTS public.c3_user_roles CASCADE;
DROP TABLE IF EXISTS public.c3_wage_categories CASCADE;
DROP TABLE IF EXISTS public.c3_wages_pay_details CASCADE;
DROP TABLE IF EXISTS public.c3_tax_table_headers CASCADE;
DROP TABLE IF EXISTS public.c3_tax_table_details CASCADE;
DROP TABLE IF EXISTS public.c3_pay_employees CASCADE;
DROP TABLE IF EXISTS public.c3_pay_incomes CASCADE;
DROP TABLE IF EXISTS public.c3_pay_deductions CASCADE;
DROP TABLE IF EXISTS public.c3_pay_obligations CASCADE;

-- Drop the enum type
DROP TYPE IF EXISTS public.app_role CASCADE;