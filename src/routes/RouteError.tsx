import { isRouteErrorResponse, useRouteError } from 'react-router'

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
    <div className="flex min-h-svh flex-col items-center justify-center gap-3 bg-paper px-4 text-ink">
      <h1 className="text-lg font-medium">Something went wrong.</h1>
      <p className="text-sm text-ink-2">{errorMessage(error)}</p>
      <Button type="button" onClick={() => window.location.reload()}>
        Reload
      </Button>
    </div>
  )
}
