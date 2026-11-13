import { Skeleton } from '@/components/ui/skeleton'

export function ApplicationsTableSkeleton() {
  return (
    <div className="max-md:overflow-x-auto">
      <table className="w-full min-w-[760px] border-collapse md:min-w-0">
        <thead className="bg-fill">
          <tr className="border-b border-ink">
            {Array.from({ length: 8 }, (_, index) => (
              <th
                key={index}
                className="h-9 border-r border-rule px-2 last:border-r-0"
              >
                <Skeleton className="h-3 w-12" />
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {Array.from({ length: 6 }, (_, row) => (
            <tr key={row} className="h-9 border-b border-rule">
              <td className="w-10 border-r border-rule bg-fill px-2">
                <Skeleton className="ml-auto h-3 w-4" />
              </td>
              {Array.from({ length: 7 }, (_, col) => (
                <td key={col} className="border-r border-rule px-2 last:border-r-0">
                  <Skeleton className="h-3 w-full max-w-24" />
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
