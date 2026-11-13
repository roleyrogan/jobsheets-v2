import { STATUSES, toStatus, type Status } from '@/lib/status'
import type { ApplicationSort } from '@/lib/applicationFilters'
import type { Application } from '@/types/index'

function statusOrder(status: Status): number {
  const index = STATUSES.findIndex((item) => item.value === status)
  return index === -1 ? STATUSES.length : index
}

function compareAddedDesc(a: Application, b: Application): number {
  return b.created_at.localeCompare(a.created_at)
}

function applyDir(value: number, dir: ApplicationSort['dir']): number {
  return dir === 'asc' ? value : -value
}

export function sortApplications(
  apps: Application[],
  sort: ApplicationSort,
): Application[] {
  const copy = [...apps]
  const { key, dir } = sort

  return copy.sort((a, b) => {
    let primary = 0

    switch (key) {
      case 'company':
        primary = a.company.localeCompare(b.company, undefined, {
          sensitivity: 'base',
        })
        break
      case 'role':
        primary = a.role.localeCompare(b.role, undefined, {
          sensitivity: 'base',
        })
        break
      case 'status':
        primary =
          statusOrder(toStatus(a.status)) - statusOrder(toStatus(b.status))
        break
      case 'location': {
        const aEmpty = a.location === null || a.location.trim() === ''
        const bEmpty = b.location === null || b.location.trim() === ''
        if (aEmpty && bEmpty) primary = 0
        else if (aEmpty) return 1
        else if (bEmpty) return -1
        else {
          primary = (a.location ?? '').localeCompare(
            b.location ?? '',
            undefined,
            { sensitivity: 'base' },
          )
        }
        break
      }
      case 'added':
        primary = a.created_at.localeCompare(b.created_at)
        break
    }

    if (primary !== 0) return applyDir(primary, dir)
    return compareAddedDesc(a, b)
  })
}
