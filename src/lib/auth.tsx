import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import type { Session, User } from '@supabase/supabase-js'
import { isSupabaseConfigured, supabase, type Profile } from './supabase'

export type AccountType = 'team' | 'mentor'

type SignUpArgs = {
  email: string
  password: string
  fullName: string
  accountType: AccountType
}

type Result = { error: string | null }

type AuthValue = {
  session: Session | null
  user: User | null
  profile: Profile | null
  /** Still restoring the session from storage on first paint. */
  loading: boolean
  /** False until the two env vars are set — the app runs in demo mode. */
  configured: boolean
  signIn: (email: string, password: string) => Promise<Result>
  signUp: (args: SignUpArgs) => Promise<Result & { needsEmailConfirmation: boolean }>
  signInWithGoogle: (redirectTo?: string) => Promise<Result>
  signInWithMagicLink: (email: string, redirectTo?: string) => Promise<Result>
  signOut: () => Promise<void>
  resetPassword: (email: string) => Promise<Result>
}

const AuthContext = createContext<AuthValue | null>(null)

const NOT_CONFIGURED =
  'Supabase is not connected yet. Add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY to .env.local, then restart the dev server.'

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null)
  const [profile, setProfile] = useState<Profile | null>(null)
  const [loading, setLoading] = useState(isSupabaseConfigured)

  // Restore any existing session, then follow every auth change.
  useEffect(() => {
    if (!supabase) return

    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session)
      setLoading(false)
    })

    const { data: listener } = supabase.auth.onAuthStateChange((_event, next) => {
      setSession(next)
      setLoading(false)
    })

    return () => listener.subscription.unsubscribe()
  }, [])

  // Keep the profile row in step with the signed-in user.
  useEffect(() => {
    const userId = session?.user.id
    if (!supabase || !userId) {
      setProfile(null)
      return
    }

    let cancelled = false
    supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .maybeSingle()
      .then(({ data }) => {
        if (!cancelled) setProfile((data as Profile) ?? null)
      })

    return () => {
      cancelled = true
    }
  }, [session?.user.id])

  const signIn = useCallback(async (email: string, password: string): Promise<Result> => {
    if (!supabase) return { error: NOT_CONFIGURED }
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    return { error: error?.message ?? null }
  }, [])

  const signUp = useCallback(async ({ email, password, fullName, accountType }: SignUpArgs) => {
    if (!supabase) return { error: NOT_CONFIGURED, needsEmailConfirmation: false }

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        // Read by the handle_new_user() trigger to populate public.profiles.
        data: { full_name: fullName, account_type: accountType },
        emailRedirectTo: `${window.location.origin}/signin`,
      },
    })

    if (error) return { error: error.message, needsEmailConfirmation: false }

    // Supabase hides whether an email is already taken, so nobody can probe the
    // site to discover who has an account. Rather than erroring, it resolves
    // with a decoy user whose identities array is empty — which otherwise lands
    // on the "check your email" branch below and waits for mail that never
    // sends. Reading the decoy trades a little of that privacy for a form that
    // tells the truth.
    //
    // identities is absent, not empty, on some configurations; treat that as
    // unknown and fall through instead of guessing.
    const identities = data.user?.identities
    if (data.user && Array.isArray(identities) && identities.length === 0) {
      return {
        error:
          'An account with this email already exists. Use “Email me a sign-in link” below, or switch to Sign In if you set a password.',
        needsEmailConfirmation: false,
      }
    }

    // With "Confirm email" on, signUp returns a user but no session.
    return { error: null, needsEmailConfirmation: Boolean(data.user) && !data.session }
  }, [])

  /**
   * Hands off to Google and comes back to `redirectTo`. The session is read
   * out of the callback URL by detectSessionInUrl in supabase.ts, so there is
   * nothing to await here — the browser navigates away.
   *
   * NOTE: no button calls this today — Google sign-in was dropped in favour of
   * magic links. Kept because it's the whole client-side cost of adding Google
   * back: render a button that calls it, enable the provider in Supabase, and
   * paste in a Client ID + Secret from Google Cloud Console.
   */
  const signInWithGoogle = useCallback(async (redirectTo = '/dashboard'): Promise<Result> => {
    if (!supabase) return { error: NOT_CONFIGURED }
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}${redirectTo}`,
        queryParams: { access_type: 'offline', prompt: 'consent' },
      },
    })
    return { error: error?.message ?? null }
  }, [])

  /**
   * Passwordless: emails a one-click sign-in link. Needs no external console,
   * and doubles as signup — shouldCreateUser makes an account on first use.
   *
   * Heads up: Supabase's built-in mail server is rate limited to a handful of
   * messages per hour and is meant for testing. Configure custom SMTP under
   * Project Settings -> Authentication before real teams rely on this.
   */
  const signInWithMagicLink = useCallback(
    async (email: string, redirectTo = '/dashboard'): Promise<Result> => {
      if (!supabase) return { error: NOT_CONFIGURED }
      const { error } = await supabase.auth.signInWithOtp({
        email,
        options: {
          emailRedirectTo: `${window.location.origin}${redirectTo}`,
          shouldCreateUser: true,
        },
      })
      return { error: error?.message ?? null }
    },
    [],
  )

  const signOut = useCallback(async () => {
    await supabase?.auth.signOut()
    setSession(null)
    setProfile(null)
  }, [])

  const resetPassword = useCallback(async (email: string): Promise<Result> => {
    if (!supabase) return { error: NOT_CONFIGURED }
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/signin`,
    })
    return { error: error?.message ?? null }
  }, [])

  const value = useMemo<AuthValue>(
    () => ({
      session,
      user: session?.user ?? null,
      profile,
      loading,
      configured: isSupabaseConfigured,
      signIn,
      signUp,
      signInWithGoogle,
      signInWithMagicLink,
      signOut,
      resetPassword,
    }),
    [
      session,
      profile,
      loading,
      signIn,
      signUp,
      signInWithGoogle,
      signInWithMagicLink,
      signOut,
      resetPassword,
    ],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const value = useContext(AuthContext)
  if (!value) throw new Error('useAuth must be used inside <AuthProvider>')
  return value
}

/** Best available display name for the signed-in user. */
export function displayName(user: User | null, profile: Profile | null) {
  return (
    profile?.full_name ||
    (user?.user_metadata?.full_name as string | undefined) ||
    (user?.user_metadata?.name as string | undefined) ||
    user?.email?.split('@')[0] ||
    'Account'
  )
}

/**
 * Google photo if we have one. Reads user_metadata as well as the profile row,
 * so the picture shows on the very first paint after an OAuth redirect —
 * before the profiles query has come back.
 */
export function avatarUrl(user: User | null, profile: Profile | null) {
  return (
    profile?.avatar_url ||
    (user?.user_metadata?.avatar_url as string | undefined) ||
    (user?.user_metadata?.picture as string | undefined) ||
    undefined
  )
}
