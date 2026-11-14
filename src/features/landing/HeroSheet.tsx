import { StatusMark } from '@/features/applications/StatusMark'
import {
  sampleStatusCounts,
  type SampleRow,
} from '@/features/landing/sampleData'
import type { SortKey } from '@/features/landing/heroSort'
import { getStatusConfig, STATUSES } from '@/lib/status'

type HeroSheetProps = {
  rows: SampleRow[]
  order: string[]
  sortKey: SortKey
  sortDir: 'asc' | 'desc'
  flashId: string | null
  flashTone: 'a' | 'b'
  onSort: (key: SortKey) => void
  onCycleStatus: (id: string) => void
  onInteract: () => void
}

const COLS =
  'grid-cols-[2rem_minmax(0,1.2fr)_minmax(0,1fr)_7.5rem_minmax(0,0.8fr)_6rem] max-[759px]:grid-cols-[2rem_minmax(0,1fr)_7.5rem_6rem]'

export function HeroSheet({
  rows,
  order,
  sortKey,
  sortDir,
  flashId,
  flashTone,
  onSort,
  onCycleStatus,
  onInteract,
}: HeroSheetProps) {
  const byId = new Map(rows.map((row) => [row.id, row]))
  const counts = sampleStatusCounts(rows)

  function header(key: SortKey, label: string, className = '') {
    const active = sortKey === key
    const arrow = active ? (sortDir === 'asc' ? ' ▲' : ' ▼') : ''
    return (
      <button
        type="button"
        className={`text-left text-xs font-medium ${className}`}
        onClick={() => {
          onInteract()
          onSort(key)
        }}
      >
        {label}
        {arrow}
      </button>
    )
  }

  return (
    <div className="flex h-full flex-col text-[13px] leading-5">
      <div
        className={`grid ${COLS} h-9 items-center gap-0 border-b border-b-ink bg-fill px-0`}
      >
        <span className="border-r border-r-rule px-1" />
        <span className="border-r border-r-rule px-2">
          {header('company', 'Company')}
        </span>
        <span className="hidden border-r border-r-rule px-2 min-[760px]:block">
          Role
        </span>
        <span className="border-r border-r-rule px-2">
          {header('status', 'Status')}
        </span>
        <span className="hidden border-r border-r-rule px-2 min-[760px]:block">
          Location
        </span>
        <span className="w-24 shrink-0 px-2 text-right whitespace-nowrap">
          {header('added', 'Added')}
        </span>
      </div>

      <div className="relative min-h-0 flex-1">
        {order.map((id, rank) => {
          const row = byId.get(id)
          if (!row) return null
          const config = getStatusConfig(row.status)
          const flash =
            flashId === id
              ? flashTone === 'a'
                ? 'landing-row-flash-a'
                : 'landing-row-flash-b'
              : ''
          return (
            <div
              key={id}
              className={`absolute inset-x-0 grid h-9 ${COLS} items-center border-b border-b-rule ${flash}`}
              style={{
                transform: `translateY(${rank * 36}px)`,
                transition: 'transform 480ms var(--ease)',
              }}
            >
              <span className="figure border-r border-r-rule bg-fill px-1 text-right text-ink-2 whitespace-nowrap">
                {rank + 1}
              </span>
              <span
                className="min-w-0 truncate border-r border-r-rule px-2 font-medium"
                title={row.company}
              >
                {row.company}
              </span>
              <span
                className="hidden min-w-0 truncate border-r border-r-rule px-2 min-[760px]:block"
                title={row.role}
              >
                {row.role}
              </span>
              <button
                type="button"
                className="inline-flex items-center gap-1.5 border-r border-r-rule px-2 text-left whitespace-nowrap"
                onClick={() => {
                  onInteract()
                  onCycleStatus(id)
                }}
              >
                <StatusMark mark={config.mark} color={config.color} />
                {config.label}
              </button>
              <span className="hidden min-w-0 truncate border-r border-r-rule px-2 min-[760px]:block">
                {row.location}
              </span>
              <span className="figure w-24 shrink-0 px-2 text-right whitespace-nowrap">
                {row.added}
              </span>
            </div>
          )
        })}
      </div>

      <div className="mt-auto flex flex-wrap items-center gap-4 border-t-[3px] border-double border-t-ink px-2 py-2">
        <span>
          {rows.length} applications
        </span>
        {STATUSES.map((status) => (
          <span
            key={status.value}
            className="inline-flex items-center gap-1.5"
          >
            <StatusMark mark={status.mark} color={status.color} />
            <span className="figure">{counts[status.value]}</span>
          </span>
        ))}
      </div>
    </div>
  )
}
