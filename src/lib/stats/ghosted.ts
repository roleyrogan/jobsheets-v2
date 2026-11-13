import { toStatus } from '@/lib/status'
import {
  calendarDaysBetween,
  hasNonAppliedEvent,
} from '@/lib/stats/helpers'
import type { Application, ApplicationEvent } from '@/types/index'

export type GhostedItem = {
  application: Application
  daysSince: number
}

export function ghosted(
  apps: Application[],
  events: ApplicationEvent[],
  now: Date,
  afterDays: number,
): GhostedItem[] {
  const result: GhostedItem[] = []

  for (const app of apps) {
    if (toStatus(app.status) !== 'Applied') continue
    if (hasNonAppliedEvent(app, events)) continue

    const daysSince = calendarDaysBetween(new Date(app.created_at), now)
    if (daysSince <= afterDays) continue

    result.push({ application: app, daysSince })
  }

  return result.sort((a, b) => b.daysSince - a.daysSince)
}
