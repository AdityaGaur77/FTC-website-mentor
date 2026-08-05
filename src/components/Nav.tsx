import { useEffect, useState } from 'react'
import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom'
import { Menu, X } from 'lucide-react'
import { avatarUrl, displayName, useAuth } from '../lib/auth'
import { Avatar, Button, ButtonLink, cx } from './ui'

const LINKS = [
  { to: '/', label: 'Home' },
  { to: '/mentors', label: 'Mentors' },
  { to: '/requests', label: 'Requests' },
  { to: '/messages', label: 'Messages' },
  { to: '/dashboard', label: 'Dashboard' },
  { to: '/safety', label: 'Safety' },
]

function Wordmark() {
  return (
    <Link to="/" className="flex items-center gap-2.5">
      <span className="grid h-7 w-7 place-items-center rounded-lg bg-accent font-display text-[14px] font-extrabold text-[#04222c]">
        R
      </span>
      <span className="font-display text-[15px] font-bold tracking-tight text-white">
        Relay for FTC
      </span>
    </Link>
  )
}

/** Signed-in identity + sign out, replacing the Join / Sign In pair. */
function AccountMenu() {
  const { user, profile, signOut } = useAuth()
  const navigate = useNavigate()
  if (!user) return null

  const name = displayName(user, profile)

  return (
    <div className="flex items-center gap-2">
      <Link
        to="/dashboard"
        className="flex items-center gap-2 rounded-lg px-1.5 py-1 transition-colors hover:bg-raised"
        title={user.email ?? undefined}
      >
        <Avatar name={name} src={avatarUrl(user, profile)} size={24} />
        <span className="hidden max-w-[14ch] truncate text-[13px] font-medium text-white sm:block">
          {name}
        </span>
      </Link>
      <Button
        size="sm"
        variant="secondary"
        onClick={async () => {
          await signOut()
          navigate('/')
        }}
      >
        Sign Out
      </Button>
    </div>
  )
}

export default function Nav() {
  const [open, setOpen] = useState(false)
  const { pathname } = useLocation()
  const { user } = useAuth()

  // Close the mobile sheet on navigation.
  useEffect(() => setOpen(false), [pathname])

  return (
    <header className="sticky top-0 z-50 border-b border-line-soft bg-ink/85 backdrop-blur-md">
      <div className="container-page flex h-14 items-center justify-between gap-4">
        <Wordmark />

        <nav className="hidden items-center gap-6 lg:flex" aria-label="Primary">
          {LINKS.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.to === '/'}
              className={({ isActive }) =>
                cx(
                  'text-[13px] font-medium transition-colors duration-200 hover:text-white',
                  isActive ? 'text-white' : 'text-body',
                )
              }
            >
              {link.label}
            </NavLink>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          {user ? (
            <AccountMenu />
          ) : (
            <>
              <ButtonLink to="/join" size="sm" className="hidden sm:inline-flex">
                Join as a Peer / Mentor
              </ButtonLink>
              <ButtonLink to="/signin" size="sm" variant="secondary">
                Sign In
              </ButtonLink>
            </>
          )}
          <button
            type="button"
            onClick={() => setOpen((value) => !value)}
            aria-expanded={open}
            aria-controls="mobile-nav"
            aria-label={open ? 'Close menu' : 'Open menu'}
            className="grid h-8 w-8 place-items-center rounded-lg border border-line bg-raised text-body transition-colors hover:text-white lg:hidden"
          >
            {open ? <X size={15} /> : <Menu size={15} />}
          </button>
        </div>
      </div>

      {open && (
        <nav
          id="mobile-nav"
          aria-label="Primary mobile"
          className="border-t border-line-soft bg-panel lg:hidden"
        >
          <div className="container-page flex flex-col py-2">
            {LINKS.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                end={link.to === '/'}
                className={({ isActive }) =>
                  cx(
                    'rounded-lg px-2 py-2.5 text-[14px] font-medium transition-colors',
                    isActive ? 'bg-raised text-white' : 'text-body hover:text-white',
                  )
                }
              >
                {link.label}
              </NavLink>
            ))}
            {!user && (
              <ButtonLink to="/join" size="md" className="my-2 sm:hidden">
                Join as a Peer / Mentor
              </ButtonLink>
            )}
          </div>
        </nav>
      )}
    </header>
  )
}
