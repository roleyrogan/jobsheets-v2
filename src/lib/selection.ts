export type Selection = {
  ids: ReadonlySet<number>
  anchorId: number | null
}

export function emptySelection(): Selection {
  return { ids: new Set(), anchorId: null }
}

export function toggle(selection: Selection, id: number): Selection {
  const ids = new Set(selection.ids)
  if (ids.has(id)) {
    ids.delete(id)
  } else {
    ids.add(id)
  }
  return { ids, anchorId: id }
}

export function selectOnly(id: number): Selection {
  return { ids: new Set([id]), anchorId: id }
}

/** Inclusive range from anchor to id over the current visible order. */
export function selectRange(
  selection: Selection,
  id: number,
  visibleOrder: readonly number[],
): Selection {
  const anchorId = selection.anchorId ?? id
  const from = visibleOrder.indexOf(anchorId)
  const to = visibleOrder.indexOf(id)

  if (to < 0) {
    return { ids: new Set(selection.ids), anchorId }
  }
  if (from < 0) {
    return selectOnly(id)
  }

  const start = Math.min(from, to)
  const end = Math.max(from, to)
  return {
    ids: new Set(visibleOrder.slice(start, end + 1)),
    anchorId,
  }
}

export function selectAll(visibleIds: readonly number[]): Selection {
  return {
    ids: new Set(visibleIds),
    anchorId: visibleIds[0] ?? null,
  }
}

export function clearSelection(): Selection {
  return emptySelection()
}

/** Drop ids (and the anchor) that are no longer in the visible list. */
export function prune(
  selection: Selection,
  visibleIds: readonly number[],
): Selection {
  if (selection.ids.size === 0 && selection.anchorId === null) {
    return selection
  }

  const visible = new Set(visibleIds)
  const ids = new Set<number>()
  for (const id of selection.ids) {
    if (visible.has(id)) ids.add(id)
  }

  const anchorId =
    selection.anchorId !== null && visible.has(selection.anchorId)
      ? selection.anchorId
      : null

  if (ids.size === selection.ids.size && anchorId === selection.anchorId) {
    return selection
  }

  return { ids, anchorId }
}
