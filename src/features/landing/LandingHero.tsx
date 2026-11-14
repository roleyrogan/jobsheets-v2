import { useRef } from 'react'
import { Link } from 'react-router'

import { Button } from '@/components/ui/button'
import { HeroGrid } from '@/features/landing/HeroGrid'
import { HeroPreview } from '@/features/landing/HeroPreview'
import { useHeroCursor } from '@/features/landing/useHeroCursor'

type LandingHeroProps = {
  signedIn: boolean
}

export function LandingHero({ signedIn }: LandingHeroProps) {
  const { cursor, onMouseMove, onMouseLeave } = useHeroCursor()
  const textRef = useRef<HTMLDivElement>(null)
  const previewRef = useRef<HTMLDivElement>(null)

  return (
    <section
      className="relative overflow-hidden"
      onMouseMove={onMouseMove}
      onMouseLeave={onMouseLeave}
    >
      <HeroGrid
        cursor={cursor}
        textRef={textRef}
        previewRef={previewRef}
      />
      <div className="relative z-[1] flex flex-col gap-14 pt-8 pb-4 sm:gap-10 sm:pt-12">
        <div ref={textRef} className="flex max-w-[900px] flex-col gap-5">
          <h1 className="landing-hero-title">
            <span className="landing-hero-line-mask">
              <span className="landing-hero-line">Your whole job search,</span>
            </span>
            <span className="landing-hero-line-mask">
              <span className="landing-hero-line landing-hero-line-delay">
                in one sheet.
              </span>
            </span>
          </h1>
          <p className="landing-hero-fade landing-hero-fade-p max-w-[560px] text-[17px] leading-[27px] text-ink-2">
            Log each application, update its status as you hear back, and see
            what’s moving and what’s gone quiet. Sorted, searchable, and yours.
          </p>
          <div className="landing-hero-fade landing-hero-fade-btns flex flex-wrap items-center gap-2">
            <Button asChild className="landing-press h-11 px-4 text-sm">
              <Link to={signedIn ? '/app' : '/signup'}>Get started</Link>
            </Button>
            {signedIn ? null : (
              <Button
                asChild
                variant="outline"
                className="landing-press h-11 px-4 text-sm"
              >
                <Link to="/login">Log in</Link>
              </Button>
            )}
          </div>
        </div>
        <div ref={previewRef} className="landing-hero-fade-preview">
          <HeroPreview />
        </div>
      </div>
    </section>
  )
}

