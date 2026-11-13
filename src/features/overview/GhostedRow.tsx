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
    <tr className="h-9">
      <td
        className="max-w-[10rem] border-r border-r-rule border-b border-b-rule px-2 font-medium"
        title={application.company}
      >
        <span className="block truncate">{application.company}</span>
      </td>
      <td
        className="max-w-[12rem] border-r border-r-rule border-b border-b-rule px-2"
        title={application.role}
      >
        <span className="block truncate">{application.role}</span>
      </td>
      <td className="border-r border-r-rule border-b border-b-rule px-2 text-right">
        <span className="figure">{daysSince}</span>
      </td>
      <td className="border-b border-b-rule px-1">
        <div className="flex items-center justify-end gap-0.5">
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
        </div>
      </td>
    </tr>
  )
}
