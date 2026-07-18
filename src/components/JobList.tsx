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

export default function JobList({ applications, onDelete, onStatusUpdate }: JobListProps) {
  const [filter, setFilter] = useState<FilterOption>('All')

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

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap gap-2">
        {FILTERS.map(option => {
          const active = filter === option
          return (
            <button
              key={option}
              type="button"
              onClick={() => setFilter(option)}
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
        <div className="flex flex-col gap-4">
          {filtered.map(application => (
            <JobCard
              key={application.id}
              application={application}
              onDelete={onDelete}
              onStatusUpdate={onStatusUpdate}
            />
          ))}
        </div>
      )}
    </div>
  )
}
