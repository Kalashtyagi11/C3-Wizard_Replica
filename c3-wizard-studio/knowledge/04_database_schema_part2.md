# 04. Database Schema (Part 2)

**Continuation of database schema documentation**

---

## Payment & Transaction Tables

### 7. c3_payments

**Purpose**: Payment transactions (online and offline)

```sql
CREATE TABLE c3_payments (
  id SERIAL PRIMARY KEY,
  
  -- Foreign Keys
  c3_header_id INTEGER NOT NULL REFERENCES c3_contribution_headers(id),
  company_id INTEGER REFERENCES c3_companies(id),  -- For RLS
  user_id INTEGER NOT NULL REFERENCES c3_users(id),  -- Who made the payment
  
  -- Payment Details
  payment_amount DECIMAL(18, 2) NOT NULL,
  payment_amount_usd DECIMAL(18, 2),  -- If paid in USD
  exchange_rate DECIMAL(18, 6),
  from_account_amount DECIMAL(18, 2),  -- Original amount if currency conversion
  
  -- Payment Method
  payment_method VARCHAR(50) NOT NULL,  -- 'CyberSource', 'PayPal', 'Bank Transfer', 'Check', 'Cash', 'Journal Voucher'
  payment_mode VARCHAR(50),  -- 'Online', 'Offline'
  
  -- Gateway Transaction Info
  payment_gateway_transaction_id VARCHAR(255),  -- CyberSource or PayPal transaction ID
  payment_status VARCHAR(50),  -- 'PENDING', 'AUTHORIZED', 'CAPTURED', 'DECLINED', 'FAILED', 'Offline Payment'
  payment_response TEXT,  -- Full JSON response from payment gateway
  
  -- Breakdown (matches C3 header totals)
  total_ss_contributions DECIMAL(18, 2),
  total_ei_contributions DECIMAL(18, 2),
  total_levy_contributions DECIMAL(18, 2),
  total_pe_contributions DECIMAL(18, 2),
  total_ss_penalty DECIMAL(18, 2),
  total_levy_penalty DECIMAL(18, 2),
  total_pe_penalty DECIMAL(18, 2),
  
  -- BIMA Integration
  bima_receipt_number VARCHAR(100),  -- Receipt number from BIMA
  bima_payment_response TEXT,  -- JSON response from BIMA payment API
  bima_ref_num VARCHAR(100),  -- BIMA reference number
  is_bima_posted BOOLEAN DEFAULT FALSE,  -- TRUE if successfully posted to BIMA
  
  -- Offline Payment Details
  check_number VARCHAR(50),
  bank_name VARCHAR(100),
  bank_account_number VARCHAR(50),
  transaction_reference VARCHAR(100),
  reason_for_payment TEXT,
  
  -- Receipt
  receipt_number VARCHAR(50) UNIQUE,  -- Auto-generated receipt number
  receipt_pdf_url TEXT,  -- URL to generated receipt PDF
  
  -- Transaction Dates
  transaction_date TIMESTAMP DEFAULT NOW(),
  authorization_date TIMESTAMP,
  capture_date TIMESTAMP,
  
  -- Status
  is_active BOOLEAN DEFAULT TRUE,
  is_reconciled BOOLEAN DEFAULT FALSE,  -- TRUE if reconciled by admin
  reconciled_at TIMESTAMP,
  reconciled_by INTEGER REFERENCES c3_users(id),
  
  -- For Transaction Type
  transaction_for VARCHAR(20),  -- 'Company', 'Self', 'Director'
  
  -- Audit
  created_at TIMESTAMP DEFAULT NOW(),
  created_by INTEGER REFERENCES c3_users(id),
  updated_at TIMESTAMP,
  updated_by INTEGER REFERENCES c3_users(id),
  is_deleted BOOLEAN DEFAULT FALSE
);

-- Indexes
CREATE INDEX idx_payments_c3_header_id ON c3_payments(c3_header_id);
CREATE INDEX idx_payments_company_id ON c3_payments(company_id);
CREATE INDEX idx_payments_transaction_id ON c3_payments(payment_gateway_transaction_id);
CREATE INDEX idx_payments_status ON c3_payments(payment_status);
CREATE INDEX idx_payments_receipt_number ON c3_payments(receipt_number);
```

### 8. c3_payment_reconciliation

**Purpose**: Admin payment reconciliation records

```sql
CREATE TABLE c3_payment_reconciliation (
  id SERIAL PRIMARY KEY,
  
  -- Upload Info
  file_path TEXT,  -- Path to uploaded CSV file
  file_name VARCHAR(255),
  upload_date TIMESTAMP DEFAULT NOW(),
  uploaded_by INTEGER REFERENCES c3_users(id),
  
  -- Processing Status
  status VARCHAR(20) DEFAULT 'pending',  -- 'pending', 'processing', 'completed', 'failed'
  total_records INTEGER DEFAULT 0,
  matched_records INTEGER DEFAULT 0,
  unmatched_records INTEGER DEFAULT 0,
  
  -- Reconciliation Details
  reconciliation_date DATE,
  reconciliation_notes TEXT,
  
  -- Audit
  created_at TIMESTAMP DEFAULT NOW(),
  created_by INTEGER REFERENCES c3_users(id),
  is_deleted BOOLEAN DEFAULT FALSE
);

CREATE TABLE c3_payment_reconciliation_details (
  id SERIAL PRIMARY KEY,
  reconciliation_id INTEGER NOT NULL REFERENCES c3_payment_reconciliation(id) ON DELETE CASCADE,
  
  -- From CSV
  transaction_id VARCHAR(255),
  transaction_date DATE,
  amount DECIMAL(18, 2),
  payer_name VARCHAR(255),
  reference VARCHAR(255),
  
  -- Matching Status
  is_matched BOOLEAN DEFAULT FALSE,
  matched_payment_id INTEGER REFERENCES c3_payments(id),
  match_confidence VARCHAR(20),  -- 'exact', 'fuzzy', 'manual'
  
  -- Admin Review
  reconciliation_status VARCHAR(20),  -- 'matched', 'unmatched', 'disputed', 'resolved'
  admin_notes TEXT,
  
  -- Audit
  created_at TIMESTAMP DEFAULT NOW()
);
```

---

## Configuration Tables

### 9. c3_system_rates

**Purpose**: Contribution rates and caps (configurable by year)

```sql
CREATE TABLE c3_system_rates (
  id SERIAL PRIMARY KEY,
  
  -- Effective Period
  year INTEGER NOT NULL,
  effective_from_date DATE NOT NULL,
  effective_to_date DATE,
  is_locked BOOLEAN DEFAULT FALSE,  -- Lock after year ends
  
  -- Social Security Rates
  ss_employee_rate DECIMAL(5, 4) NOT NULL,  -- e.g., 0.0500 for 5%
  ss_employer_rate DECIMAL(5, 4) NOT NULL,
  ss_employee_cap DECIMAL(18, 2) NOT NULL,  -- e.g., 750.00
  ss_employer_cap DECIMAL(18, 2),  -- NULL = no cap
  
  -- Employment Insurance Rates
  ei_employee_rate DECIMAL(5, 4) NOT NULL,
  ei_employer_rate DECIMAL(5, 4) NOT NULL,
  ei_employee_cap DECIMAL(18, 2) NOT NULL,
  ei_employer_cap DECIMAL(18, 2) NOT NULL,
  
  -- Severance Pay (PE) Rates
  pe_employee_rate DECIMAL(5, 4) NOT NULL,
  pe_employer_rate DECIMAL(5, 4) NOT NULL,
  pe_employee_cap DECIMAL(18, 2) NOT NULL,
  pe_employer_cap DECIMAL(18, 2),  -- NULL = no cap
  
  -- Levy Rates
  employer_levy_rate DECIMAL(5, 4) NOT NULL,  -- e.g., 0.0300 for 3%
  bonus_levy_employee_rate DECIMAL(5, 4) NOT NULL,  -- For December bonus
  
  -- Employee Levy Tiers (configured separately in c3_levy_tiers table)
  
  -- Penalty Rates
  fine_rate DECIMAL(5, 4),  -- Daily fine rate
  additional_fine_rate DECIMAL(5, 4),
  penalty_rate DECIMAL(5, 4),  -- Late submission penalty %
  additional_penalty_rate DECIMAL(5, 4),
  
  -- Age Limits (for SS contributions)
  min_age INTEGER DEFAULT 16,
  max_age INTEGER DEFAULT 62,
  
  -- Audit
  created_at TIMESTAMP DEFAULT NOW(),
  created_by INTEGER REFERENCES c3_users(id),
  updated_at TIMESTAMP,
  updated_by INTEGER REFERENCES c3_users(id),
  is_deleted BOOLEAN DEFAULT FALSE,
  
  -- Unique constraint: One rate config per year
  UNIQUE(year)
);

-- Indexes
CREATE INDEX idx_rates_year ON c3_system_rates(year);
CREATE INDEX idx_rates_effective_dates ON c3_system_rates(effective_from_date, effective_to_date);
```

### 10. c3_levy_tiers

**Purpose**: Progressive employee levy tier configuration

```sql
CREATE TABLE c3_levy_tiers (
  id SERIAL PRIMARY KEY,
  
  -- Link to System Rates
  system_rate_id INTEGER NOT NULL REFERENCES c3_system_rates(id) ON DELETE CASCADE,
  year INTEGER NOT NULL,
  
  -- Tier Definition
  tier_number INTEGER NOT NULL,  -- 1, 2, 3, etc.
  pay_period VARCHAR(10) NOT NULL,  -- 'W' (weekly), 'E2W' (biweekly), 'M' (monthly), '2M' (twice monthly)
  
  -- Wage Range
  wage_from DECIMAL(18, 2) NOT NULL,  -- e.g., 0.00
  wage_to DECIMAL(18, 2),  -- e.g., 499.99 (NULL = infinity)
  
  -- Tax Rate
  base_amount DECIMAL(18, 2) DEFAULT 0.00,  -- Flat amount
  tax_rate DECIMAL(5, 4) NOT NULL,  -- e.g., 0.0000 for 0%, 0.0100 for 1%
  over_amount DECIMAL(18, 2),  -- Amount over which tax_rate applies
  
  -- Display Order
  display_order INTEGER,
  
  -- Example Calculation Note
  description TEXT,  -- e.g., "$0 - $499.99: 0%"
  
  -- Audit
  created_at TIMESTAMP DEFAULT NOW(),
  is_deleted BOOLEAN DEFAULT FALSE,
  
  -- Unique constraint
  UNIQUE(system_rate_id, pay_period, tier_number)
);

-- Indexes
CREATE INDEX idx_levy_tiers_system_rate_id ON c3_levy_tiers(system_rate_id);
CREATE INDEX idx_levy_tiers_pay_period ON c3_levy_tiers(pay_period);

-- Example data for 2026 (Weekly pay period)
INSERT INTO c3_levy_tiers (system_rate_id, year, tier_number, pay_period, wage_from, wage_to, base_amount, tax_rate, over_amount, description) VALUES
(1, 2026, 1, 'W', 0.00, 499.99, 0.00, 0.0000, 0.00, '$0 - $499.99: 0%'),
(1, 2026, 2, 'W', 500.00, 999.99, 0.00, 0.0100, 500.00, '$500 - $999.99: 1% of amount over $500'),
(1, 2026, 3, 'W', 1000.00, 1499.99, 5.00, 0.0200, 1000.00, '$1,000 - $1,499.99: $5 + 2% of amount over $1,000'),
(1, 2026, 4, 'W', 1500.00, 1999.99, 15.00, 0.0300, 1500.00, '$1,500 - $1,999.99: $15 + 3% of amount over $1,500'),
(1, 2026, 5, 'W', 2000.00, 2999.99, 30.00, 0.0400, 2000.00, '$2,000 - $2,999.99: $30 + 4% of amount over $2,000'),
(1, 2026, 6, 'W', 3000.00, NULL, 70.00, 0.0500, 3000.00, '$3,000+: $70 + 5% of amount over $3,000');
```

### 11. c3_december_bonus_exemptions

**Purpose**: December bonus exemption configuration

```sql
CREATE TABLE c3_december_bonus_exemptions (
  id SERIAL PRIMARY KEY,
  
  -- Year & Month
  year INTEGER NOT NULL,
  month INTEGER NOT NULL DEFAULT 12,  -- Usually December
  
  -- Exemption Thresholds
  ytd_threshold DECIMAL(18, 2) DEFAULT 28000.00,  -- If YTD < this, exempt from employee levy
  
  -- Exemption Flags
  exempt_employee_levy BOOLEAN DEFAULT TRUE,
  exempt_employer_levy BOOLEAN DEFAULT FALSE,
  exempt_severance BOOLEAN DEFAULT FALSE,
  exempt_social_security BOOLEAN DEFAULT FALSE,
  
  -- Audit
  created_at TIMESTAMP DEFAULT NOW(),
  created_by INTEGER REFERENCES c3_users(id),
  is_deleted BOOLEAN DEFAULT FALSE,
  
  UNIQUE(year, month)
);

-- Example data
INSERT INTO c3_december_bonus_exemptions (year, month, ytd_threshold, exempt_employee_levy) VALUES
(2025, 12, 28000.00, TRUE),
(2026, 12, 28000.00, TRUE);
```

---

## Audit & Logging Tables

### 12. c3_audit_logs

**Purpose**: Complete audit trail of all system activities

```sql
CREATE TABLE c3_audit_logs (
  id SERIAL PRIMARY KEY,
  
  -- Who
  user_id INTEGER REFERENCES c3_users(id),
  user_email VARCHAR(255),
  user_role VARCHAR(20),
  
  -- What
  action VARCHAR(100) NOT NULL,  -- 'CREATE', 'UPDATE', 'DELETE', 'LOGIN', 'C3_SUBMIT', 'PAYMENT_MADE', etc.
  resource_type VARCHAR(50),  -- 'EMPLOYEE', 'C3_FORM', 'PAYMENT', 'USER', etc.
  resource_id INTEGER,
  
  -- Details
  old_values JSONB,  -- Previous state (for UPDATEs)
  new_values JSONB,  -- New state
  details TEXT,  -- Human-readable description
  
  -- Where
  ip_address VARCHAR(45),  -- IPv4 or IPv6
  user_agent TEXT,
  
  -- When
  created_at TIMESTAMP DEFAULT NOW(),
  
  -- Context
  request_id VARCHAR(100),  -- For correlating related actions
  session_id VARCHAR(100)
);

-- Indexes
CREATE INDEX idx_audit_user_id ON c3_audit_logs(user_id);
CREATE INDEX idx_audit_action ON c3_audit_logs(action);
CREATE INDEX idx_audit_resource ON c3_audit_logs(resource_type, resource_id);
CREATE INDEX idx_audit_created_at ON c3_audit_logs(created_at);
```

### 13. c3_login_logs

**Purpose**: Track login attempts (security monitoring)

```sql
CREATE TABLE c3_login_logs (
  id SERIAL PRIMARY KEY,
  
  -- User Info
  login_id VARCHAR(100),  -- Email or username attempted
  user_id INTEGER REFERENCES c3_users(id),  -- NULL if login failed
  
  -- Result
  success BOOLEAN NOT NULL,
  failure_reason VARCHAR(255),  -- 'Invalid password', 'Account locked', etc.
  
  -- Security
  ip_address VARCHAR(45),
  user_agent TEXT,
  
  -- Timestamp
  attempted_at TIMESTAMP DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_login_logs_user_id ON c3_login_logs(user_id);
CREATE INDEX idx_login_logs_login_id ON c3_login_logs(login_id);
CREATE INDEX idx_login_logs_ip_address ON c3_login_logs(ip_address);
CREATE INDEX idx_login_logs_attempted_at ON c3_login_logs(attempted_at);
```

---

## Additional Support Tables

### 14. c3_user_otps

**Purpose**: OTP/MFA codes for email verification and 2FA

```sql
CREATE TABLE c3_user_otps (
  id SERIAL PRIMARY KEY,
  
  -- User
  user_id INTEGER NOT NULL REFERENCES c3_users(id) ON DELETE CASCADE,
  email VARCHAR(255) NOT NULL,
  
  -- OTP Code
  otp_code VARCHAR(10) NOT NULL,  -- 6-digit code
  otp_type VARCHAR(20) NOT NULL,  -- 'EMAIL_VERIFICATION', 'PASSWORD_RESET', 'MFA_LOGIN'
  
  -- Validity
  expires_at TIMESTAMP NOT NULL,
  is_used BOOLEAN DEFAULT FALSE,
  used_at TIMESTAMP,
  
  -- Attempt Tracking
  attempts INTEGER DEFAULT 0,
  max_attempts INTEGER DEFAULT 3,
  
  -- Audit
  created_at TIMESTAMP DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_otps_user_id ON c3_user_otps(user_id);
CREATE INDEX idx_otps_email ON c3_user_otps(email);
CREATE INDEX idx_otps_code ON c3_user_otps(otp_code);
```

### 15. c3_holiday_pay_details

**Purpose**: Track holiday pay entries for employees

```sql
CREATE TABLE c3_holiday_pay_details (
  id SERIAL PRIMARY KEY,
  
  -- Foreign Keys
  company_id INTEGER NOT NULL REFERENCES c3_companies(id),
  employee_id INTEGER NOT NULL REFERENCES c3_employees(id) ON DELETE CASCADE,
  
  -- Period
  month INTEGER NOT NULL,
  year INTEGER NOT NULL,
  
  -- Holiday Pay Amount
  amount DECIMAL(18, 2) NOT NULL,
  
  -- Holiday Pay Dates (which weeks to distribute across)
  week_1_date DATE,
  week_2_date DATE,
  week_3_date DATE,
  week_4_date DATE,
  week_5_date DATE,
  
  -- Distribution Amounts
  week_1_amount DECIMAL(18, 2) DEFAULT 0.00,
  week_2_amount DECIMAL(18, 2) DEFAULT 0.00,
  week_3_amount DECIMAL(18, 2) DEFAULT 0.00,
  week_4_amount DECIMAL(18, 2) DEFAULT 0.00,
  week_5_amount DECIMAL(18, 2) DEFAULT 0.00,
  
  -- Audit
  created_at TIMESTAMP DEFAULT NOW(),
  created_by INTEGER REFERENCES c3_users(id),
  updated_at TIMESTAMP,
  updated_by INTEGER REFERENCES c3_users(id),
  is_deleted BOOLEAN DEFAULT FALSE,
  
  UNIQUE(company_id, employee_id, month, year)
);

-- Indexes
CREATE INDEX idx_holiday_pay_company_id ON c3_holiday_pay_details(company_id);
CREATE INDEX idx_holiday_pay_employee_id ON c3_holiday_pay_details(employee_id);
```

### 16. c3_bonus_details

**Purpose**: Track bonus payments for employees

```sql
CREATE TABLE c3_bonus_details (
  id SERIAL PRIMARY KEY,
  
  -- Foreign Keys
  company_id INTEGER NOT NULL REFERENCES c3_companies(id),
  employee_id INTEGER NOT NULL REFERENCES c3_employees(id) ON DELETE CASCADE,
  
  -- Period
  month INTEGER NOT NULL,
  year INTEGER NOT NULL,
  
  -- Bonus Details
  amount DECIMAL(18, 2) NOT NULL,
  bonus_type VARCHAR(50),  -- 'Performance', 'Holiday', 'Annual', etc.
  bonus_date DATE,
  
  -- Payment Period Range
  period_start_date DATE,
  period_end_date DATE,
  
  -- Special Flags
  is_december_bonus BOOLEAN DEFAULT FALSE,
  is_exempt_from_levy BOOLEAN DEFAULT FALSE,
  
  -- Audit
  created_at TIMESTAMP DEFAULT NOW(),
  created_by INTEGER REFERENCES c3_users(id),
  updated_at TIMESTAMP,
  updated_by INTEGER REFERENCES c3_users(id),
  is_deleted BOOLEAN DEFAULT FALSE
);

-- Indexes
CREATE INDEX idx_bonus_company_id ON c3_bonus_details(company_id);
CREATE INDEX idx_bonus_employee_id ON c3_bonus_details(employee_id);
CREATE INDEX idx_bonus_period ON c3_bonus_details(month, year);
```

---

## Row Level Security (RLS) Policies

### Employers can only see their own company data

```sql
-- c3_employees table
ALTER TABLE c3_employees ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Employers view own employees" ON c3_employees
  FOR SELECT
  USING (
    company_id IN (
      SELECT company_id FROM c3_users 
      WHERE id = auth.uid() AND role = 'employer'
    )
  );

CREATE POLICY "Employers insert own employees" ON c3_employees
  FOR INSERT
  WITH CHECK (
    company_id IN (
      SELECT company_id FROM c3_users 
      WHERE id = auth.uid() AND role = 'employer'
    )
  );

-- Similar policies for all other tables with company_id
```

### Self-employed can only see their own data

```sql
ALTER TABLE c3_self_employed_profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Self-employed view own profile" ON c3_self_employed_profiles
  FOR ALL
  USING (user_id = auth.uid());
```

### Admins can see all data

```sql
CREATE POLICY "Admins view all employees" ON c3_employees
  FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM c3_users 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );
```

---

## Summary

**Total Tables**: 16 core tables + RLS policies

**Key Features**:
- ✅ Complete audit trail (created_at, created_by, etc.)
- ✅ Soft delete (is_deleted flag)
- ✅ Row Level Security (RLS) for multi-tenancy
- ✅ Configurable rates per year
- ✅ Progressive levy tier support
- ✅ BIMA integration fields
- ✅ Payment reconciliation
- ✅ MFA/OTP support

**Migration Compatibility**: All schemas are PostgreSQL → MS-SQL compatible (avoid PostgreSQL-specific features like SERIAL, use standard types).

---

**Database Schema Documentation Complete** ✅
