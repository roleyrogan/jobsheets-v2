import { describe, expect, it } from 'vitest'

import {
  countByStatus,
  filterAndSort,
  filtersToParams,
  parseFilters,
  searchApplications,
  type ApplicationFilters,
} from '@/lib/applicationFilters'
import type { Application } from '@/types/index'

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

const sample: Application[] = [
  app({
    id: 1,
    company: 'Shopify',
    role: 'Frontend',
    status: 'Interview',
    location: 'Toronto',
    notes: 'Referral',
    created_at: '2026-03-01T12:00:00.000Z',
  }),
  app({
    id: 2,
    company: 'Amazon',
    role: 'SDE',
    status: 'Applied',
    location: 'Seattle',
    notes: null,
    created_at: '2026-02-01T12:00:00.000Z',
  }),
  app({
    id: 3,
    company: 'Google',
    role: 'SWE',
    status: 'Offer',
    location: null,
    notes: 'Onsite done',
    created_at: '2026-01-01T12:00:00.000Z',
  }),
  app({
    id: 4,
    company: 'Meta',
    role: 'PM',
    status: 'Rejected',
    location: 'Remote',
    notes: null,
    created_at: '2026-04-01T12:00:00.000Z',
  }),
]

describe('parseFilters', () => {
  it('parses valid params', () => {
    const params = new URLSearchParams(
      'q=shop&status=Interview&sort=company',
    )
    expect(parseFilters(params)).toEqual({
      q: 'shop',
      status: 'Interview',
      sort: 'company',
    })
  })

  it('falls back on junk values', () => {
    const params = new URLSearchParams('status=banana&sort=nope')
    expect(parseFilters(params)).toEqual({
      q: '',
      status: 'all',
      sort: 'newest',
    })
  })

  it('uses defaults when params are missing', () => {
    expect(parseFilters(new URLSearchParams())).toEqual({
      q: '',
      status: 'all',
      sort: 'newest',
    })
  })
})

describe('filtersToParams', () => {
  it('omits default values', () => {
    const params = filtersToParams({
      q: '',
      status: 'all',
      sort: 'newest',
    })
    expect(params.toString()).toBe('')
  })

  it('round-trips with parseFilters', () => {
    const filters: ApplicationFilters = {
      q: 'shop',
      status: 'Interview',
      sort: 'oldest',
    }
    expect(parseFilters(filtersToParams(filters))).toEqual(filters)
  })
})

describe('searchApplications', () => {
  it('matches company, role, location, and notes case-insensitively', () => {
    expect(searchApplications(sample, 'SHOP').map((a) => a.id)).toEqual([1])
    expect(searchApplications(sample, 'sde').map((a) => a.id)).toEqual([2])
    expect(searchApplications(sample, 'remote').map((a) => a.id)).toEqual([4])
    expect(searchApplications(sample, 'onsite').map((a) => a.id)).toEqual([3])
  })

  it('trims the query and returns all when empty', () => {
    expect(searchApplications(sample, '  shop  ').map((a) => a.id)).toEqual([
      1,
    ])
    expect(searchApplications(sample, '   ')).toEqual(sample)
    expect(searchApplications(sample, '')).toEqual(sample)
  })
})

describe('filterAndSort', () => {
  it('does not mutate the input array', () => {
    const original = [...sample]
    const snapshot = sample.map((item) => item.id)
    filterAndSort(sample, {
      q: 'a',
      status: 'Applied',
      sort: 'company',
    })
    expect(sample).toEqual(original)
    expect(sample.map((item) => item.id)).toEqual(snapshot)
  })

  it('filters by status', () => {
    const result = filterAndSort(sample, {
      q: '',
      status: 'Interview',
      sort: 'newest',
    })
    expect(result.map((a) => a.id)).toEqual([1])
  })

  it('sorts by newest and oldest', () => {
    const newest = filterAndSort(sample, {
      q: '',
      status: 'all',
      sort: 'newest',
    })
    expect(newest.map((a) => a.id)).toEqual([4, 1, 2, 3])

    const oldest = filterAndSort(sample, {
      q: '',
      status: 'all',
      sort: 'oldest',
    })
    expect(oldest.map((a) => a.id)).toEqual([3, 2, 1, 4])
  })

  it('sorts by company A–Z', () => {
    const result = filterAndSort(sample, {
      q: '',
      status: 'all',
      sort: 'company',
    })
    expect(result.map((a) => a.company)).toEqual([
      'Amazon',
      'Google',
      'Meta',
      'Shopify',
    ])
  })

  it('sorts by status order then newest within each', () => {
    const withExtra = [
      ...sample,
      app({
        id: 5,
        company: 'Apple',
        role: 'SWE',
        status: 'Applied',
        created_at: '2026-05-01T12:00:00.000Z',
      }),
    ]
    const result = filterAndSort(withExtra, {
      q: '',
      status: 'all',
      sort: 'status',
    })
    expect(result.map((a) => a.id)).toEqual([5, 2, 1, 3, 4])
  })
})

describe('countByStatus', () => {
  it('counts using toStatus', () => {
    expect(countByStatus(sample)).toEqual({
      Applied: 1,
      Interview: 1,
      Offer: 1,
      Rejected: 1,
    })
  })
})
