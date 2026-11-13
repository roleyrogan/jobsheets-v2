import { Skeleton } from '@/components/ui/skeleton'

export function OverviewSkeleton() {
  return (
    <div className="flex flex-col gap-8">
      <div className="grid grid-cols-2 border-b-[3px] border-double border-ink sm:grid-cols-4">
        {Array.from({ length: 4 }, (_, index) => (
          <div
            key={index}
            className={
              index < 3
                ? 'flex flex-col gap-2 border-r border-rule px-3 py-4'
                : 'flex flex-col gap-2 px-3 py-4'
            }
          >
            <Skeleton className="h-9 w-12" />
            <Skeleton className="h-4 w-16" />
          </div>
        ))}
      </div>

      <div className="flex flex-col gap-3">
        <Skeleton className="h-5 w-16" />
        <Skeleton className="h-3 w-full" />
        <Skeleton className="h-3 w-3/4" />
        <Skeleton className="h-3 w-1/2" />
      </div>

      <div className="grid gap-6 sm:grid-cols-2">
        <div className="flex flex-col gap-2">
          <Skeleton className="h-9 w-16" />
          <Skeleton className="h-4 w-28" />
        </div>
        <div className="flex flex-col gap-2">
          <Skeleton className="h-9 w-12" />
          <Skeleton className="h-4 w-40" />
        </div>
      </div>

      <div className="flex flex-col gap-3">
        <Skeleton className="h-5 w-20" />
        <Skeleton className="h-28 w-full" />
      </div>

      <div className="flex flex-col gap-3">
        <Skeleton className="h-5 w-36" />
        <Skeleton className="h-32 w-full" />
      </div>

      <div className="flex flex-col gap-3">
        <Skeleton className="h-5 w-48" />
        <Skeleton className="h-24 w-full" />
      </div>
    </div>
  )
}
