export type FunnelBarFillProps = {
  widthPercent: number
  opacity: number
}

/** Static fill — safe for the landing page (no motion import). */
export function StaticFunnelBarFill({
  widthPercent,
  opacity,
}: FunnelBarFillProps) {
  return (
    <div
      className="h-full bg-ink"
      style={{ width: `${widthPercent}%`, opacity }}
    />
  )
}
