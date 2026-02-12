-- Create page_content table for storing dynamic page sections
-- This table allows admins to edit page content via the Page Builder dashboard

CREATE TABLE IF NOT EXISTS public.page_content (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  page_slug TEXT NOT NULL,
  section TEXT NOT NULL,
  order_index INTEGER NOT NULL DEFAULT 0,
  data JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Add comments for documentation
COMMENT ON TABLE public.page_content IS 'Stores dynamic content sections for pages (About, Governance, Home, Contact, Partner, Sponsor)';
COMMENT ON COLUMN public.page_content.page_slug IS 'Page identifier (e.g., about, governance, home, contact, partner, sponsor)';
COMMENT ON COLUMN public.page_content.section IS 'Section identifier (e.g., team, milestones, values, hero, mission)';
COMMENT ON COLUMN public.page_content.order_index IS 'Display order within the section';
COMMENT ON COLUMN public.page_content.data IS 'JSON data containing section content (fields vary by section type)';

-- Create indexes for faster lookups
CREATE INDEX IF NOT EXISTS idx_page_content_slug_section
ON public.page_content(page_slug, section);

CREATE INDEX IF NOT EXISTS idx_page_content_order
ON public.page_content(page_slug, section, order_index);

-- Enable Row Level Security
ALTER TABLE public.page_content ENABLE ROW LEVEL SECURITY;

-- RLS Policies
-- Allow public read access (for website visitors)
CREATE POLICY "Allow public read access"
ON public.page_content
FOR SELECT
TO public
USING (true);

-- Allow authenticated users to insert (for admins creating content)
CREATE POLICY "Allow authenticated insert"
ON public.page_content
FOR INSERT
TO authenticated
WITH CHECK (true);

-- Allow authenticated users to update (for admins editing content)
CREATE POLICY "Allow authenticated update"
ON public.page_content
FOR UPDATE
TO authenticated
USING (true)
WITH CHECK (true);

-- Allow authenticated users to delete (for admins removing content)
CREATE POLICY "Allow authenticated delete"
ON public.page_content
FOR DELETE
TO authenticated
USING (true);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_page_content_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = timezone('utc'::text, now());
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to automatically update updated_at
CREATE TRIGGER update_page_content_updated_at_trigger
  BEFORE UPDATE ON public.page_content
  FOR EACH ROW
  EXECUTE FUNCTION update_page_content_updated_at();

-- Grant permissions
GRANT SELECT ON public.page_content TO anon;
GRANT ALL ON public.page_content TO authenticated;
GRANT ALL ON public.page_content TO service_role;
