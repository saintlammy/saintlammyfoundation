-- Outreach Reports Table Schema for Supabase
-- This table stores comprehensive outreach report data

CREATE TABLE IF NOT EXISTS outreach_reports (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  outreach_id TEXT NOT NULL UNIQUE,

  -- Basic Information
  title TEXT NOT NULL,
  date TIMESTAMPTZ NOT NULL,
  location TEXT NOT NULL,
  status TEXT CHECK (status IN ('completed', 'ongoing', 'upcoming')) NOT NULL DEFAULT 'upcoming',
  image TEXT,
  description TEXT,

  -- Beneficiary Information
  target_beneficiaries INTEGER DEFAULT 0,
  actual_beneficiaries INTEGER DEFAULT 0,
  beneficiary_categories JSONB DEFAULT '[]'::jsonb,

  -- Impact Metrics
  impact JSONB DEFAULT '[]'::jsonb,

  -- Budget Information
  budget JSONB DEFAULT '{
    "planned": 0,
    "actual": 0,
    "breakdown": []
  }'::jsonb,

  -- Volunteer Information
  volunteers JSONB DEFAULT '{
    "registered": 0,
    "participated": 0,
    "hours": 0
  }'::jsonb,

  -- Activities
  activities JSONB DEFAULT '[]'::jsonb,

  -- Media and Gallery
  gallery JSONB DEFAULT '[]'::jsonb,

  -- Testimonials
  testimonials JSONB DEFAULT '[]'::jsonb,

  -- Future Planning
  future_plans JSONB DEFAULT '[]'::jsonb,

  -- Partners
  partners JSONB DEFAULT '[]'::jsonb,

  -- Documents
  report_document TEXT,

  -- Social Media Metrics
  social_media JSONB DEFAULT '[]'::jsonb,

  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create index on outreach_id for faster lookups
CREATE INDEX IF NOT EXISTS idx_outreach_reports_outreach_id ON outreach_reports(outreach_id);

-- Create index on status for filtering
CREATE INDEX IF NOT EXISTS idx_outreach_reports_status ON outreach_reports(status);

-- Create index on date for sorting
CREATE INDEX IF NOT EXISTS idx_outreach_reports_date ON outreach_reports(date DESC);

-- Enable Row Level Security (RLS)
ALTER TABLE outreach_reports ENABLE ROW LEVEL SECURITY;

-- Policy: Allow public read access to outreach reports
CREATE POLICY "Allow public read access to outreach reports"
  ON outreach_reports
  FOR SELECT
  TO public
  USING (true);

-- Policy: Allow authenticated users to insert outreach reports
CREATE POLICY "Allow authenticated users to insert outreach reports"
  ON outreach_reports
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- Policy: Allow authenticated users to update outreach reports
CREATE POLICY "Allow authenticated users to update outreach reports"
  ON outreach_reports
  FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Policy: Allow authenticated users to delete outreach reports
CREATE POLICY "Allow authenticated users to delete outreach reports"
  ON outreach_reports
  FOR DELETE
  TO authenticated
  USING (true);

-- Function to automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION update_outreach_reports_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to call the update function
CREATE TRIGGER outreach_reports_updated_at
  BEFORE UPDATE ON outreach_reports
  FOR EACH ROW
  EXECUTE FUNCTION update_outreach_reports_updated_at();

-- Comments for documentation
COMMENT ON TABLE outreach_reports IS 'Stores comprehensive reports for community outreach programs';
COMMENT ON COLUMN outreach_reports.outreach_id IS 'Unique identifier linking to the main outreach record';
COMMENT ON COLUMN outreach_reports.beneficiary_categories IS 'Array of objects with category and count fields';
COMMENT ON COLUMN outreach_reports.impact IS 'Array of impact metrics with title, value, and description';
COMMENT ON COLUMN outreach_reports.budget IS 'Budget object with planned, actual, and breakdown array';
COMMENT ON COLUMN outreach_reports.volunteers IS 'Volunteer statistics object';
COMMENT ON COLUMN outreach_reports.activities IS 'Array of activity objects with title, description, and completion status';
COMMENT ON COLUMN outreach_reports.gallery IS 'Array of image URLs';
COMMENT ON COLUMN outreach_reports.testimonials IS 'Array of testimonial objects';
COMMENT ON COLUMN outreach_reports.future_plans IS 'Array of future plan strings';
COMMENT ON COLUMN outreach_reports.partners IS 'Array of partner objects with name, logo, and contribution';
COMMENT ON COLUMN outreach_reports.social_media IS 'Array of social media metrics objects';
