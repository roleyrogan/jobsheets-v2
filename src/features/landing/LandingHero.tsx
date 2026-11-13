import { Link } from 'react-router'

import { Button } from '@/components/ui/button'

type LandingHeroProps = {
  signedIn: boolean
}

export function LandingHero({ signedIn }: LandingHeroProps) {
  return (
    <section className="flex max-w-[60ch] flex-col gap-5">
      <h1 className="landing-headline">
        Keep track of every job application.
      </h1>
      <p className="text-sm leading-5 text-ink-2 sm:text-base sm:leading-6">
        JobSheets is a tracker for students and job seekers. Log each
        application, update its status as you hear back, and see where your
        search stands.
      </p>
      <div className="flex flex-wrap items-center gap-2">
        <Button asChild>
          <Link to={signedIn ? '/app' : '/signup'}>Get started</Link>
        </Button>
        {signedIn ? null : (
          <Button asChild variant="outline">
            <Link to="/login">Log in</Link>
          </Button>
        )}
      </div>
    </section>
  )
}
