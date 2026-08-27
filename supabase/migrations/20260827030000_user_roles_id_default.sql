-- Live user_roles.id is NOT NULL but missing DEFAULT — inserts without id fail.
-- Safe to re-run.

ALTER TABLE public.user_roles
  ALTER COLUMN id SET DEFAULT gen_random_uuid();
