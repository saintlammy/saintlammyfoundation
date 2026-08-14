-- Server-owned admin authorization. Never authorize from auth.users.raw_user_meta_data.
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
        AND COALESCE(status::text, ''active'') <> ''inactive''
    )'
  INTO allowed
  USING auth.uid();

  RETURN allowed;
END;
$$;

REVOKE ALL ON FUNCTION public.is_admin() FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.is_admin() TO authenticated;

-- Publish trusted roles into app_metadata so browser navigation can render the
-- correct authorized shell without trusting user-editable metadata.
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public' AND table_name = 'users' AND column_name = 'auth_user_id'
  ) THEN
    EXECUTE $migration$
      UPDATE auth.users AS auth_user
      SET raw_app_meta_data = COALESCE(auth_user.raw_app_meta_data, '{}'::jsonb)
        || jsonb_build_object('role', app_user.role)
      FROM public.users AS app_user
      WHERE app_user.auth_user_id = auth_user.id
        AND app_user.role IN ('admin', 'super_admin', 'moderator')
    $migration$;
  END IF;
END;
$$;

DO $$
DECLARE
  target record;
BEGIN
  FOR target IN
    SELECT * FROM (VALUES
      ('orphanage_homes', 'Authenticated users can manage all data'),
      ('orphans', 'Authenticated users can manage orphans'),
      ('widows', 'Authenticated users can manage widows'),
      ('donors', 'Authenticated users can manage donors'),
      ('donations', 'Authenticated users can manage donations'),
      ('users', 'Admins can manage all users'),
      ('adoptions', 'Authenticated users can manage adoptions'),
      ('programs', 'Authenticated users can manage programs'),
      ('volunteer_roles', 'Admins can manage volunteer roles')
    ) AS policies(table_name, policy_name)
  LOOP
    IF to_regclass(format('public.%I', target.table_name)) IS NOT NULL THEN
      EXECUTE format('DROP POLICY IF EXISTS %I ON public.%I', target.policy_name, target.table_name);
      EXECUTE format('DROP POLICY IF EXISTS %I ON public.%I', 'Verified admins can manage', target.table_name);
      EXECUTE format(
        'CREATE POLICY %I ON public.%I FOR ALL TO authenticated USING (public.is_admin()) WITH CHECK (public.is_admin())',
        'Verified admins can manage',
        target.table_name
      );
    END IF;
  END LOOP;
END;
$$;

DO $$
DECLARE
  table_name text;
  policy_name text;
BEGIN
  FOREACH table_name IN ARRAY ARRAY['content', 'outreach_reports', 'page_content']
  LOOP
    IF to_regclass(format('public.%I', table_name)) IS NOT NULL THEN
      FOREACH policy_name IN ARRAY ARRAY[
        'Allow authenticated users to insert content',
        'Allow authenticated users to update content',
        'Allow authenticated users to delete content',
        'Allow authenticated users to insert outreach reports',
        'Allow authenticated users to update outreach reports',
        'Allow authenticated users to delete outreach reports',
        'Allow authenticated insert',
        'Allow authenticated update',
        'Allow authenticated delete'
      ]
      LOOP
        EXECUTE format('DROP POLICY IF EXISTS %I ON public.%I', policy_name, table_name);
      END LOOP;

      EXECUTE format('DROP POLICY IF EXISTS %I ON public.%I', 'Verified admins can manage', table_name);
      EXECUTE format(
        'CREATE POLICY %I ON public.%I FOR ALL TO authenticated USING (public.is_admin()) WITH CHECK (public.is_admin())',
        'Verified admins can manage',
        table_name
      );
    END IF;
  END LOOP;
END;
$$;
