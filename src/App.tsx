import { Route, Routes } from 'react-router-dom'
import { AuthProvider } from './lib/auth'
import Layout from './components/Layout'
import ProtectedRoute from './components/ProtectedRoute'
import Home from './pages/Home'
import Mentors from './pages/Mentors'
import Requests from './pages/Requests'
import Messages from './pages/Messages'
import Dashboard from './pages/Dashboard'
import Safety from './pages/Safety'
import Join from './pages/Join'
import SignIn from './pages/SignIn'
import Confirmed from './pages/Confirmed'
import NotFound from './pages/NotFound'

export default function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route element={<Layout />}>
          {/* Public */}
          <Route path="/" element={<Home />} />
          <Route path="/mentors" element={<Mentors />} />
          <Route path="/requests" element={<Requests />} />
          <Route path="/safety" element={<Safety />} />
          <Route path="/signin" element={<SignIn />} />
          {/* Applying is how you get an account, so this can't require one. */}
          <Route path="/join" element={<Join />} />

          {/* Requires an account */}
          <Route element={<ProtectedRoute />}>
            <Route path="/messages" element={<Messages />} />
            <Route path="/dashboard" element={<Dashboard />} />
          </Route>

          <Route path="*" element={<NotFound />} />
        </Route>

        {/* Standalone — no nav or footer, it's a tab you close. */}
        <Route path="/confirmed" element={<Confirmed />} />
      </Routes>
    </AuthProvider>
  )
}
