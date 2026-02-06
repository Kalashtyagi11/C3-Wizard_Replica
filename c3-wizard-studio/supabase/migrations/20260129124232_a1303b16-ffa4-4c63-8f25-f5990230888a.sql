
-- =====================================================
-- OPTIMISED C3 WIZARD SCHEMA - BATCH 3: C3 CONTRIBUTIONS
-- Creates C3 form header, details, and related tables
-- Target schema: optimised_c3wizard
-- =====================================================

-- =====================================================
-- 8. C3 CONTRIBUTION TABLES
-- =====================================================

-- c3_contribution_headers - C3 Form headers (migrated from process_c3header)
CREATE TABLE optimised_c3wizard.c3_contribution_headers (
    id SERIAL PRIMARY KEY,
    company_id INTEGER REFERENCES optimised_c3wizard.c3_companies(id),
    
    -- Period Information
    registration_number VARCHAR(50),
    period_month VARCHAR(20) NOT NULL, -- periodd_month (1-12 or month name)
    period_year VARCHAR(10) NOT NULL,
    schedule_number INTEGER,
    
    -- Totals
    total_wages NUMERIC(18,2) DEFAULT 0,
    total_social_security NUMERIC(18,2) DEFAULT 0,
    total_levy_employee NUMERIC(18,2) DEFAULT 0,
    total_levy_employer NUMERIC(18,2) DEFAULT 0,
    total_severance NUMERIC(18,2) DEFAULT 0,
    total_levy_penalty NUMERIC(18,2) DEFAULT 0,
    total_pe_penalty NUMERIC(18,2) DEFAULT 0, -- Payment/Employment penalty
    total_ss_penalty NUMERIC(18,2) DEFAULT 0, -- Social Security penalty
    
    -- Status Flags
    is_for_director BOOLEAN DEFAULT FALSE, -- fordirector
    is_nil_return BOOLEAN DEFAULT FALSE, -- No contributions this period
    is_imported_from_bema BOOLEAN DEFAULT FALSE, -- isimportfrombema
    
    -- Submission Status
    is_finalized BOOLEAN DEFAULT FALSE, -- is_fianalize (legacy typo)
    finalized_at TIMESTAMPTZ,
    finalized_by INTEGER REFERENCES optimised_c3wizard.c3_users(id),
    
    is_submitted BOOLEAN DEFAULT FALSE,
    submitted_at TIMESTAMPTZ,
    submitted_by INTEGER REFERENCES optimised_c3wizard.c3_users(id),
    
    is_unlocked BOOLEAN DEFAULT FALSE,
    is_sent_for_edit BOOLEAN DEFAULT FALSE,
    
    -- Order Information (for payment)
    order_name VARCHAR(200),
    order_key VARCHAR(100),
    
    -- Notes & Errors
    notes TEXT,
    error_description TEXT,
    username VARCHAR(100), -- Legacy field
    
    -- Print/Export tracking
    printed_at TIMESTAMPTZ,
    printed_by INTEGER,
    exported_at TIMESTAMPTZ,
    exported_by INTEGER,
    
    -- Metadata
    is_deleted BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    created_by INTEGER,
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    updated_by INTEGER,
    legacy_id INTEGER, -- Maps to public.process_c3header.c3headerid
    legacy_machine_info TEXT
);

-- c3_contribution_details - C3 Form line items (migrated from process_contributions)
CREATE TABLE optimised_c3wizard.c3_contribution_details (
    id SERIAL PRIMARY KEY,
    header_id INTEGER REFERENCES optimised_c3wizard.c3_contribution_headers(id) ON DELETE CASCADE,
    employee_id INTEGER REFERENCES optimised_c3wizard.c3_employees(id),
    
    -- Period (denormalized for performance)
    period_month VARCHAR(20),
    period_year VARCHAR(10),
    pay_frequency VARCHAR(20), -- 'WEEKLY', 'BIWEEKLY', 'MONTHLY'
    
    -- Employee Identification (for cross-reference)
    social_security_number VARCHAR(50),
    social_security_display VARCHAR(20), -- Masked SSN for display
    
    -- Dates
    date_of_joining DATE,
    date_terminated DATE,
    
    -- Weekly Wages (5 weeks max per month)
    week1_worked BOOLEAN DEFAULT FALSE,
    week1_wages NUMERIC(18,2) DEFAULT 0,
    week1_holiday_pay NUMERIC(18,2) DEFAULT 0,
    
    week2_worked BOOLEAN DEFAULT FALSE,
    week2_wages NUMERIC(18,2) DEFAULT 0,
    week2_holiday_pay NUMERIC(18,2) DEFAULT 0,
    
    week3_worked BOOLEAN DEFAULT FALSE,
    week3_wages NUMERIC(18,2) DEFAULT 0,
    week3_holiday_pay NUMERIC(18,2) DEFAULT 0,
    
    week4_worked BOOLEAN DEFAULT FALSE,
    week4_wages NUMERIC(18,2) DEFAULT 0,
    week4_holiday_pay NUMERIC(18,2) DEFAULT 0,
    
    week5_worked BOOLEAN DEFAULT FALSE,
    week5_wages NUMERIC(18,2) DEFAULT 0,
    week5_holiday_pay NUMERIC(18,2) DEFAULT 0,
    
    -- Total Holiday Pay
    total_holiday_pay NUMERIC(18,2) DEFAULT 0,
    
    -- Bonus
    bonus_amount NUMERIC(18,2) DEFAULT 0,
    
    -- Director Wage
    director_wage NUMERIC(18,2) DEFAULT 0,
    
    -- Calculated Contributions
    social_security_total NUMERIC(18,2) DEFAULT 0,
    social_security_employee NUMERIC(18,2) DEFAULT 0, -- socialsecurity_ee
    social_security_employer NUMERIC(18,2) DEFAULT 0, -- socialsecurity_er
    
    levy_employee NUMERIC(18,2) DEFAULT 0, -- levyee
    levy_employer NUMERIC(18,2) DEFAULT 0, -- levy_er
    
    severance_employee NUMERIC(18,2) DEFAULT 0, -- servayance_ee
    severance_employer NUMERIC(18,2) DEFAULT 0, -- servayance_er
    
    -- Status Flags
    is_finalized BOOLEAN DEFAULT FALSE,
    finalized_at TIMESTAMPTZ,
    finalized_by INTEGER,
    
    is_submitted BOOLEAN DEFAULT FALSE,
    submitted_at TIMESTAMPTZ,
    submitted_by INTEGER,
    
    is_unlocked BOOLEAN DEFAULT FALSE,
    
    -- Notes & Errors
    remarks TEXT,
    error_description TEXT,
    
    -- Metadata
    is_deleted BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    created_by INTEGER,
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    updated_by INTEGER,
    legacy_id INTEGER -- Maps to public.process_contributions.cont_id
);

-- c3_self_employed_contributions - Self-employed C3 forms (migrated from process_self_employedc3)
CREATE TABLE optimised_c3wizard.c3_self_employed_contributions (
    id SERIAL PRIMARY KEY,
    self_employed_id INTEGER REFERENCES optimised_c3wizard.c3_self_employed(id),
    
    -- Period Information
    registration_number VARCHAR(50),
    period_month VARCHAR(20) NOT NULL,
    period_year VARCHAR(10) NOT NULL,
    
    -- Personal Info (denormalized for historical accuracy)
    social_security_number VARCHAR(50),
    first_name VARCHAR(100),
    last_name VARCHAR(100),
    date_of_birth DATE,
    
    -- Income Details
    wage_category_id INTEGER REFERENCES optimised_c3wizard.c3_wage_categories(id),
    declared_income NUMERIC(18,2) DEFAULT 0,
    
    -- Calculated Contributions
    social_security_contribution NUMERIC(18,2) DEFAULT 0,
    levy_contribution NUMERIC(18,2) DEFAULT 0,
    total_contribution NUMERIC(18,2) DEFAULT 0,
    
    -- Penalties (if late)
    penalty_amount NUMERIC(18,2) DEFAULT 0,
    fine_amount NUMERIC(18,2) DEFAULT 0,
    
    -- Status
    is_finalized BOOLEAN DEFAULT FALSE,
    finalized_at TIMESTAMPTZ,
    finalized_by INTEGER,
    
    is_submitted BOOLEAN DEFAULT FALSE,
    submitted_at TIMESTAMPTZ,
    submitted_by INTEGER,
    
    is_paid BOOLEAN DEFAULT FALSE,
    paid_at TIMESTAMPTZ,
    
    -- Order Information
    order_name VARCHAR(200),
    order_key VARCHAR(100),
    
    -- Notes
    notes TEXT,
    error_description TEXT,
    
    -- Metadata
    is_deleted BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    created_by INTEGER,
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    updated_by INTEGER,
    legacy_id INTEGER -- Maps to public.process_self_employedc3
);

-- =====================================================
-- 9. BONUS & HOLIDAY PAY TABLES
-- =====================================================

-- c3_bonus_payments - Bonus payment records (migrated from bonuspaydetails)
CREATE TABLE optimised_c3wizard.c3_bonus_payments (
    id SERIAL PRIMARY KEY,
    company_id INTEGER REFERENCES optimised_c3wizard.c3_companies(id),
    employee_id INTEGER REFERENCES optimised_c3wizard.c3_employees(id),
    
    -- Period
    period_month VARCHAR(20),
    period_year VARCHAR(10),
    
    -- Bonus Details
    bonus_amount NUMERIC(18,2) NOT NULL,
    bonus_pay_date DATE,
    pay_frequency INTEGER, -- Number of times paid
    start_date DATE,
    end_date DATE,
    
    -- Employee Details (for reference)
    employee_details TEXT,
    
    -- Metadata
    is_deleted BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    created_by INTEGER,
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    updated_by INTEGER,
    legacy_id INTEGER -- Maps to public.bonuspaydetails.bonuspayid
);

-- c3_holiday_payments - Holiday pay records (migrated from masterholidaypaydetails)
CREATE TABLE optimised_c3wizard.c3_holiday_payments (
    id SERIAL PRIMARY KEY,
    company_id INTEGER REFERENCES optimised_c3wizard.c3_companies(id),
    employee_id INTEGER REFERENCES optimised_c3wizard.c3_employees(id),
    
    -- Holiday Details
    holiday_name VARCHAR(200),
    holiday_date DATE,
    payment_date DATE,
    payment_amount NUMERIC(18,2) NOT NULL,
    
    -- Period
    period_month VARCHAR(20),
    period_year VARCHAR(10),
    
    -- Metadata
    is_deleted BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    created_by INTEGER,
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    updated_by INTEGER,
    legacy_id INTEGER -- Maps to public.masterholidaypaydetails
);

-- c3_holiday_pay_dates - Tracks holiday pay dates for employees
CREATE TABLE optimised_c3wizard.c3_holiday_pay_dates (
    id SERIAL PRIMARY KEY,
    company_id INTEGER REFERENCES optimised_c3wizard.c3_companies(id),
    employee_id INTEGER REFERENCES optimised_c3wizard.c3_employees(id),
    holiday_payment_id INTEGER REFERENCES optimised_c3wizard.c3_holiday_payments(id),
    
    holiday_pay_date DATE NOT NULL,
    amount NUMERIC(18,2) DEFAULT 0,
    
    is_deleted BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    legacy_id INTEGER -- Maps to public.holidaypaydates
);

-- =====================================================
-- INDEXES
-- =====================================================

-- C3 Header indexes
CREATE INDEX idx_c3_contrib_headers_company ON optimised_c3wizard.c3_contribution_headers(company_id);
CREATE INDEX idx_c3_contrib_headers_period ON optimised_c3wizard.c3_contribution_headers(period_year, period_month);
CREATE INDEX idx_c3_contrib_headers_status ON optimised_c3wizard.c3_contribution_headers(is_submitted, is_finalized);
CREATE INDEX idx_c3_contrib_headers_reg ON optimised_c3wizard.c3_contribution_headers(registration_number);

-- C3 Details indexes
CREATE INDEX idx_c3_contrib_details_header ON optimised_c3wizard.c3_contribution_details(header_id);
CREATE INDEX idx_c3_contrib_details_employee ON optimised_c3wizard.c3_contribution_details(employee_id);
CREATE INDEX idx_c3_contrib_details_ssn ON optimised_c3wizard.c3_contribution_details(social_security_number);
CREATE INDEX idx_c3_contrib_details_period ON optimised_c3wizard.c3_contribution_details(period_year, period_month);

-- Self-employed contributions indexes
CREATE INDEX idx_c3_se_contrib_se ON optimised_c3wizard.c3_self_employed_contributions(self_employed_id);
CREATE INDEX idx_c3_se_contrib_period ON optimised_c3wizard.c3_self_employed_contributions(period_year, period_month);
CREATE INDEX idx_c3_se_contrib_ssn ON optimised_c3wizard.c3_self_employed_contributions(social_security_number);

-- Bonus indexes
CREATE INDEX idx_c3_bonus_company ON optimised_c3wizard.c3_bonus_payments(company_id);
CREATE INDEX idx_c3_bonus_employee ON optimised_c3wizard.c3_bonus_payments(employee_id);

-- Holiday payment indexes
CREATE INDEX idx_c3_holiday_company ON optimised_c3wizard.c3_holiday_payments(company_id);
CREATE INDEX idx_c3_holiday_employee ON optimised_c3wizard.c3_holiday_payments(employee_id);

-- Comments
COMMENT ON TABLE optimised_c3wizard.c3_contribution_headers IS 'C3 Form headers - migrated from public.process_c3header';
COMMENT ON TABLE optimised_c3wizard.c3_contribution_details IS 'C3 Form line items - migrated from public.process_contributions';
COMMENT ON TABLE optimised_c3wizard.c3_self_employed_contributions IS 'Self-employed C3 forms - migrated from public.process_self_employedc3';
COMMENT ON TABLE optimised_c3wizard.c3_bonus_payments IS 'Bonus payments - migrated from public.bonuspaydetails';
COMMENT ON TABLE optimised_c3wizard.c3_holiday_payments IS 'Holiday payments - migrated from public.masterholidaypaydetails';
