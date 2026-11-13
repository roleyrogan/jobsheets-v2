import { toStatus } from '@/lib/status'
import type { Application, ApplicationEvent } from '@/types/index'

export function localYmd(date: Date): string {
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  const year = String(date.getFullYear())
  return `${year}-${month}-${day}`
}

export function startOfLocalDay(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate())
}

export function addLocalDays(date: Date, days: number): Date {
  return new Date(
    date.getFullYear(),
    date.getMonth(),
    date.getDate() + days,
  )
}

/** Monday of the local week containing `date`. */
export function mondayOfWeek(date: Date): Date {
  const start = startOfLocalDay(date)
  const day = start.getDay()
  const offset = day === 0 ? -6 : 1 - day
  return addLocalDays(start, offset)
}

export function calendarDaysBetween(from: Date, to: Date): number {
  const a = startOfLocalDay(from).getTime()
  const b = startOfLocalDay(to).getTime()
  return Math.round((b - a) / (1000 * 60 * 60 * 24))
}

export function eventsForApplication(
  events: ApplicationEvent[],
  applicationId: number,
): ApplicationEvent[] {
  return events.filter((event) => event.application_id === applicationId)
}

export function reachedInterview(
  app: Application,
  events: ApplicationEvent[],
): boolean {
  const current = toStatus(app.status)
  if (current === 'Interview' || current === 'Offer') return true
  return eventsForApplication(events, app.id).some((event) => {
    const status = toStatus(event.status)
    return status === 'Interview' || status === 'Offer'
  })
}

export function reachedOffer(
  app: Application,
  events: ApplicationEvent[],
): boolean {
  if (toStatus(app.status) === 'Offer') return true
  return eventsForApplication(events, app.id).some(
    (event) => toStatus(event.status) === 'Offer',
  )
}

export function hasNonAppliedEvent(
  app: Application,
  events: ApplicationEvent[],
): boolean {
  return eventsForApplication(events, app.id).some(
    (event) => toStatus(event.status) !== 'Applied',
  )
}

export function median(values: number[]): number | null {
  if (values.length === 0) return null
  const sorted = [...values].sort((a, b) => a - b)
  const mid = Math.floor(sorted.length / 2)
  if (sorted.length % 2 === 1) {
    const value = sorted[mid]
    return value === undefined ? null : value
  }
  const lo = sorted[mid - 1]
  const hi = sorted[mid]
  if (lo === undefined || hi === undefined) return null
  return (lo + hi) / 2
}

export function conversionPercent(
  numerator: number,
  denominator: number,
): number | null {
  if (denominator === 0) return null
  return (numerator / denominator) * 100
}
