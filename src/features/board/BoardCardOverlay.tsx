import { BoardCardFace } from '@/features/board/BoardCardFace'
import type { Application } from '@/types/index'

type BoardCardOverlayProps = {
  application: Application
}

export function BoardCardOverlay({ application }: BoardCardOverlayProps) {
  return (
    <div className="cursor-grabbing">
      <BoardCardFace application={application} outlined />
    </div>
  )
}
