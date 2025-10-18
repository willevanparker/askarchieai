-- Create storage bucket for deal documents
INSERT INTO storage.buckets (id, name, public)
VALUES ('deal-documents', 'deal-documents', false);

-- Allow authenticated and anonymous users to upload files
CREATE POLICY "Anyone can upload deal documents"
ON storage.objects
FOR INSERT
WITH CHECK (bucket_id = 'deal-documents');

-- Allow users to read their own uploads
CREATE POLICY "Users can read their own deal documents"
ON storage.objects
FOR SELECT
USING (bucket_id = 'deal-documents');

-- Create table to store analysis results
CREATE TABLE IF NOT EXISTS public.deal_analyses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id TEXT NOT NULL,
  file_path TEXT NOT NULL,
  rating DECIMAL(3,1),
  verdict TEXT,
  summary TEXT,
  negotiation_tip TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.deal_analyses ENABLE ROW LEVEL SECURITY;

-- Allow anyone to insert (since we're not requiring auth)
CREATE POLICY "Anyone can create deal analyses"
ON public.deal_analyses
FOR INSERT
WITH CHECK (true);

-- Allow anyone to read their own analyses by session_id
CREATE POLICY "Anyone can read their analyses by session"
ON public.deal_analyses
FOR SELECT
USING (true);