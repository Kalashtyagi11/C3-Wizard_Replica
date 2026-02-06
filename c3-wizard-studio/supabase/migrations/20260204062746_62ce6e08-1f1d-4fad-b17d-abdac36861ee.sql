-- Add proper weekly_income and weekly_contribution columns to c3_wage_categories
-- Currently min_wage stores WeeklyIncome and max_wage stores WeeklyContribution (confusing naming)

ALTER TABLE public.c3_wage_categories
ADD COLUMN IF NOT EXISTS weekly_income NUMERIC(18, 4),
ADD COLUMN IF NOT EXISTS weekly_contribution NUMERIC(18, 4),
ADD COLUMN IF NOT EXISTS is_locked BOOLEAN DEFAULT TRUE,
ADD COLUMN IF NOT EXISTS settings_id INTEGER;

-- Migrate data from incorrectly named columns to correct ones
-- min_wage actually contains weekly_income, max_wage contains weekly_contribution
UPDATE public.c3_wage_categories
SET 
  weekly_income = min_wage,
  weekly_contribution = max_wage
WHERE weekly_income IS NULL AND min_wage IS NOT NULL;

-- Create index on category_code for faster lookups
CREATE INDEX IF NOT EXISTS idx_wage_categories_code ON public.c3_wage_categories(category_code);

COMMENT ON COLUMN public.c3_wage_categories.weekly_income IS 'Weekly income amount for this wage category';
COMMENT ON COLUMN public.c3_wage_categories.weekly_contribution IS 'Weekly contribution amount for this wage category';
COMMENT ON COLUMN public.c3_wage_categories.is_locked IS 'Whether this category is active/locked (equivalent to legacy IsLocked=1)';