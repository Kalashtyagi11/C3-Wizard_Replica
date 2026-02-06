-- Add RLS policy to allow public read access to wage categories for registration
-- This is required because the registration form needs to populate the dropdown before a user is created

CREATE POLICY "Allow public read access to wage categories"
ON public.c3_wage_categories
FOR SELECT
USING (true);
