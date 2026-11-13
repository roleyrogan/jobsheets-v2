import { Link } from 'react-router'

import { Button } from '@/components/ui/button'

type LandingCtaProps = {
  signedIn: boolean
}

export function LandingCta({ signedIn }: LandingCtaProps) {
  return (
    <section className="flex flex-col items-start gap-3">
      <p className="text-sm text-ink-2">Ready to replace the spreadsheet?</p>
      <Button asChild>
        <Link to={signedIn ? '/app' : '/signup'}>Start your sheet</Link>
      </Button>
    </section>
  )
}
