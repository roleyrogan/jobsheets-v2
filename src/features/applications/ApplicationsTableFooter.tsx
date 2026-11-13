import type { Status } from '@/lib/status'
import { SheetTotalsRow } from '@/components/sheet'

type ApplicationsTableFooterProps = {
  total: number
  counts: Record<Status, number>
}

export function ApplicationsTableFooter({
  total,
  counts,
}: ApplicationsTableFooterProps) {
  return <SheetTotalsRow total={total} counts={counts} columnCount={8} />
}
