-- Fix: allow authenticated inserts into c3_companies when id is generated via sequence
-- Without this, inserts fail with: permission denied for sequence c3_companies_id_seq

GRANT USAGE, SELECT, UPDATE ON SEQUENCE public.c3_companies_id_seq TO authenticated;

-- (Safe redundancy) Ensure table-level privileges exist for the app role
GRANT SELECT, INSERT, UPDATE ON TABLE public.c3_companies TO authenticated;