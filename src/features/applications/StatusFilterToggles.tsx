import type { ReactNode } from 'react'

import { STATUSES, type Status } from '@/lib/status'
import { StatusMark } from '@/features/applications/StatusMark'

type StatusFilterTogglesProps = {
  total: number
  counts: Record<Status, number>
  selected: Status | 'all'
  onSelect: (status: Status | 'all') => void
}

export function StatusFilterToggles({
  total,
  counts,
  selected,
  onSelect,
}: StatusFilterTogglesProps) {
  return (
    <div
      className="flex flex-wrap"
      role="group"
      aria-label="Filter by status"
    >
      <StatusToggle
        pressed={selected === 'all'}
        onClick={() => onSelect('all')}
        first
      >
        <span>All</span>
        <span className="figure">{total}</span>
      </StatusToggle>
      {STATUSES.map((status, index) => (
        <StatusToggle
          key={status.value}
          pressed={selected === status.value}
          onClick={() => onSelect(status.value)}
          last={index === STATUSES.length - 1}
        >
          <StatusMark mark={status.mark} color={status.color} />
          <span>{status.label}</span>
          <span className="figure">{counts[status.value]}</span>
        </StatusToggle>
      ))}
    </div>
  )
}

function StatusToggle({
  pressed,
  onClick,
  children,
  first = false,
  last = false,
}: {
  pressed: boolean
  onClick: () => void
  children: ReactNode
  first?: boolean
  last?: boolean
}) {
  return (
    <button
      type="button"
      aria-pressed={pressed}
      onClick={onClick}
      className={
        pressed
          ? `inline-flex h-8 items-center gap-1.5 border border-ink bg-ink px-2.5 text-[13px] font-medium text-paper ${first ? '' : '-ml-px'} ${last ? '' : ''}`
          : `inline-flex h-8 items-center gap-1.5 border border-rule bg-paper px-2.5 text-[13px] text-ink hover:border-ink ${first ? '' : '-ml-px'}`
      }
    >
      {children}
    </button>
  )
}
