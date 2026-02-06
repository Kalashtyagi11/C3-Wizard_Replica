-- =============================================
-- PHASE 2: EMPLOYEES TABLE
-- Creates c3_employees with proper RLS for employers
-- =============================================

-- Employees table for company employee records
CREATE TABLE public.c3_employees (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  -- Foreign Keys
  company_id UUID NOT NULL REFERENCES public.c3_companies(id) ON DELETE CASCADE,
  
  -- Employee Identification
  employee_code TEXT,
  ssn TEXT NOT NULL,
  tin TEXT,
  
  -- Personal Information
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  middle_name TEXT,
  birth_date DATE NOT NULL,
  gender TEXT CHECK (gender IN ('M', 'F')),
  marital_status TEXT CHECK (marital_status IN ('S', 'M', 'D', 'W')),
  
  -- Contact Information
  address_line_1 TEXT,
  address_line_2 TEXT,
  city TEXT,
  state_region TEXT,
  postal_code TEXT,
  country TEXT DEFAULT 'KN',
  phone TEXT,
  mobile TEXT,
  email TEXT,
  
  -- Employment Details
  employee_type TEXT DEFAULT 'employee' CHECK (employee_type IN ('employee', 'director', 'both')),
  is_director_only BOOLEAN DEFAULT FALSE,
  is_employee_director BOOLEAN DEFAULT FALSE,
  occupation TEXT,
  department TEXT,
  
  -- Pay Information
  pay_period TEXT NOT NULL CHECK (pay_period IN ('W', 'E2W', 'M', '2M')),
  annual_salary DECIMAL(18, 2),
  
  -- Dates
  hire_date DATE,
  termination_date DATE,
  
  -- Contribution Settings
  is_levy_exempt BOOLEAN DEFAULT FALSE,
  
  -- Status
  is_active BOOLEAN DEFAULT TRUE,
  
  -- Audit Columns
  created_at TIMESTAMPTZ DEFAULT NOW(),
  created_by UUID REFERENCES auth.users(id),
  updated_at TIMESTAMPTZ,
  updated_by UUID REFERENCES auth.users(id),
  is_deleted BOOLEAN DEFAULT FALSE,
  
  -- Constraints
  UNIQUE(company_id, ssn)
);

-- Indexes for performance
CREATE INDEX idx_employees_company_id ON public.c3_employees(company_id);
CREATE INDEX idx_employees_ssn ON public.c3_employees(ssn);
CREATE INDEX idx_employees_employee_code ON public.c3_employees(employee_code);
CREATE INDEX idx_employees_is_active ON public.c3_employees(is_active);
CREATE INDEX idx_employees_is_deleted ON public.c3_employees(is_deleted);

-- Enable RLS
ALTER TABLE public.c3_employees ENABLE ROW LEVEL SECURITY;

-- RLS Policies

-- Admins can manage all employees
CREATE POLICY "Admins can manage all employees"
  ON public.c3_employees
  FOR ALL
  USING (has_role(auth.uid(), 'admin'));

-- Employers can view employees in their linked companies
CREATE POLICY "Employers can view own employees"
  ON public.c3_employees
  FOR SELECT
  USING (
    company_id IN (
      SELECT company_id FROM public.c3_employer_company_links 
      WHERE user_id = auth.uid()
    )
    OR has_role(auth.uid(), 'admin')
  );

-- Employers can insert employees in their linked companies
CREATE POLICY "Employers can add employees"
  ON public.c3_employees
  FOR INSERT
  WITH CHECK (
    company_id IN (
      SELECT company_id FROM public.c3_employer_company_links 
      WHERE user_id = auth.uid()
    )
    OR has_role(auth.uid(), 'admin')
  );

-- Employers can update employees in their linked companies
CREATE POLICY "Employers can update own employees"
  ON public.c3_employees
  FOR UPDATE
  USING (
    company_id IN (
      SELECT company_id FROM public.c3_employer_company_links 
      WHERE user_id = auth.uid()
    )
    OR has_role(auth.uid(), 'admin')
  );

-- Trigger for updated_at timestamp
CREATE OR REPLACE FUNCTION public.update_employee_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  NEW.updated_by = auth.uid();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

CREATE TRIGGER trigger_employees_updated_at
  BEFORE UPDATE ON public.c3_employees
  FOR EACH ROW
  EXECUTE FUNCTION public.update_employee_updated_at();

-- Comments for documentation
COMMENT ON TABLE public.c3_employees IS 'Employee records for companies';
COMMENT ON COLUMN public.c3_employees.ssn IS 'Social Security Number';
COMMENT ON COLUMN public.c3_employees.pay_period IS 'W=Weekly, E2W=Biweekly, M=Monthly, 2M=Twice Monthly';
COMMENT ON COLUMN public.c3_employees.employee_type IS 'employee, director, or both';
COMMENT ON COLUMN public.c3_employees.is_director_only IS 'Non-working director (no wages)';
COMMENT ON COLUMN public.c3_employees.is_employee_director IS 'Working director (receives wages)';