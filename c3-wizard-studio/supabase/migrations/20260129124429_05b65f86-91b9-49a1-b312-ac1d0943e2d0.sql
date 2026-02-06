
-- =====================================================
-- OPTIMISED C3 WIZARD SCHEMA - BATCH 4: PAYMENTS & AUDIT
-- Creates payment processing, audit logs, and remaining tables
-- Target schema: optimised_c3wizard
-- =====================================================

-- =====================================================
-- 10. PAYMENT TABLES
-- =====================================================

-- c3_payments - Online payment transactions (migrated from onlinepayments)
CREATE TABLE optimised_c3wizard.c3_payments (
    id SERIAL PRIMARY KEY,
    
    -- Transaction Identification
    system_transaction_id VARCHAR(100),
    system_key VARCHAR(100),
    payment_id VARCHAR(100),
    payment_gateway_transaction_id VARCHAR(100),
    
    -- Payer Information
    company_id INTEGER REFERENCES optimised_c3wizard.c3_companies(id),
    self_employed_id INTEGER REFERENCES optimised_c3wizard.c3_self_employed(id),
    user_id INTEGER REFERENCES optimised_c3wizard.c3_users(id),
    payer_type VARCHAR(50), -- 'EMPLOYER', 'SELF_EMPLOYED'
    registration_number VARCHAR(50),
    
    -- Payment Details
    currency VARCHAR(10) DEFAULT 'XCD',
    amount NUMERIC(18,2) NOT NULL,
    payment_type VARCHAR(50), -- 'C3_CONTRIBUTION', 'PENALTY', 'ARREARS'
    payment_method VARCHAR(50), -- 'CREDIT_CARD', 'BANK_TRANSFER', 'CASH'
    
    -- C3 Reference
    contribution_header_id INTEGER REFERENCES optimised_c3wizard.c3_contribution_headers(id),
    self_employed_contribution_id INTEGER REFERENCES optimised_c3wizard.c3_self_employed_contributions(id),
    period_month VARCHAR(20),
    period_year VARCHAR(10),
    
    -- Card Details (masked/tokenized)
    card_last_four VARCHAR(4),
    card_type VARCHAR(50),
    card_expiry_month VARCHAR(2),
    card_expiry_year VARCHAR(4),
    cardholder_name VARCHAR(200),
    
    -- Billing Address
    billing_address_line1 TEXT,
    billing_address_line2 TEXT,
    billing_city VARCHAR(100),
    billing_state VARCHAR(100),
    billing_postal_code VARCHAR(20),
    billing_country VARCHAR(100),
    
    -- Gateway Response
    gateway_response_code VARCHAR(50),
    gateway_response_message TEXT,
    authorization_code VARCHAR(100),
    
    -- Status
    payment_status VARCHAR(50) DEFAULT 'PENDING', -- 'PENDING', 'COMPLETED', 'FAILED', 'REFUNDED'
    is_reconciled BOOLEAN DEFAULT FALSE,
    reconciled_at TIMESTAMPTZ,
    reconciled_by INTEGER,
    
    -- Timestamps
    payment_initiated_at TIMESTAMPTZ DEFAULT NOW(),
    payment_completed_at TIMESTAMPTZ,
    
    -- Error handling
    error_code VARCHAR(50),
    error_message TEXT,
    
    -- Metadata
    is_deleted BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    created_by INTEGER,
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    updated_by INTEGER,
    legacy_id INTEGER, -- Maps to public.onlinepayments.id
    legacy_machine_info TEXT
);

-- c3_bank_payments - Bank payment records (migrated from bankpaymentsmain)
CREATE TABLE optimised_c3wizard.c3_bank_payments (
    id SERIAL PRIMARY KEY,
    file_path TEXT,
    file_name VARCHAR(255),
    upload_date DATE,
    processed_at TIMESTAMPTZ,
    record_count INTEGER DEFAULT 0,
    total_amount NUMERIC(18,2) DEFAULT 0,
    
    -- Metadata
    is_deleted BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    created_by INTEGER,
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    updated_by INTEGER,
    legacy_id INTEGER -- Maps to public.bankpaymentsmain.mainid
);

-- c3_saved_cards - User saved payment cards (migrated from usercarddetail)
CREATE TABLE optimised_c3wizard.c3_saved_cards (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES optimised_c3wizard.c3_users(id) ON DELETE CASCADE,
    
    -- Card Details (tokenized)
    card_token TEXT NOT NULL, -- Payment gateway token
    card_last_four VARCHAR(4) NOT NULL,
    card_type VARCHAR(50), -- 'VISA', 'MASTERCARD', 'AMEX'
    card_expiry_month VARCHAR(2),
    card_expiry_year VARCHAR(4),
    cardholder_name VARCHAR(200),
    
    -- Status
    is_default BOOLEAN DEFAULT FALSE,
    is_active BOOLEAN DEFAULT TRUE,
    
    -- Metadata
    is_deleted BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    created_by INTEGER,
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    updated_by INTEGER,
    legacy_id INTEGER -- Maps to public.usercarddetail
);

-- c3_reconciliation_records - Payment reconciliation (migrated from reconciliation_cyber_space)
CREATE TABLE optimised_c3wizard.c3_reconciliation_records (
    id SERIAL PRIMARY KEY,
    payment_id INTEGER REFERENCES optimised_c3wizard.c3_payments(id),
    
    -- Reconciliation Details
    reconciliation_date DATE,
    bank_reference VARCHAR(100),
    bank_amount NUMERIC(18,2),
    system_amount NUMERIC(18,2),
    variance NUMERIC(18,2),
    
    -- Status
    reconciliation_status VARCHAR(50), -- 'MATCHED', 'UNMATCHED', 'PARTIAL'
    notes TEXT,
    
    -- Metadata
    is_deleted BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    created_by INTEGER,
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    updated_by INTEGER,
    legacy_id INTEGER
);

-- =====================================================
-- 11. AUDIT & LOGGING TABLES
-- =====================================================

-- c3_audit_logs - System audit trail (migrated from auditlogs)
CREATE TABLE optimised_c3wizard.c3_audit_logs (
    id SERIAL PRIMARY KEY,
    
    -- Event Information
    event_type VARCHAR(50) NOT NULL, -- 'CREATE', 'UPDATE', 'DELETE', 'LOGIN', 'LOGOUT'
    action VARCHAR(100),
    
    -- Target Details
    table_name VARCHAR(100),
    record_id INTEGER,
    column_name VARCHAR(100),
    old_value TEXT,
    new_value TEXT,
    
    -- Context
    controller VARCHAR(100),
    area VARCHAR(100),
    url TEXT,
    
    -- User & Session
    user_id INTEGER REFERENCES optimised_c3wizard.c3_users(id),
    username VARCHAR(100),
    ip_address VARCHAR(45),
    
    -- Additional Info
    message TEXT,
    source_data INTEGER,
    
    -- Metadata
    created_at TIMESTAMPTZ DEFAULT NOW(),
    created_by INTEGER,
    is_active BOOLEAN DEFAULT TRUE,
    legacy_id INTEGER -- Maps to public.auditlogs.id
);

-- c3_login_logs - Login history (migrated from loginlog)
CREATE TABLE optimised_c3wizard.c3_login_logs (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES optimised_c3wizard.c3_users(id),
    
    -- Login Details
    username VARCHAR(100),
    login_time TIMESTAMPTZ NOT NULL,
    logout_time TIMESTAMPTZ,
    
    -- Session Info
    ip_address VARCHAR(45),
    user_agent TEXT,
    
    -- Status
    was_successful BOOLEAN DEFAULT TRUE,
    failure_reason VARCHAR(200),
    is_locked BOOLEAN DEFAULT FALSE,
    
    -- Company/Self-employed context
    company_id INTEGER REFERENCES optimised_c3wizard.c3_companies(id),
    is_self_employed BOOLEAN DEFAULT FALSE,
    
    -- Metadata
    created_at TIMESTAMPTZ DEFAULT NOW(),
    legacy_id INTEGER -- Maps to public.loginlog.logid
);

-- c3_error_logs - Application error logs (migrated from customerrorlogs)
CREATE TABLE optimised_c3wizard.c3_error_logs (
    id SERIAL PRIMARY KEY,
    
    -- Error Details
    error_message TEXT NOT NULL,
    stack_trace TEXT,
    
    -- Context
    controller_name VARCHAR(200),
    method_name VARCHAR(200),
    user_id INTEGER,
    company_id INTEGER,
    
    -- Metadata
    logged_at TIMESTAMPTZ DEFAULT NOW(),
    is_active BOOLEAN DEFAULT TRUE,
    legacy_id INTEGER -- Maps to public.customerrorlogs.id
);

-- c3_exception_logs - Exception tracking (migrated from exception_log)
CREATE TABLE optimised_c3wizard.c3_exception_logs (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES optimised_c3wizard.c3_users(id),
    company_id INTEGER REFERENCES optimised_c3wizard.c3_companies(id),
    
    error_description TEXT,
    is_self_employed BOOLEAN DEFAULT FALSE,
    
    -- Metadata
    created_at TIMESTAMPTZ DEFAULT NOW(),
    created_by INTEGER,
    updated_at TIMESTAMPTZ,
    updated_by INTEGER,
    legacy_machine_info TEXT,
    legacy_id INTEGER -- Maps to public.exception_log.rowid
);

-- =====================================================
-- 12. CMS & MISC TABLES
-- =====================================================

-- c3_about_us - About us content (migrated from aboutus)
CREATE TABLE optimised_c3wizard.c3_about_us (
    id SERIAL PRIMARY KEY,
    content TEXT,
    is_deleted BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    created_by INTEGER,
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    updated_by INTEGER,
    legacy_id INTEGER
);

-- c3_contact_logs - Contact form submissions (migrated from contactus_log)
CREATE TABLE optimised_c3wizard.c3_contact_logs (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES optimised_c3wizard.c3_users(id),
    company_id INTEGER REFERENCES optimised_c3wizard.c3_companies(id),
    registration_number VARCHAR(50),
    
    email VARCHAR(255),
    subject VARCHAR(200),
    message TEXT,
    
    -- Metadata
    is_deleted BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    legacy_machine_info TEXT,
    legacy_id INTEGER -- Maps to public.contactus_log.cusid
);

-- c3_temp_registrations - Temporary registration data
CREATE TABLE optimised_c3wizard.c3_temp_registrations (
    id SERIAL PRIMARY KEY,
    registration_type VARCHAR(50), -- 'EMPLOYER', 'SELF_EMPLOYED'
    
    -- Contact Info
    first_name VARCHAR(100),
    last_name VARCHAR(100),
    email VARCHAR(255),
    mobile VARCHAR(50),
    
    -- Company Info (for employers)
    company_name VARCHAR(255),
    trade_name VARCHAR(255),
    tin VARCHAR(50),
    
    -- Address
    address_line1 TEXT,
    address_line2 TEXT,
    city VARCHAR(100),
    postal_code VARCHAR(20),
    country VARCHAR(100),
    
    -- Security
    username VARCHAR(100),
    password_hash TEXT,
    security_question1 TEXT,
    security_answer1 TEXT,
    security_question2 TEXT,
    security_answer2 TEXT,
    
    -- Verification
    verification_token TEXT,
    token_expires_at TIMESTAMPTZ,
    is_verified BOOLEAN DEFAULT FALSE,
    verified_at TIMESTAMPTZ,
    
    -- Device Info
    device_ip VARCHAR(45),
    device_mac VARCHAR(50),
    device_name VARCHAR(200),
    
    -- Status
    registration_status VARCHAR(50) DEFAULT 'PENDING', -- 'PENDING', 'VERIFIED', 'APPROVED', 'REJECTED'
    
    -- Metadata
    is_deleted BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    legacy_id INTEGER -- Maps to public.c3_regn_* tables
);

-- =====================================================
-- INDEXES
-- =====================================================

-- Payment indexes
CREATE INDEX idx_c3_payments_company ON optimised_c3wizard.c3_payments(company_id);
CREATE INDEX idx_c3_payments_se ON optimised_c3wizard.c3_payments(self_employed_id);
CREATE INDEX idx_c3_payments_status ON optimised_c3wizard.c3_payments(payment_status);
CREATE INDEX idx_c3_payments_date ON optimised_c3wizard.c3_payments(payment_initiated_at);
CREATE INDEX idx_c3_payments_transaction ON optimised_c3wizard.c3_payments(system_transaction_id);
CREATE INDEX idx_c3_payments_gateway_txn ON optimised_c3wizard.c3_payments(payment_gateway_transaction_id);

-- Audit indexes
CREATE INDEX idx_c3_audit_logs_user ON optimised_c3wizard.c3_audit_logs(user_id);
CREATE INDEX idx_c3_audit_logs_table ON optimised_c3wizard.c3_audit_logs(table_name);
CREATE INDEX idx_c3_audit_logs_date ON optimised_c3wizard.c3_audit_logs(created_at);
CREATE INDEX idx_c3_audit_logs_event ON optimised_c3wizard.c3_audit_logs(event_type);

-- Login log indexes
CREATE INDEX idx_c3_login_logs_user ON optimised_c3wizard.c3_login_logs(user_id);
CREATE INDEX idx_c3_login_logs_time ON optimised_c3wizard.c3_login_logs(login_time);
CREATE INDEX idx_c3_login_logs_ip ON optimised_c3wizard.c3_login_logs(ip_address);

-- Error log indexes
CREATE INDEX idx_c3_error_logs_date ON optimised_c3wizard.c3_error_logs(logged_at);
CREATE INDEX idx_c3_error_logs_controller ON optimised_c3wizard.c3_error_logs(controller_name);

-- Comments
COMMENT ON TABLE optimised_c3wizard.c3_payments IS 'Payment transactions - migrated from public.onlinepayments';
COMMENT ON TABLE optimised_c3wizard.c3_bank_payments IS 'Bank payment files - migrated from public.bankpaymentsmain';
COMMENT ON TABLE optimised_c3wizard.c3_saved_cards IS 'Saved payment cards - migrated from public.usercarddetail';
COMMENT ON TABLE optimised_c3wizard.c3_audit_logs IS 'Audit trail - migrated from public.auditlogs';
COMMENT ON TABLE optimised_c3wizard.c3_login_logs IS 'Login history - migrated from public.loginlog';
COMMENT ON TABLE optimised_c3wizard.c3_error_logs IS 'Error logs - migrated from public.customerrorlogs';
