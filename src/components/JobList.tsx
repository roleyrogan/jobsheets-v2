import { useState } from 'react'
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
  'rounded-full px-4 py-1.5 text-sm font-medium transition-colors bg-transparent border border-[#3C096C] text-[#C77DFF] hover:border-[#7B2CBF] disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:border-[#3C096C]'

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
            <button
              key={option}
              type="button"
              onClick={() => handleFilterChange(option)}
              className={`rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${
                active
                  ? 'bg-[#7B2CBF] text-[#E0AAFF]'
                  : 'bg-transparent border border-[#3C096C] text-[#C77DFF] hover:border-[#7B2CBF]'
              }`}
            >
              {option}
            </button>
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
            <button
              type="button"
              onClick={() => setPage(currentPage - 1)}
              disabled={currentPage <= 1}
              className={inactiveButtonClass}
            >
              Previous
            </button>

            <p className="text-[#C77DFF] text-sm font-mono">
              Page {currentPage} of {totalPages}
            </p>

            <button
              type="button"
              onClick={() => setPage(currentPage + 1)}
              disabled={currentPage >= totalPages}
              className={inactiveButtonClass}
            >
              Next
            </button>
          </div>
        </>
      )}
    </div>
  )
}
