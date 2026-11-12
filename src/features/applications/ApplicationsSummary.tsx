import { STATUSES, toStatus } from '@/lib/status'
import type { Application } from '@/types/index'

type ApplicationsSummaryProps = {
  applications: Application[]
}

export function ApplicationsSummary({
  applications,
}: ApplicationsSummaryProps) {
  const total = applications.length
  const totalLabel = total === 1 ? 'application' : 'applications'

  const parts = [
    `${total} ${totalLabel}`,
    ...STATUSES.map((status) => {
      const count = applications.filter(
        (application) => toStatus(application.status) === status.value,
      ).length
      return `${count} ${status.label}`
    }),
  ]

  return (
    <p className="text-sm text-muted-foreground tabular-nums">
      {parts.join(' · ')}
    </p>
  )
}
