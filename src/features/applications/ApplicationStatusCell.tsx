import type { Ref } from 'react'
import { toast } from 'sonner'

import { STATUSES, isStatus, toStatus } from '@/lib/status'
import { useUpdateStatus } from '@/features/applications/mutations'
import { StatusBadge } from '@/features/applications/StatusBadge'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import type { Application } from '@/types/index'

type ApplicationStatusCellProps = {
  application: Application
  triggerRef: Ref<HTMLButtonElement>
}

export function ApplicationStatusCell({
  application,
  triggerRef,
}: ApplicationStatusCellProps) {
  const updateStatus = useUpdateStatus()
  const status = toStatus(application.status)

  return (
    <Select
      value={status}
      onValueChange={(value) => {
        if (!isStatus(value) || value === status) return
        updateStatus.mutate(
          { id: application.id, status: value },
          {
            onError: () => {
              toast.error("Couldn't update status")
            },
          },
        )
      }}
    >
      <SelectTrigger
        ref={triggerRef}
        size="sm"
        aria-label={`Status for ${application.company}`}
        className="h-auto border-0 bg-transparent px-0 py-0 [&_svg]:opacity-0 group-hover/row:[&_svg]:opacity-100 group-focus-within/row:[&_svg]:opacity-100 data-[state=open]:[&_svg]:opacity-100"
      >
        <SelectValue>
          <StatusBadge value={status} />
        </SelectValue>
      </SelectTrigger>
      <SelectContent>
        {STATUSES.map((item) => (
          <SelectItem key={item.value} value={item.value}>
            <StatusBadge value={item.value} />
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}
