import { STATUSES, type Status } from '@/lib/status'

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
      className="flex flex-wrap gap-1"
      role="group"
      aria-label="Filter by status"
    >
      <StatusToggle
        label={`All ${total}`}
        pressed={selected === 'all'}
        onClick={() => onSelect('all')}
      />
      {STATUSES.map((status) => (
        <StatusToggle
          key={status.value}
          label={`${status.label} ${counts[status.value]}`}
          pressed={selected === status.value}
          onClick={() => onSelect(status.value)}
        />
      ))}
    </div>
  )
}

function StatusToggle({
  label,
  pressed,
  onClick,
}: {
  label: string
  pressed: boolean
  onClick: () => void
}) {
  return (
    <button
      type="button"
      aria-pressed={pressed}
      onClick={onClick}
      className={
        pressed
          ? 'rounded-md bg-muted px-2.5 py-1 text-sm font-medium text-foreground'
          : 'rounded-md px-2.5 py-1 text-sm text-muted-foreground hover:bg-muted/60 hover:text-foreground'
      }
    >
      {label}
    </button>
  )
}
