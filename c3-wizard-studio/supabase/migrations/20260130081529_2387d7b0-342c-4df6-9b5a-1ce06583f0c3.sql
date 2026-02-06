-- Add unique constraints on legacy_id to prevent future duplicates
-- This enforces idempotency for all future ETL runs

-- Core tables
ALTER TABLE optimised_c3wizard.c3_users ADD CONSTRAINT uq_users_legacy_id UNIQUE (legacy_id);
ALTER TABLE optimised_c3wizard.c3_companies ADD CONSTRAINT uq_companies_legacy_id UNIQUE (legacy_id);
ALTER TABLE optimised_c3wizard.c3_employees ADD CONSTRAINT uq_employees_legacy_id UNIQUE (legacy_id);

-- Contribution tables
ALTER TABLE optimised_c3wizard.c3_contribution_headers ADD CONSTRAINT uq_contribution_headers_legacy_id UNIQUE (legacy_id);
ALTER TABLE optimised_c3wizard.c3_contribution_details ADD CONSTRAINT uq_contribution_details_legacy_id UNIQUE (legacy_id);
ALTER TABLE optimised_c3wizard.c3_self_employed_contributions ADD CONSTRAINT uq_self_employed_contributions_legacy_id UNIQUE (legacy_id);

-- Financial tables
ALTER TABLE optimised_c3wizard.c3_employee_deductions ADD CONSTRAINT uq_employee_deductions_legacy_id UNIQUE (legacy_id);
ALTER TABLE optimised_c3wizard.c3_employee_incomes ADD CONSTRAINT uq_employee_incomes_legacy_id UNIQUE (legacy_id);
ALTER TABLE optimised_c3wizard.c3_employee_obligations ADD CONSTRAINT uq_employee_obligations_legacy_id UNIQUE (legacy_id);

-- Payment tables
ALTER TABLE optimised_c3wizard.c3_payments ADD CONSTRAINT uq_payments_legacy_id UNIQUE (legacy_id);
ALTER TABLE optimised_c3wizard.c3_bonus_payments ADD CONSTRAINT uq_bonus_payments_legacy_id UNIQUE (legacy_id);
ALTER TABLE optimised_c3wizard.c3_holiday_payments ADD CONSTRAINT uq_holiday_payments_legacy_id UNIQUE (legacy_id);

-- Audit/Log tables
ALTER TABLE optimised_c3wizard.c3_audit_logs ADD CONSTRAINT uq_audit_logs_legacy_id UNIQUE (legacy_id);
ALTER TABLE optimised_c3wizard.c3_login_logs ADD CONSTRAINT uq_login_logs_legacy_id UNIQUE (legacy_id);
ALTER TABLE optimised_c3wizard.c3_error_logs ADD CONSTRAINT uq_error_logs_legacy_id UNIQUE (legacy_id);
ALTER TABLE optimised_c3wizard.c3_exception_logs ADD CONSTRAINT uq_exception_logs_legacy_id UNIQUE (legacy_id);

-- Config/Lookup tables
ALTER TABLE optimised_c3wizard.c3_roles ADD CONSTRAINT uq_roles_legacy_id UNIQUE (legacy_id);
ALTER TABLE optimised_c3wizard.c3_modules ADD CONSTRAINT uq_modules_legacy_id UNIQUE (legacy_id);
ALTER TABLE optimised_c3wizard.c3_system_rates ADD CONSTRAINT uq_system_rates_legacy_id UNIQUE (legacy_id);
ALTER TABLE optimised_c3wizard.c3_levy_tiers ADD CONSTRAINT uq_levy_tiers_legacy_id UNIQUE (legacy_id);
ALTER TABLE optimised_c3wizard.c3_levy_allowances ADD CONSTRAINT uq_levy_allowances_legacy_id UNIQUE (legacy_id);
ALTER TABLE optimised_c3wizard.c3_wage_categories ADD CONSTRAINT uq_wage_categories_legacy_id UNIQUE (legacy_id);

-- Additional tables
ALTER TABLE optimised_c3wizard.c3_self_employed ADD CONSTRAINT uq_self_employed_legacy_id UNIQUE (legacy_id);
ALTER TABLE optimised_c3wizard.c3_user_profiles ADD CONSTRAINT uq_user_profiles_legacy_id UNIQUE (legacy_id);
ALTER TABLE optimised_c3wizard.c3_user_permissions ADD CONSTRAINT uq_user_permissions_legacy_id UNIQUE (legacy_id);
ALTER TABLE optimised_c3wizard.c3_countries ADD CONSTRAINT uq_countries_legacy_id UNIQUE (legacy_id);
ALTER TABLE optimised_c3wizard.c3_holiday_pay_dates ADD CONSTRAINT uq_holiday_pay_dates_legacy_id UNIQUE (legacy_id);
ALTER TABLE optimised_c3wizard.c3_contact_logs ADD CONSTRAINT uq_contact_logs_legacy_id UNIQUE (legacy_id);