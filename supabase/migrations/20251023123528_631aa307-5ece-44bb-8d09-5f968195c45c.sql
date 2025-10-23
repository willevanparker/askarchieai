-- INSIGHTS_EMAIL_CAPTURE: Create contacts table for email capture with marketing opt-in
CREATE TABLE public.contacts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT NOT NULL UNIQUE,
  marketing_opt_in BOOLEAN NOT NULL DEFAULT false,
  source TEXT DEFAULT 'insights_report',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.contacts ENABLE ROW LEVEL SECURITY;

-- Allow anyone to insert (for unauthenticated email capture)
CREATE POLICY "Anyone can insert contacts"
ON public.contacts
FOR INSERT
TO anon, authenticated
WITH CHECK (true);

-- Only admins can view contacts
CREATE POLICY "Only admins can view contacts"
ON public.contacts
FOR SELECT
TO authenticated
USING (has_role(auth.uid(), 'admin'::app_role));

-- Create index on email for faster lookups
CREATE INDEX idx_contacts_email ON public.contacts(email);