-- =====================================================
-- PHASE 2: Complete Database Schema (All 66 Tables)
-- This migration adds all remaining tables from legacy MS SQL
-- Using c3_ prefix and snake_case naming convention
-- =====================================================

-- =====================================================
-- 1. EMPLOYEES (MasterEmployee)
-- =====================================================
CREATE TABLE IF NOT EXISTS c3_master_employee (
  emp_id BIGSERIAL PRIMARY KEY,
  company_id INTEGER REFERENCES c3_master_company(company_id),
  soc_sec_num VARCHAR(50),
  first_name VARCHAR(100) NOT NULL,
  last_name VARCHAR(100) NOT NULL,
  middle_name VARCHAR(100),
  gender VARCHAR(10),
  birth_date TIMESTAMP WITH TIME ZONE,
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
  empl_status VARCHAR(10) DEFAULT 'A',
  empl_code VARCHAR(50),
  joining_date TIMESTAMP WITH TIME ZONE,
  termination_date TIMESTAMP WITH TIME ZONE,
  last_inc_date TIMESTAMP WITH TIME ZONE,
  last_pay_date TIMESTAMP WITH TIME ZONE,
  pay_period VARCHAR(10) DEFAULT 'M',
  occupation VARCHAR(255),
  bank_acct_no VARCHAR(100),
  annual_salary NUMERIC(18,4) DEFAULT 0,
  allowances NUMERIC(18,4) DEFAULT 0,
  state_allow NUMERIC(18,4) DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  is_levy_exempt BOOLEAN DEFAULT false,
  is_director_only BOOLEAN DEFAULT false,
  is_employee_director BOOLEAN DEFAULT false,
  is_wage_category_from_api BOOLEAN DEFAULT false,
  category_type INTEGER,
  marital_stat VARCHAR(10),
  flex_dept_acct_type VARCHAR(50),
  state_udf VARCHAR(255),
  office_code VARCHAR(50),
  checked VARCHAR(10),
  inserted_by INTEGER,
  inserted_on TIMESTAMP WITH TIME ZONE DEFAULT now(),
  inserted_machine_info VARCHAR(255),
  updated_by INTEGER,
  updated_on TIMESTAMP WITH TIME ZONE,
  updated_machine_info VARCHAR(255)
);

CREATE INDEX idx_c3_employee_company ON c3_master_employee(company_id);
CREATE INDEX idx_c3_employee_ssn ON c3_master_employee(soc_sec_num);
CREATE INDEX idx_c3_employee_active ON c3_master_employee(is_active);

-- =====================================================
-- 2. EMPLOYEE TYPES (MasterEmpType)
-- =====================================================
CREATE TABLE IF NOT EXISTS c3_master_emp_type (
  emp_type_id BIGSERIAL PRIMARY KEY,
  emp_type_name VARCHAR(100) NOT NULL,
  description TEXT,
  is_active BOOLEAN DEFAULT true,
  inserted_by INTEGER,
  inserted_on TIMESTAMP WITH TIME ZONE DEFAULT now(),
  inserted_machine_info VARCHAR(255),
  updated_by INTEGER,
  updated_on TIMESTAMP WITH TIME ZONE,
  updated_machine_info VARCHAR(255)
);

-- =====================================================
-- 3. EMPLOYER CODES (MasterEmployerCodes)
-- =====================================================
CREATE TABLE IF NOT EXISTS c3_master_employer_codes (
  employer_code_id BIGSERIAL PRIMARY KEY,
  company_id INTEGER REFERENCES c3_master_company(company_id),
  code VARCHAR(50),
  description TEXT,
  is_active BOOLEAN DEFAULT true,
  inserted_by INTEGER,
  inserted_on TIMESTAMP WITH TIME ZONE DEFAULT now(),
  inserted_machine_info VARCHAR(255),
  updated_by INTEGER,
  updated_on TIMESTAMP WITH TIME ZONE,
  updated_machine_info VARCHAR(255)
);

-- =====================================================
-- 4. C3 HEADER (PROCESS_C3Header) - Main C3 Form
-- =====================================================
CREATE TABLE IF NOT EXISTS c3_process_c3_header (
  c3_header_id BIGSERIAL PRIMARY KEY,
  company_id INTEGER REFERENCES c3_master_company(company_id),
  reg_number VARCHAR(50),
  period_month VARCHAR(10),
  period_year VARCHAR(10),
  total_wages NUMERIC(18,4) DEFAULT 0,
  total_contributions NUMERIC(18,4) DEFAULT 0,
  total_fine NUMERIC(18,4) DEFAULT 0,
  total_ss_contribution NUMERIC(18,4) DEFAULT 0,
  total_ss_penalty NUMERIC(18,4) DEFAULT 0,
  total_levy NUMERIC(18,4) DEFAULT 0,
  total_levy_penalty NUMERIC(18,4) DEFAULT 0,
  total_severance NUMERIC(18,4) DEFAULT 0,
  total_severance_penalty NUMERIC(18,4) DEFAULT 0,
  total_er_ss NUMERIC(18,4) DEFAULT 0,
  total_ee_ss NUMERIC(18,4) DEFAULT 0,
  total_er_levy NUMERIC(18,4) DEFAULT 0,
  total_ee_levy NUMERIC(18,4) DEFAULT 0,
  grand_total NUMERIC(18,4) DEFAULT 0,
  amount_paid NUMERIC(18,4) DEFAULT 0,
  balance_due NUMERIC(18,4) DEFAULT 0,
  remarks TEXT,
  schedule_no INTEGER DEFAULT 1,
  is_finalized BOOLEAN DEFAULT false,
  is_submitted BOOLEAN DEFAULT false,
  is_unlocked BOOLEAN DEFAULT false,
  c3_submitted_date TIMESTAMP WITH TIME ZONE,
  c3_submitted_by INTEGER,
  c3_finalized_date TIMESTAMP WITH TIME ZONE,
  c3_finalized_by INTEGER,
  is_import_from_bema BOOLEAN DEFAULT false,
  error_desc TEXT,
  is_sent_for_edit BOOLEAN DEFAULT false,
  edit_permitted_by INTEGER,
  sent_on_for_edit TIMESTAMP WITH TIME ZONE,
  bima_submit_response TEXT,
  notes TEXT,
  inserted_by INTEGER,
  insert_datetime_info TIMESTAMP WITH TIME ZONE DEFAULT now(),
  insert_machine_info VARCHAR(255),
  modified_by INTEGER,
  modified_on TIMESTAMP WITH TIME ZONE,
  modified_machine_info VARCHAR(255),
  print_by INTEGER,
  print_datetime_info TIMESTAMP WITH TIME ZONE,
  export_by INTEGER,
  export_on TIMESTAMP WITH TIME ZONE
);

CREATE INDEX idx_c3_header_company ON c3_process_c3_header(company_id);
CREATE INDEX idx_c3_header_period ON c3_process_c3_header(period_year, period_month);
CREATE INDEX idx_c3_header_submitted ON c3_process_c3_header(is_submitted);

-- =====================================================
-- 5. C3 CONTRIBUTIONS (Process_Contributions) - C3 Details
-- =====================================================
CREATE TABLE IF NOT EXISTS c3_process_contributions (
  contribution_id BIGSERIAL PRIMARY KEY,
  c3_header_id BIGINT REFERENCES c3_process_c3_header(c3_header_id),
  company_id INTEGER,
  employee_id BIGINT,
  soc_sec_num VARCHAR(50),
  employee_name VARCHAR(255),
  period_month VARCHAR(10),
  period_year VARCHAR(10),
  total_wages NUMERIC(18,4) DEFAULT 0,
  insurable_wages NUMERIC(18,4) DEFAULT 0,
  ss_ee_contribution NUMERIC(18,4) DEFAULT 0,
  ss_er_contribution NUMERIC(18,4) DEFAULT 0,
  ss_total NUMERIC(18,4) DEFAULT 0,
  ss_penalty NUMERIC(18,4) DEFAULT 0,
  levy_ee NUMERIC(18,4) DEFAULT 0,
  levy_er NUMERIC(18,4) DEFAULT 0,
  levy_total NUMERIC(18,4) DEFAULT 0,
  levy_penalty NUMERIC(18,4) DEFAULT 0,
  severance NUMERIC(18,4) DEFAULT 0,
  severance_penalty NUMERIC(18,4) DEFAULT 0,
  total_contribution NUMERIC(18,4) DEFAULT 0,
  total_penalty NUMERIC(18,4) DEFAULT 0,
  grand_total NUMERIC(18,4) DEFAULT 0,
  weeks_worked INTEGER DEFAULT 0,
  days_worked INTEGER DEFAULT 0,
  hours_worked NUMERIC(10,2) DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  is_director_only BOOLEAN DEFAULT false,
  is_employee_director BOOLEAN DEFAULT false,
  is_levy_exempt BOOLEAN DEFAULT false,
  birth_date TIMESTAMP WITH TIME ZONE,
  wage_category_id INTEGER,
  remarks TEXT,
  inserted_by INTEGER,
  inserted_on TIMESTAMP WITH TIME ZONE DEFAULT now(),
  inserted_machine_info VARCHAR(255),
  updated_by INTEGER,
  updated_on TIMESTAMP WITH TIME ZONE,
  updated_machine_info VARCHAR(255)
);

CREATE INDEX idx_c3_contrib_header ON c3_process_contributions(c3_header_id);
CREATE INDEX idx_c3_contrib_employee ON c3_process_contributions(employee_id);
CREATE INDEX idx_c3_contrib_period ON c3_process_contributions(period_year, period_month);

-- =====================================================
-- 6. SELF-EMPLOYED C3 (PROCESS_Self_EmployedC3)
-- =====================================================
CREATE TABLE IF NOT EXISTS c3_process_self_employed_c3 (
  sec3_id BIGSERIAL PRIMARY KEY,
  ssn VARCHAR(50),
  period_month VARCHAR(10),
  period_year VARCHAR(10),
  total_wages NUMERIC(18,4) DEFAULT 0,
  total_contributions NUMERIC(18,4) DEFAULT 0,
  total_fine NUMERIC(18,4) DEFAULT 0,
  category_type VARCHAR(50),
  wages1 NUMERIC(18,4) DEFAULT 0,
  wages2 NUMERIC(18,4) DEFAULT 0,
  wages3 NUMERIC(18,4) DEFAULT 0,
  wages4 NUMERIC(18,4) DEFAULT 0,
  wages5 NUMERIC(18,4) DEFAULT 0,
  selected_type_week1 INTEGER DEFAULT 1,
  selected_type_week2 INTEGER DEFAULT 1,
  selected_type_week3 INTEGER DEFAULT 1,
  selected_type_week4 INTEGER DEFAULT 1,
  selected_type_week5 INTEGER DEFAULT 0,
  week1 INTEGER DEFAULT 1,
  week2 INTEGER DEFAULT 1,
  week3 INTEGER DEFAULT 1,
  week4 INTEGER DEFAULT 1,
  week5 INTEGER DEFAULT 0,
  remarks TEXT,
  schedule_no INTEGER DEFAULT 1,
  is_finalized BOOLEAN DEFAULT false,
  is_submitted BOOLEAN DEFAULT false,
  c3_submitted_date TIMESTAMP WITH TIME ZONE,
  c3_submitted_by INTEGER,
  c3_is_finalized BOOLEAN DEFAULT false,
  c3_finalized_date TIMESTAMP WITH TIME ZONE,
  c3_finalized_by INTEGER,
  is_unlocked BOOLEAN DEFAULT false,
  error_desc TEXT,
  is_import_from_bema BOOLEAN DEFAULT false,
  user_name VARCHAR(255),
  is_sent_for_edit BOOLEAN DEFAULT false,
  edit_permitted_by INTEGER,
  sent_on_for_edit TIMESTAMP WITH TIME ZONE,
  bima_submit_response TEXT,
  notes TEXT,
  inserted_by INTEGER,
  insert_datetime_info TIMESTAMP WITH TIME ZONE DEFAULT now(),
  insert_machine_info VARCHAR(255),
  modified_by INTEGER,
  modified_on TIMESTAMP WITH TIME ZONE,
  modified_machine_info VARCHAR(255),
  print_by INTEGER,
  print_datetime_info TIMESTAMP WITH TIME ZONE,
  export_by INTEGER,
  export_on TIMESTAMP WITH TIME ZONE
);

CREATE INDEX idx_c3_self_emp_ssn ON c3_process_self_employed_c3(ssn);
CREATE INDEX idx_c3_self_emp_period ON c3_process_self_employed_c3(period_year, period_month);

-- =====================================================
-- 7. ONLINE PAYMENTS (OnlinePayments)
-- =====================================================
CREATE TABLE IF NOT EXISTS c3_online_payments (
  id BIGSERIAL PRIMARY KEY,
  system_trans_id VARCHAR(100),
  system_key VARCHAR(100),
  payment_id VARCHAR(100),
  payment_gateway_transaction_id VARCHAR(100),
  currency VARCHAR(10) DEFAULT 'XCD',
  payment_payer_id VARCHAR(100),
  create_time VARCHAR(100),
  description TEXT,
  payment_amount NUMERIC(18,2) DEFAULT 0,
  exchange_rate NUMERIC(18,6),
  payment_amount_usd NUMERIC(18,2),
  from_account_amount NUMERIC(18,2),
  payment_status VARCHAR(50),
  message TEXT,
  user_id INTEGER,
  renewal_year INTEGER,
  transaction_type_id INTEGER DEFAULT 1,
  debit_transaction_id INTEGER,
  credit_transaction_id INTEGER,
  c3_header_id BIGINT,
  transaction_for VARCHAR(50),
  ref_customer_name VARCHAR(255),
  reason_for_payment TEXT,
  notes TEXT,
  old_system_id VARCHAR(100),
  created_by INTEGER,
  created_on TIMESTAMP WITH TIME ZONE DEFAULT now(),
  modified_by INTEGER,
  modified_on TIMESTAMP WITH TIME ZONE,
  is_active BOOLEAN DEFAULT true,
  source_data TEXT,
  is_reconciled BOOLEAN DEFAULT false,
  reconciled_by INTEGER,
  reconciled_on TIMESTAMP WITH TIME ZONE,
  bank_name VARCHAR(100),
  check_num VARCHAR(50),
  check_date TIMESTAMP WITH TIME ZONE,
  jv_number VARCHAR(50),
  jv_date TIMESTAMP WITH TIME ZONE,
  need_to_pay NUMERIC(18,2),
  transaction_date TIMESTAMP WITH TIME ZONE,
  bima_ref_num VARCHAR(100),
  mode VARCHAR(50),
  header_id INTEGER,
  card_number VARCHAR(50),
  card_month_expiry VARCHAR(20),
  card_holder_name VARCHAR(100),
  cvv VARCHAR(10),
  api_response TEXT,
  is_card_view BOOLEAN DEFAULT false,
  card_type VARCHAR(50),
  total_ss_contributions NUMERIC(18,2) DEFAULT 0,
  total_ss_penalty NUMERIC(18,2) DEFAULT 0,
  total_servayance NUMERIC(18,2) DEFAULT 0,
  total_pe_penalty NUMERIC(18,2) DEFAULT 0,
  total_leavy NUMERIC(18,2) DEFAULT 0,
  total_levyee_penalty NUMERIC(18,2) DEFAULT 0,
  bima_receipt_number VARCHAR(100),
  bima_payment_response TEXT
);

CREATE INDEX idx_payments_user ON c3_online_payments(user_id);
CREATE INDEX idx_payments_status ON c3_online_payments(payment_status);
CREATE INDEX idx_payments_c3 ON c3_online_payments(c3_header_id);

-- =====================================================
-- 8. BANK PAYMENTS (BankPaymentsMain)
-- =====================================================
CREATE TABLE IF NOT EXISTS c3_bank_payments_main (
  id BIGSERIAL PRIMARY KEY,
  company_id INTEGER,
  bank_name VARCHAR(100),
  check_number VARCHAR(50),
  check_date TIMESTAMP WITH TIME ZONE,
  amount NUMERIC(18,2) DEFAULT 0,
  is_active BOOLEAN DEFAULT true
);

-- =====================================================
-- 9. USER CARD DETAILS (UserCardDetail)
-- =====================================================
CREATE TABLE IF NOT EXISTS c3_user_card_detail (
  id BIGSERIAL PRIMARY KEY,
  user_id INTEGER,
  card_number VARCHAR(50),
  card_holder_name VARCHAR(100),
  card_expiry VARCHAR(20),
  card_type VARCHAR(50),
  is_default BOOLEAN DEFAULT false,
  is_active BOOLEAN DEFAULT true,
  inserted_on TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_on TIMESTAMP WITH TIME ZONE
);

-- =====================================================
-- 10. DEDUCTIONS TAX TABLE HEADER (Deductions_Tax_Table_Header)
-- =====================================================
CREATE TABLE IF NOT EXISTS c3_deductions_tax_table_header (
  tax_tab_hid BIGSERIAL PRIMARY KEY,
  tax_year VARCHAR(10),
  ded_code VARCHAR(50),
  week_allow NUMERIC(18,3),
  biweek_allow NUMERIC(18,3),
  smonth_allow NUMERIC(18,3),
  month_allow NUMERIC(18,3),
  quarter_allow NUMERIC(18,3),
  syear_allow NUMERIC(18,3),
  year_allow NUMERIC(18,3),
  misc_allow NUMERIC(18,3),
  hrs_week_allow NUMERIC(18,3),
  hrs_biweek_allow NUMERIC(18,3),
  hrs_smonth_allow NUMERIC(18,3),
  hrs_month_allow NUMERIC(18,3),
  hrs_quarter_allow NUMERIC(18,3),
  hrs_syear_allow NUMERIC(18,3),
  hrs_year_allow NUMERIC(18,3),
  hrs_misc_allow NUMERIC(18,3),
  allow_or_limit VARCHAR(50),
  start_date TIMESTAMP WITH TIME ZONE,
  end_date TIMESTAMP WITH TIME ZONE
);

-- =====================================================
-- 11. DEDUCTIONS TAX TABLE DETAILS (Deductions_Tax_Table_Details)
-- =====================================================
CREATE TABLE IF NOT EXISTS c3_deductions_tax_table_details (
  tax_tab_id BIGSERIAL PRIMARY KEY,
  tax_header_id BIGINT REFERENCES c3_deductions_tax_table_header(tax_tab_hid),
  tax_year VARCHAR(10),
  ded_code VARCHAR(50),
  pay_period VARCHAR(10),
  marital_stat VARCHAR(10),
  over_amt NUMERIC(18,3) DEFAULT 0,
  base_amt NUMERIC(18,3) DEFAULT 0,
  tax_rate NUMERIC(18,3) DEFAULT 0,
  order_no INTEGER DEFAULT 1
);

CREATE INDEX idx_tax_details_header ON c3_deductions_tax_table_details(tax_header_id);
CREATE INDEX idx_tax_details_year ON c3_deductions_tax_table_details(tax_year);

-- =====================================================
-- 12. DECEMBER BONUS EXEMPTED CONTRIBUTION
-- =====================================================
CREATE TABLE IF NOT EXISTS c3_december_bonus_exempted_contribution (
  dbs_id BIGSERIAL PRIMARY KEY,
  is_exempted_levy BOOLEAN DEFAULT false,
  is_exempted_employer_levy BOOLEAN DEFAULT false,
  is_exempted_severance BOOLEAN DEFAULT false,
  is_exempted_social_security BOOLEAN DEFAULT false,
  month_no INTEGER,
  year NUMERIC(18,0),
  is_locked BOOLEAN DEFAULT false,
  deletable BOOLEAN DEFAULT true,
  inserted_by INTEGER,
  inserted_on TIMESTAMP WITH TIME ZONE DEFAULT now(),
  inserted_machine_info VARCHAR(255),
  updated_by INTEGER,
  updated_on TIMESTAMP WITH TIME ZONE,
  updated_machine_info VARCHAR(255)
);

-- =====================================================
-- 13. BONUS PAY DETAILS (BonusPayDetails)
-- =====================================================
CREATE TABLE IF NOT EXISTS c3_bonus_pay_details (
  bonus_pay_id BIGSERIAL PRIMARY KEY,
  employee_id BIGINT,
  company_id INTEGER,
  amount NUMERIC(18,4) DEFAULT 0,
  start_date TIMESTAMP WITH TIME ZONE,
  end_date TIMESTAMP WITH TIME ZONE,
  bonus_pay_date TIMESTAMP WITH TIME ZONE,
  pay_no_of_times INTEGER DEFAULT 1,
  employee_details VARCHAR(255),
  period_month VARCHAR(10),
  period_year VARCHAR(10),
  inserted_by INTEGER,
  inserted_on TIMESTAMP WITH TIME ZONE DEFAULT now(),
  inserted_machine_info VARCHAR(255),
  updated_by INTEGER,
  updated_on TIMESTAMP WITH TIME ZONE,
  updated_machine_info VARCHAR(255)
);

CREATE INDEX idx_bonus_employee ON c3_bonus_pay_details(employee_id);
CREATE INDEX idx_bonus_company ON c3_bonus_pay_details(company_id);

-- =====================================================
-- 14. HOLIDAY PAY DATES (HolidayPayDates)
-- =====================================================
CREATE TABLE IF NOT EXISTS c3_holiday_pay_dates (
  id BIGSERIAL PRIMARY KEY,
  holiday_pay_id BIGINT,
  employee_id BIGINT,
  company_id INTEGER,
  amount NUMERIC(18,4) DEFAULT 0,
  holiday_pay_date TIMESTAMP WITH TIME ZONE
);

CREATE INDEX idx_holiday_dates_pay ON c3_holiday_pay_dates(holiday_pay_id);

-- =====================================================
-- 15. MASTER HOLIDAY PAY DETAILS (MasterHolidayPayDetails)
-- =====================================================
CREATE TABLE IF NOT EXISTS c3_master_holiday_pay_details (
  holiday_pay_id BIGSERIAL PRIMARY KEY,
  employee_id BIGINT,
  company_id INTEGER,
  amount NUMERIC(18,4) DEFAULT 0,
  start_date TIMESTAMP WITH TIME ZONE,
  end_date TIMESTAMP WITH TIME ZONE,
  pay_no_of_times INTEGER DEFAULT 1,
  employee_details VARCHAR(255),
  is_without_leave BOOLEAN DEFAULT false,
  period_month VARCHAR(10),
  period_year VARCHAR(10),
  other_hpay_des TEXT,
  inserted_by INTEGER,
  inserted_on TIMESTAMP WITH TIME ZONE DEFAULT now(),
  inserted_machine_info VARCHAR(255),
  updated_by INTEGER,
  updated_on TIMESTAMP WITH TIME ZONE,
  updated_machine_info VARCHAR(255)
);

CREATE INDEX idx_holiday_pay_employee ON c3_master_holiday_pay_details(employee_id);
CREATE INDEX idx_holiday_pay_company ON c3_master_holiday_pay_details(company_id);

-- =====================================================
-- 16. SEC MODULE (SECModule) - Menu/Permissions
-- =====================================================
CREATE TABLE IF NOT EXISTS c3_sec_module (
  module_id BIGSERIAL PRIMARY KEY,
  module VARCHAR(100) NOT NULL,
  description TEXT,
  level INTEGER DEFAULT 0,
  parent_id INTEGER DEFAULT 0,
  form_name VARCHAR(100),
  module_type_id INTEGER DEFAULT 1,
  option VARCHAR(100),
  page_url VARCHAR(255),
  icon VARCHAR(100),
  is_active BOOLEAN DEFAULT true,
  inserted_by INTEGER,
  inserted_on TIMESTAMP WITH TIME ZONE DEFAULT now(),
  inserted_machine_info VARCHAR(255),
  updated_by INTEGER,
  updated_on TIMESTAMP WITH TIME ZONE,
  updated_machine_info VARCHAR(255)
);

-- =====================================================
-- 17. SEC USER MODULE (SECUserModule) - User Permissions
-- =====================================================
CREATE TABLE IF NOT EXISTS c3_sec_user_module (
  user_module_id BIGSERIAL PRIMARY KEY,
  user_id INTEGER,
  role_id INTEGER REFERENCES c3_sec_role(role_id),
  module_id BIGINT REFERENCES c3_sec_module(module_id),
  add_permission BOOLEAN DEFAULT false,
  update_permission BOOLEAN DEFAULT false,
  delete_permission BOOLEAN DEFAULT false,
  view_permission BOOLEAN DEFAULT true,
  find_permission BOOLEAN DEFAULT false,
  browse_permission BOOLEAN DEFAULT false,
  is_submitted BOOLEAN DEFAULT false,
  is_print BOOLEAN DEFAULT false,
  is_preview BOOLEAN DEFAULT false,
  is_pay BOOLEAN DEFAULT false,
  is_wages BOOLEAN DEFAULT false,
  is_active BOOLEAN DEFAULT true,
  inserted_by INTEGER,
  inserted_on TIMESTAMP WITH TIME ZONE DEFAULT now(),
  inserted_machine_info VARCHAR(255),
  updated_by INTEGER,
  updated_on TIMESTAMP WITH TIME ZONE,
  updated_machine_info VARCHAR(255)
);

CREATE INDEX idx_sec_user_module_user ON c3_sec_user_module(user_id);
CREATE INDEX idx_sec_user_module_role ON c3_sec_user_module(role_id);

-- =====================================================
-- 18. USER PERMISSION (UserPermission)
-- =====================================================
CREATE TABLE IF NOT EXISTS c3_user_permission (
  id BIGSERIAL PRIMARY KEY,
  user_id INTEGER,
  permission_name VARCHAR(100),
  permission_value BOOLEAN DEFAULT false,
  is_active BOOLEAN DEFAULT true
);

CREATE INDEX idx_user_perm_user ON c3_user_permission(user_id);

-- =====================================================
-- 19. USERS PROFILE (SECUsersProfile)
-- =====================================================
CREATE TABLE IF NOT EXISTS c3_sec_users_profile (
  profile_id BIGSERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES c3_sec_users(user_id),
  security_question VARCHAR(255),
  security_answer VARCHAR(255),
  phone VARCHAR(50),
  mobile VARCHAR(50),
  address VARCHAR(255),
  city VARCHAR(100),
  state VARCHAR(100),
  country VARCHAR(100),
  zip VARCHAR(20),
  inserted_on TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_on TIMESTAMP WITH TIME ZONE
);

-- =====================================================
-- 20. SECURITY QUESTION ANSWER (SecurityQuestionAnswer)
-- =====================================================
CREATE TABLE IF NOT EXISTS c3_security_question_answer (
  id BIGSERIAL PRIMARY KEY,
  user_id INTEGER,
  question1 VARCHAR(255),
  answer1 VARCHAR(255),
  question2 VARCHAR(255),
  answer2 VARCHAR(255),
  question3 VARCHAR(255),
  answer3 VARCHAR(255),
  is_active BOOLEAN DEFAULT true,
  inserted_by INTEGER,
  inserted_on TIMESTAMP WITH TIME ZONE DEFAULT now(),
  inserted_machine_info VARCHAR(255),
  updated_by INTEGER,
  updated_on TIMESTAMP WITH TIME ZONE,
  updated_machine_info VARCHAR(255)
);

-- =====================================================
-- 21. USER OTP (UserOtp)
-- =====================================================
CREATE TABLE IF NOT EXISTS c3_user_otp (
  id BIGSERIAL PRIMARY KEY,
  user_id INTEGER,
  otp_code VARCHAR(20),
  expires_at TIMESTAMP WITH TIME ZONE,
  is_used BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- =====================================================
-- 22. AUDIT LOGS (AuditLogs)
-- =====================================================
CREATE TABLE IF NOT EXISTS c3_audit_logs (
  audit_id BIGSERIAL PRIMARY KEY,
  user_id INTEGER,
  user_name VARCHAR(255),
  action VARCHAR(100),
  module VARCHAR(100),
  table_name VARCHAR(100),
  record_id VARCHAR(100),
  old_values TEXT,
  new_values TEXT,
  ip_address VARCHAR(50),
  machine_info VARCHAR(255),
  browser_info VARCHAR(255),
  description TEXT,
  action_date TIMESTAMP WITH TIME ZONE DEFAULT now(),
  company_id INTEGER,
  reg_number VARCHAR(50),
  employee_id BIGINT,
  c3_header_id BIGINT,
  period_month VARCHAR(10),
  period_year VARCHAR(10),
  is_active BOOLEAN DEFAULT true
);

CREATE INDEX idx_audit_user ON c3_audit_logs(user_id);
CREATE INDEX idx_audit_action ON c3_audit_logs(action);
CREATE INDEX idx_audit_date ON c3_audit_logs(action_date);

-- =====================================================
-- 23. ERROR LOG (ErrorLog)
-- =====================================================
CREATE TABLE IF NOT EXISTS c3_error_log (
  id BIGSERIAL PRIMARY KEY,
  error_time TIMESTAMP WITH TIME ZONE DEFAULT now(),
  error_message TEXT,
  error_stack TEXT,
  user_id INTEGER,
  page_url VARCHAR(255)
);

-- =====================================================
-- 24. CUSTOM ERROR LOGS (CustomErrorLogs)
-- =====================================================
CREATE TABLE IF NOT EXISTS c3_custom_error_logs (
  id BIGSERIAL PRIMARY KEY,
  error_date TIMESTAMP WITH TIME ZONE DEFAULT now(),
  error_message TEXT,
  error_type VARCHAR(100),
  stack_trace TEXT,
  user_id INTEGER,
  machine_info VARCHAR(255)
);

-- =====================================================
-- 25. EXCEPTION LOG (Exception_log)
-- =====================================================
CREATE TABLE IF NOT EXISTS c3_exception_log (
  id BIGSERIAL PRIMARY KEY,
  exception_date TIMESTAMP WITH TIME ZONE DEFAULT now(),
  exception_message TEXT,
  exception_type VARCHAR(100),
  inner_exception TEXT,
  stack_trace TEXT,
  method_name VARCHAR(255),
  source VARCHAR(255),
  user_id INTEGER,
  machine_info VARCHAR(255),
  additional_info TEXT
);

-- =====================================================
-- 26. ABOUT US (AboutUs)
-- =====================================================
CREATE TABLE IF NOT EXISTS c3_about_us (
  id BIGSERIAL PRIMARY KEY,
  content TEXT
);

-- =====================================================
-- 27. SITE SETTINGS (SiteSettings)
-- =====================================================
CREATE TABLE IF NOT EXISTS c3_site_settings (
  id BIGSERIAL PRIMARY KEY,
  setting_key VARCHAR(100) UNIQUE,
  setting_value TEXT,
  description TEXT,
  setting_type VARCHAR(50),
  is_active BOOLEAN DEFAULT true,
  inserted_by INTEGER,
  inserted_on TIMESTAMP WITH TIME ZONE DEFAULT now(),
  inserted_machine_info VARCHAR(255),
  updated_by INTEGER,
  updated_on TIMESTAMP WITH TIME ZONE,
  updated_machine_info VARCHAR(255)
);

-- =====================================================
-- 28. SELF EMPLOYED SETTINGS (Self_Employed_Settings)
-- =====================================================
CREATE TABLE IF NOT EXISTS c3_self_employed_settings (
  id BIGSERIAL PRIMARY KEY,
  setting_key VARCHAR(100),
  setting_value TEXT,
  description TEXT,
  is_active BOOLEAN DEFAULT true
);

-- =====================================================
-- 29. NWD MASTER RATE SETTINGS (NWD_Master_Rate_Settings)
-- =====================================================
CREATE TABLE IF NOT EXISTS c3_nwd_master_rate_settings (
  id BIGSERIAL PRIMARY KEY,
  rate_type VARCHAR(50),
  rate_value NUMERIC(18,4) DEFAULT 0,
  from_date TIMESTAMP WITH TIME ZONE,
  to_date TIMESTAMP WITH TIME ZONE,
  is_active BOOLEAN DEFAULT true,
  inserted_by INTEGER,
  inserted_on TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_by INTEGER,
  updated_on TIMESTAMP WITH TIME ZONE
);

-- =====================================================
-- 30. COUNTRY (Country)
-- =====================================================
CREATE TABLE IF NOT EXISTS c3_country (
  country_id BIGSERIAL PRIMARY KEY,
  country_code VARCHAR(10),
  country_name VARCHAR(100),
  phone_code VARCHAR(20),
  is_active BOOLEAN DEFAULT true,
  inserted_by INTEGER,
  inserted_on TIMESTAMP WITH TIME ZONE DEFAULT now(),
  inserted_machine_info VARCHAR(255),
  updated_by INTEGER,
  updated_on TIMESTAMP WITH TIME ZONE,
  updated_machine_info VARCHAR(255)
);

-- =====================================================
-- 31. STATE (State)
-- =====================================================
CREATE TABLE IF NOT EXISTS c3_state (
  state_id BIGSERIAL PRIMARY KEY,
  country_id BIGINT REFERENCES c3_country(country_id),
  state_code VARCHAR(10),
  state_name VARCHAR(100),
  is_active BOOLEAN DEFAULT true,
  inserted_by INTEGER,
  inserted_on TIMESTAMP WITH TIME ZONE DEFAULT now(),
  inserted_machine_info VARCHAR(255),
  updated_by INTEGER,
  updated_on TIMESTAMP WITH TIME ZONE,
  updated_machine_info VARCHAR(255)
);

-- =====================================================
-- 32. CITY (City)
-- =====================================================
CREATE TABLE IF NOT EXISTS c3_city (
  city_id BIGSERIAL PRIMARY KEY,
  state_id BIGINT REFERENCES c3_state(state_id),
  city_code VARCHAR(10),
  city_name VARCHAR(100),
  is_active BOOLEAN DEFAULT true,
  inserted_by INTEGER,
  inserted_on TIMESTAMP WITH TIME ZONE DEFAULT now(),
  inserted_machine_info VARCHAR(255),
  updated_by INTEGER,
  updated_on TIMESTAMP WITH TIME ZONE,
  updated_machine_info VARCHAR(255)
);

-- =====================================================
-- 33. INCOME CODES (MasterIncCodes)
-- =====================================================
CREATE TABLE IF NOT EXISTS c3_master_inc_codes (
  inc_code_id BIGSERIAL PRIMARY KEY,
  inc_code VARCHAR(50),
  inc_description TEXT,
  inc_type VARCHAR(50),
  is_taxable BOOLEAN DEFAULT true,
  is_insurable BOOLEAN DEFAULT true,
  is_active BOOLEAN DEFAULT true,
  inserted_by INTEGER,
  inserted_on TIMESTAMP WITH TIME ZONE DEFAULT now(),
  inserted_machine_info VARCHAR(255),
  updated_by INTEGER,
  updated_on TIMESTAMP WITH TIME ZONE,
  updated_machine_info VARCHAR(255)
);

-- =====================================================
-- 34. DEDUCTION CODES (MasterDeductionCodes)
-- =====================================================
CREATE TABLE IF NOT EXISTS c3_master_deduction_codes (
  ded_code_id BIGSERIAL PRIMARY KEY,
  ded_code VARCHAR(50),
  ded_description TEXT,
  ded_type VARCHAR(50),
  is_pretax BOOLEAN DEFAULT false,
  is_active BOOLEAN DEFAULT true,
  inserted_by INTEGER,
  inserted_on TIMESTAMP WITH TIME ZONE DEFAULT now(),
  inserted_machine_info VARCHAR(255),
  updated_by INTEGER,
  updated_on TIMESTAMP WITH TIME ZONE,
  updated_machine_info VARCHAR(255)
);

-- =====================================================
-- 35. OBLIGATION CODES (MasterObligationCodes)
-- =====================================================
CREATE TABLE IF NOT EXISTS c3_master_obligation_codes (
  obl_code_id BIGSERIAL PRIMARY KEY,
  obl_code VARCHAR(50),
  obl_description TEXT,
  is_active BOOLEAN DEFAULT true,
  inserted_by INTEGER,
  inserted_on TIMESTAMP WITH TIME ZONE DEFAULT now(),
  inserted_machine_info VARCHAR(255),
  updated_by INTEGER,
  updated_on TIMESTAMP WITH TIME ZONE,
  updated_machine_info VARCHAR(255)
);

-- =====================================================
-- 36. EMPLOYEE INCOMES (MasterEmployeeIncomes)
-- =====================================================
CREATE TABLE IF NOT EXISTS c3_master_employee_incomes (
  id BIGSERIAL PRIMARY KEY,
  employee_id BIGINT,
  inc_code_id BIGINT,
  amount NUMERIC(18,4) DEFAULT 0,
  effective_date TIMESTAMP WITH TIME ZONE,
  end_date TIMESTAMP WITH TIME ZONE,
  is_active BOOLEAN DEFAULT true,
  inserted_by INTEGER,
  inserted_on TIMESTAMP WITH TIME ZONE DEFAULT now(),
  inserted_machine_info VARCHAR(255),
  updated_by INTEGER,
  updated_on TIMESTAMP WITH TIME ZONE,
  updated_machine_info VARCHAR(255)
);

-- =====================================================
-- 37. EMPLOYEE DEDUCTIONS (MasterEmployeeDeductions)
-- =====================================================
CREATE TABLE IF NOT EXISTS c3_master_employee_deductions (
  id BIGSERIAL PRIMARY KEY,
  employee_id BIGINT,
  ded_code_id BIGINT,
  amount NUMERIC(18,4) DEFAULT 0,
  percentage NUMERIC(10,4) DEFAULT 0,
  effective_date TIMESTAMP WITH TIME ZONE,
  end_date TIMESTAMP WITH TIME ZONE,
  is_active BOOLEAN DEFAULT true,
  inserted_by INTEGER,
  inserted_on TIMESTAMP WITH TIME ZONE DEFAULT now(),
  inserted_machine_info VARCHAR(255),
  updated_by INTEGER,
  updated_on TIMESTAMP WITH TIME ZONE,
  updated_machine_info VARCHAR(255)
);

-- =====================================================
-- 38. EMPLOYEE OBLIGATIONS (MasterEmployeeObligations)
-- =====================================================
CREATE TABLE IF NOT EXISTS c3_master_employee_obligations (
  id BIGSERIAL PRIMARY KEY,
  employee_id BIGINT,
  obl_code_id BIGINT,
  amount NUMERIC(18,4) DEFAULT 0,
  effective_date TIMESTAMP WITH TIME ZONE,
  end_date TIMESTAMP WITH TIME ZONE,
  is_active BOOLEAN DEFAULT true,
  inserted_by INTEGER,
  inserted_on TIMESTAMP WITH TIME ZONE DEFAULT now(),
  inserted_machine_info VARCHAR(255),
  updated_by INTEGER,
  updated_on TIMESTAMP WITH TIME ZONE,
  updated_machine_info VARCHAR(255)
);

-- =====================================================
-- 39. PAYROLL PROCESS HEADER (Payroll_Process_Header)
-- =====================================================
CREATE TABLE IF NOT EXISTS c3_payroll_process_header (
  payroll_id BIGSERIAL PRIMARY KEY,
  company_id INTEGER,
  pay_period VARCHAR(10),
  pay_date TIMESTAMP WITH TIME ZONE,
  period_start_date TIMESTAMP WITH TIME ZONE,
  period_end_date TIMESTAMP WITH TIME ZONE,
  total_gross NUMERIC(18,4) DEFAULT 0,
  total_deductions NUMERIC(18,4) DEFAULT 0,
  total_net NUMERIC(18,4) DEFAULT 0,
  status VARCHAR(50) DEFAULT 'draft',
  is_finalized BOOLEAN DEFAULT false,
  finalized_by INTEGER,
  finalized_on TIMESTAMP WITH TIME ZONE,
  inserted_by INTEGER,
  inserted_on TIMESTAMP WITH TIME ZONE DEFAULT now(),
  inserted_machine_info VARCHAR(255),
  updated_by INTEGER,
  updated_on TIMESTAMP WITH TIME ZONE,
  updated_machine_info VARCHAR(255)
);

-- =====================================================
-- 40. PAYROLL PROCESS DETAILS (Payroll_Process_Details)
-- =====================================================
CREATE TABLE IF NOT EXISTS c3_payroll_process_details (
  id BIGSERIAL PRIMARY KEY,
  payroll_id BIGINT REFERENCES c3_payroll_process_header(payroll_id),
  employee_id BIGINT,
  gross_pay NUMERIC(18,4) DEFAULT 0,
  total_deductions NUMERIC(18,4) DEFAULT 0,
  net_pay NUMERIC(18,4) DEFAULT 0,
  hours_worked NUMERIC(10,2) DEFAULT 0,
  overtime_hours NUMERIC(10,2) DEFAULT 0,
  inserted_by INTEGER,
  inserted_on TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_by INTEGER,
  updated_on TIMESTAMP WITH TIME ZONE
);

-- =====================================================
-- 41. PROCESS PAY EMPLOYEE (Process_PayEmployee)
-- =====================================================
CREATE TABLE IF NOT EXISTS c3_process_pay_employee (
  id BIGSERIAL PRIMARY KEY,
  payroll_id BIGINT,
  employee_id BIGINT,
  company_id INTEGER,
  pay_period VARCHAR(10),
  pay_date TIMESTAMP WITH TIME ZONE,
  regular_hours NUMERIC(10,2) DEFAULT 0,
  overtime_hours NUMERIC(10,2) DEFAULT 0,
  gross_pay NUMERIC(18,4) DEFAULT 0,
  total_deductions NUMERIC(18,4) DEFAULT 0,
  net_pay NUMERIC(18,4) DEFAULT 0,
  ss_ee NUMERIC(18,4) DEFAULT 0,
  ss_er NUMERIC(18,4) DEFAULT 0,
  levy_ee NUMERIC(18,4) DEFAULT 0,
  levy_er NUMERIC(18,4) DEFAULT 0,
  severance NUMERIC(18,4) DEFAULT 0,
  is_processed BOOLEAN DEFAULT false,
  inserted_by INTEGER,
  inserted_on TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_by INTEGER,
  updated_on TIMESTAMP WITH TIME ZONE
);

-- =====================================================
-- 42. PROCESS PAY INCOMES (Process_PayIncomes)
-- =====================================================
CREATE TABLE IF NOT EXISTS c3_process_pay_incomes (
  id BIGSERIAL PRIMARY KEY,
  pay_employee_id BIGINT,
  inc_code_id BIGINT,
  inc_code VARCHAR(50),
  amount NUMERIC(18,4) DEFAULT 0,
  hours NUMERIC(10,2) DEFAULT 0,
  rate NUMERIC(18,4) DEFAULT 0,
  is_taxable BOOLEAN DEFAULT true,
  inserted_on TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- =====================================================
-- 43. PROCESS PAY DEDUCTIONS (Process_PayDeductions)
-- =====================================================
CREATE TABLE IF NOT EXISTS c3_process_pay_deductions (
  id BIGSERIAL PRIMARY KEY,
  pay_employee_id BIGINT,
  ded_code_id BIGINT,
  ded_code VARCHAR(50),
  amount NUMERIC(18,4) DEFAULT 0,
  is_pretax BOOLEAN DEFAULT false,
  inserted_on TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- =====================================================
-- 44. PROCESS PAY OBLIGATIONS (Process_Payobligations)
-- =====================================================
CREATE TABLE IF NOT EXISTS c3_process_pay_obligations (
  id BIGSERIAL PRIMARY KEY,
  pay_employee_id BIGINT,
  obl_code_id BIGINT,
  obl_code VARCHAR(50),
  amount NUMERIC(18,4) DEFAULT 0,
  inserted_on TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- =====================================================
-- 45. WAGES PAY DETAILS (WagesPayDetails)
-- =====================================================
CREATE TABLE IF NOT EXISTS c3_wages_pay_details (
  id BIGSERIAL PRIMARY KEY,
  employee_id BIGINT,
  company_id INTEGER,
  amount NUMERIC(18,4) DEFAULT 0,
  wages_type VARCHAR(50),
  period_month VARCHAR(10),
  period_year VARCHAR(10),
  pay_date TIMESTAMP WITH TIME ZONE,
  pay_no_of_times INTEGER DEFAULT 1,
  employee_details VARCHAR(255),
  inserted_by INTEGER,
  inserted_on TIMESTAMP WITH TIME ZONE DEFAULT now(),
  inserted_machine_info VARCHAR(255),
  updated_by INTEGER,
  updated_on TIMESTAMP WITH TIME ZONE,
  updated_machine_info VARCHAR(255)
);

-- =====================================================
-- 46. EMPLOYEE TCARD HEADER (EmployeeTCard_Header)
-- =====================================================
CREATE TABLE IF NOT EXISTS c3_employee_tcard_header (
  id BIGSERIAL PRIMARY KEY,
  employee_id BIGINT,
  company_id INTEGER,
  period_start TIMESTAMP WITH TIME ZONE,
  period_end TIMESTAMP WITH TIME ZONE,
  total_hours NUMERIC(10,2) DEFAULT 0,
  status VARCHAR(50) DEFAULT 'pending',
  inserted_on TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_on TIMESTAMP WITH TIME ZONE
);

-- =====================================================
-- 47. EMPLOYEE TCARD DETAILS (EmployeeTCard_Details)
-- =====================================================
CREATE TABLE IF NOT EXISTS c3_employee_tcard_details (
  id BIGSERIAL PRIMARY KEY,
  tcard_header_id BIGINT REFERENCES c3_employee_tcard_header(id),
  work_date TIMESTAMP WITH TIME ZONE,
  time_in TIMESTAMP WITH TIME ZONE,
  time_out TIMESTAMP WITH TIME ZONE,
  hours_worked NUMERIC(10,2) DEFAULT 0,
  overtime_hours NUMERIC(10,2) DEFAULT 0,
  break_hours NUMERIC(10,2) DEFAULT 0,
  notes TEXT
);

-- =====================================================
-- 48. EMPLOYEE WORK DURATION DETAILS (EmployeeWorkDurationDetails)
-- =====================================================
CREATE TABLE IF NOT EXISTS c3_employee_work_duration_details (
  id BIGSERIAL PRIMARY KEY,
  employee_id BIGINT,
  company_id INTEGER,
  period_month VARCHAR(10),
  period_year VARCHAR(10),
  weeks_worked INTEGER DEFAULT 0,
  days_worked INTEGER DEFAULT 0,
  hours_worked NUMERIC(10,2) DEFAULT 0,
  overtime_hours NUMERIC(10,2) DEFAULT 0,
  sick_days INTEGER DEFAULT 0,
  vacation_days INTEGER DEFAULT 0,
  inserted_on TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_on TIMESTAMP WITH TIME ZONE
);

-- =====================================================
-- 49. RECONCILIATION CYBER SPACE (Reconciliation_Cyber_Space)
-- =====================================================
CREATE TABLE IF NOT EXISTS c3_reconciliation_cyber_space (
  id BIGSERIAL PRIMARY KEY,
  transaction_id VARCHAR(100),
  payment_id VARCHAR(100),
  amount NUMERIC(18,2) DEFAULT 0,
  currency VARCHAR(10) DEFAULT 'XCD',
  status VARCHAR(50),
  merchant_ref VARCHAR(100),
  create_date TIMESTAMP WITH TIME ZONE,
  auth_code VARCHAR(50),
  card_type VARCHAR(50),
  is_reconciled BOOLEAN DEFAULT false,
  reconciled_date TIMESTAMP WITH TIME ZONE,
  reconciled_by INTEGER,
  notes TEXT,
  raw_data TEXT
);

-- =====================================================
-- 50. RECONCILIATION CYBER SPACE COLUMN
-- =====================================================
CREATE TABLE IF NOT EXISTS c3_reconciliation_cyber_space_column (
  id BIGSERIAL PRIMARY KEY,
  column_name VARCHAR(100),
  column_type VARCHAR(50),
  display_name VARCHAR(100),
  is_visible BOOLEAN DEFAULT true,
  sort_order INTEGER DEFAULT 0
);

-- =====================================================
-- 51. RECONCILIATION PAYMENT DETAILS
-- =====================================================
CREATE TABLE IF NOT EXISTS c3_reconciliation_payment_details (
  id BIGSERIAL PRIMARY KEY,
  reconciliation_id BIGINT,
  payment_id BIGINT,
  matched_amount NUMERIC(18,2) DEFAULT 0,
  difference NUMERIC(18,2) DEFAULT 0,
  status VARCHAR(50),
  notes TEXT,
  created_on TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- =====================================================
-- ENABLE RLS ON ALL NEW TABLES
-- =====================================================
ALTER TABLE c3_master_employee ENABLE ROW LEVEL SECURITY;
ALTER TABLE c3_master_emp_type ENABLE ROW LEVEL SECURITY;
ALTER TABLE c3_master_employer_codes ENABLE ROW LEVEL SECURITY;
ALTER TABLE c3_process_c3_header ENABLE ROW LEVEL SECURITY;
ALTER TABLE c3_process_contributions ENABLE ROW LEVEL SECURITY;
ALTER TABLE c3_process_self_employed_c3 ENABLE ROW LEVEL SECURITY;
ALTER TABLE c3_online_payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE c3_bank_payments_main ENABLE ROW LEVEL SECURITY;
ALTER TABLE c3_user_card_detail ENABLE ROW LEVEL SECURITY;
ALTER TABLE c3_deductions_tax_table_header ENABLE ROW LEVEL SECURITY;
ALTER TABLE c3_deductions_tax_table_details ENABLE ROW LEVEL SECURITY;
ALTER TABLE c3_december_bonus_exempted_contribution ENABLE ROW LEVEL SECURITY;
ALTER TABLE c3_bonus_pay_details ENABLE ROW LEVEL SECURITY;
ALTER TABLE c3_holiday_pay_dates ENABLE ROW LEVEL SECURITY;
ALTER TABLE c3_master_holiday_pay_details ENABLE ROW LEVEL SECURITY;
ALTER TABLE c3_sec_module ENABLE ROW LEVEL SECURITY;
ALTER TABLE c3_sec_user_module ENABLE ROW LEVEL SECURITY;
ALTER TABLE c3_user_permission ENABLE ROW LEVEL SECURITY;
ALTER TABLE c3_sec_users_profile ENABLE ROW LEVEL SECURITY;
ALTER TABLE c3_security_question_answer ENABLE ROW LEVEL SECURITY;
ALTER TABLE c3_user_otp ENABLE ROW LEVEL SECURITY;
ALTER TABLE c3_audit_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE c3_error_log ENABLE ROW LEVEL SECURITY;
ALTER TABLE c3_custom_error_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE c3_exception_log ENABLE ROW LEVEL SECURITY;
ALTER TABLE c3_about_us ENABLE ROW LEVEL SECURITY;
ALTER TABLE c3_site_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE c3_self_employed_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE c3_nwd_master_rate_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE c3_country ENABLE ROW LEVEL SECURITY;
ALTER TABLE c3_state ENABLE ROW LEVEL SECURITY;
ALTER TABLE c3_city ENABLE ROW LEVEL SECURITY;
ALTER TABLE c3_master_inc_codes ENABLE ROW LEVEL SECURITY;
ALTER TABLE c3_master_deduction_codes ENABLE ROW LEVEL SECURITY;
ALTER TABLE c3_master_obligation_codes ENABLE ROW LEVEL SECURITY;
ALTER TABLE c3_master_employee_incomes ENABLE ROW LEVEL SECURITY;
ALTER TABLE c3_master_employee_deductions ENABLE ROW LEVEL SECURITY;
ALTER TABLE c3_master_employee_obligations ENABLE ROW LEVEL SECURITY;
ALTER TABLE c3_payroll_process_header ENABLE ROW LEVEL SECURITY;
ALTER TABLE c3_payroll_process_details ENABLE ROW LEVEL SECURITY;
ALTER TABLE c3_process_pay_employee ENABLE ROW LEVEL SECURITY;
ALTER TABLE c3_process_pay_incomes ENABLE ROW LEVEL SECURITY;
ALTER TABLE c3_process_pay_deductions ENABLE ROW LEVEL SECURITY;
ALTER TABLE c3_process_pay_obligations ENABLE ROW LEVEL SECURITY;
ALTER TABLE c3_wages_pay_details ENABLE ROW LEVEL SECURITY;
ALTER TABLE c3_employee_tcard_header ENABLE ROW LEVEL SECURITY;
ALTER TABLE c3_employee_tcard_details ENABLE ROW LEVEL SECURITY;
ALTER TABLE c3_employee_work_duration_details ENABLE ROW LEVEL SECURITY;
ALTER TABLE c3_reconciliation_cyber_space ENABLE ROW LEVEL SECURITY;
ALTER TABLE c3_reconciliation_cyber_space_column ENABLE ROW LEVEL SECURITY;
ALTER TABLE c3_reconciliation_payment_details ENABLE ROW LEVEL SECURITY;

-- =====================================================
-- RLS POLICIES - Authenticated Read Access for Lookup Tables
-- =====================================================
CREATE POLICY "Allow authenticated read access to employees" ON c3_master_employee FOR SELECT TO authenticated USING (true);
CREATE POLICY "Allow authenticated read access to emp_type" ON c3_master_emp_type FOR SELECT TO authenticated USING (true);
CREATE POLICY "Allow authenticated read access to employer_codes" ON c3_master_employer_codes FOR SELECT TO authenticated USING (true);
CREATE POLICY "Allow authenticated read access to c3_header" ON c3_process_c3_header FOR SELECT TO authenticated USING (true);
CREATE POLICY "Allow authenticated read access to contributions" ON c3_process_contributions FOR SELECT TO authenticated USING (true);
CREATE POLICY "Allow authenticated read access to self_emp_c3" ON c3_process_self_employed_c3 FOR SELECT TO authenticated USING (true);
CREATE POLICY "Allow authenticated read access to payments" ON c3_online_payments FOR SELECT TO authenticated USING (true);
CREATE POLICY "Allow authenticated read access to bank_payments" ON c3_bank_payments_main FOR SELECT TO authenticated USING (true);
CREATE POLICY "Allow authenticated read access to card_detail" ON c3_user_card_detail FOR SELECT TO authenticated USING (true);
CREATE POLICY "Allow authenticated read access to tax_header" ON c3_deductions_tax_table_header FOR SELECT TO authenticated USING (true);
CREATE POLICY "Allow authenticated read access to tax_details" ON c3_deductions_tax_table_details FOR SELECT TO authenticated USING (true);
CREATE POLICY "Allow authenticated read access to dec_bonus" ON c3_december_bonus_exempted_contribution FOR SELECT TO authenticated USING (true);
CREATE POLICY "Allow authenticated read access to bonus_pay" ON c3_bonus_pay_details FOR SELECT TO authenticated USING (true);
CREATE POLICY "Allow authenticated read access to holiday_dates" ON c3_holiday_pay_dates FOR SELECT TO authenticated USING (true);
CREATE POLICY "Allow authenticated read access to holiday_pay" ON c3_master_holiday_pay_details FOR SELECT TO authenticated USING (true);
CREATE POLICY "Allow authenticated read access to modules" ON c3_sec_module FOR SELECT TO authenticated USING (true);
CREATE POLICY "Allow authenticated read access to user_modules" ON c3_sec_user_module FOR SELECT TO authenticated USING (true);
CREATE POLICY "Allow authenticated read access to user_perm" ON c3_user_permission FOR SELECT TO authenticated USING (true);
CREATE POLICY "Allow authenticated read access to profiles" ON c3_sec_users_profile FOR SELECT TO authenticated USING (true);
CREATE POLICY "Allow authenticated read access to sec_qa" ON c3_security_question_answer FOR SELECT TO authenticated USING (true);
CREATE POLICY "Allow authenticated read access to otp" ON c3_user_otp FOR SELECT TO authenticated USING (true);
CREATE POLICY "Allow authenticated read access to audit" ON c3_audit_logs FOR SELECT TO authenticated USING (true);
CREATE POLICY "Allow authenticated read access to error_log" ON c3_error_log FOR SELECT TO authenticated USING (true);
CREATE POLICY "Allow authenticated read access to custom_err" ON c3_custom_error_logs FOR SELECT TO authenticated USING (true);
CREATE POLICY "Allow authenticated read access to exception" ON c3_exception_log FOR SELECT TO authenticated USING (true);
CREATE POLICY "Allow authenticated read access to about" ON c3_about_us FOR SELECT TO authenticated USING (true);
CREATE POLICY "Allow authenticated read access to site_set" ON c3_site_settings FOR SELECT TO authenticated USING (true);
CREATE POLICY "Allow authenticated read access to self_set" ON c3_self_employed_settings FOR SELECT TO authenticated USING (true);
CREATE POLICY "Allow authenticated read access to nwd_rates" ON c3_nwd_master_rate_settings FOR SELECT TO authenticated USING (true);
CREATE POLICY "Allow authenticated read access to country" ON c3_country FOR SELECT TO authenticated USING (true);
CREATE POLICY "Allow authenticated read access to state" ON c3_state FOR SELECT TO authenticated USING (true);
CREATE POLICY "Allow authenticated read access to city" ON c3_city FOR SELECT TO authenticated USING (true);
CREATE POLICY "Allow authenticated read access to inc_codes" ON c3_master_inc_codes FOR SELECT TO authenticated USING (true);
CREATE POLICY "Allow authenticated read access to ded_codes" ON c3_master_deduction_codes FOR SELECT TO authenticated USING (true);
CREATE POLICY "Allow authenticated read access to obl_codes" ON c3_master_obligation_codes FOR SELECT TO authenticated USING (true);
CREATE POLICY "Allow authenticated read access to emp_inc" ON c3_master_employee_incomes FOR SELECT TO authenticated USING (true);
CREATE POLICY "Allow authenticated read access to emp_ded" ON c3_master_employee_deductions FOR SELECT TO authenticated USING (true);
CREATE POLICY "Allow authenticated read access to emp_obl" ON c3_master_employee_obligations FOR SELECT TO authenticated USING (true);
CREATE POLICY "Allow authenticated read access to payroll_h" ON c3_payroll_process_header FOR SELECT TO authenticated USING (true);
CREATE POLICY "Allow authenticated read access to payroll_d" ON c3_payroll_process_details FOR SELECT TO authenticated USING (true);
CREATE POLICY "Allow authenticated read access to pay_emp" ON c3_process_pay_employee FOR SELECT TO authenticated USING (true);
CREATE POLICY "Allow authenticated read access to pay_inc" ON c3_process_pay_incomes FOR SELECT TO authenticated USING (true);
CREATE POLICY "Allow authenticated read access to pay_ded" ON c3_process_pay_deductions FOR SELECT TO authenticated USING (true);
CREATE POLICY "Allow authenticated read access to pay_obl" ON c3_process_pay_obligations FOR SELECT TO authenticated USING (true);
CREATE POLICY "Allow authenticated read access to wages" ON c3_wages_pay_details FOR SELECT TO authenticated USING (true);
CREATE POLICY "Allow authenticated read access to tcard_h" ON c3_employee_tcard_header FOR SELECT TO authenticated USING (true);
CREATE POLICY "Allow authenticated read access to tcard_d" ON c3_employee_tcard_details FOR SELECT TO authenticated USING (true);
CREATE POLICY "Allow authenticated read access to work_dur" ON c3_employee_work_duration_details FOR SELECT TO authenticated USING (true);
CREATE POLICY "Allow authenticated read access to recon_cs" ON c3_reconciliation_cyber_space FOR SELECT TO authenticated USING (true);
CREATE POLICY "Allow authenticated read access to recon_col" ON c3_reconciliation_cyber_space_column FOR SELECT TO authenticated USING (true);
CREATE POLICY "Allow authenticated read access to recon_det" ON c3_reconciliation_payment_details FOR SELECT TO authenticated USING (true);