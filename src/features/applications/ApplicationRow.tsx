import {
  forwardRef,
  useImperativeHandle,
  useRef,
  useState,
} from 'react'
import { ExternalLink } from 'lucide-react'
import { motion } from 'motion/react'
import { cn } from 'cn'

import { toLocalYmd } from '@/lib/dates'
import {
  enterTransition,
  exitTransition,
  layoutTransition,
} from '@/lib/motion'
import { safeExternalUrl } from '@/lib/urls'
import { ApplicationRowActions } from '@/features/applications/ApplicationRowActions'
import { ApplicationStatusCell } from '@/features/applications/ApplicationStatusCell'
import { RowSelectCheckbox } from '@/features/applications/RowSelectCheckbox'
import { SheetCell, SheetGutterCell } from '@/components/sheet'
import { Button } from '@/components/ui/button'
import type { Application } from '@/types/index'

export type ApplicationRowHandle = {
  openStatus: () => void
  openDelete: () => void
  /** Keyboard navigation should pass `{ keyboard: true }` so :focus-visible styling applies. */
  focus: (options?: { keyboard?: boolean }) => void
}

type ApplicationRowProps = {
  application: Application
  rowNumber: number
  focused: boolean
  checked: boolean
  selectionMode: boolean
  onFocusRow: () => void
  onGutterSelect: (modifiers: {
    shiftKey: boolean
    metaKey: boolean
    ctrlKey: boolean
    pointerType?: string
  }) => void
  onSelectRow: () => void
  onEdit: (application: Application) => void
}

export const ApplicationRow = forwardRef<
  ApplicationRowHandle,
  ApplicationRowProps
>(function ApplicationRow(
  {
    application,
    rowNumber,
    focused,
    checked,
    selectionMode,
    onFocusRow,
    onGutterSelect,
    onSelectRow,
    onEdit,
  },
  ref,
) {
  const [deleteOpen, setDeleteOpen] = useState(false)
  const [statusOpen, setStatusOpen] = useState(false)
  const [focusVisible, setFocusVisible] = useState(false)
  const rowRef = useRef<HTMLTableRowElement>(null)
  const statusTriggerRef = useRef<HTMLButtonElement>(null)
  const externalUrl = safeExternalUrl(application.application_url)
  const added = toLocalYmd(new Date(application.created_at))

  function focusRow(keyboard = false) {
    setFocusVisible(keyboard)
    const node = rowRef.current
    if (!node) return
    if (keyboard) {
      node.focus({ focusVisible: true })
      return
    }
    node.focus()
  }

  useImperativeHandle(ref, () => ({
    openStatus: () => setStatusOpen(true),
    openDelete: () => setDeleteOpen(true),
    focus: (options) => focusRow(options?.keyboard ?? true),
  }))

  return (
    <motion.tr
      ref={rowRef}
      layout="position"
      initial={{ opacity: 0, y: -4 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, transition: exitTransition }}
      transition={{ ...enterTransition, layout: layoutTransition }}
      tabIndex={focused ? 0 : -1}
      data-selected={focused ? 'true' : undefined}
      data-checked={checked ? 'true' : undefined}
      data-focus-visible={focusVisible ? '' : undefined}
      onClick={() => {
        onFocusRow()
        focusRow(false)
      }}
      onFocus={(event) => {
        onFocusRow()
        // Only promote — never clear here. Mouse focus is not :focus-visible;
        // keyboard/imperative paths set data-focus-visible explicitly.
        if (event.currentTarget.matches(':focus-visible')) {
          setFocusVisible(true)
        }
      }}
      onBlur={() => setFocusVisible(false)}
      className={cn(
        'group/row h-9 outline-none transition-colors duration-[120ms] ease-[var(--ease)]',
        checked ? 'bg-fill' : 'hover:bg-fill',
        focused &&
          'outline-2 outline-offset-[-2px] outline-select',
      )}
    >
      <SheetGutterCell checked={checked}>
        <RowSelectCheckbox
          checked={checked}
          rowNumber={rowNumber}
          selectionMode={selectionMode}
          label={`Select ${application.company}, ${application.role}`}
          onSelect={(modifiers) => {
            onGutterSelect(modifiers)
            onFocusRow()
            focusRow(false)
          }}
        />
      </SheetGutterCell>
      <SheetCell
        sticky="company"
        selected={focused || checked}
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
            focusRow(false)
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
          onSelect={() => {
            onSelectRow()
            onFocusRow()
            focusRow(false)
          }}
          onCloseAutoFocus={(event) => {
            event.preventDefault()
            focusRow(false)
          }}
        />
      </SheetCell>
    </motion.tr>
  )
})
