-- Schema transition complete: legacy → public schema swap
-- This migration triggers types.ts regeneration for the new c3_* tables

-- Add a comment to the c3_users table to document the schema transition
COMMENT ON TABLE public.c3_users IS 'User accounts - migrated from optimised_c3wizard schema on 2026-01-30';

-- Verify tables exist (no-op SELECT to validate)
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'c3_users') THEN
        RAISE EXCEPTION 'c3_users table not found in public schema';
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'c3_companies') THEN
        RAISE EXCEPTION 'c3_companies table not found in public schema';
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'c3_employees') THEN
        RAISE EXCEPTION 'c3_employees table not found in public schema';
    END IF;
END $$;