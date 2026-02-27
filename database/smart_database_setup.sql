-- ===================================================================
-- SMART DATABASE SETUP - Handles existing tables
-- Run this to set up only missing components
-- ===================================================================

-- Enable UUID extension if not already enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ===================================================================
-- PART 0: HELPER FUNCTIONS (Must exist first)
-- ===================================================================

-- Function for updating updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- ===================================================================
-- PART 1: USERS TABLE (Create if not exists)
-- ===================================================================

CREATE TABLE IF NOT EXISTS users (
    id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    auth_user_id uuid,
    email TEXT NOT NULL UNIQUE CHECK (length(email) >= 3 AND length(email) <= 255),
    name TEXT NOT NULL CHECK (length(name) >= 2 AND length(name) <= 200),
    phone TEXT CHECK (length(phone) <= 20),
    avatar TEXT CHECK (length(avatar) <= 500),
    location TEXT CHECK (length(location) <= 200),
    role TEXT NOT NULL DEFAULT 'user' CHECK (role IN ('super_admin', 'admin', 'volunteer', 'donor', 'user')),
    status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'suspended', 'banned')),
    verified BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    last_login TIMESTAMP WITH TIME ZONE,
    metadata JSONB DEFAULT '{}'::jsonb
);

CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_auth_id ON users(auth_user_id);
CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);
CREATE INDEX IF NOT EXISTS idx_users_status ON users(status);
CREATE INDEX IF NOT EXISTS idx_users_created ON users(created_at DESC);

DROP TRIGGER IF EXISTS update_users_updated_at ON users;
CREATE TRIGGER update_users_updated_at
    BEFORE UPDATE ON users
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

ALTER TABLE users ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view own profile" ON users;
CREATE POLICY "Users can view own profile" ON users FOR SELECT USING (auth.uid() = auth_user_id);

DROP POLICY IF EXISTS "Users can update own profile" ON users;
CREATE POLICY "Users can update own profile" ON users FOR UPDATE
USING (auth.uid() = auth_user_id)
WITH CHECK (auth.uid() = auth_user_id AND role = (SELECT role FROM users WHERE auth_user_id = auth.uid()) AND status = (SELECT status FROM users WHERE auth_user_id = auth.uid()));

DROP POLICY IF EXISTS "Admins can view all users" ON users;
CREATE POLICY "Admins can view all users" ON users FOR SELECT
USING (auth.uid() IN (SELECT auth_user_id FROM users WHERE role IN ('admin', 'super_admin')));

DROP POLICY IF EXISTS "Admins can manage users" ON users;
CREATE POLICY "Admins can manage users" ON users FOR ALL
USING (auth.uid() IN (SELECT auth_user_id FROM users WHERE role IN ('admin', 'super_admin')));

-- ===================================================================
-- PART 2: VOLUNTEER ROLES TABLE (Skip RLS if exists)
-- ===================================================================

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

CREATE INDEX IF NOT EXISTS idx_volunteer_roles_active ON volunteer_roles(is_active);
CREATE INDEX IF NOT EXISTS idx_volunteer_roles_category ON volunteer_roles(category);
CREATE INDEX IF NOT EXISTS idx_volunteer_roles_created ON volunteer_roles(created_at DESC);

DROP TRIGGER IF EXISTS update_volunteer_roles_updated_at ON volunteer_roles;
CREATE TRIGGER update_volunteer_roles_updated_at
    BEFORE UPDATE ON volunteer_roles
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

ALTER TABLE volunteer_roles ENABLE ROW LEVEL SECURITY;

-- Only create policies if they don't exist
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'volunteer_roles' AND policyname = 'Public can view active volunteer roles') THEN
        CREATE POLICY "Public can view active volunteer roles" ON volunteer_roles FOR SELECT USING (is_active = true);
    END IF;

    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'volunteer_roles' AND policyname = 'Admins can manage volunteer roles') THEN
        CREATE POLICY "Admins can manage volunteer roles" ON volunteer_roles FOR ALL USING (auth.role() = 'authenticated');
    END IF;
END $$;

-- ===================================================================
-- PART 3: VOLUNTEERS TABLE
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
    interests TEXT[] DEFAULT '{}',
    skills TEXT[] DEFAULT '{}',
    availability TEXT[] DEFAULT '{}',
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'active', 'inactive', 'rejected')),
    role_id uuid REFERENCES volunteer_roles(id) ON DELETE SET NULL,
    emergency_contact JSONB DEFAULT '{}'::jsonb,
    notes TEXT,
    application_date DATE DEFAULT CURRENT_DATE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_volunteers_user_id ON volunteers(user_id);
CREATE INDEX IF NOT EXISTS idx_volunteers_email ON volunteers(email);
CREATE INDEX IF NOT EXISTS idx_volunteers_status ON volunteers(status);
CREATE INDEX IF NOT EXISTS idx_volunteers_role_id ON volunteers(role_id);
CREATE INDEX IF NOT EXISTS idx_volunteers_created ON volunteers(created_at DESC);

DROP TRIGGER IF EXISTS update_volunteers_updated_at ON volunteers;
CREATE TRIGGER update_volunteers_updated_at
    BEFORE UPDATE ON volunteers
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

ALTER TABLE volunteers ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public can insert volunteer applications" ON volunteers;
CREATE POLICY "Public can insert volunteer applications" ON volunteers FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Users can view their own volunteer record" ON volunteers;
CREATE POLICY "Users can view their own volunteer record" ON volunteers FOR SELECT
USING (user_id = (SELECT id FROM users WHERE auth_user_id = auth.uid()) OR auth.uid() IN (SELECT auth_user_id FROM users WHERE role IN ('admin', 'super_admin')));

DROP POLICY IF EXISTS "Admins can manage volunteers" ON volunteers;
CREATE POLICY "Admins can manage volunteers" ON volunteers FOR ALL
USING (auth.uid() IN (SELECT auth_user_id FROM users WHERE role IN ('admin', 'super_admin')));

-- ===================================================================
-- PART 4: USER PRIVILEGES TABLE
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

CREATE INDEX IF NOT EXISTS idx_user_privileges_user ON user_privileges(user_id);
CREATE INDEX IF NOT EXISTS idx_user_privileges_key ON user_privileges(privilege_key);
CREATE INDEX IF NOT EXISTS idx_user_privileges_active ON user_privileges(is_active, expires_at);

ALTER TABLE user_privileges ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view own privileges" ON user_privileges;
CREATE POLICY "Users can view own privileges" ON user_privileges FOR SELECT
USING (user_id = (SELECT id FROM users WHERE auth_user_id = auth.uid()));

DROP POLICY IF EXISTS "Admins can manage privileges" ON user_privileges;
CREATE POLICY "Admins can manage privileges" ON user_privileges FOR ALL
USING (auth.uid() IN (SELECT auth_user_id FROM users WHERE role IN ('admin', 'super_admin')));

-- ===================================================================
-- PART 5: PREDEFINED PRIVILEGES TABLE
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

CREATE INDEX IF NOT EXISTS idx_predefined_privileges_key ON predefined_privileges(key);
CREATE INDEX IF NOT EXISTS idx_predefined_privileges_category ON predefined_privileges(category);

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
-- PART 6: HELPER FUNCTIONS
-- ===================================================================

CREATE OR REPLACE FUNCTION user_has_privilege(p_user_id uuid, p_privilege_key text)
RETURNS boolean AS $$
DECLARE has_priv boolean;
BEGIN
    SELECT EXISTS(SELECT 1 FROM user_privileges up WHERE up.user_id = p_user_id AND up.privilege_key = p_privilege_key AND up.is_active = true AND (up.expires_at IS NULL OR up.expires_at > now())) INTO has_priv;
    IF NOT has_priv THEN
        SELECT EXISTS(SELECT 1 FROM users u JOIN predefined_privileges pp ON u.role = ANY(pp.default_roles) WHERE u.id = p_user_id AND pp.key = p_privilege_key AND pp.is_active = true) INTO has_priv;
    END IF;
    RETURN has_priv;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE FUNCTION get_user_role(p_auth_user_id uuid)
RETURNS text AS $$
DECLARE user_role text;
BEGIN
    SELECT role INTO user_role FROM users WHERE auth_user_id = p_auth_user_id;
    RETURN COALESCE(user_role, 'user');
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ===================================================================
-- PART 7: AUTOMATIC TRIGGERS
-- ===================================================================

CREATE OR REPLACE FUNCTION create_user_for_approved_volunteer()
RETURNS TRIGGER AS $$
DECLARE new_user_id uuid;
BEGIN
    IF (NEW.status IN ('approved', 'active')) AND (OLD IS NULL OR OLD.status NOT IN ('approved', 'active')) AND (NEW.user_id IS NULL) THEN
        INSERT INTO users (email, name, phone, location, role, status, verified)
        VALUES (NEW.email, COALESCE(NEW.name, NEW.first_name || ' ' || NEW.last_name), NEW.phone, NEW.location, 'volunteer', 'active', true)
        RETURNING id INTO new_user_id;
        NEW.user_id = new_user_id;
        INSERT INTO user_privileges (user_id, privilege_key, is_active)
        SELECT new_user_id, key, true FROM predefined_privileges WHERE 'volunteer' = ANY(default_roles) AND is_active = true;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_create_user_for_volunteer ON volunteers;
CREATE TRIGGER trigger_create_user_for_volunteer BEFORE UPDATE ON volunteers FOR EACH ROW EXECUTE FUNCTION create_user_for_approved_volunteer();

CREATE OR REPLACE FUNCTION sync_user_volunteer_status()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.user_id IS NOT NULL THEN
        UPDATE users SET status = CASE WHEN NEW.status = 'active' THEN 'active' WHEN NEW.status = 'approved' THEN 'active' WHEN NEW.status = 'inactive' THEN 'inactive' WHEN NEW.status = 'rejected' THEN 'suspended' ELSE 'inactive' END, updated_at = now() WHERE id = NEW.user_id;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_sync_user_volunteer_status ON volunteers;
CREATE TRIGGER trigger_sync_user_volunteer_status AFTER UPDATE OF status ON volunteers FOR EACH ROW WHEN (NEW.user_id IS NOT NULL) EXECUTE FUNCTION sync_user_volunteer_status();

-- ===================================================================
-- PART 8: VIEW
-- ===================================================================

CREATE OR REPLACE VIEW users_with_volunteer_details AS
SELECT u.id as user_id, u.auth_user_id, u.email, u.name, u.phone, u.avatar, u.location, u.role, u.status as user_status, u.verified, u.created_at as user_created_at, u.last_login,
       v.id as volunteer_id, v.status as volunteer_status, v.interests, v.skills, v.availability, v.emergency_contact, v.role_id as assigned_role_id,
       vr.title as role_title, vr.category as role_category, COUNT(DISTINCT up.id) as privilege_count
FROM users u
LEFT JOIN volunteers v ON u.id = v.user_id
LEFT JOIN volunteer_roles vr ON v.role_id = vr.id
LEFT JOIN user_privileges up ON u.id = up.user_id AND up.is_active = true
WHERE u.role = 'volunteer'
GROUP BY u.id, v.id, vr.id;

-- ===================================================================
-- VERIFICATION
-- ===================================================================

DO $$
BEGIN
    RAISE NOTICE '=== SMART DATABASE SETUP COMPLETE ===';
    RAISE NOTICE '';
    IF EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'users') THEN RAISE NOTICE '  ✅ users'; ELSE RAISE NOTICE '  ❌ users FAILED'; END IF;
    IF EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'volunteer_roles') THEN RAISE NOTICE '  ✅ volunteer_roles'; ELSE RAISE NOTICE '  ❌ volunteer_roles FAILED'; END IF;
    IF EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'volunteers') THEN RAISE NOTICE '  ✅ volunteers'; ELSE RAISE NOTICE '  ❌ volunteers FAILED'; END IF;
    IF EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'user_privileges') THEN RAISE NOTICE '  ✅ user_privileges'; ELSE RAISE NOTICE '  ❌ user_privileges FAILED'; END IF;
    IF EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'predefined_privileges') THEN RAISE NOTICE '  ✅ predefined_privileges (% privileges)', (SELECT COUNT(*) FROM predefined_privileges); ELSE RAISE NOTICE '  ❌ predefined_privileges FAILED'; END IF;
    RAISE NOTICE '';
    RAISE NOTICE 'Ready to create volunteer accounts!';
END $$;

SELECT 'users' as table_name, COUNT(*) as row_count FROM users
UNION ALL SELECT 'volunteer_roles', COUNT(*) FROM volunteer_roles
UNION ALL SELECT 'volunteers', COUNT(*) FROM volunteers
UNION ALL SELECT 'user_privileges', COUNT(*) FROM user_privileges
UNION ALL SELECT 'predefined_privileges', COUNT(*) FROM predefined_privileges;
