import type { ComponentType, ReactNode } from 'react'

export type SpotlightCardProps = {
  children?: ReactNode
  className?: string
  spotlightColor?: string
}

declare const SpotlightCard: ComponentType<SpotlightCardProps>

export default SpotlightCard
