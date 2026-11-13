import { useState } from 'react'
import { MoreHorizontal } from 'lucide-react'
import { toast } from 'sonner'

import { STATUSES, toStatus, type Status } from '@/lib/status'
import { useUpdateStatus } from '@/features/applications/mutations'
import { DeleteApplicationDialog } from '@/features/applications/DeleteApplicationDialog'
import { useApplicationDialogs } from '@/features/applications/useApplicationDialogs'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import type { Application } from '@/types/index'

type BoardCardMenuProps = {
  application: Application
}

export function BoardCardMenu({ application }: BoardCardMenuProps) {
  const { openEdit } = useApplicationDialogs()
  const updateStatus = useUpdateStatus()
  const [deleteOpen, setDeleteOpen] = useState(false)
  const current = toStatus(application.status)
  const otherStatuses = STATUSES.filter((item) => item.value !== current)

  function moveTo(status: Status) {
    updateStatus.mutate(
      { id: application.id, status },
      {
        onError: () => {
          toast.error("Couldn't update status")
        },
      },
    )
  }

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            size="icon-sm"
            aria-label={`Actions for ${application.company}`}
            onPointerDown={(event) => event.stopPropagation()}
          >
            <MoreHorizontal />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onSelect={() => openEdit(application)}>
            Edit
          </DropdownMenuItem>
          <DropdownMenuSub>
            <DropdownMenuSubTrigger>Move to</DropdownMenuSubTrigger>
            <DropdownMenuSubContent>
              {otherStatuses.map((item) => (
                <DropdownMenuItem
                  key={item.value}
                  onSelect={() => moveTo(item.value)}
                >
                  {item.label}
                </DropdownMenuItem>
              ))}
            </DropdownMenuSubContent>
          </DropdownMenuSub>
          <DropdownMenuItem
            variant="destructive"
            onSelect={() => setDeleteOpen(true)}
          >
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <DeleteApplicationDialog
        application={application}
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
      />
    </>
  )
}
