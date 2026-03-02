-- ===================================================================
-- ADD VOLUNTEER FORM FIELDS MIGRATION
-- Adds missing columns from volunteer registration form
-- Run this AFTER smart_database_setup.sql
-- ===================================================================

-- Add experience column (text area for volunteer experience)
ALTER TABLE volunteers
ADD COLUMN IF NOT EXISTS experience TEXT;

-- Add motivation column (why they want to volunteer)
ALTER TABLE volunteers
ADD COLUMN IF NOT EXISTS motivation TEXT;

-- Add commitment column (how much time they can commit)
ALTER TABLE volunteers
ADD COLUMN IF NOT EXISTS commitment TEXT;

-- Add background_check column (consent for background check)
ALTER TABLE volunteers
ADD COLUMN IF NOT EXISTS background_check BOOLEAN DEFAULT false;

-- Add comments for documentation
COMMENT ON COLUMN volunteers.experience IS 'Volunteer''s previous experience and relevant background';
COMMENT ON COLUMN volunteers.motivation IS 'Why the volunteer wants to join and their motivations';
COMMENT ON COLUMN volunteers.commitment IS 'Time commitment the volunteer can make';
COMMENT ON COLUMN volunteers.background_check IS 'Whether volunteer consents to background check';

-- Verify columns were added
SELECT
  column_name,
  data_type,
  is_nullable,
  column_default
FROM information_schema.columns
WHERE table_name = 'volunteers'
  AND column_name IN ('experience', 'motivation', 'commitment', 'background_check')
ORDER BY column_name;

-- Success message
DO $$
BEGIN
  RAISE NOTICE '';
  RAISE NOTICE '=== VOLUNTEER FORM FIELDS ADDED SUCCESSFULLY ===';
  RAISE NOTICE '';
  RAISE NOTICE 'Added columns:';
  RAISE NOTICE '  ✅ experience (TEXT)';
  RAISE NOTICE '  ✅ motivation (TEXT)';
  RAISE NOTICE '  ✅ commitment (TEXT)';
  RAISE NOTICE '  ✅ background_check (BOOLEAN)';
  RAISE NOTICE '';
  RAISE NOTICE 'Volunteer registration form is now fully functional!';
END $$;
