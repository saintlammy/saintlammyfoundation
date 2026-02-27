-- ===================================================================
-- UNIFIED USERS & VOLUNTEER SYSTEM
-- Complete user management with role-based access control
-- Created: February 27, 2026
-- ===================================================================

-- ===================================================================
-- PART 1: USERS TABLE (Central user registry)
-- ===================================================================

CREATE TABLE IF NOT EXISTS users (
    id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    auth_user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE, -- Link to Supabase Auth
    email TEXT NOT NULL UNIQUE CHECK (length(email) >= 3 AND length(email) <= 255),
    name TEXT NOT NULL CHECK (length(name) >= 2 AND length(name) <= 200),
    phone TEXT CHECK (length(phone) <= 20),
    avatar TEXT CHECK (length(avatar) <= 500),
    location TEXT CHECK (length(location) <= 200),

    -- Role & Status
    role TEXT NOT NULL DEFAULT 'user' CHECK (role IN ('super_admin', 'admin', 'volunteer', 'donor', 'user')),
    status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'suspended', 'banned')),
    verified BOOLEAN DEFAULT false,

    -- Timestamps
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    last_login TIMESTAMP WITH TIME ZONE,

    -- Metadata
    metadata JSONB DEFAULT '{}'::jsonb,

    CONSTRAINT unique_auth_user UNIQUE(auth_user_id)
);

-- Indexes for users
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_auth_id ON users(auth_user_id);
CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);
CREATE INDEX IF NOT EXISTS idx_users_status ON users(status);
CREATE INDEX IF NOT EXISTS idx_users_created ON users(created_at DESC);

-- Trigger for updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_users_updated_at
    BEFORE UPDATE ON users
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- RLS Policies for users
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- Users can view their own profile
CREATE POLICY "Users can view own profile"
    ON users
    FOR SELECT
    USING (auth.uid() = auth_user_id);

-- Users can update their own profile (except role and status)
CREATE POLICY "Users can update own profile"
    ON users
    FOR UPDATE
    USING (auth.uid() = auth_user_id)
    WITH CHECK (
        auth.uid() = auth_user_id
        AND role = (SELECT role FROM users WHERE auth_user_id = auth.uid())
        AND status = (SELECT status FROM users WHERE auth_user_id = auth.uid())
    );

-- Admins can view all users
CREATE POLICY "Admins can view all users"
    ON users
    FOR SELECT
    USING (
        auth.uid() IN (
            SELECT auth_user_id FROM users
            WHERE role IN ('admin', 'super_admin')
        )
    );

-- Admins can manage all users
CREATE POLICY "Admins can manage users"
    ON users
    FOR ALL
    USING (
        auth.uid() IN (
            SELECT auth_user_id FROM users
            WHERE role IN ('admin', 'super_admin')
        )
    );

-- ===================================================================
-- PART 2: UPDATE VOLUNTEERS TABLE (Link to users table)
-- ===================================================================

-- Add user_id column to volunteers table if it doesn't exist
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns
        WHERE table_name = 'volunteers' AND column_name = 'user_id'
    ) THEN
        ALTER TABLE volunteers ADD COLUMN user_id uuid REFERENCES users(id) ON DELETE SET NULL;
        CREATE INDEX idx_volunteers_user_id ON volunteers(user_id);
    END IF;
END $$;

-- Add role_id column to volunteers table if it doesn't exist (for volunteer role assignment)
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns
        WHERE table_name = 'volunteers' AND column_name = 'role_id'
    ) THEN
        ALTER TABLE volunteers ADD COLUMN role_id uuid REFERENCES volunteer_roles(id) ON DELETE SET NULL;
        CREATE INDEX idx_volunteers_role_id ON volunteers(role_id);
    END IF;
END $$;

-- ===================================================================
-- PART 3: USER PRIVILEGES TABLE (Role-based permissions)
-- ===================================================================

CREATE TABLE IF NOT EXISTS user_privileges (
    id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    privilege_key TEXT NOT NULL CHECK (length(privilege_key) >= 2 AND length(privilege_key) <= 100),
    privilege_value TEXT, -- Optional value for parameterized privileges
    granted_by uuid REFERENCES users(id) ON DELETE SET NULL,
    granted_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    expires_at TIMESTAMP WITH TIME ZONE,
    is_active BOOLEAN DEFAULT true,

    UNIQUE(user_id, privilege_key)
);

-- Index for privileges
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
        auth.uid() IN (
            SELECT auth_user_id FROM users
            WHERE role IN ('admin', 'super_admin')
        )
    );

-- ===================================================================
-- PART 4: PREDEFINED PRIVILEGES (Volunteer role privileges)
-- ===================================================================

CREATE TABLE IF NOT EXISTS predefined_privileges (
    id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    key TEXT NOT NULL UNIQUE CHECK (length(key) >= 2 AND length(key) <= 100),
    name TEXT NOT NULL CHECK (length(name) >= 2 AND length(name) <= 200),
    description TEXT CHECK (length(description) <= 1000),
    category TEXT CHECK (category IN ('content', 'users', 'volunteers', 'donations', 'analytics', 'communications', 'settings')),
    default_roles TEXT[] DEFAULT '{}', -- Which roles get this privilege by default
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Seed predefined privileges for volunteers
INSERT INTO predefined_privileges (key, name, description, category, default_roles, is_active) VALUES
-- Volunteer-specific privileges
('volunteer.view_opportunities', 'View Volunteer Opportunities', 'Can view available volunteer roles and opportunities', 'volunteers', ARRAY['volunteer'], true),
('volunteer.apply', 'Apply for Roles', 'Can submit applications for volunteer roles', 'volunteers', ARRAY['volunteer'], true),
('volunteer.view_assignments', 'View Own Assignments', 'Can view own volunteer assignments and schedules', 'volunteers', ARRAY['volunteer'], true),
('volunteer.submit_hours', 'Submit Hours', 'Can log volunteer hours worked', 'volunteers', ARRAY['volunteer'], true),
('volunteer.view_reports', 'View Own Reports', 'Can view personal volunteer activity reports', 'volunteers', ARRAY['volunteer'], true),

-- Content privileges (for volunteer coordinators)
('content.view_outreaches', 'View Outreaches', 'Can view outreach programs and events', 'content', ARRAY['volunteer'], true),
('content.create_reports', 'Create Reports', 'Can create outreach and activity reports', 'content', ARRAY[], false),

-- Communication privileges
('communications.receive_notifications', 'Receive Notifications', 'Receives notifications about volunteer activities', 'communications', ARRAY['volunteer'], true),
('communications.send_messages', 'Send Messages', 'Can send messages to admin team', 'communications', ARRAY['volunteer'], true),

-- Analytics (limited)
('analytics.view_own', 'View Own Analytics', 'Can view personal contribution analytics', 'analytics', ARRAY['volunteer'], true)

ON CONFLICT (key) DO NOTHING;

-- ===================================================================
-- PART 5: VOLUNTEER STATUS UPDATES
-- ===================================================================

-- Update volunteers table status enum to match user status
DO $$
BEGIN
    -- Check if status column exists and update constraint
    IF EXISTS (
        SELECT 1 FROM information_schema.columns
        WHERE table_name = 'volunteers' AND column_name = 'status'
    ) THEN
        -- Drop old constraint if exists
        ALTER TABLE volunteers DROP CONSTRAINT IF EXISTS volunteers_status_check;

        -- Add new constraint matching users table
        ALTER TABLE volunteers ADD CONSTRAINT volunteers_status_check
            CHECK (status IN ('pending', 'approved', 'active', 'inactive', 'rejected'));
    END IF;
END $$;

-- ===================================================================
-- PART 6: FUNCTIONS FOR USER-VOLUNTEER SYNC
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
-- PART 7: HELPER FUNCTIONS
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
-- PART 8: DATA MIGRATION (Optional - Run if you have existing data)
-- ===================================================================

-- Migrate existing volunteers to users table (uncomment to run)
-- INSERT INTO users (email, name, phone, location, role, status, verified, created_at)
-- SELECT
--     email,
--     COALESCE(name, first_name || ' ' || last_name) as name,
--     phone,
--     location,
--     'volunteer' as role,
--     CASE
--         WHEN status IN ('approved', 'active') THEN 'active'
--         WHEN status = 'inactive' THEN 'inactive'
--         ELSE 'inactive'
--     END as status,
--     true as verified,
--     created_at
-- FROM volunteers
-- WHERE email NOT IN (SELECT email FROM users) -- Avoid duplicates
-- AND status IN ('approved', 'active')
-- ON CONFLICT (email) DO NOTHING;

-- Link existing volunteers to newly created users (uncomment to run)
-- UPDATE volunteers v
-- SET user_id = u.id
-- FROM users u
-- WHERE v.email = u.email
-- AND v.user_id IS NULL
-- AND u.role = 'volunteer';

-- ===================================================================
-- PART 9: VIEWS FOR EASY QUERYING
-- ===================================================================

-- View: Users with volunteer details
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
-- NOTES
-- ===================================================================
-- 1. Run this after volunteer_tables.sql and form_options_tables.sql
-- 2. Creates unified users table with role-based access control
-- 3. Links volunteers to users automatically on approval
-- 4. Implements privilege system for fine-grained permissions
-- 5. Syncs volunteer and user statuses automatically
-- 6. Provides helper functions for permission checks
-- 7. Migration scripts are commented out - uncomment if needed
-- 8. RLS policies ensure data security at database level
-- 9. Volunteers get user accounts with specific privileges
-- 10. Admins can grant/revoke privileges as needed
