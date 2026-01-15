-- Drop Outreach Reports Table and Related Objects
-- WARNING: This will DELETE ALL outreach report data permanently!
-- Only run this if you want to completely remove the table and start over

-- Drop the trigger first
DROP TRIGGER IF EXISTS outreach_reports_updated_at ON outreach_reports;

-- Drop the function
DROP FUNCTION IF EXISTS update_outreach_reports_updated_at();

-- Drop all policies
DROP POLICY IF EXISTS "Allow public read access to outreach reports" ON outreach_reports;
DROP POLICY IF EXISTS "Allow authenticated users to insert outreach reports" ON outreach_reports;
DROP POLICY IF EXISTS "Allow authenticated users to update outreach reports" ON outreach_reports;
DROP POLICY IF EXISTS "Allow authenticated users to delete outreach reports" ON outreach_reports;

-- Drop the table (this will also drop indexes)
DROP TABLE IF EXISTS outreach_reports CASCADE;

-- Verify deletion
SELECT tablename
FROM pg_tables
WHERE tablename = 'outreach_reports';
-- Should return no rows if successfully deleted
