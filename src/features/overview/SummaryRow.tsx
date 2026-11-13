import type { SummaryStats } from '@/lib/stats'

type SummaryRowProps = {
  stats: SummaryStats
}

export function SummaryRow({ stats }: SummaryRowProps) {
  return (
    <section aria-labelledby="overview-summary-heading">
      <h2 id="overview-summary-heading" className="sr-only">
        Summary
      </h2>
      <div className="grid grid-cols-2 gap-4 border-y py-4 sm:grid-cols-4">
        <div className="flex flex-col gap-1">
          <p className="text-2xl font-medium tabular-nums">{stats.total}</p>
          <p className="text-sm text-muted-foreground">Total</p>
        </div>
        <div className="flex flex-col gap-1">
          <p className="text-2xl font-medium tabular-nums">{stats.active}</p>
          <p className="text-sm text-muted-foreground">Active</p>
        </div>
        <div className="flex flex-col gap-1">
          <p className="text-2xl font-medium tabular-nums">{stats.offers}</p>
          <p className="text-sm text-muted-foreground">Offers</p>
        </div>
        <div className="flex flex-col gap-1">
          <p className="text-2xl font-medium tabular-nums">{stats.thisWeek}</p>
          <p className="text-sm text-muted-foreground">This week</p>
          <p className="text-xs text-muted-foreground">
            vs {stats.lastWeek} last week
          </p>
        </div>
      </div>
    </section>
  )
}
