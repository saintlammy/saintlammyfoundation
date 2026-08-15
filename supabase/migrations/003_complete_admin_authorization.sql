-- Close the remaining authorization gaps after 002_harden_admin_authorization.sql.
-- This migration is idempotent and intentionally replaces legacy permissive policies.

CREATE TABLE IF NOT EXISTS public.admin_settings (
  key text PRIMARY KEY,
  value jsonb NOT NULL DEFAULT '{}'::jsonb,
  updated_at timestamptz NOT NULL DEFAULT now(),
  updated_by uuid REFERENCES auth.users(id) ON DELETE SET NULL
);

ALTER TABLE public.admin_settings ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Verified admins can manage settings" ON public.admin_settings;
CREATE POLICY "Verified admins can manage settings"
  ON public.admin_settings FOR ALL TO authenticated
  USING (public.is_admin()) WITH CHECK (public.is_admin());

CREATE TABLE IF NOT EXISTS public.messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  sender_name text NOT NULL,
  sender_email text NOT NULL,
  subject text NOT NULL,
  content text NOT NULL,
  status text NOT NULL DEFAULT 'unread' CHECK (status IN ('unread', 'read', 'archived')),
  priority text NOT NULL DEFAULT 'normal' CHECK (priority IN ('low', 'normal', 'high')),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.notifications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  message text NOT NULL,
  type text NOT NULL DEFAULT 'info' CHECK (type IN ('success', 'error', 'warning', 'info')),
  category text NOT NULL DEFAULT 'general',
  priority text NOT NULL DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high')),
  read boolean NOT NULL DEFAULT false,
  user_id uuid,
  metadata jsonb NOT NULL DEFAULT '{}'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now(),
  read_at timestamptz
);

DO $$
BEGIN
  IF to_regclass('public.notifications') IS NOT NULL AND to_regclass('public.users') IS NOT NULL THEN
    ALTER TABLE public.notifications DROP CONSTRAINT IF EXISTS notifications_user_id_fkey;
    UPDATE public.notifications AS notification
    SET user_id = NULL
    WHERE user_id IS NOT NULL
      AND NOT EXISTS (SELECT 1 FROM public.users AS app_user WHERE app_user.id = notification.user_id);
    ALTER TABLE public.notifications
      ADD CONSTRAINT notifications_user_id_fkey
      FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;
  END IF;
END;
$$;

CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS boolean
LANGUAGE plpgsql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  allowed boolean := false;
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public' AND table_name = 'users' AND column_name = 'auth_user_id'
  ) THEN
    RETURN false;
  END IF;

  EXECUTE
    'SELECT EXISTS (
      SELECT 1 FROM public.users
      WHERE auth_user_id = $1
        AND role IN (''admin'', ''super_admin'')
        AND COALESCE(status::text, ''inactive'') = ''active''
    )'
  INTO allowed
  USING auth.uid();

  RETURN allowed;
END;
$$;

REVOKE ALL ON FUNCTION public.is_admin() FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.is_admin() TO authenticated;

DO $$
DECLARE
  target_table text;
  policy record;
BEGIN
  FOREACH target_table IN ARRAY ARRAY[
    'content',
    'campaigns',
    'messages',
    'notifications',
    'partnership_applications',
    'partnership_team_members'
  ]
  LOOP
    IF to_regclass(format('public.%I', target_table)) IS NULL THEN
      CONTINUE;
    END IF;

    EXECUTE format('ALTER TABLE public.%I ENABLE ROW LEVEL SECURITY', target_table);

    FOR policy IN
      SELECT policyname
      FROM pg_policies
      WHERE schemaname = 'public' AND tablename = target_table
    LOOP
      EXECUTE format('DROP POLICY IF EXISTS %I ON public.%I', policy.policyname, target_table);
    END LOOP;
  END LOOP;
END;
$$;

DO $$
BEGIN
  IF to_regclass('public.content') IS NOT NULL THEN
    CREATE POLICY "Public can read published content"
      ON public.content FOR SELECT TO anon, authenticated
      USING (status = 'published');
    CREATE POLICY "Verified admins can manage content"
      ON public.content FOR ALL TO authenticated
      USING (public.is_admin()) WITH CHECK (public.is_admin());
  END IF;

  IF to_regclass('public.campaigns') IS NOT NULL THEN
    CREATE POLICY "Public can read visible campaigns"
      ON public.campaigns FOR SELECT TO anon, authenticated
      USING (status IN ('active', 'completed'));
    CREATE POLICY "Verified admins can manage campaigns"
      ON public.campaigns FOR ALL TO authenticated
      USING (public.is_admin()) WITH CHECK (public.is_admin());
  END IF;

  IF to_regclass('public.notifications') IS NOT NULL THEN
    CREATE POLICY "Verified admins can manage notifications"
      ON public.notifications FOR ALL TO authenticated
      USING (public.is_admin()) WITH CHECK (public.is_admin());
  END IF;

  IF to_regclass('public.messages') IS NOT NULL THEN
    CREATE POLICY "Public can submit contact messages"
      ON public.messages FOR INSERT TO anon, authenticated
      WITH CHECK (status = 'unread' AND priority = 'normal');
    CREATE POLICY "Verified admins can manage messages"
      ON public.messages FOR ALL TO authenticated
      USING (public.is_admin()) WITH CHECK (public.is_admin());
  END IF;

  IF to_regclass('public.partnership_applications') IS NOT NULL THEN
    CREATE POLICY "Public can submit partnership applications"
      ON public.partnership_applications FOR INSERT TO anon, authenticated
      WITH CHECK (status = 'new' AND assigned_to IS NULL AND notes IS NULL);
    CREATE POLICY "Verified admins can manage partnership applications"
      ON public.partnership_applications FOR ALL TO authenticated
      USING (public.is_admin()) WITH CHECK (public.is_admin());
  END IF;

  IF to_regclass('public.partnership_team_members') IS NOT NULL THEN
    CREATE POLICY "Public can read active partnership team"
      ON public.partnership_team_members FOR SELECT TO anon, authenticated
      USING (status = 'active');
    CREATE POLICY "Verified admins can manage partnership team"
      ON public.partnership_team_members FOR ALL TO authenticated
      USING (public.is_admin()) WITH CHECK (public.is_admin());
  END IF;
END;
$$;

-- Increment campaign totals atomically after a verified donation. Keeping the
-- read and write in one statement prevents concurrent payments from
-- overwriting each other's progress.
CREATE OR REPLACE FUNCTION public.increment_campaign_amount(
  campaign_id_input uuid,
  increment_amount numeric
)
RETURNS TABLE (
  id uuid,
  current_amount numeric,
  goal_amount numeric,
  status text
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF increment_amount IS NULL OR increment_amount <= 0 THEN
    RAISE EXCEPTION 'increment_amount must be greater than zero';
  END IF;

  RETURN QUERY
  UPDATE public.campaigns AS campaign
  SET
    current_amount = COALESCE(campaign.current_amount, 0) + increment_amount,
    status = CASE
      WHEN COALESCE(campaign.current_amount, 0) + increment_amount >= campaign.goal_amount
        THEN 'completed'
      ELSE campaign.status
    END,
    updated_at = now()
  WHERE campaign.id = campaign_id_input
  RETURNING
    campaign.id,
    campaign.current_amount,
    campaign.goal_amount,
    campaign.status::text;
END;
$$;

REVOKE ALL ON FUNCTION public.increment_campaign_amount(uuid, numeric) FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.increment_campaign_amount(uuid, numeric) TO service_role;

-- Service-role API handlers remain the only data plane for admin mutations.
REVOKE INSERT, UPDATE, DELETE ON TABLE public.content FROM anon;
GRANT INSERT ON TABLE public.messages TO anon, authenticated;
REVOKE SELECT, UPDATE, DELETE ON TABLE public.messages FROM anon;
DO $$
BEGIN
  IF to_regclass('public.campaigns') IS NOT NULL THEN
    REVOKE INSERT, UPDATE, DELETE ON TABLE public.campaigns FROM anon;
  END IF;
  IF to_regclass('public.notifications') IS NOT NULL THEN
    REVOKE ALL ON TABLE public.notifications FROM anon;
  END IF;
  IF to_regclass('public.partnership_team_members') IS NOT NULL THEN
    REVOKE INSERT, UPDATE, DELETE ON TABLE public.partnership_team_members FROM anon;
  END IF;
END;
$$;
