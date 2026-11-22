import { useCallback, useRef } from 'react'
import { AnimatePresence } from 'motion/react'

import { countByStatus } from '@/lib/applicationFilters'
import { useApplicationFilters } from '@/features/applications/useApplicationFilters'
import {
  ApplicationRow,
  type ApplicationRowHandle,
} from '@/features/applications/ApplicationRow'
import { ApplicationsTableFooter } from '@/features/applications/ApplicationsTableFooter'
import { ApplicationsTableHeader } from '@/features/applications/ApplicationsTableHeader'
import { useSheetKeyboard } from '@/features/applications/useSheetKeyboard'
import { SheetTable } from '@/components/sheet'
import type { Application } from '@/types/index'

type ApplicationsTableProps = {
  applications: Application[]
  onEdit: (application: Application) => void
  isSelected: (id: number) => boolean
  selectionMode: boolean
  allVisibleSelected: boolean
  someVisibleSelected: boolean
  onToggleSelectAll: () => void
  onGutterSelect: (
    id: number,
    modifiers: {
      shiftKey: boolean
      metaKey: boolean
      ctrlKey: boolean
      pointerType?: string
    },
  ) => void
  onToggleSelect: (id: number) => void
  onExtendSelect: (fromId: number, toId: number) => void
  onSelectAll: () => void
  onClearSelect: () => void
}

export function ApplicationsTable({
  applications,
  onEdit,
  isSelected,
  selectionMode,
  allVisibleSelected,
  someVisibleSelected,
  onToggleSelectAll,
  onGutterSelect,
  onToggleSelect,
  onExtendSelect,
  onSelectAll,
  onClearSelect,
}: ApplicationsTableProps) {
  const { filters, toggleSort } = useApplicationFilters()
  const rowRefs = useRef(new Map<number, ApplicationRowHandle>())
  const counts = countByStatus(applications)

  const openStatus = useCallback((id: number) => {
    rowRefs.current.get(id)?.openStatus()
  }, [])

  const openDelete = useCallback((id: number) => {
    rowRefs.current.get(id)?.openDelete()
  }, [])

  const focusRow = useCallback((id: number) => {
    rowRefs.current.get(id)?.focus()
  }, [])

  const { focusedId, setFocusedId, onKeyDown } = useSheetKeyboard({
    applications,
    onEdit,
    openStatus,
    openDelete,
    focusRow,
    onToggleSelect,
    onExtendSelect,
    onSelectAll,
    onClearSelect,
  })

  return (
    <>
      <p className="sr-only">
        Use arrow keys to move between rows, Enter to edit, S to change
        status, X to toggle selection, Shift+arrows to extend selection.
      </p>
      <SheetTable>
        <ApplicationsTableHeader
          sort={filters.sort}
          onSort={toggleSort}
          allSelected={allVisibleSelected}
          someSelected={someVisibleSelected}
          onToggleSelectAll={onToggleSelectAll}
        />
        <tbody onKeyDown={onKeyDown}>
          <AnimatePresence mode="popLayout" initial={false}>
            {applications.map((application, index) => (
              <ApplicationRow
                key={application.id}
                ref={(handle) => {
                  if (handle) rowRefs.current.set(application.id, handle)
                  else rowRefs.current.delete(application.id)
                }}
                application={application}
                rowNumber={index + 1}
                focused={application.id === focusedId}
                checked={isSelected(application.id)}
                selectionMode={selectionMode}
                onFocusRow={() => setFocusedId(application.id)}
                onGutterSelect={(modifiers) =>
                  onGutterSelect(application.id, modifiers)
                }
                onSelectRow={() =>
                  onGutterSelect(application.id, {
                    shiftKey: false,
                    metaKey: false,
                    ctrlKey: false,
                  })
                }
                onEdit={onEdit}
              />
            ))}
          </AnimatePresence>
        </tbody>
        <ApplicationsTableFooter
          total={applications.length}
          counts={counts}
        />
      </SheetTable>
    </>
  )
}
