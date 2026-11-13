import type { SampleRow } from '@/features/landing/sampleData'
import { STATUSES, type Status } from '@/lib/status'

export type SortKey = 'company' | 'status' | 'added'

const STATUS_ORDER: Record<Status, number> = {
  Applied: 0,
  Interview: 1,
  Offer: 2,
  Rejected: 3,
}

export function sortRows(
  rows: SampleRow[],
  key: SortKey,
  dir: 'asc' | 'desc',
): SampleRow[] {
  const sign = dir === 'asc' ? 1 : -1
  return [...rows].sort((a, b) => {
    if (key === 'status') {
      return (STATUS_ORDER[a.status] - STATUS_ORDER[b.status]) * sign
    }
    return a[key].localeCompare(b[key]) * sign
  })
}

export function nextStatus(status: Status): Status {
  const index = STATUSES.findIndex((item) => item.value === status)
  const next = STATUSES[(index + 1) % STATUSES.length]
  return next?.value ?? 'Applied'
}
