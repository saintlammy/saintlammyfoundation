-- ===================================================================
-- FIX MISSING TABLES
-- Run this to create volunteers, user_privileges, and predefined_privileges tables
-- ===================================================================

-- ===================================================================
-- 1. CREATE VOLUNTEERS TABLE
-- ===================================================================

CREATE TABLE IF NOT EXISTS volunteers (
    id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id uuid REFERENCES users(id) ON DELETE SET NULL,
    email TEXT NOT NULL,
    name TEXT,
    first_name TEXT,
    last_name TEXT,
    phone TEXT,
    location TEXT,
    address TEXT,

    -- Volunteer specific fields
    interests TEXT[] DEFAULT '{}',
    skills TEXT[] DEFAULT '{}',
    availability TEXT[] DEFAULT '{}',

    -- Application info
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'active', 'inactive', 'rejected')),
    role_id uuid REFERENCES volunteer_roles(id) ON DELETE SET NULL,

    -- Emergency contact
    emergency_contact JSONB DEFAULT '{}'::jsonb,

    -- Metadata
    notes TEXT,
    application_date DATE DEFAULT CURRENT_DATE,

    -- Timestamps
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Indexes for volunteers
CREATE INDEX IF NOT EXISTS idx_volunteers_user_id ON volunteers(user_id);
CREATE INDEX IF NOT EXISTS idx_volunteers_email ON volunteers(email);
CREATE INDEX IF NOT EXISTS idx_volunteers_status ON volunteers(status);
CREATE INDEX IF NOT EXISTS idx_volunteers_role_id ON volunteers(role_id);
CREATE INDEX IF NOT EXISTS idx_volunteers_created ON volunteers(created_at DESC);

-- Trigger for updated_at
DROP TRIGGER IF EXISTS update_volunteers_updated_at ON volunteers;
CREATE TRIGGER update_volunteers_updated_at
    BEFORE UPDATE ON volunteers
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- RLS Policies for volunteers
ALTER TABLE volunteers ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can insert volunteer applications"
    ON volunteers
    FOR INSERT
    WITH CHECK (true);

CREATE POLICY "Users can view their own volunteer record"
    ON volunteers
    FOR SELECT
    USING (
        user_id = (SELECT id FROM users WHERE auth_user_id = auth.uid())
        OR auth.uid() IN (SELECT auth_user_id FROM users WHERE role IN ('admin', 'super_admin'))
    );

CREATE POLICY "Admins can manage volunteers"
    ON volunteers
    FOR ALL
    USING (
        auth.uid() IN (SELECT auth_user_id FROM users WHERE role IN ('admin', 'super_admin'))
    );

-- ===================================================================
-- 2. CREATE USER_PRIVILEGES TABLE
-- ===================================================================

CREATE TABLE IF NOT EXISTS user_privileges (
    id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    privilege_key TEXT NOT NULL CHECK (length(privilege_key) >= 2 AND length(privilege_key) <= 100),
    privilege_value TEXT,
    granted_by uuid REFERENCES users(id) ON DELETE SET NULL,
    granted_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    expires_at TIMESTAMP WITH TIME ZONE,
    is_active BOOLEAN DEFAULT true,

    UNIQUE(user_id, privilege_key)
);

-- Indexes for privileges
CREATE INDEX IF NOT EXISTS idx_user_privileges_user ON user_privileges(user_id);
CREATE INDEX IF NOT EXISTS idx_user_privileges_key ON user_privileges(privilege_key);
CREATE INDEX IF NOT EXISTS idx_user_privileges_active ON user_privileges(is_active, expires_at);

-- RLS for privileges
ALTER TABLE user_privileges ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own privileges"
    ON user_privileges
    FOR SELECT
    USING (user_id = (SELECT id FROM users WHERE auth_user_id = auth.uid()));

CREATE POLICY "Admins can manage privileges"
    ON user_privileges
    FOR ALL
    USING (
        auth.uid() IN (SELECT auth_user_id FROM users WHERE role IN ('admin', 'super_admin'))
    );

-- ===================================================================
-- 3. CREATE PREDEFINED_PRIVILEGES TABLE
-- ===================================================================

CREATE TABLE IF NOT EXISTS predefined_privileges (
    id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    key TEXT NOT NULL UNIQUE CHECK (length(key) >= 2 AND length(key) <= 100),
    name TEXT NOT NULL CHECK (length(name) >= 2 AND length(name) <= 200),
    description TEXT CHECK (length(description) <= 1000),
    category TEXT CHECK (category IN ('content', 'users', 'volunteers', 'donations', 'analytics', 'communications', 'settings')),
    default_roles TEXT[] DEFAULT '{}',
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Index
CREATE INDEX IF NOT EXISTS idx_predefined_privileges_key ON predefined_privileges(key);
CREATE INDEX IF NOT EXISTS idx_predefined_privileges_category ON predefined_privileges(category);

-- Seed predefined privileges for volunteers
INSERT INTO predefined_privileges (key, name, description, category, default_roles, is_active) VALUES
('volunteer.view_opportunities', 'View Volunteer Opportunities', 'Can view available volunteer roles and opportunities', 'volunteers', ARRAY['volunteer'], true),
('volunteer.apply', 'Apply for Roles', 'Can submit applications for volunteer roles', 'volunteers', ARRAY['volunteer'], true),
('volunteer.view_assignments', 'View Own Assignments', 'Can view own volunteer assignments and schedules', 'volunteers', ARRAY['volunteer'], true),
('volunteer.submit_hours', 'Submit Hours', 'Can log volunteer hours worked', 'volunteers', ARRAY['volunteer'], true),
('volunteer.view_reports', 'View Own Reports', 'Can view personal volunteer activity reports', 'volunteers', ARRAY['volunteer'], true),
('content.view_outreaches', 'View Outreaches', 'Can view outreach programs and events', 'content', ARRAY['volunteer'], true),
('communications.receive_notifications', 'Receive Notifications', 'Receives notifications about volunteer activities', 'communications', ARRAY['volunteer'], true),
('communications.send_messages', 'Send Messages', 'Can send messages to admin team', 'communications', ARRAY['volunteer'], true),
('analytics.view_own', 'View Own Analytics', 'Can view personal contribution analytics', 'analytics', ARRAY['volunteer'], true)
ON CONFLICT (key) DO NOTHING;

-- ===================================================================
-- 4. CREATE HELPER FUNCTIONS
-- ===================================================================

-- Function: Check if user has privilege
CREATE OR REPLACE FUNCTION user_has_privilege(
    p_user_id uuid,
    p_privilege_key text
)
RETURNS boolean AS $$
DECLARE
    has_priv boolean;
BEGIN
    -- Check direct privilege
    SELECT EXISTS(
        SELECT 1
        FROM user_privileges up
        WHERE up.user_id = p_user_id
        AND up.privilege_key = p_privilege_key
        AND up.is_active = true
        AND (up.expires_at IS NULL OR up.expires_at > now())
    ) INTO has_priv;

    -- If not found, check if privilege is default for user's role
    IF NOT has_priv THEN
        SELECT EXISTS(
            SELECT 1
            FROM users u
            JOIN predefined_privileges pp ON u.role = ANY(pp.default_roles)
            WHERE u.id = p_user_id
            AND pp.key = p_privilege_key
            AND pp.is_active = true
        ) INTO has_priv;
    END IF;

    RETURN has_priv;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function: Get user's role
CREATE OR REPLACE FUNCTION get_user_role(p_auth_user_id uuid)
RETURNS text AS $$
DECLARE
    user_role text;
BEGIN
    SELECT role INTO user_role
    FROM users
    WHERE auth_user_id = p_auth_user_id;

    RETURN COALESCE(user_role, 'user');
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ===================================================================
-- 5. CREATE AUTOMATIC TRIGGERS
-- ===================================================================

-- Function: Create user account when volunteer is approved
CREATE OR REPLACE FUNCTION create_user_for_approved_volunteer()
RETURNS TRIGGER AS $$
DECLARE
    new_user_id uuid;
BEGIN
    -- Only create user if status changed to 'approved' or 'active' and no user exists
    IF (NEW.status IN ('approved', 'active')) AND (OLD.status NOT IN ('approved', 'active')) AND (NEW.user_id IS NULL) THEN

        -- Create user record
        INSERT INTO users (email, name, phone, location, role, status, verified)
        VALUES (
            NEW.email,
            COALESCE(NEW.name, NEW.first_name || ' ' || NEW.last_name),
            NEW.phone,
            NEW.location,
            'volunteer',
            'active',
            true
        )
        RETURNING id INTO new_user_id;

        -- Link volunteer to user
        NEW.user_id = new_user_id;

        -- Grant default volunteer privileges
        INSERT INTO user_privileges (user_id, privilege_key, is_active)
        SELECT new_user_id, key, true
        FROM predefined_privileges
        WHERE 'volunteer' = ANY(default_roles) AND is_active = true;

    END IF;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger: Auto-create user when volunteer approved
DROP TRIGGER IF EXISTS trigger_create_user_for_volunteer ON volunteers;
CREATE TRIGGER trigger_create_user_for_volunteer
    BEFORE UPDATE ON volunteers
    FOR EACH ROW
    EXECUTE FUNCTION create_user_for_approved_volunteer();

-- Function: Sync user status with volunteer status
CREATE OR REPLACE FUNCTION sync_user_volunteer_status()
RETURNS TRIGGER AS $$
BEGIN
    -- If volunteer has a linked user, sync the status
    IF NEW.user_id IS NOT NULL THEN
        UPDATE users
        SET status = CASE
            WHEN NEW.status = 'active' THEN 'active'
            WHEN NEW.status = 'approved' THEN 'active'
            WHEN NEW.status = 'inactive' THEN 'inactive'
            WHEN NEW.status = 'rejected' THEN 'suspended'
            ELSE 'inactive'
        END,
        updated_at = now()
        WHERE id = NEW.user_id;
    END IF;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger: Sync statuses
DROP TRIGGER IF EXISTS trigger_sync_user_volunteer_status ON volunteers;
CREATE TRIGGER trigger_sync_user_volunteer_status
    AFTER UPDATE OF status ON volunteers
    FOR EACH ROW
    WHEN (NEW.user_id IS NOT NULL)
    EXECUTE FUNCTION sync_user_volunteer_status();

-- ===================================================================
-- 6. CREATE VIEW
-- ===================================================================

CREATE OR REPLACE VIEW users_with_volunteer_details AS
SELECT
    u.id as user_id,
    u.auth_user_id,
    u.email,
    u.name,
    u.phone,
    u.avatar,
    u.location,
    u.role,
    u.status as user_status,
    u.verified,
    u.created_at as user_created_at,
    u.last_login,

    v.id as volunteer_id,
    v.status as volunteer_status,
    v.interests,
    v.skills,
    v.availability,
    v.emergency_contact,
    v.role_id as assigned_role_id,

    vr.title as role_title,
    vr.category as role_category,

    COUNT(DISTINCT up.id) as privilege_count
FROM users u
LEFT JOIN volunteers v ON u.id = v.user_id
LEFT JOIN volunteer_roles vr ON v.role_id = vr.id
LEFT JOIN user_privileges up ON u.id = up.user_id AND up.is_active = true
WHERE u.role = 'volunteer'
GROUP BY u.id, v.id, vr.id;

-- ===================================================================
-- VERIFICATION
-- ===================================================================

-- Verify all tables exist
DO $$
BEGIN
    RAISE NOTICE '=== VERIFICATION ===';

    IF EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'volunteers') THEN
        RAISE NOTICE '✅ volunteers table created';
    ELSE
        RAISE NOTICE '❌ volunteers table FAILED';
    END IF;

    IF EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'user_privileges') THEN
        RAISE NOTICE '✅ user_privileges table created';
    ELSE
        RAISE NOTICE '❌ user_privileges table FAILED';
    END IF;

    IF EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'predefined_privileges') THEN
        RAISE NOTICE '✅ predefined_privileges table created';
    ELSE
        RAISE NOTICE '❌ predefined_privileges table FAILED';
    END IF;

    -- Count privileges
    RAISE NOTICE 'Predefined privileges count: %', (SELECT COUNT(*) FROM predefined_privileges);
END $$;

-- Show what we created
SELECT 'volunteers' as table_name, COUNT(*) as row_count FROM volunteers
UNION ALL
SELECT 'user_privileges', COUNT(*) FROM user_privileges
UNION ALL
SELECT 'predefined_privileges', COUNT(*) FROM predefined_privileges;
