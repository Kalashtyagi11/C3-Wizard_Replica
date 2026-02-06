-- Add missing columns for Employment Insurance (EI) contributions
ALTER TABLE public.c3_contribution_details 
ADD COLUMN IF NOT EXISTS ei_employee NUMERIC(18,2) DEFAULT 0,
ADD COLUMN IF NOT EXISTS ei_employer NUMERIC(18,2) DEFAULT 0;

-- Add missing totals to headers
ALTER TABLE public.c3_contribution_headers
ADD COLUMN IF NOT EXISTS total_ei_employee NUMERIC(18,2) DEFAULT 0,
ADD COLUMN IF NOT EXISTS total_ei_employer NUMERIC(18,2) DEFAULT 0,
ADD COLUMN IF NOT EXISTS total_ss_employee NUMERIC(18,2) DEFAULT 0,
ADD COLUMN IF NOT EXISTS total_ss_employer NUMERIC(18,2) DEFAULT 0,
ADD COLUMN IF NOT EXISTS total_pe_employee NUMERIC(18,2) DEFAULT 0,
ADD COLUMN IF NOT EXISTS total_pe_employer NUMERIC(18,2) DEFAULT 0,
ADD COLUMN IF NOT EXISTS total_holiday_pay NUMERIC(18,2) DEFAULT 0,
ADD COLUMN IF NOT EXISTS total_bonus NUMERIC(18,2) DEFAULT 0,
ADD COLUMN IF NOT EXISTS grand_total NUMERIC(18,2) DEFAULT 0,
ADD COLUMN IF NOT EXISTS employee_count INTEGER DEFAULT 0;

-- Comments for clarity
COMMENT ON COLUMN public.c3_contribution_details.ei_employee IS 'Employment Insurance - Employee contribution (1% capped at $150)';
COMMENT ON COLUMN public.c3_contribution_details.ei_employer IS 'Employment Insurance - Employer contribution (1% capped at $150)';