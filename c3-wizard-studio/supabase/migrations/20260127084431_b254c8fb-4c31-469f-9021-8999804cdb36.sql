-- Allow authenticated users to create companies during registration
DO $$ 
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Authenticated users can create companies' AND tablename = 'c3_companies') THEN
    CREATE POLICY "Authenticated users can create companies" 
    ON c3_companies 
    FOR INSERT 
    WITH CHECK (auth.uid() = created_by);
  END IF;
END $$;

-- Allow users to insert their own self-employed profile
DO $$ 
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Users can create own self-employed profile' AND tablename = 'c3_self_employed_profiles') THEN
    CREATE POLICY "Users can create own self-employed profile" 
    ON c3_self_employed_profiles 
    FOR INSERT 
    WITH CHECK (auth.uid() = user_id);
  END IF;
END $$;