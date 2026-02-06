-- Drop ALL remaining tables in public schema
DO $$ 
DECLARE 
    r RECORD;
BEGIN
    -- Drop all RLS policies first
    FOR r IN (SELECT schemaname, tablename, policyname FROM pg_policies WHERE schemaname = 'public') LOOP
        EXECUTE format('DROP POLICY IF EXISTS %I ON %I.%I', r.policyname, r.schemaname, r.tablename);
    END LOOP;
    
    -- Drop all tables in public schema
    FOR r IN (SELECT tablename FROM pg_tables WHERE schemaname = 'public') LOOP
        EXECUTE format('DROP TABLE IF EXISTS public.%I CASCADE', r.tablename);
    END LOOP;
    
    -- Drop all custom types
    FOR r IN (SELECT typname FROM pg_type WHERE typnamespace = 'public'::regnamespace AND typtype = 'e') LOOP
        EXECUTE format('DROP TYPE IF EXISTS public.%I CASCADE', r.typname);
    END LOOP;
    
    -- Drop all functions in public schema
    FOR r IN (SELECT proname, oidvectortypes(proargtypes) as args FROM pg_proc WHERE pronamespace = 'public'::regnamespace) LOOP
        EXECUTE format('DROP FUNCTION IF EXISTS public.%I(%s) CASCADE', r.proname, r.args);
    END LOOP;
END $$;