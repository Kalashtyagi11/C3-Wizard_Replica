-- Remove unique constraint on auth_user_id to allow multiple c3_users to share the same auth account
-- This supports the business case where one person (same email) manages multiple companies
ALTER TABLE public.c3_users DROP CONSTRAINT IF EXISTS c3_users_auth_user_id_key;