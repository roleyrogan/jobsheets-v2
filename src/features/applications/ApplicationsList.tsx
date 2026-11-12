import { useApplications } from '@/features/applications/queries'
import { ApplicationsSummary } from '@/features/applications/ApplicationsSummary'
import { ApplicationsTable } from '@/features/applications/ApplicationsTable'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'

export function ApplicationsList() {
  const { data, error, isPending, isError, refetch, isFetching } =
    useApplications()

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
      <div className="flex flex-col gap-1">
        <p className="font-medium">No applications yet</p>
        <p className="text-sm text-muted-foreground">
          When you add one, it will show up here.
        </p>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-4">
      <ApplicationsSummary applications={data} />
      <ApplicationsTable applications={data} />
    </div>
  )
}

function ApplicationsTableSkeleton() {
  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Company</TableHead>
            <TableHead>Role</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Location</TableHead>
            <TableHead>Added</TableHead>
            <TableHead>
              <span className="sr-only">Link</span>
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {Array.from({ length: 5 }, (_, index) => (
            <TableRow key={index}>
              <TableCell>
                <Skeleton className="h-4 w-28" />
              </TableCell>
              <TableCell>
                <Skeleton className="h-4 w-36" />
              </TableCell>
              <TableCell>
                <Skeleton className="h-4 w-20" />
              </TableCell>
              <TableCell>
                <Skeleton className="h-4 w-24" />
              </TableCell>
              <TableCell>
                <Skeleton className="h-4 w-24" />
              </TableCell>
              <TableCell>
                <Skeleton className="size-4" />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
