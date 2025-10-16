-- Fix PUBLIC_DATA_EXPOSURE issues by restricting SELECT access to admins only
-- These tables contain proprietary knowledge base data that should not be publicly accessible

-- 1. Fix documents table
DROP POLICY "Anyone can view documents" ON public.documents;

CREATE POLICY "Only admins can view documents"
  ON public.documents
  FOR SELECT
  USING (has_role(auth.uid(), 'admin'));

-- 2. Fix document_chunks table
DROP POLICY "Anyone can view chunks" ON public.document_chunks;

CREATE POLICY "Only admins can view chunks"
  ON public.document_chunks
  FOR SELECT
  USING (has_role(auth.uid(), 'admin'));

-- 3. Fix qa_pairs table
DROP POLICY "Anyone can view qa_pairs" ON public.qa_pairs;

CREATE POLICY "Only admins can view qa_pairs"
  ON public.qa_pairs
  FOR SELECT
  USING (has_role(auth.uid(), 'admin'));