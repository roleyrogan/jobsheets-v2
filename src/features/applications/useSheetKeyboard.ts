import { useCallback, useMemo, useState, type KeyboardEvent } from 'react'

import type { Application } from '@/types/index'

type UseSheetKeyboardArgs = {
  applications: Application[]
  onEdit: (application: Application) => void
  openStatus: (id: number) => void
  openDelete: (id: number) => void
  focusRow: (id: number) => void
}

function isTypingTarget(target: EventTarget | null): boolean {
  if (!(target instanceof HTMLElement)) return false
  const tag = target.tagName
  return (
    tag === 'INPUT' ||
    tag === 'TEXTAREA' ||
    tag === 'SELECT' ||
    target.isContentEditable ||
    target.closest(
      '[role="menu"],[role="listbox"],[role="dialog"]',
    ) !== null
  )
}

function openAfterKey(
  event: KeyboardEvent<HTMLTableSectionElement>,
  action: () => void,
) {
  event.preventDefault()
  event.stopPropagation()
  requestAnimationFrame(action)
}

export function useSheetKeyboard({
  applications,
  onEdit,
  openStatus,
  openDelete,
  focusRow,
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

  const moveTo = useCallback(
    (application: Application | undefined) => {
      if (!application) return
      setSelectedId(application.id)
      requestAnimationFrame(() => focusRow(application.id))
    },
    [focusRow],
  )

  const onKeyDown = useCallback(
    (event: KeyboardEvent<HTMLTableSectionElement>) => {
      if (isTypingTarget(event.target)) return
      if (applications.length === 0 || selectedIndex < 0) return

      if (event.key === 'ArrowDown') {
        event.preventDefault()
        moveTo(
          applications[
            Math.min(selectedIndex + 1, applications.length - 1)
          ],
        )
        return
      }
      if (event.key === 'ArrowUp') {
        event.preventDefault()
        moveTo(applications[Math.max(selectedIndex - 1, 0)])
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

      const current = applications[selectedIndex]
      if (!current) return

      if (event.key === 'Enter') {
        openAfterKey(event, () => onEdit(current))
        return
      }
      if (event.key === 's' || event.key === 'S') {
        openAfterKey(event, () => openStatus(current.id))
        return
      }
      if (event.key === 'Delete' || event.key === 'Backspace') {
        openAfterKey(event, () => openDelete(current.id))
      }
    },
    [
      applications,
      moveTo,
      onEdit,
      openDelete,
      openStatus,
      selectedIndex,
    ],
  )

  return {
    selectedId: resolvedSelectedId,
    setSelectedId,
    onKeyDown,
  }
}
