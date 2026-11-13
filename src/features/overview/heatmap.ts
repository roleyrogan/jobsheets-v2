import {
  addLocalDays,
  localYmd,
  mondayOfWeek,
  startOfLocalDay,
} from '@/lib/stats/helpers'
import type { DailyCount } from '@/lib/stats'
import { applicationWord, formatMonthDayYear } from '@/features/overview/format'

export type HeatmapCell = {
  date: string
  count: number
  future: boolean
}

export type HeatmapWeek = {
  weekStart: string
  cells: HeatmapCell[]
}

const OPACITIES = [0.06, 0.25, 0.45, 0.7, 1] as const

export function heatmapOpacity(count: number): number {
  if (count <= 0) return OPACITIES[0]
  if (count === 1) return OPACITIES[1]
  if (count <= 3) return OPACITIES[2]
  if (count <= 5) return OPACITIES[3]
  return OPACITIES[4]
}

export function buildHeatmapWeeks(
  activity: DailyCount[],
  now: Date,
  weeks = 26,
): HeatmapWeek[] {
  const counts = new Map(activity.map((day) => [day.date, day.count]))
  const today = startOfLocalDay(now)
  const thisMonday = mondayOfWeek(now)
  const oldestMonday = addLocalDays(thisMonday, -(weeks - 1) * 7)
  const result: HeatmapWeek[] = []

  for (let w = 0; w < weeks; w += 1) {
    const weekStart = addLocalDays(oldestMonday, w * 7)
    const cells: HeatmapCell[] = []
    for (let d = 0; d < 7; d += 1) {
      const date = addLocalDays(weekStart, d)
      const key = localYmd(date)
      const future = date.getTime() > today.getTime()
      cells.push({
        date: key,
        count: future ? 0 : (counts.get(key) ?? 0),
        future,
      })
    }
    result.push({ weekStart: localYmd(weekStart), cells })
  }

  return result
}

export function heatmapAriaLabel(weeks: HeatmapWeek[]): string {
  let total = 0
  let mostWeek = weeks[0]?.weekStart ?? ''
  let mostCount = 0

  for (const week of weeks) {
    let weekTotal = 0
    for (const cell of week.cells) {
      if (!cell.future) {
        total += cell.count
        weekTotal += cell.count
      }
    }
    if (weekTotal >= mostCount) {
      mostCount = weekTotal
      mostWeek = week.weekStart
    }
  }

  return `${total} ${applicationWord(total)} in the last ${weeks.length} weeks, most active week: ${mostWeek} with ${mostCount}`
}

export function cellTitle(cell: HeatmapCell): string {
  if (cell.future) return `Future day ${formatMonthDayYear(cell.date)}`
  return `${cell.count} ${applicationWord(cell.count)} on ${formatMonthDayYear(cell.date)}`
}
