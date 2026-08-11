import { useEffect, useState, type FormEvent } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { AlertCircle, Mail, MailCheck } from 'lucide-react'
import { useAuth, type AccountType } from '../lib/auth'
import { Button, Card, Chip, Eyebrow, Field, Panel, inputClass } from '../components/ui'

type Mode = 'signin' | 'signup'

const ACCOUNT_TYPES: { id: AccountType; label: string }[] = [
  { id: 'team', label: 'Team Account' },
  { id: 'mentor', label: 'Peer / Mentor' },
]


export default function SignIn() {
  const { user, signIn, signUp, signInWithMagicLink, resetPassword, configured } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()

  const [mode, setMode] = useState<Mode>('signin')
  const [accountType, setAccountType] = useState<AccountType>('team')
  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const [busy, setBusy] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [notice, setNotice] = useState<string | null>(null)
  const [confirmSent, setConfirmSent] = useState(false)

  /** Where to land after a successful sign-in. */
  const from = (location.state as { from?: string } | null)?.from ?? '/dashboard'

  /**
   * This tab is parked on "check your inbox" while the confirmation link gets
   * opened in another one. supabase-js broadcasts the session between tabs, so
   * a user appearing here means confirmation succeeded elsewhere — move to the
   * homepage rather than leaving a stale form behind the user's back.
   *
   * Scoped to confirmSent so it can't race the explicit navigate() that a
   * normal sign-in already does.
   */
  useEffect(() => {
    if (confirmSent && user) navigate('/', { replace: true })
  }, [confirmSent, user, navigate])

  function switchMode(next: Mode) {
    setMode(next)
    setError(null)
    setNotice(null)
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setBusy(true)
    setError(null)
    setNotice(null)

    if (mode === 'signin') {
      const { error: signInError } = await signIn(email, password)
      setBusy(false)
      if (signInError) {
        setError(signInError)
        return
      }
      navigate(from, { replace: true })
      return
    }

    const { error: signUpError, needsEmailConfirmation } = await signUp({
      email,
      password,
      fullName,
      accountType,
    })
    setBusy(false)

    if (signUpError) {
      setError(signUpError)
      return
    }
    if (needsEmailConfirmation) {
      setConfirmSent(true)
      return
    }
    navigate(from, { replace: true })
  }

  async function handleMagicLink() {
    if (!email) {
      setError('Enter your email address first, then choose “Email me a sign-in link”.')
      return
    }
    setBusy(true)
    setError(null)
    setNotice(null)
    const { error: otpError } = await signInWithMagicLink(email, from)
    setBusy(false)
    if (otpError) setError(otpError)
    else setNotice(`Sign-in link sent to ${email}. Open it on this device to finish.`)
  }

  async function handleForgotPassword() {
    if (!email) {
      setError('Enter your email address first, then choose “Forgot password”.')
      return
    }
    setBusy(true)
    setError(null)
    const { error: resetError } = await resetPassword(email)
    setBusy(false)
    if (resetError) setError(resetError)
    else setNotice(`Password reset link sent to ${email}.`)
  }

  /* ------------------------------------------- Post-signup confirm screen */
  if (confirmSent) {
    return (
      <div className="mx-auto max-w-lg animate-fade-up">
        <Card className="p-6 text-center sm:p-8">
          <span className="mx-auto grid h-11 w-11 place-items-center rounded-xl border border-line bg-raised text-accent">
            <MailCheck size={20} />
          </span>
          <h1 className="mt-5 text-[20px] font-bold text-white">Confirm your email</h1>
          <p className="mx-auto mt-3 max-w-[44ch] text-[13.5px] leading-relaxed text-body">
            We sent a confirmation link to <span className="text-white">{email}</span>. Open it to
            activate your account, then come back and sign in.
          </p>
          <div className="mt-6 flex justify-center">
            <Button
              variant="secondary"
              onClick={() => {
                setConfirmSent(false)
                switchMode('signin')
              }}
            >
              Back to sign in
            </Button>
          </div>
        </Card>
      </div>
    )
  }

  const isSignUp = mode === 'signup'

  return (
    <div className="mx-auto max-w-lg space-y-6 animate-fade-up">
      <Panel hero className="px-5 py-8 sm:px-8">
        <Eyebrow>{isSignUp ? 'Create your account' : 'Welcome back'}</Eyebrow>
        <h1 className="mt-3 text-[26px] font-bold leading-[1.12] sm:text-[32px]">
          {isSignUp ? 'Join the Relay network.' : 'Sign in to Relay.'}
        </h1>
        <p className="mt-3 text-[13.5px] leading-relaxed text-body">
          {isSignUp
            ? 'One account for booking office hours, messaging experts, and tracking verified hours.'
            : 'Pick up your conversations, office hours, and verified volunteer records.'}
        </p>
      </Panel>

      <Card className="p-5 sm:p-6">
        {/* Mode switch */}
        <div className="flex flex-wrap gap-2" role="tablist" aria-label="Sign in or sign up">
          <Chip active={!isSignUp} onClick={() => switchMode('signin')} role="tab">
            Sign In
          </Chip>
          <Chip active={isSignUp} onClick={() => switchMode('signup')} role="tab">
            Create Account
          </Chip>
        </div>

        <form className="mt-5 space-y-4" onSubmit={handleSubmit}>
          {isSignUp && (
            <>
              <Field label="Full name">
                <input
                  required
                  value={fullName}
                  onChange={(event) => setFullName(event.target.value)}
                  placeholder="Jordan Kim"
                  autoComplete="name"
                  className={inputClass}
                />
              </Field>

              <div>
                <span className="mb-2 block text-[13px] font-medium text-white">Account type</span>
                <div className="flex flex-wrap gap-2">
                  {ACCOUNT_TYPES.map((option) => (
                    <Chip
                      key={option.id}
                      active={accountType === option.id}
                      onClick={() => setAccountType(option.id)}
                    >
                      {option.label}
                    </Chip>
                  ))}
                </div>
              </div>
            </>
          )}

          <Field label="Email">
            <input
              required
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="you@example.com"
              autoComplete="email"
              className={inputClass}
            />
          </Field>

          <Field
            label="Password"
            hint={isSignUp ? 'At least 6 characters.' : undefined}
          >
            <input
              required
              type="password"
              minLength={6}
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              placeholder="••••••••"
              autoComplete={isSignUp ? 'new-password' : 'current-password'}
              className={inputClass}
            />
          </Field>

          {error && (
            <p
              role="alert"
              className="flex items-start gap-2 rounded-lg border border-[#5c2a2a] bg-[#1d1013] px-3.5 py-3 text-[12.5px] leading-relaxed text-[#f4a9a9]"
            >
              <AlertCircle size={15} className="mt-px shrink-0" />
              <span>{error}</span>
            </p>
          )}

          {notice && (
            <p className="rounded-lg border border-accent/30 bg-[#0f2029] px-3.5 py-3 text-[12.5px] text-body">
              {notice}
            </p>
          )}

          <Button type="submit" className="w-full" disabled={busy}>
            {busy ? 'Working…' : isSignUp ? 'Create account' : 'Sign In'}
          </Button>
        </form>

        <div className="my-5 flex items-center gap-3" aria-hidden="true">
          <span className="h-px flex-1 bg-line-soft" />
          <span className="text-[11px] font-medium uppercase tracking-[0.1em] text-faint">or</span>
          <span className="h-px flex-1 bg-line-soft" />
        </div>

        {/* Passwordless. Uses the email already typed above, so it sits below. */}
        <Button variant="secondary" className="w-full" onClick={handleMagicLink} disabled={busy}>
          <Mail size={14} />
          Email me a sign-in link
        </Button>
        <p className="mt-2 text-center text-[11.5px] leading-relaxed text-faint">
          No password needed — we’ll send a one-click link to your inbox.
        </p>

        {!isSignUp && (
          <div className="mt-4 text-center">
            <button
              type="button"
              onClick={handleForgotPassword}
              disabled={busy}
              className="text-[12.5px] font-medium text-body transition-colors hover:text-accent disabled:opacity-50"
            >
              Forgot password?
            </button>
          </div>
        )}

        <p className="mt-5 border-t border-line-soft pt-4 text-[12.5px] text-body">
          {isSignUp ? 'Already have an account? ' : 'New here? '}
          <button
            type="button"
            onClick={() => switchMode(isSignUp ? 'signin' : 'signup')}
            className="font-semibold text-accent hover:text-accent-soft"
          >
            {isSignUp ? 'Sign in instead' : 'Create one'}
          </button>
          .
        </p>

        {!configured && (
          <p className="mt-4 rounded-lg border border-line bg-[#0a121d] px-3.5 py-3 text-[12px] leading-relaxed text-faint">
            Demo mode — Supabase isn’t connected, so these fields don’t authenticate yet. See the
            “Connecting Supabase” section of the README.
          </p>
        )}
      </Card>
    </div>
  )
}
