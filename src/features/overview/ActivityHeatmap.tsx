import { dailyActivity } from '@/lib/stats'
import {
  buildHeatmapWeeks,
  cellTitle,
  heatmapAriaLabel,
  heatmapOpacity,
} from '@/features/overview/heatmap'
import { formatMonth } from '@/features/overview/format'

type ActivityHeatmapProps = {
  applications: Parameters<typeof dailyActivity>[0]
  now: Date
}

const ROW_LABELS = ['Mon', '', 'Wed', '', 'Fri', '', ''] as const

export function ActivityHeatmap({ applications, now }: ActivityHeatmapProps) {
  const activity = dailyActivity(applications, now, 26 * 7)
  const weeks = buildHeatmapWeeks(activity, now, 26)
  const ariaLabel = heatmapAriaLabel(weeks)

  return (
    <section
      aria-labelledby="overview-activity-heading"
      className="flex flex-col gap-3"
    >
      <h2 id="overview-activity-heading" className="text-sm font-medium">
        Activity
      </h2>

      <div className="overflow-x-auto">
        <div
          role="img"
          aria-label={ariaLabel}
          className="inline-flex gap-2 pb-1"
        >
          <div
            className="grid grid-rows-7 gap-[3px] pt-4 text-[10px] leading-[11px] text-muted-foreground"
            aria-hidden
          >
            {ROW_LABELS.map((label, index) => (
              <span key={index} className="h-[11px]">
                {label}
              </span>
            ))}
          </div>

          <div className="flex flex-col gap-1">
            <div className="flex gap-[3px]">
              {weeks.map((week, index) => {
                const prev = weeks[index - 1]
                const showMonth =
                  index === 0 ||
                  formatMonth(week.weekStart) !==
                    (prev ? formatMonth(prev.weekStart) : '')
                return (
                  <div
                    key={`m-${week.weekStart}`}
                    className="w-[11px] text-[10px] text-muted-foreground"
                  >
                    {showMonth ? formatMonth(week.weekStart) : ''}
                  </div>
                )
              })}
            </div>

            <div
              className="grid grid-flow-col grid-rows-7 gap-[3px]"
              style={{ gridAutoColumns: '11px' }}
            >
              {weeks.flatMap((week) =>
                week.cells.map((cell) => (
                  <div
                    key={cell.date}
                    title={cellTitle(cell)}
                    className={
                      cell.future
                        ? 'size-[11px] rounded-[2px] bg-transparent'
                        : 'size-[11px] rounded-[2px] bg-foreground'
                    }
                    style={
                      cell.future
                        ? undefined
                        : { opacity: heatmapOpacity(cell.count) }
                    }
                  />
                )),
              )}
            </div>
          </div>
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
