import { useCallback, useState } from 'react'

import { applicationsToCsv } from '@/lib/csv'
import { toLocalYmd } from '@/lib/dates'
import { downloadTextFile } from '@/lib/download'
import { ApplicationsList } from '@/features/applications/ApplicationsList'
import { ApplicationsHeader } from '@/features/applications/ApplicationsHeader'
import { ApplicationDialog } from '@/features/applications/ApplicationDialog'
import { ImportDialog } from '@/features/applications/ImportDialog'
import type { Application } from '@/types/index'

export function Applications() {
  const [dialogOpen, setDialogOpen] = useState(false)
  const [importOpen, setImportOpen] = useState(false)
  const [editing, setEditing] = useState<Application | null>(null)
  const [visible, setVisible] = useState<Application[]>([])

  const onVisibleChange = useCallback((applications: Application[]) => {
    setVisible(applications)
  }, [])

  function openCreate() {
    setEditing(null)
    setDialogOpen(true)
  }

  function openEdit(application: Application) {
    setEditing(application)
    setDialogOpen(true)
  }

  function handleExport() {
    if (visible.length === 0) return
    downloadTextFile(
      applicationsToCsv(visible),
      `jobsheets-${toLocalYmd()}.csv`,
    )
  }

  return (
    <div className="flex flex-col gap-6">
      <ApplicationsHeader
        exportCount={visible.length}
        onAdd={openCreate}
        onImport={() => setImportOpen(true)}
        onExport={handleExport}
      />

      <ApplicationsList
        onAdd={openCreate}
        onEdit={openEdit}
        onVisibleChange={onVisibleChange}
      />

      <ApplicationDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        application={editing}
      />

      <ImportDialog open={importOpen} onOpenChange={setImportOpen} />
    </div>
  )
}
