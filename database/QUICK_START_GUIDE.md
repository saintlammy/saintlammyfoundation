# Volunteer System Quick Start Guide

## Current Status
Based on your last attempt, you encountered a "policy already exists" error, which means:
- ✅ Some tables exist (at least `volunteer_roles`)
- ❌ Some tables are missing (likely `volunteers`, `user_privileges`, `predefined_privileges`)
- ⚠️ Partial database setup needs to be completed

## Step-by-Step Setup

### Step 1: Verify Current Database State
1. Open your Supabase project dashboard
2. Go to **SQL Editor**
3. Create a new query and paste contents of: `database/verify_database_state.sql`
4. Click **Run**
5. Check the output to see which tables exist

### Step 2: Run Smart Database Setup
1. In Supabase SQL Editor, create a new query
2. Paste the entire contents of: `database/smart_database_setup.sql`
3. Click **Run**
4. This script will:
   - Create missing tables without affecting existing ones
   - Use `CREATE TABLE IF NOT EXISTS` for safety
   - Use `DROP POLICY IF EXISTS` before creating policies
   - Handle partial setups gracefully

**Expected Output:**
```
=== SMART DATABASE SETUP COMPLETE ===

  ✅ users
  ✅ volunteer_roles
  ✅ volunteers
  ✅ user_privileges
  ✅ predefined_privileges (9 privileges)

Ready to create volunteer accounts!
```

### Step 3: Create a Test Volunteer Account

#### Option A: Via Supabase Dashboard (Recommended for Testing)
1. Go to **Authentication** → **Users** in Supabase
2. Click **Add User**
3. Enter:
   - Email: `testvolunteer@example.com`
   - Password: `Test123!@#`
   - Auto Confirm: ✅ Yes
4. Click **Create User**
5. Copy the User ID (UUID)

Then run this SQL in SQL Editor (replace `YOUR_AUTH_USER_ID`):
```sql
-- Create user record
INSERT INTO users (auth_user_id, email, name, phone, location, role, status, verified)
VALUES (
  'YOUR_AUTH_USER_ID',  -- Paste the UUID from step 5
  'testvolunteer@example.com',
  'Test Volunteer',
  '+234-800-0000-000',
  'Lagos, Nigeria',
  'volunteer',
  'active',
  true
)
RETURNING id;

-- Copy the returned user ID and use it below
-- Create volunteer record (replace NEW_USER_ID with the ID from above)
INSERT INTO volunteers (user_id, email, name, phone, location, status, interests, skills, availability)
VALUES (
  'NEW_USER_ID',  -- Paste the user ID from previous query
  'testvolunteer@example.com',
  'Test Volunteer',
  '+234-800-0000-000',
  'Lagos, Nigeria',
  'active',
  ARRAY['community service', 'education'],
  ARRAY['teaching', 'organizing events'],
  ARRAY['weekends', 'evenings']
);

-- Grant volunteer privileges (replace NEW_USER_ID)
INSERT INTO user_privileges (user_id, privilege_key, is_active)
SELECT 'NEW_USER_ID', key, true
FROM predefined_privileges
WHERE 'volunteer' = ANY(default_roles) AND is_active = true;
```

#### Option B: Via Admin Dashboard (After Database Setup)
1. Log into your admin dashboard: `http://localhost:3000/admin`
2. Go to **Users** → **Volunteers**
3. Click **Add New User**
4. Fill in the form:
   - Name: Test Volunteer
   - Email: testvolunteer@example.com
   - Role: Volunteer
   - Status: Active
5. Click **Create**
6. The system will automatically:
   - Create user record
   - Create volunteer record
   - Grant default volunteer privileges

### Step 4: Test Volunteer Login
1. Open your browser to: `http://localhost:3000/volunteer/login`
2. Enter credentials:
   - Email: `testvolunteer@example.com`
   - Password: `Test123!@#`
3. Click **Sign In**
4. You should be redirected to: `http://localhost:3000/volunteer/dashboard`
5. Verify you see:
   - Volunteer name and profile
   - Stats (hours logged, events attended)
   - Quick actions
   - Upcoming opportunities

### Step 5: Verify Integration
Run this SQL to verify everything is connected:
```sql
-- Check user with volunteer details
SELECT
  u.id as user_id,
  u.name,
  u.email,
  u.role,
  u.status,
  v.id as volunteer_id,
  v.status as volunteer_status,
  COUNT(up.id) as privilege_count
FROM users u
LEFT JOIN volunteers v ON u.id = v.user_id
LEFT JOIN user_privileges up ON u.id = up.user_id AND up.is_active = true
WHERE u.email = 'testvolunteer@example.com'
GROUP BY u.id, v.id;
```

**Expected Output:**
- user_id: UUID
- name: Test Volunteer
- role: volunteer
- status: active
- volunteer_id: UUID
- volunteer_status: active
- privilege_count: 9

## Troubleshooting

### Error: "relation users does not exist"
**Solution:** Run `smart_database_setup.sql` - you haven't set up the database yet

### Error: "policy already exists"
**Solution:** This should NOT happen with `smart_database_setup.sql` as it uses `DROP POLICY IF EXISTS`

### Error: "Invalid login credentials"
**Causes:**
1. Wrong email/password
2. User not confirmed in Supabase Auth
3. Auth user exists but no user record in `users` table

**Solution:**
- Verify user exists in Supabase Authentication dashboard
- Verify user exists in `users` table with matching `auth_user_id`
- Check `verified` field is `true`

### Login redirects to homepage instead of dashboard
**Cause:** User role is not 'volunteer'

**Solution:** Check user role:
```sql
SELECT id, email, name, role FROM users WHERE email = 'testvolunteer@example.com';
```
If role is not 'volunteer', update it:
```sql
UPDATE users SET role = 'volunteer' WHERE email = 'testvolunteer@example.com';
```

### Dashboard shows "Loading..." forever
**Causes:**
1. No volunteer record linked to user
2. API endpoint `/api/auth/me` returning error

**Solution:** Check browser console for errors, verify volunteer record exists:
```sql
SELECT * FROM volunteers WHERE email = 'testvolunteer@example.com';
```

## Files Reference

| File | Purpose |
|------|---------|
| `verify_database_state.sql` | Check what's currently set up |
| `smart_database_setup.sql` | Create/update all tables safely |
| `create_test_volunteer.sql` | Detailed guide for test account |
| `SETUP_ORDER.md` | Complete setup documentation |
| `unified_users_system.sql` | Original schema (reference only) |

## Architecture Overview

```
┌─────────────────────────────────────────────────────────────┐
│                     Supabase Auth                           │
│                  (auth.users table)                         │
└────────────────────────┬────────────────────────────────────┘
                         │
                         │ auth_user_id (FK)
                         ▼
┌─────────────────────────────────────────────────────────────┐
│                     users table                             │
│  - Central user registry                                    │
│  - role: super_admin, admin, volunteer, donor, user         │
│  - status: active, inactive, suspended, banned              │
└────────────┬────────────────────────────┬───────────────────┘
             │                            │
             │ user_id (FK)               │ user_id (FK)
             ▼                            ▼
┌─────────────────────────┐    ┌──────────────────────────────┐
│   volunteers table      │    │  user_privileges table       │
│  - Volunteer-specific   │    │  - Fine-grained permissions  │
│    data                 │    │  - Links to predefined_priv  │
│  - role_id → roles      │    └──────────────────────────────┘
└─────────────────────────┘
             │
             │ role_id (FK)
             ▼
┌─────────────────────────┐
│  volunteer_roles table  │
│  - Job positions        │
│  - Requirements         │
└─────────────────────────┘
```

## Default Volunteer Privileges (Auto-granted)

1. `volunteer.view_opportunities` - View available roles
2. `volunteer.apply` - Apply for roles
3. `volunteer.view_assignments` - View own assignments
4. `volunteer.submit_hours` - Log volunteer hours
5. `volunteer.view_reports` - View personal reports
6. `content.view_outreaches` - View outreach programs
7. `communications.receive_notifications` - Receive notifications
8. `communications.send_messages` - Send messages to admin
9. `analytics.view_own` - View personal analytics

## Next Steps After Setup

1. ✅ Database setup complete
2. ✅ Test volunteer account created
3. ✅ Login functionality verified
4. 🔄 Create actual volunteer roles in admin dashboard
5. 🔄 Test volunteer application flow
6. 🔄 Implement volunteer hours logging
7. 🔄 Build volunteer opportunities browser
8. 🔄 Add volunteer reports generation

## Support

If you encounter issues:
1. Run `verify_database_state.sql` and share output
2. Check browser console for JavaScript errors
3. Check Supabase logs for API errors
4. Review `SETUP_ORDER.md` for detailed explanations
