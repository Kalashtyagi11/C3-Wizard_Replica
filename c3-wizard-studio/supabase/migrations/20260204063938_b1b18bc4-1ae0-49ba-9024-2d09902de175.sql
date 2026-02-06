-- Enable RLS on c3_wage_categories (policy already exists but RLS was not enabled)
ALTER TABLE public.c3_wage_categories ENABLE ROW LEVEL SECURITY;

-- Grant SELECT to anon and authenticated roles for the table
GRANT SELECT ON public.c3_wage_categories TO anon, authenticated;