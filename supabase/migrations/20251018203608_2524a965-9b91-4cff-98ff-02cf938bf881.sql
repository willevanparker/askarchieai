-- Create table to store user deal analyses for dashboard reference
CREATE TABLE public.user_deal_history (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  analysis_id UUID NOT NULL REFERENCES public.deal_analyses(id) ON DELETE CASCADE,
  file_name TEXT NOT NULL,
  file_path TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.user_deal_history ENABLE ROW LEVEL SECURITY;

-- Users can view their own deal history
CREATE POLICY "Users can view their own deal history"
ON public.user_deal_history
FOR SELECT
USING (auth.uid() = user_id);

-- Users can insert their own deal history
CREATE POLICY "Users can insert their own deal history"
ON public.user_deal_history
FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- Create index for faster lookups
CREATE INDEX idx_user_deal_history_user_id ON public.user_deal_history(user_id);
CREATE INDEX idx_user_deal_history_created_at ON public.user_deal_history(created_at DESC);