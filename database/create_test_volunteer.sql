-- ===================================================================
-- CREATE TEST VOLUNTEER ACCOUNT
-- Use this to create a test volunteer for portal testing
-- ===================================================================

-- STEP 1: First create the auth user in Supabase Auth Dashboard
-- Go to: Authentication → Users → Add User
-- Email: test@volunteer.com (or your choice)
-- Password: TestVolunteer123! (or your choice)
-- Copy the UUID of the created user

-- STEP 2: Then run this SQL (replace 'your-auth-user-id' with actual UUID from step 1)

-- Create user record
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
) VALUES (
    'your-auth-user-id', -- Replace with actual auth.users UUID
    'test@volunteer.com',
    'Test Volunteer',
    '+234 801 234 5678',
    'Lagos, Nigeria',
    'volunteer',
    'active',
    true,
    now(),
    now()
);

-- Get the user ID (run this to see the created user)
SELECT id, name, email, role, status FROM users WHERE email = 'test@volunteer.com';

-- STEP 3: Create volunteer record linked to user (replace 'user-id' with ID from above query)

INSERT INTO volunteers (
    user_id,
    email,
    name,
    phone,
    location,
    status,
    interests,
    skills,
    availability,
    created_at,
    updated_at
) VALUES (
    'user-id', -- Replace with user.id from above query
    'test@volunteer.com',
    'Test Volunteer',
    '+234 801 234 5678',
    'Lagos, Nigeria',
    'active',
    ARRAY['Medical Outreach', 'Education', 'Community Service'],
    ARRAY['First Aid', 'Teaching', 'Event Planning'],
    ARRAY['Weekends', 'Evenings'],
    now(),
    now()
);

-- STEP 4: (Optional) Assign a volunteer role
-- First, get available roles:
SELECT id, title, category FROM volunteer_roles WHERE is_active = true;

-- Then update volunteer with role_id:
UPDATE volunteers
SET role_id = 'role-id' -- Replace with volunteer_role.id from above
WHERE email = 'test@volunteer.com';

-- STEP 5: Verify everything is set up
SELECT
    u.id as user_id,
    u.name,
    u.email,
    u.role as user_role,
    u.status as user_status,
    v.id as volunteer_id,
    v.status as volunteer_status,
    vr.title as assigned_role
FROM users u
LEFT JOIN volunteers v ON u.id = v.user_id
LEFT JOIN volunteer_roles vr ON v.role_id = vr.id
WHERE u.email = 'test@volunteer.com';

-- ===================================================================
-- ALTERNATIVE: Quick Test Account (if auth user already exists)
-- ===================================================================

-- If you already have a Supabase Auth user, just run these:
-- (Replace email and IDs as needed)

-- Create user only:
/*
INSERT INTO users (email, name, role, status, verified)
VALUES ('existing@example.com', 'Existing User', 'volunteer', 'active', true);
*/

-- Link to auth user afterward:
/*
UPDATE users
SET auth_user_id = 'auth-uuid-here'
WHERE email = 'existing@example.com';
*/

-- ===================================================================
-- TESTING CHECKLIST
-- ===================================================================

-- After creating test account:
-- 1. Visit: http://localhost:3000/volunteer/login
-- 2. Enter credentials
-- 3. Should redirect to: http://localhost:3000/volunteer/dashboard
-- 4. Verify profile info displays
-- 5. Test sign out button

-- ===================================================================
-- TROUBLESHOOTING
-- ===================================================================

-- Check if user exists in auth:
-- (Run in Supabase SQL Editor)
SELECT id, email FROM auth.users WHERE email = 'test@volunteer.com';

-- Check if user exists in users table:
SELECT id, email, role, status, auth_user_id FROM users WHERE email = 'test@volunteer.com';

-- Check if volunteer record exists:
SELECT id, user_id, email, status FROM volunteers WHERE email = 'test@volunteer.com';

-- Check privileges granted:
SELECT up.privilege_key, pp.name, pp.description
FROM user_privileges up
JOIN predefined_privileges pp ON up.privilege_key = pp.key
WHERE up.user_id = (SELECT id FROM users WHERE email = 'test@volunteer.com')
AND up.is_active = true;

-- If no privileges, grant them manually:
/*
INSERT INTO user_privileges (user_id, privilege_key, is_active)
SELECT
    (SELECT id FROM users WHERE email = 'test@volunteer.com'),
    key,
    true
FROM predefined_privileges
WHERE 'volunteer' = ANY(default_roles)
AND is_active = true;
*/

-- ===================================================================
-- CLEANUP (Delete test account)
-- ===================================================================

/*
-- Delete in reverse order (respects foreign keys):
DELETE FROM user_privileges WHERE user_id = (SELECT id FROM users WHERE email = 'test@volunteer.com');
DELETE FROM volunteers WHERE email = 'test@volunteer.com';
DELETE FROM users WHERE email = 'test@volunteer.com';
-- Then delete from Supabase Auth Dashboard manually
*/
