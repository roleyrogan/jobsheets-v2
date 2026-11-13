import { Skeleton } from '@/components/ui/skeleton'
import {
  SheetCell,
  SheetGutterCell,
  SheetHeaderCell,
  SheetTable,
} from '@/components/sheet'

export function ApplicationsTableSkeleton() {
  return (
    <SheetTable>
      <thead className="bg-fill">
        <tr>
          <SheetHeaderCell sticky="gutter">
            <Skeleton className="ml-auto h-3 w-4" />
          </SheetHeaderCell>
          <SheetHeaderCell sticky="company">
            <Skeleton className="h-3 w-12" />
          </SheetHeaderCell>
          {Array.from({ length: 5 }, (_, index) => (
            <SheetHeaderCell key={index} isLast={index === 4}>
              <Skeleton className="h-3 w-12" />
            </SheetHeaderCell>
          ))}
        </tr>
      </thead>
      <tbody>
        {Array.from({ length: 6 }, (_, row) => (
          <tr key={row} className="h-9">
            <SheetGutterCell>
              <Skeleton className="ml-auto h-3 w-4" />
            </SheetGutterCell>
            {Array.from({ length: 7 }, (_, col) => (
              <SheetCell key={col} isLast={col === 6}>
                <Skeleton className="h-3 w-full max-w-24" />
              </SheetCell>
            ))}
          </tr>
        ))}
      </tbody>
    </SheetTable>
  )
}
