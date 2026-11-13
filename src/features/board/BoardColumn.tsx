import { useDroppable } from '@dnd-kit/core'

import { getStatusConfig, type Status } from '@/lib/status'
import { StatusMark } from '@/features/applications/StatusMark'
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
      className="flex w-[85vw] shrink-0 snap-center flex-col border border-rule md:w-auto md:min-w-0 md:flex-1"
      aria-label={`${config.label} column`}
    >
      <header className="flex items-center gap-2 border-b border-b-ink bg-fill px-2 py-2">
        <StatusMark mark={config.mark} color={config.color} />
        <h2 className="flex-1 text-[13px] font-medium">{config.label}</h2>
        <span className="figure text-right text-[13px]">
          {applications.length}
        </span>
      </header>

      <div
        ref={setNodeRef}
        className={
          isOver
            ? 'flex min-h-24 flex-col gap-2 bg-fill p-2'
            : 'flex min-h-24 flex-col gap-2 p-2'
        }
      >
        {applications.length === 0 ? (
          <p className="px-1 py-6 text-sm text-ink-2">No applications</p>
        ) : (
          applications.map((application) => (
            <BoardCard key={application.id} application={application} />
          ))
        )}
      </div>
    </section>
  )
}
