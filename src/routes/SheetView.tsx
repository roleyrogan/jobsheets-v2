import { useCallback, useState } from 'react'

import { applicationsToCsv } from '@/lib/csv'
import { toLocalYmd } from '@/lib/dates'
import { downloadTextFile } from '@/lib/download'
import { useApplicationDialogs } from '@/features/applications/useApplicationDialogs'
import { ApplicationsList } from '@/features/applications/ApplicationsList'
import type { Application } from '@/types/index'

export function SheetView() {
  const { openCreate, openEdit } = useApplicationDialogs()
  const [visible, setVisible] = useState<Application[]>([])

  const onVisibleChange = useCallback((applications: Application[]) => {
    setVisible(applications)
  }, [])

  function handleExport() {
    if (visible.length === 0) return
    downloadTextFile(
      applicationsToCsv(visible),
      `jobsheets-${toLocalYmd()}.csv`,
    )
  }

  return (
    <ApplicationsList
      onAdd={openCreate}
      onEdit={openEdit}
      onVisibleChange={onVisibleChange}
      onExport={handleExport}
      exportCount={visible.length}
    />
  )
}
