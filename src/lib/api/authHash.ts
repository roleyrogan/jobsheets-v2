/** Capture before any Supabase client init can strip the URL hash. */
export const initialAuthHash =
  typeof window !== 'undefined' ? window.location.hash : ''
