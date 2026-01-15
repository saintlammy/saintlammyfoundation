-- Content Table Schema for Supabase
-- This table stores all content types (outreaches, programs, stories, etc.)

CREATE TABLE IF NOT EXISTS content (
  id TEXT PRIMARY KEY,
  type TEXT NOT NULL,
  title TEXT NOT NULL,
  slug TEXT NOT NULL,
  excerpt TEXT,
  content TEXT,
  featured_image TEXT,
  status TEXT NOT NULL DEFAULT 'draft',

  -- JSONB fields for flexible data storage
  outreach_details JSONB DEFAULT '{}'::jsonb,
  program_details JSONB DEFAULT '{}'::jsonb,
  story_details JSONB DEFAULT '{}'::jsonb,

  -- Dates
  publish_date TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),

  -- Author/ownership
  author_id UUID,

  -- SEO
  meta_description TEXT,
  meta_keywords TEXT[]
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_content_type ON content(type);
CREATE INDEX IF NOT EXISTS idx_content_status ON content(status);
CREATE INDEX IF NOT EXISTS idx_content_slug ON content(slug);
CREATE INDEX IF NOT EXISTS idx_content_publish_date ON content(publish_date DESC);
CREATE INDEX IF NOT EXISTS idx_content_type_status ON content(type, status);

-- Enable Row Level Security
ALTER TABLE content ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Allow public read access to published content"
  ON content FOR SELECT
  USING (status = 'published' OR status = 'completed');

CREATE POLICY "Allow public read all content"
  ON content FOR SELECT
  USING (true);

CREATE POLICY "Allow authenticated users to insert content"
  ON content FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Allow authenticated users to update content"
  ON content FOR UPDATE
  TO authenticated
  USING (true);

CREATE POLICY "Allow authenticated users to delete content"
  ON content FOR DELETE
  TO authenticated
  USING (true);

-- Create function for updating updated_at timestamp
CREATE OR REPLACE FUNCTION update_content_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger
CREATE TRIGGER content_updated_at
  BEFORE UPDATE ON content
  FOR EACH ROW
  EXECUTE FUNCTION update_content_updated_at();

-- Add comments
COMMENT ON TABLE content IS 'Stores all content types including outreaches, programs, stories, news articles';
COMMENT ON COLUMN content.type IS 'Content type: outreach, program, story, news, testimonial, etc.';
COMMENT ON COLUMN content.outreach_details IS 'JSONB object for outreach-specific data: {location, event_date, beneficiaries_count}';
COMMENT ON COLUMN content.program_details IS 'JSONB object for program-specific data';
COMMENT ON COLUMN content.story_details IS 'JSONB object for story-specific data';
