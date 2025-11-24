-- Migration: Add campaign_id column to donations table
-- Date: 2025-11-20
-- Description: Links donations to specific campaigns for tracking campaign progress

-- Add campaign_id column to donations table
ALTER TABLE donations
ADD COLUMN IF NOT EXISTS campaign_id UUID REFERENCES campaigns(id) ON DELETE SET NULL;

-- Create index for faster campaign-based queries
CREATE INDEX IF NOT EXISTS idx_donations_campaign_id ON donations(campaign_id);

-- Add processed_at column for tracking when donations are completed
ALTER TABLE donations
ADD COLUMN IF NOT EXISTS processed_at TIMESTAMPTZ;

-- Add comment to document the columns
COMMENT ON COLUMN donations.campaign_id IS 'Links donation to a specific fundraising campaign';
COMMENT ON COLUMN donations.processed_at IS 'Timestamp when donation was completed/verified';

-- The notes column is already JSONB which is perfect for blockchain verification data
-- No changes needed for notes column
