import { useCallback, useMemo, useState } from 'react'

import {
  clearSelection,
  emptySelection,
  prune,
  selectAll,
  selectOnly,
  selectRange,
  toggle,
  type Selection,
} from '@/lib/selection'

type GutterModifiers = {
  shiftKey: boolean
  metaKey?: boolean
  ctrlKey?: boolean
  pointerType?: string
}

export function useSheetSelection(visibleIds: readonly number[]) {
  const [selection, setSelection] = useState<Selection>(emptySelection)
  const visibleKey = visibleIds.join(',')
  const [seenKey, setSeenKey] = useState(visibleKey)

  if (seenKey !== visibleKey) {
    setSeenKey(visibleKey)
    setSelection((prev) => prune(prev, visibleIds))
  }

  const selectedCount = selection.ids.size
  const allVisibleSelected =
    visibleIds.length > 0 && visibleIds.every((id) => selection.ids.has(id))
  const someVisibleSelected =
    !allVisibleSelected && visibleIds.some((id) => selection.ids.has(id))

  const isSelected = useCallback(
    (id: number) => selection.ids.has(id),
    [selection.ids],
  )

  const clear = useCallback(() => {
    setSelection(clearSelection())
  }, [])

  const selectAllVisible = useCallback(() => {
    setSelection(selectAll(visibleIds))
  }, [visibleIds])

  const toggleSelectAll = useCallback(() => {
    setSelection((prev) =>
      visibleIds.length > 0 && visibleIds.every((id) => prev.ids.has(id))
        ? clearSelection()
        : selectAll(visibleIds),
    )
  }, [visibleIds])

  const onGutterSelect = useCallback(
    (id: number, modifiers: GutterModifiers) => {
      setSelection((prev) => {
        if (modifiers.shiftKey) {
          return selectRange(prev, id, visibleIds)
        }
        // Plain click, Cmd/Ctrl-click, and touch all toggle.
        return toggle(prev, id)
      })
    },
    [visibleIds],
  )

  const toggleId = useCallback((id: number) => {
    setSelection((prev) => toggle(prev, id))
  }, [])

  const extendTo = useCallback(
    (fromId: number, toId: number) => {
      setSelection((prev) => {
        const anchored =
          prev.anchorId === null ? selectOnly(fromId) : prev
        return selectRange(anchored, toId, visibleIds)
      })
    },
    [visibleIds],
  )

  const selectedIds = useMemo(
    () => [...selection.ids],
    [selection.ids],
  )

  return {
    selection,
    selectedIds,
    selectedCount,
    allVisibleSelected,
    someVisibleSelected,
    isSelected,
    clear,
    selectAllVisible,
    toggleSelectAll,
    onGutterSelect,
    toggleId,
    extendTo,
  }
}
