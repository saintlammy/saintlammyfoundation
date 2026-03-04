-- Fix campaigns table schema - Add missing columns
-- Run this in your Supabase SQL Editor

-- Add missing columns to campaigns table if they don't exist
DO $$
BEGIN
    -- Add beneficiary_count column
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns
        WHERE table_name = 'campaigns' AND column_name = 'beneficiary_count'
    ) THEN
        ALTER TABLE campaigns ADD COLUMN beneficiary_count INTEGER DEFAULT 0;
        COMMENT ON COLUMN campaigns.beneficiary_count IS 'Number of beneficiaries this campaign aims to help';
    END IF;

    -- Add stat_label column
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns
        WHERE table_name = 'campaigns' AND column_name = 'stat_label'
    ) THEN
        ALTER TABLE campaigns ADD COLUMN stat_label TEXT;
        COMMENT ON COLUMN campaigns.stat_label IS 'Label for the campaign statistic (e.g., "Orphans Need", "Families Supported")';
    END IF;

    -- Add urgency_message column
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns
        WHERE table_name = 'campaigns' AND column_name = 'urgency_message'
    ) THEN
        ALTER TABLE campaigns ADD COLUMN urgency_message TEXT;
        COMMENT ON COLUMN campaigns.urgency_message IS 'Urgency message to encourage donations (e.g., "Time is running out")';
    END IF;

    -- Add share_count column
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns
        WHERE table_name = 'campaigns' AND column_name = 'share_count'
    ) THEN
        ALTER TABLE campaigns ADD COLUMN share_count INTEGER DEFAULT 0;
        COMMENT ON COLUMN campaigns.share_count IS 'Number of times this campaign has been shared';
    END IF;

    -- Add category column
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns
        WHERE table_name = 'campaigns' AND column_name = 'category'
    ) THEN
        ALTER TABLE campaigns ADD COLUMN category TEXT;
        COMMENT ON COLUMN campaigns.category IS 'Campaign category (widows, orphans, medical, education, etc.)';
    END IF;

    -- Add image_url column
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns
        WHERE table_name = 'campaigns' AND column_name = 'image_url'
    ) THEN
        ALTER TABLE campaigns ADD COLUMN image_url TEXT;
        COMMENT ON COLUMN campaigns.image_url IS 'Featured image URL for the campaign';
    END IF;

    -- Add impact_details column (JSONB for flexible impact descriptions)
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns
        WHERE table_name = 'campaigns' AND column_name = 'impact_details'
    ) THEN
        ALTER TABLE campaigns ADD COLUMN impact_details JSONB DEFAULT '{}'::jsonb;
        COMMENT ON COLUMN campaigns.impact_details IS 'Impact details by donation amount (e.g., {"5": "Feeds one widow for 2 weeks"})';
    END IF;

    RAISE NOTICE 'Campaigns table schema updated successfully!';
END $$;

-- Verify the columns were added
SELECT
    column_name,
    data_type,
    is_nullable,
    column_default
FROM information_schema.columns
WHERE table_name = 'campaigns'
ORDER BY ordinal_position;
