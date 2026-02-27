-- ===================================================================
-- DATABASE STATE VERIFICATION SCRIPT
-- Run this to see what's currently set up in your database
-- ===================================================================

-- Check if tables exist
SELECT
  'users' as table_name,
  CASE WHEN EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'users') THEN '✅ EXISTS' ELSE '❌ MISSING' END as status
UNION ALL
SELECT
  'volunteers',
  CASE WHEN EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'volunteers') THEN '✅ EXISTS' ELSE '❌ MISSING' END
UNION ALL
SELECT
  'volunteer_roles',
  CASE WHEN EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'volunteer_roles') THEN '✅ EXISTS' ELSE '❌ MISSING' END
UNION ALL
SELECT
  'user_privileges',
  CASE WHEN EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'user_privileges') THEN '✅ EXISTS' ELSE '❌ MISSING' END
UNION ALL
SELECT
  'predefined_privileges',
  CASE WHEN EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'predefined_privileges') THEN '✅ EXISTS' ELSE '❌ MISSING' END;

-- Check row counts for existing tables
DO $$
BEGIN
  RAISE NOTICE '';
  RAISE NOTICE '=== TABLE ROW COUNTS ===';

  IF EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'users') THEN
    RAISE NOTICE 'users: % rows', (SELECT COUNT(*) FROM users);
  END IF;

  IF EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'volunteers') THEN
    RAISE NOTICE 'volunteers: % rows', (SELECT COUNT(*) FROM volunteers);
  END IF;

  IF EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'volunteer_roles') THEN
    RAISE NOTICE 'volunteer_roles: % rows', (SELECT COUNT(*) FROM volunteer_roles);
  END IF;

  IF EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'user_privileges') THEN
    RAISE NOTICE 'user_privileges: % rows', (SELECT COUNT(*) FROM user_privileges);
  END IF;

  IF EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'predefined_privileges') THEN
    RAISE NOTICE 'predefined_privileges: % rows', (SELECT COUNT(*) FROM predefined_privileges);
  END IF;
END $$;

-- Check policies on volunteer_roles table
SELECT
  'volunteer_roles' as table_name,
  policyname,
  'EXISTS' as status
FROM pg_policies
WHERE tablename = 'volunteer_roles'
ORDER BY policyname;

-- Check policies on users table
SELECT
  'users' as table_name,
  policyname,
  'EXISTS' as status
FROM pg_policies
WHERE tablename = 'users'
ORDER BY policyname;

-- Final recommendation
DO $$
DECLARE
  missing_tables INTEGER := 0;
BEGIN
  RAISE NOTICE '';
  RAISE NOTICE '=== RECOMMENDATION ===';

  IF NOT EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'users') THEN
    missing_tables := missing_tables + 1;
  END IF;
  IF NOT EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'volunteers') THEN
    missing_tables := missing_tables + 1;
  END IF;
  IF NOT EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'volunteer_roles') THEN
    missing_tables := missing_tables + 1;
  END IF;
  IF NOT EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'user_privileges') THEN
    missing_tables := missing_tables + 1;
  END IF;
  IF NOT EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'predefined_privileges') THEN
    missing_tables := missing_tables + 1;
  END IF;

  IF missing_tables = 0 THEN
    RAISE NOTICE '✅ All required tables exist! Your database is ready.';
    RAISE NOTICE '   Next step: Create a test volunteer account using create_test_volunteer.sql';
  ELSIF missing_tables < 3 THEN
    RAISE NOTICE '⚠️  Some tables are missing (% out of 5)', missing_tables;
    RAISE NOTICE '   Run smart_database_setup.sql to create missing tables without affecting existing ones';
  ELSE
    RAISE NOTICE '❌ Most tables are missing (% out of 5)', missing_tables;
    RAISE NOTICE '   Run smart_database_setup.sql to set up the database from scratch';
  END IF;
END $$;
