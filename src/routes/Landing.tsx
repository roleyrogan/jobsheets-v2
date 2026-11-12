import { Link } from 'react-router'

import { useSession } from '@/features/auth/useSession'
import { Button } from '@/components/ui/button'

export function Landing() {
  const { status } = useSession()

  return (
    <div className="mx-auto flex min-h-svh max-w-lg flex-col justify-center gap-6 px-4">
      <div className="flex flex-col gap-3">
        <h1 className="text-3xl font-medium tracking-tight">JobSheets</h1>
        <p className="text-muted-foreground">
          A job application tracker for students and job seekers.
        </p>
      </div>
      <div className="flex flex-wrap gap-2">
        {status === 'signedIn' ? (
          <Button asChild>
            <Link to="/app">Open app</Link>
          </Button>
        ) : (
          <>
            <Button asChild>
              <Link to="/login">Log in</Link>
            </Button>
            <Button variant="outline" asChild>
              <Link to="/signup">Sign up</Link>
            </Button>
          </>
        )}
      </div>
      <p className="text-sm text-muted-foreground">
        <Link to="/privacy" className="underline underline-offset-4">
          Privacy
        </Link>
      </p>
    </div>
  )
}
