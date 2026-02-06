-- Create c3_levy_tiers table (missing from schema)
CREATE TABLE IF NOT EXISTS public.c3_levy_tiers (
  id SERIAL PRIMARY KEY,
  tax_year INTEGER NOT NULL,
  tier_number INTEGER NOT NULL,
  min_amount DECIMAL(18, 2) NOT NULL,
  max_amount DECIMAL(18, 2),
  rate DECIMAL(10, 4) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  CONSTRAINT c3_levy_tiers_year_tier_unique UNIQUE (tax_year, tier_number)
);

-- Add last_login_at to c3_profiles if not exists
ALTER TABLE public.c3_profiles 
ADD COLUMN IF NOT EXISTS last_login_at TIMESTAMP WITH TIME ZONE;

-- Enable RLS
ALTER TABLE public.c3_levy_tiers ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for c3_levy_tiers (read-only for all authenticated users)
CREATE POLICY "Authenticated users can view levy tiers"
ON public.c3_levy_tiers
FOR SELECT
TO authenticated
USING (true);

CREATE POLICY "Admins can manage levy tiers"
ON public.c3_levy_tiers
FOR ALL
USING (
  EXISTS (
    SELECT 1 FROM public.c3_user_roles
    WHERE user_id = auth.uid()
    AND role = 'admin'
  )
);

-- Create index for common queries
CREATE INDEX IF NOT EXISTS idx_levy_tiers_year ON public.c3_levy_tiers(tax_year);