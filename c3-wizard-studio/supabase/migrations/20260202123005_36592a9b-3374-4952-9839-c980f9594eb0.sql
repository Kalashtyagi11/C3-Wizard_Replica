-- Grant schema usage to authenticated users
GRANT USAGE ON SCHEMA public TO authenticated;
GRANT USAGE ON SCHEMA public TO anon;

-- Grant SELECT on tables needed for auth/permissions
GRANT SELECT ON public.c3_users TO authenticated;
GRANT SELECT ON public.c3_roles TO authenticated;
GRANT SELECT ON public.c3_modules TO authenticated;
GRANT SELECT ON public.c3_user_permissions TO authenticated;
GRANT SELECT ON public.c3_user_granular_permissions TO authenticated;

-- Also grant UPDATE on c3_users for linking auth_user_id during migration
GRANT UPDATE (auth_user_id, last_login_at, last_login_ip) ON public.c3_users TO authenticated;

-- Create migration tracking table
CREATE TABLE IF NOT EXISTS public.c3_migration_logs (
  id SERIAL PRIMARY KEY,
  c3_user_id INTEGER REFERENCES public.c3_users(id),
  email VARCHAR(255),
  status VARCHAR(50), -- 'success', 'failed', 'skipped'
  error_message TEXT,
  auth_user_id UUID,
  migrated_at TIMESTAMPTZ DEFAULT now()
);

-- No RLS needed - admin access only via service role
COMMENT ON TABLE public.c3_migration_logs IS 'Tracks legacy user migration to Supabase Auth';