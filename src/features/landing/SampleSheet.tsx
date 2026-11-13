import { StatusBadge } from '@/features/applications/StatusBadge'
import {
  SAMPLE_ROWS,
  sampleStatusCounts,
} from '@/features/landing/sampleData'
import {
  SheetCell,
  SheetGutterCell,
  SheetHeaderCell,
  SheetTable,
  SheetTotalsRow,
} from '@/components/sheet'

const HEADERS = [
  { label: 'Company', sticky: 'company' as const },
  { label: 'Role' },
  { label: 'Status' },
  { label: 'Location' },
  { label: 'Added', className: 'text-right' },
]

export function SampleSheet() {
  const counts = sampleStatusCounts()

  return (
    <figure className="flex flex-col gap-2">
      <figcaption className="sr-only">
        Example sheet with sample data
      </figcaption>
      <SheetTable minWidthClassName="min-w-[640px]">
        <thead className="bg-fill">
          <tr>
            <SheetHeaderCell sticky="gutter">
              <span className="sr-only">Row</span>
            </SheetHeaderCell>
            {HEADERS.map((header, index) => (
              <SheetHeaderCell
                key={header.label}
                sticky={header.sticky}
                isLast={index === HEADERS.length - 1}
                className={header.className}
              >
                <span className="inline-flex h-9 items-center gap-1">
                  {header.label}
                  {header.label === 'Added' ? (
                    <span className="text-ink-2" aria-hidden>
                      ▼
                    </span>
                  ) : null}
                </span>
              </SheetHeaderCell>
            ))}
          </tr>
        </thead>
        <tbody>
          {SAMPLE_ROWS.map((row, index) => (
            <tr key={row.company} className="h-9">
              <SheetGutterCell>{index + 1}</SheetGutterCell>
              <SheetCell sticky="company" truncate title={row.company}>
                {row.company}
              </SheetCell>
              <SheetCell truncate title={row.role} className="max-w-[14rem]">
                {row.role}
              </SheetCell>
              <SheetCell>
                <StatusBadge value={row.status} />
              </SheetCell>
              <SheetCell truncate title={row.location} className="max-w-[10rem]">
                {row.location}
              </SheetCell>
              <SheetCell isLast className="text-right">
                <span className="figure whitespace-nowrap">{row.added}</span>
              </SheetCell>
            </tr>
          ))}
        </tbody>
        <SheetTotalsRow
          total={SAMPLE_ROWS.length}
          counts={counts}
          trailingEmpty={0}
        />
      </SheetTable>
    </figure>
  )
}
