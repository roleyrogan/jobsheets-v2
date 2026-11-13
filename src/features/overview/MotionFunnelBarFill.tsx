import { motion } from 'motion/react'

import type { FunnelBarFillProps } from '@/features/overview/FunnelBarFill'
import { revealTransition } from '@/lib/motion'

/** First-reveal grow — Overview only; do not import from landing. */
export function MotionFunnelBarFill({
  widthPercent,
  opacity,
}: FunnelBarFillProps) {
  return (
    <motion.div
      className="h-full origin-left bg-ink"
      style={{ width: `${widthPercent}%`, opacity }}
      initial={{ scaleX: 0 }}
      animate={{ scaleX: 1 }}
      transition={revealTransition}
    />
  )
}
