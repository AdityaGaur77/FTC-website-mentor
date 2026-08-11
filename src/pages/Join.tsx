import { Clock } from 'lucide-react'
import { ButtonLink, Eyebrow, Panel } from '../components/ui'

/**
 * Placeholder. The real form collects a peer/mentor application and routes it
 * to the review inboxes for manual approval — build notes still to come, so
 * nothing here writes to the database yet.
 *
 * Public on purpose: applying is how someone gets an account, so requiring one
 * first would be a closed loop.
 */
export default function Join() {
  return (
    <Panel hero className="px-5 py-16 text-center sm:px-8">
      <Eyebrow>Join the network</Eyebrow>
      <h1 className="mt-3 text-[28px] font-bold leading-tight sm:text-[36px]">
        Applications open soon.
      </h1>
      <p className="mx-auto mt-3 max-w-[52ch] text-[14px] leading-relaxed text-body">
        Peer and mentor accounts are reviewed by hand, so every team gets help from someone who has
        actually done the work. The application form is being finalised — check back shortly.
      </p>

      <p className="mt-6 inline-flex items-center gap-2 rounded-full border border-line-soft bg-surface-2 px-3.5 py-1.5 text-[12.5px] font-medium text-faint">
        <Clock size={13} />
        Coming soon
      </p>

      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <ButtonLink to="/mentors">Browse mentors</ButtonLink>
        <ButtonLink to="/requests" variant="secondary">
          See the assistance board
        </ButtonLink>
      </div>
    </Panel>
  )
}
