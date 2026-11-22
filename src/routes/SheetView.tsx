import { applicationsToCsv } from '@/lib/csv'
import { toLocalYmd } from '@/lib/dates'
import { downloadTextFile } from '@/lib/download'
import { useApplicationDialogs } from '@/features/applications/useApplicationDialogs'
import { ApplicationsList } from '@/features/applications/ApplicationsList'
import type { Application } from '@/types/index'

export function SheetView() {
  const { openCreate, openEdit } = useApplicationDialogs()

  function handleExport(applications: Application[]) {
    if (applications.length === 0) return
    downloadTextFile(
      applicationsToCsv(applications),
      `jobsheets-${toLocalYmd()}.csv`,
    )
  }

  return (
    <ApplicationsList
      onAdd={openCreate}
      onEdit={openEdit}
      onExport={handleExport}
    />
  )
}
