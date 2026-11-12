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
import { Skeleton } from '@/components/ui/skeleton'
import type { Application } from '@/types/index'

type ApplicationsListProps = {
  onAdd: () => void
  onEdit: (application: Application) => void
}

export function ApplicationsList({ onAdd, onEdit }: ApplicationsListProps) {
  const { data, error, isPending, isError, refetch, isFetching } =
    useApplications()
  const { filters, clear } = useApplicationFilters()

  if (isPending) {
    return (
      <div className="flex flex-col gap-4">
        <Skeleton className="h-4 w-72" />
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
      <div className="flex flex-col items-start gap-3">
        <div className="flex flex-col gap-1">
          <p className="font-medium">No applications yet</p>
          <p className="text-sm text-muted-foreground">
            When you add one, it will show up here.
          </p>
        </div>
        <Button onClick={onAdd}>Add your first application</Button>
      </div>
    )
  }

  const searched = searchApplications(data, filters.q)
  const visible = filterAndSort(data, filters)
  const counts = countByStatus(searched)

  return (
    <div className="flex flex-col gap-4">
      <ApplicationsToolbar total={searched.length} counts={counts} />

      {visible.length === 0 ? (
        <div className="flex flex-col items-start gap-3">
          <p className="font-medium">No applications match your filters</p>
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
