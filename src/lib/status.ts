export const STATUSES = [
  {
    value: 'Applied',
    label: 'Applied',
    color: 'var(--status-applied)',
  },
  {
    value: 'Interview',
    label: 'Interview',
    color: 'var(--status-interview)',
  },
  {
    value: 'Offer',
    label: 'Offer',
    color: 'var(--status-offer)',
  },
  {
    value: 'Rejected',
    label: 'Rejected',
    color: 'var(--status-rejected)',
  },
] as const

export type Status = (typeof STATUSES)[number]['value']

export type StatusConfig = (typeof STATUSES)[number]

export function isStatus(value: string): value is Status {
  return STATUSES.some((status) => status.value === value)
}

export function toStatus(value: string): Status {
  if (isStatus(value)) return value
  return 'Applied'
}

export function getStatusConfig(value: string): StatusConfig {
  const status = toStatus(value)
  const config = STATUSES.find((item) => item.value === status)
  if (!config) {
    return STATUSES[0]
  }
  return config
}
