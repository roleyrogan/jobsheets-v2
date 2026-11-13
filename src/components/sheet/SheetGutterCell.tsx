import type { ReactNode } from 'react'
import { cn } from 'cn'

type SheetGutterCellProps = {
  children: ReactNode
  className?: string
}

export function SheetGutterCell({ children, className }: SheetGutterCellProps) {
  return (
    <td
      className={cn(
        'sticky left-0 z-10 box-border w-10 min-w-10 max-w-10 border-r border-r-rule border-b border-b-rule bg-fill px-2 text-right md:static',
        className,
      )}
    >
      <span className="figure text-ink-2">{children}</span>
    </td>
  )
}
