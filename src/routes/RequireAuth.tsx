import { Navigate, Outlet, useLocation } from 'react-router'

import { useSession } from '@/features/auth/useSession'

export function RequireAuth() {
  const { status } = useSession()
  const location = useLocation()

  if (status === 'loading') {
    return (
      <div className="flex min-h-svh items-center justify-center">
        <p className="text-sm text-muted-foreground" role="status">
          Loading…
        </p>
      </div>
    )
  }

  if (status === 'signedOut') {
    return <Navigate to="/login" replace state={{ from: location }} />
  }

  return <Outlet />
}
