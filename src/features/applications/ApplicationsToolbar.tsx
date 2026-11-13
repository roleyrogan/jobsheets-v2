import type { Status } from '@/lib/status'
import { useApplicationFilters } from '@/features/applications/useApplicationFilters'
import { SearchInput } from '@/features/applications/SearchInput'
import { StatusFilterToggles } from '@/features/applications/StatusFilterToggles'
import { Button } from '@/components/ui/button'

type ApplicationsToolbarProps = {
  total: number
  counts: Record<Status, number>
  exportCount: number
  onExport: () => void
}

export function ApplicationsToolbar({
  total,
  counts,
  exportCount,
  onExport,
}: ApplicationsToolbarProps) {
  const { filters, setStatus } = useApplicationFilters()

  return (
    <div className="flex flex-col gap-3 md:flex-row md:items-center md:gap-4">
      <SearchInput />
      <StatusFilterToggles
        total={total}
        counts={counts}
        selected={filters.status}
        onSelect={setStatus}
      />
      <Button
        type="button"
        variant="outline"
        className="md:ml-auto"
        onClick={onExport}
        disabled={exportCount === 0}
      >
        {exportCount === 0 ? 'Export' : `Export ${exportCount}`}
      </Button>
    </div>
  )
}
