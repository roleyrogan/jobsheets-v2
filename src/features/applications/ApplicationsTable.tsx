import { ApplicationRow } from '@/features/applications/ApplicationRow'
import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import type { Application } from '@/types/index'

type ApplicationsTableProps = {
  applications: Application[]
  onEdit: (application: Application) => void
}

export function ApplicationsTable({
  applications,
  onEdit,
}: ApplicationsTableProps) {
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
            <TableHead>
              <span className="sr-only">Actions</span>
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {applications.map((application) => (
            <ApplicationRow
              key={application.id}
              application={application}
              onEdit={onEdit}
            />
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
