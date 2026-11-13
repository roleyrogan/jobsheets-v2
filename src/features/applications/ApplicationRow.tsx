import {
  forwardRef,
  useImperativeHandle,
  useRef,
  useState,
} from 'react'
import { ExternalLink, MoreHorizontal } from 'lucide-react'

import { toLocalYmd } from '@/lib/dates'
import { safeExternalUrl } from '@/lib/urls'
import { ApplicationStatusCell } from '@/features/applications/ApplicationStatusCell'
import { DeleteApplicationDialog } from '@/features/applications/DeleteApplicationDialog'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import type { Application } from '@/types/index'

export type ApplicationRowHandle = {
  openStatus: () => void
  openDelete: () => void
  focus: () => void
}

type ApplicationRowProps = {
  application: Application
  rowNumber: number
  selected: boolean
  onSelect: () => void
  onEdit: (application: Application) => void
}

export const ApplicationRow = forwardRef<
  ApplicationRowHandle,
  ApplicationRowProps
>(function ApplicationRow(
  { application, rowNumber, selected, onSelect, onEdit },
  ref,
) {
  const [deleteOpen, setDeleteOpen] = useState(false)
  const [statusOpen, setStatusOpen] = useState(false)
  const rowRef = useRef<HTMLTableRowElement>(null)
  const statusTriggerRef = useRef<HTMLButtonElement>(null)
  const externalUrl = safeExternalUrl(application.application_url)
  const added = toLocalYmd(new Date(application.created_at))

  useImperativeHandle(ref, () => ({
    openStatus: () => setStatusOpen(true),
    openDelete: () => setDeleteOpen(true),
    focus: () => rowRef.current?.focus(),
  }))

  function focusRow() {
    rowRef.current?.focus()
  }

  return (
    <>
      <tr
        ref={rowRef}
        tabIndex={selected ? 0 : -1}
        data-selected={selected ? 'true' : undefined}
        onClick={() => {
          onSelect()
          focusRow()
        }}
        onFocus={onSelect}
        className={
          selected
            ? 'group/row h-9 border-b border-rule bg-fill outline-2 outline-offset-[-2px] outline-select'
            : 'group/row h-9 border-b border-rule outline-none hover:bg-fill'
        }
      >
        <td className="sticky left-0 z-10 w-10 border-r border-rule bg-fill px-2 text-right md:static">
          <span className="figure text-ink-2">{rowNumber}</span>
        </td>
        <td
          className={
            selected
              ? 'sticky left-10 z-10 max-w-[12rem] border-r border-rule bg-fill px-2 font-medium md:static'
              : 'sticky left-10 z-10 max-w-[12rem] border-r border-rule bg-paper px-2 font-medium group-hover/row:bg-fill md:static'
          }
          title={application.company}
        >
          <span className="block truncate">{application.company}</span>
        </td>
        <td
          className="max-w-[14rem] border-r border-rule px-2"
          title={application.role}
        >
          <span className="block truncate">{application.role}</span>
        </td>
        <td className="border-r border-rule px-2">
          <ApplicationStatusCell
            application={application}
            triggerRef={statusTriggerRef}
            open={statusOpen}
            onOpenChange={setStatusOpen}
            onCloseAutoFocus={(event) => {
              event.preventDefault()
              focusRow()
            }}
          />
        </td>
        <td
          className="max-w-[10rem] border-r border-rule px-2"
          title={application.location ?? undefined}
        >
          <span className="block truncate">{application.location ?? '—'}</span>
        </td>
        <td className="border-r border-rule px-2 text-right">
          <span className="figure">{added}</span>
        </td>
        <td className="border-r border-rule px-1">
          {externalUrl ? (
            <Button variant="ghost" size="icon-sm" asChild>
              <a
                href={externalUrl}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`Open posting for ${application.company}`}
                className="text-ink-2 hover:text-ink [&_svg]:size-3.5"
              >
                <ExternalLink />
              </a>
            </Button>
          ) : null}
        </td>
        <td className="px-1">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="icon-sm"
                aria-label={`Actions for ${application.company}`}
                className="text-ink-2 hover:text-ink"
              >
                <MoreHorizontal className="size-3.5" />
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
        </td>
      </tr>

      <DeleteApplicationDialog
        application={application}
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        onCloseAutoFocus={(event) => {
          event.preventDefault()
          focusRow()
        }}
      />
    </>
  )
})
