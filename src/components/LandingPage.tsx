import { ChevronDown, ClipboardList, Globe, RefreshCw, ShieldCheck } from 'lucide-react'
import Grainient from './Grainient'
import SplitText from './SplitText'
import SpotlightCard from './SpotlightCard'
import { Navigation5 } from '@/components/ui/navigation-5'

type LandingPageProps = {
  onGetStarted: () => void
}

const features = [
  {
    icon: ClipboardList,
    title: 'Track Applications',
    description:
      'Log every application in one place — company, role, date, and notes.',
  },
  {
    icon: RefreshCw,
    title: 'Update Status',
    description:
      'Move applications through applied, interviewing, offer, and rejected with a single click.',
  },
  {
    icon: Globe,
    title: 'Access Anywhere',
    description:
      'Your job search stays in sync across devices so you can update progress on the go.',
  },
  {
    icon: ShieldCheck,
    title: 'Never Lose Progress',
    description:
      'Your data is saved securely in the cloud so nothing disappears between applications.',
  },
]

export default function LandingPage({ onGetStarted }: LandingPageProps) {
  return (
    <div id="top" className="relative isolate min-h-screen overflow-hidden bg-[#10002B] text-[#E0AAFF]">
      <div className="pointer-events-none fixed inset-0 -z-20">
        <Grainient
          color1="#10002B"
          color2="#7B2CBF"
          color3="#E0AAFF"
          timeSpeed={0.25}
          colorBalance={0.0}
          warpStrength={1.0}
          warpFrequency={5.0}
          warpSpeed={2.0}
          warpAmplitude={50.0}
          blendAngle={0.0}
          blendSoftness={0.05}
          rotationAmount={500.0}
          noiseScale={2.0}
          grainAmount={0.1}
          grainScale={2.0}
          grainAnimated={false}
          contrast={1.5}
          gamma={1.0}
          saturation={1.0}
          centerX={0.0}
          centerY={0.0}
          zoom={0.9}
        />
      </div>
      <div className="pointer-events-none fixed inset-0 -z-10 bg-[#10002B]/35" />

      {/* Nav */}
      <header className="fixed top-0 inset-x-0 z-50 pt-4 sm:pt-6">
        <Navigation5 onGetStarted={onGetStarted} />
      </header>

      {/* Hero */}
      <section className="relative flex min-h-svh flex-col items-center justify-center px-4 pb-24 pt-28 text-center sm:px-6 sm:pb-32 sm:pt-32">
        <div className="relative z-10 flex flex-col items-center">
          <div className="flex max-w-3xl flex-col items-center gap-1">
            <SplitText
              text="Track every application."
              tag="h1"
              className="text-5xl font-bold leading-[1.1] tracking-tight text-[#E0AAFF] sm:text-6xl"
              delay={40}
              duration={0.6}
              ease="power3.out"
              splitType="chars"
              from={{ opacity: 0, y: 40 }}
              to={{ opacity: 1, y: 0 }}
              threshold={0.1}
              rootMargin="-100px"
              textAlign="center"
            />
            <span className="block text-5xl font-bold leading-[1.1] tracking-tight text-[#E0AAFF] sm:text-6xl">
              Land the job.
            </span>
          </div>

          <p className="mt-6 max-w-md text-base leading-relaxed text-[#C77DFF] sm:text-lg">
            The simplest way to manage your job search — add applications, track status, and never
            lose progress again.
          </p>

          <div className="mt-10 flex flex-col items-center gap-3 sm:flex-row sm:gap-4">
            <button
              type="button"
              onClick={onGetStarted}
              className="rounded-lg bg-[#7B2CBF] px-6 py-3 text-sm font-medium text-[#E0AAFF] transition-colors hover:bg-[#9D4EDD]"
            >
              Get Started
            </button>
            <button
              type="button"
              onClick={onGetStarted}
              className="rounded-lg border border-[#7B2CBF] px-6 py-3 text-sm font-medium text-[#C77DFF] transition-colors hover:bg-[#3C096C]"
            >
              Log In
            </button>
          </div>
        </div>

        <a
          href="#features"
          className="absolute bottom-8 left-1/2 z-10 flex -translate-x-1/2 flex-col items-center gap-1 text-[#C77DFF] transition-colors hover:text-[#E0AAFF] sm:bottom-10"
          aria-label="Scroll to features"
        >
          <span className="text-xs font-medium tracking-wide uppercase">Scroll</span>
          <ChevronDown className="size-5 animate-bounce" strokeWidth={1.75} />
        </a>
      </section>

      {/* Features */}
      <section id="features" className="relative scroll-mt-28 px-4 py-24 sm:px-6 sm:py-32">
        <div className="relative z-10 mx-auto max-w-5xl">
          <div className="mb-12 text-center">
            <SplitText
              text="Everything you need to stay organized"
              tag="h2"
              className="text-2xl font-bold text-[#E0AAFF] sm:text-3xl"
              delay={30}
              duration={0.6}
              ease="power3.out"
              splitType="chars"
              from={{ opacity: 0, y: 40 }}
              to={{ opacity: 1, y: 0 }}
              threshold={0.2}
              rootMargin="-40px"
              textAlign="center"
            />
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-6">
            {features.map(({ icon: Icon, title, description }) => (
              <SpotlightCard
                key={title}
                className="rounded-xl border border-[#3C096C] bg-[#240046]/90 p-6 text-left backdrop-blur-sm"
                spotlightColor="rgba(157, 78, 221, 0.35)"
              >
                <div className="relative z-10">
                  <Icon className="mb-4 text-[#C77DFF]" size={24} strokeWidth={1.75} />
                  <h3 className="mb-2 text-lg font-bold text-[#E0AAFF]">{title}</h3>
                  <p className="text-sm leading-relaxed text-[#C77DFF]">{description}</p>
                </div>
              </SpotlightCard>
            ))}
          </div>
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="flex min-h-svh flex-col items-center justify-center px-4 py-24 text-center sm:px-6 sm:py-32">
        <SplitText
          text="Ready to take control of your job search?"
          tag="h2"
          className="max-w-3xl text-4xl font-bold leading-tight text-[#E0AAFF] sm:text-5xl"
          delay={30}
          duration={0.6}
          ease="power3.out"
          splitType="chars"
          from={{ opacity: 0, y: 40 }}
          to={{ opacity: 1, y: 0 }}
          threshold={0.2}
          rootMargin="-40px"
          textAlign="center"
        />
        <button
          type="button"
          onClick={onGetStarted}
          className="mt-10 rounded-lg bg-[#7B2CBF] px-8 py-4 text-base font-medium text-[#E0AAFF] transition-colors hover:bg-[#9D4EDD] sm:text-lg"
        >
          Get Started
        </button>
      </section>

      {/* Footer */}
      <footer className="border-t border-[#3C096C] bg-[#240046] px-4 py-8 text-center sm:px-6">
        <p className="text-sm font-medium text-[#E0AAFF]">
          © 2026 JobSheets
        </p>
      </footer>
    </div>
  )
}
