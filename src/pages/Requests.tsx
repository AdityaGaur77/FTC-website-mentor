import { useMemo, useState } from 'react'
import { REQUESTS, REQUEST_FILTERS, type HelpRequest } from '../data/content'
import { Button, Card, Chip, Eyebrow, Panel } from '../components/ui'

function StatusRow({ statuses }: { statuses: HelpRequest['statuses'] }) {
  return (
    <p className="text-[12px] font-medium">
      {statuses.map((status, index) => (
        <span key={status}>
          {index > 0 && <span className="text-faint"> · </span>}
          <span className={status === 'Urgent' ? 'text-urgent' : 'text-body'}>{status}</span>
        </span>
      ))}
    </p>
  )
}

function RequestCard({ request }: { request: HelpRequest }) {
  return (
    <Card interactive>
      <div className="flex items-start justify-between gap-4">
        <p className="text-[12px] font-semibold text-accent">{request.team}</p>
        <StatusRow statuses={request.statuses} />
      </div>

      <h3 className="mt-3 text-[17px] font-bold leading-snug text-white">{request.title}</h3>
      <p className="mt-2 text-[13.5px] leading-relaxed text-body">{request.body}</p>

      <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
        <p className="text-[12px] text-faint">
          {request.tags.map((tag) => `#${tag}`).join(' ')}
        </p>
        <p className="text-[12px] font-medium text-accent">
          {request.replies} mentor {request.replies === 1 ? 'reply' : 'replies'}
        </p>
      </div>
    </Card>
  )
}

export default function Requests() {
  const [filter, setFilter] = useState<string | null>(null)

  const results = useMemo(() => {
    if (!filter) return REQUESTS
    return REQUESTS.filter(
      (request) =>
        request.tags.includes(filter) || request.statuses.includes(filter as never),
    )
  }, [filter])

  return (
    <div className="space-y-6 animate-fade-up">
      <Panel hero className="px-5 py-8 sm:px-8">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <Eyebrow>Team-to-team support</Eyebrow>
            <h1 className="mt-3 text-[28px] font-bold leading-[1.12] sm:text-[36px]">
              Pitside Assistance Board
            </h1>
          </div>
          <Button className="self-start sm:self-auto">Post a Request</Button>
        </div>
      </Panel>

      <div className="flex flex-wrap gap-2">
        {REQUEST_FILTERS.map((tag) => (
          <Chip
            key={tag}
            active={filter === tag}
            onClick={() => setFilter((current) => (current === tag ? null : tag))}
          >
            {tag === 'Urgent' || tag === 'Unsolved' ? tag : `#${tag}`}
          </Chip>
        ))}
      </div>

      {results.length > 0 ? (
        <div className="space-y-4">
          {results.map((request) => (
            <RequestCard key={request.id} request={request} />
          ))}
        </div>
      ) : (
        <Card className="py-12 text-center">
          <p className="text-[14px] font-semibold text-white">Nothing on the board here yet.</p>
          <p className="mx-auto mt-2 max-w-[42ch] text-[13px] text-body">
            Clear the filter to see every open request from teams around the community.
          </p>
          <div className="mt-5 flex justify-center">
            <Button variant="secondary" onClick={() => setFilter(null)}>
              Clear filter
            </Button>
          </div>
        </Card>
      )}
    </div>
  )
}
