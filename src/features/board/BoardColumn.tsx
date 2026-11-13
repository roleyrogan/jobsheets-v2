import { useDroppable } from '@dnd-kit/core'

import { getStatusConfig, type Status } from '@/lib/status'
import { BoardCard } from '@/features/board/BoardCard'
import type { Application } from '@/types/index'

type BoardColumnProps = {
  status: Status
  applications: Application[]
}

export function BoardColumn({ status, applications }: BoardColumnProps) {
  const { setNodeRef, isOver } = useDroppable({ id: status })
  const config = getStatusConfig(status)

  return (
    <section
      className="flex w-[85vw] shrink-0 snap-center flex-col gap-3 md:w-auto md:min-w-0 md:flex-1"
      aria-label={`${config.label} column`}
    >
      <header className="flex items-center gap-2 px-0.5">
        <span
          className="size-2 shrink-0 rounded-full"
          style={{ backgroundColor: config.color }}
          aria-hidden
        />
        <h2 className="text-sm font-medium" style={{ color: config.color }}>
          {config.label}
        </h2>
        <span className="text-sm text-muted-foreground tabular-nums">
          {applications.length}
        </span>
      </header>

      <div
        ref={setNodeRef}
        className={
          isOver
            ? 'flex min-h-24 flex-col gap-2 rounded-md bg-muted/60 p-1 ring-1 ring-border'
            : 'flex min-h-24 flex-col gap-2 rounded-md p-1'
        }
      >
        {applications.length === 0 ? (
          <div className="flex flex-1 items-center justify-center rounded-md border border-dashed px-3 py-8 text-sm text-muted-foreground">
            No applications
          </div>
        ) : (
          applications.map((application) => (
            <BoardCard key={application.id} application={application} />
          ))
        )}
      </div>
    </section>
  )
}
