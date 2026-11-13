import { weeklyCounts, type WeeklyCount } from '@/lib/stats'
import { formatMonthDay } from '@/features/overview/format'
import { localYmd, mondayOfWeek } from '@/lib/stats/helpers'
import type { Application } from '@/types/index'

type WeeklyBarsProps = {
  applications: Application[]
  now: Date
}

function barHeight(count: number, max: number): number {
  if (count <= 0 || max <= 0) return 0
  const min = 8
  const maxPx = 96
  return Math.max(min, Math.round((count / max) * maxPx))
}

export function WeeklyBars({ applications, now }: WeeklyBarsProps) {
  const weeks = weeklyCounts(applications, now, 12)
  const max = weeks.reduce((peak, week) => Math.max(peak, week.count), 0)
  const currentWeek = localYmd(mondayOfWeek(now))

  return (
    <section
      aria-labelledby="overview-weekly-heading"
      className="flex flex-col gap-3"
    >
      <h2 id="overview-weekly-heading" className="text-sm font-medium">
        Weekly applications
      </h2>

      <div className="flex items-end justify-between gap-1 overflow-x-auto pb-1">
        {weeks.map((week) => (
          <WeekBar
            key={week.weekStart}
            week={week}
            max={max}
            current={week.weekStart === currentWeek}
          />
        ))}
      </div>
    </section>
  )
}

function WeekBar({
  week,
  max,
  current,
}: {
  week: WeeklyCount
  max: number
  current: boolean
}) {
  const height = barHeight(week.count, max)

  return (
    <div
      className={
        current
          ? 'flex min-w-8 flex-1 flex-col items-center gap-1 text-foreground'
          : 'flex min-w-8 flex-1 flex-col items-center gap-1 text-muted-foreground'
      }
    >
      <span className="text-xs tabular-nums">{week.count}</span>
      <div className="flex h-24 w-full items-end justify-center">
        <div
          className={
            current
              ? 'w-full max-w-6 rounded-sm bg-foreground'
              : 'w-full max-w-6 rounded-sm bg-foreground/40'
          }
          style={{ height: `${height}px` }}
          aria-hidden
        />
      </div>
      <span className="text-[10px] whitespace-nowrap">
        {formatMonthDay(week.weekStart)}
      </span>
    </div>
  )
}
