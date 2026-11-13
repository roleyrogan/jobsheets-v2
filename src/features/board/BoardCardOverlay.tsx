import { BoardCardFace } from '@/features/board/BoardCardFace'
import type { Application } from '@/types/index'

type BoardCardOverlayProps = {
  application: Application
}

export function BoardCardOverlay({ application }: BoardCardOverlayProps) {
  return (
    <div className="cursor-grabbing shadow-md">
      <BoardCardFace application={application} />
    </div>
  )
}
