import { useSession } from '@/features/auth/useSession'
import { KeyboardSection } from '@/features/landing/KeyboardSection'
import { LandingCta } from '@/features/landing/LandingCta'
import { LandingHeader } from '@/features/landing/LandingHeader'
import { LandingHero } from '@/features/landing/LandingHero'
import { ViewsStory } from '@/features/landing/ViewsStory'
import { Footer } from '@/components/Footer'

export function Landing() {
  const { status } = useSession()
  const signedIn = status === 'signedIn'

  return (
    <div className="flex min-h-svh flex-col overflow-x-clip bg-paper text-ink">
      <LandingHeader signedIn={signedIn} />
      <main className="mx-auto flex w-full max-w-[1200px] flex-1 flex-col gap-20 px-4 py-10 sm:gap-24 sm:py-14">
        <LandingHero signedIn={signedIn} />
        <ViewsStory />
        <KeyboardSection />
        <LandingCta signedIn={signedIn} />
      </main>
      <Footer reveal />
    </div>
  )
}
