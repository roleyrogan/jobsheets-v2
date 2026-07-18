import { ClipboardList, Globe, RefreshCw, ShieldCheck } from 'lucide-react'
import Grainient from './Grainient'

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
    <div className="min-h-screen bg-[#10002B] text-[#E0AAFF]">
      {/* Nav */}
      <nav className="fixed top-0 inset-x-0 z-50 border-b border-[#3C096C] bg-[#10002B]/80 backdrop-blur-md">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-4 sm:px-6">
          <span className="text-xl font-bold tracking-tight text-[#E0AAFF]">JobSheets</span>
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={onGetStarted}
              className="rounded-lg border border-[#7B2CBF] px-4 py-2 text-sm font-medium text-[#C77DFF] transition-colors hover:bg-[#3C096C]"
            >
              Log In
            </button>
            <button
              type="button"
              onClick={onGetStarted}
              className="rounded-lg bg-[#7B2CBF] px-4 py-2 text-sm font-medium text-[#E0AAFF] transition-colors hover:bg-[#9D4EDD]"
            >
              Get Started
            </button>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative flex min-h-[100svh] flex-col items-center justify-center overflow-hidden px-4 pb-24 pt-28 text-center sm:px-6 sm:pb-32 sm:pt-32">
        <div className="pointer-events-none absolute inset-0">
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
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-[#10002B]/40 via-transparent to-[#10002B]" />

        <div className="relative z-10 flex flex-col items-center">
          <h1 className="max-w-3xl text-5xl font-bold leading-[1.1] tracking-tight text-[#E0AAFF] sm:text-6xl">
            Track every application.
            <br />
            Land the job.
          </h1>

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
      </section>

      {/* Features */}
      <section className="mx-auto max-w-5xl px-4 pb-24 sm:px-6 sm:pb-32">
        <h2 className="mb-12 text-center text-2xl font-bold text-[#E0AAFF] sm:text-3xl">
          Everything you need to stay organized
        </h2>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-6">
          {features.map(({ icon: Icon, title, description }) => (
            <div
              key={title}
              className="rounded-xl border border-[#3C096C] bg-[#240046] p-6 text-left"
            >
              <Icon className="mb-4 text-[#C77DFF]" size={24} strokeWidth={1.75} />
              <h3 className="mb-2 text-lg font-bold text-[#E0AAFF]">{title}</h3>
              <p className="text-sm leading-relaxed text-[#C77DFF]">{description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="flex flex-col items-center px-4 py-24 text-center sm:px-6 sm:py-32">
        <h2 className="max-w-xl text-2xl font-bold text-[#E0AAFF] sm:text-3xl">
          Ready to take control of your job search?
        </h2>
        <button
          type="button"
          onClick={onGetStarted}
          className="mt-8 rounded-lg bg-[#7B2CBF] px-6 py-3 text-sm font-medium text-[#E0AAFF] transition-colors hover:bg-[#9D4EDD]"
        >
          Get Started
        </button>
      </section>

      {/* Footer */}
      <footer className="border-t border-[#3C096C] px-4 py-8 text-center sm:px-6">
        <p className="text-sm text-[#7B2CBF]">
          Built by Ronan Gamboa ·{' '}
          <a
            href="https://github.com/roleyrogan"
            target="_blank"
            rel="noopener noreferrer"
            className="underline decoration-[#7B2CBF]/40 underline-offset-2 transition-colors hover:text-[#9D4EDD]"
          >
            GitHub
          </a>
        </p>
      </footer>
    </div>
  )
}
