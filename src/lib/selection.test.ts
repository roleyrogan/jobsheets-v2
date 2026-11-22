import { describe, expect, it } from 'vitest'

import {
  clearSelection,
  emptySelection,
  prune,
  selectAll,
  selectOnly,
  selectRange,
  toggle,
} from '@/lib/selection'

function idsOf(selection: { ids: ReadonlySet<number> }): number[] {
  return [...selection.ids].sort((a, b) => a - b)
}

describe('selection', () => {
  it('toggles an id on and sets it as the anchor', () => {
    const on = toggle(emptySelection(), 2)
    expect(idsOf(on)).toEqual([2])
    expect(on.anchorId).toBe(2)
  })

  it('clicking a selected row deselects it and keeps the anchor', () => {
    const on = toggle(emptySelection(), 2)
    const off = toggle(on, 2)
    expect(idsOf(off)).toEqual([])
    expect(off.anchorId).toBe(2)
  })

  it('deselecting the last selected row leaves an empty selection (selection mode ends)', () => {
    const one = toggle(emptySelection(), 5)
    expect(one.ids.size).toBe(1)

    const none = toggle(one, 5)
    expect(none.ids.size).toBe(0)
    expect(idsOf(none)).toEqual([])
  })

  it('selects a forward range from the anchor', () => {
    const start = selectOnly(1)
    const ranged = selectRange(start, 3, [1, 2, 3, 4])
    expect(idsOf(ranged)).toEqual([1, 2, 3])
    expect(ranged.anchorId).toBe(1)
  })

  it('selects a backward range from the anchor', () => {
    const start = selectOnly(4)
    const ranged = selectRange(start, 2, [1, 2, 3, 4])
    expect(idsOf(ranged)).toEqual([2, 3, 4])
    expect(ranged.anchorId).toBe(4)
  })

  it('range uses the current visible order after a sort change', () => {
    const start = selectOnly(1)
    // Previous visual order was [1, 2, 3]; after re-sort it's [3, 1, 2]
    const ranged = selectRange(start, 2, [3, 1, 2])
    expect(idsOf(ranged)).toEqual([1, 2])
    expect(ranged.anchorId).toBe(1)
  })

  it('selectAll selects every visible id', () => {
    const all = selectAll([10, 20, 30])
    expect(idsOf(all)).toEqual([10, 20, 30])
    expect(all.anchorId).toBe(10)
  })

  it('prune drops ids removed by filtering and clears a missing anchor', () => {
    const selected = selectRange(selectOnly(1), 3, [1, 2, 3, 4])
    const pruned = prune(selected, [2, 4])
    expect(idsOf(pruned)).toEqual([2])
    expect(pruned.anchorId).toBeNull()
  })

  it('handles an empty visible list', () => {
    expect(idsOf(selectAll([]))).toEqual([])
    expect(selectAll([]).anchorId).toBeNull()

    const cleared = clearSelection()
    expect(idsOf(cleared)).toEqual([])
    expect(cleared.anchorId).toBeNull()

    const pruned = prune(selectOnly(1), [])
    expect(idsOf(pruned)).toEqual([])
    expect(pruned.anchorId).toBeNull()
  })
})
