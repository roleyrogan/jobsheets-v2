import { z } from 'zod'

import { STATUSES, isStatus, toStatus, type Status } from '@/lib/status'
import type { Application } from '@/types/index'

export type SortKey = 'newest' | 'oldest' | 'company' | 'status'

export type ApplicationFilters = {
  q: string
  status: Status | 'all'
  sort: SortKey
}

const SORT_KEYS: readonly SortKey[] = [
  'newest',
  'oldest',
  'company',
  'status',
]

const [firstSort, ...restSorts] = SORT_KEYS
if (firstSort === undefined) {
  throw new Error('SORT_KEYS must not be empty')
}

const sortSchema = z.enum([firstSort, ...restSorts]).catch('newest')

const filtersSchema = z.object({
  q: z.string().catch(''),
  status: z
    .string()
    .catch('all')
    .transform((value): Status | 'all' => {
      if (value === 'all') return 'all'
      if (isStatus(value)) return value
      return 'all'
    }),
  sort: sortSchema,
})

export function parseFilters(params: URLSearchParams): ApplicationFilters {
  return filtersSchema.parse({
    q: params.get('q') ?? '',
    status: params.get('status') ?? 'all',
    sort: params.get('sort') ?? 'newest',
  })
}

export function filtersToParams(
  filters: ApplicationFilters,
): URLSearchParams {
  const params = new URLSearchParams()
  if (filters.q !== '') params.set('q', filters.q)
  if (filters.status !== 'all') params.set('status', filters.status)
  if (filters.sort !== 'newest') params.set('sort', filters.sort)
  return params
}

export function searchApplications(
  apps: Application[],
  q: string,
): Application[] {
  const needle = q.trim().toLowerCase()
  if (needle === '') return apps

  return apps.filter((app) => {
    const fields = [
      app.company,
      app.role,
      app.location ?? '',
      app.notes ?? '',
    ]
    return fields.some((field) => field.toLowerCase().includes(needle))
  })
}

function statusOrder(status: Status): number {
  const index = STATUSES.findIndex((item) => item.value === status)
  return index === -1 ? STATUSES.length : index
}

function sortApplications(
  apps: Application[],
  sort: SortKey,
): Application[] {
  const copy = [...apps]

  switch (sort) {
    case 'newest':
      return copy.sort((a, b) => b.created_at.localeCompare(a.created_at))
    case 'oldest':
      return copy.sort((a, b) => a.created_at.localeCompare(b.created_at))
    case 'company':
      return copy.sort((a, b) =>
        a.company.localeCompare(b.company, undefined, { sensitivity: 'base' }),
      )
    case 'status':
      return copy.sort((a, b) => {
        const byStatus =
          statusOrder(toStatus(a.status)) - statusOrder(toStatus(b.status))
        if (byStatus !== 0) return byStatus
        return b.created_at.localeCompare(a.created_at)
      })
  }
}

export function filterAndSort(
  apps: Application[],
  filters: ApplicationFilters,
): Application[] {
  const searched = searchApplications(apps, filters.q)
  const filtered =
    filters.status === 'all'
      ? searched
      : searched.filter((app) => toStatus(app.status) === filters.status)
  return sortApplications(filtered, filters.sort)
}

export function countByStatus(
  apps: Application[],
): Record<Status, number> {
  const counts: Record<Status, number> = {
    Applied: 0,
    Interview: 0,
    Offer: 0,
    Rejected: 0,
  }

  for (const app of apps) {
    counts[toStatus(app.status)] += 1
  }

  return counts
}
