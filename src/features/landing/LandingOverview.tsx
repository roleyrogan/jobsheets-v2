import { FunnelChart } from '@/features/overview/FunnelChart'
import { SummaryRow } from '@/features/overview/SummaryRow'
import {
  SAMPLE_FUNNEL,
  SAMPLE_SUMMARY,
} from '@/features/landing/sampleData'

export function LandingOverview() {
  return (
    <section
      aria-labelledby="landing-overview-heading"
      className="flex flex-col gap-6"
    >
      <div className="flex max-w-[60ch] flex-col gap-2">
        <h2 id="landing-overview-heading">See where your search stands</h2>
        <p className="text-sm text-ink-2">
          Totals, a funnel of how applications move, and what still needs a
          response.
        </p>
      </div>
      <div className="flex flex-col gap-8">
        <SummaryRow stats={SAMPLE_SUMMARY} />
        <FunnelChart stats={SAMPLE_FUNNEL} />
      </div>
    </section>
  )
}
