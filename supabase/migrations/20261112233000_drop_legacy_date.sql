-- Do NOT push/apply this migration to production until the new frontend is
-- deployed. The currently live app still writes applications.date.
-- Safe to apply on local `supabase db reset`.

ALTER TABLE public.applications DROP COLUMN date;
