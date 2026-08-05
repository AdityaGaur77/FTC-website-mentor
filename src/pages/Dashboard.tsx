import { useState } from 'react'
import { CalendarPlus, Download } from 'lucide-react'
import { AVAILABILITY, MENTOR_SESSIONS, TEAM_SESSIONS, type Session } from '../data/content'
import { Button, Card, Chip, Eyebrow, Panel } from '../components/ui'

type Tab = 'mentor' | 'team'

function SessionList({ sessions }: { sessions: Session[] }) {
  return (
    <ul className="mt-4 space-y-4">
      {sessions.map((session) => (
        <li key={session.id} className="border-b border-line-soft pb-4 last:border-0 last:pb-0">
          <p className="text-[13.5px] font-semibold text-white">
            {session.team} · {session.topic}
          </p>
          <p className="mt-1 text-[12.5px] text-body">{session.when}</p>
          <p className="mt-0.5 text-[12px] text-faint">
            CAD: {session.cad} · Code: {session.code}
          </p>
        </li>
      ))}
    </ul>
  )
}

export default function Dashboard() {
  const [tab, setTab] = useState<Tab>('mentor')
  const isMentor = tab === 'mentor'

  return (
    <div className="space-y-6 animate-fade-up">
      <Panel hero className="px-5 py-9 sm:px-8">
        <Eyebrow>Peer &amp; Mentor Hours Tracker</Eyebrow>
        <h1 className="mt-3 text-[28px] font-bold leading-[1.12] sm:text-[36px]">
          {isMentor ? 'Peer & Mentor Dashboard' : 'Team Dashboard'}
        </h1>
        <p className="mt-3 max-w-[62ch] text-[14px] leading-relaxed text-body">
          {isMentor
            ? 'Manage peer and mentor office hours, session context, and verified volunteer time in one place.'
            : 'Track your team’s booked sessions, shared build context, and open assistance requests in one place.'}
        </p>

        <div className="mt-6 flex flex-wrap gap-2">
          <Chip active={isMentor} onClick={() => setTab('mentor')}>
            Mentor Dashboard
          </Chip>
          <Chip active={!isMentor} onClick={() => setTab('team')}>
            Team Dashboard
          </Chip>
        </div>
      </Panel>

      <div className="grid gap-4 lg:grid-cols-2">
        {isMentor ? <AvailabilityCard /> : <RequestsCard />}

        <Card className="p-5 sm:p-6">
          <h2 className="text-[15px] font-bold text-white">Upcoming sessions</h2>
          <SessionList sessions={isMentor ? MENTOR_SESSIONS : TEAM_SESSIONS} />
        </Card>
      </div>

      <Card className="p-5 sm:p-6">
        <p className="font-display text-[30px] font-bold text-accent">{isMentor ? '72.5' : '18.0'}</p>
        <p className="mt-1 text-[14px] font-semibold text-white">
          {isMentor ? 'Peer & mentor hours logged' : 'Mentorship hours received'}
        </p>
        <p className="mt-2 text-[12.5px] text-body">
          2 sessions awaiting peer or mentor hour confirmation · 2-hour weekly service cap applies to
          every peer and mentor.
        </p>
        <div className="mt-5">
          <Button>
            <Download size={14} />
            Export official volunteer PDF certificate
          </Button>
        </div>
      </Card>
    </div>
  )
}

/** Mentor view: editable weekly office-hours slots. */
function AvailabilityCard() {
  const [slots, setSlots] = useState(AVAILABILITY)

  return (
    <Card className="p-5 sm:p-6">
      <h2 className="text-[15px] font-bold text-white">Office hours availability</h2>
      <p className="mt-1.5 text-[12.5px] text-body">July 2026 · click a slot to edit or remove it</p>

      <div className="mt-5 flex flex-wrap gap-6">
        {slots.map((slot) => (
          <button
            key={slot.id}
            type="button"
            onClick={() => setSlots((current) => current.filter((item) => item.id !== slot.id))}
            title="Remove this slot"
            className="group text-left"
          >
            <p className="text-[11px] font-bold tracking-[0.1em] text-accent">{slot.day}</p>
            <p className="mt-1 text-[13.5px] font-semibold text-white group-hover:text-accent">
              {slot.time}
            </p>
          </button>
        ))}
        {slots.length === 0 && (
          <p className="text-[13px] text-body">No slots yet — add your first below.</p>
        )}
      </div>

      <div className="mt-6">
        <Button
          onClick={() =>
            setSlots((current) => [
              ...current,
              { id: `s${current.length + 1}-${current.length}`, day: 'FRI', time: '5:30 PM' },
            ])
          }
        >
          <CalendarPlus size={14} />
          Create availability
        </Button>
      </div>
    </Card>
  )
}

/** Team view replacement for the availability card. */
function RequestsCard() {
  return (
    <Card className="p-5 sm:p-6">
      <h2 className="text-[15px] font-bold text-white">Your open requests</h2>
      <p className="mt-1.5 text-[12.5px] text-body">
        Posted to the Pitside Assistance Board · visible to every verified expert
      </p>

      <ul className="mt-5 space-y-4">
        <li className="border-b border-line-soft pb-4">
          <p className="text-[13.5px] font-semibold text-white">
            Odometry drift after long autonomous path
          </p>
          <p className="mt-1 text-[12.5px] text-urgent">Urgent · 3 mentor replies</p>
        </li>
        <li>
          <p className="text-[13.5px] font-semibold text-white">
            Control Hub wiring check before qualifier
          </p>
          <p className="mt-1 text-[12.5px] text-body">Open · 5 mentor replies</p>
        </li>
      </ul>
    </Card>
  )
}
