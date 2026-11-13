import { ExternalLink } from 'lucide-react'
import type { ReactNode } from 'react'

import { daysAgo, formatDate } from '@/lib/dates'
import { safeExternalUrl } from '@/lib/urls'
import { Button } from '@/components/ui/button'
import type { Application } from '@/types/index'

type BoardCardFaceProps = {
  application: Application
  menu?: ReactNode
}

export function BoardCardFace({ application, menu }: BoardCardFaceProps) {
  const externalUrl = safeExternalUrl(application.application_url)
  const added = formatDate(application.created_at)
  const ago = daysAgo(application.created_at)

  return (
    <div className="flex flex-col gap-1 rounded-[3px] border border-rule bg-paper p-3">
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0">
          <p className="truncate font-medium">{application.company}</p>
          <p className="truncate text-sm">{application.role}</p>
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
      {application.location ? (
        <p className="truncate text-sm text-muted-foreground">
          {application.location}
        </p>
      ) : null}
      <p className="text-xs text-muted-foreground">
        Added {added} · {ago}d ago
      </p>
    </div>
  )
}
