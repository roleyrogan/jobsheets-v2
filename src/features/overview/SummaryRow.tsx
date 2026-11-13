import type { SummaryStats } from '@/lib/stats'

type SummaryRowProps = {
  stats: SummaryStats
}

const CELLS = [
  { key: 'total', label: 'Total' },
  { key: 'active', label: 'Active' },
  { key: 'offers', label: 'Offers' },
  { key: 'thisWeek', label: 'This week' },
] as const

export function SummaryRow({ stats }: SummaryRowProps) {
  return (
    <section aria-labelledby="overview-summary-heading">
      <h2 id="overview-summary-heading" className="sr-only">
        Summary
      </h2>
      <div className="grid grid-cols-2 border-b-[3px] border-double border-ink sm:grid-cols-4">
        {CELLS.map((cell, index) => (
          <div
            key={cell.key}
            className={
              index < CELLS.length - 1
                ? 'flex flex-col gap-1 border-r border-rule px-3 py-4 sm:border-r'
                : 'flex flex-col gap-1 px-3 py-4'
            }
          >
            <p className="figure text-[32px] leading-9">{stats[cell.key]}</p>
            <p className="text-sm text-ink-2">{cell.label}</p>
            {cell.key === 'thisWeek' ? (
              <p className="text-xs text-ink-2">
                vs {stats.lastWeek} last week
              </p>
            ) : null}
          </div>
        ))}
      </div>
    </section>
  )
}
