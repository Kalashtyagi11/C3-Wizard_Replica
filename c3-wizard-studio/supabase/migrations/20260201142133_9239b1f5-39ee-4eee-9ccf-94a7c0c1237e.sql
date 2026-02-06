-- Enable RLS on c3_users if not already enabled
ALTER TABLE c3_users ENABLE ROW LEVEL SECURITY;

-- Allow authenticated users to read their own c3_users record by email
CREATE POLICY "Users can view own record by email" ON c3_users
  FOR SELECT
  TO authenticated
  USING (email = auth.jwt() ->> 'email');

-- Allow authenticated users to read c3_users for role lookup
CREATE POLICY "Authenticated users can read for role lookup" ON c3_users
  FOR SELECT
  TO authenticated
  USING (true);