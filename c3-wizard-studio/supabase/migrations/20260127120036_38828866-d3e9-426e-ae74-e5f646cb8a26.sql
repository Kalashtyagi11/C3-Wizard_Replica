-- =============================================
-- CREATE ONLY MISSING TABLES FOR 1:1 MS SQL MAPPING
-- These tables don't exist yet in the database
-- =============================================

-- 1. c3_sec_users - Maps to SECUsers (1,025 rows) - LEGACY AUTH
CREATE TABLE IF NOT EXISTS c3_sec_users (
  id SERIAL PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  first_name VARCHAR(50) NOT NULL,
  last_name VARCHAR(50),
  middle_name VARCHAR(50),
  login_id VARCHAR(50) NOT NULL UNIQUE,
  password_hash VARCHAR(200) NOT NULL,
  email VARCHAR(100),
  self_emp_id VARCHAR(50),
  emp_id VARCHAR(50) NOT NULL,
  department VARCHAR(100),
  role_id INTEGER NOT NULL,
  is_self_employee BOOLEAN DEFAULT FALSE,
  last_login_time TIMESTAMP WITH TIME ZONE,
  is_logged_in BOOLEAN DEFAULT FALSE,
  user_expires_on TIMESTAMP WITH TIME ZONE,
  pwd_expires_on TIMESTAMP WITH TIME ZONE,
  last_pwd_update TIMESTAMP WITH TIME ZONE,
  status BOOLEAN DEFAULT TRUE,
  user_image TEXT,
  parent_user_id INTEGER,
  is_ppoc BOOLEAN DEFAULT FALSE,
  reg_number VARCHAR(100),
  token VARCHAR(100),
  user_status VARCHAR(3),
  created_by INTEGER,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_machine_info VARCHAR(50),
  updated_by INTEGER,
  updated_at TIMESTAMP WITH TIME ZONE,
  updated_machine_info VARCHAR(50),
  is_active BOOLEAN DEFAULT TRUE
);

-- 2. c3_sec_users_profile - Maps to SECUsersProfile (1,057 rows)
CREATE TABLE IF NOT EXISTS c3_sec_users_profile (
  id SERIAL PRIMARY KEY,
  emp_id INTEGER,
  reg_number VARCHAR(100),
  sec_user_id INTEGER NOT NULL REFERENCES c3_sec_users(id) ON DELETE CASCADE,
  is_self_employee BOOLEAN DEFAULT FALSE,
  created_machine_info TEXT,
  created_by INTEGER,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_machine_info_legacy VARCHAR(300),
  updated_by INTEGER,
  updated_at TIMESTAMP WITH TIME ZONE,
  updated_machine_info VARCHAR(300),
  is_active BOOLEAN DEFAULT TRUE
);

-- 3. c3_sec_modules - Maps to SECModule (66 rows)
CREATE TABLE IF NOT EXISTS c3_sec_modules (
  id SERIAL PRIMARY KEY,
  module_name VARCHAR(100),
  description VARCHAR(255),
  level INTEGER,
  parent_id INTEGER,
  form_name VARCHAR(255),
  module_type_id INTEGER,
  option VARCHAR(10),
  page_url VARCHAR(100),
  icon VARCHAR(100),
  created_by INTEGER,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_machine_info VARCHAR(50),
  updated_by INTEGER,
  updated_at TIMESTAMP WITH TIME ZONE,
  updated_machine_info VARCHAR(50),
  is_active BOOLEAN DEFAULT TRUE
);

-- 4. c3_sec_roles - Maps to SECRole (12 rows)
CREATE TABLE IF NOT EXISTS c3_sec_roles (
  id SERIAL PRIMARY KEY,
  role_name VARCHAR(50),
  description VARCHAR(255),
  role_category VARCHAR(50),
  deletable VARCHAR(1),
  created_by INTEGER,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_machine_info VARCHAR(50),
  updated_by INTEGER,
  updated_at TIMESTAMP WITH TIME ZONE,
  updated_machine_info VARCHAR(50),
  is_active BOOLEAN DEFAULT TRUE
);

-- 5. c3_sec_user_modules - Maps to SECUserModule (239 rows)
CREATE TABLE IF NOT EXISTS c3_sec_user_modules (
  id SERIAL PRIMARY KEY,
  sec_user_id INTEGER REFERENCES c3_sec_users(id),
  role_id INTEGER,
  module_id INTEGER REFERENCES c3_sec_modules(id),
  add_permission BOOLEAN DEFAULT FALSE,
  update_permission BOOLEAN DEFAULT FALSE,
  delete_permission BOOLEAN DEFAULT FALSE,
  find_permission BOOLEAN DEFAULT FALSE,
  browse_permission BOOLEAN DEFAULT FALSE,
  next_permission BOOLEAN DEFAULT FALSE,
  previous_permission BOOLEAN DEFAULT FALSE,
  tab_permission BOOLEAN DEFAULT FALSE,
  options_permission BOOLEAN DEFAULT FALSE,
  init_permission BOOLEAN DEFAULT FALSE,
  view_permission BOOLEAN DEFAULT FALSE,
  is_submitted BOOLEAN DEFAULT FALSE,
  is_print BOOLEAN DEFAULT FALSE,
  is_preview BOOLEAN DEFAULT FALSE,
  is_pay BOOLEAN DEFAULT FALSE,
  is_wages BOOLEAN DEFAULT FALSE,
  created_by INTEGER,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_machine_info VARCHAR(50),
  updated_by INTEGER,
  updated_at TIMESTAMP WITH TIME ZONE,
  updated_machine_info VARCHAR(50),
  is_active BOOLEAN DEFAULT TRUE
);

-- 6. c3_security_question_answers - Maps to SecurityQuestionAnswer (990 rows)
CREATE TABLE IF NOT EXISTS c3_security_question_answers (
  id SERIAL PRIMARY KEY,
  sec_user_id INTEGER REFERENCES c3_sec_users(id),
  company_id INTEGER,
  user_name VARCHAR(50),
  registration_no INTEGER,
  company_name VARCHAR(50),
  question_1 VARCHAR(200),
  question_2 VARCHAR(200),
  answer_1 VARCHAR(200),
  answer_2 VARCHAR(200),
  created_by INTEGER,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_machine_info VARCHAR(50),
  updated_by INTEGER,
  updated_at TIMESTAMP WITH TIME ZONE,
  updated_machine_info VARCHAR(50),
  is_active BOOLEAN DEFAULT TRUE
);

-- 7. c3_custom_error_logs - Maps to CustomErrorLogs (8,416 rows) - SEPARATE from c3_error_logs
CREATE TABLE IF NOT EXISTS c3_custom_error_logs (
  id SERIAL PRIMARY KEY,
  controller_name VARCHAR(100) NOT NULL,
  method_name VARCHAR(100) NOT NULL,
  error_message TEXT NOT NULL,
  stack_trace TEXT,
  log_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  is_active BOOLEAN DEFAULT TRUE
);

-- 8. c3_bank_payments - Maps to BankPaymentsMain (0 rows)
CREATE TABLE IF NOT EXISTS c3_bank_payments (
  id SERIAL PRIMARY KEY,
  file_path TEXT,
  created_by INTEGER,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_by INTEGER,
  updated_at TIMESTAMP WITH TIME ZONE,
  is_active BOOLEAN DEFAULT TRUE
);

-- 9. c3_user_card_details - Maps to UserCardDetail (3 rows)
CREATE TABLE IF NOT EXISTS c3_user_card_details (
  id SERIAL PRIMARY KEY,
  sec_user_id INTEGER NOT NULL,
  card_number VARCHAR(50) NOT NULL,
  card_type VARCHAR(50) NOT NULL,
  card_month_expiry VARCHAR(10) NOT NULL,
  card_holder_name VARCHAR(100) NOT NULL,
  cvv VARCHAR(10) NOT NULL,
  is_active BOOLEAN DEFAULT TRUE,
  created_by INTEGER NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 10. c3_reconciliation_details - Maps to ReconciliationPayment_Details (0 rows)
CREATE TABLE IF NOT EXISTS c3_reconciliation_details (
  id SERIAL PRIMARY KEY,
  main_id INTEGER,
  transaction_id VARCHAR(50) NOT NULL UNIQUE,
  invoice_number BIGINT,
  card_number BIGINT,
  transaction_date TIMESTAMP WITH TIME ZONE,
  amount NUMERIC(18,3),
  payment_status VARCHAR(50),
  reconciliation_status VARCHAR(50)
);

-- 11. c3_cybersource_columns - Maps to Reconciliation_Cyber_Space_Column (180 rows)
CREATE TABLE IF NOT EXISTS c3_cybersource_columns (
  id SERIAL PRIMARY KEY,
  columns_config VARCHAR(4000),
  is_active BOOLEAN DEFAULT TRUE,
  user_id INTEGER,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_by INTEGER
);

-- 12. c3_holiday_pay_dates - Maps to HolidayPayDates (1,168 rows)
CREATE TABLE IF NOT EXISTS c3_holiday_pay_dates (
  id SERIAL PRIMARY KEY,
  holiday_pay_id INTEGER,
  employee_id INTEGER,
  company_id INTEGER,
  amount NUMERIC(18,4),
  holiday_pay_date TIMESTAMP WITH TIME ZONE
);

-- 13. c3_wages_pay_details - Maps to WagesPayDetails (0 rows)
CREATE TABLE IF NOT EXISTS c3_wages_pay_details (
  id SERIAL PRIMARY KEY,
  employee_id INTEGER,
  company_id INTEGER,
  amount NUMERIC(18,4),
  start_date TIMESTAMP WITH TIME ZONE,
  end_date TIMESTAMP WITH TIME ZONE,
  wages_pay_date TIMESTAMP WITH TIME ZONE,
  pay_no_of_times INTEGER,
  employee_details TEXT,
  period_month VARCHAR(2),
  period_year VARCHAR(4),
  created_by INTEGER,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_machine_info TEXT,
  updated_by INTEGER,
  updated_at TIMESTAMP WITH TIME ZONE,
  updated_machine_info TEXT
);

-- 14. c3_employer_codes - Maps to MasterEmployerCodes (0 rows)
CREATE TABLE IF NOT EXISTS c3_employer_codes (
  id SERIAL PRIMARY KEY,
  employer_levy_rate NUMERIC(18,2),
  employer_severance_rate NUMERIC(18,2),
  bonus_rate NUMERIC(18,2),
  employer_year_ded_rate NUMERIC(18,2),
  max_age INTEGER,
  min_age INTEGER,
  rate_1 NUMERIC(18,2),
  rate_2 NUMERIC(18,2),
  rate_3 NUMERIC(18,2),
  year INTEGER
);

-- 15. c3_employee_types - Maps to MasterEmpType (3 rows)
CREATE TABLE IF NOT EXISTS c3_employee_types (
  id SERIAL PRIMARY KEY,
  type_code VARCHAR(6),
  description VARCHAR(50),
  created_by INTEGER,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_machine_info VARCHAR(50),
  updated_by INTEGER,
  updated_at TIMESTAMP WITH TIME ZONE,
  updated_machine_info VARCHAR(50),
  is_active BOOLEAN DEFAULT TRUE
);

-- 16. c3_tax_table_headers - Maps to Deductions_Tax_Table_Header (5 rows)
CREATE TABLE IF NOT EXISTS c3_tax_table_headers (
  id SERIAL PRIMARY KEY,
  tax_year VARCHAR(6),
  ded_code VARCHAR(50),
  week_allow NUMERIC(18,2),
  biweek_allow NUMERIC(18,2),
  smonth_allow NUMERIC(18,2),
  month_allow NUMERIC(18,2),
  quarter_allow NUMERIC(18,2),
  syear_allow NUMERIC(18,2),
  year_allow NUMERIC(18,2),
  misc_allow NUMERIC(18,2),
  hrs_week_allow NUMERIC(18,2),
  hrs_biweek_allow NUMERIC(18,2),
  hrs_smonth_allow NUMERIC(18,2),
  hrs_month_allow NUMERIC(18,2),
  hrs_quarter_allow NUMERIC(18,2),
  hrs_syear_allow NUMERIC(18,2),
  hrs_year_allow NUMERIC(18,2),
  hrs_misc_allow NUMERIC(18,2),
  allow_or_limit VARCHAR(1),
  start_date TIMESTAMP WITH TIME ZONE,
  end_date TIMESTAMP WITH TIME ZONE
);

-- 17. c3_tax_table_details - Maps to Deductions_Tax_Table_Details (65 rows)
CREATE TABLE IF NOT EXISTS c3_tax_table_details (
  id SERIAL PRIMARY KEY,
  tax_year VARCHAR(4),
  ded_code VARCHAR(6),
  pay_period VARCHAR(50),
  marital_stat VARCHAR(1),
  over_amt NUMERIC(18,3),
  base_amt NUMERIC(18,3),
  tax_rate NUMERIC(18,3),
  order_no INTEGER,
  tax_header_id INTEGER REFERENCES c3_tax_table_headers(id)
);

-- 18. c3_pay_employees - Maps to Process_PayEmployee (0 rows)
CREATE TABLE IF NOT EXISTS c3_pay_employees (
  id SERIAL PRIMARY KEY,
  payroll_header_id UUID,
  empl_code VARCHAR(6),
  cash_amount NUMERIC(18,4) DEFAULT 0,
  inc_gross NUMERIC(18,4) DEFAULT 0,
  ded_fica NUMERIC(18,4) DEFAULT 0,
  inc_taxable NUMERIC(18,4) DEFAULT 0,
  ded_medicare NUMERIC(18,4) DEFAULT 0,
  ded_fed_tax NUMERIC(18,4) DEFAULT 0,
  ded_sta_tax NUMERIC(18,4) DEFAULT 0,
  ded_loc_tax NUMERIC(18,4) DEFAULT 0,
  ded_other NUMERIC(18,4) DEFAULT 0,
  obl_futa NUMERIC(18,4) DEFAULT 0,
  obl_fica NUMERIC(18,4) DEFAULT 0,
  obl_medicare NUMERIC(18,4) DEFAULT 0,
  obl_other NUMERIC(18,4) DEFAULT 0,
  obl_total NUMERIC(18,4) DEFAULT 0,
  inc_net NUMERIC(18,4) DEFAULT 0,
  inc_expense NUMERIC(18,4) DEFAULT 0,
  total_hours NUMERIC(18,4) DEFAULT 0,
  department VARCHAR(3),
  is_salary BOOLEAN DEFAULT FALSE,
  regular_hours NUMERIC(18,4) DEFAULT 0,
  overtime_hours NUMERIC(18,4) DEFAULT 0,
  trans_mode VARCHAR(1),
  bank_acc_no VARCHAR(17),
  ach_ref_no VARCHAR(50),
  employee_id UUID,
  pay_date TIMESTAMP WITH TIME ZONE,
  period_year VARCHAR(4),
  start_date TIMESTAMP WITH TIME ZONE,
  end_date TIMESTAMP WITH TIME ZONE,
  check_no VARCHAR(50),
  company_id UUID
);

-- 19. c3_pay_incomes - Maps to Process_PayIncomes (0 rows)
CREATE TABLE IF NOT EXISTS c3_pay_incomes (
  id SERIAL PRIMARY KEY,
  payroll_header_id UUID,
  empl_code VARCHAR(6),
  inc_code VARCHAR(6),
  inc_rate NUMERIC(18,4) DEFAULT 0,
  number NUMERIC(18,4) DEFAULT 0,
  hours NUMERIC(18,4) DEFAULT 0,
  amount NUMERIC(18,4) DEFAULT 0,
  lo_inc_amt NUMERIC(18,4) DEFAULT 0,
  hi_inc_amt NUMERIC(18,4) DEFAULT 0,
  department VARCHAR(3),
  acct_no INTEGER,
  pay_date TIMESTAMP WITH TIME ZONE,
  employee_id UUID
);

-- 20. c3_pay_deductions - Maps to Process_PayDeductions (0 rows)
CREATE TABLE IF NOT EXISTS c3_pay_deductions (
  id SERIAL PRIMARY KEY,
  payroll_header_id UUID,
  empl_code VARCHAR(6),
  ded_code VARCHAR(6),
  ded_rate NUMERIC(18,4) DEFAULT 0,
  amount NUMERIC(18,4) DEFAULT 0,
  department VARCHAR(3),
  acct_no INTEGER,
  employee_id UUID,
  pay_date TIMESTAMP WITH TIME ZONE,
  lo_ded_amt NUMERIC(18,4) DEFAULT 0,
  hi_ded_amt NUMERIC(18,4) DEFAULT 0
);

-- 21. c3_pay_obligations - Maps to Process_PayObligations (0 rows)
CREATE TABLE IF NOT EXISTS c3_pay_obligations (
  id SERIAL PRIMARY KEY,
  payroll_header_id UUID,
  empl_code VARCHAR(6),
  obl_code VARCHAR(6),
  obl_rate NUMERIC(18,4) DEFAULT 0,
  amount NUMERIC(18,4) DEFAULT 0,
  department VARCHAR(3),
  bal_acct_no INTEGER,
  acct_no INTEGER,
  employee_id UUID,
  pay_date TIMESTAMP WITH TIME ZONE,
  pay_limit NUMERIC(18,4) DEFAULT 0
);

-- =============================================
-- ENABLE RLS ON NEW TABLES
-- =============================================

ALTER TABLE c3_sec_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE c3_sec_users_profile ENABLE ROW LEVEL SECURITY;
ALTER TABLE c3_sec_modules ENABLE ROW LEVEL SECURITY;
ALTER TABLE c3_sec_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE c3_sec_user_modules ENABLE ROW LEVEL SECURITY;
ALTER TABLE c3_security_question_answers ENABLE ROW LEVEL SECURITY;
ALTER TABLE c3_custom_error_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE c3_bank_payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE c3_user_card_details ENABLE ROW LEVEL SECURITY;
ALTER TABLE c3_reconciliation_details ENABLE ROW LEVEL SECURITY;
ALTER TABLE c3_cybersource_columns ENABLE ROW LEVEL SECURITY;
ALTER TABLE c3_holiday_pay_dates ENABLE ROW LEVEL SECURITY;
ALTER TABLE c3_wages_pay_details ENABLE ROW LEVEL SECURITY;
ALTER TABLE c3_employer_codes ENABLE ROW LEVEL SECURITY;
ALTER TABLE c3_employee_types ENABLE ROW LEVEL SECURITY;
ALTER TABLE c3_tax_table_headers ENABLE ROW LEVEL SECURITY;
ALTER TABLE c3_tax_table_details ENABLE ROW LEVEL SECURITY;
ALTER TABLE c3_pay_employees ENABLE ROW LEVEL SECURITY;
ALTER TABLE c3_pay_incomes ENABLE ROW LEVEL SECURITY;
ALTER TABLE c3_pay_deductions ENABLE ROW LEVEL SECURITY;
ALTER TABLE c3_pay_obligations ENABLE ROW LEVEL SECURITY;

-- =============================================
-- RLS POLICIES
-- =============================================

CREATE POLICY "Admins manage sec_users" ON c3_sec_users FOR ALL USING (has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Admins manage sec_users_profile" ON c3_sec_users_profile FOR ALL USING (has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Admins manage sec_modules" ON c3_sec_modules FOR ALL USING (has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Admins manage sec_roles" ON c3_sec_roles FOR ALL USING (has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Admins manage sec_user_modules" ON c3_sec_user_modules FOR ALL USING (has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Admins manage security_question_answers" ON c3_security_question_answers FOR ALL USING (has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Admins manage custom_error_logs" ON c3_custom_error_logs FOR ALL USING (has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Admins manage bank_payments" ON c3_bank_payments FOR ALL USING (has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Admins manage user_card_details" ON c3_user_card_details FOR ALL USING (has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Admins manage reconciliation_details" ON c3_reconciliation_details FOR ALL USING (has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Admins manage cybersource_columns" ON c3_cybersource_columns FOR ALL USING (has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Admins manage holiday_pay_dates" ON c3_holiday_pay_dates FOR ALL USING (has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Admins manage wages_pay_details" ON c3_wages_pay_details FOR ALL USING (has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Admins manage employer_codes" ON c3_employer_codes FOR ALL USING (has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Admins manage employee_types" ON c3_employee_types FOR ALL USING (has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Admins manage tax_table_headers" ON c3_tax_table_headers FOR ALL USING (has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Admins manage tax_table_details" ON c3_tax_table_details FOR ALL USING (has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Admins manage pay_employees" ON c3_pay_employees FOR ALL USING (has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Admins manage pay_incomes" ON c3_pay_incomes FOR ALL USING (has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Admins manage pay_deductions" ON c3_pay_deductions FOR ALL USING (has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Admins manage pay_obligations" ON c3_pay_obligations FOR ALL USING (has_role(auth.uid(), 'admin'::app_role));

-- Public read access for lookup tables
CREATE POLICY "Read sec_modules" ON c3_sec_modules FOR SELECT USING (true);
CREATE POLICY "Read sec_roles" ON c3_sec_roles FOR SELECT USING (true);
CREATE POLICY "Read employee_types" ON c3_employee_types FOR SELECT USING (true);
CREATE POLICY "Read tax_table_headers" ON c3_tax_table_headers FOR SELECT USING (true);
CREATE POLICY "Read tax_table_details" ON c3_tax_table_details FOR SELECT USING (true);
CREATE POLICY "Read employer_codes" ON c3_employer_codes FOR SELECT USING (true);

-- Indexes
CREATE INDEX idx_sec_users_login ON c3_sec_users(login_id);
CREATE INDEX idx_sec_users_email ON c3_sec_users(email);
CREATE INDEX idx_sec_users_auth_user ON c3_sec_users(user_id);
CREATE INDEX idx_sec_profile_user ON c3_sec_users_profile(sec_user_id);
CREATE INDEX idx_sec_user_modules_user ON c3_sec_user_modules(sec_user_id);
CREATE INDEX idx_security_questions_user ON c3_security_question_answers(sec_user_id);