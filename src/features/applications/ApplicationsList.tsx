import { useMemo, useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'

import {
  countByStatus,
  filterAndSort,
  searchApplications,
} from '@/lib/applicationFilters'
import { enterTransition, exitTransition } from '@/lib/motion'
import { useApplications } from '@/features/applications/queries'
import { useApplicationFilters } from '@/features/applications/useApplicationFilters'
import { useSheetSelection } from '@/features/applications/useSheetSelection'
import { ApplicationsToolbar } from '@/features/applications/ApplicationsToolbar'
import { ApplicationsTable } from '@/features/applications/ApplicationsTable'
import { ApplicationsTableSkeleton } from '@/features/applications/ApplicationsTableSkeleton'
import { DeleteApplicationsDialog } from '@/features/applications/DeleteApplicationsDialog'
import { SelectionBar } from '@/features/applications/SelectionBar'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import type { Application } from '@/types/index'

type ApplicationsListProps = {
  onAdd: () => void
  onEdit: (application: Application) => void
  onExport: (applications: Application[]) => void
}

export function ApplicationsList({
  onAdd,
  onEdit,
  onExport,
}: ApplicationsListProps) {
  const { data, error, isPending, isError, refetch, isFetching } =
    useApplications()
  const { filters, clear } = useApplicationFilters()
  const { q, status, sort } = filters
  const [deleteOpen, setDeleteOpen] = useState(false)

  const visible = useMemo(
    () =>
      data && data.length > 0
        ? filterAndSort(data, { q, status, sort })
        : [],
    [data, q, status, sort],
  )
  const visibleIds = useMemo(
    () => visible.map((app) => app.id),
    [visible],
  )

  const selection = useSheetSelection(visibleIds)

  const selectedApps = useMemo(() => {
    const idSet = new Set(selection.selectedIds)
    return visible.filter((app) => idSet.has(app.id))
  }, [visible, selection.selectedIds])

  if (isPending) {
    return (
      <div className="flex flex-col gap-4">
        <ApplicationsTableSkeleton />
      </div>
    )
  }

  if (isError) {
    return (
      <Alert variant="destructive">
        <AlertDescription className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <span>
            {error instanceof Error
              ? error.message
              : 'Could not load applications'}
          </span>
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              void refetch()
            }}
            disabled={isFetching}
          >
            {isFetching ? 'Retrying…' : 'Try again'}
          </Button>
        </AlertDescription>
      </Alert>
    )
  }

  if (!data || data.length === 0) {
    return (
      <div className="flex min-h-48 flex-col items-center justify-center gap-3 border border-rule">
        <p className="text-sm">No applications yet</p>
        <Button onClick={onAdd}>Add your first application</Button>
      </div>
    )
  }

  const searched = searchApplications(data, filters.q)
  const counts = countByStatus(searched)

  return (
    <div className="flex flex-col gap-4">
      <div className="min-h-8">
        <AnimatePresence mode="wait" initial={false}>
          {selection.selectedCount > 0 ? (
            <SelectionBar
              key="selection"
              selected={selectedApps}
              onExport={() => onExport(selectedApps)}
              onDelete={() => setDeleteOpen(true)}
              onClear={selection.clear}
            />
          ) : (
            <motion.div
              key="toolbar"
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4, transition: exitTransition }}
              transition={enterTransition}
            >
              <ApplicationsToolbar
                total={searched.length}
                counts={counts}
                exportCount={visible.length}
                onExport={() => onExport(visible)}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {visible.length === 0 ? (
        <div className="flex min-h-48 flex-col items-center justify-center gap-3 border border-rule">
          <p className="text-sm">No applications match your filters</p>
          <Button variant="outline" onClick={clear}>
            Clear filters
          </Button>
        </div>
      ) : (
        <ApplicationsTable
          applications={visible}
          onEdit={onEdit}
          isSelected={selection.isSelected}
          selectionMode={selection.selectedCount > 0}
          allVisibleSelected={selection.allVisibleSelected}
          someVisibleSelected={selection.someVisibleSelected}
          onToggleSelectAll={selection.toggleSelectAll}
          onGutterSelect={selection.onGutterSelect}
          onToggleSelect={selection.toggleId}
          onExtendSelect={selection.extendTo}
          onSelectAll={selection.selectAllVisible}
          onClearSelect={selection.clear}
        />
      )}

      <DeleteApplicationsDialog
        applications={selectedApps}
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        onDeleted={selection.clear}
      />
    </div>
  )
}
