import { useState } from 'react'
import { ExternalLink, MoreHorizontal } from 'lucide-react'
import { toast } from 'sonner'

import { formatDate } from '@/lib/dates'
import { safeExternalUrl } from '@/lib/urls'
import { STATUSES, isStatus, toStatus } from '@/lib/status'
import { useUpdateStatus } from '@/features/applications/mutations'
import { StatusBadge } from '@/features/applications/StatusBadge'
import { DeleteApplicationDialog } from '@/features/applications/DeleteApplicationDialog'
import { Button } from '@/components/ui/button'
import { TableCell, TableRow } from '@/components/ui/table'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import type { Application } from '@/types/index'

type ApplicationRowProps = {
  application: Application
  onEdit: (application: Application) => void
}

export function ApplicationRow({ application, onEdit }: ApplicationRowProps) {
  const updateStatus = useUpdateStatus()
  const [deleteOpen, setDeleteOpen] = useState(false)
  const externalUrl = safeExternalUrl(application.application_url)
  const status = toStatus(application.status)

  return (
    <>
      <TableRow>
        <TableCell className="font-medium">{application.company}</TableCell>
        <TableCell>{application.role}</TableCell>
        <TableCell>
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
              size="sm"
              className="h-auto border-0 bg-transparent px-1.5 py-1"
              aria-label={`Status for ${application.company}`}
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
        </TableCell>
        <TableCell className="text-muted-foreground">
          {application.location ?? '—'}
        </TableCell>
        <TableCell className="tabular-nums text-muted-foreground">
          {formatDate(application.created_at)}
        </TableCell>
        <TableCell className="w-10">
          {externalUrl ? (
            <Button variant="ghost" size="icon-sm" asChild>
              <a
                href={externalUrl}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`Open posting for ${application.company}`}
              >
                <ExternalLink />
              </a>
            </Button>
          ) : null}
        </TableCell>
        <TableCell className="w-10">
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
                onSelect={() => setDeleteOpen(true)}
              >
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </TableCell>
      </TableRow>

      <DeleteApplicationDialog
        application={application}
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
      />
    </>
  )
}
