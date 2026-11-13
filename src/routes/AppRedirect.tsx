import { Navigate, useLocation } from 'react-router'

import { getLastView } from '@/lib/lastView'

export function AppRedirect() {
  const location = useLocation()
  const view = getLastView()

  return <Navigate to={`/app/${view}${location.search}`} replace />
}
