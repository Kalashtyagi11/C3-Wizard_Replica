-- Create a function to execute raw SQL (for data migration only)
-- This function is security-sensitive and should only be used for migration
CREATE OR REPLACE FUNCTION public.exec_sql(sql_query TEXT)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  EXECUTE sql_query;
END;
$$;

-- Restrict access to service role only
REVOKE ALL ON FUNCTION public.exec_sql(TEXT) FROM PUBLIC;
REVOKE ALL ON FUNCTION public.exec_sql(TEXT) FROM anon;
REVOKE ALL ON FUNCTION public.exec_sql(TEXT) FROM authenticated;

COMMENT ON FUNCTION public.exec_sql IS 'MIGRATION ONLY: Executes raw SQL. Restricted to service role.';