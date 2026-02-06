-- =============================================
-- PHASE 3: C3 CONTRIBUTION TABLES
-- Creates c3_contribution_headers and c3_contribution_details
-- =============================================

-- C3 Contribution Headers (one per company per month)
CREATE TABLE public.c3_contribution_headers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  -- Foreign Keys
  company_id UUID REFERENCES public.c3_companies(id),
  user_id UUID REFERENCES auth.users(id),
  self_employed_profile_id UUID REFERENCES public.c3_self_employed_profiles(id),
  
  -- Period
  month INTEGER NOT NULL CHECK (month >= 1 AND month <= 12),
  year INTEGER NOT NULL CHECK (year >= 2000 AND year <= 2100),
  
  -- Type Flags
  is_self_employed BOOLEAN DEFAULT FALSE,
  is_director BOOLEAN DEFAULT FALSE,
  is_nil_return BOOLEAN DEFAULT FALSE,
  
  -- Schedule Number (BIMA-assigned)
  schedule_number INTEGER,
  
  -- Employee/Contributor Counts
  total_employees INTEGER DEFAULT 0,
  
  -- Wage Totals
  total_wages DECIMAL(18, 2) DEFAULT 0.00,
  total_holiday_pay DECIMAL(18, 2) DEFAULT 0.00,
  total_bonus DECIMAL(18, 2) DEFAULT 0.00,
  
  -- Contribution Totals (Employee)
  total_ss_employee DECIMAL(18, 2) DEFAULT 0.00,
  total_ei_employee DECIMAL(18, 2) DEFAULT 0.00,
  total_levy_employee DECIMAL(18, 2) DEFAULT 0.00,
  total_pe_employee DECIMAL(18, 2) DEFAULT 0.00,
  
  -- Contribution Totals (Employer)
  total_ss_employer DECIMAL(18, 2) DEFAULT 0.00,
  total_ei_employer DECIMAL(18, 2) DEFAULT 0.00,
  total_levy_employer DECIMAL(18, 2) DEFAULT 0.00,
  total_pe_employer DECIMAL(18, 2) DEFAULT 0.00,
  
  -- Penalty Totals
  total_ss_penalty DECIMAL(18, 2) DEFAULT 0.00,
  total_levy_penalty DECIMAL(18, 2) DEFAULT 0.00,
  total_pe_penalty DECIMAL(18, 2) DEFAULT 0.00,
  
  -- Grand Total
  grand_total DECIMAL(18, 2) DEFAULT 0.00,
  
  -- Status
  status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'finalized', 'submitted', 'paid')),
  finalized_at TIMESTAMPTZ,
  finalized_by UUID REFERENCES auth.users(id),
  
  -- BIMA Submission
  is_submitted BOOLEAN DEFAULT FALSE,
  submitted_at TIMESTAMPTZ,
  submitted_by UUID REFERENCES auth.users(id),
  bima_submit_response JSONB,
  
  -- Payment
  is_paid BOOLEAN DEFAULT FALSE,
  paid_at TIMESTAMPTZ,
  payment_reference TEXT,
  
  -- Audit Columns
  created_at TIMESTAMPTZ DEFAULT NOW(),
  created_by UUID REFERENCES auth.users(id),
  updated_at TIMESTAMPTZ,
  updated_by UUID REFERENCES auth.users(id),
  is_deleted BOOLEAN DEFAULT FALSE,
  
  -- Unique constraint: One C3 per company/self-employed per month
  UNIQUE NULLS NOT DISTINCT (company_id, month, year, is_director),
  UNIQUE NULLS NOT DISTINCT (self_employed_profile_id, month, year)
);

-- C3 Contribution Details (one per employee per C3)
CREATE TABLE public.c3_contribution_details (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  -- Foreign Keys
  c3_header_id UUID NOT NULL REFERENCES public.c3_contribution_headers(id) ON DELETE CASCADE,
  employee_id UUID REFERENCES public.c3_employees(id),
  company_id UUID REFERENCES public.c3_companies(id),
  
  -- Employee Info (denormalized for historical record)
  ssn TEXT NOT NULL,
  first_name TEXT,
  last_name TEXT,
  birth_date DATE,
  pay_period TEXT CHECK (pay_period IN ('W', 'E2W', 'M', '2M')),
  
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
  
  -- Holiday Pay Distribution (across weeks)
  holiday_pay_week_1 DECIMAL(18, 2) DEFAULT 0.00,
  holiday_pay_week_2 DECIMAL(18, 2) DEFAULT 0.00,
  holiday_pay_week_3 DECIMAL(18, 2) DEFAULT 0.00,
  holiday_pay_week_4 DECIMAL(18, 2) DEFAULT 0.00,
  holiday_pay_week_5 DECIMAL(18, 2) DEFAULT 0.00,
  
  -- Totals
  total_wages DECIMAL(18, 2) DEFAULT 0.00,
  total_wages_plus_holiday DECIMAL(18, 2) DEFAULT 0.00,
  total_wages_plus_holiday_plus_bonus DECIMAL(18, 2) DEFAULT 0.00,
  
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
  
  -- Subtotals
  employee_total DECIMAL(18, 2) DEFAULT 0.00,
  employer_total DECIMAL(18, 2) DEFAULT 0.00,
  grand_total DECIMAL(18, 2) DEFAULT 0.00,
  
  -- Special Flags
  is_levy_exempt BOOLEAN DEFAULT FALSE,
  is_december_bonus_exempt BOOLEAN DEFAULT FALSE,
  
  -- Employment Dates
  date_joined DATE,
  date_terminated DATE,
  
  -- Submission Status
  is_submitted BOOLEAN DEFAULT FALSE,
  submitted_at TIMESTAMPTZ,
  
  -- Audit Columns
  created_at TIMESTAMPTZ DEFAULT NOW(),
  created_by UUID REFERENCES auth.users(id),
  updated_at TIMESTAMPTZ,
  updated_by UUID REFERENCES auth.users(id),
  is_deleted BOOLEAN DEFAULT FALSE
);

-- Indexes for performance
CREATE INDEX idx_c3_headers_company_id ON public.c3_contribution_headers(company_id);
CREATE INDEX idx_c3_headers_self_employed ON public.c3_contribution_headers(self_employed_profile_id);
CREATE INDEX idx_c3_headers_period ON public.c3_contribution_headers(month, year);
CREATE INDEX idx_c3_headers_status ON public.c3_contribution_headers(status);
CREATE INDEX idx_c3_headers_is_deleted ON public.c3_contribution_headers(is_deleted);

CREATE INDEX idx_c3_details_header_id ON public.c3_contribution_details(c3_header_id);
CREATE INDEX idx_c3_details_employee_id ON public.c3_contribution_details(employee_id);
CREATE INDEX idx_c3_details_company_id ON public.c3_contribution_details(company_id);
CREATE INDEX idx_c3_details_ssn ON public.c3_contribution_details(ssn);

-- Enable RLS
ALTER TABLE public.c3_contribution_headers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.c3_contribution_details ENABLE ROW LEVEL SECURITY;

-- RLS Policies for c3_contribution_headers

-- Admins can manage all C3 headers
CREATE POLICY "Admins can manage all C3 headers"
  ON public.c3_contribution_headers
  FOR ALL
  USING (has_role(auth.uid(), 'admin'));

-- Employers can view C3s for their linked companies
CREATE POLICY "Employers can view own C3 headers"
  ON public.c3_contribution_headers
  FOR SELECT
  USING (
    company_id IN (
      SELECT company_id FROM public.c3_employer_company_links 
      WHERE user_id = auth.uid()
    )
    OR has_role(auth.uid(), 'admin')
  );

-- Employers can create C3s for their linked companies
CREATE POLICY "Employers can create C3 headers"
  ON public.c3_contribution_headers
  FOR INSERT
  WITH CHECK (
    company_id IN (
      SELECT company_id FROM public.c3_employer_company_links 
      WHERE user_id = auth.uid()
    )
    OR has_role(auth.uid(), 'admin')
  );

-- Employers can update C3s for their linked companies (only draft status)
CREATE POLICY "Employers can update own C3 headers"
  ON public.c3_contribution_headers
  FOR UPDATE
  USING (
    (company_id IN (
      SELECT company_id FROM public.c3_employer_company_links 
      WHERE user_id = auth.uid()
    ) AND status = 'draft')
    OR has_role(auth.uid(), 'admin')
  );

-- Self-employed can manage their own C3s
CREATE POLICY "Self-employed can manage own C3 headers"
  ON public.c3_contribution_headers
  FOR ALL
  USING (
    self_employed_profile_id IN (
      SELECT id FROM public.c3_self_employed_profiles 
      WHERE user_id = auth.uid()
    )
  );

-- RLS Policies for c3_contribution_details

-- Admins can manage all C3 details
CREATE POLICY "Admins can manage all C3 details"
  ON public.c3_contribution_details
  FOR ALL
  USING (has_role(auth.uid(), 'admin'));

-- Employers can view C3 details for their linked companies
CREATE POLICY "Employers can view own C3 details"
  ON public.c3_contribution_details
  FOR SELECT
  USING (
    company_id IN (
      SELECT company_id FROM public.c3_employer_company_links 
      WHERE user_id = auth.uid()
    )
    OR has_role(auth.uid(), 'admin')
  );

-- Employers can create C3 details for their linked companies
CREATE POLICY "Employers can create C3 details"
  ON public.c3_contribution_details
  FOR INSERT
  WITH CHECK (
    company_id IN (
      SELECT company_id FROM public.c3_employer_company_links 
      WHERE user_id = auth.uid()
    )
    OR has_role(auth.uid(), 'admin')
  );

-- Employers can update C3 details for draft C3s
CREATE POLICY "Employers can update own C3 details"
  ON public.c3_contribution_details
  FOR UPDATE
  USING (
    company_id IN (
      SELECT company_id FROM public.c3_employer_company_links 
      WHERE user_id = auth.uid()
    )
    OR has_role(auth.uid(), 'admin')
  );

-- Triggers for updated_at
CREATE OR REPLACE FUNCTION public.update_c3_header_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  NEW.updated_by = auth.uid();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

CREATE TRIGGER trigger_c3_headers_updated_at
  BEFORE UPDATE ON public.c3_contribution_headers
  FOR EACH ROW
  EXECUTE FUNCTION public.update_c3_header_updated_at();

CREATE OR REPLACE FUNCTION public.update_c3_detail_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  NEW.updated_by = auth.uid();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

CREATE TRIGGER trigger_c3_details_updated_at
  BEFORE UPDATE ON public.c3_contribution_details
  FOR EACH ROW
  EXECUTE FUNCTION public.update_c3_detail_updated_at();

-- Comments
COMMENT ON TABLE public.c3_contribution_headers IS 'C3 form headers - one per company/self-employed per month';
COMMENT ON TABLE public.c3_contribution_details IS 'C3 form line items - one per employee per C3';