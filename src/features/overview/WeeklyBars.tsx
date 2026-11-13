import { weeklyCounts, type WeeklyCount } from '@/lib/stats'
import { formatMonthDay } from '@/features/overview/format'
import { useMediaQuery } from '@/features/overview/useMediaQuery'
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
  const isNarrow = useMediaQuery('(max-width: 639px)')
  const weekCount = isNarrow ? 8 : 12
  const weeks = weeklyCounts(applications, now, weekCount)
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

      <div className="flex w-full items-end gap-1">
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
          ? 'flex min-w-0 flex-1 flex-col items-center gap-1 text-foreground'
          : 'flex min-w-0 flex-1 flex-col items-center gap-1 text-muted-foreground'
      }
    >
      <span className="text-xs tabular-nums">{week.count}</span>
      <div className="flex h-24 w-full items-end justify-center">
        <div
          className={
            current
              ? 'w-full rounded-sm bg-foreground'
              : 'w-full rounded-sm bg-foreground/40'
          }
          style={{ height: `${height}px` }}
          aria-hidden
        />
      </div>
      <span className="max-w-full truncate text-[10px]">
        {formatMonthDay(week.weekStart)}
      </span>
    </div>
  )
}
