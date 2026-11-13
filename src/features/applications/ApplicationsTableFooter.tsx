import { STATUSES, type Status } from '@/lib/status'
import { StatusMark } from '@/features/applications/StatusMark'

type ApplicationsTableFooterProps = {
  total: number
  counts: Record<Status, number>
}

const cell =
  'border-t-[3px] border-double border-ink border-r border-rule px-2 py-2'
const cellLast =
  'border-t-[3px] border-double border-ink px-2 py-2'

export function ApplicationsTableFooter({
  total,
  counts,
}: ApplicationsTableFooterProps) {
  return (
    <tfoot>
      <tr>
        <td colSpan={2} className={`${cell} text-[13px]`}>
          {total} {total === 1 ? 'application' : 'applications'}
        </td>
        {STATUSES.map((status) => (
          <td key={status.value} className={cell}>
            <span className="inline-flex items-center gap-1.5 text-[13px]">
              <StatusMark mark={status.mark} color={status.color} />
              <span className="figure">{counts[status.value]}</span>
            </span>
          </td>
        ))}
        <td className={cell} />
        <td className={cellLast} />
      </tr>
    </tfoot>
  )
}
