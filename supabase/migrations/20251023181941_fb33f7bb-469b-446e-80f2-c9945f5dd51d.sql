-- Add structured analysis support columns to deal_analyses
ALTER TABLE public.deal_analyses
  ADD COLUMN IF NOT EXISTS verdict TEXT,
  ADD COLUMN IF NOT EXISTS deal_type TEXT DEFAULT 'purchase',
  ADD COLUMN IF NOT EXISTS categories JSONB NOT NULL DEFAULT '[]'::jsonb;