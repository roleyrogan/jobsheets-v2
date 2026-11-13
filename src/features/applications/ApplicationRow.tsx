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
import { SheetCell, SheetGutterCell } from '@/components/sheet'
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
            ? 'group/row h-9 bg-fill outline-2 outline-offset-[-2px] outline-select'
            : 'group/row h-9 outline-none hover:bg-fill'
        }
      >
        <SheetGutterCell>{rowNumber}</SheetGutterCell>
        <SheetCell
          sticky="company"
          selected={selected}
          truncate
          title={application.company}
        >
          {application.company}
        </SheetCell>
        <SheetCell truncate title={application.role} className="max-w-[14rem]">
          {application.role}
        </SheetCell>
        <SheetCell>
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
        </SheetCell>
        <SheetCell
          truncate
          title={application.location ?? undefined}
          className="max-w-[10rem]"
        >
          {application.location ?? '—'}
        </SheetCell>
        <SheetCell className="text-right">
          <span className="figure">{added}</span>
        </SheetCell>
        <SheetCell className="px-1">
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
        </SheetCell>
        <SheetCell isLast className="px-1">
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
        </SheetCell>
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
