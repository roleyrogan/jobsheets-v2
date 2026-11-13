import { motion } from 'motion/react'

import { weeklyCounts, type WeeklyCount } from '@/lib/stats'
import { formatMonthDay } from '@/features/overview/format'
import { useMediaQuery } from '@/features/overview/useMediaQuery'
import { revealTransition } from '@/lib/motion'
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
      <h2 id="overview-weekly-heading">Weekly applications</h2>

      <div className="flex w-full items-end gap-1">
        {weeks.map((week, index) => (
          <WeekBar
            key={week.weekStart}
            week={week}
            max={max}
            current={week.weekStart === currentWeek}
            index={index}
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
  index,
}: {
  week: WeeklyCount
  max: number
  current: boolean
  index: number
}) {
  const height = barHeight(week.count, max)

  return (
    <div className="flex min-w-0 flex-1 flex-col items-center gap-1 text-ink-2">
      <span className="figure text-xs">{week.count}</span>
      <div className="flex h-24 w-full items-end justify-center">
        <motion.div
          className="w-full origin-bottom bg-ink"
          style={{
            height: `${height}px`,
            opacity: current ? 1 : 0.35,
          }}
          initial={{ scaleY: 0 }}
          animate={{ scaleY: 1 }}
          transition={{ ...revealTransition, delay: index * 0.03 }}
          aria-hidden
        />
      </div>
      <span className="max-w-full truncate text-[10px]">
        {formatMonthDay(week.weekStart)}
      </span>
    </div>
  )
}
