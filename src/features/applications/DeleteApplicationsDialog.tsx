import { toast } from 'sonner'

import { useDeleteApplications } from '@/features/applications/mutations'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogBody,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import type { Application } from '@/types/index'

const LIST_LIMIT = 5

type DeleteApplicationsDialogProps = {
  applications: Application[]
  open: boolean
  onOpenChange: (open: boolean) => void
  onDeleted: () => void
}

export function DeleteApplicationsDialog({
  applications,
  open,
  onOpenChange,
  onDeleted,
}: DeleteApplicationsDialogProps) {
  const deleteMutation = useDeleteApplications()
  const count = applications.length
  const named = applications.slice(0, LIST_LIMIT)
  const remaining = count - named.length

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            Delete {count} applications?
          </AlertDialogTitle>
        </AlertDialogHeader>
        <AlertDialogBody>
          <AlertDialogDescription asChild>
            <div className="flex flex-col gap-2 text-sm">
              <ul className="flex flex-col gap-1">
                {named.map((app) => (
                  <li key={app.id} className="font-medium text-ink">
                    {app.company}
                  </li>
                ))}
              </ul>
              {remaining > 0 ? (
                <p className="text-ink-2">and {remaining} more</p>
              ) : null}
              <p className="mt-1 text-ink-2">This can&apos;t be undone.</p>
            </div>
          </AlertDialogDescription>
        </AlertDialogBody>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            variant="destructive"
            disabled={count === 0 || deleteMutation.isPending}
            onClick={(event) => {
              event.preventDefault()
              void (async () => {
                const ids = applications.map((app) => app.id)
                if (ids.length === 0) return
                try {
                  // mutateAsync so toast/close still run if the list empties
                  // and unmounts selection UI while the request is in flight.
                  await deleteMutation.mutateAsync(ids)
                  toast.success(`Deleted ${ids.length} applications`)
                  onDeleted()
                  onOpenChange(false)
                } catch (error) {
                  toast.error(
                    error instanceof Error
                      ? error.message
                      : 'Could not delete applications',
                  )
                }
              })()
            }}
          >
            {deleteMutation.isPending ? 'Deleting…' : 'Delete'}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
