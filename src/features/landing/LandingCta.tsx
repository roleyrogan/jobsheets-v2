import { Link } from 'react-router'

import { Button } from '@/components/ui/button'
import { useReveal } from '@/features/landing/useReveal'

type LandingCtaProps = {
  signedIn: boolean
}

export function LandingCta({ signedIn }: LandingCtaProps) {
  const ref = useReveal<HTMLElement>()

  return (
    <section
      ref={ref}
      className="flex flex-col gap-5 border-t-[3px] border-double border-t-ink pt-10"
    >
      <h2 className="landing-reveal-child max-w-[18ch] text-[36px] leading-[40px] font-semibold min-[760px]:max-w-[22ch] min-[760px]:text-[44px] min-[760px]:leading-[46px]">
        Start your sheet. Import the old spreadsheet if you have one.
      </h2>
      <div className="landing-reveal-child">
        <Button asChild className="landing-press h-11 px-4 text-sm">
          <Link to={signedIn ? '/app' : '/signup'}>Get started</Link>
        </Button>
      </div>
    </section>
  )
}
