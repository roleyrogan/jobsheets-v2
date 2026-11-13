import { useDraggable } from '@dnd-kit/core'
import { motion } from 'motion/react'

import { BoardCardFace } from '@/features/board/BoardCardFace'
import { BoardCardMenu } from '@/features/board/BoardCardMenu'
import { layoutTransition } from '@/lib/motion'
import type { Application } from '@/types/index'

type BoardCardProps = {
  application: Application
}

export function BoardCard({ application }: BoardCardProps) {
  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
    id: application.id,
    data: { application },
  })

  return (
    <motion.div
      layout={!isDragging}
      transition={layoutTransition}
      ref={setNodeRef}
      {...attributes}
      {...listeners}
      className={
        isDragging
          ? 'cursor-grabbing touch-manipulation opacity-50 outline-2 outline-select'
          : 'cursor-grab touch-manipulation'
      }
    >
      <BoardCardFace
        application={application}
        menu={<BoardCardMenu application={application} />}
      />
    </motion.div>
  )
}
