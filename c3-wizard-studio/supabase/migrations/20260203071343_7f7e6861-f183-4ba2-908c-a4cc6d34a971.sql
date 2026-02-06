-- Drop and recreate the function to support username, email, OR registration number
DROP FUNCTION IF EXISTS public.lookup_email_by_username(TEXT);

CREATE OR REPLACE FUNCTION public.lookup_email_for_login(login_identifier TEXT)
RETURNS TEXT
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  found_email TEXT;
BEGIN
  -- First try: exact username match (case-insensitive)
  SELECT u.email INTO found_email
  FROM c3_users u
  WHERE LOWER(u.username) = LOWER(login_identifier)
    AND u.is_deleted = false
  LIMIT 1;
  
  IF found_email IS NOT NULL THEN
    RETURN found_email;
  END IF;
  
  -- Second try: registration number match (for employers)
  SELECT u.email INTO found_email
  FROM c3_users u
  JOIN c3_companies c ON u.company_id = c.id
  WHERE c.registration_number = login_identifier
    AND u.is_deleted = false
    AND c.is_deleted = false
  LIMIT 1;
  
  IF found_email IS NOT NULL THEN
    RETURN found_email;
  END IF;
  
  -- Third try: SSN match (for self-employed)
  SELECT u.email INTO found_email
  FROM c3_users u
  JOIN c3_self_employed se ON u.self_employed_id = se.id
  WHERE se.social_security_number = login_identifier
    AND u.is_deleted = false
    AND se.is_deleted = false
  LIMIT 1;
  
  RETURN found_email;
END;
$$;

-- Grant execute permission to anonymous users (for login)
GRANT EXECUTE ON FUNCTION public.lookup_email_for_login(TEXT) TO anon;
GRANT EXECUTE ON FUNCTION public.lookup_email_for_login(TEXT) TO authenticated;