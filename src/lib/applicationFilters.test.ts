import { describe, expect, it } from 'vitest'

import {
  countByStatus,
  DEFAULT_SORT,
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
  it('parses sort key and dir', () => {
    const params = new URLSearchParams(
      'q=shop&status=Interview&sort=company&dir=desc',
    )
    expect(parseFilters(params)).toEqual({
      q: 'shop',
      status: 'Interview',
      sort: { key: 'company', dir: 'desc' },
    })
  })

  it('maps legacy sort values', () => {
    expect(parseFilters(new URLSearchParams('sort=newest')).sort).toEqual({
      key: 'added',
      dir: 'desc',
    })
    expect(parseFilters(new URLSearchParams('sort=oldest')).sort).toEqual({
      key: 'added',
      dir: 'asc',
    })
    expect(parseFilters(new URLSearchParams('sort=company')).sort).toEqual({
      key: 'company',
      dir: 'asc',
    })
    expect(parseFilters(new URLSearchParams('sort=status')).sort).toEqual({
      key: 'status',
      dir: 'asc',
    })
  })

  it('falls back on junk values', () => {
    expect(parseFilters(new URLSearchParams('status=banana&sort=nope'))).toEqual(
      {
        q: '',
        status: 'all',
        sort: DEFAULT_SORT,
      },
    )
  })

  it('uses defaults when params are missing', () => {
    expect(parseFilters(new URLSearchParams())).toEqual({
      q: '',
      status: 'all',
      sort: DEFAULT_SORT,
    })
  })
})

describe('filtersToParams', () => {
  it('omits default values', () => {
    const params = filtersToParams({
      q: '',
      status: 'all',
      sort: DEFAULT_SORT,
    })
    expect(params.toString()).toBe('')
  })

  it('round-trips with parseFilters', () => {
    const filters: ApplicationFilters = {
      q: 'shop',
      status: 'Interview',
      sort: { key: 'role', dir: 'asc' },
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
    filterAndSort(sample, {
      q: 'a',
      status: 'Applied',
      sort: { key: 'company', dir: 'asc' },
    })
    expect(sample).toEqual(original)
  })

  it('filters by status', () => {
    const result = filterAndSort(sample, {
      q: '',
      status: 'Interview',
      sort: DEFAULT_SORT,
    })
    expect(result.map((a) => a.id)).toEqual([1])
  })

  it('sorts added desc and asc', () => {
    const newest = filterAndSort(sample, {
      q: '',
      status: 'all',
      sort: { key: 'added', dir: 'desc' },
    })
    expect(newest.map((a) => a.id)).toEqual([4, 1, 2, 3])

    const oldest = filterAndSort(sample, {
      q: '',
      status: 'all',
      sort: { key: 'added', dir: 'asc' },
    })
    expect(oldest.map((a) => a.id)).toEqual([3, 2, 1, 4])
  })

  it('sorts by company and role in both directions', () => {
    const companyAsc = filterAndSort(sample, {
      q: '',
      status: 'all',
      sort: { key: 'company', dir: 'asc' },
    })
    expect(companyAsc.map((a) => a.company)).toEqual([
      'Amazon',
      'Google',
      'Meta',
      'Shopify',
    ])

    const roleDesc = filterAndSort(sample, {
      q: '',
      status: 'all',
      sort: { key: 'role', dir: 'desc' },
    })
    expect(roleDesc.map((a) => a.role)).toEqual([
      'SWE',
      'SDE',
      'PM',
      'Frontend',
    ])
  })

  it('sorts by status order with added desc ties', () => {
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
      sort: { key: 'status', dir: 'asc' },
    })
    expect(result.map((a) => a.id)).toEqual([5, 2, 1, 3, 4])
  })

  it('keeps empty locations last in both directions', () => {
    const asc = filterAndSort(sample, {
      q: '',
      status: 'all',
      sort: { key: 'location', dir: 'asc' },
    })
    expect(asc.map((a) => a.id)).toEqual([4, 2, 1, 3])

    const desc = filterAndSort(sample, {
      q: '',
      status: 'all',
      sort: { key: 'location', dir: 'desc' },
    })
    expect(desc[desc.length - 1]?.id).toBe(3)
    expect(desc.slice(0, 3).map((a) => a.location)).toEqual([
      'Toronto',
      'Seattle',
      'Remote',
    ])
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
