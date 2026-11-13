import { toStatus } from '@/lib/status'
import {
  conversionPercent,
  hasNonAppliedEvent,
  reachedInterview,
  reachedOffer,
} from '@/lib/stats/helpers'
import type { Application, ApplicationEvent } from '@/types/index'

export type FunnelStats = {
  applied: number
  interview: number
  offer: number
  appliedToInterview: number | null
  interviewToOffer: number | null
}

export type OutcomeStats = {
  rejectedWithoutInterview: number
  rejectedAfterInterview: number
  offers: number
  active: number
}

export function funnel(
  apps: Application[],
  events: ApplicationEvent[],
): FunnelStats {
  const applied = apps.length
  let interview = 0
  let offer = 0

  for (const app of apps) {
    if (reachedInterview(app, events)) interview += 1
    if (reachedOffer(app, events)) offer += 1
  }

  return {
    applied,
    interview,
    offer,
    appliedToInterview: conversionPercent(interview, applied),
    interviewToOffer: conversionPercent(offer, interview),
  }
}

export function outcomes(
  apps: Application[],
  events: ApplicationEvent[],
): OutcomeStats {
  let rejectedWithoutInterview = 0
  let rejectedAfterInterview = 0
  let offers = 0
  let active = 0

  for (const app of apps) {
    const status = toStatus(app.status)
    if (status === 'Offer') {
      offers += 1
      continue
    }
    if (status === 'Applied' || status === 'Interview') {
      active += 1
      continue
    }
    if (status === 'Rejected') {
      if (reachedInterview(app, events)) {
        rejectedAfterInterview += 1
      } else {
        rejectedWithoutInterview += 1
      }
    }
  }

  return {
    rejectedWithoutInterview,
    rejectedAfterInterview,
    offers,
    active,
  }
}

export function responseRate(
  apps: Application[],
  events: ApplicationEvent[],
): number | null {
  if (apps.length === 0) return null
  let responded = 0
  for (const app of apps) {
    if (hasNonAppliedEvent(app, events)) responded += 1
  }
  return responded / apps.length
}
