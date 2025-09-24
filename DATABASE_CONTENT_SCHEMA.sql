-- Content management table for Saintlammy Foundation CMS
CREATE TABLE content (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  type TEXT CHECK (type IN ('page', 'blog', 'program', 'story', 'media', 'team', 'partnership')) NOT NULL,
  status TEXT CHECK (status IN ('published', 'draft', 'scheduled', 'archived')) DEFAULT 'draft',
  slug TEXT UNIQUE NOT NULL,
  content TEXT,
  excerpt TEXT,
  featured_image TEXT,
  author JSONB NOT NULL DEFAULT '{"name": "Admin"}',
  metadata JSONB DEFAULT '{}',
  views INTEGER DEFAULT 0,
  publish_date TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create index for better query performance
CREATE INDEX idx_content_type ON content(type);
CREATE INDEX idx_content_status ON content(status);
CREATE INDEX idx_content_slug ON content(slug);
CREATE INDEX idx_content_publish_date ON content(publish_date);

-- Create updated_at trigger
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_content_updated_at
BEFORE UPDATE ON content
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Insert sample content for Saintlammy Foundation
INSERT INTO content (title, type, status, slug, content, excerpt, author, publish_date) VALUES
(
  'About Saintlammy Foundation',
  'page',
  'published',
  'about-foundation',
  'The Saintlammy Foundation is dedicated to transforming lives through compassionate action and sustainable development. Founded with the mission to support orphans, widows, and vulnerable communities, we believe in creating lasting change through education, healthcare, and community empowerment.',
  'Learn about our mission, vision, and commitment to transforming lives through compassionate action.',
  '{"name": "Foundation Team", "email": "team@saintlammyfoundation.org"}',
  NOW()
),
(
  'Orphan Care Program',
  'program',
  'published',
  'orphan-care-program',
  'Our Orphan Care Program provides comprehensive support to orphaned children, including education, healthcare, shelter, and emotional support. We work with local partners to ensure every child has access to quality education and a safe, nurturing environment where they can thrive.',
  'Providing comprehensive care and support for orphaned children through education, healthcare, and shelter.',
  '{"name": "Program Team", "email": "programs@saintlammyfoundation.org"}',
  NOW()
),
(
  'Widow Support Initiative',
  'program',
  'published',
  'widow-support-initiative',
  'The Widow Support Initiative empowers widows through skills training, microfinance opportunities, and emotional support. We help widows become self-sufficient by providing vocational training, small business loans, and connecting them with support networks in their communities.',
  'Empowering widows through skills training, microfinance, and community support networks.',
  '{"name": "Program Team", "email": "programs@saintlammyfoundation.org"}',
  NOW()
),
(
  'Community Home Development',
  'program',
  'published',
  'community-home-development',
  'Our Community Home Development program focuses on building safe, sustainable housing for vulnerable families and communities. We work with local contractors and volunteers to construct homes that meet basic safety standards while fostering community ownership and pride.',
  'Building safe, sustainable housing for vulnerable families and communities.',
  '{"name": "Development Team", "email": "development@saintlammyfoundation.org"}',
  NOW()
),
(
  'Sarah Adebayo',
  'team',
  'published',
  'sarah-adebayo',
  'Sarah Adebayo serves as our Partnership Director, bringing over 8 years of experience in nonprofit partnerships and strategic alliances. She specializes in Corporate CSR, Strategic Planning, and Impact Measurement, helping forge meaningful partnerships that amplify our impact.',
  'Partnership Director with 8+ years in nonprofit partnerships and strategic alliances.',
  '{"name": "HR Team", "email": "hr@saintlammyfoundation.org"}',
  NOW()
),
(
  'Michael Okafor',
  'team',
  'published',
  'michael-okafor',
  'Michael Okafor is our NGO Relations Manager with 6+ years of experience in inter-organizational collaboration. He focuses on NGO Alliances, Resource Sharing, and Joint Programs, ensuring effective partnerships with other organizations working toward similar goals.',
  'NGO Relations Manager with 6+ years in inter-organizational collaboration.',
  '{"name": "HR Team", "email": "hr@saintlammyfoundation.org"}',
  NOW()
),
(
  'Fatima Ibrahim',
  'team',
  'published',
  'fatima-ibrahim',
  'Fatima Ibrahim leads our Community Engagement efforts with 5+ years of experience in community development. She specializes in Individual & Community Partnerships, managing Volunteer Programs, Individual Donors, and Local Communities engagement.',
  'Community Engagement Lead with 5+ years in community development.',
  '{"name": "HR Team", "email": "hr@saintlammyfoundation.org"}',
  NOW()
),
(
  'Transforming Lives Through Education',
  'story',
  'published',
  'transforming-lives-through-education',
  'Meet Maria, a bright 12-year-old who lost both parents in a tragic accident. Through our education support program, Maria not only continued her schooling but excelled academically. Today, she dreams of becoming a doctor to help others in her community. Stories like Maria''s remind us why education is the most powerful tool for breaking the cycle of poverty.',
  'Meet Maria, whose life was transformed through our education support program.',
  '{"name": "Stories Team", "email": "stories@saintlammyfoundation.org"}',
  NOW()
),
(
  'Building Hope One Home at a Time',
  'story',
  'published',
  'building-hope-one-home-at-a-time',
  'When we met Amina, she was living with her three children in a makeshift shelter after losing her husband. Through our Community Home Development program and Widow Support Initiative, we not only built Amina a safe home but also provided her with vocational training. Now she runs a successful tailoring business and has become a community leader, inspiring other widows to pursue their dreams.',
  'How we helped Amina build not just a home, but a new life for her family.',
  '{"name": "Stories Team", "email": "stories@saintlammyfoundation.org"}',
  NOW()
);

-- Update views for some content (simulate real usage)
UPDATE content SET views = 1250 WHERE slug = 'transforming-lives-through-education';
UPDATE content SET views = 890 WHERE slug = 'orphan-care-program';
UPDATE content SET views = 650 WHERE slug = 'widow-support-initiative';
UPDATE content SET views = 420 WHERE slug = 'community-home-development';
UPDATE content SET views = 320 WHERE slug = 'building-hope-one-home-at-a-time';