import { useEffect, useRef, useState, type RefObject } from 'react'

import {
  CELL,
  computeAmbientCells,
  type AmbientCell,
} from '@/features/landing/ambientCells'

type HeroGridProps = {
  cursor: { x: number; y: number } | null
  textRef: RefObject<HTMLElement | null>
  previewRef: RefObject<HTMLElement | null>
}

export function HeroGrid({ cursor, textRef, previewRef }: HeroGridProps) {
  const gridRef = useRef<HTMLDivElement>(null)
  const [cells, setCells] = useState<AmbientCell[]>([])

  useEffect(() => {
    const grid = gridRef.current
    if (!grid) return

    function update() {
      const node = gridRef.current
      if (!node) return
      const rect = node.getBoundingClientRect()
      const text = textRef.current?.getBoundingClientRect() ?? null
      const preview = previewRef.current?.getBoundingClientRect() ?? null
      const narrow = window.matchMedia('(max-width: 759px)').matches
      setCells(computeAmbientCells(rect, text, preview, narrow))
    }

    update()
    const observer = new ResizeObserver(update)
    observer.observe(grid)
    if (textRef.current) observer.observe(textRef.current)
    if (previewRef.current) observer.observe(previewRef.current)
    window.addEventListener('resize', update)
    return () => {
      observer.disconnect()
      window.removeEventListener('resize', update)
    }
  }, [textRef, previewRef])

  return (
    <div
      ref={gridRef}
      className="pointer-events-none absolute inset-0 overflow-hidden"
      aria-hidden
    >
      <div className="landing-hero-grid-bg absolute inset-0" />
      {cells.map((cell) => (
        <span
          key={`${cell.x}-${cell.y}`}
          className="landing-ambient-cell absolute size-[47px] bg-[var(--flash)]"
          style={{
            left: cell.x * CELL + 1,
            top: cell.y * CELL + 1,
            animationDelay: cell.delay,
          }}
        />
      ))}
      {cursor ? (
        <span
          className="landing-cursor-cell absolute size-[49px] border-2 border-ink"
          style={{ transform: `translate(${cursor.x}px, ${cursor.y}px)` }}
        />
      ) : null}
    </div>
  )
}
