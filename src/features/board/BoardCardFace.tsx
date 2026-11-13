import { ExternalLink } from 'lucide-react'
import type { ReactNode } from 'react'

import { toLocalYmd } from '@/lib/dates'
import { safeExternalUrl } from '@/lib/urls'
import { Button } from '@/components/ui/button'
import type { Application } from '@/types/index'

type BoardCardFaceProps = {
  application: Application
  menu?: ReactNode
  outlined?: boolean
}

export function BoardCardFace({
  application,
  menu,
  outlined = false,
}: BoardCardFaceProps) {
  const externalUrl = safeExternalUrl(application.application_url)
  const added = toLocalYmd(new Date(application.created_at))

  return (
    <div
      className={
        outlined
          ? 'flex flex-col gap-1 border border-rule bg-paper p-3 outline-2 outline-select'
          : 'flex flex-col gap-1 border border-rule bg-paper p-3'
      }
    >
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0">
          <p className="truncate text-[13px] font-medium leading-5">
            {application.company}
          </p>
          <p className="truncate text-[13px] leading-5 text-ink-2">
            {application.role}
          </p>
        </div>
        <div className="flex shrink-0 items-center gap-0.5">
          {externalUrl ? (
            <Button variant="ghost" size="icon-sm" asChild>
              <a
                href={externalUrl}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`Open posting for ${application.company}`}
                onPointerDown={(event) => event.stopPropagation()}
              >
                <ExternalLink />
              </a>
            </Button>
          ) : null}
          {menu}
        </div>
      </div>
      <div className="flex items-baseline justify-between gap-2 text-[13px] leading-5">
        <span className="min-w-0 truncate text-ink-2">
          {application.location ?? ''}
        </span>
        <span className="figure shrink-0 text-ink-2">{added}</span>
      </div>
    </div>
  )
}
