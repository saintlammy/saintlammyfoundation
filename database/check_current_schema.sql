-- ===================================================================
-- CHECK CURRENT DATABASE SCHEMA (Version 2 - Error-Safe)
-- Run this to see what's currently in your database
-- Safe to run even if tables don't exist yet
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
  ('predefined_privileges'),
  ('volunteer_assignments'),
  ('volunteer_activity_log'),
  ('volunteer_availability')
) AS t(table_name)
ORDER BY table_name;

-- 2. Check volunteers table structure if it exists
DO $$
BEGIN
  IF EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'volunteers') THEN
    RAISE NOTICE '';
    RAISE NOTICE '=== VOLUNTEERS TABLE STRUCTURE ===';
    RAISE NOTICE 'Column count: %', (SELECT COUNT(*) FROM information_schema.columns WHERE table_name = 'volunteers');
    RAISE NOTICE '';
  ELSE
    RAISE NOTICE '';
    RAISE NOTICE '⚠️  VOLUNTEERS TABLE DOES NOT EXIST';
    RAISE NOTICE '';
  END IF;
END $$;

-- Show volunteer columns only if table exists
DO $$
BEGIN
  IF EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'volunteers') THEN
    -- We can safely show the columns
    NULL; -- Just checking
  END IF;
END $$;

-- 3. Check if volunteer form fields exist
SELECT
  'VOLUNTEER FORM FIELDS' as section,
  expected.column_name,
  c.data_type,
  CASE WHEN c.column_name IS NOT NULL THEN '✅ EXISTS' ELSE '❌ MISSING' END as status
FROM (VALUES
  ('experience'),
  ('motivation'),
  ('commitment'),
  ('background_check')
) AS expected(column_name)
LEFT JOIN information_schema.columns c
  ON c.table_name = 'volunteers' AND c.column_name = expected.column_name;

-- 4. Check enhanced volunteer fields
SELECT
  'ENHANCED VOLUNTEER FIELDS' as section,
  expected.column_name,
  c.data_type,
  CASE WHEN c.column_name IS NOT NULL THEN '✅ EXISTS' ELSE '❌ MISSING' END as status
FROM (VALUES
  ('hours_logged'),
  ('events_attended'),
  ('performance_rating'),
  ('orientation_completed'),
  ('application_source')
) AS expected(column_name)
LEFT JOIN information_schema.columns c
  ON c.table_name = 'volunteers' AND c.column_name = expected.column_name;

-- 5. Check row counts
DO $$
BEGIN
  RAISE NOTICE '';
  RAISE NOTICE '=== ROW COUNTS ===';
  RAISE NOTICE '';

  IF EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'users') THEN
    RAISE NOTICE 'users: % rows', (SELECT COUNT(*) FROM users);
  ELSE
    RAISE NOTICE 'users: table does not exist';
  END IF;

  IF EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'volunteers') THEN
    RAISE NOTICE 'volunteers: % rows', (SELECT COUNT(*) FROM volunteers);
  ELSE
    RAISE NOTICE 'volunteers: table does not exist';
  END IF;

  IF EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'volunteer_roles') THEN
    RAISE NOTICE 'volunteer_roles: % rows', (SELECT COUNT(*) FROM volunteer_roles);
  ELSE
    RAISE NOTICE 'volunteer_roles: table does not exist';
  END IF;

  IF EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'user_privileges') THEN
    RAISE NOTICE 'user_privileges: % rows', (SELECT COUNT(*) FROM user_privileges);
  ELSE
    RAISE NOTICE 'user_privileges: table does not exist';
  END IF;

  IF EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'predefined_privileges') THEN
    RAISE NOTICE 'predefined_privileges: % rows', (SELECT COUNT(*) FROM predefined_privileges);
  ELSE
    RAISE NOTICE 'predefined_privileges: table does not exist';
  END IF;

  IF EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'volunteer_assignments') THEN
    RAISE NOTICE 'volunteer_assignments: % rows', (SELECT COUNT(*) FROM volunteer_assignments);
  ELSE
    RAISE NOTICE 'volunteer_assignments: table does not exist (enhanced feature)';
  END IF;

  IF EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'volunteer_activity_log') THEN
    RAISE NOTICE 'volunteer_activity_log: % rows', (SELECT COUNT(*) FROM volunteer_activity_log);
  ELSE
    RAISE NOTICE 'volunteer_activity_log: table does not exist (enhanced feature)';
  END IF;

  IF EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'volunteer_availability') THEN
    RAISE NOTICE 'volunteer_availability: % rows', (SELECT COUNT(*) FROM volunteer_availability);
  ELSE
    RAISE NOTICE 'volunteer_availability: table does not exist (enhanced feature)';
  END IF;
END $$;

-- 6. Check RLS policies on volunteers table (safe - returns empty if table doesn't exist)
SELECT
  'RLS POLICIES' as section,
  schemaname,
  tablename,
  policyname,
  permissive,
  cmd
FROM pg_policies
WHERE tablename = 'volunteers'
ORDER BY policyname;

-- 7. Check for helper functions
SELECT
  'HELPER FUNCTIONS' as section,
  p.proname as function_name,
  CASE WHEN p.proname IS NOT NULL THEN '✅ EXISTS' ELSE '❌ MISSING' END as status
FROM (VALUES
  ('update_volunteer_hours'),
  ('get_volunteer_stats'),
  ('update_updated_at_column')
) AS expected(function_name)
LEFT JOIN pg_proc p ON p.proname = expected.function_name;

-- 8. Check for reporting views
SELECT
  'REPORTING VIEWS' as section,
  expected.view_name,
  CASE WHEN v.table_name IS NOT NULL THEN '✅ EXISTS' ELSE '❌ MISSING' END as status
FROM (VALUES
  ('active_volunteers_with_stats'),
  ('volunteer_assignment_summary')
) AS expected(view_name)
LEFT JOIN information_schema.views v
  ON v.table_name = expected.view_name AND v.table_schema = 'public';

-- 9. Final comprehensive recommendation
DO $$
DECLARE
  core_tables_count INTEGER;
  enhanced_tables_count INTEGER;
  volunteers_exists BOOLEAN;
  form_fields_exist BOOLEAN;
  enhanced_fields_exist BOOLEAN;
  recommendation TEXT;
BEGIN
  RAISE NOTICE '';
  RAISE NOTICE '╔════════════════════════════════════════════════╗';
  RAISE NOTICE '║          SYSTEM STATUS & RECOMMENDATIONS        ║';
  RAISE NOTICE '╚════════════════════════════════════════════════╝';
  RAISE NOTICE '';

  -- Count core tables
  SELECT COUNT(*) INTO core_tables_count
  FROM information_schema.tables
  WHERE table_schema = 'public'
    AND table_name IN ('users', 'volunteers', 'volunteer_roles', 'user_privileges', 'predefined_privileges');

  -- Count enhanced tables
  SELECT COUNT(*) INTO enhanced_tables_count
  FROM information_schema.tables
  WHERE table_schema = 'public'
    AND table_name IN ('volunteer_assignments', 'volunteer_activity_log', 'volunteer_availability');

  -- Check volunteers table specifically
  volunteers_exists := EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'volunteers');

  IF volunteers_exists THEN
    -- Check for form fields
    form_fields_exist := (
      SELECT COUNT(*) = 4
      FROM information_schema.columns
      WHERE table_name = 'volunteers'
      AND column_name IN ('experience', 'motivation', 'commitment', 'background_check')
    );

    -- Check for enhanced fields
    enhanced_fields_exist := (
      SELECT COUNT(*) >= 3
      FROM information_schema.columns
      WHERE table_name = 'volunteers'
      AND column_name IN ('hours_logged', 'events_attended', 'performance_rating')
    );
  ELSE
    form_fields_exist := FALSE;
    enhanced_fields_exist := FALSE;
  END IF;

  -- Status summary
  RAISE NOTICE '📊 CURRENT STATUS:';
  RAISE NOTICE '  Core tables (5): % / 5 exist', core_tables_count;
  RAISE NOTICE '  Enhanced tables (3): % / 3 exist', enhanced_tables_count;
  RAISE NOTICE '';

  -- Determine recommendation
  IF core_tables_count = 0 THEN
    RAISE NOTICE '🎯 RECOMMENDATION: Fresh Setup (Option A)';
    RAISE NOTICE '';
    RAISE NOTICE '  Your database is empty. Run in this order:';
    RAISE NOTICE '  1️⃣  smart_database_setup.sql';
    RAISE NOTICE '  2️⃣  enhanced_volunteer_schema.sql (optional but recommended)';
    RAISE NOTICE '  3️⃣  volunteer_tables.sql (lines 97-150 for seed data)';
    RAISE NOTICE '';
    RAISE NOTICE '  📖 See: OPTION_A_FRESH_SETUP.md for detailed guide';

  ELSIF core_tables_count = 5 AND NOT form_fields_exist THEN
    RAISE NOTICE '⚠️  RECOMMENDATION: Add Missing Form Fields';
    RAISE NOTICE '';
    RAISE NOTICE '  Core tables exist but missing volunteer form fields.';
    RAISE NOTICE '  Run: add_volunteer_form_fields.sql';

  ELSIF core_tables_count = 5 AND form_fields_exist AND NOT enhanced_fields_exist THEN
    RAISE NOTICE '✅ RECOMMENDATION: Core System Complete';
    RAISE NOTICE '';
    RAISE NOTICE '  Core volunteer system is ready!';
    RAISE NOTICE '  Optional: Run enhanced_volunteer_schema.sql for advanced features:';
    RAISE NOTICE '    - Assignment tracking';
    RAISE NOTICE '    - Activity logging';
    RAISE NOTICE '    - Availability scheduling';

  ELSIF core_tables_count = 5 AND form_fields_exist AND enhanced_fields_exist AND enhanced_tables_count < 3 THEN
    RAISE NOTICE '✅ RECOMMENDATION: Add Enhanced Tables';
    RAISE NOTICE '';
    RAISE NOTICE '  Core fields complete, but missing enhanced tracking tables.';
    RAISE NOTICE '  Run: enhanced_volunteer_schema.sql';

  ELSIF core_tables_count = 5 AND enhanced_tables_count = 3 THEN
    RAISE NOTICE '🎉 RECOMMENDATION: System Fully Set Up!';
    RAISE NOTICE '';
    RAISE NOTICE '  ✅ Core system complete';
    RAISE NOTICE '  ✅ Form fields present';
    RAISE NOTICE '  ✅ Enhanced features installed';
    RAISE NOTICE '';
    RAISE NOTICE '  Next steps:';
    RAISE NOTICE '    1. Create test volunteer account';
    RAISE NOTICE '    2. Test login at /volunteer/login';
    RAISE NOTICE '    3. Test public form at /volunteer';

  ELSE
    RAISE NOTICE '⚠️  RECOMMENDATION: Partial Setup Detected';
    RAISE NOTICE '';
    RAISE NOTICE '  You have % / 5 core tables', core_tables_count;
    RAISE NOTICE '  Review SCHEMA_ANALYSIS_AND_IMPROVEMENTS.md for guidance';
  END IF;

  RAISE NOTICE '';
  RAISE NOTICE '═══════════════════════════════════════════════';
END $$;
