# Volunteer System Database Setup - README

## 📁 File Organization

This folder contains all database scripts and documentation for the Volunteer Management System.

### 🚀 Quick Start Files (Start Here!)

| File | Purpose | When to Use |
|------|---------|-------------|
| **QUICK_START_GUIDE.md** | Step-by-step setup instructions | **READ THIS FIRST** |
| **SETUP_CHECKLIST.md** | Interactive checklist | Track your progress |
| **smart_database_setup.sql** | Main setup script | Run in Supabase SQL Editor |
| **verify_database_state.sql** | Check what exists | Before and after setup |

### 📖 Documentation Files

| File | Purpose | Audience |
|------|---------|----------|
| **VOLUNTEER_SYSTEM_STATUS.md** | Implementation status overview | Everyone |
| **SYSTEM_FLOW_DIAGRAM.md** | Visual flow diagrams | Developers |
| **SETUP_ORDER.md** | Detailed schema explanation | Technical users |
| **UNIFIED_USERS_SYSTEM.md** | Complete architecture docs | Architects |

### 🛠️ SQL Scripts

| File | Purpose | Status |
|------|---------|--------|
| **smart_database_setup.sql** | ✅ **RECOMMENDED** - Idempotent setup | Use this! |
| **unified_users_system.sql** | Original schema (reference only) | Don't run |
| **complete_database_setup.sql** | Previous version (may conflict) | Deprecated |
| **fix_missing_tables.sql** | Previous version (incomplete) | Deprecated |
| **create_test_volunteer.sql** | Test account creation guide | Use after setup |
| **verify_database_state.sql** | State verification | Use anytime |

### 📋 Other Schema Files (For Reference)

These are for other parts of the system (not volunteer-related):

- `campaigns-schema.sql` - Campaign management
- `content_table_schema.sql` - Content management
- `cookie-consent-schema.sql` - Cookie consent
- `outreach_reports_schema.sql` - Outreach reports
- `partnerships-schema.sql` - Partnership management
- `notifications-schema.sql` - Notification system

## 🎯 Setup Flow

```
1. Read QUICK_START_GUIDE.md
        ↓
2. Open SETUP_CHECKLIST.md (track progress)
        ↓
3. Run verify_database_state.sql
        ↓
4. Run smart_database_setup.sql
        ↓
5. Create test account (follow guide in QUICK_START_GUIDE.md)
        ↓
6. Test volunteer login
        ↓
7. ✅ Done!
```

## 📊 What Gets Created

The `smart_database_setup.sql` script creates:

### Tables (5)
1. **users** - Central user registry (all user types)
2. **volunteers** - Volunteer applications and data
3. **volunteer_roles** - Job positions/opportunities
4. **user_privileges** - Individual permission grants
5. **predefined_privileges** - Permission definitions

### Triggers (2)
1. **create_user_for_approved_volunteer()** - Auto-creates user accounts when volunteer approved
2. **sync_user_volunteer_status()** - Syncs status changes between users and volunteers

### Functions (3)
1. **update_updated_at_column()** - Timestamp updater
2. **user_has_privilege()** - Check if user has specific privilege
3. **get_user_role()** - Get user role by auth ID

### RLS Policies (10+)
- Users can view own profile
- Users can update own profile
- Admins can view all users
- Admins can manage users
- Public can view active volunteer roles
- Public can insert volunteer applications
- Volunteers can view own record
- Admins can manage volunteers
- etc.

### Default Data
- **9 volunteer privileges** automatically inserted

## 🔍 Understanding the System

### Architecture Diagram

```
Supabase Auth (auth.users)
        ↓
    users (central registry)
        ↓
        ├─→ volunteers (volunteer-specific data)
        │       ↓
        │   volunteer_roles (job positions)
        │
        └─→ user_privileges (permission grants)
                ↓
            predefined_privileges (permission definitions)
```

### Key Concepts

**1. Unified Users System**
- All users (volunteers, donors, admins) in one `users` table
- Role-based access control via `role` field
- Fine-grained permissions via `user_privileges`

**2. Automatic Workflows**
- When volunteer approved → User account auto-created
- When user role changed → Permissions auto-updated
- When volunteer status changed → User status synced

**3. Security**
- Row Level Security (RLS) on all tables
- Users can only see their own data
- Admins can see all data
- Protected routes in frontend

## 🚨 Common Issues and Solutions

### "policy already exists"
**Cause:** Trying to run `complete_database_setup.sql` when some tables exist
**Solution:** Use `smart_database_setup.sql` instead (handles existing tables)

### "relation users does not exist"
**Cause:** Database not set up yet
**Solution:** Run `smart_database_setup.sql`

### "Invalid login credentials"
**Causes:**
1. User not confirmed in Supabase Auth
2. No user record in `users` table
3. Wrong password

**Solutions:**
1. Check Supabase Authentication dashboard → User should be confirmed
2. Run verification query to check if user exists
3. Reset password or create new test account

### Login redirects to homepage
**Cause:** User role is not 'volunteer'
**Solution:** Check user role in database, update if needed

### Dashboard shows "Loading..." forever
**Causes:**
1. No volunteer record linked
2. API endpoint error
3. No privileges granted

**Solutions:**
1. Check browser console for errors
2. Verify volunteer record exists and is linked to user
3. Check privileges were granted

## 📞 Getting Help

**If you're stuck:**

1. **Check the guides:**
   - Start with `QUICK_START_GUIDE.md`
   - Review troubleshooting section

2. **Run diagnostics:**
   - Run `verify_database_state.sql`
   - Check browser console (F12)
   - Check Supabase logs

3. **Review flows:**
   - Read `SYSTEM_FLOW_DIAGRAM.md`
   - Understand which step is failing

4. **Check implementation:**
   - Review `VOLUNTEER_SYSTEM_STATUS.md`
   - See what's implemented vs. pending

## 🎓 Learning Path

**For Beginners:**
1. Start with `QUICK_START_GUIDE.md`
2. Follow `SETUP_CHECKLIST.md`
3. Don't worry about understanding everything
4. Just follow the steps

**For Developers:**
1. Read `VOLUNTEER_SYSTEM_STATUS.md` for overview
2. Review `SYSTEM_FLOW_DIAGRAM.md` for architecture
3. Study `SETUP_ORDER.md` for schema details
4. Check `smart_database_setup.sql` for implementation

**For Architects:**
1. Read `UNIFIED_USERS_SYSTEM.md` for complete architecture
2. Review all flow diagrams in `SYSTEM_FLOW_DIAGRAM.md`
3. Study RLS policies and security model
4. Understand trigger-based automation

## ✅ Verification Commands

**Check if tables exist:**
```sql
SELECT table_name FROM information_schema.tables
WHERE table_name IN ('users', 'volunteers', 'volunteer_roles', 'user_privileges', 'predefined_privileges')
ORDER BY table_name;
```

**Check row counts:**
```sql
SELECT 'users' as table_name, COUNT(*) FROM users
UNION ALL SELECT 'volunteers', COUNT(*) FROM volunteers
UNION ALL SELECT 'volunteer_roles', COUNT(*) FROM volunteer_roles
UNION ALL SELECT 'user_privileges', COUNT(*) FROM user_privileges
UNION ALL SELECT 'predefined_privileges', COUNT(*) FROM predefined_privileges;
```

**Check test account:**
```sql
SELECT u.*, v.id as volunteer_id, COUNT(up.id) as privileges
FROM users u
LEFT JOIN volunteers v ON u.id = v.user_id
LEFT JOIN user_privileges up ON u.id = up.user_id AND up.is_active = true
WHERE u.email = 'testvolunteer@example.com'
GROUP BY u.id, v.id;
```

## 📝 Maintenance

### Regular Tasks
- [ ] Backup database regularly
- [ ] Review pending volunteer applications
- [ ] Audit user privileges periodically
- [ ] Clean up inactive volunteers
- [ ] Update predefined privileges as needed

### Monitoring
- Check Supabase dashboard for:
  - Database size
  - API usage
  - Error logs
  - Slow queries

## 🔐 Security Checklist

- [ ] RLS enabled on all tables
- [ ] Service role key not exposed in frontend
- [ ] Protected routes implemented
- [ ] API endpoints require authentication
- [ ] Sensitive data encrypted at rest
- [ ] Regular security audits scheduled

## 📅 Version History

| Date | Version | Changes |
|------|---------|---------|
| Feb 27, 2026 | 1.0 | Initial volunteer system implementation |
| | | - 5 tables, 2 triggers, 3 functions |
| | | - 9 default volunteer privileges |
| | | - Complete authentication flow |
| | | - Admin and volunteer portals |

## 🎯 Next Features (Roadmap)

- [ ] Volunteer hours logging
- [ ] Opportunities browser/search
- [ ] Email notifications
- [ ] Calendar integration
- [ ] Mobile app API
- [ ] Volunteer certificates
- [ ] Performance analytics
- [ ] Team management

---

**Last Updated:** February 27, 2026
**Status:** ✅ Ready for deployment
**Dev Server:** Running at http://localhost:3000
**Database:** Ready for setup (run smart_database_setup.sql)

**Quick Command:**
```bash
# From project root
cd database
open QUICK_START_GUIDE.md
```
