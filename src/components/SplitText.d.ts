import type { ComponentType, CSSProperties } from 'react'

export type SplitTextProps = {
  text: string
  className?: string
  delay?: number
  duration?: number
  ease?: string
  splitType?: string
  from?: Record<string, unknown>
  to?: Record<string, unknown>
  threshold?: number
  rootMargin?: string
  textAlign?: CSSProperties['textAlign']
  tag?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'p' | 'span'
  onLetterAnimationComplete?: () => void
}

declare const SplitText: ComponentType<SplitTextProps>

export default SplitText
