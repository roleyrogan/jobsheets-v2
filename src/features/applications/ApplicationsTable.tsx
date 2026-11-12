import { ExternalLink } from 'lucide-react'

import { formatDate } from '@/lib/dates'
import { StatusBadge } from '@/features/applications/StatusBadge'
import { Button } from '@/components/ui/button'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import type { Application } from '@/types/index'

type ApplicationsTableProps = {
  applications: Application[]
}

export function ApplicationsTable({ applications }: ApplicationsTableProps) {
  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Company</TableHead>
            <TableHead>Role</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Location</TableHead>
            <TableHead>Added</TableHead>
            <TableHead>
              <span className="sr-only">Link</span>
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {applications.map((application) => (
            <TableRow key={application.id}>
              <TableCell className="font-medium">
                {application.company}
              </TableCell>
              <TableCell>{application.role}</TableCell>
              <TableCell>
                <StatusBadge value={application.status} />
              </TableCell>
              <TableCell className="text-muted-foreground">
                {application.location ?? '—'}
              </TableCell>
              <TableCell className="tabular-nums text-muted-foreground">
                {formatDate(application.created_at)}
              </TableCell>
              <TableCell className="w-10">
                {application.application_url ? (
                  <Button variant="ghost" size="icon-sm" asChild>
                    <a
                      href={application.application_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={`Open posting for ${application.company}`}
                    >
                      <ExternalLink />
                    </a>
                  </Button>
                ) : null}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
