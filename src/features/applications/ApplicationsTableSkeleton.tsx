import { Skeleton } from '@/components/ui/skeleton'

export function ApplicationsTableSkeleton() {
  return (
    <div className="max-md:overflow-x-auto">
      <table className="w-full min-w-[760px] border-separate border-spacing-0 md:min-w-0">
        <thead className="bg-fill">
          <tr>
            {Array.from({ length: 8 }, (_, index) => (
              <th
                key={index}
                className={
                  index === 7
                    ? 'h-9 border-b border-ink px-2'
                    : 'h-9 border-r border-b border-ink px-2'
                }
              >
                <Skeleton className="h-3 w-12" />
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {Array.from({ length: 6 }, (_, row) => (
            <tr key={row} className="h-9">
              <td className="box-border w-10 min-w-10 max-w-10 border-r border-b border-rule bg-fill px-2">
                <Skeleton className="ml-auto h-3 w-4" />
              </td>
              {Array.from({ length: 7 }, (_, col) => (
                <td
                  key={col}
                  className={
                    col === 6
                      ? 'border-b border-rule px-2'
                      : 'border-r border-b border-rule px-2'
                  }
                >
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
