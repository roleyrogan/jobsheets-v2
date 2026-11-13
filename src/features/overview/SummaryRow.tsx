import type { SummaryStats } from '@/lib/stats'
import { cn } from 'cn'

type SummaryRowProps = {
  stats: SummaryStats
}

const CELLS = [
  { key: 'total', label: 'Total' },
  { key: 'active', label: 'Active' },
  { key: 'offers', label: 'Offers' },
  { key: 'thisWeek', label: 'This week' },
] as const

function cellRuleClass(index: number): string {
  // Phone 2×2: rules between columns in a row (indices 0 and 2).
  // Desktop 4-col: rules between all but the last (index 1 also).
  if (index === 0 || index === 2) return 'border-r border-r-rule'
  if (index === 1) return 'sm:border-r sm:border-r-rule'
  return ''
}

export function SummaryRow({ stats }: SummaryRowProps) {
  return (
    <section aria-labelledby="overview-summary-heading">
      <h2 id="overview-summary-heading" className="sr-only">
        Summary
      </h2>
      <div className="grid grid-cols-2 border-b-[3px] border-double border-b-ink sm:grid-cols-4">
        {CELLS.map((cell, index) => (
          <div
            key={cell.key}
            className={cn(
              'flex flex-col gap-1 px-3 py-4',
              cellRuleClass(index),
            )}
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
