import { useCallback, useState } from 'react'

import { applicationsToCsv } from '@/lib/csv'
import { toLocalYmd } from '@/lib/dates'
import { downloadTextFile } from '@/lib/download'
import { useApplicationDialogs } from '@/features/applications/useApplicationDialogs'
import { ApplicationsList } from '@/features/applications/ApplicationsList'
import { Button } from '@/components/ui/button'
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
    <div className="flex flex-col gap-4">
      <div className="flex justify-end">
        <Button
          variant="outline"
          onClick={handleExport}
          disabled={visible.length === 0}
        >
          {visible.length === 0 ? 'Export' : `Export ${visible.length}`}
        </Button>
      </div>

      <ApplicationsList
        onAdd={openCreate}
        onEdit={openEdit}
        onVisibleChange={onVisibleChange}
      />
    </div>
  )
}
