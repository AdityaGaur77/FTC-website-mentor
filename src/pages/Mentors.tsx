import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Search } from 'lucide-react'
import { MENTORS, SKILL_FILTERS, type Mentor } from '../data/content'
import { Avatar, Button, ButtonLink, Card, Chip, Eyebrow, Panel, inputClass } from '../components/ui'

/** `All` plus the audience filters, then the skill tags. */
const AUDIENCE = [
  { id: 'all', label: 'All' },
  { id: 'adult', label: 'Adult Mentors' },
  { id: 'student', label: 'Student Peers / Alumni' },
]

function matches(mentor: Mentor, query: string) {
  const haystack = [mentor.name, mentor.role, mentor.blurb, ...mentor.skills]
    .join(' ')
    .toLowerCase()
  return haystack.includes(query.trim().toLowerCase())
}

function MentorCard({ mentor, index }: { mentor: Mentor; index: number }) {
  const navigate = useNavigate()

  return (
    <Card interactive className="flex flex-col">
      <div className="flex items-start gap-3">
        <Avatar name={mentor.name} index={index} size={42} />
        <div className="min-w-0">
          <h3 className="text-[15px] font-bold text-white">{mentor.name}</h3>
          <p className="mt-0.5 text-[12px] font-medium text-accent">
            {mentor.role}
            {mentor.meta && <span className="text-body"> · {mentor.meta}</span>}
          </p>
        </div>
      </div>

      <p className="mt-4 text-[12.5px] text-body">{mentor.skills.join(' · ')}</p>
      <p className="mt-3 text-[13.5px] leading-relaxed text-body">{mentor.blurb}</p>

      <p className="mt-5 text-[13px] font-bold text-white">{mentor.hours}+ Hours Logged</p>

      <div className="mt-4 flex flex-col gap-2 sm:flex-row">
        <Button onClick={() => navigate('/messages')}>Message Expert</Button>
        <Button variant="secondary" onClick={() => navigate('/dashboard')}>
          Book Peer / Mentor
        </Button>
      </div>
    </Card>
  )
}

export default function Mentors() {
  const [query, setQuery] = useState('')
  const [audience, setAudience] = useState('all')
  const [skill, setSkill] = useState<string | null>(null)

  const results = useMemo(() => {
    return MENTORS.filter((mentor) => {
      if (audience !== 'all' && mentor.kind !== audience) return false
      if (skill && !mentor.skills.some((s) => s.replace(/\s/g, '') === skill)) return false
      return matches(mentor, query)
    })
  }, [query, audience, skill])

  return (
    <div className="space-y-6 animate-fade-up">
      <Panel hero className="px-5 py-9 sm:px-8 sm:py-10">
        <Eyebrow>Verified Peer + Mentor Directory</Eyebrow>
        <h1 className="mt-3 text-[28px] font-bold leading-[1.12] sm:text-[36px]">
          Find the next expert in your corner.
        </h1>

        <div className="mt-7 flex flex-col gap-3 sm:flex-row">
          <div className="relative flex-1">
            <Search
              size={15}
              className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-faint"
            />
            <input
              type="search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search peer or mentor names and skills..."
              aria-label="Search peers and mentors"
              className={`${inputClass} pl-9`}
            />
          </div>
          <ButtonLink to="/join">Join as a Peer / Mentor</ButtonLink>
        </div>

        <div className="mt-5 flex flex-wrap gap-2">
          {AUDIENCE.map((item) => (
            <Chip
              key={item.id}
              active={audience === item.id}
              onClick={() => setAudience(item.id)}
            >
              {item.label}
            </Chip>
          ))}
        </div>
        <div className="mt-2 flex flex-wrap gap-2">
          {SKILL_FILTERS.map((tag) => (
            <Chip
              key={tag}
              active={skill === tag}
              onClick={() => setSkill((current) => (current === tag ? null : tag))}
            >
              #{tag}
            </Chip>
          ))}
        </div>
      </Panel>

      {results.length > 0 ? (
        <div className="grid gap-4 md:grid-cols-2">
          {results.map((mentor, index) => (
            <MentorCard key={mentor.id} mentor={mentor} index={index} />
          ))}
        </div>
      ) : (
        <Card className="py-12 text-center">
          <p className="text-[14px] font-semibold text-white">No peers or mentors match yet.</p>
          <p className="mx-auto mt-2 max-w-[42ch] text-[13px] text-body">
            Try a different skill tag, or post on the Pitside Assistance Board so an expert can find
            your team instead.
          </p>
          <div className="mt-5 flex justify-center">
            <ButtonLink to="/requests" variant="secondary">
              Post a Request
            </ButtonLink>
          </div>
        </Card>
      )}
    </div>
  )
}
