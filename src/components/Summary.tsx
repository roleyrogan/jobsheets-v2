import type { Application } from '../types'

type SummaryProps = {
  applications: Application[]
}

const STATUS_STYLES: Record<Application['status'], { bg: string; text: string }> = {
  Applied: { bg: '#1a3a5c', text: '#60a5fa' },
  Interview: { bg: '#3a2a00', text: '#fbbf24' },
  Offer: { bg: '#0a3a1a', text: '#34d399' },
  Rejected: { bg: '#3a0a0a', text: '#f87171' },
}

const STATUS_ORDER: Application['status'][] = ['Applied', 'Interview', 'Offer', 'Rejected']

function Badge({
  label,
  count,
  background,
  color,
}: {
  label: string
  count: number
  background: string
  color: string
}) {
  return (
    <span
      className="rounded-full px-4 py-1.5 text-sm font-medium whitespace-nowrap shrink-0"
      style={{ backgroundColor: background, color }}
    >
      {label}: <span className="font-mono">{count}</span>
    </span>
  )
}

export default function Summary({ applications }: SummaryProps) {
  if (applications.length === 0) {
    return (
      <p className="text-[#C77DFF] text-sm text-center opacity-60">No applications yet</p>
    )
  }

  const counts = {
    Applied: applications.filter(a => a.status === 'Applied').length,
    Interview: applications.filter(a => a.status === 'Interview').length,
    Offer: applications.filter(a => a.status === 'Offer').length,
    Rejected: applications.filter(a => a.status === 'Rejected').length,
  }

  return (
    <div className="flex gap-3 overflow-x-auto pb-1">
      <Badge
        label="Total"
        count={applications.length}
        background="#240046"
        color="#E0AAFF"
      />
      {STATUS_ORDER.map(status => (
        <Badge
          key={status}
          label={status}
          count={counts[status]}
          background={STATUS_STYLES[status].bg}
          color={STATUS_STYLES[status].text}
        />
      ))}
    </div>
  )
}
