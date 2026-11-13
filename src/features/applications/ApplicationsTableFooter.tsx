import { STATUSES, type Status } from '@/lib/status'
import { StatusMark } from '@/features/applications/StatusMark'

type ApplicationsTableFooterProps = {
  total: number
  counts: Record<Status, number>
}

export function ApplicationsTableFooter({
  total,
  counts,
}: ApplicationsTableFooterProps) {
  return (
    <tfoot>
      <tr className="border-t-[3px] border-double border-ink">
        <td colSpan={2} className="border-r border-rule px-2 py-2 text-[13px]">
          {total} {total === 1 ? 'application' : 'applications'}
        </td>
        {STATUSES.map((status) => (
          <td
            key={status.value}
            className="border-r border-rule px-2 py-2"
          >
            <span className="inline-flex items-center gap-1.5 text-[13px]">
              <StatusMark mark={status.mark} color={status.color} />
              <span className="figure">{counts[status.value]}</span>
            </span>
          </td>
        ))}
        <td className="border-r border-rule" />
        <td />
      </tr>
    </tfoot>
  )
}
