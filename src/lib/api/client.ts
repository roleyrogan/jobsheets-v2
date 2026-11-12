import { createClient } from '@supabase/supabase-js'

import type { Database } from '@/types/database'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error(
    'Missing VITE_SUPABASE_URL or VITE_SUPABASE_ANON_KEY. Copy .env.example to .env and fill in both values.',
  )
}

// Capture before createClient — Supabase strips the hash during init.
export const initialAuthHash =
  typeof window !== 'undefined' ? window.location.hash : ''

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey)
