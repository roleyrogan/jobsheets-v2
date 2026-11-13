import * as React from 'react'
import { cn } from 'cn'

function Input({ className, type, ...props }: React.ComponentProps<'input'>) {
  return (
    <input
      type={type}
      data-slot="input"
      className={cn(
        'h-8 w-full min-w-0 rounded-[3px] border border-rule bg-transparent px-2.5 py-1 text-sm text-ink transition-colors outline-none placeholder:text-ink-2 hover:border-ink disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 aria-invalid:border-[color:var(--status-rejected)]',
        className,
      )}
      {...props}
    />
  )
}

export { Input }
