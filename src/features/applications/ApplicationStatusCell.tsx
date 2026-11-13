import { useState, type AnimationEvent, type Ref } from 'react'
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
  open: boolean
  onOpenChange: (open: boolean) => void
  onCloseAutoFocus?: (event: Event) => void
}

export function ApplicationStatusCell({
  application,
  triggerRef,
  open,
  onOpenChange,
  onCloseAutoFocus,
}: ApplicationStatusCellProps) {
  const updateStatus = useUpdateStatus()
  const status = toStatus(application.status)
  const [flashing, setFlashing] = useState(false)

  function handleFlashEnd(event: AnimationEvent<HTMLSpanElement>) {
    if (event.animationName !== 'status-flash') return
    setFlashing(false)
  }

  return (
    <Select
      value={status}
      open={open}
      onOpenChange={onOpenChange}
      onValueChange={(value) => {
        if (!isStatus(value) || value === status) return
        setFlashing(true)
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
        className="h-auto w-auto border-0 bg-transparent px-0 py-0 [&_svg.lucide-chevron-down]:size-4 [&_svg.lucide-chevron-down]:shrink-0 [&_svg.lucide-chevron-down]:opacity-0 group-hover/row:[&_svg.lucide-chevron-down]:opacity-100 group-focus-within/row:[&_svg.lucide-chevron-down]:opacity-100 data-[state=open]:[&_svg.lucide-chevron-down]:opacity-100"
      >
        <SelectValue>
          <span
            className={flashing ? 'status-flash inline-flex rounded-[3px]' : 'inline-flex'}
            onAnimationEnd={handleFlashEnd}
          >
            <StatusBadge value={status} />
          </span>
        </SelectValue>
      </SelectTrigger>
      <SelectContent onCloseAutoFocus={onCloseAutoFocus}>
        {STATUSES.map((item) => (
          <SelectItem key={item.value} value={item.value}>
            <StatusBadge value={item.value} />
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}
