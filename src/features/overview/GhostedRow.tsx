import { ExternalLink } from 'lucide-react'

import { safeExternalUrl } from '@/lib/urls'
import { Button } from '@/components/ui/button'
import type { Application } from '@/types/index'

type GhostedRowProps = {
  application: Application
  daysSince: number
  onEdit: () => void
  onReject: () => void
}

export function GhostedRow({
  application,
  daysSince,
  onEdit,
  onReject,
}: GhostedRowProps) {
  const externalUrl = safeExternalUrl(application.application_url)

  return (
    <li className="flex flex-wrap items-center gap-2 py-3">
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm">
          <span className="font-medium">{application.company}</span>
          <span className="text-muted-foreground"> — {application.role}</span>
        </p>
        <p className="text-xs text-muted-foreground tabular-nums">
          {daysSince} days
        </p>
      </div>
      {externalUrl ? (
        <Button variant="ghost" size="icon-sm" asChild>
          <a
            href={externalUrl}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`Open posting for ${application.company}`}
          >
            <ExternalLink />
          </a>
        </Button>
      ) : null}
      <Button type="button" variant="outline" size="sm" onClick={onReject}>
        Mark rejected
      </Button>
      <Button type="button" variant="ghost" size="sm" onClick={onEdit}>
        Edit
      </Button>
    </li>
  )
}
