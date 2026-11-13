import { formatPercent } from '@/features/overview/format'
import type { FunnelStats } from '@/lib/stats'

type FunnelChartProps = {
  stats: FunnelStats
}

function Bar({
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
    <div className="flex flex-col gap-1">
      <div className="flex items-baseline justify-between gap-2 text-sm">
        <span>{label}</span>
        <span className="tabular-nums text-muted-foreground">{count}</span>
      </div>
      <div className="h-2.5 w-full rounded-sm bg-muted">
        <div
          className="h-full rounded-sm bg-foreground"
          style={{ width: `${width}%`, opacity }}
        />
      </div>
    </div>
  )
}

export function FunnelChart({ stats }: FunnelChartProps) {
  return (
    <section aria-labelledby="overview-funnel-heading" className="flex flex-col gap-3">
      <h2 id="overview-funnel-heading" className="text-sm font-medium">
        Funnel
      </h2>
      <div className="flex flex-col gap-3">
        <Bar
          label="Applied"
          count={stats.applied}
          max={stats.applied}
          opacity={1}
        />
        <p className="text-sm text-muted-foreground">
          {formatPercent(stats.appliedToInterview)} reached interview
        </p>
        <Bar
          label="Interview"
          count={stats.interview}
          max={stats.applied}
          opacity={0.7}
        />
        <p className="text-sm text-muted-foreground">
          {formatPercent(stats.interviewToOffer)} of interviews → offer
        </p>
        <Bar
          label="Offer"
          count={stats.offer}
          max={stats.applied}
          opacity={0.4}
        />
      </div>
    </section>
  )
}
