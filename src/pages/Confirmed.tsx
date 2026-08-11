import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { CheckCircle2, AlertCircle } from 'lucide-react'
import { useAuth } from '../lib/auth'
import { ButtonLink } from '../components/ui'

/**
 * Where the confirmation email lands. Deliberately outside <Layout> — this is a
 * dead end you close, so nav and footer would only invite wandering.
 *
 * The tab that started the signup is still open and still showing "check your
 * inbox". It does not poll: supabase-js broadcasts the new session over a
 * BroadcastChannel, so signing in here wakes that tab up and it moves itself to
 * the homepage. Nothing here has to talk to it.
 */
export default function Confirmed() {
  const { user, loading } = useAuth()
  const [linkError, setLinkError] = useState<string | null>(null)

  /**
   * Whether the URL arrived carrying anything to verify. Captured once on mount
   * because supabase-js strips the token from the URL as soon as it reads it —
   * checked later, every visit would look like someone typing /confirmed by
   * hand, and we'd wait forever for a token that had already been consumed.
   */
  const [hadToken] = useState(
    () => /(access_token|error|[?&#]code=)/.test(window.location.hash + window.location.search),
  )

  useEffect(() => {
    // Supabase reports a bad link in the hash (#error=...) on the implicit flow
    // and in the query string (?error=...) on PKCE, so check both.
    const hash = new URLSearchParams(window.location.hash.replace(/^#/, ''))
    const query = new URLSearchParams(window.location.search)
    const code = hash.get('error_code') ?? query.get('error_code')
    const description = hash.get('error_description') ?? query.get('error_description')

    if (!code && !description) return
    setLinkError(
      code === 'otp_expired'
        ? 'That link has expired. Confirmation links are single-use and time limited.'
        : (description ?? 'That link could not be used.').replace(/\+/g, ' '),
    )
  }, [])

  // Landing here with no token and no session means the link was already used,
  // or someone navigated in directly. Say so instead of spinning.
  const stale = !loading && !user && !linkError && !hadToken
  const failed = Boolean(linkError) || stale
  const working = !failed && !user

  return (
    <main className="flex min-h-screen items-center justify-center px-5 py-12">
      <div className="w-full max-w-[26rem] text-center">
        <div className="mb-8 flex items-center justify-center gap-2">
          <span className="grid h-7 w-7 place-items-center rounded-lg bg-accent text-[13px] font-bold text-ink">
            R
          </span>
          <span className="text-[15px] font-bold tracking-tight">Relay for FTC</span>
        </div>

        {working ? (
          <p className="text-[14px] text-body">Confirming your email…</p>
        ) : failed ? (
          <>
            <AlertCircle size={40} className="mx-auto text-[#f4a9a9]" />
            <h1 className="mt-5 text-[24px] font-bold leading-tight">Link didn’t work</h1>
            <p className="mt-3 text-[14px] leading-relaxed text-body">
              {linkError ?? 'This link has already been used, or it was opened out of context.'}
            </p>
            <div className="mt-7">
              <ButtonLink to="/signin">Back to sign in</ButtonLink>
            </div>
          </>
        ) : (
          <>
            <CheckCircle2 size={40} className="mx-auto text-accent" />
            <h1 className="mt-5 text-[24px] font-bold leading-tight">Email confirmed</h1>
            <p className="mt-3 text-[14px] leading-relaxed text-body">
              You’re all set. Close this tab and go back to Relay for FTC — you’re already signed in
              over there.
            </p>
            <p className="mt-6 text-[12.5px] text-faint">
              Closed that tab?{' '}
              <Link to="/" className="font-medium text-accent hover:underline">
                Continue here instead
              </Link>
            </p>
          </>
        )}
      </div>
    </main>
  )
}
