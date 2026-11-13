import {
  forwardRef,
  useImperativeHandle,
  useRef,
  useState,
} from 'react'
import { ExternalLink } from 'lucide-react'
import { motion } from 'motion/react'

import { toLocalYmd } from '@/lib/dates'
import {
  enterTransition,
  exitTransition,
  layoutTransition,
} from '@/lib/motion'
import { safeExternalUrl } from '@/lib/urls'
import { ApplicationRowActions } from '@/features/applications/ApplicationRowActions'
import { ApplicationStatusCell } from '@/features/applications/ApplicationStatusCell'
import { SheetCell, SheetGutterCell } from '@/components/sheet'
import { Button } from '@/components/ui/button'
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
    <motion.tr
      ref={rowRef}
      layout="position"
      initial={{ opacity: 0, y: -4 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, transition: exitTransition }}
      transition={{ ...enterTransition, layout: layoutTransition }}
      tabIndex={selected ? 0 : -1}
      data-selected={selected ? 'true' : undefined}
      onClick={() => {
        onSelect()
        focusRow()
      }}
      onFocus={onSelect}
      className={
        selected
          ? 'group/row h-9 bg-fill outline-2 outline-offset-[-2px] outline-select transition-colors duration-[120ms] ease-[var(--ease)]'
          : 'group/row h-9 outline-none transition-colors duration-[120ms] ease-[var(--ease)] hover:bg-fill'
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
        <ApplicationRowActions
          application={application}
          deleteOpen={deleteOpen}
          onDeleteOpenChange={setDeleteOpen}
          onEdit={onEdit}
          onCloseAutoFocus={(event) => {
            event.preventDefault()
            focusRow()
          }}
        />
      </SheetCell>
    </motion.tr>
  )
})
