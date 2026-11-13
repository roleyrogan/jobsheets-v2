import type { ApplicationSort, SortColumn } from '@/lib/applicationFilters'

type Column = {
  key: SortColumn | null
  label: string
  className?: string
}

const COLUMNS: Column[] = [
  { key: null, label: '', className: 'w-10 min-w-10 max-w-10' },
  { key: 'company', label: 'Company' },
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

function headerCellClass(
  index: number,
  isLast: boolean,
  extra?: string,
): string {
  const borderR = isLast
    ? ''
    : index === 1
      ? 'border-r border-rule max-md:border-r-ink'
      : 'border-r border-rule'
  const base = `box-border border-b border-ink ${borderR} px-2 text-left text-xs font-medium ${extra ?? ''}`
  if (index === 0) {
    return `${base} sticky left-0 z-20 w-10 min-w-10 max-w-10 bg-fill md:static`
  }
  if (index === 1) {
    return `${base} sticky left-10 z-20 max-w-[12rem] bg-fill md:static`
  }
  return base
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
              <th
                key={`${column.label}-${index}`}
                scope="col"
                className={headerCellClass(index, isLast, column.className)}
              >
                {column.label === '' ? (
                  <span className="sr-only">Row</span>
                ) : (
                  <span className="sr-only">{column.label}</span>
                )}
              </th>
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
            <th
              key={columnKey}
              scope="col"
              aria-sort={ariaSort}
              className={headerCellClass(index, isLast, column.className)}
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
            </th>
          )
        })}
      </tr>
    </thead>
  )
}
