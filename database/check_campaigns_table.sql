-- Check campaigns table structure
-- Run this in Supabase SQL Editor to see what columns you have

-- 1. Show all columns in campaigns table
SELECT
    column_name,
    data_type,
    is_nullable,
    column_default
FROM information_schema.columns
WHERE table_name = 'campaigns'
ORDER BY ordinal_position;

-- 2. Show sample campaign data (to see what's actually stored)
SELECT * FROM campaigns LIMIT 5;

-- 3. Count total campaigns
SELECT COUNT(*) as total_campaigns FROM campaigns;

-- 4. Show campaigns with their status
SELECT id, title, status, created_at FROM campaigns ORDER BY created_at DESC;
