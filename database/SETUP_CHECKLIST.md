# Volunteer System Setup Checklist

Use this checklist to track your setup progress. Check off each item as you complete it.

## 📋 Pre-Setup Verification

- [ ] **Dev server is running**
  ```bash
  cd /path/to/saintlammy_foundation
  npm run dev
  ```
  Expected: Server starts at http://localhost:3000

- [ ] **Environment variables configured**
  - [ ] `.env.local` file exists
  - [ ] `NEXT_PUBLIC_SUPABASE_URL` is set
  - [ ] `NEXT_PUBLIC_SUPABASE_ANON_KEY` is set
  - [ ] `SUPABASE_SERVICE_ROLE_KEY` is set

- [ ] **Supabase project accessible**
  - [ ] Can log into Supabase dashboard
  - [ ] SQL Editor is accessible
  - [ ] Authentication tab is accessible

## 🗄️ Database Setup (Critical)

### Step 1: Verify Current State
- [ ] Open Supabase SQL Editor
- [ ] Create new query
- [ ] Paste contents of `database/verify_database_state.sql`
- [ ] Click **Run**
- [ ] **Record results:**
  - [ ] `users` table: ☐ EXISTS / ☐ MISSING
  - [ ] `volunteers` table: ☐ EXISTS / ☐ MISSING
  - [ ] `volunteer_roles` table: ☐ EXISTS / ☐ MISSING
  - [ ] `user_privileges` table: ☐ EXISTS / ☐ MISSING
  - [ ] `predefined_privileges` table: ☐ EXISTS / ☐ MISSING

### Step 2: Run Smart Setup Script
- [ ] In Supabase SQL Editor, create new query
- [ ] Paste **entire contents** of `database/smart_database_setup.sql`
- [ ] Review the script (optional)
- [ ] Click **Run**
- [ ] **Check for success message:**
  ```
  === SMART DATABASE SETUP COMPLETE ===

    ✅ users
    ✅ volunteer_roles
    ✅ volunteers
    ✅ user_privileges
    ✅ predefined_privileges (9 privileges)

  Ready to create volunteer accounts!
  ```
- [ ] **If errors occur:**
  - [ ] Copy error message
  - [ ] Check `database/QUICK_START_GUIDE.md` → Troubleshooting section
  - [ ] Try running `verify_database_state.sql` again

### Step 3: Verify Setup
- [ ] Run verification query again:
  ```sql
  SELECT table_name,
    CASE WHEN EXISTS (SELECT FROM information_schema.tables WHERE table_name = t.table_name)
    THEN '✅ EXISTS' ELSE '❌ MISSING' END as status
  FROM (VALUES ('users'), ('volunteers'), ('volunteer_roles'), ('user_privileges'), ('predefined_privileges')) AS t(table_name);
  ```
- [ ] **All 5 tables show ✅ EXISTS**
- [ ] Check row counts:
  ```sql
  SELECT 'predefined_privileges' as table_name, COUNT(*) as count FROM predefined_privileges;
  ```
  Expected: 9 privileges

## 👤 Test Account Creation

### Method A: Via Supabase Dashboard (Recommended)

#### Part 1: Create Auth User
- [ ] Navigate to **Authentication** → **Users**
- [ ] Click **Add User**
- [ ] Fill in details:
  - [ ] Email: `testvolunteer@example.com`
  - [ ] Password: `Test123!@#`
  - [ ] Auto Confirm: ✅ **Yes**
- [ ] Click **Create User**
- [ ] **Copy the User ID (UUID)** → _________________

#### Part 2: Create User Record
- [ ] Go to **SQL Editor**
- [ ] Paste this query (replace `YOUR_AUTH_USER_ID`):
  ```sql
  INSERT INTO users (auth_user_id, email, name, phone, location, role, status, verified)
  VALUES (
    'YOUR_AUTH_USER_ID',  -- Replace with copied UUID
    'testvolunteer@example.com',
    'Test Volunteer',
    '+234-800-0000-000',
    'Lagos, Nigeria',
    'volunteer',
    'active',
    true
  )
  RETURNING id;
  ```
- [ ] Click **Run**
- [ ] **Copy the returned user ID** → _________________

#### Part 3: Create Volunteer Record
- [ ] Paste this query (replace `NEW_USER_ID`):
  ```sql
  INSERT INTO volunteers (user_id, email, name, phone, location, status, interests, skills, availability)
  VALUES (
    'NEW_USER_ID',  -- Replace with user ID from Part 2
    'testvolunteer@example.com',
    'Test Volunteer',
    '+234-800-0000-000',
    'Lagos, Nigeria',
    'active',
    ARRAY['community service', 'education'],
    ARRAY['teaching', 'organizing events'],
    ARRAY['weekends', 'evenings']
  );
  ```
- [ ] Click **Run**
- [ ] Check for success (no errors)

#### Part 4: Grant Privileges
- [ ] Paste this query (replace `NEW_USER_ID`):
  ```sql
  INSERT INTO user_privileges (user_id, privilege_key, is_active)
  SELECT 'NEW_USER_ID', key, true
  FROM predefined_privileges
  WHERE 'volunteer' = ANY(default_roles) AND is_active = true;
  ```
- [ ] Click **Run**
- [ ] Verify 9 rows inserted

### Method B: Via Admin Dashboard (Alternative)
- [ ] Log into admin dashboard: `http://localhost:3000/admin`
- [ ] Navigate to **Users** → **Volunteers**
- [ ] Click **Add New User**
- [ ] Fill in form:
  - [ ] Name: Test Volunteer
  - [ ] Email: testvolunteer@example.com
  - [ ] Phone: +234-800-0000-000
  - [ ] Location: Lagos, Nigeria
  - [ ] Role: Volunteer
  - [ ] Status: Active
- [ ] Click **Create**
- [ ] Wait for success message
- [ ] Refresh page
- [ ] Verify user appears in list

### Verify Test Account
- [ ] Run verification query:
  ```sql
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
- [ ] **Verify output:**
  - [ ] `user_id`: Has UUID
  - [ ] `name`: Test Volunteer
  - [ ] `role`: volunteer
  - [ ] `status`: active
  - [ ] `volunteer_id`: Has UUID
  - [ ] `volunteer_status`: active
  - [ ] `privilege_count`: 9

## 🧪 Frontend Testing

### Test Login Page
- [ ] Open browser to: `http://localhost:3000/volunteer/login`
- [ ] Page loads without errors
- [ ] Check browser console (F12) → **No errors**
- [ ] Form elements visible:
  - [ ] Email input field
  - [ ] Password input field
  - [ ] Sign In button
  - [ ] Forgot Password link

### Test Login Flow
- [ ] Enter credentials:
  - [ ] Email: `testvolunteer@example.com`
  - [ ] Password: `Test123!@#`
- [ ] Click **Sign In**
- [ ] **Verify redirect** to: `http://localhost:3000/volunteer/dashboard`
- [ ] Check browser console → **No errors**

### Test Dashboard
- [ ] Dashboard loads successfully
- [ ] **Verify displayed data:**
  - [ ] Profile card shows:
    - [ ] Name: Test Volunteer
    - [ ] Email: testvolunteer@example.com
    - [ ] Role badge: Volunteer
  - [ ] Stats section shows:
    - [ ] Hours Logged (number)
    - [ ] Events Attended (number)
    - [ ] Impact Score (number)
  - [ ] Quick actions visible:
    - [ ] Log Hours button
    - [ ] Browse Opportunities button
    - [ ] View Reports button
  - [ ] Interests displayed:
    - [ ] community service
    - [ ] education
  - [ ] Skills displayed:
    - [ ] teaching
    - [ ] organizing events
- [ ] Check browser console → **No errors**

### Test Authorization
- [ ] Log out from volunteer dashboard
- [ ] Try accessing: `http://localhost:3000/volunteer/dashboard` (while logged out)
- [ ] **Verify redirect** to: `http://localhost:3000/volunteer/login`
- [ ] Log in with admin account (if available)
- [ ] Try accessing: `http://localhost:3000/volunteer/dashboard` (as admin)
- [ ] **Verify redirect** to: `http://localhost:3000/` (homepage)

## 🔗 Integration Testing

### Test Admin → Volunteer Flow
- [ ] Log into admin dashboard
- [ ] Navigate to **Users** → **Volunteers**
- [ ] Find existing pending volunteer application (or create one)
- [ ] Click **Approve**
- [ ] **Verify:**
  - [ ] Status changes to "Approved" or "Active"
  - [ ] No errors in console
- [ ] Go to Supabase SQL Editor
- [ ] Run:
  ```sql
  SELECT * FROM users WHERE email = '[approved_volunteer_email]';
  ```
- [ ] **Verify:** User record exists with `role = 'volunteer'`

### Test Database Triggers
- [ ] Run trigger test:
  ```sql
  -- Create test volunteer application
  INSERT INTO volunteers (email, name, status)
  VALUES ('trigger.test@example.com', 'Trigger Test', 'pending')
  RETURNING id;
  ```
- [ ] Copy the returned ID
- [ ] Run approval:
  ```sql
  UPDATE volunteers SET status = 'approved' WHERE id = '[copied_id]';
  ```
- [ ] Check if user was auto-created:
  ```sql
  SELECT u.*, v.user_id
  FROM users u
  JOIN volunteers v ON u.id = v.user_id
  WHERE u.email = 'trigger.test@example.com';
  ```
- [ ] **Verify:** User exists and is linked to volunteer
- [ ] Check privileges:
  ```sql
  SELECT COUNT(*) FROM user_privileges up
  JOIN users u ON up.user_id = u.id
  WHERE u.email = 'trigger.test@example.com' AND up.is_active = true;
  ```
- [ ] **Verify:** Count = 9

### Test Status Sync Trigger
- [ ] Run status change:
  ```sql
  UPDATE volunteers SET status = 'inactive' WHERE email = 'trigger.test@example.com';
  ```
- [ ] Check user status:
  ```sql
  SELECT status FROM users WHERE email = 'trigger.test@example.com';
  ```
- [ ] **Verify:** `status = 'inactive'`

## 📊 API Testing (Optional)

### Test /api/admin/users
- [ ] Open API testing tool (Postman/Insomnia) or use curl
- [ ] **GET Request:**
  ```bash
  curl http://localhost:3000/api/admin/users \
    -H "Authorization: Bearer YOUR_TOKEN"
  ```
- [ ] **Verify:** Returns list of users
- [ ] **POST Request:**
  ```bash
  curl -X POST http://localhost:3000/api/admin/users \
    -H "Authorization: Bearer YOUR_TOKEN" \
    -H "Content-Type: application/json" \
    -d '{"email":"api.test@example.com","name":"API Test","role":"volunteer"}'
  ```
- [ ] **Verify:** Returns success with created user

### Test /api/auth/me
- [ ] Log in as test volunteer
- [ ] Get session token from browser DevTools → Application → Local Storage
- [ ] Make request:
  ```bash
  curl http://localhost:3000/api/auth/me \
    -H "Authorization: Bearer YOUR_SESSION_TOKEN"
  ```
- [ ] **Verify:** Returns user object with volunteer details

## ✅ Final Verification

### Database Checklist
- [ ] All 5 tables exist in Supabase
- [ ] At least 9 predefined privileges exist
- [ ] Test volunteer user exists in `users` table
- [ ] Test volunteer record exists in `volunteers` table
- [ ] Test volunteer has 9 active privileges
- [ ] Triggers work (tested with trigger.test@example.com)
- [ ] No errors in Supabase logs

### Frontend Checklist
- [ ] Login page loads at `/volunteer/login`
- [ ] Can log in with test credentials
- [ ] Dashboard loads at `/volunteer/dashboard`
- [ ] Dashboard displays user data correctly
- [ ] Authorization works (non-volunteers blocked)
- [ ] No console errors on any page
- [ ] Responsive design works on mobile

### Integration Checklist
- [ ] Admin can create volunteer users
- [ ] Admin can approve volunteer applications
- [ ] Approval triggers user creation automatically
- [ ] Status changes sync between tables
- [ ] Privileges granted automatically
- [ ] No orphaned records

## 🎉 Success Criteria

**You're done when:**
- ✅ All database tables exist and populated
- ✅ Test volunteer can log in successfully
- ✅ Dashboard displays correctly with data
- ✅ No errors in browser console
- ✅ No errors in Supabase logs
- ✅ Triggers work automatically
- ✅ Admin can manage volunteers

## 📝 Notes Section

Use this space to record any issues, observations, or customizations:

```
Date: _____________

Issues Encountered:
-
-
-

Solutions Applied:
-
-
-

Customizations Made:
-
-
-

Additional Testing Notes:
-
-
-
```

## 🆘 If Something Goes Wrong

1. **Check `database/QUICK_START_GUIDE.md` → Troubleshooting section**
2. **Run `database/verify_database_state.sql`** to see current state
3. **Check browser console** for JavaScript errors
4. **Check Supabase logs** for database/API errors
5. **Review `database/SYSTEM_FLOW_DIAGRAM.md`** for understanding flows

## 📚 Reference Documents

- `QUICK_START_GUIDE.md` - Step-by-step instructions
- `SETUP_ORDER.md` - Detailed schema explanation
- `SYSTEM_FLOW_DIAGRAM.md` - Visual flow diagrams
- `VOLUNTEER_SYSTEM_STATUS.md` - Current implementation status
- `UNIFIED_USERS_SYSTEM.md` - Complete architecture docs
- `create_test_volunteer.sql` - Test account creation

---

**Setup Started:** _______________
**Setup Completed:** _______________
**Tested By:** _______________
**Status:** ☐ In Progress / ☐ Complete / ☐ Issues Found
