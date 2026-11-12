import { getStatusConfig } from '@/lib/status'

type StatusBadgeProps = {
  value: string
}

export function StatusBadge({ value }: StatusBadgeProps) {
  const config = getStatusConfig(value)

  return (
    <span
      className="inline-flex items-center gap-1.5 text-sm"
      style={{ color: config.color }}
    >
      <span
        className="size-1.5 shrink-0 rounded-full"
        style={{ backgroundColor: config.color }}
        aria-hidden
      />
      {config.label}
    </span>
  )
}
