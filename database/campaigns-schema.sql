-- Urgent Campaigns Table
-- Stores information about urgent fundraising campaigns

CREATE TABLE IF NOT EXISTS campaigns (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  goal_amount DECIMAL(12, 2) NOT NULL,
  current_amount DECIMAL(12, 2) DEFAULT 0,
  currency VARCHAR(3) DEFAULT 'USD',
  deadline TIMESTAMP WITH TIME ZONE,
  status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'completed', 'archived', 'draft')),
  is_featured BOOLEAN DEFAULT false,
  impact_details JSONB, -- Store impact breakdown (e.g., {"5": "Feeds one widow for 2 weeks"})
  image_url TEXT,
  category VARCHAR(50), -- e.g., 'widows', 'orphans', 'medical', 'education'
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_campaigns_status ON campaigns(status);
CREATE INDEX IF NOT EXISTS idx_campaigns_featured ON campaigns(is_featured);
CREATE INDEX IF NOT EXISTS idx_campaigns_deadline ON campaigns(deadline);

-- Function to auto-update updated_at timestamp
CREATE OR REPLACE FUNCTION update_campaigns_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to auto-update updated_at
DROP TRIGGER IF EXISTS campaigns_updated_at ON campaigns;
CREATE TRIGGER campaigns_updated_at
  BEFORE UPDATE ON campaigns
  FOR EACH ROW
  EXECUTE FUNCTION update_campaigns_updated_at();

-- Sample data for testing (using USD as primary currency for international donors)
INSERT INTO campaigns (title, description, goal_amount, current_amount, currency, deadline, status, is_featured, impact_details, category)
VALUES
  (
    'Feed 100 Widows Before Christmas',
    'Every day without your support means another hungry mother struggling to feed her children. Help us provide essential food supplies to 100 widows before Christmas.',
    1795.00,
    808.00,
    'USD',
    '2025-12-20 23:59:59+00',
    'active',
    true,
    '{"5": "Feeds one widow for 2 weeks", "25": "Supports a widow''s family for a month", "100": "Provides essential food package for 4 widows"}',
    'widows'
  ),
  (
    'Emergency Medical Fund for Children',
    'Urgent medical care needed for vulnerable children in our care. Your donation provides life-saving treatment.',
    717.00,
    251.00,
    'USD',
    '2025-11-30 23:59:59+00',
    'active',
    false,
    '{"10": "Basic medical consultation", "50": "Emergency treatment and medication", "100": "Full medical care package"}',
    'medical'
  );

-- Comments
COMMENT ON TABLE campaigns IS 'Urgent fundraising campaigns for the foundation';
COMMENT ON COLUMN campaigns.status IS 'Campaign status: active, completed, archived, or draft';
COMMENT ON COLUMN campaigns.is_featured IS 'Featured campaigns appear prominently on homepage';
COMMENT ON COLUMN campaigns.impact_details IS 'JSON object showing donation impact levels';
