-- Create a function that adds custom claims to the JWT token
-- This is called automatically by Supabase during token generation
CREATE OR REPLACE FUNCTION public.custom_access_token_hook(event jsonb)
RETURNS jsonb
LANGUAGE plpgsql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  claims jsonb;
  user_role_id integer;
  user_type text;
  user_company_id integer;
  user_self_employed_id integer;
BEGIN
  -- Fetch user's role and type from c3_users
  SELECT 
    role_id,
    user_type,
    company_id,
    self_employed_id
  INTO 
    user_role_id,
    user_type,
    user_company_id,
    user_self_employed_id
  FROM public.c3_users
  WHERE auth_user_id = (event->>'user_id')::uuid
    AND is_deleted = false
  LIMIT 1;

  -- Get existing claims
  claims := event->'claims';

  -- Add our custom claims
  IF user_role_id IS NOT NULL THEN
    claims := jsonb_set(claims, '{role_id}', to_jsonb(user_role_id));
    claims := jsonb_set(claims, '{user_type}', to_jsonb(user_type));
    
    IF user_company_id IS NOT NULL THEN
      claims := jsonb_set(claims, '{company_id}', to_jsonb(user_company_id));
    END IF;
    
    IF user_self_employed_id IS NOT NULL THEN
      claims := jsonb_set(claims, '{self_employed_id}', to_jsonb(user_self_employed_id));
    END IF;
  END IF;

  -- Return the modified event with updated claims
  RETURN jsonb_set(event, '{claims}', claims);
END;
$$;

-- Grant execute permission to supabase_auth_admin (required for the hook)
GRANT EXECUTE ON FUNCTION public.custom_access_token_hook TO supabase_auth_admin;

-- Revoke from public for security
REVOKE EXECUTE ON FUNCTION public.custom_access_token_hook FROM public;
REVOKE EXECUTE ON FUNCTION public.custom_access_token_hook FROM anon;
REVOKE EXECUTE ON FUNCTION public.custom_access_token_hook FROM authenticated;