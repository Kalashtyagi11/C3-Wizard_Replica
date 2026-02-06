-- Step 2: Drop trigger, function, type, and then extra tables

-- Drop trigger first
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

-- Drop function that creates profiles
DROP FUNCTION IF EXISTS public.handle_new_user();

-- Drop has_role function (no longer has dependencies)
DROP FUNCTION IF EXISTS public.has_role(uuid, app_role);

-- Drop c3_user_roles table first (depends on app_role)
DROP TABLE IF EXISTS c3_user_roles CASCADE;

-- Drop app_role type
DROP TYPE IF EXISTS app_role CASCADE;

-- Now drop all extra tables that don't exist in MS SQL
DROP TABLE IF EXISTS c3_profiles CASCADE;
DROP TABLE IF EXISTS c3_announcements CASCADE;
DROP TABLE IF EXISTS c3_bima_submissions CASCADE;
DROP TABLE IF EXISTS c3_employer_company_links CASCADE;
DROP TABLE IF EXISTS c3_faq CASCADE;
DROP TABLE IF EXISTS c3_file_uploads CASCADE;
DROP TABLE IF EXISTS c3_levy_tiers CASCADE;
DROP TABLE IF EXISTS c3_notifications CASCADE;
DROP TABLE IF EXISTS c3_payment_reconciliation CASCADE;
DROP TABLE IF EXISTS c3_payment_reconciliation_details CASCADE;
DROP TABLE IF EXISTS c3_penalty_rates CASCADE;
DROP TABLE IF EXISTS c3_reporting_periods CASCADE;
DROP TABLE IF EXISTS c3_security_questions CASCADE;