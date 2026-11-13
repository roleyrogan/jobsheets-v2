import type { Announcements, UniqueIdentifier } from '@dnd-kit/core'

import { isStatus, toStatus, type Status } from '@/lib/status'
import type { Application } from '@/types/index'

function findApp(
  apps: Application[],
  id: UniqueIdentifier,
): Application | undefined {
  const numericId = typeof id === 'number' ? id : Number(id)
  if (!Number.isFinite(numericId)) return undefined
  return apps.find((app) => app.id === numericId)
}

function columnLabel(id: UniqueIdentifier | undefined): Status | null {
  if (id === undefined) return null
  const value = String(id)
  return isStatus(value) ? value : null
}

export function createBoardAnnouncements(
  apps: Application[],
): Announcements {
  return {
    onDragStart({ active }) {
      const app = findApp(apps, active.id)
      if (!app) return ''
      return `Picked up ${app.company}, ${app.role}.`
    },
    onDragOver({ over }) {
      const status = columnLabel(over?.id)
      if (!status) return ''
      return `Over ${status} column.`
    },
    onDragEnd({ active, over }) {
      const app = findApp(apps, active.id)
      if (!app) return ''
      const status = columnLabel(over?.id)
      if (!status) {
        return `Cancelled. ${app.company} stays in ${toStatus(app.status)}.`
      }
      return `Moved ${app.company} to ${status}.`
    },
    onDragCancel({ active }) {
      const app = findApp(apps, active.id)
      if (!app) return ''
      return `Cancelled. ${app.company} stays in ${toStatus(app.status)}.`
    },
  }
}
