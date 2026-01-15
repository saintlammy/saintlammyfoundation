-- Drop content table and related objects
DROP TRIGGER IF EXISTS content_updated_at ON content;
DROP FUNCTION IF EXISTS update_content_updated_at();
DROP POLICY IF EXISTS "Allow public read access to published content" ON content;
DROP POLICY IF EXISTS "Allow public read all content" ON content;
DROP POLICY IF EXISTS "Allow authenticated users to insert content" ON content;
DROP POLICY IF EXISTS "Allow authenticated users to update content" ON content;
DROP POLICY IF EXISTS "Allow authenticated users to delete content" ON content;
DROP TABLE IF EXISTS content CASCADE;
