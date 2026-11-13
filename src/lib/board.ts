import { STATUSES, toStatus, type Status } from '@/lib/status'
import type { Application } from '@/types/index'

function emptyColumns(): Record<Status, Application[]> {
  return {
    Applied: [],
    Interview: [],
    Offer: [],
    Rejected: [],
  }
}

function newestFirst(a: Application, b: Application): number {
  return b.created_at.localeCompare(a.created_at)
}

export function groupByStatus(
  apps: Application[],
): Record<Status, Application[]> {
  const columns = emptyColumns()

  for (const app of apps) {
    columns[toStatus(app.status)].push(app)
  }

  for (const status of STATUSES) {
    columns[status.value] = [...columns[status.value]].sort(newestFirst)
  }

  return columns
}
