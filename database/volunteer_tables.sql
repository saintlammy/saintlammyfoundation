-- ============================================
-- VOLUNTEER ROLES & FORMS TABLES
-- Database schema for volunteer management system
-- ============================================

-- Create volunteer_roles table
CREATE TABLE IF NOT EXISTS volunteer_roles (
    id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    title TEXT NOT NULL CHECK (length(title) >= 2 AND length(title) <= 200),
    description TEXT CHECK (length(description) <= 2000),
    required_skills TEXT[] NOT NULL DEFAULT '{}',
    preferred_skills TEXT[] DEFAULT '{}',
    responsibilities TEXT[] DEFAULT '{}',
    time_commitment TEXT CHECK (length(time_commitment) <= 100),
    location TEXT CHECK (length(location) <= 200),
    availability TEXT[] DEFAULT '{}',
    spots_available INTEGER CHECK (spots_available IS NULL OR spots_available >= 0),
    is_active BOOLEAN DEFAULT true,
    category TEXT CHECK (category IN ('general', 'medical', 'education', 'events', 'admin', 'technical')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Indexes for volunteer_roles
CREATE INDEX IF NOT EXISTS idx_volunteer_roles_active ON volunteer_roles(is_active);
CREATE INDEX IF NOT EXISTS idx_volunteer_roles_category ON volunteer_roles(category);
CREATE INDEX IF NOT EXISTS idx_volunteer_roles_created ON volunteer_roles(created_at DESC);

-- Trigger for updated_at
CREATE TRIGGER update_volunteer_roles_updated_at
    BEFORE UPDATE ON volunteer_roles
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- RLS Policies for volunteer_roles
ALTER TABLE volunteer_roles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can view active volunteer roles"
    ON volunteer_roles
    FOR SELECT
    USING (is_active = true);

CREATE POLICY "Admins can manage volunteer roles"
    ON volunteer_roles
    FOR ALL
    USING (auth.role() = 'authenticated');

-- ============================================

-- Create volunteer_forms table
CREATE TABLE IF NOT EXISTS volunteer_forms (
    id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    title TEXT NOT NULL CHECK (length(title) >= 2 AND length(title) <= 200),
    description TEXT CHECK (length(description) <= 1000),
    role_id uuid REFERENCES volunteer_roles(id) ON DELETE SET NULL,
    event_id uuid,
    custom_fields JSONB DEFAULT '[]'::jsonb,
    required_fields TEXT[] DEFAULT ARRAY['first_name', 'last_name', 'email', 'phone'],
    success_message TEXT DEFAULT 'Thank you for applying! We will review your application and get back to you soon.',
    redirect_url TEXT,
    is_active BOOLEAN DEFAULT true,
    start_date DATE,
    end_date DATE,
    max_submissions INTEGER CHECK (max_submissions IS NULL OR max_submissions > 0),
    submission_count INTEGER DEFAULT 0 CHECK (submission_count >= 0),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Indexes for volunteer_forms
CREATE INDEX IF NOT EXISTS idx_volunteer_forms_active ON volunteer_forms(is_active);
CREATE INDEX IF NOT EXISTS idx_volunteer_forms_role ON volunteer_forms(role_id);
CREATE INDEX IF NOT EXISTS idx_volunteer_forms_dates ON volunteer_forms(start_date, end_date);

-- Trigger for updated_at
CREATE TRIGGER update_volunteer_forms_updated_at
    BEFORE UPDATE ON volunteer_forms
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- RLS Policies for volunteer_forms
ALTER TABLE volunteer_forms ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can view active volunteer forms"
    ON volunteer_forms
    FOR SELECT
    USING (is_active = true);

CREATE POLICY "Admins can manage volunteer forms"
    ON volunteer_forms
    FOR ALL
    USING (auth.role() = 'authenticated');

-- ============================================

-- Seed data for volunteer_roles
INSERT INTO volunteer_roles (title, description, required_skills, preferred_skills, responsibilities, time_commitment, location, availability, spots_available, category, is_active)
VALUES
(
    'Outreach Coordinator',
    'Help organize and coordinate community outreach programs. Perfect for those with event planning experience.',
    ARRAY['Event Planning', 'Communication', 'Organization'],
    ARRAY['Project Management', 'Leadership'],
    ARRAY['Coordinate outreach schedules and logistics', 'Communicate with volunteers and beneficiaries', 'Track program metrics and outcomes', 'Assist in preparing outreach materials'],
    '4-6 hours/week',
    'Lagos, Abuja, Port Harcourt',
    ARRAY['Weekdays', 'Weekends'],
    10,
    'events',
    true
),
(
    'Medical Volunteer',
    'Support medical outreaches by assisting healthcare professionals and providing basic care.',
    ARRAY['Healthcare Background', 'First Aid', 'Patient Care'],
    ARRAY['Nursing', 'Pharmacy', 'Medical Training'],
    ARRAY['Assist medical professionals during outreaches', 'Distribute medications and supplies', 'Take patient vitals and basic health checks', 'Maintain accurate medical records'],
    '8 hours/month',
    'Various Communities',
    ARRAY['Weekends'],
    15,
    'medical',
    true
),
(
    'Education Mentor',
    'Provide tutoring and mentorship to children in our educational programs.',
    ARRAY['Teaching', 'Patience', 'Subject Expertise'],
    ARRAY['Tutoring Experience', 'Child Psychology'],
    ARRAY['Tutor students in various subjects', 'Provide homework assistance', 'Mentor children on personal development', 'Track student progress and achievements'],
    '3-4 hours/week',
    'Orphanages & Schools',
    ARRAY['Weekdays', 'Weekends'],
    20,
    'education',
    true
),
(
    'Skills Trainer',
    'Teach vocational skills to widows and youth in our empowerment programs.',
    ARRAY['Vocational Skills', 'Training Experience', 'Patience'],
    ARRAY['Tailoring', 'Carpentry', 'Digital Skills', 'Cooking'],
    ARRAY['Develop training curriculum for vocational programs', 'Conduct hands-on skills training sessions', 'Assess trainee progress and skill development', 'Provide certification upon completion'],
    '6 hours/month',
    'Training Centers',
    ARRAY['Weekends'],
    8,
    'education',
    true
);

-- ============================================
-- Comments for documentation

COMMENT ON TABLE volunteer_roles IS 'Stores volunteer role definitions with required skills and responsibilities';
COMMENT ON TABLE volunteer_forms IS 'Stores custom volunteer registration forms for specific roles or events';

COMMENT ON COLUMN volunteer_roles.required_skills IS 'Array of essential skills needed for this role';
COMMENT ON COLUMN volunteer_roles.preferred_skills IS 'Array of nice-to-have skills for this role';
COMMENT ON COLUMN volunteer_roles.responsibilities IS 'Array of key responsibilities for this role';
COMMENT ON COLUMN volunteer_forms.custom_fields IS 'JSONB array of custom form fields with type, label, options, etc.';
COMMENT ON COLUMN volunteer_forms.required_fields IS 'Array of field names that are required on this form';
