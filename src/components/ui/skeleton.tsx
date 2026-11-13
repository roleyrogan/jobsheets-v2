import type { ComponentProps } from 'react'
import { cn } from 'cn'

function Skeleton({ className, ...props }: ComponentProps<'div'>) {
  return (
    <div
      data-slot="skeleton"
      className={cn(
        'rounded-none bg-fill motion-safe:animate-pulse',
        className,
      )}
      {...props}
    />
  )
}

export { Skeleton }
