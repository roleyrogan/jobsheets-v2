import * as React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from 'cn'

const buttonVariants = cva(
  'group/button inline-flex shrink-0 items-center justify-center rounded-[3px] border border-transparent text-[13px] font-medium whitespace-nowrap transition-colors outline-none select-none disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0',
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
        default: 'h-8 gap-1.5 px-2.5 [&_svg:not([class*=size-])]:size-4',
        xs: 'h-7 gap-1 px-2 text-[13px] [&_svg:not([class*=size-])]:size-4',
        sm: 'h-7 gap-1 px-2.5 text-[13px] [&_svg:not([class*=size-])]:size-4',
        lg: 'h-8 gap-1.5 px-3 [&_svg:not([class*=size-])]:size-4',
        icon: 'size-8 [&_svg:not([class*=size-])]:size-4',
        'icon-xs':
          'size-7 text-ink-2 hover:text-ink [&_svg:not([class*=size-])]:size-3.5',
        'icon-sm':
          'size-7 text-ink-2 hover:text-ink [&_svg:not([class*=size-])]:size-3.5',
        'icon-lg': 'size-8 [&_svg:not([class*=size-])]:size-4',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  },
)

type ButtonProps = React.ComponentProps<'button'> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean
  }

export function Button({
  className,
  variant = 'default',
  size = 'default',
  asChild = false,
  children,
  ...props
}: ButtonProps) {
  const classes = cn(buttonVariants({ variant, size, className }))

  if (asChild && React.isValidElement<{ className?: string }>(children)) {
    return React.cloneElement(children, {
      className: cn(classes, children.props.className),
    })
  }

  return (
    <button
      data-slot="button"
      data-variant={variant}
      data-size={size}
      className={classes}
      {...props}
    >
      {children}
    </button>
  )
}

export { buttonVariants }
