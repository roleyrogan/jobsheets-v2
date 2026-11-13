import { getStatusConfig } from '@/lib/status'
import { StatusMark } from '@/features/applications/StatusMark'

type StatusBadgeProps = {
  value: string
}

export function StatusBadge({ value }: StatusBadgeProps) {
  const config = getStatusConfig(value)

  return (
    <span className="inline-flex items-center gap-1.5 text-sm text-current">
      <StatusMark mark={config.mark} color={config.color} />
      {config.label}
    </span>
  )
}
