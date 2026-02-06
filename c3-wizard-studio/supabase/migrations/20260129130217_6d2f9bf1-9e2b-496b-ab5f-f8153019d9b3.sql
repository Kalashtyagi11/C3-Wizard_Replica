
-- =====================================================
-- BATCH 5: Remaining Tables for optimised_c3wizard
-- Income/Deduction Codes, Employee Details, Payroll, Time Cards
-- =====================================================

-- =====================================================
-- INCOME/DEDUCTION/OBLIGATION CODES (Master Setup)
-- =====================================================

-- c3_deduction_codes (from masterdeductioncodes)
CREATE TABLE optimised_c3wizard.c3_deduction_codes (
    id SERIAL PRIMARY KEY,
    legacy_id INTEGER,
    deduction_code VARCHAR(20),
    description VARCHAR(255),
    deduction_type VARCHAR(50),
    deduction_tax_reduction VARCHAR(10),
    default_apply VARCHAR(10),
    default_rate NUMERIC(18,4),
    default_limit NUMERIC(18,2),
    default_pay_limit NUMERIC(18,2),
    default_low_deduction_amount NUMERIC(18,2),
    default_high_deduction_amount NUMERIC(18,2),
    tax_jurisdiction VARCHAR(50),
    state_ein VARCHAR(50),
    year_rollover VARCHAR(10),
    from_date DATE,
    to_date DATE,
    is_locked BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    created_by INTEGER,
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    updated_by INTEGER
);

CREATE INDEX idx_c3_deduction_codes_code ON optimised_c3wizard.c3_deduction_codes(deduction_code);
CREATE INDEX idx_c3_deduction_codes_legacy ON optimised_c3wizard.c3_deduction_codes(legacy_id);

-- c3_income_codes (from masterinccodes)
CREATE TABLE optimised_c3wizard.c3_income_codes (
    id SERIAL PRIMARY KEY,
    legacy_id INTEGER,
    income_code VARCHAR(20),
    description VARCHAR(255),
    income_type VARCHAR(50),
    default_rate NUMERIC(18,4),
    default_hours NUMERIC(18,2),
    default_number INTEGER,
    account_number INTEGER,
    department VARCHAR(50),
    low_income_amount NUMERIC(18,2),
    high_income_amount NUMERIC(18,2),
    from_date DATE,
    to_date DATE,
    is_locked BOOLEAN DEFAULT FALSE,
    is_taxable BOOLEAN DEFAULT TRUE,
    is_subject_to_levy BOOLEAN DEFAULT TRUE,
    is_subject_to_social_security BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    created_by INTEGER,
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    updated_by INTEGER
);

CREATE INDEX idx_c3_income_codes_code ON optimised_c3wizard.c3_income_codes(income_code);
CREATE INDEX idx_c3_income_codes_legacy ON optimised_c3wizard.c3_income_codes(legacy_id);

-- c3_obligation_codes (from masterobligationcodes)
CREATE TABLE optimised_c3wizard.c3_obligation_codes (
    id SERIAL PRIMARY KEY,
    legacy_id INTEGER,
    obligation_code VARCHAR(20),
    description VARCHAR(255),
    default_apply VARCHAR(10),
    default_rate NUMERIC(18,4),
    default_limit NUMERIC(18,2),
    pay_limit NUMERIC(18,2),
    account_number INTEGER,
    is_locked BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    created_by INTEGER,
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    updated_by INTEGER
);

CREATE INDEX idx_c3_obligation_codes_code ON optimised_c3wizard.c3_obligation_codes(obligation_code);
CREATE INDEX idx_c3_obligation_codes_legacy ON optimised_c3wizard.c3_obligation_codes(legacy_id);

-- =====================================================
-- EMPLOYEE INCOME/DEDUCTIONS/OBLIGATIONS (Assignments)
-- =====================================================

-- c3_employee_deductions (from masteremployeedeductions) - 22,485 rows
CREATE TABLE optimised_c3wizard.c3_employee_deductions (
    id SERIAL PRIMARY KEY,
    legacy_id INTEGER,
    employee_id INTEGER,
    employee_code VARCHAR(50),
    deduction_code VARCHAR(20),
    deduction_apply VARCHAR(10),
    deduction_rate NUMERIC(18,4),
    deduction_limit NUMERIC(18,2),
    pay_limit NUMERIC(18,2),
    low_deduction_amount NUMERIC(18,2),
    high_deduction_amount NUMERIC(18,2),
    balance_amount NUMERIC(18,2),
    deduction_date DATE,
    deduction_ytd NUMERIC(18,2),
    deduction_qtd1 NUMERIC(18,2),
    deduction_qtd2 NUMERIC(18,2),
    deduction_qtd3 NUMERIC(18,2),
    deduction_qtd4 NUMERIC(18,2),
    account_number INTEGER,
    department VARCHAR(50),
    line_number INTEGER,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    created_by INTEGER,
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    updated_by INTEGER
);

CREATE INDEX idx_c3_employee_deductions_employee ON optimised_c3wizard.c3_employee_deductions(employee_id);
CREATE INDEX idx_c3_employee_deductions_code ON optimised_c3wizard.c3_employee_deductions(deduction_code);
CREATE INDEX idx_c3_employee_deductions_legacy ON optimised_c3wizard.c3_employee_deductions(legacy_id);

-- c3_employee_incomes (from masteremployeeincomes) - 10,856 rows
CREATE TABLE optimised_c3wizard.c3_employee_incomes (
    id SERIAL PRIMARY KEY,
    legacy_id INTEGER,
    employee_id INTEGER,
    employee_code VARCHAR(50),
    income_code VARCHAR(20),
    income_rate NUMERIC(18,4),
    income_hours NUMERIC(18,2),
    income_number INTEGER,
    wage_amount NUMERIC(18,2),
    low_income_amount NUMERIC(18,2),
    high_income_amount NUMERIC(18,2),
    income_ytd NUMERIC(18,2),
    income_qtd1 NUMERIC(18,2),
    income_qtd2 NUMERIC(18,2),
    income_qtd3 NUMERIC(18,2),
    income_qtd4 NUMERIC(18,2),
    account_number INTEGER,
    department VARCHAR(50),
    line_number INTEGER,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    created_by INTEGER,
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    updated_by INTEGER
);

CREATE INDEX idx_c3_employee_incomes_employee ON optimised_c3wizard.c3_employee_incomes(employee_id);
CREATE INDEX idx_c3_employee_incomes_code ON optimised_c3wizard.c3_employee_incomes(income_code);
CREATE INDEX idx_c3_employee_incomes_legacy ON optimised_c3wizard.c3_employee_incomes(legacy_id);

-- c3_employee_obligations (from masteremployeeobligations) - 37,475 rows
CREATE TABLE optimised_c3wizard.c3_employee_obligations (
    id SERIAL PRIMARY KEY,
    legacy_id INTEGER,
    employee_id INTEGER,
    employee_code VARCHAR(50),
    obligation_code VARCHAR(20),
    obligation_apply VARCHAR(10),
    deduction_rate NUMERIC(18,4),
    obligation_limit NUMERIC(18,2),
    pay_limit NUMERIC(18,2),
    obligation_ytd NUMERIC(18,2),
    obligation_qtd1 NUMERIC(18,2),
    obligation_qtd2 NUMERIC(18,2),
    obligation_qtd3 NUMERIC(18,2),
    obligation_qtd4 NUMERIC(18,2),
    account_number INTEGER,
    balance_account_number INTEGER,
    department VARCHAR(50),
    line_number INTEGER,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    created_by INTEGER,
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    updated_by INTEGER
);

CREATE INDEX idx_c3_employee_obligations_employee ON optimised_c3wizard.c3_employee_obligations(employee_id);
CREATE INDEX idx_c3_employee_obligations_code ON optimised_c3wizard.c3_employee_obligations(obligation_code);
CREATE INDEX idx_c3_employee_obligations_legacy ON optimised_c3wizard.c3_employee_obligations(legacy_id);

-- =====================================================
-- EMPLOYER CODES & NWD SETTINGS
-- =====================================================

-- c3_employer_codes (from masteremployercodes)
CREATE TABLE optimised_c3wizard.c3_employer_codes (
    id SERIAL PRIMARY KEY,
    legacy_id INTEGER,
    year INTEGER,
    min_age INTEGER,
    max_age INTEGER,
    rate1 NUMERIC(18,4),
    rate2 NUMERIC(18,4),
    rate3 NUMERIC(18,4),
    bonus_rate NUMERIC(18,4),
    employer_levy_ee NUMERIC(18,4),
    employer_severance NUMERIC(18,4),
    employer_year_deduction_rate NUMERIC(18,4),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    created_by INTEGER,
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    updated_by INTEGER
);

CREATE INDEX idx_c3_employer_codes_year ON optimised_c3wizard.c3_employer_codes(year);
CREATE INDEX idx_c3_employer_codes_legacy ON optimised_c3wizard.c3_employer_codes(legacy_id);

-- c3_nwd_rate_settings (from nwd_master_rate_settings)
CREATE TABLE optimised_c3wizard.c3_nwd_rate_settings (
    id SERIAL PRIMARY KEY,
    legacy_id INTEGER,
    from_date DATE,
    to_date DATE,
    social_security_ee_rate NUMERIC(18,4),
    social_security_er_rate NUMERIC(18,4),
    levy_rate NUMERIC(18,4),
    severance_rate NUMERIC(18,4),
    is_locked BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    created_by INTEGER,
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    updated_by INTEGER
);

CREATE INDEX idx_c3_nwd_rate_settings_dates ON optimised_c3wizard.c3_nwd_rate_settings(from_date, to_date);
CREATE INDEX idx_c3_nwd_rate_settings_legacy ON optimised_c3wizard.c3_nwd_rate_settings(legacy_id);

-- =====================================================
-- USER PERMISSIONS (Granular)
-- =====================================================

-- c3_user_granular_permissions (from userpermission) - 855 rows
CREATE TABLE optimised_c3wizard.c3_user_granular_permissions (
    id SERIAL PRIMARY KEY,
    legacy_id INTEGER,
    user_id INTEGER,
    module_id INTEGER,
    permission_type VARCHAR(50),
    is_granted BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    created_by INTEGER,
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    updated_by INTEGER
);

CREATE INDEX idx_c3_user_granular_permissions_user ON optimised_c3wizard.c3_user_granular_permissions(user_id);
CREATE INDEX idx_c3_user_granular_permissions_module ON optimised_c3wizard.c3_user_granular_permissions(module_id);
CREATE INDEX idx_c3_user_granular_permissions_legacy ON optimised_c3wizard.c3_user_granular_permissions(legacy_id);

-- =====================================================
-- RECONCILIATION DETAILS
-- =====================================================

-- c3_reconciliation_payment_details (from reconciliationpayment_details)
CREATE TABLE optimised_c3wizard.c3_reconciliation_payment_details (
    id SERIAL PRIMARY KEY,
    legacy_id INTEGER,
    reconciliation_id INTEGER,
    payment_id INTEGER,
    amount NUMERIC(18,2),
    payment_date DATE,
    status VARCHAR(50),
    reference_number VARCHAR(100),
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    created_by INTEGER,
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    updated_by INTEGER
);

CREATE INDEX idx_c3_reconciliation_payment_details_recon ON optimised_c3wizard.c3_reconciliation_payment_details(reconciliation_id);
CREATE INDEX idx_c3_reconciliation_payment_details_payment ON optimised_c3wizard.c3_reconciliation_payment_details(payment_id);
CREATE INDEX idx_c3_reconciliation_payment_details_legacy ON optimised_c3wizard.c3_reconciliation_payment_details(legacy_id);

-- c3_reconciliation_columns (from reconciliation_cyber_space_column) - 180 rows
CREATE TABLE optimised_c3wizard.c3_reconciliation_columns (
    id SERIAL PRIMARY KEY,
    legacy_id INTEGER,
    column_name VARCHAR(100),
    column_type VARCHAR(50),
    display_order INTEGER,
    is_visible BOOLEAN DEFAULT TRUE,
    is_required BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    created_by INTEGER,
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    updated_by INTEGER
);

CREATE INDEX idx_c3_reconciliation_columns_legacy ON optimised_c3wizard.c3_reconciliation_columns(legacy_id);

-- =====================================================
-- PAYROLL TABLES (6 tables)
-- =====================================================

-- c3_payroll_headers (from payroll_process_header)
CREATE TABLE optimised_c3wizard.c3_payroll_headers (
    id SERIAL PRIMARY KEY,
    legacy_id INTEGER,
    company_id INTEGER,
    batch_number INTEGER,
    pay_period VARCHAR(20),
    period_start_date DATE,
    period_end_date DATE,
    pay_date DATE,
    status VARCHAR(50),
    total_gross NUMERIC(18,2),
    total_deductions NUMERIC(18,2),
    total_net NUMERIC(18,2),
    total_employer_taxes NUMERIC(18,2),
    employee_count INTEGER,
    is_processed BOOLEAN DEFAULT FALSE,
    is_posted BOOLEAN DEFAULT FALSE,
    processed_date TIMESTAMPTZ,
    processed_by INTEGER,
    posted_date TIMESTAMPTZ,
    posted_by INTEGER,
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    created_by INTEGER,
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    updated_by INTEGER
);

CREATE INDEX idx_c3_payroll_headers_company ON optimised_c3wizard.c3_payroll_headers(company_id);
CREATE INDEX idx_c3_payroll_headers_period ON optimised_c3wizard.c3_payroll_headers(period_start_date, period_end_date);
CREATE INDEX idx_c3_payroll_headers_legacy ON optimised_c3wizard.c3_payroll_headers(legacy_id);

-- c3_payroll_details (from payroll_process_details)
CREATE TABLE optimised_c3wizard.c3_payroll_details (
    id SERIAL PRIMARY KEY,
    legacy_id INTEGER,
    payroll_header_id INTEGER,
    employee_id INTEGER,
    line_number INTEGER,
    description VARCHAR(255),
    hours NUMERIC(18,2),
    rate NUMERIC(18,4),
    amount NUMERIC(18,2),
    detail_type VARCHAR(50),
    account_number INTEGER,
    department VARCHAR(50),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    created_by INTEGER,
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    updated_by INTEGER
);

CREATE INDEX idx_c3_payroll_details_header ON optimised_c3wizard.c3_payroll_details(payroll_header_id);
CREATE INDEX idx_c3_payroll_details_employee ON optimised_c3wizard.c3_payroll_details(employee_id);
CREATE INDEX idx_c3_payroll_details_legacy ON optimised_c3wizard.c3_payroll_details(legacy_id);

-- c3_payroll_employees (from process_payemployee)
CREATE TABLE optimised_c3wizard.c3_payroll_employees (
    id SERIAL PRIMARY KEY,
    legacy_id INTEGER,
    payroll_header_id INTEGER,
    employee_id INTEGER,
    employee_code VARCHAR(50),
    social_security_number VARCHAR(20),
    first_name VARCHAR(100),
    last_name VARCHAR(100),
    department VARCHAR(50),
    pay_period VARCHAR(20),
    gross_pay NUMERIC(18,2),
    total_deductions NUMERIC(18,2),
    net_pay NUMERIC(18,2),
    federal_tax NUMERIC(18,2),
    state_tax NUMERIC(18,2),
    social_security_ee NUMERIC(18,2),
    social_security_er NUMERIC(18,2),
    levy_ee NUMERIC(18,2),
    levy_er NUMERIC(18,2),
    severance_ee NUMERIC(18,2),
    severance_er NUMERIC(18,2),
    hours_worked NUMERIC(18,2),
    overtime_hours NUMERIC(18,2),
    regular_pay NUMERIC(18,2),
    overtime_pay NUMERIC(18,2),
    bonus_pay NUMERIC(18,2),
    holiday_pay NUMERIC(18,2),
    other_pay NUMERIC(18,2),
    check_number VARCHAR(50),
    check_date DATE,
    is_direct_deposit BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    created_by INTEGER,
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    updated_by INTEGER
);

CREATE INDEX idx_c3_payroll_employees_header ON optimised_c3wizard.c3_payroll_employees(payroll_header_id);
CREATE INDEX idx_c3_payroll_employees_employee ON optimised_c3wizard.c3_payroll_employees(employee_id);
CREATE INDEX idx_c3_payroll_employees_ssn ON optimised_c3wizard.c3_payroll_employees(social_security_number);
CREATE INDEX idx_c3_payroll_employees_legacy ON optimised_c3wizard.c3_payroll_employees(legacy_id);

-- c3_payroll_incomes (from process_payincomes)
CREATE TABLE optimised_c3wizard.c3_payroll_incomes (
    id SERIAL PRIMARY KEY,
    legacy_id INTEGER,
    payroll_employee_id INTEGER,
    employee_id INTEGER,
    income_code VARCHAR(20),
    income_description VARCHAR(255),
    hours NUMERIC(18,2),
    rate NUMERIC(18,4),
    amount NUMERIC(18,2),
    account_number INTEGER,
    department VARCHAR(50),
    line_number INTEGER,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    created_by INTEGER,
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    updated_by INTEGER
);

CREATE INDEX idx_c3_payroll_incomes_payroll_emp ON optimised_c3wizard.c3_payroll_incomes(payroll_employee_id);
CREATE INDEX idx_c3_payroll_incomes_employee ON optimised_c3wizard.c3_payroll_incomes(employee_id);
CREATE INDEX idx_c3_payroll_incomes_legacy ON optimised_c3wizard.c3_payroll_incomes(legacy_id);

-- c3_payroll_deductions (from process_paydeductions)
CREATE TABLE optimised_c3wizard.c3_payroll_deductions (
    id SERIAL PRIMARY KEY,
    legacy_id INTEGER,
    payroll_employee_id INTEGER,
    employee_id INTEGER,
    deduction_code VARCHAR(20),
    deduction_description VARCHAR(255),
    amount NUMERIC(18,2),
    ytd_amount NUMERIC(18,2),
    account_number INTEGER,
    department VARCHAR(50),
    line_number INTEGER,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    created_by INTEGER,
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    updated_by INTEGER
);

CREATE INDEX idx_c3_payroll_deductions_payroll_emp ON optimised_c3wizard.c3_payroll_deductions(payroll_employee_id);
CREATE INDEX idx_c3_payroll_deductions_employee ON optimised_c3wizard.c3_payroll_deductions(employee_id);
CREATE INDEX idx_c3_payroll_deductions_legacy ON optimised_c3wizard.c3_payroll_deductions(legacy_id);

-- c3_payroll_obligations (from process_payobligations)
CREATE TABLE optimised_c3wizard.c3_payroll_obligations (
    id SERIAL PRIMARY KEY,
    legacy_id INTEGER,
    payroll_employee_id INTEGER,
    employee_id INTEGER,
    obligation_code VARCHAR(20),
    obligation_description VARCHAR(255),
    amount NUMERIC(18,2),
    ytd_amount NUMERIC(18,2),
    account_number INTEGER,
    department VARCHAR(50),
    line_number INTEGER,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    created_by INTEGER,
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    updated_by INTEGER
);

CREATE INDEX idx_c3_payroll_obligations_payroll_emp ON optimised_c3wizard.c3_payroll_obligations(payroll_employee_id);
CREATE INDEX idx_c3_payroll_obligations_employee ON optimised_c3wizard.c3_payroll_obligations(employee_id);
CREATE INDEX idx_c3_payroll_obligations_legacy ON optimised_c3wizard.c3_payroll_obligations(legacy_id);

-- =====================================================
-- TIME CARD TABLES (3 tables)
-- =====================================================

-- c3_timecard_headers (from employeetcard_header)
CREATE TABLE optimised_c3wizard.c3_timecard_headers (
    id SERIAL PRIMARY KEY,
    legacy_id INTEGER,
    company_id INTEGER,
    employee_code VARCHAR(50),
    employee_name VARCHAR(200),
    card_number INTEGER,
    payroll_batch_id INTEGER,
    start_date DATE,
    end_date DATE,
    used_flag VARCHAR(10),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    created_by INTEGER,
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    updated_by INTEGER
);

CREATE INDEX idx_c3_timecard_headers_company ON optimised_c3wizard.c3_timecard_headers(company_id);
CREATE INDEX idx_c3_timecard_headers_employee ON optimised_c3wizard.c3_timecard_headers(employee_code);
CREATE INDEX idx_c3_timecard_headers_dates ON optimised_c3wizard.c3_timecard_headers(start_date, end_date);
CREATE INDEX idx_c3_timecard_headers_legacy ON optimised_c3wizard.c3_timecard_headers(legacy_id);

-- c3_timecard_details (from employeetcard_details)
CREATE TABLE optimised_c3wizard.c3_timecard_details (
    id SERIAL PRIMARY KEY,
    legacy_id INTEGER,
    timecard_header_id INTEGER,
    card_number INTEGER,
    line_number INTEGER,
    income_code VARCHAR(20),
    income_hours NUMERIC(18,2),
    income_rate NUMERIC(18,4),
    income_number INTEGER,
    account_number INTEGER,
    bonus_amount NUMERIC(18,2),
    holiday_amount NUMERIC(18,2),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    created_by INTEGER,
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    updated_by INTEGER
);

CREATE INDEX idx_c3_timecard_details_header ON optimised_c3wizard.c3_timecard_details(timecard_header_id);
CREATE INDEX idx_c3_timecard_details_card ON optimised_c3wizard.c3_timecard_details(card_number);
CREATE INDEX idx_c3_timecard_details_legacy ON optimised_c3wizard.c3_timecard_details(legacy_id);

-- c3_work_duration_details (from employeeworkdurationdetails)
CREATE TABLE optimised_c3wizard.c3_work_duration_details (
    id SERIAL PRIMARY KEY,
    legacy_id INTEGER,
    company_id INTEGER,
    employee_id INTEGER,
    social_security_number VARCHAR(20),
    registration_number VARCHAR(50),
    designation VARCHAR(100),
    pay_period VARCHAR(20),
    wage NUMERIC(18,2),
    start_date DATE,
    end_date DATE,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    created_by INTEGER,
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    updated_by INTEGER,
    is_deleted BOOLEAN DEFAULT FALSE
);

CREATE INDEX idx_c3_work_duration_company ON optimised_c3wizard.c3_work_duration_details(company_id);
CREATE INDEX idx_c3_work_duration_employee ON optimised_c3wizard.c3_work_duration_details(employee_id);
CREATE INDEX idx_c3_work_duration_ssn ON optimised_c3wizard.c3_work_duration_details(social_security_number);
CREATE INDEX idx_c3_work_duration_dates ON optimised_c3wizard.c3_work_duration_details(start_date, end_date);
CREATE INDEX idx_c3_work_duration_legacy ON optimised_c3wizard.c3_work_duration_details(legacy_id);

-- =====================================================
-- WAGES DETAILS
-- =====================================================

-- c3_wages_details (from wagespaydetails)
CREATE TABLE optimised_c3wizard.c3_wages_details (
    id SERIAL PRIMARY KEY,
    legacy_id INTEGER,
    company_id INTEGER,
    employee_id INTEGER,
    period_month VARCHAR(20),
    period_year VARCHAR(10),
    wage_category_id INTEGER,
    base_wage NUMERIC(18,2),
    overtime_wage NUMERIC(18,2),
    bonus_wage NUMERIC(18,2),
    holiday_wage NUMERIC(18,2),
    total_wage NUMERIC(18,2),
    pay_date DATE,
    is_paid BOOLEAN DEFAULT FALSE,
    paid_date TIMESTAMPTZ,
    paid_by INTEGER,
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    created_by INTEGER,
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    updated_by INTEGER,
    is_deleted BOOLEAN DEFAULT FALSE
);

CREATE INDEX idx_c3_wages_details_company ON optimised_c3wizard.c3_wages_details(company_id);
CREATE INDEX idx_c3_wages_details_employee ON optimised_c3wizard.c3_wages_details(employee_id);
CREATE INDEX idx_c3_wages_details_period ON optimised_c3wizard.c3_wages_details(period_year, period_month);
CREATE INDEX idx_c3_wages_details_legacy ON optimised_c3wizard.c3_wages_details(legacy_id);
