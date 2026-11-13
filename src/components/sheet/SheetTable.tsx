import type { ComponentProps, ReactNode } from 'react'
import { cn } from 'cn'

type SheetTableProps = {
  children: ReactNode
  className?: string
  minWidthClassName?: string
  scrollClassName?: string
} & Omit<ComponentProps<'table'>, 'children' | 'className'>

export function SheetTable({
  children,
  className,
  minWidthClassName = 'min-w-[760px] md:min-w-0',
  scrollClassName,
  ...props
}: SheetTableProps) {
  return (
    <div className={cn('max-md:overflow-x-auto', scrollClassName)}>
      <table
        className={cn(
          'w-full border-separate border-spacing-0 text-[13px] leading-5',
          minWidthClassName,
          className,
        )}
        {...props}
      >
        {children}
      </table>
    </div>
  )
}
