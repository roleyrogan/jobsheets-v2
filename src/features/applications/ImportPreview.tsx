import type { ParseApplicationsCsvResult } from '@/lib/csv'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'

type ImportPreviewProps = {
  result: ParseApplicationsCsvResult
}

export function ImportPreview({ result }: ImportPreviewProps) {
  const preview = result.ready.slice(0, 10)

  return (
    <div className="flex flex-col gap-4">
      <p className="text-sm tabular-nums">
        {result.ready.length} ready · {result.skipped.length} skipped ·{' '}
        {result.warnings.length} warning
        {result.warnings.length === 1 ? '' : 's'}
      </p>

      {preview.length > 0 ? (
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Company</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Location</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {preview.map((row, index) => (
                <TableRow key={`${row.company}-${row.role}-${index}`}>
                  <TableCell>{row.company}</TableCell>
                  <TableCell>{row.role}</TableCell>
                  <TableCell>{row.status}</TableCell>
                  <TableCell>{row.location ?? '—'}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          {result.ready.length > 10 ? (
            <p className="mt-2 text-xs text-muted-foreground">
              Showing first 10 of {result.ready.length} ready rows.
            </p>
          ) : null}
        </div>
      ) : null}

      {result.skipped.length > 0 ? (
        <details>
          <summary className="cursor-pointer text-sm font-medium">
            Skipped ({result.skipped.length})
          </summary>
          <ul className="mt-2 space-y-1 text-sm text-muted-foreground">
            {result.skipped.map((item) => (
              <li key={`skip-${item.line}-${item.reason}`}>
                Line {item.line}: {item.reason}
              </li>
            ))}
          </ul>
        </details>
      ) : null}

      {result.warnings.length > 0 ? (
        <details>
          <summary className="cursor-pointer text-sm font-medium">
            Warnings ({result.warnings.length})
          </summary>
          <ul className="mt-2 space-y-1 text-sm text-muted-foreground">
            {result.warnings.map((item) => (
              <li key={`warn-${item.line}-${item.message}`}>
                Line {item.line}: {item.message}
              </li>
            ))}
          </ul>
        </details>
      ) : null}
    </div>
  )
}
