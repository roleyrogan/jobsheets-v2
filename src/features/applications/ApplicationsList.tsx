import { useEffect } from 'react'

import {
  countByStatus,
  filterAndSort,
  searchApplications,
} from '@/lib/applicationFilters'
import { useApplications } from '@/features/applications/queries'
import { useApplicationFilters } from '@/features/applications/useApplicationFilters'
import { ApplicationsToolbar } from '@/features/applications/ApplicationsToolbar'
import { ApplicationsTable } from '@/features/applications/ApplicationsTable'
import { ApplicationsTableSkeleton } from '@/features/applications/ApplicationsTableSkeleton'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import type { Application } from '@/types/index'

type ApplicationsListProps = {
  onAdd: () => void
  onEdit: (application: Application) => void
  onVisibleChange: (applications: Application[]) => void
  onExport: () => void
  exportCount: number
}

export function ApplicationsList({
  onAdd,
  onEdit,
  onVisibleChange,
  onExport,
  exportCount,
}: ApplicationsListProps) {
  const { data, error, isPending, isError, refetch, isFetching } =
    useApplications()
  const { filters, clear } = useApplicationFilters()

  const visible =
    data && data.length > 0 ? filterAndSort(data, filters) : []

  useEffect(() => {
    if (!data || data.length === 0) {
      onVisibleChange([])
      return
    }
    onVisibleChange(
      filterAndSort(data, {
        q: filters.q,
        status: filters.status,
        sort: filters.sort,
      }),
    )
  }, [
    data,
    filters.q,
    filters.status,
    filters.sort,
    onVisibleChange,
  ])

  if (isPending) {
    return (
      <div className="flex flex-col gap-4">
        <ApplicationsTableSkeleton />
      </div>
    )
  }

  if (isError) {
    return (
      <Alert variant="destructive">
        <AlertDescription className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <span>
            {error instanceof Error
              ? error.message
              : 'Could not load applications'}
          </span>
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              void refetch()
            }}
            disabled={isFetching}
          >
            {isFetching ? 'Retrying…' : 'Try again'}
          </Button>
        </AlertDescription>
      </Alert>
    )
  }

  if (!data || data.length === 0) {
    return (
      <div className="flex min-h-48 flex-col items-center justify-center gap-3 border border-rule">
        <p className="text-sm">No applications yet</p>
        <Button onClick={onAdd}>Add your first application</Button>
      </div>
    )
  }

  const searched = searchApplications(data, filters.q)
  const counts = countByStatus(searched)

  return (
    <div className="flex flex-col gap-4">
      <ApplicationsToolbar
        total={searched.length}
        counts={counts}
        exportCount={exportCount}
        onExport={onExport}
      />

      {visible.length === 0 ? (
        <div className="flex min-h-48 flex-col items-center justify-center gap-3 border border-rule">
          <p className="text-sm">No applications match your filters</p>
          <Button variant="outline" onClick={clear}>
            Clear filters
          </Button>
        </div>
      ) : (
        <ApplicationsTable applications={visible} onEdit={onEdit} />
      )}
    </div>
  )
}
