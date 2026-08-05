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

## Sign-in methods

Three are wired up on `/signin`:

| Method | External setup | Notes |
| --- | --- | --- |
| Email + password | none | Works out of the box |
| **Magic link** | none | Passwordless; also creates the account on first use |
| Google | Google Cloud Console (free) | Gives you real profile photos |

**Email delivery caveat.** Magic links and confirmation emails go through Supabase's built-in mail
server, which is rate limited to a few messages per hour and is explicitly for testing. Before real
teams sign up, add custom SMTP under **Project Settings → Authentication → SMTP Settings**
(Resend and SendGrid both have free tiers). This limit applies to email confirmation too, not just
magic links.

## Adding Google sign-in

The code is already written — `Continue with Google` is on the login page and calls
`signInWithGoogle()`. It stays inert until you complete the two consoles below.

**Google Cloud Console is free for this.** Creating a project, the OAuth consent screen, and OAuth
client credentials costs nothing, and there is no Supabase-only shortcut — the provider page has
required Client ID and Client Secret fields that only Google can issue. If you get pushed toward a
billing account or a "free trial" card prompt, skip it; OAuth credentials don't require billing.

### 1. Google Cloud Console

1. [console.cloud.google.com](https://console.cloud.google.com) → create a project.
2. **APIs & Services → OAuth consent screen**. Choose **External**, fill in app name, user support
   email, and developer email. The default `email` / `profile` / `openid` scopes are all you need.
3. **APIs & Services → Credentials → Create Credentials → OAuth client ID → Web application**.
4. **Authorized JavaScript origins**: `http://localhost:5173` (add your production URL later).
5. **Authorized redirect URIs** — this one must be exact, and it points at Supabase, not your app:

   ```
   https://<your-project-ref>.supabase.co/auth/v1/callback
   ```

6. Copy the **Client ID** and **Client secret**.

### 2. Supabase

1. **Authentication → Sign In / Providers → Google** → enable it.
2. Paste the Client ID and Client secret, then **Save**.
3. **Authentication → URL Configuration**: Site URL `http://localhost:5173`, and add
   `http://localhost:5173/**` to Redirect URLs.

### 3. Re-run the schema

`supabase/schema.sql` gained an `avatar_url` column and a trigger that reads Google's metadata
keys. Paste the whole file into the SQL Editor again — every statement is guarded, so re-running is
safe.

### Gotchas

- While the consent screen is in **Testing**, only accounts listed under **Audience → Test users**
  can sign in. Everyone else gets "access blocked". Publish the app when you're ready for real
  teams.
- `redirect_uri_mismatch` means the URI in step 5 doesn't match character for character — check for
  a trailing slash or `http` vs `https`.
- Google accounts get `account_type = 'team'` by default, since Google can't tell us whether
  someone is a mentor. Add a settings screen later to let them switch.

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
