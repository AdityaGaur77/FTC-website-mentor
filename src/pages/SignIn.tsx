import { useState, type FormEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Button, Card, Chip, Eyebrow, Field, Panel, inputClass } from '../components/ui'

const ACCOUNT_TYPES = [
  { id: 'team', label: 'Team Account' },
  { id: 'mentor', label: 'Peer / Mentor' },
]

export default function SignIn() {
  const [type, setType] = useState('team')
  const navigate = useNavigate()

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    // No auth backend yet — drop the user on the dashboard.
    navigate('/dashboard')
  }

  return (
    <div className="mx-auto max-w-lg space-y-6 animate-fade-up">
      <Panel hero className="px-5 py-8 sm:px-8">
        <Eyebrow>Welcome back</Eyebrow>
        <h1 className="mt-3 text-[26px] font-bold leading-[1.12] sm:text-[32px]">
          Sign in to Relay.
        </h1>
        <p className="mt-3 text-[13.5px] leading-relaxed text-body">
          Pick up your conversations, office hours, and verified volunteer records.
        </p>
      </Panel>

      <Card className="p-5 sm:p-6">
        <div className="flex flex-wrap gap-2">
          {ACCOUNT_TYPES.map((option) => (
            <Chip key={option.id} active={type === option.id} onClick={() => setType(option.id)}>
              {option.label}
            </Chip>
          ))}
        </div>

        <form className="mt-5 space-y-4" onSubmit={handleSubmit}>
          <Field label="Email">
            <input required type="email" placeholder="you@example.com" className={inputClass} />
          </Field>
          <Field label="Password">
            <input required type="password" placeholder="••••••••" className={inputClass} />
          </Field>
          <Button type="submit" className="w-full">
            Sign In
          </Button>
        </form>

        <p className="mt-5 text-[12.5px] text-body">
          New here?{' '}
          <Link to="/join" className="font-semibold text-accent hover:text-accent-soft">
            Join as a peer or mentor
          </Link>
          .
        </p>
      </Card>
    </div>
  )
}
