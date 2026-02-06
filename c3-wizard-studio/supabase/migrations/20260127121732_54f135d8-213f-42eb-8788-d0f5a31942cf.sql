-- Step 1: Drop ALL RLS policies that depend on has_role function
-- This is a comprehensive cleanup

-- c3_user_roles
DROP POLICY IF EXISTS "Admins can manage all roles" ON c3_user_roles;

-- c3_profiles
DROP POLICY IF EXISTS "Admins can view all profiles" ON c3_profiles;
DROP POLICY IF EXISTS "Users can view own profile" ON c3_profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON c3_profiles;

-- c3_system_rates
DROP POLICY IF EXISTS "Admins can manage system rates" ON c3_system_rates;

-- c3_levy_tiers
DROP POLICY IF EXISTS "Admins can manage levy tiers" ON c3_levy_tiers;

-- c3_december_bonus_exemptions
DROP POLICY IF EXISTS "Admins can manage exemptions" ON c3_december_bonus_exemptions;

-- c3_self_employed_settings
DROP POLICY IF EXISTS "Admins can manage SE settings" ON c3_self_employed_settings;

-- c3_wage_categories
DROP POLICY IF EXISTS "Admins can manage wage categories" ON c3_wage_categories;

-- c3_employer_company_links
DROP POLICY IF EXISTS "Users can view own links" ON c3_employer_company_links;
DROP POLICY IF EXISTS "Admins can manage all links" ON c3_employer_company_links;

-- c3_companies
DROP POLICY IF EXISTS "Employers can view own company" ON c3_companies;
DROP POLICY IF EXISTS "Admins can manage all companies" ON c3_companies;

-- c3_self_employed_profiles
DROP POLICY IF EXISTS "Self-employed can view own profile" ON c3_self_employed_profiles;
DROP POLICY IF EXISTS "Admins can manage all SE profiles" ON c3_self_employed_profiles;

-- c3_audit_logs
DROP POLICY IF EXISTS "Admins can view all logs" ON c3_audit_logs;

-- c3_employees
DROP POLICY IF EXISTS "Admins can manage all employees" ON c3_employees;
DROP POLICY IF EXISTS "Employers can view own employees" ON c3_employees;
DROP POLICY IF EXISTS "Employers can add employees" ON c3_employees;
DROP POLICY IF EXISTS "Employers can update own employees" ON c3_employees;

-- c3_contribution_headers
DROP POLICY IF EXISTS "Admins can manage all C3 headers" ON c3_contribution_headers;
DROP POLICY IF EXISTS "Employers can view own C3 headers" ON c3_contribution_headers;
DROP POLICY IF EXISTS "Employers can create C3 headers" ON c3_contribution_headers;
DROP POLICY IF EXISTS "Employers can update own C3 headers" ON c3_contribution_headers;

-- c3_contribution_details
DROP POLICY IF EXISTS "Admins can manage all C3 details" ON c3_contribution_details;
DROP POLICY IF EXISTS "Employers can view own C3 details" ON c3_contribution_details;
DROP POLICY IF EXISTS "Employers can create C3 details" ON c3_contribution_details;
DROP POLICY IF EXISTS "Employers can update own C3 details" ON c3_contribution_details;

-- c3_payments
DROP POLICY IF EXISTS "Admins can manage all payments" ON c3_payments;
DROP POLICY IF EXISTS "Employers can view own payments" ON c3_payments;

-- c3_payment_reconciliation
DROP POLICY IF EXISTS "Admins can manage reconciliation" ON c3_payment_reconciliation;

-- c3_payment_reconciliation_details
DROP POLICY IF EXISTS "Admins can manage reconciliation details" ON c3_payment_reconciliation_details;

-- c3_login_logs
DROP POLICY IF EXISTS "Admins can view all login logs" ON c3_login_logs;

-- c3_income_codes
DROP POLICY IF EXISTS "Admins can manage income codes" ON c3_income_codes;

-- c3_deduction_codes
DROP POLICY IF EXISTS "Admins can manage deduction codes" ON c3_deduction_codes;

-- c3_obligation_codes
DROP POLICY IF EXISTS "Admins can manage obligation codes" ON c3_obligation_codes;

-- c3_employee_incomes
DROP POLICY IF EXISTS "Employers can manage employee incomes" ON c3_employee_incomes;

-- c3_employee_deductions
DROP POLICY IF EXISTS "Employers can manage employee deductions" ON c3_employee_deductions;

-- c3_employee_obligations
DROP POLICY IF EXISTS "Employers can manage employee obligations" ON c3_employee_obligations;

-- c3_payroll_headers
DROP POLICY IF EXISTS "Employers can manage payroll" ON c3_payroll_headers;

-- c3_payroll_details
DROP POLICY IF EXISTS "Employers can manage payroll details" ON c3_payroll_details;

-- c3_timecard_headers
DROP POLICY IF EXISTS "Employers can manage timecards" ON c3_timecard_headers;

-- c3_timecard_details
DROP POLICY IF EXISTS "Employers can manage timecard details" ON c3_timecard_details;

-- c3_work_duration_details
DROP POLICY IF EXISTS "Employers can manage work duration" ON c3_work_duration_details;

-- c3_holiday_pay_details
DROP POLICY IF EXISTS "Employers can manage holiday pay" ON c3_holiday_pay_details;

-- c3_bonus_details
DROP POLICY IF EXISTS "Employers can manage bonus details" ON c3_bonus_details;

-- c3_countries
DROP POLICY IF EXISTS "Admins can manage countries" ON c3_countries;

-- c3_states
DROP POLICY IF EXISTS "Admins can manage states" ON c3_states;

-- c3_cities
DROP POLICY IF EXISTS "Admins can manage cities" ON c3_cities;

-- c3_self_employed_contributions
DROP POLICY IF EXISTS "Self-employed can manage own contributions" ON c3_self_employed_contributions;

-- c3_director_rates
DROP POLICY IF EXISTS "Admins can manage director rates" ON c3_director_rates;

-- c3_error_logs
DROP POLICY IF EXISTS "Admins can view error logs" ON c3_error_logs;

-- c3_exception_logs
DROP POLICY IF EXISTS "Admins can manage exception logs" ON c3_exception_logs;

-- c3_contact_logs
DROP POLICY IF EXISTS "Admins can manage contact logs" ON c3_contact_logs;

-- c3_content_pages
DROP POLICY IF EXISTS "Admins can manage content pages" ON c3_content_pages;

-- c3_site_settings
DROP POLICY IF EXISTS "Admins can manage settings" ON c3_site_settings;

-- c3_user_permissions
DROP POLICY IF EXISTS "Users can view own permissions" ON c3_user_permissions;
DROP POLICY IF EXISTS "Admins can manage permissions" ON c3_user_permissions;

-- c3_bima_submissions
DROP POLICY IF EXISTS "Admins can manage BIMA submissions" ON c3_bima_submissions;

-- c3_cybersource_reconciliation
DROP POLICY IF EXISTS "Admins can manage cybersource reconciliation" ON c3_cybersource_reconciliation;

-- c3_email_templates
DROP POLICY IF EXISTS "Admins can manage email templates" ON c3_email_templates;

-- c3_security_questions
DROP POLICY IF EXISTS "Users manage own security questions" ON c3_security_questions;

-- c3_sec_users
DROP POLICY IF EXISTS "Admins manage sec_users" ON c3_sec_users;

-- c3_sec_users_profile
DROP POLICY IF EXISTS "Admins manage sec_users_profile" ON c3_sec_users_profile;

-- c3_sec_modules
DROP POLICY IF EXISTS "Admins manage sec_modules" ON c3_sec_modules;

-- c3_sec_roles
DROP POLICY IF EXISTS "Admins manage sec_roles" ON c3_sec_roles;

-- c3_sec_user_modules
DROP POLICY IF EXISTS "Admins manage sec_user_modules" ON c3_sec_user_modules;

-- c3_security_question_answers
DROP POLICY IF EXISTS "Admins manage security_question_answers" ON c3_security_question_answers;

-- c3_custom_error_logs
DROP POLICY IF EXISTS "Admins manage custom_error_logs" ON c3_custom_error_logs;

-- c3_bank_payments
DROP POLICY IF EXISTS "Admins manage bank_payments" ON c3_bank_payments;

-- c3_user_card_details
DROP POLICY IF EXISTS "Admins manage user_card_details" ON c3_user_card_details;

-- c3_reconciliation_details
DROP POLICY IF EXISTS "Admins manage reconciliation_details" ON c3_reconciliation_details;

-- c3_cybersource_columns
DROP POLICY IF EXISTS "Admins manage cybersource_columns" ON c3_cybersource_columns;

-- c3_holiday_pay_dates
DROP POLICY IF EXISTS "Admins manage holiday_pay_dates" ON c3_holiday_pay_dates;

-- c3_wages_pay_details
DROP POLICY IF EXISTS "Admins manage wages_pay_details" ON c3_wages_pay_details;

-- c3_employer_codes
DROP POLICY IF EXISTS "Admins manage employer_codes" ON c3_employer_codes;

-- c3_employee_types
DROP POLICY IF EXISTS "Admins manage employee_types" ON c3_employee_types;

-- c3_tax_table_headers
DROP POLICY IF EXISTS "Admins manage tax_table_headers" ON c3_tax_table_headers;

-- c3_tax_table_details
DROP POLICY IF EXISTS "Admins manage tax_table_details" ON c3_tax_table_details;

-- c3_pay_employees
DROP POLICY IF EXISTS "Admins manage pay_employees" ON c3_pay_employees;

-- c3_pay_incomes
DROP POLICY IF EXISTS "Admins manage pay_incomes" ON c3_pay_incomes;

-- c3_pay_deductions
DROP POLICY IF EXISTS "Admins manage pay_deductions" ON c3_pay_deductions;

-- c3_pay_obligations
DROP POLICY IF EXISTS "Admins manage pay_obligations" ON c3_pay_obligations;