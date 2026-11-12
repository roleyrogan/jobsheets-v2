import { Navigate, Outlet } from 'react-router'

import { useSession } from '@/features/auth/useSession'

export function PublicOnly() {
  const { status } = useSession()

  if (status === 'loading') {
    return (
      <div className="flex min-h-svh items-center justify-center">
        <p className="text-sm text-muted-foreground" role="status">
          Loading…
        </p>
      </div>
    )
  }

  if (status === 'signedIn') {
    return <Navigate to="/app" replace />
  }

  return <Outlet />
}
