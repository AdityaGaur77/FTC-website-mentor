import { createClient, type SupabaseClient } from '@supabase/supabase-js'

const url = import.meta.env.VITE_SUPABASE_URL
const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

/**
 * True once both env vars are present in `.env.local`.
 * Until then the app runs in demo mode: pages still work, auth is a no-op.
 * That way a fresh `git clone && npm run dev` never crashes on a missing key.
 */
export const isSupabaseConfigured = Boolean(url && anonKey)

export const supabase: SupabaseClient | null = isSupabaseConfigured
  ? createClient(url, anonKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true,
      },
    })
  : null

/** Profile row created automatically by the on_auth_user_created trigger. */
export type Profile = {
  id: string
  full_name: string | null
  /** Google supplies a real photo here; null for email signups. */
  avatar_url: string | null
  account_type: 'team' | 'mentor'
  team_number: string | null
  created_at: string
}
