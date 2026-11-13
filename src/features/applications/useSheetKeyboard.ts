import { useCallback, useMemo, useState, type KeyboardEvent } from 'react'

import type { Application } from '@/types/index'

type UseSheetKeyboardArgs = {
  applications: Application[]
  onEdit: (application: Application) => void
  openStatus: (id: number) => void
  openDelete: (id: number) => void
}

function isTypingTarget(target: EventTarget | null): boolean {
  if (!(target instanceof HTMLElement)) return false
  const tag = target.tagName
  return (
    tag === 'INPUT' ||
    tag === 'TEXTAREA' ||
    tag === 'SELECT' ||
    target.isContentEditable ||
    target.closest('[role="menu"]') !== null ||
    target.closest('[role="listbox"]') !== null
  )
}

export function useSheetKeyboard({
  applications,
  onEdit,
  openStatus,
  openDelete,
}: UseSheetKeyboardArgs) {
  const [selectedId, setSelectedId] = useState<number | null>(null)

  const resolvedSelectedId = useMemo(() => {
    if (applications.length === 0) return null
    if (
      selectedId !== null &&
      applications.some((app) => app.id === selectedId)
    ) {
      return selectedId
    }
    return applications[0]?.id ?? null
  }, [applications, selectedId])

  const selectedIndex = applications.findIndex(
    (app) => app.id === resolvedSelectedId,
  )

  const onKeyDown = useCallback(
    (event: KeyboardEvent<HTMLTableSectionElement>) => {
      if (isTypingTarget(event.target)) return
      if (applications.length === 0 || selectedIndex < 0) return

      if (event.key === 'ArrowDown') {
        event.preventDefault()
        const next =
          applications[Math.min(selectedIndex + 1, applications.length - 1)]
        if (next) setSelectedId(next.id)
        return
      }
      if (event.key === 'ArrowUp') {
        event.preventDefault()
        const prev = applications[Math.max(selectedIndex - 1, 0)]
        if (prev) setSelectedId(prev.id)
        return
      }
      if (event.key === 'Home') {
        event.preventDefault()
        const first = applications[0]
        if (first) setSelectedId(first.id)
        return
      }
      if (event.key === 'End') {
        event.preventDefault()
        const last = applications[applications.length - 1]
        if (last) setSelectedId(last.id)
        return
      }

      const current = applications[selectedIndex]
      if (!current) return

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
      }
    },
    [applications, onEdit, openDelete, openStatus, selectedIndex],
  )

  return {
    selectedId: resolvedSelectedId,
    setSelectedId,
    onKeyDown,
  }
}
