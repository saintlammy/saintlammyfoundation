-- Enhanced Supabase schema with security and constraints
-- Enable RLS (Row Level Security) for all tables
ALTER DATABASE postgres SET row_security = on;

-- Create custom types for better type safety
CREATE TYPE donation_category AS ENUM ('orphan', 'widow', 'home', 'general');
CREATE TYPE donation_frequency AS ENUM ('one-time', 'monthly', 'weekly', 'yearly');
CREATE TYPE payment_method AS ENUM ('crypto', 'naira', 'bank_transfer', 'card');
CREATE TYPE donation_status AS ENUM ('pending', 'completed', 'failed', 'refunded');

-- Create extension for better security
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- Orphanage homes table with proper constraints
CREATE TABLE orphanage_homes (
    id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL CHECK (length(name) >= 2 AND length(name) <= 200),
    location TEXT NOT NULL CHECK (length(location) >= 5 AND length(location) <= 500),
    description TEXT CHECK (length(description) <= 2000),
    capacity INTEGER CHECK (capacity > 0 AND capacity <= 1000),
    contact_phone TEXT CHECK (contact_phone ~ '^[+]?[0-9\s\-\(\)]+$'),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    is_active BOOLEAN DEFAULT true
);

-- Create index for faster queries
CREATE INDEX idx_orphanage_homes_active ON orphanage_homes(is_active);
CREATE INDEX idx_orphanage_homes_location ON orphanage_homes(location);

-- Orphans table with enhanced validation
CREATE TABLE orphans (
    id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL CHECK (length(name) >= 2 AND length(name) <= 100),
    age INTEGER NOT NULL CHECK (age >= 0 AND age <= 25),
    home_id uuid REFERENCES orphanage_homes(id) ON DELETE SET NULL,
    photo_url TEXT CHECK (photo_url ~ '^https?://'),
    guardian_contact TEXT,
    medical_info TEXT CHECK (length(medical_info) <= 1000),
    educational_level TEXT CHECK (length(educational_level) <= 100),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    is_active BOOLEAN DEFAULT true
);

-- Create indexes for orphans
CREATE INDEX idx_orphans_home_id ON orphans(home_id);
CREATE INDEX idx_orphans_age ON orphans(age);
CREATE INDEX idx_orphans_active ON orphans(is_active);

-- Widows table with validation
CREATE TABLE widows (
    id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL CHECK (length(name) >= 2 AND length(name) <= 100),
    contact TEXT CHECK (length(contact) >= 10 AND length(contact) <= 50),
    address TEXT CHECK (length(address) <= 500),
    number_of_children INTEGER CHECK (number_of_children >= 0 AND number_of_children <= 20),
    monthly_income DECIMAL(12,2) CHECK (monthly_income >= 0),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    is_active BOOLEAN DEFAULT true
);

-- Create indexes for widows
CREATE INDEX idx_widows_active ON widows(is_active);
CREATE INDEX idx_widows_income ON widows(monthly_income);

-- Enhanced donors table with encrypted email
CREATE TABLE donors (
    id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL CHECK (length(name) >= 2 AND length(name) <= 100),
    email_encrypted TEXT NOT NULL, -- Store encrypted email
    email_hash TEXT NOT NULL UNIQUE, -- Hash for lookups
    phone TEXT CHECK (phone ~ '^[+]?[0-9\s\-\(\)]+$'),
    address TEXT CHECK (length(address) <= 500),
    is_anonymous BOOLEAN DEFAULT false,
    total_donated DECIMAL(15,2) DEFAULT 0 CHECK (total_donated >= 0),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    last_donation_at TIMESTAMP WITH TIME ZONE
);

-- Create indexes for donors
CREATE INDEX idx_donors_email_hash ON donors(email_hash);
CREATE INDEX idx_donors_total_donated ON donors(total_donated);
CREATE INDEX idx_donors_last_donation ON donors(last_donation_at);

-- Enhanced donations table with proper constraints
CREATE TABLE donations (
    id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    donor_id uuid REFERENCES donors(id) ON DELETE SET NULL,
    category donation_category NOT NULL,
    amount DECIMAL(15,2) NOT NULL CHECK (amount > 0),
    currency TEXT NOT NULL DEFAULT 'NGN' CHECK (currency IN ('NGN', 'USD', 'ETH', 'BTC')),
    frequency donation_frequency NOT NULL DEFAULT 'one-time',
    payment_method payment_method NOT NULL,
    status donation_status NOT NULL DEFAULT 'pending',
    tx_hash TEXT UNIQUE, -- Unique transaction hash for crypto payments
    tx_reference TEXT UNIQUE, -- Unique reference for bank transfers
    beneficiary_id uuid, -- Can reference orphans, widows, or homes
    beneficiary_type TEXT CHECK (beneficiary_type IN ('orphan', 'widow', 'home', 'general')),
    notes TEXT CHECK (length(notes) <= 1000),
    processed_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create indexes for donations
CREATE INDEX idx_donations_donor_id ON donations(donor_id);
CREATE INDEX idx_donations_category ON donations(category);
CREATE INDEX idx_donations_status ON donations(status);
CREATE INDEX idx_donations_created_at ON donations(created_at);
CREATE INDEX idx_donations_amount ON donations(amount);
CREATE INDEX idx_donations_tx_hash ON donations(tx_hash) WHERE tx_hash IS NOT NULL;

-- Create audit log table for tracking changes
CREATE TABLE audit_log (
    id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    table_name TEXT NOT NULL,
    operation TEXT NOT NULL CHECK (operation IN ('INSERT', 'UPDATE', 'DELETE')),
    record_id uuid NOT NULL,
    old_data JSONB,
    new_data JSONB,
    user_id uuid,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create index for audit log
CREATE INDEX idx_audit_log_table_record ON audit_log(table_name, record_id);
CREATE INDEX idx_audit_log_created_at ON audit_log(created_at);

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
CREATE TRIGGER update_orphanage_homes_updated_at BEFORE UPDATE ON orphanage_homes FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_orphans_updated_at BEFORE UPDATE ON orphans FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_widows_updated_at BEFORE UPDATE ON widows FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_donors_updated_at BEFORE UPDATE ON donors FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_donations_updated_at BEFORE UPDATE ON donations FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Enable Row Level Security (RLS)
ALTER TABLE orphanage_homes ENABLE ROW LEVEL SECURITY;
ALTER TABLE orphans ENABLE ROW LEVEL SECURITY;
ALTER TABLE widows ENABLE ROW LEVEL SECURITY;
ALTER TABLE donors ENABLE ROW LEVEL SECURITY;
ALTER TABLE donations ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_log ENABLE ROW LEVEL SECURITY;

-- Create policies for public read access (adjust as needed)
CREATE POLICY "Public can view active orphanage homes" ON orphanage_homes FOR SELECT USING (is_active = true);
CREATE POLICY "Public can view active orphans" ON orphans FOR SELECT USING (is_active = true);

-- Create policies for authenticated users (admin access)
CREATE POLICY "Authenticated users can manage all data" ON orphanage_homes FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Authenticated users can manage orphans" ON orphans FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Authenticated users can manage widows" ON widows FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Authenticated users can manage donors" ON donors FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Authenticated users can manage donations" ON donations FOR ALL USING (auth.role() = 'authenticated');

-- Helper functions for encryption/decryption (implement with proper key management)
CREATE OR REPLACE FUNCTION encrypt_email(email TEXT)
RETURNS TEXT AS $$
BEGIN
    RETURN encode(encrypt(email::bytea, 'encryption_key', 'aes'), 'base64');
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE FUNCTION hash_email(email TEXT)
RETURNS TEXT AS $$
BEGIN
    RETURN encode(digest(lower(trim(email)), 'sha256'), 'hex');
END;
$$ LANGUAGE plpgsql;

-- Additional tables for comprehensive charity management

-- User roles and authentication
CREATE TYPE user_role AS ENUM ('admin', 'manager', 'volunteer', 'donor', 'beneficiary');
CREATE TYPE user_status AS ENUM ('active', 'inactive', 'suspended', 'pending');

CREATE TABLE users (
    id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    email TEXT UNIQUE NOT NULL,
    full_name TEXT NOT NULL CHECK (length(full_name) >= 2 AND length(full_name) <= 100),
    role user_role DEFAULT 'donor',
    status user_status DEFAULT 'active',
    phone TEXT CHECK (phone ~ '^[+]?[0-9\s\-\(\)]+$'),
    address TEXT CHECK (length(address) <= 500),
    profile_image_url TEXT CHECK (profile_image_url ~ '^https?://'),
    bio TEXT CHECK (length(bio) <= 1000),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    last_login_at TIMESTAMP WITH TIME ZONE
);

-- Adoptions system
CREATE TYPE adoption_status AS ENUM ('pending', 'active', 'completed', 'cancelled', 'paused');

CREATE TABLE adoptions (
    id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    donor_id uuid REFERENCES donors(id) ON DELETE CASCADE,
    beneficiary_id uuid NOT NULL,
    beneficiary_type TEXT NOT NULL CHECK (beneficiary_type IN ('orphan', 'widow', 'home')),
    amount DECIMAL(15,2) NOT NULL CHECK (amount > 0),
    frequency donation_frequency NOT NULL,
    status adoption_status DEFAULT 'pending',
    start_date DATE NOT NULL,
    end_date DATE,
    next_payment_date DATE,
    payment_method payment_method NOT NULL,
    notes TEXT CHECK (length(notes) <= 1000),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Programs management
CREATE TYPE program_status AS ENUM ('planning', 'active', 'completed', 'cancelled', 'on_hold');
CREATE TYPE program_type AS ENUM ('education', 'healthcare', 'feeding', 'housing', 'empowerment', 'emergency_relief', 'skill_training', 'other');

CREATE TABLE programs (
    id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL CHECK (length(name) >= 2 AND length(name) <= 200),
    description TEXT NOT NULL CHECK (length(description) <= 5000),
    program_type program_type NOT NULL,
    status program_status DEFAULT 'planning',
    budget DECIMAL(15,2) CHECK (budget > 0),
    amount_raised DECIMAL(15,2) DEFAULT 0 CHECK (amount_raised >= 0),
    target_beneficiaries INTEGER CHECK (target_beneficiaries > 0),
    actual_beneficiaries INTEGER DEFAULT 0 CHECK (actual_beneficiaries >= 0),
    start_date DATE NOT NULL,
    end_date DATE,
    location TEXT CHECK (length(location) <= 500),
    manager_id uuid REFERENCES users(id),
    image_url TEXT CHECK (image_url ~ '^https?://'),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Outreaches management
CREATE TYPE outreach_status AS ENUM ('planned', 'ongoing', 'completed', 'cancelled');

CREATE TABLE outreaches (
    id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    program_id uuid REFERENCES programs(id) ON DELETE CASCADE,
    name TEXT NOT NULL CHECK (length(name) >= 2 AND length(name) <= 200),
    description TEXT CHECK (length(description) <= 2000),
    location TEXT NOT NULL CHECK (length(location) <= 500),
    status outreach_status DEFAULT 'planned',
    date DATE NOT NULL,
    start_time TIME,
    end_time TIME,
    budget DECIMAL(12,2) CHECK (budget > 0),
    participants_target INTEGER CHECK (participants_target > 0),
    participants_actual INTEGER DEFAULT 0,
    coordinator_id uuid REFERENCES users(id),
    notes TEXT CHECK (length(notes) <= 1000),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Grants management
CREATE TYPE grant_status AS ENUM ('draft', 'submitted', 'under_review', 'approved', 'rejected', 'funded', 'completed');
CREATE TYPE grant_type AS ENUM ('government', 'foundation', 'corporate', 'individual', 'international', 'crowdfunding');

CREATE TABLE grants (
    id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    title TEXT NOT NULL CHECK (length(title) >= 5 AND length(title) <= 200),
    description TEXT NOT NULL CHECK (length(description) <= 5000),
    grant_type grant_type NOT NULL,
    funder_name TEXT NOT NULL CHECK (length(funder_name) <= 200),
    funder_contact TEXT CHECK (length(funder_contact) <= 500),
    amount_requested DECIMAL(15,2) NOT NULL CHECK (amount_requested > 0),
    amount_awarded DECIMAL(15,2) DEFAULT 0 CHECK (amount_awarded >= 0),
    status grant_status DEFAULT 'draft',
    application_deadline DATE,
    submitted_date DATE,
    decision_date DATE,
    funding_start_date DATE,
    funding_end_date DATE,
    program_id uuid REFERENCES programs(id),
    assigned_to uuid REFERENCES users(id),
    documents_url TEXT[],
    requirements TEXT CHECK (length(requirements) <= 2000),
    notes TEXT CHECK (length(notes) <= 1000),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Partnerships management
CREATE TYPE partnership_type AS ENUM ('corporate', 'ngo', 'government', 'international', 'religious', 'educational', 'media');
CREATE TYPE partnership_status AS ENUM ('prospective', 'negotiating', 'active', 'inactive', 'terminated');

CREATE TABLE partnerships (
    id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    organization_name TEXT NOT NULL CHECK (length(organization_name) >= 2 AND length(organization_name) <= 200),
    contact_person TEXT CHECK (length(contact_person) <= 100),
    contact_email TEXT CHECK (contact_email ~ '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$'),
    contact_phone TEXT CHECK (contact_phone ~ '^[+]?[0-9\s\-\(\)]+$'),
    partnership_type partnership_type NOT NULL,
    status partnership_status DEFAULT 'prospective',
    description TEXT CHECK (length(description) <= 2000),
    benefits TEXT CHECK (length(benefits) <= 1000),
    obligations TEXT CHECK (length(obligations) <= 1000),
    start_date DATE,
    end_date DATE,
    value_estimate DECIMAL(15,2) CHECK (value_estimate >= 0),
    manager_id uuid REFERENCES users(id),
    website_url TEXT CHECK (website_url ~ '^https?://'),
    address TEXT CHECK (length(address) <= 500),
    notes TEXT CHECK (length(notes) <= 1000),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Volunteers management
CREATE TYPE volunteer_status AS ENUM ('applicant', 'active', 'inactive', 'suspended', 'alumni');
CREATE TYPE skill_level AS ENUM ('beginner', 'intermediate', 'advanced', 'expert');

CREATE TABLE volunteers (
    id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id uuid REFERENCES users(id) ON DELETE CASCADE,
    volunteer_id TEXT UNIQUE,
    skills TEXT[],
    availability TEXT CHECK (length(availability) <= 500),
    status volunteer_status DEFAULT 'applicant',
    hours_committed INTEGER DEFAULT 0 CHECK (hours_committed >= 0),
    hours_completed INTEGER DEFAULT 0 CHECK (hours_completed >= 0),
    emergency_contact TEXT CHECK (length(emergency_contact) <= 200),
    background_check_status TEXT CHECK (background_check_status IN ('pending', 'approved', 'failed', 'not_required')),
    background_check_date DATE,
    orientation_completed BOOLEAN DEFAULT false,
    orientation_date DATE,
    start_date DATE,
    supervisor_id uuid REFERENCES users(id),
    notes TEXT CHECK (length(notes) <= 1000),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Volunteer assignments
CREATE TYPE assignment_status AS ENUM ('assigned', 'in_progress', 'completed', 'cancelled');

CREATE TABLE volunteer_assignments (
    id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    volunteer_id uuid REFERENCES volunteers(id) ON DELETE CASCADE,
    program_id uuid REFERENCES programs(id),
    outreach_id uuid REFERENCES outreaches(id),
    title TEXT NOT NULL CHECK (length(title) <= 200),
    description TEXT CHECK (length(description) <= 1000),
    status assignment_status DEFAULT 'assigned',
    hours_estimated INTEGER CHECK (hours_estimated > 0),
    hours_actual INTEGER DEFAULT 0 CHECK (hours_actual >= 0),
    start_date DATE NOT NULL,
    end_date DATE,
    supervisor_id uuid REFERENCES users(id),
    notes TEXT CHECK (length(notes) <= 1000),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Financial management - Budget categories
CREATE TABLE budget_categories (
    id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL UNIQUE CHECK (length(name) >= 2 AND length(name) <= 100),
    description TEXT CHECK (length(description) <= 500),
    parent_category_id uuid REFERENCES budget_categories(id),
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Financial transactions (expenses)
CREATE TYPE transaction_type AS ENUM ('income', 'expense', 'transfer');
CREATE TYPE transaction_status AS ENUM ('pending', 'approved', 'rejected', 'paid');

CREATE TABLE transactions (
    id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    transaction_type transaction_type NOT NULL,
    amount DECIMAL(15,2) NOT NULL CHECK (amount > 0),
    currency TEXT NOT NULL DEFAULT 'NGN',
    description TEXT NOT NULL CHECK (length(description) <= 500),
    category_id uuid REFERENCES budget_categories(id),
    program_id uuid REFERENCES programs(id),
    vendor_name TEXT CHECK (length(vendor_name) <= 200),
    receipt_url TEXT CHECK (receipt_url ~ '^https?://'),
    status transaction_status DEFAULT 'pending',
    approved_by uuid REFERENCES users(id),
    approved_at TIMESTAMP WITH TIME ZONE,
    paid_at TIMESTAMP WITH TIME ZONE,
    reference_number TEXT UNIQUE,
    notes TEXT CHECK (length(notes) <= 1000),
    created_by uuid REFERENCES users(id) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Reports and analytics
CREATE TABLE reports (
    id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    title TEXT NOT NULL CHECK (length(title) <= 200),
    report_type TEXT NOT NULL CHECK (report_type IN ('financial', 'program', 'donor', 'volunteer', 'impact', 'custom')),
    parameters JSONB,
    generated_by uuid REFERENCES users(id) NOT NULL,
    file_url TEXT CHECK (file_url ~ '^https?://'),
    status TEXT DEFAULT 'generated' CHECK (status IN ('generating', 'generated', 'failed')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Add indexes for better performance
CREATE INDEX idx_adoptions_donor_id ON adoptions(donor_id);
CREATE INDEX idx_adoptions_status ON adoptions(status);
CREATE INDEX idx_adoptions_beneficiary ON adoptions(beneficiary_type, beneficiary_id);
CREATE INDEX idx_adoptions_next_payment ON adoptions(next_payment_date) WHERE status = 'active';

CREATE INDEX idx_programs_status ON programs(status);
CREATE INDEX idx_programs_type ON programs(program_type);
CREATE INDEX idx_programs_dates ON programs(start_date, end_date);
CREATE INDEX idx_programs_manager ON programs(manager_id);

CREATE INDEX idx_outreaches_program ON outreaches(program_id);
CREATE INDEX idx_outreaches_date ON outreaches(date);
CREATE INDEX idx_outreaches_status ON outreaches(status);

CREATE INDEX idx_grants_status ON grants(status);
CREATE INDEX idx_grants_type ON grants(grant_type);
CREATE INDEX idx_grants_deadlines ON grants(application_deadline);
CREATE INDEX idx_grants_program ON grants(program_id);

CREATE INDEX idx_partnerships_status ON partnerships(status);
CREATE INDEX idx_partnerships_type ON partnerships(partnership_type);
CREATE INDEX idx_partnerships_dates ON partnerships(start_date, end_date);

CREATE INDEX idx_volunteers_status ON volunteers(status);
CREATE INDEX idx_volunteers_user ON volunteers(user_id);
CREATE INDEX idx_volunteer_assignments_volunteer ON volunteer_assignments(volunteer_id);
CREATE INDEX idx_volunteer_assignments_status ON volunteer_assignments(status);

CREATE INDEX idx_transactions_type ON transactions(transaction_type);
CREATE INDEX idx_transactions_status ON transactions(status);
CREATE INDEX idx_transactions_program ON transactions(program_id);
CREATE INDEX idx_transactions_category ON transactions(category_id);
CREATE INDEX idx_transactions_created_at ON transactions(created_at);

-- Add triggers for updated_at columns
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_adoptions_updated_at BEFORE UPDATE ON adoptions FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_programs_updated_at BEFORE UPDATE ON programs FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_outreaches_updated_at BEFORE UPDATE ON outreaches FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_grants_updated_at BEFORE UPDATE ON grants FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_partnerships_updated_at BEFORE UPDATE ON partnerships FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_volunteers_updated_at BEFORE UPDATE ON volunteers FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_volunteer_assignments_updated_at BEFORE UPDATE ON volunteer_assignments FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_budget_categories_updated_at BEFORE UPDATE ON budget_categories FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_transactions_updated_at BEFORE UPDATE ON transactions FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Enable RLS for all new tables
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE adoptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE programs ENABLE ROW LEVEL SECURITY;
ALTER TABLE outreaches ENABLE ROW LEVEL SECURITY;
ALTER TABLE grants ENABLE ROW LEVEL SECURITY;
ALTER TABLE partnerships ENABLE ROW LEVEL SECURITY;
ALTER TABLE volunteers ENABLE ROW LEVEL SECURITY;
ALTER TABLE volunteer_assignments ENABLE ROW LEVEL SECURITY;
ALTER TABLE budget_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE reports ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can view their own data" ON users FOR SELECT USING (auth.uid() = id::text OR auth.role() = 'authenticated');
CREATE POLICY "Admins can manage all users" ON users FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Donors can view their adoptions" ON adoptions FOR SELECT USING (auth.uid()::uuid = donor_id OR auth.role() = 'authenticated');
CREATE POLICY "Authenticated users can manage adoptions" ON adoptions FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Public can view active programs" ON programs FOR SELECT USING (status = 'active' OR auth.role() = 'authenticated');
CREATE POLICY "Authenticated users can manage programs" ON programs FOR ALL USING (auth.role() = 'authenticated');

-- Add default budget categories
INSERT INTO budget_categories (name, description) VALUES
('Operations', 'General operational expenses'),
('Programs', 'Program-specific expenses'),
('Administration', 'Administrative costs'),
('Fundraising', 'Fundraising and marketing expenses'),
('Emergency', 'Emergency relief expenses');

-- Functions for automatic volunteer ID generation
CREATE OR REPLACE FUNCTION generate_volunteer_id()
RETURNS TRIGGER AS $$
BEGIN
    NEW.volunteer_id := 'VOL' || to_char(now(), 'YYYY') || lpad(nextval('volunteer_id_seq')::text, 4, '0');
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE SEQUENCE volunteer_id_seq;
CREATE TRIGGER generate_volunteer_id_trigger BEFORE INSERT ON volunteers FOR EACH ROW EXECUTE FUNCTION generate_volunteer_id();