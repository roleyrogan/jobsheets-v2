import { toStatus } from '@/lib/status'
import {
  calendarDaysBetween,
  eventsForApplication,
  median,
} from '@/lib/stats/helpers'
import type { Application, ApplicationEvent } from '@/types/index'

export type TimeToFirstResponseStats = {
  medianDays: number | null
  sampleSize: number
  excludedUnknownTiming: number
}

function firstNonAppliedEvent(
  app: Application,
  events: ApplicationEvent[],
): ApplicationEvent | undefined {
  const own = eventsForApplication(events, app.id)
    .filter((event) => toStatus(event.status) !== 'Applied')
    .sort((a, b) => a.created_at.localeCompare(b.created_at))
  return own[0]
}

export function timeToFirstResponse(
  apps: Application[],
  events: ApplicationEvent[],
): TimeToFirstResponseStats {
  const samples: number[] = []
  let excludedUnknownTiming = 0

  for (const app of apps) {
    const first = firstNonAppliedEvent(app, events)
    if (!first) continue
    if (!first.timing_known) {
      excludedUnknownTiming += 1
      continue
    }
    samples.push(
      calendarDaysBetween(new Date(app.created_at), new Date(first.created_at)),
    )
  }

  return {
    medianDays: median(samples),
    sampleSize: samples.length,
    excludedUnknownTiming,
  }
}
