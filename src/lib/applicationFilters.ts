import { isStatus, toStatus, type Status } from '@/lib/status'
import { sortApplications } from '@/lib/applicationSort'
import type { Application } from '@/types/index'

export type SortColumn =
  | 'company'
  | 'role'
  | 'status'
  | 'location'
  | 'added'

export type SortDir = 'asc' | 'desc'

export type ApplicationSort = {
  key: SortColumn
  dir: SortDir
}

export type ApplicationFilters = {
  q: string
  status: Status | 'all'
  sort: ApplicationSort
}

const SORT_COLUMNS: readonly SortColumn[] = [
  'company',
  'role',
  'status',
  'location',
  'added',
]

export const DEFAULT_SORT: ApplicationSort = {
  key: 'added',
  dir: 'desc',
}

function isSortColumn(value: string): value is SortColumn {
  return SORT_COLUMNS.some((column) => column === value)
}

function isSortDir(value: string): value is SortDir {
  return value === 'asc' || value === 'desc'
}

function parseSort(params: URLSearchParams): ApplicationSort {
  const raw = params.get('sort') ?? ''
  const dirRaw = params.get('dir')

  if (raw === 'newest' || raw === '') return DEFAULT_SORT
  if (raw === 'oldest') return { key: 'added', dir: 'asc' }
  if (!isSortColumn(raw)) return DEFAULT_SORT

  if (dirRaw !== null && isSortDir(dirRaw)) {
    return { key: raw, dir: dirRaw }
  }

  if (raw === 'added') return { key: 'added', dir: 'desc' }
  return { key: raw, dir: 'asc' }
}

export function parseFilters(params: URLSearchParams): ApplicationFilters {
  const statusRaw = params.get('status') ?? 'all'
  const status: Status | 'all' =
    statusRaw === 'all' ? 'all' : isStatus(statusRaw) ? statusRaw : 'all'

  return {
    q: params.get('q') ?? '',
    status,
    sort: parseSort(params),
  }
}

export function filtersToParams(
  filters: ApplicationFilters,
): URLSearchParams {
  const params = new URLSearchParams()
  if (filters.q !== '') params.set('q', filters.q)
  if (filters.status !== 'all') params.set('status', filters.status)
  if (
    filters.sort.key !== DEFAULT_SORT.key ||
    filters.sort.dir !== DEFAULT_SORT.dir
  ) {
    params.set('sort', filters.sort.key)
    params.set('dir', filters.sort.dir)
  }
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
