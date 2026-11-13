import type { ComponentProps } from 'react'
import { cn } from 'cn'

type SheetHeaderCellProps = ComponentProps<'th'> & {
  sticky?: 'gutter' | 'company'
  isLast?: boolean
}

export function SheetHeaderCell({
  sticky,
  isLast = false,
  className,
  children,
  ...props
}: SheetHeaderCellProps) {
  const borderR = isLast
    ? ''
    : sticky === 'company'
      ? 'border-r border-r-rule max-md:border-r-ink'
      : 'border-r border-r-rule'

  return (
    <th
      scope="col"
      className={cn(
        'box-border border-b border-b-ink px-2 text-left text-xs font-medium',
        borderR,
        sticky === 'gutter' &&
          'sticky left-0 z-20 w-10 min-w-10 max-w-10 bg-fill md:static',
        sticky === 'company' &&
          'sticky left-10 z-20 max-w-[12rem] bg-fill md:static',
        className,
      )}
      {...props}
    >
      {children}
    </th>
  )
}
