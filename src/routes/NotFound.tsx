import { Link } from 'react-router'

import { PageTitle } from '@/components/PageTitle'

export function NotFound() {
  return (
    <div className="flex min-h-svh flex-col items-center justify-center gap-3 px-4">
      <PageTitle>Page not found</PageTitle>
      <Link to="/" className="text-sm underline underline-offset-4">
        Go home
      </Link>
    </div>
  )
}
