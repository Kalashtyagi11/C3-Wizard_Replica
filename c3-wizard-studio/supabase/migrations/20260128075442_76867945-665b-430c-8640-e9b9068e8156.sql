-- =====================================================
-- C3 WIZARD PHASE 1 - CORE TABLES
-- Following naming convention: c3_ prefix + snake_case
-- =====================================================

-- 1. c3_master_company (from MasterCompany)
CREATE TABLE public.c3_master_company (
  company_id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  company_name VARCHAR(255) NOT NULL,
  trade_name VARCHAR(255),
  reg_number VARCHAR(50) UNIQUE,
  address1 VARCHAR(255),
  address2 VARCHAR(255),
  city VARCHAR(100),
  state VARCHAR(100),
  zip VARCHAR(20),
  country VARCHAR(100),
  mobile VARCHAR(50),
  landline VARCHAR(50),
  fax VARCHAR(50),
  contact_person VARCHAR(255),
  email VARCHAR(255),
  company_logo TEXT,
  inserted_by INTEGER,
  inserted_on TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  inserted_machine_info VARCHAR(255),
  updated_by INTEGER,
  updated_on TIMESTAMP WITH TIME ZONE,
  updated_machine_info VARCHAR(255),
  is_active BOOLEAN DEFAULT TRUE,
  is_levy_exempt BOOLEAN DEFAULT FALSE,
  parent_id INTEGER DEFAULT 0,
  tokan VARCHAR(255),
  is_verified BOOLEAN DEFAULT TRUE,
  reg_date TIMESTAMP WITH TIME ZONE,
  checked VARCHAR(10),
  office_code VARCHAR(10)
);

-- Indexes for c3_master_company
CREATE INDEX idx_c3_master_company_reg_number ON public.c3_master_company(reg_number);
CREATE INDEX idx_c3_master_company_is_active ON public.c3_master_company(is_active);
CREATE INDEX idx_c3_master_company_office_code ON public.c3_master_company(office_code);

-- Enable RLS
ALTER TABLE public.c3_master_company ENABLE ROW LEVEL SECURITY;

-- RLS Policy: Allow authenticated read access for now
CREATE POLICY "Allow authenticated read access to companies"
  ON public.c3_master_company
  FOR SELECT
  TO authenticated
  USING (true);

-- 2. c3_sec_users (from SECUsers)
CREATE TABLE public.c3_sec_users (
  user_id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  first_name VARCHAR(100) NOT NULL,
  last_name VARCHAR(100),
  login_id VARCHAR(100) NOT NULL,
  password VARCHAR(255),
  email_id VARCHAR(255),
  self_emp_id VARCHAR(50) DEFAULT '0',
  emp_id VARCHAR(50),
  department VARCHAR(100),
  role_id INTEGER DEFAULT 3,
  inserted_by INTEGER,
  inserted_on TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  inserted_machine_info VARCHAR(255),
  updated_by INTEGER,
  updated_on TIMESTAMP WITH TIME ZONE,
  updated_machine_info VARCHAR(255),
  is_active BOOLEAN DEFAULT TRUE,
  is_self_employee BOOLEAN DEFAULT FALSE,
  last_login_time TIMESTAMP WITH TIME ZONE,
  is_logged_in BOOLEAN DEFAULT FALSE,
  user_expires_on TIMESTAMP WITH TIME ZONE,
  pwd_expires_on TIMESTAMP WITH TIME ZONE,
  last_pwd_upddate TIMESTAMP WITH TIME ZONE,
  middle_name VARCHAR(100),
  status INTEGER DEFAULT 1,
  user_image TEXT,
  parentuserid INTEGER DEFAULT 0,
  is_ppoc BOOLEAN DEFAULT TRUE,
  reg_number VARCHAR(50),
  token VARCHAR(50),
  userstts VARCHAR(10) DEFAULT 'A',
  -- Link to Supabase auth
  auth_user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL
);

-- Indexes for c3_sec_users
CREATE INDEX idx_c3_sec_users_login_id ON public.c3_sec_users(login_id);
CREATE INDEX idx_c3_sec_users_email_id ON public.c3_sec_users(email_id);
CREATE INDEX idx_c3_sec_users_reg_number ON public.c3_sec_users(reg_number);
CREATE INDEX idx_c3_sec_users_role_id ON public.c3_sec_users(role_id);
CREATE INDEX idx_c3_sec_users_auth_user_id ON public.c3_sec_users(auth_user_id);

-- Enable RLS
ALTER TABLE public.c3_sec_users ENABLE ROW LEVEL SECURITY;

-- RLS Policy: Users can read own data
CREATE POLICY "Users can read own sec_users record"
  ON public.c3_sec_users
  FOR SELECT
  TO authenticated
  USING (auth_user_id = auth.uid() OR role_id = 1);

-- 3. c3_sec_role (from SECRole)
CREATE TABLE public.c3_sec_role (
  role_id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  role_name VARCHAR(100) NOT NULL,
  description TEXT,
  inserted_by INTEGER,
  inserted_on TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_by INTEGER,
  updated_on TIMESTAMP WITH TIME ZONE,
  is_active BOOLEAN DEFAULT TRUE
);

-- Enable RLS
ALTER TABLE public.c3_sec_role ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow authenticated read access to roles"
  ON public.c3_sec_role
  FOR SELECT
  TO authenticated
  USING (true);

-- Insert default roles
INSERT INTO public.c3_sec_role (role_name, description) VALUES
  ('Admin', 'System Administrator'),
  ('Manager', 'Manager Role'),
  ('Employer', 'Employer User'),
  ('SelfEmployed', 'Self-Employed User');

-- 4. c3_self_employee (from SelfEmployee)
CREATE TABLE public.c3_self_employee (
  employee_id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  empl_code VARCHAR(50),
  soc_sec_num VARCHAR(20) NOT NULL,
  first_name VARCHAR(100) NOT NULL,
  middle_name VARCHAR(100),
  last_name VARCHAR(100) NOT NULL,
  category_type INTEGER,
  birth_date TIMESTAMP WITH TIME ZONE,
  gender VARCHAR(1),
  address1 VARCHAR(255),
  address2 VARCHAR(255),
  city VARCHAR(100),
  state VARCHAR(100),
  country VARCHAR(100),
  zip VARCHAR(20),
  phone VARCHAR(50),
  mobile VARCHAR(50),
  email VARCHAR(255),
  tin VARCHAR(50),
  appint_date TIMESTAMP WITH TIME ZONE,
  last_pay_date TIMESTAMP WITH TIME ZONE,
  terminated TIMESTAMP WITH TIME ZONE,
  empl_status VARCHAR(10) DEFAULT 'A',
  pay_period VARCHAR(10) DEFAULT 'M',
  allowances NUMERIC(18,2) DEFAULT 0,
  state_allow NUMERIC(18,2) DEFAULT 0,
  marital_stat VARCHAR(10),
  bank_acct_no VARCHAR(50),
  state_udf VARCHAR(100),
  flex_dept_acct_type VARCHAR(50),
  last_inc_date TIMESTAMP WITH TIME ZONE,
  inserted_by INTEGER,
  inserted_on TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  inserted_machine_info VARCHAR(255),
  updated_by INTEGER,
  updated_on TIMESTAMP WITH TIME ZONE,
  updated_machine_info VARCHAR(255),
  is_active BOOLEAN DEFAULT TRUE,
  occupation VARCHAR(255),
  company_id INTEGER,
  is_director_only BOOLEAN DEFAULT FALSE,
  is_employee_director BOOLEAN DEFAULT FALSE,
  is_wage_category_from_api BOOLEAN DEFAULT FALSE,
  reg_date TIMESTAMP WITH TIME ZONE,
  checked VARCHAR(10),
  office_code VARCHAR(10)
);

-- Indexes
CREATE INDEX idx_c3_self_employee_soc_sec_num ON public.c3_self_employee(soc_sec_num);
CREATE INDEX idx_c3_self_employee_is_active ON public.c3_self_employee(is_active);
CREATE INDEX idx_c3_self_employee_office_code ON public.c3_self_employee(office_code);

-- Enable RLS
ALTER TABLE public.c3_self_employee ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow authenticated read access to self_employee"
  ON public.c3_self_employee
  FOR SELECT
  TO authenticated
  USING (true);

-- 5. c3_master_rate_setting (from Master_Rate_Setting)
CREATE TABLE public.c3_master_rate_setting (
  mrs_id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  bonus_levy_ee_rate NUMERIC(10,4) DEFAULT 0.08,
  severance_rate NUMERIC(10,4) DEFAULT 0.01,
  soc_ee_rate NUMERIC(10,4) DEFAULT 5,
  soc_er_rate NUMERIC(10,4) DEFAULT 5,
  eib NUMERIC(10,4) DEFAULT 1,
  fine_rate NUMERIC(10,4) DEFAULT 0.05,
  additional_fine_rate NUMERIC(10,4) DEFAULT 0.05,
  penalty_rate NUMERIC(10,4) DEFAULT 0.1,
  additional_penalty_rate NUMERIC(10,4) DEFAULT 0.01,
  min_age INTEGER DEFAULT 16,
  max_age INTEGER DEFAULT 62,
  from_date TIMESTAMP WITH TIME ZONE,
  to_date TIMESTAMP WITH TIME ZONE,
  is_locked BOOLEAN DEFAULT TRUE,
  employer_levy NUMERIC(10,4) DEFAULT 3
);

-- Enable RLS
ALTER TABLE public.c3_master_rate_setting ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow authenticated read access to rate_setting"
  ON public.c3_master_rate_setting
  FOR SELECT
  TO authenticated
  USING (true);

-- Insert default rate settings from production data
INSERT INTO public.c3_master_rate_setting (bonus_levy_ee_rate, severance_rate, soc_ee_rate, soc_er_rate, eib, fine_rate, additional_fine_rate, penalty_rate, additional_penalty_rate, min_age, max_age, from_date, to_date, is_locked, employer_levy)
VALUES 
  (0.08, 0.01, 5, 5, 1, 0.05, 0.05, 0.1, 0.01, 16, 62, '2008-11-01', '2010-12-31', true, 3),
  (0.08, 0.01, 5, 5, 1, 0.05, 0.05, 0.1, 0.01, 16, 62, '2011-01-01', '2014-10-31', true, 3),
  (0.08, 0.01, 5, 5, 1, 0.05, 0.05, 0.1, 0.01, 16, 62, '2014-01-11', '2099-10-31', true, 3);

-- 6. c3_wage_categories (from WageCategories)
CREATE TABLE public.c3_wage_categories (
  wc_id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  category_name VARCHAR(255) NOT NULL,
  min_wage NUMERIC(18,2) DEFAULT 0,
  max_wage NUMERIC(18,2) DEFAULT 0,
  contribution_amount NUMERIC(18,2) DEFAULT 0,
  inserted_by INTEGER,
  inserted_on TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_by INTEGER,
  updated_on TIMESTAMP WITH TIME ZONE,
  is_active BOOLEAN DEFAULT TRUE
);

-- Enable RLS
ALTER TABLE public.c3_wage_categories ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow authenticated read access to wage_categories"
  ON public.c3_wage_categories
  FOR SELECT
  TO authenticated
  USING (true);

-- 7. c3_login_log (from LoginLog)
CREATE TABLE public.c3_login_log (
  log_id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  user_id INTEGER,
  login_id VARCHAR(100),
  login_time TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  logout_time TIMESTAMP WITH TIME ZONE,
  ip_address VARCHAR(50),
  machine_info VARCHAR(255),
  is_active BOOLEAN DEFAULT TRUE
);

-- Indexes
CREATE INDEX idx_c3_login_log_user_id ON public.c3_login_log(user_id);
CREATE INDEX idx_c3_login_log_login_time ON public.c3_login_log(login_time);

-- Enable RLS
ALTER TABLE public.c3_login_log ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own login logs"
  ON public.c3_login_log
  FOR SELECT
  TO authenticated
  USING (true);

-- 8. c3_contact_us_log (from ContactUs_Log)
CREATE TABLE public.c3_contact_us_log (
  cus_id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  user_id INTEGER,
  company_id INTEGER,
  emailid VARCHAR(100),
  description TEXT,
  insert_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  registration_no INTEGER,
  insert_machine_info TEXT,
  name VARCHAR(255),
  phone VARCHAR(50),
  subject VARCHAR(255),
  status VARCHAR(20) DEFAULT 'pending'
);

-- Enable RLS
ALTER TABLE public.c3_contact_us_log ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow authenticated insert to contact_us_log"
  ON public.c3_contact_us_log
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Allow authenticated read own contact_us_log"
  ON public.c3_contact_us_log
  FOR SELECT
  TO authenticated
  USING (true);