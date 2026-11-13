import type { Status } from '@/lib/status'
import type { SortKey } from '@/lib/applicationFilters'
import { useApplicationFilters } from '@/features/applications/useApplicationFilters'
import { SearchInput } from '@/features/applications/SearchInput'
import { StatusFilterToggles } from '@/features/applications/StatusFilterToggles'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

type ApplicationsToolbarProps = {
  total: number
  counts: Record<Status, number>
}

const SORT_OPTIONS: { value: SortKey; label: string }[] = [
  { value: 'newest', label: 'Newest' },
  { value: 'oldest', label: 'Oldest' },
  { value: 'company', label: 'Company A–Z' },
  { value: 'status', label: 'Status' },
]

export function ApplicationsToolbar({
  total,
  counts,
}: ApplicationsToolbarProps) {
  const { filters, setStatus, setSort } = useApplicationFilters()

  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end">
        <SearchInput />

        <div className="flex flex-col gap-1.5">
          <Label htmlFor="applications-sort">Sort</Label>
          <Select
            value={filters.sort}
            onValueChange={(value) => {
              if (
                value === 'newest' ||
                value === 'oldest' ||
                value === 'company' ||
                value === 'status'
              ) {
                setSort(value)
              }
            }}
          >
            <SelectTrigger id="applications-sort" className="w-44">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {SORT_OPTIONS.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <StatusFilterToggles
        total={total}
        counts={counts}
        selected={filters.status}
        onSelect={setStatus}
      />
    </div>
  )
}
