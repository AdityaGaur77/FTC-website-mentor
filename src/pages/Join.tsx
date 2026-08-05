import { useState, type FormEvent } from 'react'
import { GraduationCap, Users } from 'lucide-react'
import { Button, Card, Chip, Eyebrow, Field, Panel, inputClass } from '../components/ui'

const ROLES = [
  {
    id: 'student',
    icon: GraduationCap,
    title: 'Student Peer / FTC Alum',
    body: 'Current competitors and alumni sharing hands-on experience with code, CAD, and strategy.',
  },
  {
    id: 'adult',
    icon: Users,
    title: 'Adult / Industry Mentor',
    body: 'Coaches, engineers, and professionals volunteering verified office hours to teams.',
  },
]

const SKILLS = ['Java', 'Onshape', 'ControlHub', 'Portfolio', 'FTCLib', 'Outreach', 'Electronics']

export default function Join() {
  const [role, setRole] = useState('student')
  const [skills, setSkills] = useState<string[]>(['Java'])
  const [sent, setSent] = useState(false)

  function toggleSkill(skill: string) {
    setSkills((current) =>
      current.includes(skill) ? current.filter((item) => item !== skill) : [...current, skill],
    )
  }

  return (
    <div className="space-y-6 animate-fade-up">
      <Panel hero className="px-5 py-9 sm:px-8 sm:py-10">
        <Eyebrow>Become a verified expert</Eyebrow>
        <h1 className="mt-3 max-w-[20ch] text-[28px] font-bold leading-[1.12] sm:text-[36px]">
          Join as a peer or mentor.
        </h1>
        <p className="mt-4 max-w-[60ch] text-[14px] leading-relaxed text-body">
          Tell us what you can help with. Every profile is reviewed for experience and FTC
          involvement before it appears in the directory.
        </p>
      </Panel>

      <div className="grid gap-4 md:grid-cols-2">
        {ROLES.map((option) => {
          const isActive = role === option.id
          return (
            <button key={option.id} type="button" onClick={() => setRole(option.id)} className="text-left">
              <Card
                className={
                  isActive
                    ? 'h-full border-accent/50 bg-raised/60 transition-colors'
                    : 'h-full card-hover'
                }
              >
                <span className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-line bg-raised text-accent">
                  <option.icon size={16} />
                </span>
                <h2 className="mt-4 text-[15px] font-bold text-white">{option.title}</h2>
                <p className="mt-2 text-[13.5px] leading-relaxed text-body">{option.body}</p>
              </Card>
            </button>
          )
        })}
      </div>

      <Card className="p-5 sm:p-6">
        {sent ? (
          <div>
            <h2 className="text-[16px] font-bold text-white">Application received.</h2>
            <p className="mt-2 max-w-[60ch] text-[13.5px] leading-relaxed text-body">
              We’ll review your experience and reach out by email. Verified profiles usually appear
              in the directory within a few days.
            </p>
          </div>
        ) : (
          <form
            className="max-w-2xl space-y-4"
            onSubmit={(event: FormEvent<HTMLFormElement>) => {
              event.preventDefault()
              // Wire this to your backend when one exists.
              setSent(true)
            }}
          >
            <h2 className="text-[16px] font-bold text-white">Your details</h2>

            <Field label="Full name">
              <input required placeholder="Jordan Kim" className={inputClass} />
            </Field>

            <Field label="Email">
              <input required type="email" placeholder="you@example.com" className={inputClass} />
            </Field>

            <Field
              label="FTC experience"
              hint="Team numbers, seasons competed, alumni status, or professional background."
            >
              <textarea
                required
                rows={4}
                placeholder="4 seasons with Team 16461, now studying mechanical engineering..."
                className={`${inputClass} resize-y`}
              />
            </Field>

            <div>
              <span className="mb-2 block text-[13px] font-medium text-white">
                Skills you can mentor
              </span>
              <div className="flex flex-wrap gap-2">
                {SKILLS.map((skill) => (
                  <Chip
                    key={skill}
                    active={skills.includes(skill)}
                    onClick={() => toggleSkill(skill)}
                  >
                    #{skill}
                  </Chip>
                ))}
              </div>
            </div>

            <p className="text-[12px] leading-relaxed text-faint">
              By applying you agree to the Youth Protection Policy: no one-on-one virtual sessions
              between a mentor and a single student.
            </p>

            <Button type="submit">Submit application</Button>
          </form>
        )}
      </Card>
    </div>
  )
}
