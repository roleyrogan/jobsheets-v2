import type { ComponentType, ReactNode } from 'react'

export type AnimatedItemProps = {
  children?: ReactNode
  delay?: number
  index?: number
  onMouseEnter?: () => void
  onClick?: () => void
}

export declare const AnimatedItem: ComponentType<AnimatedItemProps>

export type AnimatedListProps = {
  items?: string[]
  onItemSelect?: (item: string, index: number) => void
  showGradients?: boolean
  enableArrowNavigation?: boolean
  className?: string
  itemClassName?: string
  displayScrollbar?: boolean
  initialSelectedIndex?: number
}

declare const AnimatedList: ComponentType<AnimatedListProps>

export default AnimatedList
