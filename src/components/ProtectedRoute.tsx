import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { useAuth } from '../lib/auth'
import { Panel } from './ui'

/**
 * Gate for pages that need an account. Before Supabase is configured every
 * route stays open so the design is still browsable in demo mode.
 */
export default function ProtectedRoute() {
  const { user, loading, configured } = useAuth()
  const location = useLocation()

  if (!configured) return <Outlet />

  if (loading) {
    return (
      <Panel className="px-5 py-16 text-center">
        <p className="text-[13.5px] text-body">Checking your session…</p>
      </Panel>
    )
  }

  if (!user) {
    return <Navigate to="/signin" state={{ from: location.pathname }} replace />
  }

  return <Outlet />
}
