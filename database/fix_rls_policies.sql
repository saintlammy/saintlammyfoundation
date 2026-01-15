-- Fix RLS Policies to Allow API Inserts
-- Run this in Supabase SQL Editor to fix the insert permission issue

-- Drop existing restrictive policies
DROP POLICY IF EXISTS "Allow authenticated users to insert content" ON content;
DROP POLICY IF EXISTS "Allow authenticated users to update content" ON content;
DROP POLICY IF EXISTS "Allow authenticated users to delete content" ON content;

-- Create new policies that allow anonymous operations
-- (You should add proper authentication later for production security)

CREATE POLICY "Allow anonymous insert content"
  ON content FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Allow anonymous update content"
  ON content FOR UPDATE
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Allow anonymous delete content"
  ON content FOR DELETE
  USING (true);

-- Verify policies
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual, with_check
FROM pg_policies
WHERE tablename = 'content';
