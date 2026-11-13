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
  conversion,
}: {
  label: string
  count: number
  max: number
  opacity: number
  conversion: string | null
}) {
  const width = max === 0 ? 0 : (count / max) * 100

  return (
    <div className="grid grid-cols-[5.5rem_minmax(0,1fr)_3rem_4.5rem] items-center gap-3">
      <span className="text-sm">{label}</span>
      <div className="h-3 w-full bg-fill">
        <div
          className="h-full bg-ink"
          style={{ width: `${width}%`, opacity }}
        />
      </div>
      <span className="figure text-right text-sm">{count}</span>
      <span className="figure text-right text-sm">
        {conversion === null ? '' : conversion}
      </span>
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
        <div
          className="grid grid-cols-[5.5rem_minmax(0,1fr)_3rem_4.5rem] items-center gap-3"
          aria-hidden
        >
          <span />
          <span />
          <span />
          <span className="text-right text-xs font-medium">Conversion</span>
        </div>
        <BarRow
          label="Applied"
          count={stats.applied}
          max={stats.applied}
          opacity={1}
          conversion={null}
        />
        <BarRow
          label="Interview"
          count={stats.interview}
          max={stats.applied}
          opacity={0.6}
          conversion={formatPercent(stats.appliedToInterview)}
        />
        <BarRow
          label="Offer"
          count={stats.offer}
          max={stats.applied}
          opacity={0.3}
          conversion={formatPercent(stats.interviewToOffer)}
        />
      </div>
    </section>
  )
}
