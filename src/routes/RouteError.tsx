import { isRouteErrorResponse, useRouteError } from 'react-router'

import { AuthShell } from '@/components/AuthShell'
import { Button } from '@/components/ui/button'

function errorMessage(error: unknown): string {
  if (isRouteErrorResponse(error)) {
    return error.statusText || 'An unexpected error occurred.'
  }
  if (error instanceof Error) {
    return error.message
  }
  return 'An unexpected error occurred.'
}

export function RouteError() {
  const error = useRouteError()

  return (
    <AuthShell title="Something went wrong.">
      <p className="text-sm text-ink-2">{errorMessage(error)}</p>
      <Button type="button" className="w-fit" onClick={() => window.location.reload()}>
        Reload
      </Button>
    </AuthShell>
  )
}
