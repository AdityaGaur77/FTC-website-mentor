import { useState } from 'react'
import { ShieldCheck, Video } from 'lucide-react'
import { CONVERSATIONS } from '../data/content'
import { Avatar, Button, Card, cx } from '../components/ui'

const SHARE_ACTIONS = ['Share GitHub', 'Share Onshape CAD', 'Share Google Drive']

export default function Messages() {
  const [activeId, setActiveId] = useState(CONVERSATIONS[0].id)
  const active = CONVERSATIONS.find((item) => item.id === activeId) ?? CONVERSATIONS[0]

  return (
    <div className="grid gap-4 animate-fade-up lg:grid-cols-[300px_minmax(0,1fr)]">
      {/* ------------------------------------------- Conversation switcher */}
      <Card className="h-fit p-4">
        <h2 className="px-1 text-[14px] font-bold text-white">Active conversations</h2>
        <ul className="mt-3 space-y-1.5">
          {CONVERSATIONS.map((conversation) => {
            const isActive = conversation.id === activeId
            return (
              <li key={conversation.id}>
                <button
                  type="button"
                  onClick={() => setActiveId(conversation.id)}
                  aria-current={isActive ? 'true' : undefined}
                  className={cx(
                    'w-full rounded-lg border px-3 py-3 text-left transition-colors duration-200',
                    isActive
                      ? 'border-accent/40 bg-raised'
                      : 'border-transparent hover:border-line hover:bg-raised/50',
                  )}
                >
                  <p className="text-[13px] font-semibold text-white">
                    {conversation.team} × {conversation.mentor}
                  </p>
                  <p className="mt-1 text-[11.5px] font-medium text-accent">{conversation.kind}</p>
                  <p className="mt-0.5 text-[11.5px] text-body">{conversation.topic}</p>
                </button>
              </li>
            )
          })}
        </ul>
      </Card>

      {/* -------------------------------------------------- Active thread */}
      <Card className="p-5 sm:p-6">
        <h1 className="text-[19px] font-bold leading-snug text-white sm:text-[22px]">
          {active.headline}
        </h1>
        <p className="mt-1.5 text-[13px] text-body">{active.subhead}</p>

        <div className="mt-5 flex flex-col gap-2 sm:flex-row">
          <Button>
            <Video size={14} />
            Generate Google Meet Link
          </Button>
          <Button variant="secondary">Hours sign-off · 2h cap</Button>
        </div>

        <p className="mt-5 flex items-start gap-2 rounded-lg border border-line bg-[#0a121d] px-3.5 py-3 text-[12.5px] text-body">
          <ShieldCheck size={15} className="mt-px shrink-0 text-accent" />
          <span>
            <span className="font-semibold text-white">Safety Reminder:</span> At least 2 team
            members or an adult coach must be present on all calls.
          </span>
        </p>

        <div className="mt-5 space-y-3">
          {active.messages.map((message) => (
            <div
              key={message.id}
              className={cx(
                'rounded-lg border px-4 py-3.5',
                message.fromMentor
                  ? 'border-accent/25 bg-[#0f2029]'
                  : 'border-line bg-[#0a121d]',
              )}
            >
              <div className="flex items-center gap-2">
                {message.fromMentor && <Avatar name={message.author} size={22} />}
                <p
                  className={cx(
                    'text-[12px] font-semibold',
                    message.fromMentor ? 'text-accent' : 'text-white',
                  )}
                >
                  {message.author}
                  {message.role && <span className="text-body"> · {message.role}</span>}
                </p>
              </div>
              <p className="mt-2 text-[13.5px] leading-relaxed text-body">{message.body}</p>
            </div>
          ))}
        </div>

        <div className="mt-5 flex flex-wrap gap-2">
          {SHARE_ACTIONS.map((action) => (
            <Button key={action} variant="secondary" size="sm">
              {action}
            </Button>
          ))}
        </div>
      </Card>
    </div>
  )
}
