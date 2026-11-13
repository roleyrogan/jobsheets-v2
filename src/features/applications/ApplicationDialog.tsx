import { toast } from 'sonner'

import { toStatus } from '@/lib/status'
import {
  useCreateApplication,
  useUpdateApplication,
} from '@/features/applications/mutations'
import { ApplicationForm } from '@/features/applications/ApplicationForm'
import type { ApplicationFormInput } from '@/features/applications/schema'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import type { Application } from '@/types/index'

type ApplicationDialogProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  application?: Application | null
  onCloseAutoFocus?: (event: Event) => void
}

const emptyValues: ApplicationFormInput = {
  company: '',
  role: '',
  status: 'Applied',
  application_url: '',
  location: '',
  notes: '',
}

function toFormInput(application: Application): ApplicationFormInput {
  return {
    company: application.company,
    role: application.role,
    status: toStatus(application.status),
    application_url: application.application_url ?? '',
    location: application.location ?? '',
    notes: application.notes ?? '',
  }
}

export function ApplicationDialog({
  open,
  onOpenChange,
  application = null,
  onCloseAutoFocus,
}: ApplicationDialogProps) {
  const createMutation = useCreateApplication()
  const updateMutation = useUpdateApplication()
  const mode = application ? 'edit' : 'create'
  const defaultValues = application ? toFormInput(application) : emptyValues

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="sm:max-w-md"
        onCloseAutoFocus={onCloseAutoFocus}
      >
        <DialogHeader>
          <DialogTitle>
            {mode === 'create' ? 'Add application' : 'Edit application'}
          </DialogTitle>
        </DialogHeader>
        <ApplicationForm
          key={application ? `edit-${application.id}` : 'create'}
          mode={mode}
          layout="dialog"
          defaultValues={defaultValues}
          onSubmit={async (values) => {
            if (mode === 'create') {
              await createMutation.mutateAsync(values)
              toast.success('Application added')
            } else if (application) {
              await updateMutation.mutateAsync({
                id: application.id,
                values,
              })
              toast.success('Changes saved')
            }
            onOpenChange(false)
          }}
        />
      </DialogContent>
    </Dialog>
  )
}
