import { useState } from 'react'
import { Button } from '@heroui/react'
import JobCard from './JobCard'
import type { Application } from '../types'

type JobListProps = {
  applications: Application[]
  onDelete: (id: string) => void
  onStatusUpdate: (id: string, newStatus: string) => void
}

type FilterOption = 'All' | Application['status']

const FILTERS: FilterOption[] = ['All', 'Applied', 'Interview', 'Offer', 'Rejected']
const PAGE_SIZE = 20

const inactiveButtonClass =
  'rounded-full bg-transparent border border-[#3C096C] text-[#C77DFF] hover:border-[#7B2CBF] data-[hovered=true]:border-[#7B2CBF]'

const activeButtonClass =
  'rounded-full bg-[#7B2CBF] text-[#E0AAFF] border border-[#7B2CBF]'

export default function JobList({ applications, onDelete, onStatusUpdate }: JobListProps) {
  const [filter, setFilter] = useState<FilterOption>('All')
  const [page, setPage] = useState(1)

  if (applications.length === 0) {
    return (
      <p className="text-[#C77DFF] text-sm text-center">
        No applications yet. Add one above.
      </p>
    )
  }

  const filtered =
    filter === 'All'
      ? applications
      : applications.filter(app => app.status === filter)

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE))
  const currentPage = Math.min(page, totalPages)
  const startIndex = (currentPage - 1) * PAGE_SIZE
  const paginated = filtered.slice(startIndex, startIndex + PAGE_SIZE)

  function handleFilterChange(option: FilterOption) {
    setFilter(option)
    setPage(1)
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap gap-2">
        {FILTERS.map(option => {
          const active = filter === option
          return (
            <Button
              key={option}
              type="button"
              size="sm"
              variant={active ? 'primary' : 'outline'}
              onPress={() => handleFilterChange(option)}
              className={active ? activeButtonClass : inactiveButtonClass}
            >
              {option}
            </Button>
          )
        })}
      </div>

      {filtered.length === 0 ? (
        <p className="text-[#C77DFF] text-sm text-center py-4">
          No applications with this status
        </p>
      ) : (
        <>
          <div className="flex flex-col gap-4">
            {paginated.map(application => (
              <JobCard
                key={application.id}
                application={application}
                onDelete={onDelete}
                onStatusUpdate={onStatusUpdate}
              />
            ))}
          </div>

          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <Button
              type="button"
              size="sm"
              variant="outline"
              onPress={() => setPage(currentPage - 1)}
              isDisabled={currentPage <= 1}
              className={inactiveButtonClass}
            >
              Previous
            </Button>

            <p className="text-[#C77DFF] text-sm font-mono">
              Page {currentPage} of {totalPages}
            </p>

            <Button
              type="button"
              size="sm"
              variant="outline"
              onPress={() => setPage(currentPage + 1)}
              isDisabled={currentPage >= totalPages}
              className={inactiveButtonClass}
            >
              Next
            </Button>
          </div>
        </>
      )}
    </div>
  )
}
