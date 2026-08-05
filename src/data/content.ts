/**
 * All demo content for the app lives here so pages stay presentational.
 * Swap these arrays for API calls when a backend exists — the component
 * layer won't need to change.
 */

export type MentorKind = 'adult' | 'student'

export type Mentor = {
  id: string
  name: string
  role: string
  kind: MentorKind
  meta?: string
  skills: string[]
  blurb: string
  hours: number
}

export const MENTORS: Mentor[] = [
  {
    id: 'maya-patel',
    name: 'Maya Patel',
    role: 'FTC Alumni / College Mentor',
    kind: 'student',
    skills: ['Java', 'Road Runner', 'Control Hub'],
    blurb:
      'FTC alum focused on reliable autonomous paths and practical Java debugging.',
    hours: 88,
  },
  {
    id: 'jordan-kim',
    name: 'Jordan Kim',
    role: 'Industry / Adult Mentor',
    kind: 'adult',
    skills: ['Onshape', 'Mechanisms', 'Portfolio'],
    blurb: 'CAD specialist who helps teams take ideas from sketch to field-ready assemblies.',
    hours: 54,
  },
  {
    id: 'ava-reynolds',
    name: 'Ava Reynolds',
    role: 'Student Peer Expert',
    kind: 'student',
    meta: 'Senior Lead · 4 Years FTC Experience',
    skills: ['Portfolio', 'Outreach', 'FTCLib'],
    blurb: 'Strategy mentor for portfolios, outreach, judged awards, and team storytelling.',
    hours: 50,
  },
  {
    id: 'noah-williams',
    name: 'Noah Williams',
    role: 'FTC Alumni / College Mentor',
    kind: 'student',
    skills: ['Control Hub', 'Electronics', 'Strategy'],
    blurb: 'Build mentor for drivetrain iterations, electrical cleanup, and match-ready troubleshooting.',
    hours: 72,
  },
]

/** Skill tags surfaced as quick filters on the directory page. */
export const SKILL_FILTERS = ['Java', 'Onshape', 'ControlHub', 'Portfolio', 'FTCLib']

/* ---------------------------------------------------------------- Requests */

export type RequestStatus = 'Urgent' | 'Unsolved' | 'Open'

export type HelpRequest = {
  id: string
  team: string
  title: string
  body: string
  tags: string[]
  statuses: RequestStatus[]
  replies: number
}

export const REQUESTS: HelpRequest[] = [
  {
    id: 'r-16461',
    team: 'Team 16461',
    title: 'Odometry drift after long autonomous path',
    body: 'Our Road Runner pose begins to drift after the second spline. We’ve recalibrated encoders but need another set of eyes.',
    tags: ['Odometry', 'Java', 'Urgent'],
    statuses: ['Urgent', 'Unsolved'],
    replies: 3,
  },
  {
    id: 'r-9072',
    team: 'Team 9072',
    title: 'Slide mechanism binding near full extension',
    body: 'The lift runs smoothly until the final third of travel. We’re looking for help diagnosing alignment versus spool tension.',
    tags: ['Mechanics', 'Build'],
    statuses: ['Unsolved'],
    replies: 1,
  },
  {
    id: 'r-18722',
    team: 'Team 18722',
    title: 'Control Hub wiring check before qualifier',
    body: 'We’re preparing for our first qualifier and want a second review of our power distribution and cable routing.',
    tags: ['Wiring', 'ControlHub'],
    statuses: ['Open'],
    replies: 5,
  },
]

export const REQUEST_FILTERS = ['Urgent', 'Unsolved', 'Odometry', 'Mechanics', 'Wiring']

/* ---------------------------------------------------------------- Messages */

export type ChatMessage = {
  id: string
  author: string
  role?: string
  fromMentor: boolean
  body: string
}

export type Conversation = {
  id: string
  team: string
  mentor: string
  kind: 'Booked Office Hours Slot' | 'Direct Message'
  topic: string
  headline: string
  subhead: string
  messages: ChatMessage[]
}

export const CONVERSATIONS: Conversation[] = [
  {
    id: 'c-16461',
    team: 'Team 16461',
    mentor: 'Maya Patel',
    kind: 'Booked Office Hours Slot',
    topic: 'Autonomous review',
    headline: 'Team 16461 × Maya Patel · Alumni Mentor',
    subhead: 'Booked peer / mentor office hours · Road Runner autonomous review',
    messages: [
      {
        id: 'm1',
        author: 'Maya Patel',
        role: 'FTC Alumni / College Mentor',
        fromMentor: true,
        body: 'I can take a look at the spline sequence. Can you share the current path code and your last pose estimate?',
      },
      {
        id: 'm2',
        author: 'Team 16461',
        fromMentor: false,
        body: 'Absolutely — we’ll send the GitHub branch and the dashboard recording before the session.',
      },
    ],
  },
  {
    id: 'c-9072',
    team: 'Team 9072',
    mentor: 'Jordan Kim',
    kind: 'Direct Message',
    topic: 'Mechanism troubleshooting',
    headline: 'Team 9072 × Jordan Kim · Industry Mentor',
    subhead: 'Direct message · Linear slide binding diagnosis',
    messages: [
      {
        id: 'm1',
        author: 'Jordan Kim',
        role: 'Industry / Adult Mentor',
        fromMentor: true,
        body: 'Binding in the last third usually points at rail alignment rather than spool tension. Can you send the CAD assembly?',
      },
      {
        id: 'm2',
        author: 'Team 9072',
        fromMentor: false,
        body: 'Sharing the Onshape link now. We measured 1.5mm of deflection at full extension.',
      },
    ],
  },
  {
    id: 'c-18722',
    team: 'Team 18722',
    mentor: 'Ava Reynolds',
    kind: 'Direct Message',
    topic: 'Portfolio feedback',
    headline: 'Team 18722 × Ava Reynolds · Student Peer Expert',
    subhead: 'Direct message · Engineering portfolio review before the qualifier',
    messages: [
      {
        id: 'm1',
        author: 'Ava Reynolds',
        role: 'Student Peer Expert',
        fromMentor: true,
        body: 'Your iteration section is strong. Judges will want the decision criteria next to each design you rejected.',
      },
      {
        id: 'm2',
        author: 'Team 18722',
        fromMentor: false,
        body: 'That makes sense. We’ll add a short trade-off table to the drivetrain pages tonight.',
      },
    ],
  },
]

/* --------------------------------------------------------------- Dashboard */

export type Slot = { id: string; day: string; time: string }

export const AVAILABILITY: Slot[] = [
  { id: 's1', day: 'TUE', time: '4:00 PM' },
  { id: 's2', day: 'WED', time: '6:30 PM' },
  { id: 's3', day: 'THU', time: '5:00 PM' },
]

export type Session = {
  id: string
  team: string
  topic: string
  when: string
  cad: string
  code: string
}

export const MENTOR_SESSIONS: Session[] = [
  {
    id: 'u1',
    team: 'Team 16461',
    topic: 'Autonomous path review',
    when: 'Tue, July 28 · 4:00 PM',
    cad: 'onshape.link/drivebase',
    code: 'github.com/16461',
  },
  {
    id: 'u2',
    team: 'Team 9072',
    topic: 'Slide mechanism debug',
    when: 'Wed, July 29 · 6:30 PM',
    cad: 'onshape.link/slide',
    code: 'github.com/9072',
  },
]

export const TEAM_SESSIONS: Session[] = [
  {
    id: 't1',
    team: 'with Maya Patel',
    topic: 'Road Runner tuning walkthrough',
    when: 'Tue, July 28 · 4:00 PM',
    cad: 'onshape.link/drivebase',
    code: 'github.com/16461',
  },
  {
    id: 't2',
    team: 'with Ava Reynolds',
    topic: 'Portfolio judging prep',
    when: 'Fri, July 31 · 5:30 PM',
    cad: 'drive.link/portfolio',
    code: 'github.com/16461',
  },
]
