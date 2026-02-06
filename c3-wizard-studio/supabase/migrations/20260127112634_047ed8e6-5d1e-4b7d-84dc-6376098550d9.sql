-- Create missing tables first
CREATE TABLE IF NOT EXISTS c3_security_questions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  company_id UUID,
  question_1 TEXT,
  answer_1_hash TEXT,
  question_2 TEXT,
  answer_2_hash TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_by UUID,
  updated_at TIMESTAMP WITH TIME ZONE,
  updated_by UUID,
  is_active BOOLEAN DEFAULT TRUE
);

CREATE TABLE IF NOT EXISTS c3_user_otps (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  otp_type TEXT DEFAULT 'email',
  otp_code TEXT NOT NULL,
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
  is_used BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE c3_security_questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE c3_user_otps ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users manage own security questions" ON c3_security_questions FOR ALL USING (user_id = auth.uid() OR has_role(auth.uid(), 'admin'));
CREATE POLICY "Users manage own OTPs" ON c3_user_otps FOR ALL USING (user_id = auth.uid());

-- Add missing columns to existing tables
ALTER TABLE c3_payments ADD COLUMN IF NOT EXISTS exchange_rate NUMERIC(18,6);
ALTER TABLE c3_payments ADD COLUMN IF NOT EXISTS payment_amount_usd NUMERIC(18,2);
ALTER TABLE c3_payments ADD COLUMN IF NOT EXISTS is_reconciled BOOLEAN DEFAULT FALSE;
ALTER TABLE c3_payments ADD COLUMN IF NOT EXISTS reconciled_by UUID;
ALTER TABLE c3_payments ADD COLUMN IF NOT EXISTS reconciled_at TIMESTAMP WITH TIME ZONE;
ALTER TABLE c3_payments ADD COLUMN IF NOT EXISTS bank_name TEXT;
ALTER TABLE c3_payments ADD COLUMN IF NOT EXISTS check_num TEXT;
ALTER TABLE c3_payments ADD COLUMN IF NOT EXISTS bima_ref_num TEXT;
ALTER TABLE c3_payments ADD COLUMN IF NOT EXISTS card_type TEXT;
ALTER TABLE c3_payments ADD COLUMN IF NOT EXISTS total_ss_contributions NUMERIC(18,2) DEFAULT 0;
ALTER TABLE c3_payments ADD COLUMN IF NOT EXISTS total_levy NUMERIC(18,2) DEFAULT 0;
ALTER TABLE c3_payments ADD COLUMN IF NOT EXISTS bima_receipt_number TEXT;

ALTER TABLE c3_contribution_headers ADD COLUMN IF NOT EXISTS is_unlocked BOOLEAN DEFAULT FALSE;
ALTER TABLE c3_contribution_headers ADD COLUMN IF NOT EXISTS error_desc TEXT;
ALTER TABLE c3_contribution_headers ADD COLUMN IF NOT EXISTS notes TEXT;
ALTER TABLE c3_contribution_headers ADD COLUMN IF NOT EXISTS is_sent_for_edit BOOLEAN DEFAULT FALSE;
ALTER TABLE c3_contribution_headers ADD COLUMN IF NOT EXISTS is_import_c3_file BOOLEAN DEFAULT FALSE;
ALTER TABLE c3_contribution_headers ADD COLUMN IF NOT EXISTS import_c3_filepath TEXT;

ALTER TABLE c3_contribution_details ADD COLUMN IF NOT EXISTS director_wage NUMERIC(18,2) DEFAULT 0;
ALTER TABLE c3_contribution_details ADD COLUMN IF NOT EXISTS remarks TEXT;
ALTER TABLE c3_contribution_details ADD COLUMN IF NOT EXISTS is_finalized BOOLEAN DEFAULT FALSE;
ALTER TABLE c3_contribution_details ADD COLUMN IF NOT EXISTS is_unlocked BOOLEAN DEFAULT FALSE;
ALTER TABLE c3_contribution_details ADD COLUMN IF NOT EXISTS error_desc TEXT;

ALTER TABLE c3_companies ADD COLUMN IF NOT EXISTS mobile TEXT;
ALTER TABLE c3_companies ADD COLUMN IF NOT EXISTS contact_person TEXT;
ALTER TABLE c3_companies ADD COLUMN IF NOT EXISTS company_logo TEXT;
ALTER TABLE c3_companies ADD COLUMN IF NOT EXISTS is_levy_exempt BOOLEAN DEFAULT FALSE;
ALTER TABLE c3_companies ADD COLUMN IF NOT EXISTS is_verified BOOLEAN DEFAULT FALSE;
ALTER TABLE c3_companies ADD COLUMN IF NOT EXISTS office_code TEXT;

ALTER TABLE c3_employees ADD COLUMN IF NOT EXISTS type_code TEXT;
ALTER TABLE c3_employees ADD COLUMN IF NOT EXISTS last_pay_date DATE;
ALTER TABLE c3_employees ADD COLUMN IF NOT EXISTS empl_status TEXT DEFAULT 'A';
ALTER TABLE c3_employees ADD COLUMN IF NOT EXISTS bank_acct_no TEXT;

ALTER TABLE c3_self_employed_profiles ADD COLUMN IF NOT EXISTS category_type INTEGER;
ALTER TABLE c3_self_employed_profiles ADD COLUMN IF NOT EXISTS empl_status TEXT DEFAULT 'A';
ALTER TABLE c3_self_employed_profiles ADD COLUMN IF NOT EXISTS bank_acct_no TEXT;
ALTER TABLE c3_self_employed_profiles ADD COLUMN IF NOT EXISTS is_wage_category_from_api BOOLEAN DEFAULT FALSE;

ALTER TABLE c3_december_bonus_exemptions ADD COLUMN IF NOT EXISTS is_exempted_levy BOOLEAN DEFAULT FALSE;
ALTER TABLE c3_december_bonus_exemptions ADD COLUMN IF NOT EXISTS is_exempted_employer_levy BOOLEAN DEFAULT FALSE;
ALTER TABLE c3_december_bonus_exemptions ADD COLUMN IF NOT EXISTS is_exempted_severance BOOLEAN DEFAULT FALSE;
ALTER TABLE c3_december_bonus_exemptions ADD COLUMN IF NOT EXISTS is_exempted_social_security BOOLEAN DEFAULT FALSE;
ALTER TABLE c3_december_bonus_exemptions ADD COLUMN IF NOT EXISTS month_no INTEGER;
ALTER TABLE c3_december_bonus_exemptions ADD COLUMN IF NOT EXISTS is_locked BOOLEAN DEFAULT FALSE;

ALTER TABLE c3_login_logs ADD COLUMN IF NOT EXISTS logout_time TIMESTAMP WITH TIME ZONE;
ALTER TABLE c3_login_logs ADD COLUMN IF NOT EXISTS is_locked BOOLEAN DEFAULT FALSE;
ALTER TABLE c3_login_logs ADD COLUMN IF NOT EXISTS company_id UUID;
ALTER TABLE c3_login_logs ADD COLUMN IF NOT EXISTS is_self_employed BOOLEAN DEFAULT FALSE;

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_user_otps_user_id ON c3_user_otps(user_id);
CREATE INDEX IF NOT EXISTS idx_security_questions_user_id ON c3_security_questions(user_id);