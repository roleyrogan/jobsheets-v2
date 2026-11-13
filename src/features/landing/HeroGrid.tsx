type HeroGridProps = {
  cursor: { x: number; y: number } | null
}

const AMBIENT = [
  { x: 2, y: 1, delay: '0s' },
  { x: 5, y: 2, delay: '1.1s' },
  { x: 8, y: 1, delay: '2.2s' },
  { x: 3, y: 4, delay: '3s' },
  { x: 11, y: 3, delay: '3.8s' },
  { x: 6, y: 5, delay: '4.7s' },
  { x: 14, y: 2, delay: '6s' },
  { x: 9, y: 6, delay: '7.5s' },
] as const

const CELL = 48

export function HeroGrid({ cursor }: HeroGridProps) {
  return (
    <div
      className="pointer-events-none absolute inset-0 overflow-hidden"
      aria-hidden
    >
      <div className="landing-hero-grid-bg absolute inset-0" />
      {AMBIENT.map((cell) => (
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
