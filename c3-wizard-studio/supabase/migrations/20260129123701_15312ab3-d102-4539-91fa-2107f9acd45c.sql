
-- =====================================================
-- OPTIMISED C3 WIZARD SCHEMA - BATCH 1: FOUNDATION
-- Creates core tables with proper c3_ prefix and snake_case
-- Target schema: optimised_c3wizard
-- =====================================================

-- Set search path for this schema
SET search_path TO optimised_c3wizard;

-- =====================================================
-- 1. LOOKUP/REFERENCE TABLES (No dependencies)
-- =====================================================

-- c3_countries - Reference table for countries
CREATE TABLE optimised_c3wizard.c3_countries (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    code VARCHAR(10),
    description TEXT,
    is_deleted BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    created_by INTEGER,
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    updated_by INTEGER,
    legacy_id INTEGER -- Maps to public.country.conid
);

-- c3_states - Reference table for states/parishes
CREATE TABLE optimised_c3wizard.c3_states (
    id SERIAL PRIMARY KEY,
    country_id INTEGER REFERENCES optimised_c3wizard.c3_countries(id),
    name VARCHAR(100) NOT NULL,
    code VARCHAR(10),
    description TEXT,
    is_deleted BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    created_by INTEGER,
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    updated_by INTEGER,
    legacy_id INTEGER -- Maps to public.state.sid
);

-- c3_cities - Reference table for cities
CREATE TABLE optimised_c3wizard.c3_cities (
    id SERIAL PRIMARY KEY,
    state_id INTEGER REFERENCES optimised_c3wizard.c3_states(id),
    name VARCHAR(100) NOT NULL,
    description TEXT,
    is_deleted BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    created_by INTEGER,
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    updated_by INTEGER,
    legacy_id INTEGER -- Maps to public.city.cid
);

-- c3_employee_types - Types of employees (Regular, Director, etc.)
CREATE TABLE optimised_c3wizard.c3_employee_types (
    id SERIAL PRIMARY KEY,
    type_code VARCHAR(20) NOT NULL UNIQUE,
    type_name VARCHAR(100) NOT NULL,
    description TEXT,
    is_deleted BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    created_by INTEGER,
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    updated_by INTEGER,
    legacy_id INTEGER -- Maps to public.masteremptype
);

-- c3_wage_categories - Wage category definitions
CREATE TABLE optimised_c3wizard.c3_wage_categories (
    id SERIAL PRIMARY KEY,
    category_code VARCHAR(20),
    category_name VARCHAR(100) NOT NULL,
    description TEXT,
    min_wage NUMERIC(18,2),
    max_wage NUMERIC(18,2),
    is_deleted BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    created_by INTEGER,
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    updated_by INTEGER,
    legacy_id INTEGER -- Maps to public.wagecategories.wagecatid
);

-- =====================================================
-- 2. ROLES & PERMISSIONS
-- =====================================================

-- c3_roles - System roles (Admin, Employer, Self-Employed)
CREATE TABLE optimised_c3wizard.c3_roles (
    id SERIAL PRIMARY KEY,
    role_code VARCHAR(50) NOT NULL UNIQUE,
    role_name VARCHAR(100) NOT NULL,
    description TEXT,
    role_category VARCHAR(50), -- 'ADMIN', 'EMPLOYER', 'SELF_EMPLOYED'
    is_system_role BOOLEAN DEFAULT FALSE,
    is_deleted BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    created_by INTEGER,
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    updated_by INTEGER,
    legacy_id INTEGER -- Maps to public.secrole.roleid
);

-- c3_modules - System modules/menu items
CREATE TABLE optimised_c3wizard.c3_modules (
    id SERIAL PRIMARY KEY,
    module_code VARCHAR(50) NOT NULL,
    module_name VARCHAR(100) NOT NULL,
    description TEXT,
    parent_id INTEGER REFERENCES optimised_c3wizard.c3_modules(id),
    module_level INTEGER DEFAULT 0,
    page_url TEXT,
    icon VARCHAR(100),
    form_name VARCHAR(100),
    display_order INTEGER DEFAULT 0,
    role_id INTEGER REFERENCES optimised_c3wizard.c3_roles(id),
    is_deleted BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    created_by INTEGER,
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    updated_by INTEGER,
    legacy_id INTEGER -- Maps to public.secmodule.moduleid
);

-- =====================================================
-- 3. RATE CONFIGURATION TABLES
-- =====================================================

-- c3_system_rates - Master contribution rates
CREATE TABLE optimised_c3wizard.c3_system_rates (
    id SERIAL PRIMARY KEY,
    rate_type VARCHAR(50) NOT NULL, -- 'SOCIAL_SECURITY', 'LEVY', 'SEVERANCE'
    employee_rate NUMERIC(8,4), -- soc_ee_rate, levyee rate
    employer_rate NUMERIC(8,4), -- soc_er_rate, employer levy
    bonus_levy_rate NUMERIC(8,4),
    severance_rate NUMERIC(8,4),
    eib_rate NUMERIC(8,4),
    fine_rate NUMERIC(8,4),
    penalty_rate NUMERIC(8,4),
    additional_fine_rate NUMERIC(8,4),
    additional_penalty_rate NUMERIC(8,4),
    min_age INTEGER DEFAULT 16,
    max_age INTEGER DEFAULT 65,
    effective_from DATE NOT NULL,
    effective_to DATE,
    is_locked BOOLEAN DEFAULT FALSE,
    is_deleted BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    created_by INTEGER,
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    updated_by INTEGER,
    legacy_id INTEGER -- Maps to public.master_rate_setting.mrsid
);

-- c3_levy_tiers - Levy tax brackets (tiered rates)
CREATE TABLE optimised_c3wizard.c3_levy_tiers (
    id SERIAL PRIMARY KEY,
    header_id INTEGER, -- Reference to header record
    tax_year VARCHAR(10) NOT NULL,
    deduction_code VARCHAR(20),
    pay_period VARCHAR(20), -- 'WEEKLY', 'BIWEEKLY', 'MONTHLY'
    marital_status VARCHAR(20),
    tier_order INTEGER NOT NULL,
    threshold_amount NUMERIC(18,2) NOT NULL, -- over_amt
    base_amount NUMERIC(18,2) DEFAULT 0, -- base_amt
    tax_rate NUMERIC(8,4) NOT NULL,
    is_deleted BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    created_by INTEGER,
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    updated_by INTEGER,
    legacy_id INTEGER -- Maps to public.deductions_tax_table_details.taxtabid
);

-- c3_levy_allowances - Levy allowance amounts by pay period
CREATE TABLE optimised_c3wizard.c3_levy_allowances (
    id SERIAL PRIMARY KEY,
    tax_year VARCHAR(10) NOT NULL,
    deduction_code VARCHAR(20),
    weekly_allowance NUMERIC(18,2),
    biweekly_allowance NUMERIC(18,2),
    semi_monthly_allowance NUMERIC(18,2),
    monthly_allowance NUMERIC(18,2),
    quarterly_allowance NUMERIC(18,2),
    semi_yearly_allowance NUMERIC(18,2),
    yearly_allowance NUMERIC(18,2),
    misc_allowance NUMERIC(18,2),
    hours_weekly_allowance NUMERIC(18,2),
    hours_biweekly_allowance NUMERIC(18,2),
    hours_semi_monthly_allowance NUMERIC(18,2),
    hours_monthly_allowance NUMERIC(18,2),
    hours_quarterly_allowance NUMERIC(18,2),
    hours_semi_yearly_allowance NUMERIC(18,2),
    hours_yearly_allowance NUMERIC(18,2),
    hours_misc_allowance NUMERIC(18,2),
    allow_or_limit VARCHAR(20),
    effective_from DATE,
    effective_to DATE,
    is_deleted BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    created_by INTEGER,
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    updated_by INTEGER,
    legacy_id INTEGER -- Maps to public.deductions_tax_table_header.taxtabhid
);

-- c3_bonus_exemptions - December bonus exemption settings
CREATE TABLE optimised_c3wizard.c3_bonus_exemptions (
    id SERIAL PRIMARY KEY,
    year INTEGER NOT NULL,
    month INTEGER NOT NULL,
    is_levy_exempted BOOLEAN DEFAULT FALSE,
    is_employer_levy_exempted BOOLEAN DEFAULT FALSE,
    is_severance_exempted BOOLEAN DEFAULT FALSE,
    is_social_security_exempted BOOLEAN DEFAULT FALSE,
    is_locked BOOLEAN DEFAULT FALSE,
    is_deleted BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    created_by INTEGER,
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    updated_by INTEGER,
    legacy_id INTEGER -- Maps to public.december_bonus_exempted_contribution.dbsid
);

-- c3_self_employed_settings - Self-employed rate settings
CREATE TABLE optimised_c3wizard.c3_self_employed_settings (
    id SERIAL PRIMARY KEY,
    setting_key VARCHAR(100) NOT NULL,
    setting_value TEXT,
    description TEXT,
    is_deleted BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    created_by INTEGER,
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    updated_by INTEGER,
    legacy_id INTEGER -- Maps to public.self_employed_settings
);

-- c3_site_settings - Global application settings
CREATE TABLE optimised_c3wizard.c3_site_settings (
    id SERIAL PRIMARY KEY,
    setting_key VARCHAR(100) NOT NULL UNIQUE,
    setting_value TEXT,
    setting_type VARCHAR(50), -- 'STRING', 'NUMBER', 'BOOLEAN', 'JSON'
    description TEXT,
    is_deleted BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    created_by INTEGER,
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    updated_by INTEGER,
    legacy_id INTEGER -- Maps to public.sitesettings
);

-- Add indexes for lookup tables
CREATE INDEX idx_c3_countries_name ON optimised_c3wizard.c3_countries(name);
CREATE INDEX idx_c3_states_country ON optimised_c3wizard.c3_states(country_id);
CREATE INDEX idx_c3_cities_state ON optimised_c3wizard.c3_cities(state_id);
CREATE INDEX idx_c3_roles_code ON optimised_c3wizard.c3_roles(role_code);
CREATE INDEX idx_c3_modules_parent ON optimised_c3wizard.c3_modules(parent_id);
CREATE INDEX idx_c3_system_rates_type ON optimised_c3wizard.c3_system_rates(rate_type);
CREATE INDEX idx_c3_system_rates_dates ON optimised_c3wizard.c3_system_rates(effective_from, effective_to);
CREATE INDEX idx_c3_levy_tiers_year ON optimised_c3wizard.c3_levy_tiers(tax_year);
CREATE INDEX idx_c3_levy_allowances_year ON optimised_c3wizard.c3_levy_allowances(tax_year);

COMMENT ON TABLE optimised_c3wizard.c3_countries IS 'Reference table for countries - migrated from public.country';
COMMENT ON TABLE optimised_c3wizard.c3_states IS 'Reference table for states/parishes - migrated from public.state';
COMMENT ON TABLE optimised_c3wizard.c3_cities IS 'Reference table for cities - migrated from public.city';
COMMENT ON TABLE optimised_c3wizard.c3_roles IS 'System roles - migrated from public.secrole';
COMMENT ON TABLE optimised_c3wizard.c3_modules IS 'System modules/menu items - migrated from public.secmodule';
COMMENT ON TABLE optimised_c3wizard.c3_system_rates IS 'Master contribution rates - migrated from public.master_rate_setting';
COMMENT ON TABLE optimised_c3wizard.c3_levy_tiers IS 'Levy tax brackets - migrated from public.deductions_tax_table_details';
