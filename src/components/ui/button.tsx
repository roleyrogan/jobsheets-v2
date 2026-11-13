import * as React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from 'cn'
import { Slot } from 'radix-ui'

const buttonVariants = cva(
  'group/button inline-flex shrink-0 items-center justify-center rounded-[3px] border border-transparent text-[13px] font-medium whitespace-nowrap transition-colors outline-none select-none disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*=\'size-\'])]:size-4',
  {
    variants: {
      variant: {
        default: 'bg-ink text-paper hover:bg-ink/90',
        outline:
          'border-ink bg-transparent text-ink hover:bg-fill aria-expanded:bg-fill',
        secondary:
          'border-ink bg-transparent text-ink hover:bg-fill aria-expanded:bg-fill',
        ghost:
          'bg-transparent text-ink-2 hover:text-ink aria-expanded:text-ink',
        destructive:
          'border-[color:var(--status-rejected)] bg-transparent text-[color:var(--status-rejected)] hover:bg-fill',
        link: 'text-ink underline-offset-4 hover:underline',
      },
      size: {
        default: 'h-8 gap-1.5 px-2.5',
        xs: 'h-7 gap-1 px-2 text-[13px]',
        sm: 'h-7 gap-1 px-2.5 text-[13px]',
        lg: 'h-8 gap-1.5 px-3',
        icon: 'size-8',
        'icon-xs': 'size-7 [&_svg:not([class*=\'size-\'])]:size-3.5',
        'icon-sm': 'size-7',
        'icon-lg': 'size-8',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  },
)

function Button({
  className,
  variant = 'default',
  size = 'default',
  asChild = false,
  ...props
}: React.ComponentProps<'button'> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean
  }) {
  const Comp = asChild ? Slot.Root : 'button'

  return (
    <Comp
      data-slot="button"
      data-variant={variant}
      data-size={size}
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  )
}

export { Button, buttonVariants }
