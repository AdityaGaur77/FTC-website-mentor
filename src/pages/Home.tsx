import { Bot, CalendarCheck, FileCheck2, MessageSquare, Search, Video } from 'lucide-react'
import { ButtonLink, Card, Eyebrow, IconTile, Panel, SectionHead } from '../components/ui'

const STATS = [
  { value: '50+', label: 'Active Peer & Mentor Experts' },
  { value: '200+', label: 'Hours Volunteered' },
  { value: '100+', label: 'Teams Assisted' },
]

const STEPS = [
  { icon: Search, title: 'Search expertise or book office hours' },
  { icon: Video, title: 'Chat and meet via Google Meet' },
  { icon: CalendarCheck, title: 'Log and verify hours' },
]

const FEATURES = [
  {
    icon: MessageSquare,
    title: 'Direct Messaging',
    body: 'Keep questions, context, and next steps in one focused conversation.',
  },
  {
    icon: CalendarCheck,
    title: 'Office Hours Booking',
    body: 'Reserve time with a vetted student peer, alum, or adult mentor when your team is ready to work through the details.',
  },
  {
    icon: Video,
    title: 'Instant Google Meet Creation',
    body: 'Move from a message to a shared screen without losing momentum.',
  },
  {
    icon: FileCheck2,
    title: 'Official PDF Volunteer Certificates',
    body: 'Capture verified contributions with shareable records for school and service requirements.',
  },
]

export default function Home() {
  return (
    <div className="space-y-6 animate-fade-up">
      {/* ------------------------------------------------------------ Hero */}
      <Panel hero className="px-5 py-10 sm:px-10 sm:py-14">
        <span className="inline-flex text-accent">
          <Bot size={20} />
        </span>
        <div className="mt-6">
          <Eyebrow>FTC Peer + Mentor Network</Eyebrow>
        </div>
        <h1 className="mt-4 max-w-[18ch] text-[30px] font-bold leading-[1.1] sm:text-[40px]">
          Connect with Veteran Mentors &amp; Student Peer Experts On-Demand
        </h1>
        <p className="mt-4 max-w-[52ch] text-[14px] leading-relaxed text-body">
          Get fast help with Java, Onshape CAD, Road Runner, and portfolio reviews from experienced
          student peers, FTC alumni, and adult mentors.
        </p>
        <div className="mt-7 flex flex-col gap-3 sm:flex-row">
          <ButtonLink to="/mentors">Find a Peer or Mentor</ButtonLink>
          <ButtonLink to="/join" variant="secondary">
            Join as a Peer / Mentor
          </ButtonLink>
        </div>
      </Panel>

      {/* ----------------------------------------------------------- Stats */}
      <Panel className="grid grid-cols-1 divide-y divide-line-soft sm:grid-cols-3 sm:divide-x sm:divide-y-0">
        {STATS.map((stat) => (
          <div key={stat.label} className="px-6 py-6">
            <p className="font-display text-[28px] font-bold text-accent">{stat.value}</p>
            <p className="mt-1 text-[12.5px] font-medium text-body">{stat.label}</p>
          </div>
        ))}
      </Panel>

      {/* --------------------------------------------------- How it works */}
      <section className="pt-6">
        <SectionHead
          eyebrow="How it works"
          title="A clear path from question to progress."
        />
        <div className="mt-7 grid gap-4 md:grid-cols-3">
          {STEPS.map((step, index) => (
            <Card key={step.title} interactive className="min-h-[150px]">
              <IconTile>
                <step.icon size={16} />
              </IconTile>
              <p className="mt-5 text-[11.5px] font-semibold tracking-[0.08em] text-faint">
                {String(index + 1).padStart(2, '0')}
              </p>
              <h3 className="mt-2 text-[15px] font-bold leading-snug text-white">{step.title}</h3>
            </Card>
          ))}
        </div>
      </section>

      {/* -------------------------------------------------------- Features */}
      <Panel className="mt-8 px-5 py-10 sm:px-8">
        <SectionHead
          eyebrow="Built for peer-powered support"
          title="Everything the conversation needs."
        />
        <div className="mt-7 grid gap-4 md:grid-cols-2">
          {FEATURES.map((feature) => (
            <Card key={feature.title} interactive>
              <IconTile>
                <feature.icon size={16} />
              </IconTile>
              <h3 className="mt-4 text-[15px] font-bold text-white">{feature.title}</h3>
              <p className="mt-2 text-[13.5px] leading-relaxed text-body">{feature.body}</p>
            </Card>
          ))}
        </div>
      </Panel>
    </div>
  )
}
