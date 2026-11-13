import type { ApplicationSort, SortColumn } from '@/lib/applicationFilters'
import { SheetHeaderCell } from '@/components/sheet'

type Column = {
  key: SortColumn | null
  label: string
  className?: string
  sticky?: 'gutter' | 'company'
}

const COLUMNS: Column[] = [
  { key: null, label: '', sticky: 'gutter' },
  { key: 'company', label: 'Company', sticky: 'company' },
  { key: 'role', label: 'Role' },
  { key: 'status', label: 'Status' },
  { key: 'location', label: 'Location' },
  { key: 'added', label: 'Added', className: 'text-right' },
  { key: null, label: 'Link', className: 'w-10' },
  { key: null, label: 'Actions', className: 'w-10' },
]

type ApplicationsTableHeaderProps = {
  sort: ApplicationSort
  onSort: (key: SortColumn) => void
}

export function ApplicationsTableHeader({
  sort,
  onSort,
}: ApplicationsTableHeaderProps) {
  return (
    <thead className="bg-fill md:sticky md:top-0 md:z-20">
      <tr>
        {COLUMNS.map((column, index) => {
          const isLast = index === COLUMNS.length - 1

          if (column.key === null) {
            return (
              <SheetHeaderCell
                key={`${column.label}-${index}`}
                sticky={column.sticky}
                isLast={isLast}
                className={column.className}
              >
                {column.label === '' ? (
                  <span className="sr-only">Row</span>
                ) : (
                  <span className="sr-only">{column.label}</span>
                )}
              </SheetHeaderCell>
            )
          }

          const columnKey = column.key
          const active = sort.key === columnKey
          const ariaSort = active
            ? sort.dir === 'asc'
              ? 'ascending'
              : 'descending'
            : 'none'

          return (
            <SheetHeaderCell
              key={columnKey}
              sticky={column.sticky}
              isLast={isLast}
              aria-sort={ariaSort}
              className={column.className}
            >
              <button
                type="button"
                className="inline-flex h-9 w-full items-center gap-1 text-left text-xs font-medium"
                onClick={() => onSort(columnKey)}
              >
                {column.label}
                {active ? (
                  <span className="text-ink-2" aria-hidden>
                    {sort.dir === 'asc' ? '▲' : '▼'}
                  </span>
                ) : null}
              </button>
            </SheetHeaderCell>
          )
        })}
      </tr>
    </thead>
  )
}
