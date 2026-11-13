import { searchApplications } from '@/lib/applicationFilters'
import { useApplications } from '@/features/applications/queries'
import { useApplicationFilters } from '@/features/applications/useApplicationFilters'
import { useApplicationDialogs } from '@/features/applications/useApplicationDialogs'
import { SearchInput } from '@/features/applications/SearchInput'
import { Board } from '@/features/board/Board'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'

export function BoardView() {
  const { openCreate } = useApplicationDialogs()
  const { data, error, isPending, isError, refetch, isFetching } =
    useApplications()
  const { filters } = useApplicationFilters()

  if (isPending) {
    return (
      <div className="flex flex-col gap-4">
        <Skeleton className="h-9 w-full" />
        <Skeleton className="h-48 w-full" />
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
          <p className="text-sm text-ink-2">
            When you add one, it will show up here.
          </p>
        </div>
        <Button onClick={openCreate}>Add your first application</Button>
      </div>
    )
  }

  const visible = searchApplications(data, filters.q)

  return (
    <div className="flex flex-col gap-4 overflow-x-hidden">
      <SearchInput id="board-search" />
      <Board applications={visible} />
    </div>
  )
}
