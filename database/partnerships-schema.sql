-- Partnership Applications Table
CREATE TABLE IF NOT EXISTS partnership_applications (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  organization_name VARCHAR(255) NOT NULL,
  contact_name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  phone VARCHAR(50),
  organization_type VARCHAR(50) CHECK (organization_type IN ('corporation', 'ngo', 'government', 'foundation', 'individual', 'other')),
  partnership_type VARCHAR(50) CHECK (partnership_type IN ('corporate-csr', 'program-collaboration', 'funding', 'resource-sharing', 'volunteer', 'other')),
  message TEXT NOT NULL,
  timeline VARCHAR(50) CHECK (timeline IN ('immediate', 'short-term', 'medium-term', 'long-term', 'exploratory')),
  status VARCHAR(50) DEFAULT 'new' CHECK (status IN ('new', 'under-review', 'approved', 'rejected', 'in-discussion')),
  priority VARCHAR(20) DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high')),
  assigned_to VARCHAR(255),
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Partnership Team Members Table
CREATE TABLE IF NOT EXISTS partnership_team_members (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  role VARCHAR(255) NOT NULL,
  expertise VARCHAR(500),
  experience VARCHAR(500),
  focus TEXT[], -- Array of focus areas
  email VARCHAR(255) NOT NULL UNIQUE,
  phone VARCHAR(50),
  status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'inactive')),
  avatar VARCHAR(500),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_partnership_applications_status ON partnership_applications(status);
CREATE INDEX IF NOT EXISTS idx_partnership_applications_priority ON partnership_applications(priority);
CREATE INDEX IF NOT EXISTS idx_partnership_applications_created_at ON partnership_applications(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_partnership_team_members_status ON partnership_team_members(status);
CREATE INDEX IF NOT EXISTS idx_partnership_team_members_email ON partnership_team_members(email);

-- Add RLS (Row Level Security) policies
ALTER TABLE partnership_applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE partnership_team_members ENABLE ROW LEVEL SECURITY;

-- Policy: Anyone can create partnership applications (public form submission)
CREATE POLICY "Anyone can insert partnership applications"
  ON partnership_applications FOR INSERT
  WITH CHECK (true);

-- Policy: Authenticated users can read all applications
CREATE POLICY "Authenticated users can read partnership applications"
  ON partnership_applications FOR SELECT
  USING (auth.role() = 'authenticated' OR auth.role() = 'service_role');

-- Policy: Authenticated users can update applications
CREATE POLICY "Authenticated users can update partnership applications"
  ON partnership_applications FOR UPDATE
  USING (auth.role() = 'authenticated' OR auth.role() = 'service_role');

-- Policy: Authenticated users can delete applications
CREATE POLICY "Authenticated users can delete partnership applications"
  ON partnership_applications FOR DELETE
  USING (auth.role() = 'authenticated' OR auth.role() = 'service_role');

-- Policy: Authenticated users can read team members
CREATE POLICY "Authenticated users can read team members"
  ON partnership_team_members FOR SELECT
  USING (auth.role() = 'authenticated' OR auth.role() = 'service_role');

-- Policy: Authenticated users can manage team members
CREATE POLICY "Authenticated users can insert team members"
  ON partnership_team_members FOR INSERT
  WITH CHECK (auth.role() = 'authenticated' OR auth.role() = 'service_role');

CREATE POLICY "Authenticated users can update team members"
  ON partnership_team_members FOR UPDATE
  USING (auth.role() = 'authenticated' OR auth.role() = 'service_role');

CREATE POLICY "Authenticated users can delete team members"
  ON partnership_team_members FOR DELETE
  USING (auth.role() = 'authenticated' OR auth.role() = 'service_role');

-- Sample data for partnership applications
INSERT INTO partnership_applications (organization_name, contact_name, email, phone, organization_type, partnership_type, message, timeline, status, priority, assigned_to, created_at, updated_at)
VALUES
  ('TechCorp Nigeria', 'Adebayo Johnson', 'adebayo@techcorp.ng', '+234 801 234 5678', 'corporation', 'corporate-csr', 'We are interested in partnering with your foundation for our annual CSR initiative. We would like to focus on education and technology programs for orphaned children.', 'short-term', 'new', 'high', NULL, '2024-01-15T09:30:00Z', '2024-01-15T09:30:00Z'),
  ('Green Earth Foundation', 'Sarah Okafor', 'sarah@greenearth.org', '+234 803 456 7890', 'ngo', 'program-collaboration', 'Our foundation focuses on environmental sustainability. We would like to collaborate on community development programs that include environmental education.', 'medium-term', 'under-review', 'medium', 'Michael Okafor', '2024-01-12T14:15:00Z', '2024-01-14T10:20:00Z'),
  ('Lagos State Ministry of Youth', 'Dr. Kemi Adebisi', 'k.adebisi@lagosstate.gov.ng', '+234 805 678 9012', 'government', 'funding', 'The Lagos State Government is looking to partner with credible NGOs for youth empowerment programs. We have reviewed your work and would like to discuss funding opportunities.', 'long-term', 'approved', 'high', 'Sarah Adebayo', '2024-01-08T11:45:00Z', '2024-01-13T16:30:00Z')
ON CONFLICT DO NOTHING;

-- Sample data for partnership team members
INSERT INTO partnership_team_members (name, role, expertise, experience, focus, email, phone, status)
VALUES
  ('Sarah Adebayo', 'Partnership Director', 'Corporate Partnerships & Strategic Alliances', '8+ years in nonprofit partnerships', ARRAY['Corporate CSR', 'Strategic Planning', 'Impact Measurement'], 'sarah.adebayo@saintlammyfoundation.org', '+234 801 111 2222', 'active'),
  ('Michael Okafor', 'NGO Relations Manager', 'Inter-organizational Collaboration', '6+ years in NGO partnerships', ARRAY['NGO Alliances', 'Resource Sharing', 'Joint Programs'], 'michael.okafor@saintlammyfoundation.org', '+234 802 333 4444', 'active'),
  ('Fatima Ibrahim', 'Community Engagement Lead', 'Individual & Community Partnerships', '5+ years in community development', ARRAY['Volunteer Programs', 'Individual Donors', 'Local Communities'], 'fatima.ibrahim@saintlammyfoundation.org', '+234 803 555 6666', 'active')
ON CONFLICT (email) DO NOTHING;

-- Function to update the updated_at timestamp
CREATE OR REPLACE FUNCTION update_partnership_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for updated_at
DROP TRIGGER IF EXISTS update_partnership_applications_updated_at ON partnership_applications;
CREATE TRIGGER update_partnership_applications_updated_at
  BEFORE UPDATE ON partnership_applications
  FOR EACH ROW
  EXECUTE FUNCTION update_partnership_updated_at();

DROP TRIGGER IF EXISTS update_partnership_team_members_updated_at ON partnership_team_members;
CREATE TRIGGER update_partnership_team_members_updated_at
  BEFORE UPDATE ON partnership_team_members
  FOR EACH ROW
  EXECUTE FUNCTION update_partnership_updated_at();
