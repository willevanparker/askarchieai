-- Make user_id nullable for anonymous usage
ALTER TABLE public.documents ALTER COLUMN user_id DROP NOT NULL;

-- Update RLS policies to allow public access
DROP POLICY IF EXISTS "Users can view their own documents" ON public.documents;
DROP POLICY IF EXISTS "Users can insert their own documents" ON public.documents;
DROP POLICY IF EXISTS "Users can delete their own documents" ON public.documents;

-- New policies for public access
CREATE POLICY "Anyone can view documents"
  ON public.documents
  FOR SELECT
  USING (true);

CREATE POLICY "Anyone can insert documents"
  ON public.documents
  FOR INSERT
  WITH CHECK (true);

-- Update chunk policies
DROP POLICY IF EXISTS "Users can view chunks of their documents" ON public.document_chunks;
DROP POLICY IF EXISTS "System can insert chunks" ON public.document_chunks;

CREATE POLICY "Anyone can view chunks"
  ON public.document_chunks
  FOR SELECT
  USING (true);

CREATE POLICY "Anyone can insert chunks"
  ON public.document_chunks
  FOR INSERT
  WITH CHECK (true);