-- Campaign Profiles Table
-- Stores individual beneficiary/home profiles for vulnerable homes campaigns
-- Enables storytelling-driven fundraising with specific profile sponsorship

CREATE TABLE IF NOT EXISTS campaign_profiles (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  campaign_id UUID NOT NULL REFERENCES campaigns(id) ON DELETE CASCADE,

  -- Profile Information
  profile_code VARCHAR(20) UNIQUE NOT NULL, -- e.g., 'VH-001', 'VH-002' for easy reference
  title TEXT NOT NULL, -- e.g., 'Serah — Carrying Two Futures Alone'
  descriptor VARCHAR(200), -- Short descriptor, e.g., 'Single mother of two children'

  -- Story Content
  story_snippet TEXT NOT NULL, -- Short version for card display (150-200 chars)
  story_full TEXT NOT NULL, -- Full story for detail modal
  how_your_gift_helps TEXT, -- Impact statement

  -- Media
  image_url TEXT,
  video_url TEXT,

  -- Categorization
  tags TEXT[], -- e.g., ['Food Support', 'Hygiene', 'Education']

  -- Status & Display
  status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'archived', 'draft')),
  is_featured BOOLEAN DEFAULT false,
  sort_order INTEGER DEFAULT 0, -- For manual ordering

  -- Fundraising (optional tracking at profile level)
  funding_goal DECIMAL(12, 2), -- Optional individual funding goal
  current_funding DECIMAL(12, 2) DEFAULT 0,
  sponsor_count INTEGER DEFAULT 0,

  -- Additional Details (JSONB for flexibility)
  metadata JSONB, -- Store extra info like family_size, occupation, specific_needs, etc.

  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_campaign_profiles_campaign_id ON campaign_profiles(campaign_id);
CREATE INDEX IF NOT EXISTS idx_campaign_profiles_status ON campaign_profiles(status);
CREATE INDEX IF NOT EXISTS idx_campaign_profiles_featured ON campaign_profiles(is_featured);
CREATE INDEX IF NOT EXISTS idx_campaign_profiles_sort_order ON campaign_profiles(sort_order);
CREATE INDEX IF NOT EXISTS idx_campaign_profiles_profile_code ON campaign_profiles(profile_code);
CREATE INDEX IF NOT EXISTS idx_campaign_profiles_tags ON campaign_profiles USING GIN (tags);

-- Function to auto-update updated_at timestamp
CREATE OR REPLACE FUNCTION update_campaign_profiles_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to auto-update updated_at
DROP TRIGGER IF EXISTS campaign_profiles_updated_at ON campaign_profiles;
CREATE TRIGGER campaign_profiles_updated_at
  BEFORE UPDATE ON campaign_profiles
  FOR EACH ROW
  EXECUTE FUNCTION update_campaign_profiles_updated_at();

-- Function to update campaign profile_count (denormalized for performance)
CREATE OR REPLACE FUNCTION update_campaign_profile_count()
RETURNS TRIGGER AS $$
BEGIN
  -- Update the campaigns table with profile count
  UPDATE campaigns
  SET updated_at = NOW()
  WHERE id = COALESCE(NEW.campaign_id, OLD.campaign_id);

  RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql;

-- Trigger to update campaign when profiles change
DROP TRIGGER IF EXISTS update_campaign_on_profile_change ON campaign_profiles;
CREATE TRIGGER update_campaign_on_profile_change
  AFTER INSERT OR UPDATE OR DELETE ON campaign_profiles
  FOR EACH ROW
  EXECUTE FUNCTION update_campaign_profile_count();

-- Add campaign_type to existing campaigns table (expansion, not replacement)
DO $$
BEGIN
    -- Add campaign_type column if it doesn't exist
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns
        WHERE table_name = 'campaigns' AND column_name = 'campaign_type'
    ) THEN
        ALTER TABLE campaigns ADD COLUMN campaign_type VARCHAR(30) DEFAULT 'general'
          CHECK (campaign_type IN ('general', 'vulnerable_homes', 'emergency', 'seasonal'));
        COMMENT ON COLUMN campaigns.campaign_type IS 'Type of campaign - determines UI rendering (general, vulnerable_homes, emergency, seasonal)';
    END IF;
END $$;

-- Comments for documentation
COMMENT ON TABLE campaign_profiles IS 'Individual beneficiary profiles for storytelling-driven campaigns';
COMMENT ON COLUMN campaign_profiles.profile_code IS 'Unique human-readable code (e.g., VH-001)';
COMMENT ON COLUMN campaign_profiles.story_snippet IS 'Short story for card display (150-200 characters)';
COMMENT ON COLUMN campaign_profiles.story_full IS 'Full story for detail modal';
COMMENT ON COLUMN campaign_profiles.tags IS 'Array of support tags for filtering';
COMMENT ON COLUMN campaign_profiles.metadata IS 'Flexible JSONB field for additional profile data';
COMMENT ON COLUMN campaign_profiles.sort_order IS 'Manual ordering (lower = higher priority)';

-- Sample data: "Feed 100 Widows Before Christmas" campaign with profiles
-- This extends your existing featured campaign with individual widow/family profiles
INSERT INTO campaigns (id, title, description, goal_amount, current_amount, currency, deadline, status, is_featured, campaign_type, category)
VALUES
  (
    '550e8400-e29b-41d4-a716-446655440000'::UUID,
    'Feed 100 Widows Before Christmas',
    'Every day without your support means another hungry mother struggling to feed her children. Meet the widows and vulnerable families we support in Alimosho LGA, Lagos.',
    1795.00,
    808.00,
    'USD',
    '2025-12-20 23:59:59+00',
    'active',
    true,
    'vulnerable_homes',
    'widows'
  )
ON CONFLICT (id) DO NOTHING;

-- If you want to UPDATE your existing campaign instead, uncomment this:
-- UPDATE campaigns
-- SET campaign_type = 'vulnerable_homes',
--     description = 'Every day without your support means another hungry mother struggling to feed her children. Meet the widows and vulnerable families we support in Alimosho LGA, Lagos.'
-- WHERE title = 'Feed 100 Widows Before Christmas';

-- Sample widow/family profiles for the campaign
-- These will appear when users click "Learn More" on the featured campaign
INSERT INTO campaign_profiles (campaign_id, profile_code, title, descriptor, story_snippet, story_full, how_your_gift_helps, tags, image_url, is_featured, sort_order)
VALUES
  (
    '550e8400-e29b-41d4-a716-446655440000'::UUID,
    'W-001',
    'Serah — Carrying Two Futures Alone',
    'Single mother of two children',
    'Serah is a 32-year-old single mother raising two children—Oba (7) and Eniola (12). When her husband left shortly after the children were born, the responsibility for everything fell on her shoulders.',
    'Serah is a 32-year-old single mother raising two children—Oba (7) and Eniola (12). When her husband left shortly after the children were born, the responsibility for everything fell on her shoulders. She works hard to keep food on the table and a roof over their heads, but even small setbacks can tip the home into crisis. Still, Serah holds onto one prayer: that her children will stay in school and have a better future than the struggle she''s living through.',
    'Food + hygiene pack and targeted school support for the children.',
    ARRAY['Food Support', 'Hygiene', 'Education'],
    '',
    true,
    1
  ),
  (
    '550e8400-e29b-41d4-a716-446655440000'::UUID,
    'W-002',
    'Mr. Alagbe — A Salary Swallowed by Sacrifice',
    'Older father, debt + health burden',
    'Mr. Alagbe is 63 and works as a local security officer. He took a loan to send his three sons to university, believing education was the best inheritance he could give.',
    'Mr. Alagbe is 63 and works as a local security officer. He took a loan to send his three sons to university, believing education was the best inheritance he could give. Soon after, he lost his job and the loan grew with interest. Even after finding work again, most of his monthly salary goes into repayments, leaving little for daily living. He also battles serious health challenges, yet he keeps showing up—because his sons'' education matters to him more than his comfort.',
    'Food + hygiene essentials to relieve pressure while he manages repayments and health.',
    ARRAY['Food Support', 'Hygiene', 'Family Relief'],
    '',
    true,
    2
  ),
  (
    '550e8400-e29b-41d4-a716-446655440000'::UUID,
    'W-003',
    'Olusegun — Starting Over with Special Care Needs',
    'Family of six, disability care',
    'Olusegun is a father of four whose life changed drastically after he was deported from Canada. Since returning, stable work has been difficult to secure.',
    'Olusegun is a father of four whose life changed drastically after he was deported from Canada. Since returning, stable work has been difficult to secure. His wife now carries the daily responsibility of providing food for the family. To make things harder, their youngest daughter lives with a disability and needs special care—adding pressure to already limited resources. Yet this family is still standing, still trying, still hoping for stability.',
    'Food support plus capped stability casework to help the family rebuild.',
    ARRAY['Food Support', 'Stability', 'Caregiving'],
    '',
    true,
    3
  ),
  (
    '550e8400-e29b-41d4-a716-446655440000'::UUID,
    'W-004',
    'Monsuru — Five Daughters, One Unsteady Income',
    'Father of five, informal work',
    'Monsuru is a father of five girls. After losing his job due to a workplace relocation issue, he turned to bricklaying to support his family—hard work, but not steady income.',
    'Monsuru is a father of five girls. After losing his job due to a workplace relocation issue, he turned to bricklaying to support his family—hard work, but not steady income. His wife also hawks drinks just to keep the home running. Even with the uncertainty, both parents keep fighting for their daughters'' future, determined that hardship won''t be the final word over their family.',
    'Food + hygiene packs and education support to keep the girls in school.',
    ARRAY['Food Support', 'Hygiene', 'Education'],
    '',
    true,
    4
  );

-- Grant SELECT permissions (adjust based on your RLS policies)
-- ALTER TABLE campaign_profiles ENABLE ROW LEVEL SECURITY;

COMMENT ON TABLE campaign_profiles IS 'Completed: Campaign profiles schema created with sample vulnerable homes data';
