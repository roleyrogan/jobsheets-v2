import { useCallback, useRef } from 'react'

import { countByStatus } from '@/lib/applicationFilters'
import { useApplicationFilters } from '@/features/applications/useApplicationFilters'
import {
  ApplicationRow,
  type ApplicationRowHandle,
} from '@/features/applications/ApplicationRow'
import { ApplicationsTableFooter } from '@/features/applications/ApplicationsTableFooter'
import { ApplicationsTableHeader } from '@/features/applications/ApplicationsTableHeader'
import { useSheetKeyboard } from '@/features/applications/useSheetKeyboard'
import type { Application } from '@/types/index'

type ApplicationsTableProps = {
  applications: Application[]
  onEdit: (application: Application) => void
}

export function ApplicationsTable({
  applications,
  onEdit,
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

  const { selectedId, setSelectedId, onKeyDown } = useSheetKeyboard({
    applications,
    onEdit,
    openStatus,
    openDelete,
  })

  return (
    <div className="max-md:overflow-x-auto">
      <p className="sr-only">
        Use arrow keys to move between rows, Enter to edit, S to change status.
      </p>
      <table className="w-full min-w-[760px] border-collapse text-[13px] leading-5 md:min-w-0">
        <ApplicationsTableHeader sort={filters.sort} onSort={toggleSort} />
        <tbody onKeyDown={onKeyDown}>
          {applications.map((application, index) => (
            <ApplicationRow
              key={application.id}
              ref={(handle) => {
                if (handle) rowRefs.current.set(application.id, handle)
                else rowRefs.current.delete(application.id)
              }}
              application={application}
              rowNumber={index + 1}
              selected={application.id === selectedId}
              onSelect={() => setSelectedId(application.id)}
              onEdit={onEdit}
            />
          ))}
        </tbody>
        <ApplicationsTableFooter
          total={applications.length}
          counts={counts}
        />
      </table>
    </div>
  )
}
