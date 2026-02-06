-- Create a secure function that allows username-to-email lookup for login
-- This function runs with SECURITY DEFINER so it can bypass RLS
CREATE OR REPLACE FUNCTION public.lookup_email_by_username(lookup_username TEXT)
RETURNS TEXT
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  found_email TEXT;
BEGIN
  -- Case-insensitive username lookup
  SELECT email INTO found_email
  FROM c3_users
  WHERE LOWER(username) = LOWER(lookup_username)
    AND is_deleted = false
  LIMIT 1;
  
  RETURN found_email;
END;
$$;

-- Grant execute permission to anonymous users (for login)
GRANT EXECUTE ON FUNCTION public.lookup_email_by_username(TEXT) TO anon;
GRANT EXECUTE ON FUNCTION public.lookup_email_by_username(TEXT) TO authenticated;