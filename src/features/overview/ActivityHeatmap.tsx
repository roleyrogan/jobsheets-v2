import { useLayoutEffect, useRef } from 'react'

import { dailyActivity } from '@/lib/stats'
import {
  buildHeatmapWeeks,
  cellTitle,
  heatmapAriaLabel,
  heatmapOpacity,
  monthLabels,
} from '@/features/overview/heatmap'
import type { Application } from '@/types/index'

type ActivityHeatmapProps = {
  applications: Application[]
  now: Date
}

const ROW_LABELS = ['Mon', '', 'Wed', '', 'Fri', '', ''] as const
const WEEK_COUNT = 26
const GRID_MIN = `calc(${WEEK_COUNT} * 11px + ${WEEK_COUNT - 1} * 3px)`
const GRID_MAX = `calc(${WEEK_COUNT} * 18px + ${WEEK_COUNT - 1} * 3px)`

export function ActivityHeatmap({ applications, now }: ActivityHeatmapProps) {
  const scrollRef = useRef<HTMLDivElement>(null)
  const activity = dailyActivity(applications, now, WEEK_COUNT * 7)
  const weeks = buildHeatmapWeeks(activity, now, WEEK_COUNT)
  const labels = monthLabels(weeks)
  const ariaLabel = heatmapAriaLabel(weeks)

  useLayoutEffect(() => {
    const node = scrollRef.current
    if (!node) return
    node.scrollLeft = node.scrollWidth
  }, [applications, now])

  return (
    <section
      aria-labelledby="overview-activity-heading"
      className="flex flex-col gap-3"
    >
      <h2 id="overview-activity-heading" className="text-sm font-medium">
        Activity
      </h2>

      <div ref={scrollRef} className="overflow-x-auto">
        <div
          role="img"
          aria-label={ariaLabel}
          className="grid w-full gap-[3px] pb-1"
          style={{
            gridTemplateColumns: `1.75rem repeat(${WEEK_COUNT}, minmax(0, 1fr))`,
            minWidth: `calc(1.75rem + 3px + ${GRID_MIN})`,
            maxWidth: `calc(1.75rem + 3px + ${GRID_MAX})`,
          }}
        >
          <div aria-hidden />
          {labels.map((label, index) => (
            <div
              key={`m-${weeks[index]?.weekStart ?? index}`}
              className="text-[10px] leading-none text-muted-foreground"
            >
              {label ?? ''}
            </div>
          ))}

          {ROW_LABELS.map((label, row) => (
            <DayRow key={row} label={label} weeks={weeks} row={row} />
          ))}
        </div>
      </div>

      <p className="flex items-center gap-1 text-xs text-muted-foreground">
        Less
        {[0, 1, 2, 4, 6].map((count) => (
          <span
            key={count}
            className="inline-block size-[11px] rounded-[2px] bg-foreground"
            style={{ opacity: heatmapOpacity(count) }}
            aria-hidden
          />
        ))}
        More
      </p>
    </section>
  )
}

function DayRow({
  label,
  weeks,
  row,
}: {
  label: string
  weeks: ReturnType<typeof buildHeatmapWeeks>
  row: number
}) {
  return (
    <>
      <span
        className="flex items-center justify-end pr-0.5 text-[10px] leading-none text-muted-foreground"
        aria-hidden
      >
        {label}
      </span>
      {weeks.map((week) => {
        const cell = week.cells[row]
        if (!cell) return null
        return (
          <div
            key={cell.date}
            title={cellTitle(cell)}
            className={
              cell.future
                ? 'aspect-square w-full rounded-[2px] bg-transparent'
                : 'aspect-square w-full rounded-[2px] bg-foreground'
            }
            style={
              cell.future ? undefined : { opacity: heatmapOpacity(cell.count) }
            }
          />
        )
      })}
    </>
  )
}
