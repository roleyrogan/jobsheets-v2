import { Skeleton } from '@heroui/react'

export default function SkeletonCard() {
  return (
    <div className="flex items-center justify-between gap-4 rounded-xl border border-[#3C096C] bg-[#240046] p-6">
      <div className="flex min-w-0 flex-1 flex-col gap-2">
        <Skeleton animationType="pulse" className="h-5 w-48 animate-pulse rounded-lg bg-[#3C096C]/60" />
        <Skeleton animationType="pulse" className="h-4 w-32 animate-pulse rounded-lg bg-[#3C096C]/60" />
        <Skeleton animationType="pulse" className="h-3 w-24 animate-pulse rounded-lg bg-[#3C096C]/60" />
      </div>

      <div className="flex shrink-0 flex-col items-end gap-3">
        <Skeleton animationType="pulse" className="h-7 w-20 animate-pulse rounded-full bg-[#3C096C]/60" />
        <div className="flex items-center gap-2">
          <Skeleton animationType="pulse" className="h-8 w-16 animate-pulse rounded-lg bg-[#3C096C]/60" />
          <Skeleton animationType="pulse" className="h-8 w-16 animate-pulse rounded-lg bg-[#3C096C]/60" />
        </div>
      </div>
    </div>
  )
}
