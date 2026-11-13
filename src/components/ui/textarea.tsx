import * as React from 'react'
import { cn } from 'cn'

function Textarea({ className, ...props }: React.ComponentProps<'textarea'>) {
  return (
    <textarea
      data-slot="textarea"
      className={cn(
        'flex field-sizing-content min-h-16 w-full rounded-[3px] border border-rule bg-transparent px-2.5 py-2 text-sm text-ink transition-colors outline-none placeholder:text-ink-2 hover:border-ink disabled:cursor-not-allowed disabled:opacity-50 aria-invalid:border-[color:var(--status-rejected)]',
        className,
      )}
      {...props}
    />
  )
}

export { Textarea }
