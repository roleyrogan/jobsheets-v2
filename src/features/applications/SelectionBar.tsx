import { toast } from 'sonner'
import { motion } from 'motion/react'

import { enterTransition, exitTransition } from '@/lib/motion'
import { STATUSES, type Status } from '@/lib/status'
import { useUpdateStatuses } from '@/features/applications/mutations'
import { StatusBadge } from '@/features/applications/StatusBadge'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import type { Application } from '@/types/index'

type SelectionBarProps = {
  selected: Application[]
  onExport: () => void
  onDelete: () => void
  onClear: () => void
}

export function SelectionBar({
  selected,
  onExport,
  onDelete,
  onClear,
}: SelectionBarProps) {
  const updateStatuses = useUpdateStatuses()
  const count = selected.length

  async function changeStatus(status: Status) {
    const ids = selected
      .filter((row) => row.status !== status)
      .map((row) => row.id)
    if (ids.length === 0) return
    try {
      // mutateAsync: per-call callbacks are skipped if this bar unmounts
      // (e.g. selection clears while the request is in flight).
      await updateStatuses.mutateAsync({ ids, status })
      toast.success(`Changed ${ids.length} applications to ${status}`)
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "Couldn't update status",
      )
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: -4 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -4, transition: exitTransition }}
      transition={enterTransition}
      className="flex min-h-8 flex-wrap items-center gap-2"
    >
      <span className="figure mr-1 text-sm">{count} selected</span>
      <span className="mr-1 hidden text-xs text-ink-2 min-[640px]:inline pointer-coarse:hidden">
        Shift-click to select a range
      </span>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button type="button" variant="outline">
            Change status
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start">
          {STATUSES.map((item) => (
            <DropdownMenuItem
              key={item.value}
              onSelect={() => {
                void changeStatus(item.value)
              }}
            >
              <StatusBadge value={item.value} />
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
      <Button type="button" variant="outline" onClick={onExport}>
        Export {count}
      </Button>
      <Button type="button" variant="outline" onClick={onDelete}>
        Delete {count}
      </Button>
      <Button type="button" variant="ghost" onClick={onClear}>
        Clear
      </Button>
    </motion.div>
  )
}
