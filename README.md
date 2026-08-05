# Relay for FTC

A code version of the Framer design — FTC teams connecting with veteran mentors and student peer
experts. Built so you can take it further than Framer allows.

## Run it

```bash
npm install
npm run dev
```

Opens on http://localhost:5173. `npm run build` produces a production bundle in `dist/`.

Without a `.env.local` the app runs in **demo mode**: every page works, auth is a no-op. Add your
Supabase keys (below) to turn on real accounts.

## Stack

- **Vite + React 18 + TypeScript** — fast refresh, real type checking
- **Tailwind CSS** — all design tokens live in `tailwind.config.js`
- **React Router** — one route per page
- **Supabase** — auth + Postgres database
- **lucide-react** — the icon set

## Connecting Supabase

### 1. Create the project

1. Sign up at [supabase.com](https://supabase.com) and click **New project**.
2. Name it `relay-for-ftc`, pick a region near your teams, and set a database password.
   Save that password somewhere safe — it's for direct SQL access, not for this app.
3. Wait ~2 minutes for provisioning.

### 2. Create the tables

1. In the dashboard, open **SQL Editor → New query**.
2. Paste the entire contents of [`supabase/schema.sql`](supabase/schema.sql) and hit **Run**.

That creates `profiles` and `mentor_applications`, turns on Row Level Security, and installs a
trigger that makes a profile row automatically whenever someone signs up.

### 3. Add your keys

1. Go to **Project Settings → API**.
2. Copy the **Project URL** and the **anon / publishable** key.
3. In the project root:

   ```bash
   cp .env.example .env.local
   ```

4. Paste both values into `.env.local`.
5. **Restart the dev server** — Vite only reads env files at startup.

`.env.local` is gitignored. The anon key is designed to ship in browser code; RLS is what protects
your data. Never put the `service_role` / secret key in this file.

### 4. Set the auth options

Under **Authentication → Sign In / Providers → Email**:

- Keep **Confirm email** on for production. The app handles it — new users see a
  "check your email" screen.
- For faster local testing you can turn it off temporarily; accounts then sign in immediately.

Under **Authentication → URL Configuration**, set **Site URL** to `http://localhost:5173` while
developing, and add your deployed URL to **Redirect URLs** when you ship.

### 5. Try it

Open `/signin`, choose **Create Account**, and sign up. Then check **Table Editor → profiles** —
your row should be there, created by the trigger.

### What's protected

`/dashboard`, `/messages`, and `/join` require an account and redirect to `/signin`, which returns
you to the page you wanted after login. `/`, `/mentors`, `/requests`, and `/safety` stay public.

## Where things are

```
supabase/schema.sql         tables, RLS policies, signup trigger — run this once
src/
├── App.tsx                 route table + which routes need an account
├── index.css               base styles + .panel / .card / .eyebrow classes
├── data/content.ts         ALL page content (mentors, requests, chats, sessions)
├── lib/
│   ├── supabase.ts         client + isSupabaseConfigured flag
│   └── auth.tsx            AuthProvider, useAuth(), signIn/signUp/signOut
├── components/
│   ├── Layout.tsx          nav + main + footer shell, page titles, scroll handling
│   ├── Nav.tsx             sticky header, active link state, account menu, mobile menu
│   ├── ProtectedRoute.tsx  redirects signed-out users to /signin
│   ├── Footer.tsx
│   └── ui.tsx              Button, Chip, Card, Panel, Avatar, Field, SectionHead
└── pages/
    ├── Home.tsx            hero, stats, how it works, features
    ├── Mentors.tsx         directory with working search + filters
    ├── Requests.tsx        Pitside Assistance Board with tag filters
    ├── Messages.tsx        conversation list + active thread
    ├── Dashboard.tsx       mentor/team tabs, availability editor, hours
    ├── Safety.tsx          policies, code of conduct, report form
    ├── Join.tsx            role picker + application, saved to Supabase
    ├── SignIn.tsx          sign in / create account / password reset
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
- **Directory content is still local.** Mentors, requests, and conversations read from
  `src/data/content.ts`. Auth and applications are real; move the rest into Supabase tables the
  same way when you're ready — the components take props, so only the data source changes.
- **The Safety report form** still sets local state only. Point it at a `feedback` table or an
  email service when you want to receive them.
