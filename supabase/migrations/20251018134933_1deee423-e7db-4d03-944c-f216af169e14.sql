-- Create table to track user credits/purchases
CREATE TABLE public.user_credits (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  credits INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(user_id)
);

-- Enable RLS
ALTER TABLE public.user_credits ENABLE ROW LEVEL SECURITY;

-- Users can view their own credits
CREATE POLICY "Users can view their own credits"
  ON public.user_credits
  FOR SELECT
  USING (auth.uid() = user_id);

-- Users can insert their own credits record
CREATE POLICY "Users can insert their own credits"
  ON public.user_credits
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Users can update their own credits
CREATE POLICY "Users can update their own credits"
  ON public.user_credits
  FOR UPDATE
  USING (auth.uid() = user_id);

-- Create function to handle credit consumption
CREATE OR REPLACE FUNCTION public.consume_credit(user_uuid UUID)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  current_credits INTEGER;
BEGIN
  -- Get current credits
  SELECT credits INTO current_credits
  FROM user_credits
  WHERE user_id = user_uuid
  FOR UPDATE;
  
  -- Check if user has credits
  IF current_credits IS NULL OR current_credits <= 0 THEN
    RETURN FALSE;
  END IF;
  
  -- Deduct one credit
  UPDATE user_credits
  SET credits = credits - 1,
      updated_at = now()
  WHERE user_id = user_uuid;
  
  RETURN TRUE;
END;
$$;

-- Create function to add credits
CREATE OR REPLACE FUNCTION public.add_credits(user_uuid UUID, amount INTEGER)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO user_credits (user_id, credits)
  VALUES (user_uuid, amount)
  ON CONFLICT (user_id)
  DO UPDATE SET
    credits = user_credits.credits + amount,
    updated_at = now();
END;
$$;