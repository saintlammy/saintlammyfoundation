# Database Setup Order - IMPORTANT!

## ⚠️ Run SQL Scripts in This Exact Order

The database tables have dependencies on each other. **You must run the scripts in this order**:

---

## Step-by-Step Setup

### Step 1: Check What Exists Already

Run this in Supabase SQL Editor to see what tables you already have:

```sql
SELECT table_name
FROM information_schema.tables
WHERE table_schema = 'public'
ORDER BY table_name;
```

---

### Step 2: Run Scripts in Order

#### 1️⃣ **Core Triggers** (May already exist)
If `update_updated_at_column()` function doesn't exist, run:

```sql
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';
```

---

#### 2️⃣ **Volunteer Tables** (If not exists)
**File**: `database/volunteer_tables.sql`

Creates:
- `volunteer_roles` table
- `volunteer_forms` table
- Seed data for 4 volunteer roles

**Check if exists**:
```sql
SELECT EXISTS (
    SELECT FROM information_schema.tables
    WHERE table_schema = 'public'
    AND table_name = 'volunteer_roles'
);
```

If returns `false`, run the entire `volunteer_tables.sql` file.

---

#### 3️⃣ **Form Options Tables** (If not exists)
**File**: `database/form_options_tables.sql`

Creates:
- `contact_inquiry_types` (6 options)
- `supported_currencies` (11 currencies)
- `payment_methods` (5 methods)
- `donation_types` (6 types)
- `donation_preset_amounts` (20 presets)
- `organization_types` (8 types)
- `partnership_types` (6 types)
- `partnership_timelines` (5 timelines)
- `volunteer_availability_options` (7 options)
- `volunteer_interest_areas` (8 areas)

**Check if exists**:
```sql
SELECT EXISTS (
    SELECT FROM information_schema.tables
    WHERE table_schema = 'public'
    AND table_name = 'supported_currencies'
);
```

If returns `false`, run the entire `form_options_tables.sql` file.

---

#### 4️⃣ **Unified Users System** ⭐ **REQUIRED FOR VOLUNTEER LOGIN**
**File**: `database/unified_users_system.sql`

Creates:
- `users` table (Central user registry)
- `user_privileges` table
- `predefined_privileges` table (with 9 volunteer privileges)
- Adds `user_id` column to `volunteers` table
- Adds `role_id` column to `volunteers` table
- Automatic triggers for user creation
- Helper functions

**Check if exists**:
```sql
SELECT EXISTS (
    SELECT FROM information_schema.tables
    WHERE table_schema = 'public'
    AND table_name = 'users'
);
```

If returns `false`, run the entire `unified_users_system.sql` file.

⚠️ **This is the missing piece causing your error!**

---

#### 5️⃣ **Create Test Volunteer** (After all above are done)
**File**: `database/create_test_volunteer.sql`

Follow the instructions in that file to create a test account.

---

## Quick Setup Script (All-in-One)

If you want to set everything up at once, copy this entire block and run in Supabase SQL Editor:

```sql
-- =====================================================
-- COMPLETE DATABASE SETUP
-- Run this if starting from scratch
-- =====================================================

-- Check what's missing
DO $$
DECLARE
    missing_tables TEXT[];
BEGIN
    -- Check for missing tables
    IF NOT EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'volunteer_roles') THEN
        RAISE NOTICE '❌ volunteer_roles table missing - Need to run volunteer_tables.sql';
        missing_tables := array_append(missing_tables, 'volunteer_roles');
    ELSE
        RAISE NOTICE '✅ volunteer_roles exists';
    END IF;

    IF NOT EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'supported_currencies') THEN
        RAISE NOTICE '❌ form options tables missing - Need to run form_options_tables.sql';
        missing_tables := array_append(missing_tables, 'form_options_tables');
    ELSE
        RAISE NOTICE '✅ form options tables exist';
    END IF;

    IF NOT EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'users') THEN
        RAISE NOTICE '❌ users table missing - Need to run unified_users_system.sql';
        missing_tables := array_append(missing_tables, 'users');
    ELSE
        RAISE NOTICE '✅ users table exists';
    END IF;

    IF NOT EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'volunteers') THEN
        RAISE NOTICE '⚠️  volunteers table missing - This is required!';
        RAISE EXCEPTION 'Cannot continue without volunteers table. Create it first.';
    ELSE
        RAISE NOTICE '✅ volunteers table exists';
    END IF;
END $$;
```

This will tell you exactly what's missing.

---

## After Setup: Verify Everything

Run this query to verify all tables exist:

```sql
SELECT
    CASE
        WHEN EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'users') THEN '✅'
        ELSE '❌'
    END as users_table,
    CASE
        WHEN EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'volunteers') THEN '✅'
        ELSE '❌'
    END as volunteers_table,
    CASE
        WHEN EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'volunteer_roles') THEN '✅'
        ELSE '❌'
    END as volunteer_roles_table,
    CASE
        WHEN EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'user_privileges') THEN '✅'
        ELSE '❌'
    END as user_privileges_table,
    CASE
        WHEN EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'predefined_privileges') THEN '✅'
        ELSE '❌'
    END as predefined_privileges_table,
    CASE
        WHEN EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'supported_currencies') THEN '✅'
        ELSE '❌'
    END as form_options_tables;
```

Should see all ✅ checkmarks.

---

## Common Issues

### Issue 1: "relation users does not exist"
**Solution**: Run `database/unified_users_system.sql`

### Issue 2: "relation volunteers does not exist"
**Solution**: You need to create the volunteers table first. Check if you have existing data or run volunteer_tables.sql

### Issue 3: "function update_updated_at_column() does not exist"
**Solution**: Run the trigger function at the top of this document

### Issue 4: "column user_id does not exist in volunteers"
**Solution**: The unified_users_system.sql script adds this column automatically

---

## Checking Column Existence

To see all columns in volunteers table:

```sql
SELECT column_name, data_type
FROM information_schema.columns
WHERE table_name = 'volunteers'
ORDER BY ordinal_position;
```

Should include:
- `user_id` (uuid)
- `role_id` (uuid)
- Plus all existing volunteer columns

---

## Files Location

All SQL files are in:
```
database/
├── volunteer_tables.sql             (Run 1st)
├── form_options_tables.sql          (Run 2nd)
├── unified_users_system.sql         (Run 3rd) ⭐
├── create_test_volunteer.sql        (Run 4th)
└── SETUP_ORDER.md                   (This file)
```

---

## Need Help?

If you get stuck, check:
1. Supabase project is selected correctly
2. You're in the SQL Editor (not Table Editor)
3. You have admin/owner permissions
4. Scripts are run in order (dependencies!)

**Current Error**: "relation users does not exist"
**Solution**: Run `unified_users_system.sql` in Supabase SQL Editor
