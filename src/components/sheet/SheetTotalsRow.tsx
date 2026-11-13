import { STATUSES, type Status } from '@/lib/status'
import { StatusMark } from '@/features/applications/StatusMark'

type SheetTotalsRowProps = {
  total: number
  counts: Record<Status, number>
  /** Total column count in the table (label uses 3; counts fill the rest). */
  columnCount: number
}

export function SheetTotalsRow({
  total,
  counts,
  columnCount,
}: SheetTotalsRowProps) {
  const labelColSpan = 3
  const countsColSpan = Math.max(columnCount - labelColSpan, 1)

  return (
    <tfoot>
      <tr>
        <td
          colSpan={labelColSpan}
          className="border-t-[3px] border-double border-t-ink border-r border-r-rule px-2 py-2 text-[13px]"
        >
          {total} {total === 1 ? 'application' : 'applications'}
        </td>
        <td
          colSpan={countsColSpan}
          className="border-t-[3px] border-double border-t-ink px-2 py-2"
        >
          <div className="flex flex-wrap items-center gap-4">
            {STATUSES.map((status) => (
              <span
                key={status.value}
                className="inline-flex items-center gap-1.5 text-[13px]"
              >
                <StatusMark mark={status.mark} color={status.color} />
                <span className="figure">{counts[status.value]}</span>
              </span>
            ))}
          </div>
        </td>
      </tr>
    </tfoot>
  )
}
