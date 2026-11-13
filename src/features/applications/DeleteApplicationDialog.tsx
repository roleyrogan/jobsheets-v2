import { toast } from 'sonner'

import { useDeleteApplication } from '@/features/applications/mutations'
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

type DeleteApplicationDialogProps = {
  application: Application | null
  open: boolean
  onOpenChange: (open: boolean) => void
  onCloseAutoFocus?: (event: Event) => void
}

export function DeleteApplicationDialog({
  application,
  open,
  onOpenChange,
  onCloseAutoFocus,
}: DeleteApplicationDialogProps) {
  const deleteMutation = useDeleteApplication()

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent onCloseAutoFocus={onCloseAutoFocus}>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete this application?</AlertDialogTitle>
        </AlertDialogHeader>
        <AlertDialogBody>
          <AlertDialogDescription asChild>
            <div className="flex flex-col gap-1 text-sm">
              {application ? (
                <>
                  <p className="font-medium text-ink">{application.company}</p>
                  <p className="text-ink-2">{application.role}</p>
                </>
              ) : null}
              <p className="mt-2 text-ink-2">This can&apos;t be undone.</p>
            </div>
          </AlertDialogDescription>
        </AlertDialogBody>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            variant="destructive"
            disabled={!application || deleteMutation.isPending}
            onClick={(event) => {
              event.preventDefault()
              if (!application) return
              deleteMutation.mutate(application.id, {
                onSuccess: () => {
                  toast.success('Application deleted')
                  onOpenChange(false)
                },
                onError: (error) => {
                  toast.error(
                    error instanceof Error
                      ? error.message
                      : 'Could not delete application',
                  )
                },
              })
            }}
          >
            {deleteMutation.isPending ? 'Deleting…' : 'Delete'}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
