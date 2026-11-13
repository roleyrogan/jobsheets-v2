import { Link } from 'react-router'

import { Button } from '@/components/ui/button'

type LandingHeaderProps = {
  signedIn: boolean
}

export function LandingHeader({ signedIn }: LandingHeaderProps) {
  return (
    <header className="landing-header-in border-b border-b-rule">
      <div className="mx-auto flex h-16 w-full max-w-[1200px] items-center justify-between px-4">
        <Link to="/" className="text-sm font-medium">
          JobSheets
        </Link>
        <nav aria-label="Landing" className="flex items-center gap-2">
          <a
            href="#views"
            className="landing-press hidden px-2.5 py-1.5 text-[13px] font-medium text-ink-2 hover:text-ink min-[760px]:inline"
          >
            Views
          </a>
          <a
            href="#keyboard"
            className="landing-press hidden px-2.5 py-1.5 text-[13px] font-medium text-ink-2 hover:text-ink min-[760px]:inline"
          >
            Keyboard
          </a>
          {signedIn ? (
            <Button asChild className="landing-press">
              <Link to="/app">Open app</Link>
            </Button>
          ) : (
            <>
              <Button asChild variant="ghost" className="landing-press">
                <Link to="/login">Log in</Link>
              </Button>
              <Button asChild className="landing-press">
                <Link to="/signup">Sign up</Link>
              </Button>
            </>
          )}
        </nav>
      </div>
    </header>
  )
}
