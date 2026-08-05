import { useState, type FormEvent } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { AlertCircle, MailCheck } from 'lucide-react'
import { useAuth, type AccountType } from '../lib/auth'
import { Button, Card, Chip, Eyebrow, Field, Panel, inputClass } from '../components/ui'

type Mode = 'signin' | 'signup'

const ACCOUNT_TYPES: { id: AccountType; label: string }[] = [
  { id: 'team', label: 'Team Account' },
  { id: 'mentor', label: 'Peer / Mentor' },
]

/** Google's four-colour mark. Their brand terms require the official logo. */
function GoogleMark() {
  return (
    <svg width="15" height="15" viewBox="0 0 48 48" aria-hidden="true">
      <path
        fill="#4285F4"
        d="M45.12 24.5c0-1.56-.14-3.06-.4-4.5H24v8.51h11.84c-.51 2.75-2.06 5.08-4.39 6.64v5.52h7.11c4.16-3.83 6.56-9.47 6.56-16.17z"
      />
      <path
        fill="#34A853"
        d="M24 46c5.94 0 10.92-1.97 14.56-5.33l-7.11-5.52c-1.97 1.32-4.49 2.1-7.45 2.1-5.73 0-10.58-3.87-12.31-9.07H4.34v5.7C7.96 41.07 15.4 46 24 46z"
      />
      <path
        fill="#FBBC05"
        d="M11.69 28.18C11.25 26.86 11 25.45 11 24s.25-2.86.69-4.18v-5.7H4.34C2.85 17.09 2 20.45 2 24s.85 6.91 2.34 9.88l7.35-5.7z"
      />
      <path
        fill="#EA4335"
        d="M24 10.75c3.23 0 6.13 1.11 8.41 3.29l6.31-6.31C34.91 4.18 29.93 2 24 2 15.4 2 7.96 6.93 4.34 14.12l7.35 5.7c1.73-5.2 6.58-9.07 12.31-9.07z"
      />
    </svg>
  )
}

export default function SignIn() {
  const { signIn, signUp, signInWithGoogle, resetPassword, configured } = useAuth()
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

  async function handleGoogle() {
    setBusy(true)
    setError(null)
    // On success the browser leaves for Google, so `busy` never resets here.
    const { error: oauthError } = await signInWithGoogle(from)
    if (oauthError) {
      setError(oauthError)
      setBusy(false)
    }
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

        {/* Google first — it's the fastest path and needs no password. */}
        <Button
          variant="secondary"
          className="mt-5 w-full"
          onClick={handleGoogle}
          disabled={busy}
        >
          <GoogleMark />
          Continue with Google
        </Button>

        <div className="my-5 flex items-center gap-3" aria-hidden="true">
          <span className="h-px flex-1 bg-line-soft" />
          <span className="text-[11px] font-medium uppercase tracking-[0.1em] text-faint">or</span>
          <span className="h-px flex-1 bg-line-soft" />
        </div>

        <form className="space-y-4" onSubmit={handleSubmit}>
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

        {!isSignUp && (
          <button
            type="button"
            onClick={handleForgotPassword}
            disabled={busy}
            className="mt-4 text-[12.5px] font-medium text-body transition-colors hover:text-accent disabled:opacity-50"
          >
            Forgot password?
          </button>
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
