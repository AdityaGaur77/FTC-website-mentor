# Relay for FTC

A code version of the Framer design — FTC teams connecting with veteran mentors and student peer
experts. Built so you can take it further than Framer allows.

## Run it

```bash
npm install
npm run dev
```

Opens on http://localhost:5173. `npm run build` produces a production bundle in `dist/`.

## Stack

- **Vite + React 18 + TypeScript** — fast refresh, real type checking
- **Tailwind CSS** — all design tokens live in `tailwind.config.js`
- **React Router** — one route per page
- **lucide-react** — the icon set

## Where things are

```
src/
├── App.tsx                 route table
├── index.css               base styles + .panel / .card / .eyebrow classes
├── data/content.ts         ALL page content (mentors, requests, chats, sessions)
├── components/
│   ├── Layout.tsx          nav + main + footer shell, page titles, scroll handling
│   ├── Nav.tsx             sticky header, active link state, mobile menu
│   ├── Footer.tsx
│   └── ui.tsx              Button, Chip, Card, Panel, Avatar, Field, SectionHead
└── pages/
    ├── Home.tsx            hero, stats, how it works, features
    ├── Mentors.tsx         directory with working search + filters
    ├── Requests.tsx        Pitside Assistance Board with tag filters
    ├── Messages.tsx        conversation list + active thread
    ├── Dashboard.tsx       mentor/team tabs, availability editor, hours
    ├── Safety.tsx          policies, code of conduct, report form
    ├── Join.tsx            role picker + application form
    ├── SignIn.tsx
    └── NotFound.tsx
```

**To change copy or add a mentor**, edit `src/data/content.ts` — nothing else needs to change.

## Design tokens

Defined once in `tailwind.config.js`, used as Tailwind classes everywhere:

| Token | Value | Used for |
| --- | --- | --- |
| `ink` | `#070d14` | page background |
| `panel` | `#0b1421` | large section containers |
| `card` | `#0d1826` | cards inside panels |
| `raised` | `#12202f` | secondary buttons, hover states |
| `line` / `line-soft` | `#1b2c40` / `#152436` | borders |
| `accent` | `#22d3ee` | cyan — buttons, eyebrows, stats |
| `urgent` | `#f5a524` | urgent request status |
| `body` / `faint` | `#8ea3ba` / `#64798f` | paragraph and label text |

The lit gradient on hero panels is `bg-hero`. Fonts are Inter (body) and Inter Tight (headings),
loaded from Google Fonts in `index.html`.

## Notes

- **Avatars** are initials on a tinted circle. To use real photos, drop files in `public/avatars/`
  and pass `src` to `<Avatar />` in `src/pages/Mentors.tsx` — sizing and border stay the same.
- **Mobile nav**: the Framer frames show only the logo and Sign In. A hamburger was added at the
  same spot so the six pages stay reachable on a phone; remove the button in `Nav.tsx` if you'd
  rather match the frames exactly.
- **No backend yet.** Forms (`Safety`, `Join`) and Sign In set local state only. Every list reads
  from `src/data/content.ts`, so swapping in `fetch` calls later won't touch the components.
