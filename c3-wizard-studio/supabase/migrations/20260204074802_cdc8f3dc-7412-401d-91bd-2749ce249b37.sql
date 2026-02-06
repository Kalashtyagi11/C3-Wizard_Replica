-- Add INSERT policy for c3_self_employed to allow self-registration
-- This matches the existing pattern for c3_companies registration

CREATE POLICY "Authenticated users can register as self-employed"
ON public.c3_self_employed
FOR INSERT
TO authenticated
WITH CHECK (true);

-- Also need SELECT policy for self-employed users to view their own data
-- Check if exists first by using CREATE OR REPLACE pattern via DROP IF EXISTS
DO $$
BEGIN
  -- Drop existing restrictive SELECT policy if it exists and recreate
  IF EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'public' 
    AND tablename = 'c3_self_employed' 
    AND policyname = 'Self-employed users can view their own profile'
  ) THEN
    DROP POLICY "Self-employed users can view their own profile" ON public.c3_self_employed;
  END IF;
END $$;

CREATE POLICY "Self-employed users can view their own profile"
ON public.c3_self_employed
FOR SELECT
TO authenticated
USING (
  id = public.get_user_self_employed_id(auth.uid())
  OR public.is_admin(auth.uid())
  OR email = (SELECT email FROM auth.users WHERE id = auth.uid())
);