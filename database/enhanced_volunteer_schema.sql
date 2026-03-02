-- ===================================================================
-- ENHANCED VOLUNTEER SYSTEM SCHEMA
-- Comprehensive schema with activity tracking and assignments
-- Run this AFTER smart_database_setup.sql
-- ===================================================================

-- ===================================================================
-- PART 1: ADD ENHANCED FIELDS TO VOLUNTEERS TABLE
-- ===================================================================

-- Application tracking fields
ALTER TABLE volunteers
ADD COLUMN IF NOT EXISTS application_source TEXT CHECK (application_source IN ('website', 'referral', 'event', 'direct', 'social_media')),
ADD COLUMN IF NOT EXISTS reviewed_by uuid REFERENCES users(id) ON DELETE SET NULL,
ADD COLUMN IF NOT EXISTS reviewed_at TIMESTAMP WITH TIME ZONE,
ADD COLUMN IF NOT EXISTS rejection_reason TEXT;

-- Activity tracking fields
ALTER TABLE volunteers
ADD COLUMN IF NOT EXISTS hours_logged INTEGER DEFAULT 0 CHECK (hours_logged >= 0),
ADD COLUMN IF NOT EXISTS events_attended INTEGER DEFAULT 0 CHECK (events_attended >= 0),
ADD COLUMN IF NOT EXISTS last_activity_date DATE,
ADD COLUMN IF NOT EXISTS performance_rating DECIMAL(3,2) CHECK (performance_rating >= 0 AND performance_rating <= 5.0);

-- Communication preferences
ALTER TABLE volunteers
ADD COLUMN IF NOT EXISTS preferred_contact_method TEXT CHECK (preferred_contact_method IN ('email', 'phone', 'whatsapp', 'sms')),
ADD COLUMN IF NOT EXISTS language_preferences TEXT[] DEFAULT '{}',
ADD COLUMN IF NOT EXISTS timezone TEXT DEFAULT 'Africa/Lagos';

-- Compliance fields
ALTER TABLE volunteers
ADD COLUMN IF NOT EXISTS orientation_completed BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS orientation_date DATE,
ADD COLUMN IF NOT EXISTS training_completed BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS training_date DATE,
ADD COLUMN IF NOT EXISTS agreement_signed BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS agreement_date DATE;

-- ===================================================================
-- PART 2: CREATE VOLUNTEER ASSIGNMENTS TABLE
-- ===================================================================

CREATE TABLE IF NOT EXISTS volunteer_assignments (
    id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    volunteer_id uuid NOT NULL REFERENCES volunteers(id) ON DELETE CASCADE,
    role_id uuid REFERENCES volunteer_roles(id) ON DELETE SET NULL,
    outreach_id uuid,  -- Reference to outreach_reports table
    event_id uuid,     -- Reference to events table (if exists)
    title TEXT NOT NULL CHECK (length(title) >= 2 AND length(title) <= 200),
    description TEXT,
    start_date DATE NOT NULL,
    end_date DATE,
    status TEXT DEFAULT 'assigned' CHECK (status IN ('assigned', 'in_progress', 'completed', 'cancelled', 'on_hold')),
    hours_committed INTEGER CHECK (hours_committed > 0),
    hours_completed INTEGER DEFAULT 0 CHECK (hours_completed >= 0),
    location TEXT,
    assigned_by uuid REFERENCES users(id) ON DELETE SET NULL,
    notes TEXT,
    metadata JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),

    CONSTRAINT valid_dates CHECK (end_date IS NULL OR end_date >= start_date),
    CONSTRAINT valid_hours CHECK (hours_completed <= hours_committed OR hours_committed IS NULL)
);

-- Indexes for volunteer_assignments
CREATE INDEX IF NOT EXISTS idx_volunteer_assignments_volunteer ON volunteer_assignments(volunteer_id);
CREATE INDEX IF NOT EXISTS idx_volunteer_assignments_role ON volunteer_assignments(role_id);
CREATE INDEX IF NOT EXISTS idx_volunteer_assignments_status ON volunteer_assignments(status);
CREATE INDEX IF NOT EXISTS idx_volunteer_assignments_dates ON volunteer_assignments(start_date, end_date);
CREATE INDEX IF NOT EXISTS idx_volunteer_assignments_active ON volunteer_assignments(volunteer_id, status) WHERE status IN ('assigned', 'in_progress');

-- Trigger for updated_at
DROP TRIGGER IF EXISTS update_volunteer_assignments_updated_at ON volunteer_assignments;
CREATE TRIGGER update_volunteer_assignments_updated_at
    BEFORE UPDATE ON volunteer_assignments
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- RLS Policies
ALTER TABLE volunteer_assignments ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Volunteers can view own assignments" ON volunteer_assignments;
CREATE POLICY "Volunteers can view own assignments" ON volunteer_assignments
FOR SELECT
USING (
    volunteer_id IN (
        SELECT id FROM volunteers WHERE user_id = (SELECT id FROM users WHERE auth_user_id = auth.uid())
    )
);

DROP POLICY IF EXISTS "Admins can manage all assignments" ON volunteer_assignments;
CREATE POLICY "Admins can manage all assignments" ON volunteer_assignments
FOR ALL
USING (
    auth.uid() IN (SELECT auth_user_id FROM users WHERE role IN ('admin', 'super_admin'))
);

-- ===================================================================
-- PART 3: CREATE VOLUNTEER ACTIVITY LOG TABLE
-- ===================================================================

CREATE TABLE IF NOT EXISTS volunteer_activity_log (
    id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    volunteer_id uuid NOT NULL REFERENCES volunteers(id) ON DELETE CASCADE,
    activity_type TEXT NOT NULL CHECK (activity_type IN (
        'application_submitted',
        'application_reviewed',
        'application_approved',
        'application_rejected',
        'orientation_completed',
        'training_completed',
        'hours_logged',
        'event_attended',
        'role_assigned',
        'assignment_completed',
        'status_changed',
        'note_added',
        'contact_made'
    )),
    activity_date TIMESTAMP WITH TIME ZONE DEFAULT now(),
    hours_logged DECIMAL(5,2) CHECK (hours_logged >= 0),  -- for hours_logged type
    description TEXT NOT NULL,
    old_value TEXT,  -- for status_changed type
    new_value TEXT,  -- for status_changed type
    metadata JSONB DEFAULT '{}'::jsonb,
    created_by uuid REFERENCES users(id) ON DELETE SET NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Indexes for volunteer_activity_log
CREATE INDEX IF NOT EXISTS idx_volunteer_activity_volunteer ON volunteer_activity_log(volunteer_id, activity_date DESC);
CREATE INDEX IF NOT EXISTS idx_volunteer_activity_type ON volunteer_activity_log(activity_type);
CREATE INDEX IF NOT EXISTS idx_volunteer_activity_date ON volunteer_activity_log(activity_date DESC);

-- RLS Policies
ALTER TABLE volunteer_activity_log ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Volunteers can view own activity log" ON volunteer_activity_log;
CREATE POLICY "Volunteers can view own activity log" ON volunteer_activity_log
FOR SELECT
USING (
    volunteer_id IN (
        SELECT id FROM volunteers WHERE user_id = (SELECT id FROM users WHERE auth_user_id = auth.uid())
    )
);

DROP POLICY IF EXISTS "Admins can view all activity logs" ON volunteer_activity_log;
CREATE POLICY "Admins can view all activity logs" ON volunteer_activity_log
FOR SELECT
USING (
    auth.uid() IN (SELECT auth_user_id FROM users WHERE role IN ('admin', 'super_admin'))
);

DROP POLICY IF EXISTS "System can insert activity logs" ON volunteer_activity_log;
CREATE POLICY "System can insert activity logs" ON volunteer_activity_log
FOR INSERT
WITH CHECK (true);

-- ===================================================================
-- PART 4: CREATE VOLUNTEER AVAILABILITY TABLE
-- ===================================================================

CREATE TABLE IF NOT EXISTS volunteer_availability (
    id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    volunteer_id uuid NOT NULL REFERENCES volunteers(id) ON DELETE CASCADE,
    day_of_week INTEGER CHECK (day_of_week BETWEEN 0 AND 6),  -- 0=Sunday, 6=Saturday
    start_time TIME NOT NULL,
    end_time TIME NOT NULL,
    is_recurring BOOLEAN DEFAULT true,
    specific_date DATE,  -- for one-time availability
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),

    CONSTRAINT valid_time_range CHECK (end_time > start_time),
    CONSTRAINT recurring_or_specific CHECK (
        (is_recurring = true AND day_of_week IS NOT NULL AND specific_date IS NULL) OR
        (is_recurring = false AND specific_date IS NOT NULL)
    )
);

-- Indexes for volunteer_availability
CREATE INDEX IF NOT EXISTS idx_volunteer_availability_volunteer ON volunteer_availability(volunteer_id);
CREATE INDEX IF NOT EXISTS idx_volunteer_availability_day ON volunteer_availability(day_of_week) WHERE is_recurring = true;
CREATE INDEX IF NOT EXISTS idx_volunteer_availability_date ON volunteer_availability(specific_date) WHERE is_recurring = false;

-- RLS Policies
ALTER TABLE volunteer_availability ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Volunteers can manage own availability" ON volunteer_availability;
CREATE POLICY "Volunteers can manage own availability" ON volunteer_availability
FOR ALL
USING (
    volunteer_id IN (
        SELECT id FROM volunteers WHERE user_id = (SELECT id FROM users WHERE auth_user_id = auth.uid())
    )
);

DROP POLICY IF EXISTS "Admins can view all availability" ON volunteer_availability;
CREATE POLICY "Admins can view all availability" ON volunteer_availability
FOR SELECT
USING (
    auth.uid() IN (SELECT auth_user_id FROM users WHERE role IN ('admin', 'super_admin'))
);

-- ===================================================================
-- PART 5: ADD PERFORMANCE INDEXES
-- ===================================================================

-- For volunteer dashboard queries
CREATE INDEX IF NOT EXISTS idx_volunteers_user_status ON volunteers(user_id, status) WHERE status = 'active';

-- For admin filtering
CREATE INDEX IF NOT EXISTS idx_volunteers_status_created ON volunteers(status, created_at DESC);

-- For email lookups (case-insensitive)
CREATE INDEX IF NOT EXISTS idx_volunteers_email_lower ON volunteers(LOWER(email));

-- For performance tracking
CREATE INDEX IF NOT EXISTS idx_volunteers_performance ON volunteers(performance_rating DESC NULLS LAST) WHERE status = 'active';

-- For activity filtering
CREATE INDEX IF NOT EXISTS idx_volunteers_last_activity ON volunteers(last_activity_date DESC NULLS LAST);

-- ===================================================================
-- PART 6: ADD CONSTRAINTS FOR DATA INTEGRITY
-- ===================================================================

-- Email validation (if not already exists)
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_constraint WHERE conname = 'volunteers_email_format_check'
    ) THEN
        ALTER TABLE volunteers
        ADD CONSTRAINT volunteers_email_format_check
        CHECK (email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$');
    END IF;
END $$;

-- Phone length validation
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_constraint WHERE conname = 'volunteers_phone_length_check'
    ) THEN
        ALTER TABLE volunteers
        ADD CONSTRAINT volunteers_phone_length_check
        CHECK (phone IS NULL OR (length(phone) >= 10 AND length(phone) <= 20));
    END IF;
END $$;

-- ===================================================================
-- PART 7: CREATE HELPER FUNCTIONS
-- ===================================================================

-- Function to update volunteer hours
CREATE OR REPLACE FUNCTION update_volunteer_hours(
    p_volunteer_id uuid,
    p_hours DECIMAL(5,2),
    p_description TEXT DEFAULT NULL
) RETURNS VOID AS $$
BEGIN
    -- Update volunteer hours
    UPDATE volunteers
    SET hours_logged = hours_logged + p_hours,
        last_activity_date = CURRENT_DATE
    WHERE id = p_volunteer_id;

    -- Log the activity
    INSERT INTO volunteer_activity_log (
        volunteer_id,
        activity_type,
        hours_logged,
        description,
        created_by
    ) VALUES (
        p_volunteer_id,
        'hours_logged',
        p_hours,
        COALESCE(p_description, 'Hours logged'),
        (SELECT id FROM users WHERE auth_user_id = auth.uid())
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to get volunteer statistics
CREATE OR REPLACE FUNCTION get_volunteer_stats(p_volunteer_id uuid)
RETURNS TABLE (
    total_hours INTEGER,
    events_attended INTEGER,
    active_assignments INTEGER,
    completed_assignments INTEGER,
    performance_rating DECIMAL(3,2)
) AS $$
BEGIN
    RETURN QUERY
    SELECT
        v.hours_logged,
        v.events_attended,
        (SELECT COUNT(*) FROM volunteer_assignments WHERE volunteer_id = p_volunteer_id AND status IN ('assigned', 'in_progress'))::INTEGER,
        (SELECT COUNT(*) FROM volunteer_assignments WHERE volunteer_id = p_volunteer_id AND status = 'completed')::INTEGER,
        v.performance_rating
    FROM volunteers v
    WHERE v.id = p_volunteer_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ===================================================================
-- PART 8: CREATE VIEWS FOR REPORTING
-- ===================================================================

-- View for active volunteers with stats
CREATE OR REPLACE VIEW active_volunteers_with_stats AS
SELECT
    v.id,
    v.user_id,
    v.email,
    v.name,
    v.phone,
    v.location,
    v.interests,
    v.skills,
    v.hours_logged,
    v.events_attended,
    v.performance_rating,
    v.last_activity_date,
    vr.title as current_role,
    (SELECT COUNT(*) FROM volunteer_assignments va WHERE va.volunteer_id = v.id AND va.status IN ('assigned', 'in_progress')) as active_assignments,
    (SELECT COUNT(*) FROM volunteer_assignments va WHERE va.volunteer_id = v.id AND va.status = 'completed') as completed_assignments,
    v.created_at
FROM volunteers v
LEFT JOIN volunteer_roles vr ON v.role_id = vr.id
WHERE v.status = 'active';

-- View for volunteer assignment summary
CREATE OR REPLACE VIEW volunteer_assignment_summary AS
SELECT
    va.id,
    va.volunteer_id,
    v.name as volunteer_name,
    v.email as volunteer_email,
    va.title as assignment_title,
    vr.title as role_title,
    va.start_date,
    va.end_date,
    va.status,
    va.hours_committed,
    va.hours_completed,
    CASE
        WHEN va.hours_committed IS NOT NULL
        THEN ROUND((va.hours_completed::DECIMAL / va.hours_committed::DECIMAL) * 100, 2)
        ELSE NULL
    END as completion_percentage,
    va.created_at
FROM volunteer_assignments va
JOIN volunteers v ON va.volunteer_id = v.id
LEFT JOIN volunteer_roles vr ON va.role_id = vr.id
ORDER BY va.created_at DESC;

-- ===================================================================
-- PART 9: ADD COMMENTS FOR DOCUMENTATION
-- ===================================================================

COMMENT ON TABLE volunteer_assignments IS 'Tracks specific work assignments for volunteers';
COMMENT ON TABLE volunteer_activity_log IS 'Audit log of all volunteer activities and interactions';
COMMENT ON TABLE volunteer_availability IS 'Stores when volunteers are available to work';

COMMENT ON COLUMN volunteers.hours_logged IS 'Total hours volunteer has contributed';
COMMENT ON COLUMN volunteers.events_attended IS 'Number of events volunteer has participated in';
COMMENT ON COLUMN volunteers.performance_rating IS 'Performance rating from 0.0 to 5.0';
COMMENT ON COLUMN volunteers.last_activity_date IS 'Last date volunteer had any activity';

-- ===================================================================
-- SUCCESS MESSAGE
-- ===================================================================

DO $$
BEGIN
    RAISE NOTICE '';
    RAISE NOTICE '=== ENHANCED VOLUNTEER SCHEMA INSTALLATION COMPLETE ===';
    RAISE NOTICE '';
    RAISE NOTICE 'New Tables Created:';
    RAISE NOTICE '  ✅ volunteer_assignments';
    RAISE NOTICE '  ✅ volunteer_activity_log';
    RAISE NOTICE '  ✅ volunteer_availability';
    RAISE NOTICE '';
    RAISE NOTICE 'Enhanced Fields Added to volunteers:';
    RAISE NOTICE '  ✅ Application tracking (source, reviewed_by, reviewed_at)';
    RAISE NOTICE '  ✅ Activity metrics (hours, events, performance)';
    RAISE NOTICE '  ✅ Communication preferences';
    RAISE NOTICE '  ✅ Compliance tracking (orientation, training, agreement)';
    RAISE NOTICE '';
    RAISE NOTICE 'Helper Functions:';
    RAISE NOTICE '  ✅ update_volunteer_hours()';
    RAISE NOTICE '  ✅ get_volunteer_stats()';
    RAISE NOTICE '';
    RAISE NOTICE 'Views Created:';
    RAISE NOTICE '  ✅ active_volunteers_with_stats';
    RAISE NOTICE '  ✅ volunteer_assignment_summary';
    RAISE NOTICE '';
    RAISE NOTICE 'Volunteer system is now fully enhanced!';
    RAISE NOTICE 'Ready for advanced tracking and reporting.';
END $$;
