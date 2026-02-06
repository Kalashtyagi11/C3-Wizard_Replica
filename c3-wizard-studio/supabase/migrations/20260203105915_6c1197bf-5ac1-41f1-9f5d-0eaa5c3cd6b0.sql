-- =====================================================
-- FIX: Enable RLS and add policies for employer registration
-- =====================================================

-- 1. Enable RLS on c3_companies
ALTER TABLE public.c3_companies ENABLE ROW LEVEL SECURITY;

-- 2. Enable RLS on c3_employees  
ALTER TABLE public.c3_employees ENABLE ROW LEVEL SECURITY;

-- 3. Create helper function to check user role (SECURITY DEFINER to avoid recursion)
CREATE OR REPLACE FUNCTION public.get_user_role_id(user_auth_id uuid)
RETURNS integer
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT role_id FROM public.c3_users WHERE auth_user_id = user_auth_id LIMIT 1;
$$;

-- 4. Create helper function to get user's company_id
CREATE OR REPLACE FUNCTION public.get_user_company_id(user_auth_id uuid)
RETURNS integer
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT company_id FROM public.c3_users WHERE auth_user_id = user_auth_id LIMIT 1;
$$;

-- 5. RLS Policies for c3_companies

-- Authenticated users can INSERT their own company (during registration)
CREATE POLICY "Authenticated users can create company during registration"
ON public.c3_companies FOR INSERT
TO authenticated
WITH CHECK (true);

-- Users can view their own company
CREATE POLICY "Users can view own company"
ON public.c3_companies FOR SELECT
TO authenticated
USING (
  id = public.get_user_company_id(auth.uid())
  OR public.get_user_role_id(auth.uid()) IN (13, 14, 18, 19, 20, 21, 22, 24) -- Admin roles
);

-- Users can update their own company
CREATE POLICY "Users can update own company"
ON public.c3_companies FOR UPDATE
TO authenticated
USING (
  id = public.get_user_company_id(auth.uid())
  OR public.get_user_role_id(auth.uid()) IN (13, 14, 18, 19, 20, 21, 22, 24)
);

-- 6. RLS Policies for c3_employees

-- Employers can view employees of their company
CREATE POLICY "Users can view employees of own company"
ON public.c3_employees FOR SELECT
TO authenticated
USING (
  company_id = public.get_user_company_id(auth.uid())
  OR public.get_user_role_id(auth.uid()) IN (13, 14, 18, 19, 20, 21, 22, 24)
);

-- Employers can create employees for their company
CREATE POLICY "Users can create employees for own company"
ON public.c3_employees FOR INSERT
TO authenticated
WITH CHECK (
  company_id = public.get_user_company_id(auth.uid())
  OR public.get_user_role_id(auth.uid()) IN (13, 14, 18, 19, 20, 21, 22, 24)
);

-- Employers can update employees of their company
CREATE POLICY "Users can update employees of own company"
ON public.c3_employees FOR UPDATE
TO authenticated
USING (
  company_id = public.get_user_company_id(auth.uid())
  OR public.get_user_role_id(auth.uid()) IN (13, 14, 18, 19, 20, 21, 22, 24)
);

-- Employers can soft-delete employees of their company
CREATE POLICY "Users can delete employees of own company"
ON public.c3_employees FOR DELETE
TO authenticated
USING (
  company_id = public.get_user_company_id(auth.uid())
  OR public.get_user_role_id(auth.uid()) IN (13, 14, 18, 19, 20, 21, 22, 24)
);

-- 7. Update c3_users policies to allow INSERT during registration
CREATE POLICY "Users can create own c3_users record during registration"
ON public.c3_users FOR INSERT
TO authenticated
WITH CHECK (auth_user_id = auth.uid());

-- 8. Allow users to update their own c3_users record
CREATE POLICY "Users can update own c3_users record"
ON public.c3_users FOR UPDATE
TO authenticated
USING (auth_user_id = auth.uid());

-- 9. Grant necessary permissions
GRANT USAGE ON SCHEMA public TO authenticated;
GRANT SELECT, INSERT, UPDATE ON public.c3_companies TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.c3_employees TO authenticated;
GRANT SELECT, INSERT, UPDATE ON public.c3_users TO authenticated;
GRANT EXECUTE ON FUNCTION public.get_user_role_id(uuid) TO authenticated;
GRANT EXECUTE ON FUNCTION public.get_user_company_id(uuid) TO authenticated;