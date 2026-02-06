
-- =====================================================
-- OPTIMISED C3 WIZARD SCHEMA - BATCH 2: USERS & COMPANIES
-- Creates user authentication and company tables
-- Target schema: optimised_c3wizard
-- =====================================================

-- =====================================================
-- 4. USER/AUTHENTICATION TABLES
-- =====================================================

-- c3_users - Main user accounts (migrated from secusers)
CREATE TABLE optimised_c3wizard.c3_users (
    id SERIAL PRIMARY KEY,
    auth_user_id UUID UNIQUE, -- Links to Supabase auth.users if needed
    username VARCHAR(100) NOT NULL,
    email VARCHAR(255),
    password_hash TEXT, -- Legacy password for migration (will be deprecated)
    role_id INTEGER REFERENCES optimised_c3wizard.c3_roles(id),
    company_id INTEGER, -- Will reference c3_companies after it's created
    self_employed_id INTEGER, -- Will reference c3_self_employed after it's created
    user_type VARCHAR(50), -- 'ADMIN', 'EMPLOYER', 'SELF_EMPLOYED'
    is_locked BOOLEAN DEFAULT FALSE,
    is_verified BOOLEAN DEFAULT FALSE,
    is_email_verified BOOLEAN DEFAULT FALSE,
    failed_login_attempts INTEGER DEFAULT 0,
    last_login_at TIMESTAMPTZ,
    last_login_ip VARCHAR(45),
    password_changed_at TIMESTAMPTZ,
    password_reset_token TEXT,
    password_reset_expires_at TIMESTAMPTZ,
    verification_token TEXT,
    is_deleted BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    created_by INTEGER,
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    updated_by INTEGER,
    legacy_id INTEGER, -- Maps to public.secusers.userid
    legacy_machine_info TEXT -- InsertedMachineInfo from legacy
);

-- c3_user_profiles - Extended user information (migrated from secusersprofile)
CREATE TABLE optimised_c3wizard.c3_user_profiles (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES optimised_c3wizard.c3_users(id) ON DELETE CASCADE,
    first_name VARCHAR(100),
    middle_name VARCHAR(100),
    last_name VARCHAR(100),
    display_name VARCHAR(200),
    date_of_birth DATE,
    gender VARCHAR(20),
    phone VARCHAR(50),
    mobile VARCHAR(50),
    address_line1 TEXT,
    address_line2 TEXT,
    city VARCHAR(100),
    state VARCHAR(100),
    country VARCHAR(100),
    postal_code VARCHAR(20),
    profile_image_url TEXT,
    is_deleted BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    created_by INTEGER,
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    updated_by INTEGER,
    legacy_id INTEGER -- Maps to public.secusersprofile.profileid
);

-- c3_user_permissions - Granular permissions per user/module
CREATE TABLE optimised_c3wizard.c3_user_permissions (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES optimised_c3wizard.c3_users(id) ON DELETE CASCADE,
    module_id INTEGER REFERENCES optimised_c3wizard.c3_modules(id),
    role_id INTEGER REFERENCES optimised_c3wizard.c3_roles(id),
    can_create BOOLEAN DEFAULT FALSE,
    can_read BOOLEAN DEFAULT TRUE,
    can_update BOOLEAN DEFAULT FALSE,
    can_delete BOOLEAN DEFAULT FALSE,
    can_browse BOOLEAN DEFAULT TRUE,
    can_export BOOLEAN DEFAULT FALSE,
    is_deleted BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    created_by INTEGER,
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    updated_by INTEGER,
    legacy_id INTEGER -- Maps to public.secusermodule.usermoduleid
);

-- c3_security_questions - User security Q&A for password recovery
CREATE TABLE optimised_c3wizard.c3_security_questions (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES optimised_c3wizard.c3_users(id) ON DELETE CASCADE,
    question_number INTEGER NOT NULL,
    question TEXT NOT NULL,
    answer_hash TEXT NOT NULL, -- Hashed answer
    is_deleted BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    created_by INTEGER,
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    updated_by INTEGER,
    legacy_id INTEGER -- Maps to public.securityquestionanswer
);

-- c3_user_otps - One-time passwords for 2FA
CREATE TABLE optimised_c3wizard.c3_user_otps (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES optimised_c3wizard.c3_users(id) ON DELETE CASCADE,
    otp_code VARCHAR(10) NOT NULL,
    otp_type VARCHAR(50), -- 'LOGIN', 'PASSWORD_RESET', 'EMAIL_VERIFY'
    expires_at TIMESTAMPTZ NOT NULL,
    is_used BOOLEAN DEFAULT FALSE,
    used_at TIMESTAMPTZ,
    is_deleted BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    legacy_id INTEGER -- Maps to public.userotp
);

-- =====================================================
-- 5. COMPANY TABLES
-- =====================================================

-- c3_companies - Employer companies (migrated from mastercompany)
CREATE TABLE optimised_c3wizard.c3_companies (
    id SERIAL PRIMARY KEY,
    registration_number VARCHAR(50) UNIQUE, -- reg_number
    company_name VARCHAR(255) NOT NULL,
    trade_name VARCHAR(255),
    parent_company_id INTEGER REFERENCES optimised_c3wizard.c3_companies(id),
    office_code VARCHAR(50),
    
    -- Contact Information
    address_line1 TEXT,
    address_line2 TEXT,
    city VARCHAR(100),
    state VARCHAR(100),
    postal_code VARCHAR(20),
    country VARCHAR(100) DEFAULT 'Saint Lucia',
    contact_person VARCHAR(200),
    email VARCHAR(255),
    phone VARCHAR(50),
    mobile VARCHAR(50),
    fax VARCHAR(50),
    
    -- Status & Verification
    is_verified BOOLEAN DEFAULT FALSE,
    is_levy_exempt BOOLEAN DEFAULT FALSE,
    verification_token TEXT,
    registration_date DATE,
    logo_url TEXT,
    
    -- Metadata
    is_deleted BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    created_by INTEGER,
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    updated_by INTEGER,
    legacy_id INTEGER, -- Maps to public.mastercompany.company_id
    legacy_machine_info TEXT
);

-- Now add foreign key constraints from c3_users to c3_companies
ALTER TABLE optimised_c3wizard.c3_users 
ADD CONSTRAINT fk_users_company 
FOREIGN KEY (company_id) REFERENCES optimised_c3wizard.c3_companies(id);

-- =====================================================
-- 6. EMPLOYEE TABLES
-- =====================================================

-- c3_employees - Employee records (migrated from masteremployee)
CREATE TABLE optimised_c3wizard.c3_employees (
    id SERIAL PRIMARY KEY,
    company_id INTEGER REFERENCES optimised_c3wizard.c3_companies(id) NOT NULL,
    employee_type_id INTEGER REFERENCES optimised_c3wizard.c3_employee_types(id),
    
    -- Identification
    employee_code VARCHAR(50), -- empl_code
    social_security_number VARCHAR(50), -- soc_sec_num (encrypted/masked in application)
    tin VARCHAR(50), -- Tax Identification Number
    
    -- Personal Information
    first_name VARCHAR(100) NOT NULL,
    middle_name VARCHAR(100),
    last_name VARCHAR(100) NOT NULL,
    date_of_birth DATE,
    gender VARCHAR(20),
    marital_status VARCHAR(20),
    
    -- Contact Information
    address_line1 TEXT,
    address_line2 TEXT,
    city VARCHAR(100),
    state VARCHAR(100),
    postal_code VARCHAR(20),
    country VARCHAR(100) DEFAULT 'Saint Lucia',
    email VARCHAR(255),
    phone VARCHAR(50),
    mobile VARCHAR(50),
    
    -- Employment Details
    department VARCHAR(100),
    occupation VARCHAR(200),
    pay_period VARCHAR(20), -- 'WEEKLY', 'BIWEEKLY', 'MONTHLY'
    employment_status VARCHAR(50), -- 'ACTIVE', 'TERMINATED', 'ON_LEAVE'
    hire_date DATE, -- appint_date
    termination_date DATE,
    last_pay_date DATE,
    last_increment_date DATE,
    wages_pay_date DATE,
    
    -- Bank Information
    bank_account_number VARCHAR(100), -- Should be encrypted
    
    -- Flags
    is_director BOOLEAN DEFAULT FALSE, -- isemployeedirector
    is_director_only BOOLEAN DEFAULT FALSE, -- isdirectoronly
    is_levy_exempt BOOLEAN DEFAULT FALSE,
    is_file_created BOOLEAN DEFAULT FALSE, -- isfilecreatedemp
    hold_payment BOOLEAN DEFAULT FALSE,
    
    -- Allowances
    allowances NUMERIC(18,2) DEFAULT 0,
    state_allowances NUMERIC(18,2) DEFAULT 0,
    state_udf NUMERIC(18,2) DEFAULT 0,
    
    -- Metadata
    is_deleted BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    created_by INTEGER,
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    updated_by INTEGER,
    legacy_id INTEGER, -- Maps to public.masteremployee.employeeid
    legacy_machine_info TEXT
);

-- =====================================================
-- 7. SELF-EMPLOYED TABLES
-- =====================================================

-- c3_self_employed - Self-employed individuals (migrated from selfemployee)
CREATE TABLE optimised_c3wizard.c3_self_employed (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES optimised_c3wizard.c3_users(id),
    wage_category_id INTEGER REFERENCES optimised_c3wizard.c3_wage_categories(id),
    
    -- Identification
    registration_number VARCHAR(50) UNIQUE,
    social_security_number VARCHAR(50), -- Encrypted
    tin VARCHAR(50),
    
    -- Personal Information
    first_name VARCHAR(100) NOT NULL,
    middle_name VARCHAR(100),
    last_name VARCHAR(100) NOT NULL,
    date_of_birth DATE,
    gender VARCHAR(20),
    
    -- Contact Information
    address_line1 TEXT,
    address_line2 TEXT,
    city VARCHAR(100),
    state VARCHAR(100),
    postal_code VARCHAR(20),
    country VARCHAR(100) DEFAULT 'Saint Lucia',
    email VARCHAR(255),
    phone VARCHAR(50),
    mobile VARCHAR(50),
    
    -- Business Information
    business_name VARCHAR(255),
    trade_name VARCHAR(255),
    occupation VARCHAR(200),
    
    -- Status
    is_verified BOOLEAN DEFAULT FALSE,
    is_active BOOLEAN DEFAULT TRUE,
    registration_date DATE,
    
    -- Metadata
    is_deleted BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    created_by INTEGER,
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    updated_by INTEGER,
    legacy_id INTEGER, -- Maps to public.selfemployee
    legacy_machine_info TEXT
);

-- Add foreign key from c3_users to c3_self_employed
ALTER TABLE optimised_c3wizard.c3_users 
ADD CONSTRAINT fk_users_self_employed 
FOREIGN KEY (self_employed_id) REFERENCES optimised_c3wizard.c3_self_employed(id);

-- =====================================================
-- INDEXES
-- =====================================================

-- User indexes
CREATE INDEX idx_c3_users_email ON optimised_c3wizard.c3_users(email);
CREATE INDEX idx_c3_users_username ON optimised_c3wizard.c3_users(username);
CREATE INDEX idx_c3_users_company ON optimised_c3wizard.c3_users(company_id);
CREATE INDEX idx_c3_users_auth_id ON optimised_c3wizard.c3_users(auth_user_id);
CREATE INDEX idx_c3_users_type ON optimised_c3wizard.c3_users(user_type);
CREATE INDEX idx_c3_user_profiles_user ON optimised_c3wizard.c3_user_profiles(user_id);
CREATE INDEX idx_c3_user_permissions_user ON optimised_c3wizard.c3_user_permissions(user_id);

-- Company indexes
CREATE INDEX idx_c3_companies_reg ON optimised_c3wizard.c3_companies(registration_number);
CREATE INDEX idx_c3_companies_name ON optimised_c3wizard.c3_companies(company_name);
CREATE INDEX idx_c3_companies_parent ON optimised_c3wizard.c3_companies(parent_company_id);

-- Employee indexes
CREATE INDEX idx_c3_employees_company ON optimised_c3wizard.c3_employees(company_id);
CREATE INDEX idx_c3_employees_ssn ON optimised_c3wizard.c3_employees(social_security_number);
CREATE INDEX idx_c3_employees_name ON optimised_c3wizard.c3_employees(last_name, first_name);
CREATE INDEX idx_c3_employees_status ON optimised_c3wizard.c3_employees(employment_status);
CREATE INDEX idx_c3_employees_code ON optimised_c3wizard.c3_employees(employee_code);

-- Self-employed indexes
CREATE INDEX idx_c3_self_employed_ssn ON optimised_c3wizard.c3_self_employed(social_security_number);
CREATE INDEX idx_c3_self_employed_reg ON optimised_c3wizard.c3_self_employed(registration_number);
CREATE INDEX idx_c3_self_employed_user ON optimised_c3wizard.c3_self_employed(user_id);

-- Comments
COMMENT ON TABLE optimised_c3wizard.c3_users IS 'User accounts - migrated from public.secusers';
COMMENT ON TABLE optimised_c3wizard.c3_user_profiles IS 'Extended user profiles - migrated from public.secusersprofile';
COMMENT ON TABLE optimised_c3wizard.c3_companies IS 'Employer companies - migrated from public.mastercompany';
COMMENT ON TABLE optimised_c3wizard.c3_employees IS 'Employee records - migrated from public.masteremployee';
COMMENT ON TABLE optimised_c3wizard.c3_self_employed IS 'Self-employed individuals - migrated from public.selfemployee';
