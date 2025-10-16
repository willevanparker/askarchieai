-- Create user roles enum
CREATE TYPE public.app_role AS ENUM ('user', 'admin');

-- Create user_roles table
CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role app_role NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE (user_id, role)
);

-- Enable RLS
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Create security definer function to check roles
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE SQL
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
    AND role = _role
  )
$$;

-- RLS policies for user_roles
CREATE POLICY "Users can view their own roles"
  ON public.user_roles
  FOR SELECT
  USING (auth.uid() = user_id);

-- Update documents table to track source type
ALTER TABLE public.documents ADD COLUMN source_type TEXT DEFAULT 'file';
ALTER TABLE public.documents ADD COLUMN metadata JSONB DEFAULT '{}'::jsonb;

-- Create Q&A pairs table
CREATE TABLE public.qa_pairs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  question TEXT NOT NULL,
  answer TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS on Q&A
ALTER TABLE public.qa_pairs ENABLE ROW LEVEL SECURITY;

-- Anyone can read Q&A for RAG
CREATE POLICY "Anyone can view qa_pairs"
  ON public.qa_pairs
  FOR SELECT
  USING (true);

-- Only admins can insert Q&A
CREATE POLICY "Admins can insert qa_pairs"
  ON public.qa_pairs
  FOR INSERT
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- Update document policies for admin-only inserts
DROP POLICY IF EXISTS "Anyone can insert documents" ON public.documents;

CREATE POLICY "Admins can insert documents"
  ON public.documents
  FOR INSERT
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete documents"
  ON public.documents
  FOR DELETE
  USING (public.has_role(auth.uid(), 'admin'));

-- Update chunk policies for admin-only inserts
DROP POLICY IF EXISTS "Anyone can insert chunks" ON public.document_chunks;

CREATE POLICY "Admins can insert chunks"
  ON public.document_chunks
  FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM auth.users
      WHERE auth.users.id = auth.uid()
      AND public.has_role(auth.uid(), 'admin')
    )
  );