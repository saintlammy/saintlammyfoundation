-- ================================================
-- FORM OPTIONS TABLES
-- Database schema for managing dynamic form dropdown options
-- Created: January 29, 2026
-- ================================================

-- Enable UUID extension if not already enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ================================================
-- CONTACT FORM OPTIONS
-- ================================================

-- Contact inquiry types (replaces hardcoded options in contact form)
CREATE TABLE contact_inquiry_types (
    id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    title TEXT NOT NULL UNIQUE CHECK (length(title) >= 2 AND length(title) <= 100),
    description TEXT CHECK (length(description) <= 500),
    icon TEXT CHECK (length(icon) <= 50), -- Icon name (e.g., 'MessageSquare', 'Heart')
    is_active BOOLEAN DEFAULT true,
    sort_order INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Seed contact inquiry types
INSERT INTO contact_inquiry_types (title, description, icon, is_active, sort_order) VALUES
('General Inquiry', 'General questions about our foundation and programs', 'MessageSquare', true, 1),
('Donation Information', 'Questions about how to donate and donation options', 'Heart', true, 2),
('Volunteer Opportunities', 'Information about volunteering with us', 'Users', true, 3),
('Partnership Proposal', 'Proposals for organizational partnerships', 'Handshake', true, 4),
('Media & Press', 'Media inquiries and press requests', 'Newspaper', true, 5),
('Support Request', 'Request for assistance or support', 'HelpCircle', true, 6);

-- ================================================
-- DONATION OPTIONS
-- ================================================

-- Supported currencies
CREATE TABLE supported_currencies (
    id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    code TEXT NOT NULL UNIQUE CHECK (length(code) >= 2 AND length(code) <= 10), -- ISO 4217 codes and crypto tickers
    name TEXT NOT NULL CHECK (length(name) <= 100),
    symbol TEXT NOT NULL CHECK (length(symbol) <= 10),
    is_crypto BOOLEAN DEFAULT false,
    is_active BOOLEAN DEFAULT true,
    sort_order INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Seed currencies
INSERT INTO supported_currencies (code, name, symbol, is_crypto, is_active, sort_order) VALUES
('NGN', 'Nigerian Naira', '₦', false, true, 1),
('USD', 'US Dollar', '$', false, true, 2),
('EUR', 'Euro', '€', false, true, 3),
('GBP', 'British Pound', '£', false, true, 4),
('BTC', 'Bitcoin', '₿', true, true, 5),
('ETH', 'Ethereum', 'Ξ', true, true, 6),
('USDT', 'Tether', '₮', true, true, 7),
('USDC', 'USD Coin', '$', true, true, 8),
('XRP', 'XRP', 'XRP', true, true, 9),
('SOL', 'Solana', '◎', true, true, 10),
('TRX', 'Tron', 'TRX', true, true, 11);

-- Payment methods
CREATE TABLE payment_methods (
    id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL UNIQUE CHECK (length(name) >= 2 AND length(name) <= 100),
    slug TEXT NOT NULL UNIQUE CHECK (length(slug) <= 50), -- e.g., 'bank_transfer', 'card', 'crypto'
    description TEXT CHECK (length(description) <= 500),
    icon TEXT CHECK (length(icon) <= 50),
    is_active BOOLEAN DEFAULT true,
    sort_order INTEGER DEFAULT 0,
    supported_currencies TEXT[] DEFAULT '{}', -- Array of currency codes this method supports
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Seed payment methods
INSERT INTO payment_methods (name, slug, description, icon, is_active, sort_order, supported_currencies) VALUES
('Bank Transfer', 'bank_transfer', 'Direct bank transfer to our account', 'Building2', true, 1, ARRAY['NGN', 'USD', 'EUR', 'GBP']),
('Credit/Debit Card', 'card', 'Pay securely with your card', 'CreditCard', true, 2, ARRAY['NGN', 'USD', 'EUR', 'GBP']),
('Cryptocurrency', 'crypto', 'Donate using cryptocurrency', 'Bitcoin', true, 3, ARRAY['BTC', 'ETH', 'USDT', 'USDC', 'XRP', 'SOL', 'TRX']),
('Mobile Money', 'mobile_money', 'Pay via mobile money services', 'Smartphone', true, 4, ARRAY['NGN']),
('PayPal', 'paypal', 'Donate through PayPal', 'DollarSign', true, 5, ARRAY['USD', 'EUR', 'GBP']);

-- Donation types/categories
CREATE TABLE donation_types (
    id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    title TEXT NOT NULL UNIQUE CHECK (length(title) >= 2 AND length(title) <= 100),
    description TEXT CHECK (length(description) <= 500),
    icon TEXT CHECK (length(icon) <= 50),
    is_active BOOLEAN DEFAULT true,
    sort_order INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Seed donation types
INSERT INTO donation_types (title, description, icon, is_active, sort_order) VALUES
('General Fund', 'Support all our programs and operations', 'Heart', true, 1),
('Medical Outreach', 'Fund healthcare services for underserved communities', 'Activity', true, 2),
('Education Support', 'Help provide educational resources and scholarships', 'BookOpen', true, 3),
('Food & Water', 'Provide food security and clean water access', 'Droplet', true, 4),
('Emergency Relief', 'Support disaster relief and emergency aid', 'AlertCircle', true, 5),
('Orphan Care', 'Support orphanages and child welfare programs', 'Baby', true, 6);

-- Donation preset amounts (by currency)
CREATE TABLE donation_preset_amounts (
    id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    currency_code TEXT NOT NULL REFERENCES supported_currencies(code) ON DELETE CASCADE,
    amount DECIMAL(15, 2) NOT NULL CHECK (amount > 0),
    is_active BOOLEAN DEFAULT true,
    sort_order INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    UNIQUE(currency_code, amount)
);

-- Seed preset amounts
INSERT INTO donation_preset_amounts (currency_code, amount, is_active, sort_order) VALUES
-- NGN presets
('NGN', 5000.00, true, 1),
('NGN', 10000.00, true, 2),
('NGN', 25000.00, true, 3),
('NGN', 50000.00, true, 4),
('NGN', 100000.00, true, 5),
-- USD presets
('USD', 10.00, true, 1),
('USD', 25.00, true, 2),
('USD', 50.00, true, 3),
('USD', 100.00, true, 4),
('USD', 250.00, true, 5),
-- EUR presets
('EUR', 10.00, true, 1),
('EUR', 25.00, true, 2),
('EUR', 50.00, true, 3),
('EUR', 100.00, true, 4),
('EUR', 200.00, true, 5),
-- GBP presets
('GBP', 10.00, true, 1),
('GBP', 20.00, true, 2),
('GBP', 50.00, true, 3),
('GBP', 100.00, true, 4),
('GBP', 200.00, true, 5);

-- ================================================
-- PARTNERSHIP FORM OPTIONS
-- ================================================

-- Organization types
CREATE TABLE organization_types (
    id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    title TEXT NOT NULL UNIQUE CHECK (length(title) >= 2 AND length(title) <= 100),
    description TEXT CHECK (length(description) <= 500),
    is_active BOOLEAN DEFAULT true,
    sort_order INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Seed organization types
INSERT INTO organization_types (title, description, is_active, sort_order) VALUES
('Non-Profit Organization', 'Charitable or non-governmental organizations', true, 1),
('Corporate/Business', 'For-profit companies and businesses', true, 2),
('Government Agency', 'Government departments and agencies', true, 3),
('Educational Institution', 'Schools, universities, and educational organizations', true, 4),
('Religious Organization', 'Churches, mosques, and faith-based organizations', true, 5),
('Healthcare Provider', 'Hospitals, clinics, and medical organizations', true, 6),
('Community Group', 'Local community associations and groups', true, 7),
('Individual', 'Individual philanthropists or volunteers', true, 8);

-- Partnership types
CREATE TABLE partnership_types (
    id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    title TEXT NOT NULL UNIQUE CHECK (length(title) >= 2 AND length(title) <= 100),
    description TEXT CHECK (length(description) <= 500),
    is_active BOOLEAN DEFAULT true,
    sort_order INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Seed partnership types
INSERT INTO partnership_types (title, description, is_active, sort_order) VALUES
('Financial Support', 'Monetary donations and sponsorships', true, 1),
('In-Kind Donations', 'Donation of goods, supplies, or services', true, 2),
('Program Collaboration', 'Joint program development and implementation', true, 3),
('Volunteer Support', 'Providing volunteers or human resources', true, 4),
('Awareness & Advocacy', 'Help spread awareness about our mission', true, 5),
('Technical Support', 'IT, consulting, or professional services', true, 6);

-- Partnership timelines
CREATE TABLE partnership_timelines (
    id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    title TEXT NOT NULL UNIQUE CHECK (length(title) >= 2 AND length(title) <= 100),
    description TEXT CHECK (length(description) <= 500),
    is_active BOOLEAN DEFAULT true,
    sort_order INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Seed partnership timelines
INSERT INTO partnership_timelines (title, description, is_active, sort_order) VALUES
('Immediate', 'Ready to start right away', true, 1),
('Within 1 Month', 'Planning to start within the next month', true, 2),
('Within 3 Months', 'Planning to start in 1-3 months', true, 3),
('Within 6 Months', 'Planning to start in 3-6 months', true, 4),
('Long-term Planning', 'Still in planning phase, 6+ months out', true, 5);

-- ================================================
-- VOLUNTEER FORM OPTIONS
-- ================================================

-- Volunteer availability options
CREATE TABLE volunteer_availability_options (
    id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    title TEXT NOT NULL UNIQUE CHECK (length(title) >= 2 AND length(title) <= 100),
    description TEXT CHECK (length(description) <= 500),
    is_active BOOLEAN DEFAULT true,
    sort_order INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Seed availability options
INSERT INTO volunteer_availability_options (title, description, is_active, sort_order) VALUES
('Weekdays', 'Available Monday through Friday', true, 1),
('Weekends', 'Available Saturday and Sunday', true, 2),
('Evenings', 'Available after 5 PM on weekdays', true, 3),
('Flexible', 'Can adjust schedule as needed', true, 4),
('Full-time', 'Available 40+ hours per week', true, 5),
('Part-time', 'Available 10-20 hours per week', true, 6),
('Occasional', 'Available for special events only', true, 7);

-- Volunteer interest areas (in addition to role-based interests)
CREATE TABLE volunteer_interest_areas (
    id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    title TEXT NOT NULL UNIQUE CHECK (length(title) >= 2 AND length(title) <= 100),
    description TEXT CHECK (length(description) <= 500),
    category TEXT CHECK (category IN ('program', 'administrative', 'outreach', 'technical', 'other')),
    is_active BOOLEAN DEFAULT true,
    sort_order INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Seed interest areas
INSERT INTO volunteer_interest_areas (title, description, category, is_active, sort_order) VALUES
('Administrative Support', 'Office work, data entry, coordination', 'administrative', true, 1),
('Fundraising', 'Help organize fundraising events and campaigns', 'outreach', true, 2),
('Social Media', 'Manage social media accounts and content', 'technical', true, 3),
('Photography/Videography', 'Document events and create media content', 'technical', true, 4),
('Graphic Design', 'Create visual content and marketing materials', 'technical', true, 5),
('Event Planning', 'Organize and coordinate foundation events', 'program', true, 6),
('Grant Writing', 'Write proposals and grant applications', 'administrative', true, 7),
('Translation', 'Translate materials into local languages', 'other', true, 8);

-- ================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ================================================

-- Enable RLS on all tables
ALTER TABLE contact_inquiry_types ENABLE ROW LEVEL SECURITY;
ALTER TABLE supported_currencies ENABLE ROW LEVEL SECURITY;
ALTER TABLE payment_methods ENABLE ROW LEVEL SECURITY;
ALTER TABLE donation_types ENABLE ROW LEVEL SECURITY;
ALTER TABLE donation_preset_amounts ENABLE ROW LEVEL SECURITY;
ALTER TABLE organization_types ENABLE ROW LEVEL SECURITY;
ALTER TABLE partnership_types ENABLE ROW LEVEL SECURITY;
ALTER TABLE partnership_timelines ENABLE ROW LEVEL SECURITY;
ALTER TABLE volunteer_availability_options ENABLE ROW LEVEL SECURITY;
ALTER TABLE volunteer_interest_areas ENABLE ROW LEVEL SECURITY;

-- Public read access for active items
CREATE POLICY "Public can view active contact inquiry types"
ON contact_inquiry_types FOR SELECT
USING (is_active = true);

CREATE POLICY "Public can view active currencies"
ON supported_currencies FOR SELECT
USING (is_active = true);

CREATE POLICY "Public can view active payment methods"
ON payment_methods FOR SELECT
USING (is_active = true);

CREATE POLICY "Public can view active donation types"
ON donation_types FOR SELECT
USING (is_active = true);

CREATE POLICY "Public can view active preset amounts"
ON donation_preset_amounts FOR SELECT
USING (is_active = true);

CREATE POLICY "Public can view active organization types"
ON organization_types FOR SELECT
USING (is_active = true);

CREATE POLICY "Public can view active partnership types"
ON partnership_types FOR SELECT
USING (is_active = true);

CREATE POLICY "Public can view active partnership timelines"
ON partnership_timelines FOR SELECT
USING (is_active = true);

CREATE POLICY "Public can view active availability options"
ON volunteer_availability_options FOR SELECT
USING (is_active = true);

CREATE POLICY "Public can view active interest areas"
ON volunteer_interest_areas FOR SELECT
USING (is_active = true);

-- Admin full access (adjust auth.uid() condition based on your admin setup)
-- For now, using service role key bypass

-- ================================================
-- INDEXES FOR PERFORMANCE
-- ================================================

CREATE INDEX idx_contact_inquiry_types_active ON contact_inquiry_types(is_active, sort_order);
CREATE INDEX idx_currencies_active ON supported_currencies(is_active, sort_order);
CREATE INDEX idx_currencies_crypto ON supported_currencies(is_crypto, is_active);
CREATE INDEX idx_payment_methods_active ON payment_methods(is_active, sort_order);
CREATE INDEX idx_donation_types_active ON donation_types(is_active, sort_order);
CREATE INDEX idx_preset_amounts_currency ON donation_preset_amounts(currency_code, is_active, sort_order);
CREATE INDEX idx_org_types_active ON organization_types(is_active, sort_order);
CREATE INDEX idx_partnership_types_active ON partnership_types(is_active, sort_order);
CREATE INDEX idx_partnership_timelines_active ON partnership_timelines(is_active, sort_order);
CREATE INDEX idx_availability_active ON volunteer_availability_options(is_active, sort_order);
CREATE INDEX idx_interest_areas_active ON volunteer_interest_areas(is_active, category, sort_order);

-- ================================================
-- TRIGGERS FOR UPDATED_AT
-- ================================================

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_contact_inquiry_types_updated_at BEFORE UPDATE ON contact_inquiry_types FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_currencies_updated_at BEFORE UPDATE ON supported_currencies FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_payment_methods_updated_at BEFORE UPDATE ON payment_methods FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_donation_types_updated_at BEFORE UPDATE ON donation_types FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_preset_amounts_updated_at BEFORE UPDATE ON donation_preset_amounts FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_org_types_updated_at BEFORE UPDATE ON organization_types FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_partnership_types_updated_at BEFORE UPDATE ON partnership_types FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_partnership_timelines_updated_at BEFORE UPDATE ON partnership_timelines FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_availability_updated_at BEFORE UPDATE ON volunteer_availability_options FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_interest_areas_updated_at BEFORE UPDATE ON volunteer_interest_areas FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ================================================
-- NOTES
-- ================================================
-- 1. This schema creates 10 new tables for managing form dropdown options
-- 2. All tables have is_active and sort_order for flexible management
-- 3. RLS policies allow public read access to active items only
-- 4. Indexes optimize common query patterns
-- 5. Foreign key on donation_preset_amounts ensures currency exists
-- 6. Run this after volunteer_tables.sql
-- 7. Admin access requires service role key or custom RLS policies
