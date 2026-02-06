-- Fix: ensure DB privileges exist for PostgREST access
-- (RLS policies control row access; GRANT controls whether the role can touch the table at all)

GRANT INSERT ON TABLE public.c3_self_employed TO authenticated;
GRANT SELECT ON TABLE public.c3_self_employed TO authenticated;

-- Optional but helpful for consistency if the UI reads after insert
-- (no UPDATE/DELETE grants added here)
