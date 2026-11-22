import { useCallback, useMemo, useState, type KeyboardEvent } from 'react'

import type { Application } from '@/types/index'

type UseSheetKeyboardArgs = {
  applications: Application[]
  onEdit: (application: Application) => void
  openStatus: (id: number) => void
  openDelete: (id: number) => void
  focusRow: (id: number) => void
  onToggleSelect: (id: number) => void
  onExtendSelect: (fromId: number, toId: number) => void
  onSelectAll: () => void
  onClearSelect: () => void
}

export function useSheetKeyboard({
  applications,
  onEdit,
  openStatus,
  openDelete,
  focusRow,
  onToggleSelect,
  onExtendSelect,
  onSelectAll,
  onClearSelect,
}: UseSheetKeyboardArgs) {
  const [focusedId, setFocusedId] = useState<number | null>(null)

  const resolvedFocusedId = useMemo(() => {
    if (applications.length === 0) return null
    if (
      focusedId !== null &&
      applications.some((app) => app.id === focusedId)
    ) {
      return focusedId
    }
    return applications[0]?.id ?? null
  }, [applications, focusedId])

  const focusedIndex = applications.findIndex(
    (app) => app.id === resolvedFocusedId,
  )

  const moveTo = useCallback(
    (application: Application | undefined) => {
      if (!application) return
      setFocusedId(application.id)
      focusRow(application.id)
    },
    [focusRow],
  )

  const onKeyDown = useCallback(
    (event: KeyboardEvent<HTMLTableSectionElement>) => {
      if (!(event.target instanceof HTMLTableRowElement)) return
      if (applications.length === 0 || focusedIndex < 0) return

      const current = applications[focusedIndex]
      if (!current) return

      if (event.key === 'ArrowDown') {
        event.preventDefault()
        const next =
          applications[
            Math.min(focusedIndex + 1, applications.length - 1)
          ]
        if (event.shiftKey && next) {
          onExtendSelect(current.id, next.id)
        }
        moveTo(next)
        return
      }
      if (event.key === 'ArrowUp') {
        event.preventDefault()
        const next = applications[Math.max(focusedIndex - 1, 0)]
        if (event.shiftKey && next) {
          onExtendSelect(current.id, next.id)
        }
        moveTo(next)
        return
      }
      if (event.key === 'Home') {
        event.preventDefault()
        moveTo(applications[0])
        return
      }
      if (event.key === 'End') {
        event.preventDefault()
        moveTo(applications[applications.length - 1])
        return
      }

      if (event.key === 'Enter') {
        event.preventDefault()
        onEdit(current)
        return
      }
      if (event.key === 's' || event.key === 'S') {
        event.preventDefault()
        openStatus(current.id)
        return
      }
      if (event.key === 'Delete' || event.key === 'Backspace') {
        event.preventDefault()
        openDelete(current.id)
        return
      }
      if (event.key === 'x' || event.key === 'X') {
        event.preventDefault()
        onToggleSelect(current.id)
        return
      }
      if (
        (event.key === 'a' || event.key === 'A') &&
        (event.metaKey || event.ctrlKey)
      ) {
        event.preventDefault()
        onSelectAll()
        return
      }
      if (event.key === 'Escape') {
        event.preventDefault()
        onClearSelect()
      }
    },
    [
      applications,
      focusedIndex,
      moveTo,
      onClearSelect,
      onEdit,
      onExtendSelect,
      onSelectAll,
      onToggleSelect,
      openDelete,
      openStatus,
    ],
  )

  return {
    focusedId: resolvedFocusedId,
    setFocusedId,
    onKeyDown,
  }
}
