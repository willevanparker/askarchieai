-- Fix deal_analyses RLS policy to require authentication
DROP POLICY IF EXISTS "Anyone can create deal analyses" ON public.deal_analyses;

CREATE POLICY "Authenticated users can create analyses"
ON public.deal_analyses
FOR INSERT
TO authenticated
WITH CHECK (true);

-- Also update the SELECT policy to be more explicit
DROP POLICY IF EXISTS "Anyone can read their analyses by session" ON public.deal_analyses;

CREATE POLICY "Users can read analyses by session"
ON public.deal_analyses
FOR SELECT
TO authenticated
USING (true);