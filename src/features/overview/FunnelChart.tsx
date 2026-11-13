import type { ComponentType } from 'react'

import { formatPercent } from '@/features/overview/format'
import {
  StaticFunnelBarFill,
  type FunnelBarFillProps,
} from '@/features/overview/FunnelBarFill'
import type { FunnelStats } from '@/lib/stats'

type FunnelChartProps = {
  stats: FunnelStats
  BarFill?: ComponentType<FunnelBarFillProps>
}

function BarRow({
  label,
  count,
  max,
  opacity,
  conversion,
  BarFill,
}: {
  label: string
  count: number
  max: number
  opacity: number
  conversion: string | null
  BarFill: ComponentType<FunnelBarFillProps>
}) {
  const widthPercent = max === 0 ? 0 : (count / max) * 100

  return (
    <div className="grid grid-cols-[5.5rem_minmax(0,1fr)_3rem_4.5rem] items-center gap-3">
      <span className="text-sm">{label}</span>
      <div className="h-3 w-full bg-fill">
        <BarFill widthPercent={widthPercent} opacity={opacity} />
      </div>
      <span className="figure text-right text-sm">{count}</span>
      <span className="figure text-right text-sm">
        {conversion === null ? '' : conversion}
      </span>
    </div>
  )
}

export function FunnelChart({
  stats,
  BarFill = StaticFunnelBarFill,
}: FunnelChartProps) {
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
          BarFill={BarFill}
        />
        <BarRow
          label="Interview"
          count={stats.interview}
          max={stats.applied}
          opacity={0.6}
          conversion={formatPercent(stats.appliedToInterview)}
          BarFill={BarFill}
        />
        <BarRow
          label="Offer"
          count={stats.offer}
          max={stats.applied}
          opacity={0.3}
          conversion={formatPercent(stats.interviewToOffer)}
          BarFill={BarFill}
        />
      </div>
    </section>
  )
}
