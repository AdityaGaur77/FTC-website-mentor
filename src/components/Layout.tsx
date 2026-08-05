import { useEffect } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import Nav from './Nav'
import Footer from './Footer'

const TITLES: Record<string, string> = {
  '/': 'Relay for FTC — Peer & Mentor Network',
  '/mentors': 'Mentors — Relay for FTC',
  '/requests': 'Requests — Relay for FTC',
  '/messages': 'Messages — Relay for FTC',
  '/dashboard': 'Dashboard — Relay for FTC',
  '/safety': 'Safety — Relay for FTC',
  '/join': 'Join — Relay for FTC',
  '/signin': 'Sign In — Relay for FTC',
}

export default function Layout() {
  const { pathname, hash } = useLocation()

  useEffect(() => {
    document.title = TITLES[pathname] ?? 'Relay for FTC'
  }, [pathname])

  // Scroll to top on navigation, or to the anchor when one is present.
  useEffect(() => {
    if (hash) {
      document.getElementById(hash.slice(1))?.scrollIntoView({ behavior: 'smooth' })
      return
    }
    window.scrollTo({ top: 0 })
  }, [pathname, hash])

  return (
    <div className="flex min-h-screen flex-col">
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[60] focus:rounded-lg focus:bg-accent focus:px-4 focus:py-2 focus:text-[13px] focus:font-semibold focus:text-[#04222c]"
      >
        Skip to content
      </a>
      <Nav />
      <main id="main" className="container-page flex-1 py-6 sm:py-8">
        <Outlet />
      </main>
      <Footer />
    </div>
  )
}
