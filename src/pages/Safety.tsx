import { useState, type FormEvent } from 'react'
import { BadgeCheck, HeartHandshake, ShieldCheck } from 'lucide-react'
import { Button, Card, Eyebrow, Field, IconTile, Panel, inputClass } from '../components/ui'

const POLICIES = [
  {
    id: 'youth-protection',
    icon: ShieldCheck,
    title: 'Youth Protection Policy',
    body: 'Virtual calls booked through office hours or direct messages must always include two adults or multiple students. Never schedule a one-on-one call between a mentor and a student.',
    callout: 'Required: visible multi-participant presence for every virtual session.',
  },
  {
    id: 'quality',
    icon: BadgeCheck,
    title: 'Quality & Integrity',
    body: 'Mentor skills are reviewed through experience, FTC involvement, and profile checks. Volunteer hours are verified by the supported team before they count toward official records.',
    callout: 'False hours or misrepresented experience may result in account suspension and certificate removal.',
  },
]

const CONDUCT_LINKS = ['Respect people', 'Stay constructive', 'Protect privacy']

export default function Safety() {
  const [sent, setSent] = useState(false)

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    // Wire this to your backend / form service when one exists.
    setSent(true)
  }

  return (
    <div className="space-y-6 animate-fade-up">
      <Panel hero className="px-5 py-9 sm:px-8 sm:py-10">
        <Eyebrow>Safety &amp; Guidelines</Eyebrow>
        <h1 className="mt-3 max-w-[20ch] text-[28px] font-bold leading-[1.12] sm:text-[36px]">
          A trusted space to build, learn, and ask for help.
        </h1>
        <p className="mt-4 max-w-[62ch] text-[14px] leading-relaxed text-body">
          Relay for FTC is built around safe, constructive collaboration. These guidelines apply to
          every office hour, direct message, and community interaction.
        </p>
      </Panel>

      <div className="grid gap-4 md:grid-cols-2">
        {POLICIES.map((policy) => (
          <Card key={policy.id} id={policy.id} interactive className="scroll-mt-20 p-5 sm:p-6">
            <IconTile>
              <policy.icon size={16} />
            </IconTile>
            <h2 className="mt-4 text-[16px] font-bold text-white">{policy.title}</h2>
            <p className="mt-2.5 text-[13.5px] leading-relaxed text-body">{policy.body}</p>
            <p className="mt-4 text-[12.5px] font-semibold leading-relaxed text-accent">
              {policy.callout}
            </p>
          </Card>
        ))}
      </div>

      <Card className="p-5 sm:p-6">
        <IconTile>
          <HeartHandshake size={16} />
        </IconTile>
        <h2 className="mt-4 text-[16px] font-bold text-white">Code of Conduct</h2>
        <p className="mt-2.5 max-w-[78ch] text-[13.5px] leading-relaxed text-body">
          We practice Gracious Professionalism&reg;: compete hard, help freely, and treat every
          person with respect. Keep feedback specific and constructive, protect private information,
          and make room for learners of every experience level.
        </p>
        <div className="mt-4 flex flex-wrap gap-5">
          {CONDUCT_LINKS.map((link) => (
            <span key={link} className="text-[12.5px] font-semibold text-accent">
              {link}
            </span>
          ))}
        </div>
      </Card>

      {/* ---------------------------------------------------------- Speak up */}
      <Panel id="speak-up" className="scroll-mt-20 px-5 py-8 sm:px-8">
        <Eyebrow>Speak up</Eyebrow>
        <h2 className="mt-3 text-[24px] font-bold leading-tight sm:text-[30px]">
          Report a safety issue or send feedback.
        </h2>
        <p className="mt-3 max-w-[70ch] text-[13.5px] leading-relaxed text-body">
          Share a concern directly with the platform creators. Please include enough context for us
          to respond; urgent concerns should be reported to a trusted adult immediately.
        </p>

        {sent ? (
          <div className="mt-6 rounded-lg border border-accent/30 bg-[#0f2029] px-4 py-4">
            <p className="text-[13.5px] font-semibold text-white">Thanks — your note is queued.</p>
            <p className="mt-1 text-[13px] text-body">
              A platform creator will follow up at the email you provided.
            </p>
          </div>
        ) : (
          <form className="mt-6 max-w-2xl space-y-4" onSubmit={handleSubmit}>
            <Field label="Your email">
              <input
                type="email"
                required
                placeholder="you@example.com"
                className={inputClass}
              />
            </Field>
            <Field label="Feedback or safety concern">
              <textarea
                required
                rows={5}
                placeholder="Tell us what happened or how we can improve..."
                className={`${inputClass} resize-y`}
              />
            </Field>
            <Button type="submit">Send to platform creators</Button>
          </form>
        )}
      </Panel>
    </div>
  )
}
