import { useState } from 'react'
import {
  DndContext,
  DragOverlay,
  KeyboardSensor,
  PointerSensor,
  TouchSensor,
  closestCorners,
  useSensor,
  useSensors,
  type DragEndEvent,
  type DragStartEvent,
  type UniqueIdentifier,
} from '@dnd-kit/core'
import { toast } from 'sonner'

import { groupByStatus } from '@/lib/board'
import { isStatus, STATUSES, toStatus } from '@/lib/status'
import { useUpdateStatus } from '@/features/applications/mutations'
import { createBoardAnnouncements } from '@/features/board/boardAnnouncements'
import { BoardCardOverlay } from '@/features/board/BoardCardOverlay'
import { BoardColumn } from '@/features/board/BoardColumn'
import type { Application } from '@/types/index'

type BoardProps = {
  applications: Application[]
}

function prefersReducedMotion(): boolean {
  if (typeof window === 'undefined') return false
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

function findApplication(
  apps: Application[],
  id: UniqueIdentifier,
): Application | undefined {
  const numericId = typeof id === 'number' ? id : Number(id)
  if (!Number.isFinite(numericId)) return undefined
  return apps.find((app) => app.id === numericId)
}

export function Board({ applications }: BoardProps) {
  const updateStatus = useUpdateStatus()
  const [activeId, setActiveId] = useState<UniqueIdentifier | null>(null)
  const columns = groupByStatus(applications)
  const announcements = createBoardAnnouncements(applications)
  const activeApplication =
    activeId === null ? undefined : findApplication(applications, activeId)

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 6 },
    }),
    useSensor(TouchSensor, {
      activationConstraint: { delay: 200, tolerance: 5 },
    }),
    useSensor(KeyboardSensor),
  )

  function handleDragStart(event: DragStartEvent) {
    setActiveId(event.active.id)
  }

  function handleDragEnd(event: DragEndEvent) {
    setActiveId(null)
    const { active, over } = event
    if (!over) return

    const overStatus = String(over.id)
    if (!isStatus(overStatus)) return

    const application = findApplication(applications, active.id)
    if (!application) return

    const fromStatus = toStatus(application.status)
    if (fromStatus === overStatus) return

    updateStatus.mutate(
      { id: application.id, status: overStatus },
      {
        onError: () => {
          toast.error("Couldn't update status")
        },
      },
    )
  }

  function handleDragCancel() {
    setActiveId(null)
  }

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCorners}
      accessibility={{ announcements }}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      onDragCancel={handleDragCancel}
    >
      <div className="flex snap-x snap-mandatory gap-4 overflow-x-auto md:grid md:grid-cols-4 md:snap-none md:overflow-visible">
        {STATUSES.map((status) => (
          <BoardColumn
            key={status.value}
            status={status.value}
            applications={columns[status.value]}
          />
        ))}
      </div>

      <DragOverlay dropAnimation={prefersReducedMotion() ? null : undefined}>
        {activeApplication ? (
          <BoardCardOverlay application={activeApplication} />
        ) : null}
      </DragOverlay>
    </DndContext>
  )
}
