import {
  SheetCell,
  SheetGutterCell,
  SheetHeaderCell,
  SheetTable,
  SheetTotalsRow,
} from '@/components/sheet'
import { StatusMark } from '@/features/applications/StatusMark'
import {
  SAMPLE_ROWS,
  sampleStatusCounts,
} from '@/features/landing/sampleData'
import { getStatusConfig } from '@/lib/status'

const ROWS = SAMPLE_ROWS.slice(0, 5)
const COLUMN_COUNT = 5

/** Static sample sheet for auth pages — display only, no interaction. */
export function AuthSampleSheet() {
  const counts = sampleStatusCounts(ROWS)

  return (
    <div
      className="pointer-events-none border border-ink select-none"
      aria-hidden
    >
      <SheetTable
        minWidthClassName="min-w-0"
        scrollClassName="overflow-hidden"
      >
        <thead className="bg-fill">
          <tr className="h-9">
            <SheetHeaderCell sticky="gutter">
              <span className="sr-only">Row</span>
            </SheetHeaderCell>
            <SheetHeaderCell>Company</SheetHeaderCell>
            <SheetHeaderCell>Role</SheetHeaderCell>
            <SheetHeaderCell>Status</SheetHeaderCell>
            <SheetHeaderCell isLast className="text-right">
              Added
            </SheetHeaderCell>
          </tr>
        </thead>
        <tbody>
          {ROWS.map((row, index) => {
            const config = getStatusConfig(row.status)
            return (
              <tr key={row.id} className="h-9">
                <SheetGutterCell>{index + 1}</SheetGutterCell>
                <SheetCell
                  truncate
                  title={row.company}
                  className="max-w-[10rem] font-medium"
                >
                  {row.company}
                </SheetCell>
                <SheetCell
                  truncate
                  title={row.role}
                  className="max-w-[12rem]"
                >
                  {row.role}
                </SheetCell>
                <SheetCell>
                  <span className="inline-flex items-center gap-1.5">
                    <StatusMark mark={config.mark} color={config.color} />
                    {config.label}
                  </span>
                </SheetCell>
                <SheetCell isLast className="text-right">
                  <span className="figure">{row.added}</span>
                </SheetCell>
              </tr>
            )
          })}
        </tbody>
        <SheetTotalsRow
          total={ROWS.length}
          counts={counts}
          columnCount={COLUMN_COUNT}
        />
      </SheetTable>
    </div>
  )
}
