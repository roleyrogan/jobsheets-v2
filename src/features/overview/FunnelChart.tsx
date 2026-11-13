import { formatPercent } from '@/features/overview/format'
import type { FunnelStats } from '@/lib/stats'

type FunnelChartProps = {
  stats: FunnelStats
}

function BarRow({
  label,
  count,
  max,
  opacity,
}: {
  label: string
  count: number
  max: number
  opacity: number
}) {
  const width = max === 0 ? 0 : (count / max) * 100

  return (
    <div className="grid grid-cols-[5.5rem_minmax(0,1fr)_3rem] items-center gap-3">
      <span className="text-sm">{label}</span>
      <div className="h-3 w-full bg-fill">
        <div
          className="h-full bg-ink"
          style={{ width: `${width}%`, opacity }}
        />
      </div>
      <span className="figure text-right text-sm">{count}</span>
    </div>
  )
}

function ConversionCell({ rate }: { rate: number | null }) {
  return (
    <div className="grid grid-cols-[5.5rem_minmax(0,1fr)_3rem] gap-3">
      <span aria-hidden />
      <span className="figure text-right text-sm text-ink-2">
        {formatPercent(rate)}
      </span>
      <span aria-hidden />
    </div>
  )
}

export function FunnelChart({ stats }: FunnelChartProps) {
  return (
    <section
      aria-labelledby="overview-funnel-heading"
      className="flex flex-col gap-3"
    >
      <h2 id="overview-funnel-heading">Funnel</h2>
      <div className="flex flex-col gap-2">
        <BarRow
          label="Applied"
          count={stats.applied}
          max={stats.applied}
          opacity={1}
        />
        <ConversionCell rate={stats.appliedToInterview} />
        <BarRow
          label="Interview"
          count={stats.interview}
          max={stats.applied}
          opacity={0.6}
        />
        <ConversionCell rate={stats.interviewToOffer} />
        <BarRow
          label="Offer"
          count={stats.offer}
          max={stats.applied}
          opacity={0.3}
        />
      </div>
    </section>
  )
}
