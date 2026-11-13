import { useSession } from '@/features/auth/useSession'
import { LandingCta } from '@/features/landing/LandingCta'
import { LandingFeatures } from '@/features/landing/LandingFeatures'
import { LandingHeader } from '@/features/landing/LandingHeader'
import { LandingHero } from '@/features/landing/LandingHero'
import { LandingOverview } from '@/features/landing/LandingOverview'
import { SampleSheet } from '@/features/landing/SampleSheet'
import { Footer } from '@/components/Footer'

export function Landing() {
  const { status } = useSession()
  const signedIn = status === 'signedIn'

  return (
    <div className="flex min-h-svh flex-col bg-paper text-ink">
      <LandingHeader signedIn={signedIn} />
      <main className="mx-auto flex w-full max-w-[1200px] flex-1 flex-col gap-16 px-4 py-12 sm:py-16">
        <LandingHero signedIn={signedIn} />
        <SampleSheet />
        <LandingOverview />
        <LandingFeatures />
        <LandingCta signedIn={signedIn} />
      </main>
      <Footer />
    </div>
  )
}
