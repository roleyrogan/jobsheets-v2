const CELL = 48
const SIZE = 47
const MAX = 6

export type AmbientCell = {
  x: number
  y: number
  delay: string
}

const DELAYS = ['0s', '1.2s', '2.4s', '3.6s', '4.8s', '6.2s'] as const

function overlaps(
  left: number,
  top: number,
  avoid: { left: number; top: number; right: number; bottom: number },
): boolean {
  const right = left + SIZE
  const bottom = top + SIZE
  return !(
    right <= avoid.left ||
    left >= avoid.right ||
    bottom <= avoid.top ||
    top >= avoid.bottom
  )
}

/** Pick up to 6 ambient cells that avoid the hero text (and sit in a safe zone). */
export function computeAmbientCells(
  grid: DOMRect,
  text: DOMRect | null,
  preview: DOMRect | null,
  narrow: boolean,
): AmbientCell[] {
  const cols = Math.max(1, Math.floor(grid.width / CELL))
  const rows = Math.max(1, Math.floor(grid.height / CELL))
  const candidates: { x: number; y: number }[] = []

  const textRel = text
    ? {
        left: text.left - grid.left,
        top: text.top - grid.top,
        right: text.right - grid.left,
        bottom: text.bottom - grid.top,
      }
    : null

  const stripTop = textRel ? textRel.bottom + 4 : 0
  const stripBottom = preview
    ? preview.top - grid.top - 4
    : grid.height
  const minX = narrow ? 0 : Math.floor(cols * 0.6)

  for (let y = 0; y < rows; y++) {
    for (let x = minX; x < cols; x++) {
      const left = x * CELL + 1
      const top = y * CELL + 1

      if (narrow) {
        if (top < stripTop || top + SIZE > stripBottom) continue
      }

      if (textRel && overlaps(left, top, textRel)) continue

      candidates.push({ x, y })
    }
  }

  if (candidates.length === 0) return []

  const count = Math.min(MAX, candidates.length)
  const picked: AmbientCell[] = []
  for (let i = 0; i < count; i++) {
    const idx =
      count === 1
        ? 0
        : Math.round((i * (candidates.length - 1)) / (count - 1))
    const cell = candidates[idx]
    if (!cell) continue
    if (picked.some((p) => p.x === cell.x && p.y === cell.y)) continue
    picked.push({
      x: cell.x,
      y: cell.y,
      delay: DELAYS[picked.length] ?? '0s',
    })
  }

  return picked
}

export { CELL }
