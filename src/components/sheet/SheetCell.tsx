import type { ComponentProps, ReactNode } from 'react'
import { cn } from 'cn'

type SheetCellProps = Omit<ComponentProps<'td'>, 'title'> & {
  sticky?: 'company'
  selected?: boolean
  isLast?: boolean
  truncate?: boolean
  title?: string
  children: ReactNode
}

export function SheetCell({
  sticky,
  selected = false,
  isLast = false,
  truncate = false,
  title,
  className,
  children,
  ...props
}: SheetCellProps) {
  const borderR = isLast
    ? ''
    : sticky === 'company'
      ? 'border-r border-r-rule max-md:border-r-ink'
      : 'border-r border-r-rule'

  return (
    <td
      title={title}
      className={cn(
        'border-b border-b-rule px-2',
        borderR,
        sticky === 'company' &&
          'sticky left-10 z-10 max-w-[12rem] font-medium md:static',
        sticky === 'company' &&
          (selected
            ? 'bg-fill'
            : 'bg-paper group-hover/row:bg-fill group-data-[selected=true]/row:bg-fill'),
        className,
      )}
      {...props}
    >
      {truncate ? (
        <span className="block truncate">{children}</span>
      ) : (
        children
      )}
    </td>
  )
}
