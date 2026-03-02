-- ===================================================================
-- CREATE TEST VOLUNTEER ACCOUNT
-- Complete script to create a test volunteer for login testing
-- ===================================================================

-- IMPORTANT: First create the auth user in Supabase Authentication UI
-- 1. Go to Supabase Dashboard → Authentication → Users
-- 2. Click "Add User"
-- 3. Email: testvolunteer@example.com
-- 4. Password: Test123!@#
-- 5. Auto Confirm: YES
-- 6. Copy the User ID (UUID) and replace YOUR_AUTH_USER_ID below

-- ===================================================================
-- STEP 1: Create User Record
-- ===================================================================
-- Replace YOUR_AUTH_USER_ID with the UUID from Supabase Authentication

INSERT INTO users (
  auth_user_id,
  email,
  name,
  phone,
  location,
  role,
  status,
  verified,
  created_at,
  updated_at
)
VALUES (
  'YOUR_AUTH_USER_ID',  -- ⚠️ REPLACE THIS WITH UUID FROM SUPABASE AUTH
  'testvolunteer@example.com',
  'Test Volunteer',
  '+234-800-0000-000',
  'Lagos, Nigeria',
  'volunteer',
  'active',
  true,
  now(),
  now()
)
RETURNING id, email, name, role, status;

-- Copy the returned 'id' for the next steps!
-- It will look like: a1b2c3d4-e5f6-7890-abcd-ef1234567890

-- ===================================================================
-- STEP 2: Create Volunteer Record
-- ===================================================================
-- Replace NEW_USER_ID with the 'id' returned from Step 1

INSERT INTO volunteers (
  user_id,
  email,
  name,
  first_name,
  last_name,
  phone,
  location,
  interests,
  skills,
  availability,
  experience,
  motivation,
  commitment,
  background_check,
  status,
  application_source,
  created_at,
  updated_at
)
VALUES (
  'NEW_USER_ID',  -- ⚠️ REPLACE THIS WITH user.id FROM STEP 1
  'testvolunteer@example.com',
  'Test Volunteer',
  'Test',
  'Volunteer',
  '+234-800-0000-000',
  'Lagos, Nigeria',
  ARRAY['community service', 'education', 'healthcare'],
  ARRAY['teaching', 'organizing events', 'public speaking'],
  ARRAY['weekends', 'evenings'],
  'Previous volunteer work with orphanages and community centers for 2 years. Experience in organizing educational programs and fundraising events.',
  'I want to help children get better education and healthcare. My passion is to make a difference in the lives of orphans and widows in Nigeria.',
  '10 hours per week',
  true,
  'active',
  'website',
  now(),
  now()
)
RETURNING id, email, name, status;

-- ===================================================================
-- STEP 3: Grant Default Volunteer Privileges
-- ===================================================================
-- Replace NEW_USER_ID with the same user.id from Step 1

INSERT INTO user_privileges (user_id, privilege_key, is_active, granted_at)
SELECT
  'NEW_USER_ID',  -- ⚠️ REPLACE THIS WITH user.id FROM STEP 1
  key,
  true,
  now()
FROM predefined_privileges
WHERE 'volunteer' = ANY(default_roles) AND is_active = true;

-- Should insert 9 rows (9 default volunteer privileges)

-- ===================================================================
-- STEP 4: Verify the Account Was Created Successfully
-- ===================================================================

SELECT
  u.id as user_id,
  u.auth_user_id,
  u.email,
  u.name,
  u.role,
  u.status,
  u.verified,
  v.id as volunteer_id,
  v.status as volunteer_status,
  v.experience,
  v.motivation,
  COUNT(up.id) as privilege_count
FROM users u
LEFT JOIN volunteers v ON u.id = v.user_id
LEFT JOIN user_privileges up ON u.id = up.user_id AND up.is_active = true
WHERE u.email = 'testvolunteer@example.com'
GROUP BY u.id, v.id;

-- Expected output:
-- user_id: [UUID]
-- auth_user_id: [UUID from Supabase Auth]
-- email: testvolunteer@example.com
-- name: Test Volunteer
-- role: volunteer
-- status: active
-- verified: true
-- volunteer_id: [UUID]
-- volunteer_status: active
-- experience: [Text you entered]
-- motivation: [Text you entered]
-- privilege_count: 9

-- ===================================================================
-- ALTERNATIVE: All-in-One Script (Advanced)
-- Use this if you want to do it all in one go
-- ===================================================================

-- Uncomment the block below and replace YOUR_AUTH_USER_ID only once:

/*
WITH new_user AS (
  INSERT INTO users (auth_user_id, email, name, phone, location, role, status, verified)
  VALUES (
    'YOUR_AUTH_USER_ID',  -- ⚠️ REPLACE THIS
    'testvolunteer@example.com',
    'Test Volunteer',
    '+234-800-0000-000',
    'Lagos, Nigeria',
    'volunteer',
    'active',
    true
  )
  RETURNING id
),
new_volunteer AS (
  INSERT INTO volunteers (
    user_id, email, name, first_name, last_name, phone, location,
    interests, skills, availability, experience, motivation,
    commitment, background_check, status, application_source
  )
  SELECT
    id, 'testvolunteer@example.com', 'Test Volunteer', 'Test', 'Volunteer',
    '+234-800-0000-000', 'Lagos, Nigeria',
    ARRAY['community service', 'education'],
    ARRAY['teaching', 'organizing events'],
    ARRAY['weekends', 'evenings'],
    'Previous volunteer work with orphanages',
    'Want to help children and make a difference',
    '10 hours per week',
    true, 'active', 'website'
  FROM new_user
  RETURNING volunteer_id, user_id
)
INSERT INTO user_privileges (user_id, privilege_key, is_active)
SELECT
  new_user.id,
  pp.key,
  true
FROM new_user, predefined_privileges pp
WHERE 'volunteer' = ANY(pp.default_roles) AND pp.is_active = true;

-- Then verify:
SELECT
  u.id, u.email, u.name, u.role,
  v.id as volunteer_id,
  COUNT(up.id) as privileges
FROM users u
LEFT JOIN volunteers v ON u.id = v.user_id
LEFT JOIN user_privileges up ON u.id = up.user_id
WHERE u.email = 'testvolunteer@example.com'
GROUP BY u.id, v.id;
*/

-- ===================================================================
-- LOGIN CREDENTIALS
-- ===================================================================

-- After running this script successfully, you can log in with:
-- URL: http://localhost:3000/volunteer/login
-- Email: testvolunteer@example.com
-- Password: Test123!@#

-- You should be redirected to: http://localhost:3000/volunteer/dashboard

-- ===================================================================
-- TROUBLESHOOTING
-- ===================================================================

-- If login fails, check:

-- 1. Auth user exists and is confirmed
SELECT id, email, confirmed_at FROM auth.users WHERE email = 'testvolunteer@example.com';

-- 2. User record exists with correct auth_user_id
SELECT id, auth_user_id, email, role, status FROM users WHERE email = 'testvolunteer@example.com';

-- 3. Volunteer record exists and is linked
SELECT id, user_id, email, status FROM volunteers WHERE email = 'testvolunteer@example.com';

-- 4. Privileges were granted
SELECT COUNT(*) FROM user_privileges up
JOIN users u ON up.user_id = u.id
WHERE u.email = 'testvolunteer@example.com' AND up.is_active = true;
-- Should return: 9

-- 5. Check if auth_user_id matches
SELECT
  u.auth_user_id as users_auth_id,
  au.id as auth_users_id,
  CASE WHEN u.auth_user_id = au.id THEN '✅ MATCH' ELSE '❌ MISMATCH' END as status
FROM users u
CROSS JOIN auth.users au
WHERE u.email = 'testvolunteer@example.com'
AND au.email = 'testvolunteer@example.com';
-- Should show: ✅ MATCH

-- ===================================================================
-- CLEANUP (if you want to delete the test account)
-- ===================================================================

/*
-- Uncomment to delete the test account:

DELETE FROM user_privileges WHERE user_id IN (SELECT id FROM users WHERE email = 'testvolunteer@example.com');
DELETE FROM volunteers WHERE email = 'testvolunteer@example.com';
DELETE FROM users WHERE email = 'testvolunteer@example.com';
-- Also delete from Supabase Authentication UI
*/
