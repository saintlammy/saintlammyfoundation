-- ===================================================================
-- CHECK CURRENT DATABASE SCHEMA
-- Run this to see what's currently in your database
-- ===================================================================

-- 1. Check which tables exist
SELECT
  'TABLE EXISTENCE CHECK' as section,
  table_name,
  CASE
    WHEN EXISTS (
      SELECT FROM information_schema.tables
      WHERE table_schema = 'public' AND information_schema.tables.table_name = t.table_name
    ) THEN '✅ EXISTS'
    ELSE '❌ MISSING'
  END as status
FROM (VALUES
  ('users'),
  ('volunteers'),
  ('volunteer_roles'),
  ('user_privileges'),
  ('predefined_privileges')
) AS t(table_name)
ORDER BY table_name;

-- 2. Check volunteers table structure if it exists
DO $$
BEGIN
  IF EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'volunteers') THEN
    RAISE NOTICE '';
    RAISE NOTICE '=== VOLUNTEERS TABLE STRUCTURE ===';
    RAISE NOTICE '';
  END IF;
END $$;

SELECT
  column_name,
  data_type,
  is_nullable,
  column_default,
  character_maximum_length
FROM information_schema.columns
WHERE table_name = 'volunteers'
ORDER BY ordinal_position;

-- 3. Check if volunteer form fields exist
SELECT
  'VOLUNTEER FORM FIELDS' as section,
  column_name,
  data_type,
  CASE WHEN column_name IS NOT NULL THEN '✅ EXISTS' ELSE '❌ MISSING' END as status
FROM (VALUES
  ('experience'),
  ('motivation'),
  ('commitment'),
  ('background_check')
) AS expected(column_name)
LEFT JOIN information_schema.columns c
  ON c.table_name = 'volunteers' AND c.column_name = expected.column_name;

-- 4. Check row counts
DO $$
BEGIN
  RAISE NOTICE '';
  RAISE NOTICE '=== ROW COUNTS ===';
  RAISE NOTICE '';

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

-- 5. Check for any existing volunteer data
SELECT
  'EXISTING VOLUNTEER DATA' as section,
  id,
  email,
  name,
  status,
  created_at,
  -- Check if form fields have data
  CASE WHEN experience IS NOT NULL THEN '✅' ELSE '❌' END as has_experience,
  CASE WHEN motivation IS NOT NULL THEN '✅' ELSE '❌' END as has_motivation,
  CASE WHEN commitment IS NOT NULL THEN '✅' ELSE '❌' END as has_commitment
FROM volunteers
ORDER BY created_at DESC
LIMIT 5;

-- 6. Check RLS policies on volunteers table
SELECT
  'RLS POLICIES' as section,
  schemaname,
  tablename,
  policyname,
  permissive,
  roles,
  cmd
FROM pg_policies
WHERE tablename = 'volunteers'
ORDER BY policyname;

-- 7. Check foreign key relationships
SELECT
  'FOREIGN KEYS' as section,
  tc.constraint_name,
  tc.table_name,
  kcu.column_name,
  ccu.table_name AS foreign_table_name,
  ccu.column_name AS foreign_column_name
FROM information_schema.table_constraints AS tc
JOIN information_schema.key_column_usage AS kcu
  ON tc.constraint_name = kcu.constraint_name
  AND tc.table_schema = kcu.table_schema
JOIN information_schema.constraint_column_usage AS ccu
  ON ccu.constraint_name = tc.constraint_name
  AND ccu.table_schema = tc.table_schema
WHERE tc.constraint_type = 'FOREIGN KEY'
  AND tc.table_name = 'volunteers';

-- 8. Check indexes on volunteers table
SELECT
  'INDEXES' as section,
  indexname,
  indexdef
FROM pg_indexes
WHERE tablename = 'volunteers'
ORDER BY indexname;

-- 9. Final recommendation
DO $$
DECLARE
  volunteers_exists BOOLEAN;
  form_fields_exist BOOLEAN;
BEGIN
  RAISE NOTICE '';
  RAISE NOTICE '=== RECOMMENDATIONS ===';
  RAISE NOTICE '';

  volunteers_exists := EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'volunteers');

  IF volunteers_exists THEN
    form_fields_exist := EXISTS (
      SELECT FROM information_schema.columns
      WHERE table_name = 'volunteers'
      AND column_name IN ('experience', 'motivation', 'commitment', 'background_check')
    );

    IF form_fields_exist THEN
      RAISE NOTICE '✅ Volunteers table exists with all form fields';
      RAISE NOTICE '   System is ready to use!';
    ELSE
      RAISE NOTICE '⚠️  Volunteers table exists but missing form fields';
      RAISE NOTICE '   Run: add_volunteer_form_fields.sql';
    END IF;
  ELSE
    RAISE NOTICE '❌ Volunteers table does not exist';
    RAISE NOTICE '   Run: smart_database_setup.sql';
  END IF;
END $$;
