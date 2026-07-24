import { useState, type Key } from 'react'
import { Button, ListBox, Select } from '@heroui/react'
import { AnimatedItem } from './AnimatedList'
import JobCard from './JobCard'
import type { Application } from '../types'

type JobListProps = {
  applications: Application[]
  onDelete: (id: string) => void
  onEdit: (application: Application) => void
  onStatusUpdate: (id: string, newStatus: string) => void
}

type FilterOption = 'All' | Application['status']
type SortOption = 'newest' | 'oldest' | 'company-asc' | 'company-desc' | 'status'

const FILTERS: FilterOption[] = ['All', 'Applied', 'Interview', 'Offer', 'Rejected']
const PAGE_SIZE = 20

const STATUS_SORT_ORDER: Record<Application['status'], number> = {
  Interview: 0,
  Applied: 1,
  Offer: 2,
  Rejected: 3,
}

const SORT_OPTIONS: { value: SortOption; label: string }[] = [
  { value: 'newest', label: 'Newest First' },
  { value: 'oldest', label: 'Oldest First' },
  { value: 'company-asc', label: 'Company A-Z' },
  { value: 'company-desc', label: 'Company Z-A' },
  { value: 'status', label: 'Status' },
]

const inactiveButtonClass =
  'rounded-full bg-transparent border border-[#3C096C] text-[#C77DFF] hover:border-[#7B2CBF] data-[hovered=true]:border-[#7B2CBF]'

const activeButtonClass =
  'rounded-full bg-[#7B2CBF] text-[#E0AAFF] border border-[#7B2CBF]'

function sortApplications(apps: Application[], sort: SortOption): Application[] {
  const sorted = [...apps]

  switch (sort) {
    case 'newest':
      return sorted.sort((a, b) => b.date.localeCompare(a.date))
    case 'oldest':
      return sorted.sort((a, b) => a.date.localeCompare(b.date))
    case 'company-asc':
      return sorted.sort((a, b) => a.company.localeCompare(b.company))
    case 'company-desc':
      return sorted.sort((a, b) => b.company.localeCompare(a.company))
    case 'status':
      return sorted.sort(
        (a, b) => STATUS_SORT_ORDER[a.status] - STATUS_SORT_ORDER[b.status]
      )
    default:
      return sorted
  }
}

export default function JobList({ applications, onDelete, onEdit, onStatusUpdate }: JobListProps) {
  const [filter, setFilter] = useState<FilterOption>('All')
  const [search, setSearch] = useState('')
  const [sort, setSort] = useState<SortOption>('newest')
  const [page, setPage] = useState(1)

  if (applications.length === 0) {
    return (
      <p className="text-[#C77DFF] text-sm text-center">
        No applications yet. Add one above.
      </p>
    )
  }

  const query = search.trim().toLowerCase()

  const statusFiltered =
    filter === 'All'
      ? applications
      : applications.filter(app => app.status === filter)

  const searchFiltered = query
    ? statusFiltered.filter(
        app =>
          app.company.toLowerCase().includes(query) ||
          app.role.toLowerCase().includes(query)
      )
    : statusFiltered

  const filtered = sortApplications(searchFiltered, sort)
  const isFiltered = filter !== 'All' || query.length > 0

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE))
  const currentPage = Math.min(page, totalPages)
  const startIndex = (currentPage - 1) * PAGE_SIZE
  const paginated = filtered.slice(startIndex, startIndex + PAGE_SIZE)

  function handleFilterChange(option: FilterOption) {
    setFilter(option)
    setSearch('')
    setPage(1)
  }

  function handleSearchChange(value: string) {
    setSearch(value)
    setPage(1)
  }

  function handleSortChange(key: Key | Key[] | null) {
    if (typeof key !== 'string') return
    setSort(key as SortOption)
    setPage(1)
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative min-w-0 flex-1">
          <svg
            aria-hidden="true"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-[#7B2CBF]"
          >
            <circle cx="11" cy="11" r="8" />
            <path d="m21 21-4.3-4.3" />
          </svg>
          <input
            type="text"
            value={search}
            onChange={e => handleSearchChange(e.target.value)}
            placeholder="Search by company or role..."
            aria-label="Search by company or role"
            className="w-full rounded-lg border border-[#3C096C] bg-[#10002B] py-2.5 pl-10 pr-10 text-sm text-[#E0AAFF] placeholder:text-[#7B2CBF] outline-none focus:border-[#7B2CBF]"
          />
          {search && (
            <button
              type="button"
              onClick={() => handleSearchChange('')}
              aria-label="Clear search"
              className="absolute right-2.5 top-1/2 flex size-6 -translate-y-1/2 items-center justify-center rounded text-[#7B2CBF] transition-colors hover:text-[#E0AAFF]"
            >
              <svg
                aria-hidden="true"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="size-4"
              >
                <path d="M18 6 6 18" />
                <path d="m6 6 12 12" />
              </svg>
            </button>
          )}
        </div>

        <div className="flex shrink-0 items-center gap-2">
          <span className="text-sm text-[#C77DFF]">Sort:</span>
          <Select
            aria-label="Sort applications"
            value={sort}
            onChange={handleSortChange}
          >
            <Select.Trigger className="relative inline-flex h-auto min-h-0 items-center gap-2 rounded-lg border border-[#3C096C] bg-[#10002B] py-2.5 pl-3 pr-8 text-sm text-[#E0AAFF] outline-none focus:border-[#7B2CBF]">
              <Select.Value className="flex-1 text-left">
                {SORT_OPTIONS.find(option => option.value === sort)?.label}
              </Select.Value>
              <Select.Indicator className="absolute right-2.5 top-1/2 size-3.5 shrink-0 -translate-y-1/2 text-[#C77DFF]" />
            </Select.Trigger>
            <Select.Popover className="min-w-[10rem] overflow-hidden rounded-lg border border-[#3C096C] bg-[#240046]">
              <ListBox className="bg-[#240046] p-1 outline-none">
                {SORT_OPTIONS.map(option => (
                  <ListBox.Item
                    key={option.value}
                    id={option.value}
                    textValue={option.label}
                    className="my-0.5 cursor-pointer rounded-full bg-[#10002B] px-3 py-1.5 text-xs font-medium font-mono text-[#C77DFF] outline-none data-[focused=true]:bg-[#3C096C] data-[hovered=true]:bg-[#3C096C] data-[selected=true]:bg-[#7B2CBF] data-[selected=true]:text-[#E0AAFF]"
                  >
                    {option.label}
                    <ListBox.ItemIndicator />
                  </ListBox.Item>
                ))}
              </ListBox>
            </Select.Popover>
          </Select>
        </div>
      </div>

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

      {isFiltered && (
        <p className="text-sm text-[#C77DFF]">
          Showing {filtered.length} of {applications.length} applications
        </p>
      )}

      {filtered.length === 0 ? (
        <p className="text-[#C77DFF] text-sm text-center py-4">
          {query
            ? `No results for '${search.trim()}' — try a different search`
            : 'No applications with this status'}
        </p>
      ) : (
        <>
          <div className="flex flex-col">
            {paginated.map((application, index) => (
              <AnimatedItem key={application.id} index={index} delay={0.05}>
                <JobCard
                  application={application}
                  onDelete={onDelete}
                  onEdit={onEdit}
                  onStatusUpdate={onStatusUpdate}
                />
              </AnimatedItem>
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
