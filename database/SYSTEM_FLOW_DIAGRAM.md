# Volunteer System Flow Diagram

## 🎯 Complete System Flow

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                         VOLUNTEER REGISTRATION FLOW                         │
└─────────────────────────────────────────────────────────────────────────────┘

Step 1: Public Application
━━━━━━━━━━━━━━━━━━━━━━━━
Public User visits /volunteer
        ↓
Fills out volunteer application form
        ↓
Submits form
        ↓
POST /api/volunteers
        ↓
INSERT INTO volunteers (
    email, name, phone, location,
    interests, skills, availability,
    status = 'pending',
    user_id = NULL  ← No user account yet
)
        ↓
✅ Application submitted!
📧 (Future: Admin notification email)


Step 2: Admin Review
━━━━━━━━━━━━━━━━━━━━━━━━
Admin logs into /admin/users/volunteers
        ↓
Views pending applications
        ↓
Reviews volunteer details:
  - Name, email, phone
  - Interests, skills, availability
  - Emergency contact
        ↓
Admin clicks "Approve" button
        ↓
PUT /api/admin/volunteers
        ↓
UPDATE volunteers
SET status = 'approved'
WHERE id = volunteer_id
        ↓
🔥 DATABASE TRIGGER FIRES! 🔥
        ↓
Trigger: create_user_for_approved_volunteer()
        ↓
┌───────────────────────────────────────┐
│ Automatic Actions (No Code Required) │
└───────────────────────────────────────┘
    ↓
    ├─→ INSERT INTO users (
    │       email = volunteer.email,
    │       name = volunteer.name,
    │       role = 'volunteer',
    │       status = 'active',
    │       verified = true
    │   )
    │   RETURNING id → new_user_id
    │
    ├─→ UPDATE volunteers
    │       SET user_id = new_user_id
    │
    └─→ INSERT INTO user_privileges
            (9 default volunteer privileges)
            FROM predefined_privileges
            WHERE 'volunteer' IN default_roles
        ↓
✅ Volunteer account created!
✅ User record linked!
✅ 9 privileges granted!
📧 (Future: Welcome email with login credentials)


Step 3: Volunteer Login
━━━━━━━━━━━━━━━━━━━━━━━━
Volunteer receives approval notification
        ↓
Navigates to /volunteer/login
        ↓
Enters: email + password
        ↓
Clicks "Sign In"
        ↓
Supabase Auth validates credentials
        ↓
POST /api/auth/me
        ↓
SELECT * FROM users
LEFT JOIN volunteers ON users.id = volunteers.user_id
WHERE auth_user_id = authenticated_user_id
        ↓
✅ Role = 'volunteer'? → Continue
❌ Role ≠ 'volunteer'? → Redirect to homepage
        ↓
Redirect to /volunteer/dashboard
        ↓
✅ Volunteer logged in successfully!
```

---

## 🔐 Authentication & Authorization Flow

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                    VOLUNTEER PORTAL ACCESS CONTROL                          │
└─────────────────────────────────────────────────────────────────────────────┘

User visits /volunteer/dashboard
        ↓
<VolunteerProtectedRoute> wrapper checks:
        ↓
┌───────────────────────────────────────┐
│ 1. Is user authenticated?            │
│    Check: AuthContext.user exists    │
│    Check: AuthContext.session valid  │
└───────────────────────────────────────┘
        ↓
    ┌───────┬───────┐
    │  YES  │   NO  │
    │       │       │
    ▼       │       ▼
Continue    │   Redirect to /volunteer/login
            │
            ▼
        ❌ Blocked

┌───────────────────────────────────────┐
│ 2. Does user have volunteer role?    │
│    API call: GET /api/auth/me        │
│    Check: user.role === 'volunteer'  │
└───────────────────────────────────────┘
        ↓
    ┌───────┬───────┐
    │  YES  │   NO  │
    │       │       │
    ▼       │       ▼
Continue    │   Redirect to /
            │   (Homepage)
            │
            ▼
        ❌ Blocked

✅ All checks passed!
        ↓
Render <VolunteerDashboard />
        ↓
Dashboard fetches volunteer data:
        ↓
GET /api/auth/me
        ↓
Returns:
{
  user: {
    id, name, email, role, status,
    volunteers: [{
      id, status, interests, skills,
      volunteer_roles: { title, category }
    }]
  }
}
        ↓
Display dashboard with:
  ✅ Profile card
  ✅ Stats (hours, events, impact)
  ✅ Quick actions
  ✅ Upcoming opportunities
  ✅ Recent activities
```

---

## 📊 Database Trigger Flow

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                    AUTOMATIC USER CREATION TRIGGER                          │
└─────────────────────────────────────────────────────────────────────────────┘

UPDATE volunteers SET status = 'approved' WHERE id = ?
        ↓
BEFORE UPDATE trigger:
    create_user_for_approved_volunteer()
        ↓
┌───────────────────────────────────────┐
│ Trigger Logic:                        │
│                                       │
│ IF (NEW.status IN ('approved',       │
│                    'active'))         │
│ AND                                   │
│    (OLD.status NOT IN ('approved',   │
│                        'active'))     │
│ AND                                   │
│    (NEW.user_id IS NULL)             │
│                                       │
│ THEN → Create user account           │
└───────────────────────────────────────┘
        ↓
    ┌─────────────────────────────────────────┐
    │ Step 1: Create user record              │
    │                                         │
    │ INSERT INTO users (                     │
    │   email = NEW.email,                    │
    │   name = COALESCE(NEW.name,             │
    │          NEW.first_name || ' ' ||       │
    │          NEW.last_name),                │
    │   phone = NEW.phone,                    │
    │   location = NEW.location,              │
    │   role = 'volunteer',                   │
    │   status = 'active',                    │
    │   verified = true                       │
    │ )                                       │
    │ RETURNING id → new_user_id              │
    └─────────────────────────────────────────┘
        ↓
    ┌─────────────────────────────────────────┐
    │ Step 2: Link volunteer to user          │
    │                                         │
    │ NEW.user_id = new_user_id               │
    │                                         │
    │ (This updates the volunteer record      │
    │  before it's saved to the database)     │
    └─────────────────────────────────────────┘
        ↓
    ┌─────────────────────────────────────────┐
    │ Step 3: Grant default privileges        │
    │                                         │
    │ INSERT INTO user_privileges             │
    │   (user_id, privilege_key, is_active)   │
    │ SELECT                                  │
    │   new_user_id,                          │
    │   key,                                  │
    │   true                                  │
    │ FROM predefined_privileges              │
    │ WHERE 'volunteer' = ANY(default_roles)  │
    │   AND is_active = true                  │
    └─────────────────────────────────────────┘
        ↓
RETURN NEW;
        ↓
UPDATE completes with NEW.user_id set
        ↓
✅ Volunteer now has:
    - User account (in users table)
    - Linked user_id (in volunteers table)
    - 9 default privileges (in user_privileges table)
```

---

## 🔄 Status Synchronization Flow

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                    VOLUNTEER STATUS SYNC TRIGGER                            │
└─────────────────────────────────────────────────────────────────────────────┘

UPDATE volunteers SET status = 'inactive' WHERE id = ?
        ↓
AFTER UPDATE OF status trigger:
    sync_user_volunteer_status()
        ↓
┌───────────────────────────────────────┐
│ Trigger Logic:                        │
│                                       │
│ IF NEW.user_id IS NOT NULL            │
│ THEN → Sync status to users table    │
└───────────────────────────────────────┘
        ↓
UPDATE users
SET status = CASE
    WHEN NEW.status = 'active' THEN 'active'
    WHEN NEW.status = 'approved' THEN 'active'
    WHEN NEW.status = 'inactive' THEN 'inactive'
    WHEN NEW.status = 'rejected' THEN 'suspended'
    ELSE 'inactive'
END
WHERE id = NEW.user_id
        ↓
✅ User status synchronized!
        ↓
Result:
    volunteers.status = 'inactive'
    users.status = 'inactive'
        ↓
Effect:
    ❌ Volunteer can no longer log in
    ❌ API calls will be rejected
    ✅ Data preserved for audit
```

---

## 🎯 Admin User Creation Flow

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                    ADMIN CREATES VOLUNTEER USER                             │
└─────────────────────────────────────────────────────────────────────────────┘

Admin navigates to /admin/users/volunteers
        ↓
Clicks "Add New User" button
        ↓
Fills out form:
    - Name: John Doe
    - Email: john@example.com
    - Phone: +234-800-000-0000
    - Location: Lagos
    - Role: volunteer
    - Status: active
        ↓
Submits form
        ↓
POST /api/admin/users
Body: {
    name, email, phone, location,
    role: 'volunteer',
    createVolunteerRecord: true
}
        ↓
┌─────────────────────────────────────────┐
│ Backend Logic (Automatic):             │
│                                         │
│ 1. Validate input                       │
│ 2. Check email not already exists       │
│ 3. INSERT INTO users (...)              │
│    RETURNING new_user_id                │
│                                         │
│ 4. IF role === 'volunteer':             │
│      INSERT INTO volunteers (           │
│        user_id = new_user_id,           │
│        status = 'active'                │
│      )                                  │
│                                         │
│ 5. SELECT default privileges            │
│    WHERE 'volunteer' IN default_roles   │
│                                         │
│ 6. INSERT INTO user_privileges          │
│    (9 privilege grants)                 │
└─────────────────────────────────────────┘
        ↓
✅ Response: {
    success: true,
    data: { id, name, email, role, status },
    message: 'User created successfully'
}
        ↓
Frontend refreshes user list
        ↓
✅ New volunteer appears in table!
```

---

## 📋 Default Volunteer Privileges

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                    9 DEFAULT VOLUNTEER PRIVILEGES                           │
└─────────────────────────────────────────────────────────────────────────────┘

When volunteer account is created, these are automatically granted:

Category: volunteers
  1. ✅ volunteer.view_opportunities
     → View available volunteer roles and opportunities

  2. ✅ volunteer.apply
     → Submit applications for volunteer roles

  3. ✅ volunteer.view_assignments
     → View own volunteer assignments and schedules

  4. ✅ volunteer.submit_hours
     → Log volunteer hours worked

  5. ✅ volunteer.view_reports
     → View personal volunteer activity reports

Category: content
  6. ✅ content.view_outreaches
     → View outreach programs and events

Category: communications
  7. ✅ communications.receive_notifications
     → Receive notifications about volunteer activities

  8. ✅ communications.send_messages
     → Send messages to admin team

Category: analytics
  9. ✅ analytics.view_own
     → View personal contribution analytics


How They're Granted:
━━━━━━━━━━━━━━━━━━━━━━━━
INSERT INTO user_privileges (user_id, privilege_key, is_active)
SELECT
    new_user_id,
    key,
    true
FROM predefined_privileges
WHERE 'volunteer' = ANY(default_roles)
  AND is_active = true
```

---

## 🗄️ Database Relationships

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                         TABLE RELATIONSHIPS                                 │
└─────────────────────────────────────────────────────────────────────────────┘

┌──────────────────────┐
│   auth.users         │  ← Supabase Authentication
│   (managed by Auth)  │
└──────────┬───────────┘
           │
           │ auth_user_id (FK)
           │
           ▼
┌──────────────────────┐
│   users              │  ← Central User Registry
│───────────────────── │
│ id (PK)              │
│ auth_user_id (FK)    │──┐
│ email (UNIQUE)       │  │
│ name                 │  │
│ role                 │  │ One-to-Many
│ status               │  │
│ verified             │  │
│ created_at           │  │
│ updated_at           │  │
└──────────┬───────────┘  │
           │              │
           │              ▼
           │         ┌──────────────────────┐
           │         │ user_privileges      │
           │         │───────────────────── │
           │         │ id (PK)              │
           │         │ user_id (FK)         │
           │         │ privilege_key (FK)   │
           │         │ is_active            │
           │         │ granted_at           │
           │         │ expires_at           │
           │         └──────────┬───────────┘
           │                    │
           │                    │ privilege_key (FK)
           │                    │
           │                    ▼
           │         ┌──────────────────────┐
           │         │ predefined_privileges│
           │         │───────────────────── │
           │         │ id (PK)              │
           │         │ key (UNIQUE)         │
           │         │ name                 │
           │         │ description          │
           │         │ category             │
           │         │ default_roles[]      │
           │         │ is_active            │
           │         └──────────────────────┘
           │
           │ user_id (FK)
           │
           ▼
┌──────────────────────┐
│   volunteers         │  ← Volunteer Applications
│───────────────────── │
│ id (PK)              │
│ user_id (FK)         │──┐
│ email                │  │
│ name                 │  │
│ status               │  │ Many-to-One
│ role_id (FK)         │  │
│ interests[]          │  │
│ skills[]             │  │
│ availability[]       │  │
│ created_at           │  │
└──────────┬───────────┘  │
           │              │
           │ role_id (FK) │
           │              │
           ▼              │
┌──────────────────────┐  │
│   volunteer_roles    │  │
│───────────────────── │  │
│ id (PK)              │◄─┘
│ title                │
│ description          │
│ required_skills[]    │
│ responsibilities[]   │
│ category             │
│ is_active            │
└──────────────────────┘


Foreign Key Constraints:
━━━━━━━━━━━━━━━━━━━━━━━━
users.auth_user_id → auth.users.id (ON DELETE CASCADE)
volunteers.user_id → users.id (ON DELETE SET NULL)
volunteers.role_id → volunteer_roles.id (ON DELETE SET NULL)
user_privileges.user_id → users.id (ON DELETE CASCADE)
```

---

## 🔍 Privilege Checking Flow

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                    HOW PRIVILEGE CHECKING WORKS                             │
└─────────────────────────────────────────────────────────────────────────────┘

Volunteer attempts action (e.g., submit_hours)
        ↓
Backend calls: user_has_privilege(user_id, 'volunteer.submit_hours')
        ↓
┌───────────────────────────────────────┐
│ Step 1: Check explicit grants        │
│                                       │
│ SELECT EXISTS(                        │
│   SELECT 1                            │
│   FROM user_privileges                │
│   WHERE user_id = user_id             │
│     AND privilege_key = privilege_key │
│     AND is_active = true              │
│     AND (expires_at IS NULL           │
│          OR expires_at > now())       │
│ )                                     │
└───────────────────────────────────────┘
        ↓
    ┌───────┬───────┐
    │ FOUND │  NOT  │
    │       │ FOUND │
    ▼       │       ▼
✅ Allow    │   Continue to Step 2
            │
            ▼
┌───────────────────────────────────────┐
│ Step 2: Check role defaults           │
│                                       │
│ SELECT EXISTS(                        │
│   SELECT 1                            │
│   FROM users u                        │
│   JOIN predefined_privileges pp       │
│     ON u.role = ANY(pp.default_roles) │
│   WHERE u.id = user_id                │
│     AND pp.key = privilege_key        │
│     AND pp.is_active = true           │
│ )                                     │
└───────────────────────────────────────┘
        ↓
    ┌───────┬───────┐
    │ FOUND │  NOT  │
    │       │ FOUND │
    ▼       │       ▼
✅ Allow    │   ❌ Deny
            │
            ▼
        Return 403 Forbidden


Example:
━━━━━━━━
User: John (role = 'volunteer')
Action: Submit hours

Check 1: user_privileges
  user_id = john_id
  privilege_key = 'volunteer.submit_hours'
  Result: ❌ Not found in explicit grants

Check 2: predefined_privileges
  role = 'volunteer'
  privilege_key = 'volunteer.submit_hours'
  default_roles = ['volunteer']
  Result: ✅ Found! 'volunteer' in default_roles

Final: ✅ Allow action
```

---

**Generated:** February 27, 2026
**Purpose:** Visual reference for understanding the complete volunteer system
**Status:** All flows implemented and ready for testing
