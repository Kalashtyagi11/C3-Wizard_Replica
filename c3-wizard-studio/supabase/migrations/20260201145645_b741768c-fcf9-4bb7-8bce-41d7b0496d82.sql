-- Tighten c3_users RLS: remove overly-broad SELECT policy and allow only self lookup

ALTER TABLE public.c3_users ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Authenticated users can read for role lookup" ON public.c3_users;
DROP POLICY IF EXISTS "Users can view own record by email" ON public.c3_users;
DROP POLICY IF EXISTS "Users can view own record by auth_user_id" ON public.c3_users;

-- Allow authenticated users to read ONLY their own row (preferred: by auth_user_id)
CREATE POLICY "Users can view own record by auth_user_id"
ON public.c3_users
FOR SELECT
TO authenticated
USING (auth_user_id = auth.uid());

-- Optional fallback for legacy flows: allow read by JWT email
CREATE POLICY "Users can view own record by email"
ON public.c3_users
FOR SELECT
TO authenticated
USING (email = auth.jwt() ->> 'email');
