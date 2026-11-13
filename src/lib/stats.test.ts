import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import {
  getGhostAfterDays,
  setGhostAfterDays,
} from '@/lib/ghostSetting'
import {
  dailyActivity,
  funnel,
  ghosted,
  outcomes,
  responseRate,
  summary,
  timeToFirstResponse,
  weeklyCounts,
} from '@/lib/stats'
import type { Application, ApplicationEvent } from '@/types/index'

const NOW = new Date(2026, 2, 9, 12, 0, 0) // Monday 9 Mar 2026 local

function app(
  partial: Partial<Application> &
    Pick<Application, 'id' | 'company' | 'role' | 'status' | 'created_at'>,
): Application {
  return {
    user_id: 'user-1',
    application_url: null,
    location: null,
    notes: null,
    ...partial,
  }
}

function event(
  partial: Partial<ApplicationEvent> &
    Pick<
      ApplicationEvent,
      'id' | 'application_id' | 'status' | 'created_at' | 'timing_known'
    >,
): ApplicationEvent {
  return {
    user_id: 'user-1',
    ...partial,
  }
}

describe('funnel', () => {
  it('returns zeros and null conversions for empty input', () => {
    expect(funnel([], [])).toEqual({
      applied: 0,
      interview: 0,
      offer: 0,
      appliedToInterview: null,
      interviewToOffer: null,
    })
  })

  it('counts Offer as Interview even without an Interview event', () => {
    const apps = [
      app({
        id: 1,
        company: 'Acme',
        role: 'SWE',
        status: 'Offer',
        created_at: '2026-01-01T12:00:00.000Z',
      }),
    ]
    const events = [
      event({
        id: 1,
        application_id: 1,
        status: 'Applied',
        timing_known: true,
        created_at: '2026-01-01T12:00:00.000Z',
      }),
      event({
        id: 2,
        application_id: 1,
        status: 'Offer',
        timing_known: true,
        created_at: '2026-01-10T12:00:00.000Z',
      }),
    ]
    const result = funnel(apps, events)
    expect(result.applied).toBe(1)
    expect(result.interview).toBe(1)
    expect(result.offer).toBe(1)
    expect(result.appliedToInterview).toBe(100)
    expect(result.interviewToOffer).toBe(100)
  })

  it('includes rejected-after-interview in Interview stage', () => {
    const apps = [
      app({
        id: 1,
        company: 'Acme',
        role: 'SWE',
        status: 'Rejected',
        created_at: '2026-01-01T12:00:00.000Z',
      }),
    ]
    const events = [
      event({
        id: 1,
        application_id: 1,
        status: 'Interview',
        timing_known: true,
        created_at: '2026-01-05T12:00:00.000Z',
      }),
      event({
        id: 2,
        application_id: 1,
        status: 'Rejected',
        timing_known: true,
        created_at: '2026-01-20T12:00:00.000Z',
      }),
    ]
    expect(funnel(apps, events).interview).toBe(1)
  })
})

describe('outcomes', () => {
  it('buckets each outcome', () => {
    const apps = [
      app({
        id: 1,
        company: 'A',
        role: 'R',
        status: 'Rejected',
        created_at: '2026-01-01T12:00:00.000Z',
      }),
      app({
        id: 2,
        company: 'B',
        role: 'R',
        status: 'Rejected',
        created_at: '2026-01-02T12:00:00.000Z',
      }),
      app({
        id: 3,
        company: 'C',
        role: 'R',
        status: 'Offer',
        created_at: '2026-01-03T12:00:00.000Z',
      }),
      app({
        id: 4,
        company: 'D',
        role: 'R',
        status: 'Applied',
        created_at: '2026-01-04T12:00:00.000Z',
      }),
      app({
        id: 5,
        company: 'E',
        role: 'R',
        status: 'Interview',
        created_at: '2026-01-05T12:00:00.000Z',
      }),
    ]
    const events = [
      event({
        id: 1,
        application_id: 2,
        status: 'Interview',
        timing_known: true,
        created_at: '2026-01-10T12:00:00.000Z',
      }),
    ]
    expect(outcomes(apps, events)).toEqual({
      rejectedWithoutInterview: 1,
      rejectedAfterInterview: 1,
      offers: 1,
      active: 2,
    })
  })
})

describe('responseRate', () => {
  it('returns null with no applications', () => {
    expect(responseRate([], [])).toBeNull()
  })

  it('returns 0 when none responded', () => {
    const apps = [
      app({
        id: 1,
        company: 'A',
        role: 'R',
        status: 'Applied',
        created_at: '2026-01-01T12:00:00.000Z',
      }),
    ]
    expect(responseRate(apps, [])).toBe(0)
  })

  it('returns share when some or all responded', () => {
    const apps = [
      app({
        id: 1,
        company: 'A',
        role: 'R',
        status: 'Applied',
        created_at: '2026-01-01T12:00:00.000Z',
      }),
      app({
        id: 2,
        company: 'B',
        role: 'R',
        status: 'Interview',
        created_at: '2026-01-02T12:00:00.000Z',
      }),
    ]
    const events = [
      event({
        id: 1,
        application_id: 2,
        status: 'Interview',
        timing_known: true,
        created_at: '2026-01-05T12:00:00.000Z',
      }),
    ]
    expect(responseRate(apps, events)).toBe(50)

    const allEvents = [
      ...events,
      event({
        id: 2,
        application_id: 1,
        status: 'Rejected',
        timing_known: true,
        created_at: '2026-01-06T12:00:00.000Z',
      }),
    ]
    expect(responseRate(apps, allEvents)).toBe(100)
  })
})

describe('timeToFirstResponse', () => {
  it('computes median for odd and even samples', () => {
    const apps = [
      app({
        id: 1,
        company: 'A',
        role: 'R',
        status: 'Interview',
        created_at: new Date(2026, 0, 1).toISOString(),
      }),
      app({
        id: 2,
        company: 'B',
        role: 'R',
        status: 'Interview',
        created_at: new Date(2026, 0, 1).toISOString(),
      }),
      app({
        id: 3,
        company: 'C',
        role: 'R',
        status: 'Interview',
        created_at: new Date(2026, 0, 1).toISOString(),
      }),
    ]
    const events = [
      event({
        id: 1,
        application_id: 1,
        status: 'Interview',
        timing_known: true,
        created_at: new Date(2026, 0, 3).toISOString(),
      }),
      event({
        id: 2,
        application_id: 2,
        status: 'Interview',
        timing_known: true,
        created_at: new Date(2026, 0, 5).toISOString(),
      }),
      event({
        id: 3,
        application_id: 3,
        status: 'Interview',
        timing_known: true,
        created_at: new Date(2026, 0, 7).toISOString(),
      }),
    ]
    expect(timeToFirstResponse(apps, events)).toEqual({
      medianDays: 4,
      sampleSize: 3,
      excludedUnknownTiming: 0,
    })
    expect(timeToFirstResponse(apps.slice(0, 2), events)).toEqual({
      medianDays: 3,
      sampleSize: 2,
      excludedUnknownTiming: 0,
    })
  })

  it('excludes unknown timing and apps with no response', () => {
    const apps = [
      app({
        id: 1,
        company: 'A',
        role: 'R',
        status: 'Interview',
        created_at: new Date(2026, 0, 1).toISOString(),
      }),
      app({
        id: 2,
        company: 'B',
        role: 'R',
        status: 'Applied',
        created_at: new Date(2026, 0, 1).toISOString(),
      }),
    ]
    const events = [
      event({
        id: 1,
        application_id: 1,
        status: 'Interview',
        timing_known: false,
        created_at: new Date(2026, 0, 5).toISOString(),
      }),
    ]
    expect(timeToFirstResponse(apps, events)).toEqual({
      medianDays: null,
      sampleSize: 0,
      excludedUnknownTiming: 1,
    })
  })
})

describe('dailyActivity', () => {
  it('includes zeros, today, and local-day buckets', () => {
    const lateEvening = new Date(2026, 2, 9, 23, 30, 0)
    const apps = [
      app({
        id: 1,
        company: 'A',
        role: 'R',
        status: 'Applied',
        created_at: lateEvening.toISOString(),
      }),
    ]
    const result = dailyActivity(apps, NOW, 3)
    expect(result).toHaveLength(3)
    expect(result[0]?.date).toBe('2026-03-07')
    expect(result[1]).toEqual({ date: '2026-03-08', count: 0 })
    expect(result[2]).toEqual({ date: '2026-03-09', count: 1 })
  })
})

describe('weeklyCounts', () => {
  it('uses Monday starts, oldest first, with zeros', () => {
    const apps = [
      app({
        id: 1,
        company: 'A',
        role: 'R',
        status: 'Applied',
        created_at: new Date(2026, 2, 10, 9, 0, 0).toISOString(),
      }),
    ]
    const result = weeklyCounts(apps, NOW, 3)
    expect(result).toEqual([
      { weekStart: '2026-02-23', count: 0 },
      { weekStart: '2026-03-02', count: 0 },
      { weekStart: '2026-03-09', count: 1 },
    ])
  })
})

describe('ghosted', () => {
  it('requires more than afterDays with no non-Applied events', () => {
    const afterDays = 21
    const exactly = new Date(2026, 2, 9 - 21, 12, 0, 0)
    const older = new Date(2026, 2, 9 - 22, 12, 0, 0)
    const withInterview = new Date(2026, 2, 9 - 40, 12, 0, 0)

    const apps = [
      app({
        id: 1,
        company: 'Exact',
        role: 'R',
        status: 'Applied',
        created_at: exactly.toISOString(),
      }),
      app({
        id: 2,
        company: 'Older',
        role: 'R',
        status: 'Applied',
        created_at: older.toISOString(),
      }),
      app({
        id: 3,
        company: 'Moved',
        role: 'R',
        status: 'Applied',
        created_at: withInterview.toISOString(),
      }),
    ]
    const events = [
      event({
        id: 1,
        application_id: 3,
        status: 'Interview',
        timing_known: true,
        created_at: new Date(2026, 1, 1).toISOString(),
      }),
    ]

    const result = ghosted(apps, events, NOW, afterDays)
    expect(result.map((item) => item.application.id)).toEqual([2])
    expect(result[0]?.daysSince).toBe(22)
  })

  it('sorts oldest first', () => {
    const apps = [
      app({
        id: 1,
        company: 'Newer',
        role: 'R',
        status: 'Applied',
        created_at: new Date(2026, 2, 9 - 25, 12, 0, 0).toISOString(),
      }),
      app({
        id: 2,
        company: 'Older',
        role: 'R',
        status: 'Applied',
        created_at: new Date(2026, 2, 9 - 40, 12, 0, 0).toISOString(),
      }),
    ]
    expect(ghosted(apps, [], NOW, 21).map((item) => item.application.id)).toEqual([
      2, 1,
    ])
  })
})

describe('summary', () => {
  it('splits this week and last week on a Monday boundary', () => {
    const apps = [
      app({
        id: 1,
        company: 'This',
        role: 'R',
        status: 'Applied',
        created_at: new Date(2026, 2, 9, 8, 0, 0).toISOString(),
      }),
      app({
        id: 2,
        company: 'Last',
        role: 'R',
        status: 'Interview',
        created_at: new Date(2026, 2, 8, 18, 0, 0).toISOString(),
      }),
      app({
        id: 3,
        company: 'Offer',
        role: 'R',
        status: 'Offer',
        created_at: new Date(2026, 1, 1).toISOString(),
      }),
    ]
    expect(summary(apps, NOW)).toEqual({
      total: 3,
      active: 2,
      offers: 1,
      thisWeek: 1,
      lastWeek: 1,
    })
  })
})

describe('ghostSetting', () => {
  const memory = new Map<string, string>()

  beforeEach(() => {
    memory.clear()
    vi.stubGlobal('localStorage', {
      getItem: (key: string) => memory.get(key) ?? null,
      setItem: (key: string, value: string) => {
        memory.set(key, value)
      },
      removeItem: (key: string) => {
        memory.delete(key)
      },
    })
  })

  afterEach(() => {
    vi.unstubAllGlobals()
  })

  it('falls back to 21 for invalid stored values', () => {
    localStorage.setItem('jobsheets:ghostAfterDays', 'nope')
    expect(getGhostAfterDays()).toBe(21)

    localStorage.setItem('jobsheets:ghostAfterDays', '3')
    expect(getGhostAfterDays()).toBe(21)

    localStorage.setItem('jobsheets:ghostAfterDays', '100')
    expect(getGhostAfterDays()).toBe(21)

    setGhostAfterDays(30)
    expect(getGhostAfterDays()).toBe(30)
  })
})
