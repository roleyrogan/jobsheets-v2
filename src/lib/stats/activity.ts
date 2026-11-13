import { toStatus } from '@/lib/status'
import {
  addLocalDays,
  localYmd,
  mondayOfWeek,
  startOfLocalDay,
} from '@/lib/stats/helpers'
import type { Application } from '@/types/index'

export type DailyCount = {
  date: string
  count: number
}

export type WeeklyCount = {
  weekStart: string
  count: number
}

export type SummaryStats = {
  total: number
  active: number
  offers: number
  thisWeek: number
  lastWeek: number
}

export function dailyActivity(
  apps: Application[],
  now: Date,
  days = 182,
): DailyCount[] {
  const today = startOfLocalDay(now)
  const start = addLocalDays(today, -(days - 1))
  const counts = new Map<string, number>()

  for (let i = 0; i < days; i += 1) {
    counts.set(localYmd(addLocalDays(start, i)), 0)
  }

  for (const app of apps) {
    const key = localYmd(new Date(app.created_at))
    const current = counts.get(key)
    if (current === undefined) continue
    counts.set(key, current + 1)
  }

  const result: DailyCount[] = []
  for (let i = 0; i < days; i += 1) {
    const date = localYmd(addLocalDays(start, i))
    result.push({ date, count: counts.get(date) ?? 0 })
  }
  return result
}

export function weeklyCounts(
  apps: Application[],
  now: Date,
  weeks = 12,
): WeeklyCount[] {
  const thisMonday = mondayOfWeek(now)
  const oldestMonday = addLocalDays(thisMonday, -(weeks - 1) * 7)
  const counts = new Map<string, number>()

  for (let i = 0; i < weeks; i += 1) {
    counts.set(localYmd(addLocalDays(oldestMonday, i * 7)), 0)
  }

  for (const app of apps) {
    const weekStart = localYmd(mondayOfWeek(new Date(app.created_at)))
    const current = counts.get(weekStart)
    if (current === undefined) continue
    counts.set(weekStart, current + 1)
  }

  const result: WeeklyCount[] = []
  for (let i = 0; i < weeks; i += 1) {
    const weekStart = localYmd(addLocalDays(oldestMonday, i * 7))
    result.push({ weekStart, count: counts.get(weekStart) ?? 0 })
  }
  return result
}

export function summary(apps: Application[], now: Date): SummaryStats {
  const thisMonday = mondayOfWeek(now)
  const lastMonday = addLocalDays(thisMonday, -7)
  const nextMonday = addLocalDays(thisMonday, 7)

  let active = 0
  let offers = 0
  let thisWeek = 0
  let lastWeek = 0

  for (const app of apps) {
    const status = toStatus(app.status)
    if (status === 'Applied' || status === 'Interview') active += 1
    if (status === 'Offer') offers += 1

    const created = new Date(app.created_at).getTime()
    if (created >= thisMonday.getTime() && created < nextMonday.getTime()) {
      thisWeek += 1
    } else if (
      created >= lastMonday.getTime() &&
      created < thisMonday.getTime()
    ) {
      lastWeek += 1
    }
  }

  return {
    total: apps.length,
    active,
    offers,
    thisWeek,
    lastWeek,
  }
}
