# Database Migrations

## Overview
This directory contains SQL migration scripts to update your Supabase database schema.

## Migration 001: Add Campaign ID Support

**File:** `001_add_campaign_id_to_donations.sql`

**Purpose:** Links donations to specific fundraising campaigns for better tracking and progress monitoring.

### Changes:
1. ✅ Adds `campaign_id` column to donations table
2. ✅ Adds `processed_at` column for tracking completion timestamps
3. ✅ Creates index on `campaign_id` for better query performance

### How to Run This Migration

#### Option 1: Using Supabase Dashboard (Recommended)

1. Go to your Supabase project dashboard: https://app.supabase.com/project/zvbxzdhevudsrhxmkncg
2. Navigate to **SQL Editor** in the left sidebar
3. Click **New Query**
4. Copy the entire contents of `001_add_campaign_id_to_donations.sql`
5. Paste into the SQL editor
6. Click **Run** (or press Cmd/Ctrl + Enter)
7. Verify success - you should see "Success. No rows returned"

#### Option 2: Using Supabase CLI

```bash
# Install Supabase CLI if you haven't already
npm install -g supabase

# Login to Supabase
supabase login

# Link to your project
supabase link --project-ref zvbxzdhevudsrhxmkncg

# Run the migration
supabase db push --file database/migrations/001_add_campaign_id_to_donations.sql
```

#### Option 3: Using psql (Advanced)

```bash
# Connect to your Supabase PostgreSQL database
psql "postgresql://postgres:[YOUR-PASSWORD]@db.zvbxzdhevudsrhxmkncg.supabase.co:5432/postgres"

# Run the migration file
\i database/migrations/001_add_campaign_id_to_donations.sql
```

### Verification

After running the migration, verify it worked:

```sql
-- Check that the new columns exist
SELECT column_name, data_type, is_nullable
FROM information_schema.columns
WHERE table_name = 'donations'
  AND column_name IN ('campaign_id', 'processed_at');

-- Should return 2 rows showing both columns
```

### Rollback (if needed)

If you need to undo this migration:

```sql
-- Remove the campaign_id column
ALTER TABLE donations DROP COLUMN IF EXISTS campaign_id;

-- Remove the processed_at column (if it didn't exist before)
ALTER TABLE donations DROP COLUMN IF EXISTS processed_at;

-- Remove the index
DROP INDEX IF EXISTS idx_donations_campaign_id;
```

## What's Fixed

### Before Migration:
- ❌ Dashboard only showed completed donations
- ❌ Pending crypto donations were invisible
- ❌ No campaign tracking support
- ❌ Column name mismatches (code used `campaign_id` but DB didn't have it)

### After Migration:
- ✅ Dashboard shows both completed AND pending donations
- ✅ Pending donations display with orange status badges
- ✅ Campaign progress tracking works correctly
- ✅ All column names match between code and database
- ✅ Your $10 BSC test donation will now appear on the dashboard

## Related Code Changes

The following files have been updated to work with this migration:

1. **`lib/donationService.ts`**
   - Added `campaign_id` support in CryptoDonationData interface
   - Updated to use `transaction_id` instead of `tx_hash`/`tx_reference`
   - Added `processed_at` timestamp tracking

2. **`pages/api/admin/stats.ts`**
   - Now fetches BOTH pending and completed donations
   - Added `pendingDonations` and `pendingCount` to stats response
   - Updated recent activities to show donation status

3. **`pages/admin/index.tsx`**
   - New "Pending Donations" card showing amount awaiting verification
   - Status badges (green for completed, orange for pending)
   - Better visibility into donation pipeline

4. **`types/database.ts`**
   - Updated to match actual Supabase schema
   - Uses `transaction_id` instead of `tx_hash`/`tx_reference`
   - Added `campaign_id` and `source` fields

## Next Steps

After running the migration:

1. **Restart your development server:**
   ```bash
   npm run dev
   ```

2. **Check the admin dashboard:**
   - Visit http://localhost:3000/admin
   - Login with your credentials
   - You should now see:
     - "Pending Donations" card showing any pending amounts
     - Recent activity with status badges
     - Your $10 BSC test donation (if it's in the database)

3. **Test a new crypto donation:**
   - Make a small test donation
   - Check that it appears as "Pending" on the dashboard
   - Submit transaction hash to verify it updates to "Completed"

## Troubleshooting

### "relation 'campaigns' does not exist"
If you get this error, you need to create the campaigns table first:
```sql
CREATE TABLE IF NOT EXISTS campaigns (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  goal_amount DECIMAL(10,2) NOT NULL,
  current_amount DECIMAL(10,2) DEFAULT 0,
  status TEXT DEFAULT 'active',
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

### "column 'processed_at' already exists"
This is fine - the migration uses `IF NOT EXISTS` so it won't create duplicates.

### Can't see pending donations after migration
1. Check that donations exist: `SELECT * FROM donations WHERE status = 'pending';`
2. Restart your dev server: `npm run dev`
3. Clear browser cache and reload
4. Check browser console for errors

## Support

If you encounter issues:
1. Check the Supabase logs in your dashboard
2. Verify your database connection is working
3. Ensure you're using the correct project credentials in `.env.local`
4. Review the migration SQL for any syntax errors

## Date
Created: November 20, 2025
