import { STATUSES, type Status } from '@/lib/status'
import { StatusMark } from '@/features/applications/StatusMark'
import { cn } from 'cn'

type SheetTotalsRowProps = {
  total: number
  counts: Record<Status, number>
  trailingEmpty?: number
  labelColSpan?: number
}

const cellBase =
  'border-t-[3px] border-double border-ink px-2 py-2'

export function SheetTotalsRow({
  total,
  counts,
  trailingEmpty = 2,
  labelColSpan = 2,
}: SheetTotalsRowProps) {
  return (
    <tfoot>
      <tr>
        <td
          colSpan={labelColSpan}
          className={cn(cellBase, 'border-r border-rule text-[13px]')}
        >
          {total} {total === 1 ? 'application' : 'applications'}
        </td>
        {STATUSES.map((status, index) => {
          const isLastStatus = index === STATUSES.length - 1
          const showRule = !isLastStatus || trailingEmpty > 0
          return (
            <td
              key={status.value}
              className={cn(cellBase, showRule && 'border-r border-rule')}
            >
              <span className="inline-flex items-center gap-1.5 text-[13px]">
                <StatusMark mark={status.mark} color={status.color} />
                <span className="figure">{counts[status.value]}</span>
              </span>
            </td>
          )
        })}
        {Array.from({ length: trailingEmpty }, (_, index) => (
          <td
            key={`empty-${index}`}
            className={cn(
              cellBase,
              index < trailingEmpty - 1 && 'border-r border-rule',
            )}
          />
        ))}
      </tr>
    </tfoot>
  )
}
