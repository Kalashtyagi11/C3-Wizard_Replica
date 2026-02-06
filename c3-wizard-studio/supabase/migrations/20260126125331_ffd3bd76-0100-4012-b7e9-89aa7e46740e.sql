-- =====================================================
-- C3 WIZARD PHASE 1: FOUNDATION TABLES (COMPLETE)
-- Proper order to avoid dependency issues
-- =====================================================

-- 1. Create app_role enum for user roles
CREATE TYPE public.app_role AS ENUM ('admin', 'employer', 'self_employed');

-- 2. c3_user_roles - Role management (security-first)
CREATE TABLE public.c3_user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role app_role NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  created_by UUID REFERENCES auth.users(id),
  UNIQUE (user_id, role)
);

ALTER TABLE public.c3_user_roles ENABLE ROW LEVEL SECURITY;

-- Security definer function to check roles (prevents RLS recursion)
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.c3_user_roles
    WHERE user_id = _user_id
      AND role = _role
  )
$$;

-- RLS for user_roles
CREATE POLICY "Users can view own roles"
  ON public.c3_user_roles FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Admins can manage all roles"
  ON public.c3_user_roles FOR ALL
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

-- 3. c3_profiles - User profiles linked to auth.users
CREATE TABLE public.c3_profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  first_name TEXT,
  last_name TEXT,
  middle_name TEXT,
  phone TEXT,
  mobile TEXT,
  is_active BOOLEAN DEFAULT TRUE,
  is_email_verified BOOLEAN DEFAULT FALSE,
  last_login_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ
);

ALTER TABLE public.c3_profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own profile"
  ON public.c3_profiles FOR SELECT
  TO authenticated
  USING (id = auth.uid());

CREATE POLICY "Users can update own profile"
  ON public.c3_profiles FOR UPDATE
  TO authenticated
  USING (id = auth.uid());

CREATE POLICY "Admins can view all profiles"
  ON public.c3_profiles FOR SELECT
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

-- Auto-create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.c3_profiles (id, email)
  VALUES (NEW.id, NEW.email);
  RETURN NEW;
END;
$$;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

-- 4. c3_system_rates - Core contribution rates
CREATE TABLE public.c3_system_rates (
  id SERIAL PRIMARY KEY,
  rate_code TEXT NOT NULL,
  rate_name TEXT NOT NULL,
  rate_value DECIMAL(5, 4) NOT NULL,
  applies_to TEXT NOT NULL,
  effective_from DATE NOT NULL,
  effective_to DATE,
  min_age INTEGER DEFAULT 16,
  max_age INTEGER DEFAULT 62,
  monthly_cap DECIMAL(18, 2),
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ
);

ALTER TABLE public.c3_system_rates ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read system rates"
  ON public.c3_system_rates FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Admins can manage system rates"
  ON public.c3_system_rates FOR ALL
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

-- 5. c3_levy_tiers - Progressive levy calculation tiers
CREATE TABLE public.c3_levy_tiers (
  id SERIAL PRIMARY KEY,
  tax_year INTEGER NOT NULL,
  tier_number INTEGER NOT NULL,
  min_amount DECIMAL(18, 2) NOT NULL,
  max_amount DECIMAL(18, 2),
  rate DECIMAL(5, 4) NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(tax_year, tier_number)
);

ALTER TABLE public.c3_levy_tiers ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read levy tiers"
  ON public.c3_levy_tiers FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Admins can manage levy tiers"
  ON public.c3_levy_tiers FOR ALL
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

-- 6. c3_december_bonus_exemptions
CREATE TABLE public.c3_december_bonus_exemptions (
  id SERIAL PRIMARY KEY,
  year INTEGER NOT NULL UNIQUE,
  ytd_threshold DECIMAL(18, 2) NOT NULL DEFAULT 28000.00,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.c3_december_bonus_exemptions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read exemptions"
  ON public.c3_december_bonus_exemptions FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Admins can manage exemptions"
  ON public.c3_december_bonus_exemptions FOR ALL
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

-- 7. c3_self_employed_settings
CREATE TABLE public.c3_self_employed_settings (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  effective_from DATE NOT NULL,
  effective_to DATE NOT NULL,
  is_locked BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.c3_self_employed_settings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read SE settings"
  ON public.c3_self_employed_settings FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Admins can manage SE settings"
  ON public.c3_self_employed_settings FOR ALL
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

-- 8. c3_wage_categories
CREATE TABLE public.c3_wage_categories (
  id SERIAL PRIMARY KEY,
  settings_id INTEGER REFERENCES public.c3_self_employed_settings(id),
  category_code TEXT NOT NULL,
  category_name TEXT NOT NULL,
  weekly_wage DECIMAL(18, 2) NOT NULL,
  monthly_wage DECIMAL(18, 2) NOT NULL,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.c3_wage_categories ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read wage categories"
  ON public.c3_wage_categories FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Admins can manage wage categories"
  ON public.c3_wage_categories FOR ALL
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

-- 9. c3_companies (NO policies yet - add after links table)
CREATE TABLE public.c3_companies (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  registration_number TEXT UNIQUE NOT NULL,
  company_name TEXT NOT NULL,
  trade_name TEXT,
  address_line_1 TEXT,
  address_line_2 TEXT,
  city TEXT,
  state_region TEXT,
  postal_code TEXT,
  country TEXT DEFAULT 'KN',
  phone TEXT,
  fax TEXT,
  email TEXT,
  website TEXT,
  business_type TEXT,
  industry TEXT,
  tin TEXT,
  vat_number TEXT,
  is_active BOOLEAN DEFAULT TRUE,
  status TEXT DEFAULT 'active',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  created_by UUID REFERENCES auth.users(id),
  updated_at TIMESTAMPTZ,
  updated_by UUID REFERENCES auth.users(id),
  is_deleted BOOLEAN DEFAULT FALSE
);

ALTER TABLE public.c3_companies ENABLE ROW LEVEL SECURITY;

-- 10. c3_employer_company_links (BEFORE companies policies)
CREATE TABLE public.c3_employer_company_links (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  company_id UUID REFERENCES public.c3_companies(id) ON DELETE CASCADE NOT NULL,
  is_primary BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, company_id)
);

ALTER TABLE public.c3_employer_company_links ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own links"
  ON public.c3_employer_company_links FOR SELECT
  TO authenticated
  USING (user_id = auth.uid() OR public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can manage all links"
  ON public.c3_employer_company_links FOR ALL
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

-- NOW add c3_companies policies (links table exists)
CREATE POLICY "Employers can view own company"
  ON public.c3_companies FOR SELECT
  TO authenticated
  USING (
    id IN (SELECT company_id FROM public.c3_employer_company_links WHERE user_id = auth.uid())
    OR public.has_role(auth.uid(), 'admin')
  );

CREATE POLICY "Admins can manage all companies"
  ON public.c3_companies FOR ALL
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

-- 11. c3_self_employed_profiles
CREATE TABLE public.c3_self_employed_profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  ssn TEXT UNIQUE NOT NULL,
  registration_number TEXT UNIQUE,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  middle_name TEXT,
  birth_date DATE NOT NULL,
  gender TEXT,
  marital_status TEXT,
  address_line_1 TEXT,
  address_line_2 TEXT,
  city TEXT,
  state_region TEXT,
  postal_code TEXT,
  country TEXT DEFAULT 'KN',
  phone TEXT,
  mobile TEXT,
  email TEXT,
  business_name TEXT,
  business_type TEXT,
  occupation TEXT,
  industry TEXT,
  tin TEXT,
  wage_category_id INTEGER REFERENCES public.c3_wage_categories(id),
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  created_by UUID REFERENCES auth.users(id),
  updated_at TIMESTAMPTZ,
  updated_by UUID REFERENCES auth.users(id),
  is_deleted BOOLEAN DEFAULT FALSE
);

ALTER TABLE public.c3_self_employed_profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Self-employed can view own profile"
  ON public.c3_self_employed_profiles FOR SELECT
  TO authenticated
  USING (user_id = auth.uid() OR public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Self-employed can update own profile"
  ON public.c3_self_employed_profiles FOR UPDATE
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Admins can manage all SE profiles"
  ON public.c3_self_employed_profiles FOR ALL
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

-- 12. c3_audit_logs
CREATE TABLE public.c3_audit_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id),
  action TEXT NOT NULL,
  resource_type TEXT NOT NULL,
  resource_id TEXT,
  old_values JSONB,
  new_values JSONB,
  ip_address TEXT,
  user_agent TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.c3_audit_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can view all logs"
  ON public.c3_audit_logs FOR SELECT
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "System can insert logs"
  ON public.c3_audit_logs FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- Indexes for performance
CREATE INDEX idx_user_roles_user_id ON public.c3_user_roles(user_id);
CREATE INDEX idx_profiles_email ON public.c3_profiles(email);
CREATE INDEX idx_system_rates_code ON public.c3_system_rates(rate_code);
CREATE INDEX idx_levy_tiers_year ON public.c3_levy_tiers(tax_year);
CREATE INDEX idx_companies_reg ON public.c3_companies(registration_number);
CREATE INDEX idx_companies_active ON public.c3_companies(is_active) WHERE is_deleted = FALSE;
CREATE INDEX idx_employer_links_user ON public.c3_employer_company_links(user_id);
CREATE INDEX idx_employer_links_company ON public.c3_employer_company_links(company_id);
CREATE INDEX idx_se_profiles_user ON public.c3_self_employed_profiles(user_id);
CREATE INDEX idx_se_profiles_ssn ON public.c3_self_employed_profiles(ssn);
CREATE INDEX idx_audit_logs_user ON public.c3_audit_logs(user_id);
CREATE INDEX idx_audit_logs_created ON public.c3_audit_logs(created_at DESC);