# 04. Complete Database Schema

**Document Version**: 1.0  
**Last Updated**: January 21, 2026  
**Purpose**: Complete PostgreSQL database schema for C3 Wizard (Supabase → MS-SQL compatible)

---

## Database Naming Conventions

### Tables
- **Prefix**: `c3_` for all C3 Wizard tables
- **Style**: `snake_case`
- **Examples**: `c3_users`, `c3_employees`, `c3_contribution_headers`

### Columns
- **Style**: `snake_case`
- **Audit columns**: Every table MUST have audit columns
- **Soft delete**: Use `is_deleted` boolean (never hard delete)

### Required Audit Columns (All Tables)

```sql
created_at TIMESTAMP DEFAULT NOW(),
created_by INTEGER REFERENCES c3_users(id),
updated_at TIMESTAMP,
updated_by INTEGER REFERENCES c3_users(id),
is_deleted BOOLEAN DEFAULT FALSE
```

---

## Core Tables

### 1. c3_users

**Purpose**: All user accounts (Admin, Employer, Self-Employed)

```sql
CREATE TABLE c3_users (
  id SERIAL PRIMARY KEY,
  
  -- Login Credentials
  login_id VARCHAR(100) UNIQUE NOT NULL,  -- Email or username
  password_hash VARCHAR(255) NOT NULL,     -- Hashed password
  email VARCHAR(255) UNIQUE NOT NULL,
  
  -- Personal Info
  first_name VARCHAR(100) NOT NULL,
  last_name VARCHAR(100) NOT NULL,
  middle_name VARCHAR(100),
  phone VARCHAR(20),
  mobile VARCHAR(20),
  
  -- Role & Status
  role VARCHAR(20) NOT NULL,  -- 'admin', 'employer', 'self_employed'
  is_active BOOLEAN DEFAULT TRUE,
  is_email_verified BOOLEAN DEFAULT FALSE,
  email_verification_token VARCHAR(255),
  email_verified_at TIMESTAMP,
  
  -- Company Link (for Employers)
  company_id INTEGER REFERENCES c3_companies(id),  -- NULL for admin/self-employed
  
  -- Self-Employed Link
  is_self_employed BOOLEAN DEFAULT FALSE,
  self_employed_ssn VARCHAR(20),  -- SSN if self-employed
  
  -- Password Reset
  password_reset_token VARCHAR(255),
  password_reset_expires_at TIMESTAMP,
  
  -- MFA / OTP
  mfa_enabled BOOLEAN DEFAULT FALSE,
  mfa_secret VARCHAR(255),
  
  -- Security Questions (optional)
  security_question_1 TEXT,
  security_answer_1_hash VARCHAR(255),
  security_question_2 TEXT,
  security_answer_2_hash VARCHAR(255),
  
  -- Audit
  created_at TIMESTAMP DEFAULT NOW(),
  created_by INTEGER REFERENCES c3_users(id),
  updated_at TIMESTAMP,
  updated_by INTEGER REFERENCES c3_users(id),
  is_deleted BOOLEAN DEFAULT FALSE,
  last_login_at TIMESTAMP,
  login_attempts INTEGER DEFAULT 0,
  locked_until TIMESTAMP
);

-- Indexes
CREATE INDEX idx_users_login_id ON c3_users(login_id);
CREATE INDEX idx_users_email ON c3_users(email);
CREATE INDEX idx_users_role ON c3_users(role);
CREATE INDEX idx_users_company_id ON c3_users(company_id);
```

### 2. c3_companies

**Purpose**: Employer company information

```sql
CREATE TABLE c3_companies (
  id SERIAL PRIMARY KEY,
  
  -- Company Identification
  registration_number VARCHAR(50) UNIQUE NOT NULL,  -- Employer registration number (ER12345)
  company_name VARCHAR(255) NOT NULL,
  trade_name VARCHAR(255),
  
  -- Contact Information
  address_line_1 VARCHAR(255),
  address_line_2 VARCHAR(255),
  city VARCHAR(100),
  state_region VARCHAR(100),
  postal_code VARCHAR(20),
  country VARCHAR(2) DEFAULT 'KN',  -- St. Kitts & Nevis
  
  -- Contact Details
  phone VARCHAR(20),
  fax VARCHAR(20),
  email VARCHAR(255),
  website VARCHAR(255),
  
  -- Business Details
  business_type VARCHAR(100),  -- e.g., "Corporation", "LLC", "Partnership"
  industry VARCHAR(100),
  number_of_employees INTEGER DEFAULT 0,
  
  -- Tax Information
  tin VARCHAR(50),  -- Tax Identification Number
  vat_number VARCHAR(50),
  
  -- Status
  is_active BOOLEAN DEFAULT TRUE,
  status VARCHAR(20) DEFAULT 'active',  -- 'active', 'suspended', 'inactive'
  
  -- Audit
  created_at TIMESTAMP DEFAULT NOW(),
  created_by INTEGER REFERENCES c3_users(id),
  updated_at TIMESTAMP,
  updated_by INTEGER REFERENCES c3_users(id),
  is_deleted BOOLEAN DEFAULT FALSE
);

-- Indexes
CREATE INDEX idx_companies_registration_number ON c3_companies(registration_number);
CREATE INDEX idx_companies_name ON c3_companies(company_name);
```

### 3. c3_employees

**Purpose**: Employee records for companies

```sql
CREATE TABLE c3_employees (
  id SERIAL PRIMARY KEY,
  
  -- Foreign Keys
  company_id INTEGER NOT NULL REFERENCES c3_companies(id),
  
  -- Employee Identification
  employee_code VARCHAR(50),  -- Auto-generated or manual
  ssn VARCHAR(20) UNIQUE NOT NULL,  -- Social Security Number (encrypted in production)
  tin VARCHAR(50),  -- Tax Identification Number
  
  -- Personal Information
  first_name VARCHAR(100) NOT NULL,
  last_name VARCHAR(100) NOT NULL,
  middle_name VARCHAR(100),
  birth_date DATE NOT NULL,
  gender VARCHAR(1),  -- 'M', 'F'
  marital_status VARCHAR(1),  -- 'S', 'M', 'D', 'W' (Single, Married, Divorced, Widowed)
  
  -- Contact Information
  address_line_1 VARCHAR(255),
  address_line_2 VARCHAR(255),
  city VARCHAR(100),
  state_region VARCHAR(100),
  postal_code VARCHAR(20),
  country VARCHAR(2) DEFAULT 'KN',
  phone VARCHAR(20),
  mobile VARCHAR(20),
  email VARCHAR(255),
  
  -- Employment Details
  employee_type VARCHAR(20) DEFAULT 'employee',  -- 'employee', 'director', 'both'
  is_director_only BOOLEAN DEFAULT FALSE,  -- Non-working director
  is_employee_director BOOLEAN DEFAULT FALSE,  -- Working director
  occupation VARCHAR(100),
  department VARCHAR(100),
  
  -- Pay Information
  pay_period VARCHAR(10) NOT NULL,  -- 'W' (Weekly), 'E2W' (Biweekly), 'M' (Monthly), '2M' (Twice Monthly)
  annual_salary DECIMAL(18, 2),  -- For directors
  
  -- Dates
  hire_date DATE,  -- Date joined company
  termination_date DATE,  -- Date terminated (if applicable)
  
  -- Contribution Settings
  is_levy_exempt BOOLEAN DEFAULT FALSE,  -- Exempt from levy calculation
  
  -- Status
  is_active BOOLEAN DEFAULT TRUE,
  
  -- Audit
  created_at TIMESTAMP DEFAULT NOW(),
  created_by INTEGER REFERENCES c3_users(id),
  updated_at TIMESTAMP,
  updated_by INTEGER REFERENCES c3_users(id),
  is_deleted BOOLEAN DEFAULT FALSE,
  
  -- Unique constraint: One SSN per company (can work for multiple companies)
  UNIQUE(company_id, ssn)
);

-- Indexes
CREATE INDEX idx_employees_company_id ON c3_employees(company_id);
CREATE INDEX idx_employees_ssn ON c3_employees(ssn);
CREATE INDEX idx_employees_employee_code ON c3_employees(employee_code);
CREATE INDEX idx_employees_is_active ON c3_employees(is_active);
```

### 4. c3_self_employed_profiles

**Purpose**: Self-employed individual profiles

```sql
CREATE TABLE c3_self_employed_profiles (
  id SERIAL PRIMARY KEY,
  
  -- Foreign Key
  user_id INTEGER UNIQUE NOT NULL REFERENCES c3_users(id),
  
  -- Identification
  ssn VARCHAR(20) UNIQUE NOT NULL,  -- Social Security Number
  registration_number VARCHAR(50) UNIQUE,  -- Self-employed registration number
  
  -- Personal Information
  first_name VARCHAR(100) NOT NULL,
  last_name VARCHAR(100) NOT NULL,
  middle_name VARCHAR(100),
  birth_date DATE NOT NULL,
  gender VARCHAR(1),
  marital_status VARCHAR(1),
  
  -- Contact Information
  address_line_1 VARCHAR(255),
  address_line_2 VARCHAR(255),
  city VARCHAR(100),
  state_region VARCHAR(100),
  postal_code VARCHAR(20),
  country VARCHAR(2) DEFAULT 'KN',
  phone VARCHAR(20),
  mobile VARCHAR(20),
  email VARCHAR(255),
  
  -- Business Information
  business_name VARCHAR(255),
  business_type VARCHAR(100),
  occupation VARCHAR(100),
  industry VARCHAR(100),
  tin VARCHAR(50),
  
  -- Status
  is_active BOOLEAN DEFAULT TRUE,
  
  -- Audit
  created_at TIMESTAMP DEFAULT NOW(),
  created_by INTEGER REFERENCES c3_users(id),
  updated_at TIMESTAMP,
  updated_by INTEGER REFERENCES c3_users(id),
  is_deleted BOOLEAN DEFAULT FALSE
);

-- Indexes
CREATE INDEX idx_self_employed_user_id ON c3_self_employed_profiles(user_id);
CREATE INDEX idx_self_employed_ssn ON c3_self_employed_profiles(ssn);
```

### 5. c3_contribution_headers

**Purpose**: C3 form header (one per company per month)

```sql
CREATE TABLE c3_contribution_headers (
  id SERIAL PRIMARY KEY,
  
  -- Foreign Keys
  company_id INTEGER REFERENCES c3_companies(id),  -- NULL for self-employed
  user_id INTEGER REFERENCES c3_users(id),  -- Who created this C3
  
  -- Period
  month INTEGER NOT NULL,  -- 1-12
  year INTEGER NOT NULL,
  
  -- Type
  is_self_employed BOOLEAN DEFAULT FALSE,  -- TRUE if self-employed C3
  is_director BOOLEAN DEFAULT FALSE,  -- TRUE if non-working director C3
  is_nil_return BOOLEAN DEFAULT FALSE,  -- TRUE if no employees (nil return)
  
  -- Schedule
  schedule_number INTEGER,  -- BIMA-assigned schedule number
  
  -- Totals (Employee + Employer combined)
  total_employees INTEGER DEFAULT 0,
  total_wages DECIMAL(18, 2) DEFAULT 0.00,
  total_holiday_pay DECIMAL(18, 2) DEFAULT 0.00,
  total_bonus DECIMAL(18, 2) DEFAULT 0.00,
  
  -- Contribution Totals
  total_ss_employee DECIMAL(18, 2) DEFAULT 0.00,
  total_ss_employer DECIMAL(18, 2) DEFAULT 0.00,
  total_ei_employee DECIMAL(18, 2) DEFAULT 0.00,
  total_ei_employer DECIMAL(18, 2) DEFAULT 0.00,
  total_levy_employee DECIMAL(18, 2) DEFAULT 0.00,
  total_levy_employer DECIMAL(18, 2) DEFAULT 0.00,
  total_pe_employee DECIMAL(18, 2) DEFAULT 0.00,
  total_pe_employer DECIMAL(18, 2) DEFAULT 0.00,
  
  -- Penalty Totals
  total_ss_penalty DECIMAL(18, 2) DEFAULT 0.00,
  total_levy_penalty DECIMAL(18, 2) DEFAULT 0.00,
  total_pe_penalty DECIMAL(18, 2) DEFAULT 0.00,
  
  -- Grand Total
  grand_total DECIMAL(18, 2) DEFAULT 0.00,
  
  -- Status
  status VARCHAR(20) DEFAULT 'draft',  -- 'draft', 'finalized', 'submitted', 'paid'
  finalized_at TIMESTAMP,
  finalized_by INTEGER REFERENCES c3_users(id),
  
  -- Submission to BIMA
  is_submitted BOOLEAN DEFAULT FALSE,
  submitted_at TIMESTAMP,
  submitted_by INTEGER REFERENCES c3_users(id),
  bima_submit_response TEXT,  -- JSON response from BIMA
  
  -- Payment
  is_paid BOOLEAN DEFAULT FALSE,
  paid_at TIMESTAMP,
  payment_id INTEGER REFERENCES c3_payments(id),
  
  -- Audit
  created_at TIMESTAMP DEFAULT NOW(),
  created_by INTEGER REFERENCES c3_users(id),
  updated_at TIMESTAMP,
  updated_by INTEGER REFERENCES c3_users(id),
  is_deleted BOOLEAN DEFAULT FALSE,
  
  -- Unique constraint: One C3 per company per month/year
  UNIQUE(company_id, month, year, is_director)
);

-- Indexes
CREATE INDEX idx_c3_headers_company_id ON c3_contribution_headers(company_id);
CREATE INDEX idx_c3_headers_period ON c3_contribution_headers(month, year);
CREATE INDEX idx_c3_headers_status ON c3_contribution_headers(status);
```

### 6. c3_contribution_details

**Purpose**: Individual employee contributions (one per employee per C3 form)

```sql
CREATE TABLE c3_contribution_details (
  id SERIAL PRIMARY KEY,
  
  -- Foreign Keys
  c3_header_id INTEGER NOT NULL REFERENCES c3_contribution_headers(id) ON DELETE CASCADE,
  employee_id INTEGER REFERENCES c3_employees(id),  -- NULL for self-employed
  company_id INTEGER NOT NULL REFERENCES c3_companies(id),  -- For RLS
  
  -- Employee Info (denormalized for historical record)
  ssn VARCHAR(20) NOT NULL,
  first_name VARCHAR(100),
  last_name VARCHAR(100),
  birth_date DATE,
  pay_period VARCHAR(10),  -- 'W', 'E2W', 'M', '2M'
  
  -- Wages by Week (up to 5 weeks in a month)
  week_1_worked BOOLEAN DEFAULT FALSE,
  week_1_wages DECIMAL(18, 2) DEFAULT 0.00,
  week_2_worked BOOLEAN DEFAULT FALSE,
  week_2_wages DECIMAL(18, 2) DEFAULT 0.00,
  week_3_worked BOOLEAN DEFAULT FALSE,
  week_3_wages DECIMAL(18, 2) DEFAULT 0.00,
  week_4_worked BOOLEAN DEFAULT FALSE,
  week_4_wages DECIMAL(18, 2) DEFAULT 0.00,
  week_5_worked BOOLEAN DEFAULT FALSE,
  week_5_wages DECIMAL(18, 2) DEFAULT 0.00,
  
  -- Holiday Pay & Bonus
  holiday_pay DECIMAL(18, 2) DEFAULT 0.00,
  bonus DECIMAL(18, 2) DEFAULT 0.00,
  
  -- Holiday Pay Distribution (across non-working weeks)
  holiday_pay_week_1 DECIMAL(18, 2) DEFAULT 0.00,
  holiday_pay_week_2 DECIMAL(18, 2) DEFAULT 0.00,
  holiday_pay_week_3 DECIMAL(18, 2) DEFAULT 0.00,
  holiday_pay_week_4 DECIMAL(18, 2) DEFAULT 0.00,
  holiday_pay_week_5 DECIMAL(18, 2) DEFAULT 0.00,
  
  -- Totals
  total_wages DECIMAL(18, 2) DEFAULT 0.00,  -- Sum of all weeks
  total_wages_plus_holiday DECIMAL(18, 2) DEFAULT 0.00,  -- For levy calculation
  total_wages_plus_holiday_plus_bonus DECIMAL(18, 2) DEFAULT 0.00,  -- For employer levy
  
  -- Calculated Contributions (Employee)
  ss_employee DECIMAL(18, 2) DEFAULT 0.00,
  ei_employee DECIMAL(18, 2) DEFAULT 0.00,
  levy_employee DECIMAL(18, 2) DEFAULT 0.00,
  pe_employee DECIMAL(18, 2) DEFAULT 0.00,
  
  -- Calculated Contributions (Employer)
  ss_employer DECIMAL(18, 2) DEFAULT 0.00,
  ei_employer DECIMAL(18, 2) DEFAULT 0.00,
  levy_employer DECIMAL(18, 2) DEFAULT 0.00,
  pe_employer DECIMAL(18, 2) DEFAULT 0.00,
  
  -- Employee Subtotal
  employee_total DECIMAL(18, 2) DEFAULT 0.00,  -- SS + EI + Levy + PE
  
  -- Employer Subtotal
  employer_total DECIMAL(18, 2) DEFAULT 0.00,  -- SS + EI + Levy + PE
  
  -- Grand Total (Employee + Employer)
  grand_total DECIMAL(18, 2) DEFAULT 0.00,
  
  -- Special Flags
  is_levy_exempt BOOLEAN DEFAULT FALSE,
  is_december_bonus_exempt BOOLEAN DEFAULT FALSE,  -- If YTD < $28k in December
  
  -- Employment Dates (for new hires / terminations)
  date_joined DATE,
  date_terminated DATE,
  
  -- Submission Status
  is_submitted BOOLEAN DEFAULT FALSE,
  submitted_at TIMESTAMP,
  
  -- Audit
  created_at TIMESTAMP DEFAULT NOW(),
  created_by INTEGER REFERENCES c3_users(id),
  updated_at TIMESTAMP,
  updated_by INTEGER REFERENCES c3_users(id),
  is_deleted BOOLEAN DEFAULT FALSE
);

-- Indexes
CREATE INDEX idx_c3_details_header_id ON c3_contribution_details(c3_header_id);
CREATE INDEX idx_c3_details_employee_id ON c3_contribution_details(employee_id);
CREATE INDEX idx_c3_details_ssn ON c3_contribution_details(ssn);
CREATE INDEX idx_c3_details_company_id ON c3_contribution_details(company_id);
```

---

**(Continuing in next part due to length...)**
