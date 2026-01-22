-- Create outreach_reports table for storing detailed outreach report data
-- This table stores comprehensive report data separately from the main content table

CREATE TABLE IF NOT EXISTS outreach_reports (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  outreach_id TEXT NOT NULL UNIQUE,
  title TEXT NOT NULL,
  date TEXT,
  location TEXT,
  status TEXT,
  image TEXT,
  description TEXT,
  target_beneficiaries INTEGER DEFAULT 0,
  actual_beneficiaries INTEGER DEFAULT 0,
  beneficiary_categories JSONB DEFAULT '[]'::jsonb,
  impact JSONB DEFAULT '[]'::jsonb,
  budget JSONB DEFAULT '{}'::jsonb,
  volunteers JSONB DEFAULT '{}'::jsonb,
  activities JSONB DEFAULT '[]'::jsonb,
  gallery JSONB DEFAULT '[]'::jsonb,
  testimonials JSONB DEFAULT '[]'::jsonb,
  future_plans JSONB DEFAULT '[]'::jsonb,
  partners JSONB DEFAULT '[]'::jsonb,
  report_document TEXT,
  social_media JSONB DEFAULT '[]'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create index on outreach_id for faster lookups
CREATE INDEX IF NOT EXISTS idx_outreach_reports_outreach_id ON outreach_reports(outreach_id);

-- Add RLS (Row Level Security) policies
ALTER TABLE outreach_reports ENABLE ROW LEVEL SECURITY;

-- Allow public read access
CREATE POLICY IF NOT EXISTS "Allow public read access" ON outreach_reports
  FOR SELECT USING (true);

-- Allow authenticated users to insert
CREATE POLICY IF NOT EXISTS "Allow authenticated insert" ON outreach_reports
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

-- Allow authenticated users to update
CREATE POLICY IF NOT EXISTS "Allow authenticated update" ON outreach_reports
  FOR UPDATE USING (auth.role() = 'authenticated');

-- Allow authenticated users to delete
CREATE POLICY IF NOT EXISTS "Allow authenticated delete" ON outreach_reports
  FOR DELETE USING (auth.role() = 'authenticated');

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_outreach_reports_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to automatically update updated_at
DROP TRIGGER IF EXISTS update_outreach_reports_updated_at ON outreach_reports;
CREATE TRIGGER update_outreach_reports_updated_at
  BEFORE UPDATE ON outreach_reports
  FOR EACH ROW
  EXECUTE FUNCTION update_outreach_reports_updated_at();
