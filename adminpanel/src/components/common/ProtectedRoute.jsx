import { useSelector } from 'react-redux'
import { Navigate, Outlet } from 'react-router-dom'

export function ProtectedRoute() {
  const { token } = useSelector(s => s.auth)
  return token ? <Outlet /> : <Navigate to="/login" replace />
}

export function SuperAdminRoute() {
  const { admin } = useSelector(s => s.auth)
  return admin?.role === 'superadmin' ? <Outlet /> : <Navigate to="/" replace />
}

export function GuestRoute() {
  const { token } = useSelector(s => s.auth)
  return !token ? <Outlet /> : <Navigate to="/" replace />
}
