-- Add expo_push_token column to profiles table
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS expo_push_token TEXT;

-- Verify RLS Policies (Users can usually UPDATE their own profile by default if RLS handles it, 
-- but let's be explicit if needed. The existing 'Users can update their own profile' policy should cover this column automatically.)
-- If strict column security was enabled, we'd need to check that.
-- Just adding the column is usually enough if the UPDATE policy is row-based.
