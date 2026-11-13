import { MoreHorizontal } from 'lucide-react'

import { DeleteApplicationDialog } from '@/features/applications/DeleteApplicationDialog'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import type { Application } from '@/types/index'

type ApplicationRowActionsProps = {
  application: Application
  deleteOpen: boolean
  onDeleteOpenChange: (open: boolean) => void
  onEdit: (application: Application) => void
  onCloseAutoFocus: (event: Event) => void
}

export function ApplicationRowActions({
  application,
  deleteOpen,
  onDeleteOpenChange,
  onEdit,
  onCloseAutoFocus,
}: ApplicationRowActionsProps) {
  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            size="icon-sm"
            aria-label={`Actions for ${application.company}`}
          >
            <MoreHorizontal />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onSelect={() => onEdit(application)}>
            Edit
          </DropdownMenuItem>
          <DropdownMenuItem
            variant="destructive"
            onSelect={() => onDeleteOpenChange(true)}
          >
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      <DeleteApplicationDialog
        application={application}
        open={deleteOpen}
        onOpenChange={onDeleteOpenChange}
        onCloseAutoFocus={onCloseAutoFocus}
      />
    </>
  )
}
