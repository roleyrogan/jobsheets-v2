import { Link } from 'react-router'

import { Button } from '@/components/ui/button'

type LandingHeaderProps = {
  signedIn: boolean
}

export function LandingHeader({ signedIn }: LandingHeaderProps) {
  return (
    <header className="border-b border-rule">
      <div className="mx-auto flex h-12 w-full max-w-[1200px] items-center justify-between px-4">
        <Link to="/" className="text-sm font-medium">
          JobSheets
        </Link>
        <nav aria-label="Account" className="flex items-center gap-2">
          {signedIn ? (
            <Button asChild>
              <Link to="/app">Open app</Link>
            </Button>
          ) : (
            <>
              <Button asChild variant="ghost">
                <Link to="/login">Log in</Link>
              </Button>
              <Button asChild>
                <Link to="/signup">Sign up</Link>
              </Button>
            </>
          )}
        </nav>
      </div>
    </header>
  )
}
