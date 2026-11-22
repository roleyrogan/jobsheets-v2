import type { ReactNode } from 'react'
import { cn } from 'cn'

type SheetGutterCellProps = {
  children: ReactNode
  className?: string
  /** Multi-select: 2px select outline on the gutter side. */
  checked?: boolean
}

export function SheetGutterCell({
  children,
  className,
  checked = false,
}: SheetGutterCellProps) {
  const plain =
    typeof children === 'string' || typeof children === 'number'

  return (
    <td
      className={cn(
        'sticky left-0 z-10 box-border w-10 min-w-10 max-w-10 border-r border-r-rule border-b border-b-rule bg-fill text-right md:static',
        plain ? 'px-2' : 'px-0',
        checked && 'shadow-[inset_2px_0_0_0_var(--select)]',
        className,
      )}
    >
      {plain ? (
        <span className="figure text-ink-2">{children}</span>
      ) : (
        children
      )}
    </td>
  )
}
