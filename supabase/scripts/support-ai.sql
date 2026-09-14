-- MyRunner support AI tables/columns
-- Run in Supabase → SQL Editor for the live MyRunner project

CREATE TABLE IF NOT EXISTS public.contact_messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  email text NOT NULL,
  message text NOT NULL,
  ai_category text,
  ai_priority text,
  ai_summary text,
  status text NOT NULL DEFAULT 'open',
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.contact_messages ENABLE ROW LEVEL SECURITY;
GRANT ALL ON public.contact_messages TO service_role;
-- No public/authenticated access — inserts only via service role server functions

ALTER TABLE public.reports
  ADD COLUMN IF NOT EXISTS ai_severity text,
  ADD COLUMN IF NOT EXISTS ai_summary text,
  ADD COLUMN IF NOT EXISTS ai_labels text[],
  ADD COLUMN IF NOT EXISTS ai_escalate boolean DEFAULT false,
  ADD COLUMN IF NOT EXISTS ai_suggested_action text;
