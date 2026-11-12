-- Phase 2: status history, harden applications, keep legacy date nullable for now.

-- ---------------------------------------------------------------------------
-- applications
-- ---------------------------------------------------------------------------

ALTER TABLE public.applications
  ADD CONSTRAINT applications_status_check
  CHECK (status IN ('Applied', 'Interview', 'Offer', 'Rejected'));

ALTER TABLE public.applications
  ALTER COLUMN user_id SET DEFAULT auth.uid();

ALTER TABLE public.applications
  ADD CONSTRAINT applications_user_id_fkey
  FOREIGN KEY (user_id) REFERENCES auth.users (id) ON DELETE CASCADE;

CREATE INDEX applications_user_id_created_at_idx
  ON public.applications (user_id, created_at DESC);

ALTER TABLE public.applications
  ALTER COLUMN date DROP NOT NULL;

DROP POLICY "Users can delete own applications" ON public.applications;
DROP POLICY "Users can insert own applications" ON public.applications;
DROP POLICY "Users can read own applications" ON public.applications;
DROP POLICY "Users can update own applications" ON public.applications;

CREATE POLICY "Users can delete own applications"
  ON public.applications
  FOR DELETE
  TO authenticated
  USING ((SELECT auth.uid()) = user_id);

CREATE POLICY "Users can insert own applications"
  ON public.applications
  FOR INSERT
  TO authenticated
  WITH CHECK ((SELECT auth.uid()) = user_id);

CREATE POLICY "Users can read own applications"
  ON public.applications
  FOR SELECT
  TO authenticated
  USING ((SELECT auth.uid()) = user_id);

CREATE POLICY "Users can update own applications"
  ON public.applications
  FOR UPDATE
  TO authenticated
  USING ((SELECT auth.uid()) = user_id)
  WITH CHECK ((SELECT auth.uid()) = user_id);

-- ---------------------------------------------------------------------------
-- application_events
-- ---------------------------------------------------------------------------

CREATE TABLE public.application_events (
  id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  application_id bigint NOT NULL REFERENCES public.applications (id) ON DELETE CASCADE,
  user_id uuid NOT NULL REFERENCES auth.users (id) ON DELETE CASCADE,
  status text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  timing_known boolean NOT NULL DEFAULT true,
  CONSTRAINT application_events_status_check
    CHECK (status IN ('Applied', 'Interview', 'Offer', 'Rejected'))
);

CREATE INDEX application_events_application_id_created_at_idx
  ON public.application_events (application_id, created_at);

CREATE INDEX application_events_user_id_created_at_idx
  ON public.application_events (user_id, created_at);

ALTER TABLE public.application_events ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own application events"
  ON public.application_events
  FOR SELECT
  TO authenticated
  USING ((SELECT auth.uid()) = user_id);

GRANT SELECT ON TABLE public.application_events TO authenticated;
GRANT ALL ON TABLE public.application_events TO service_role;

REVOKE INSERT, UPDATE, DELETE, TRUNCATE ON TABLE public.application_events
  FROM anon, authenticated;

-- ---------------------------------------------------------------------------
-- trigger
-- ---------------------------------------------------------------------------

CREATE OR REPLACE FUNCTION public.log_application_event()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    INSERT INTO public.application_events (
      application_id,
      user_id,
      status,
      created_at,
      timing_known
    )
    VALUES (
      NEW.id,
      NEW.user_id,
      'Applied',
      NEW.created_at,
      true
    );

    IF NEW.status IS DISTINCT FROM 'Applied' THEN
      INSERT INTO public.application_events (
        application_id,
        user_id,
        status,
        created_at,
        timing_known
      )
      VALUES (
        NEW.id,
        NEW.user_id,
        NEW.status,
        NEW.created_at,
        false
      );
    END IF;

    RETURN NEW;
  END IF;

  IF TG_OP = 'UPDATE' THEN
    IF OLD.status IS DISTINCT FROM NEW.status THEN
      INSERT INTO public.application_events (
        application_id,
        user_id,
        status,
        created_at,
        timing_known
      )
      VALUES (
        NEW.id,
        NEW.user_id,
        NEW.status,
        now(),
        true
      );
    END IF;

    RETURN NEW;
  END IF;

  RETURN NULL;
END;
$$;

CREATE TRIGGER applications_log_insert
  AFTER INSERT ON public.applications
  FOR EACH ROW
  EXECUTE FUNCTION public.log_application_event();

CREATE TRIGGER applications_log_status_update
  AFTER UPDATE OF status ON public.applications
  FOR EACH ROW
  WHEN (OLD.status IS DISTINCT FROM NEW.status)
  EXECUTE FUNCTION public.log_application_event();

REVOKE ALL ON FUNCTION public.log_application_event() FROM PUBLIC;
REVOKE ALL ON FUNCTION public.log_application_event() FROM anon, authenticated;

-- ---------------------------------------------------------------------------
-- backfill (safe on empty applications)
-- ---------------------------------------------------------------------------

INSERT INTO public.application_events (
  application_id,
  user_id,
  status,
  created_at,
  timing_known
)
SELECT
  a.id,
  a.user_id,
  'Applied',
  a.created_at,
  true
FROM public.applications AS a;

INSERT INTO public.application_events (
  application_id,
  user_id,
  status,
  created_at,
  timing_known
)
SELECT
  a.id,
  a.user_id,
  a.status,
  a.created_at,
  false
FROM public.applications AS a
WHERE a.status IS DISTINCT FROM 'Applied';
