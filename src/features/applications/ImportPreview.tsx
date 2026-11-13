import { useState } from 'react'

import { toLocalYmd } from '@/lib/dates'
import { StatusBadge } from '@/features/applications/StatusBadge'
import type { ParseApplicationsCsvResult } from '@/lib/csv'

type ImportPreviewProps = {
  result: ParseApplicationsCsvResult
}

export function ImportPreview({ result }: ImportPreviewProps) {
  const preview = result.ready.slice(0, 10)

  return (
    <div className="flex flex-col gap-4">
      <div className="grid grid-cols-3 border-b border-b-rule">
        <SummaryCell label="Ready" value={result.ready.length} />
        <SummaryCell label="Skipped" value={result.skipped.length} />
        <SummaryCell
          label="Warnings"
          value={result.warnings.length}
          last
        />
      </div>

      {preview.length > 0 ? (
        <div className="overflow-x-auto">
          <table className="w-full min-w-[480px] border-separate border-spacing-0 text-[13px] leading-5">
            <thead className="bg-fill">
              <tr>
                <th
                  scope="col"
                  className="w-10 border-r border-r-rule border-b border-b-ink px-2 text-right text-xs font-medium"
                >
                  <span className="sr-only">Line</span>
                </th>
                <th
                  scope="col"
                  className="border-r border-r-rule border-b border-b-ink px-2 text-left text-xs font-medium"
                >
                  Company
                </th>
                <th
                  scope="col"
                  className="border-r border-r-rule border-b border-b-ink px-2 text-left text-xs font-medium"
                >
                  Role
                </th>
                <th
                  scope="col"
                  className="border-r border-r-rule border-b border-b-ink px-2 text-left text-xs font-medium"
                >
                  Status
                </th>
                <th
                  scope="col"
                  className="border-b border-b-ink px-2 text-right text-xs font-medium"
                >
                  Added
                </th>
              </tr>
            </thead>
            <tbody>
              {preview.map((row) => (
                <tr key={`${row.line}-${row.company}`} className="h-9">
                  <td className="border-r border-r-rule border-b border-b-rule bg-fill px-2 text-right">
                    <span className="figure whitespace-nowrap text-ink-2">
                      {row.line}
                    </span>
                  </td>
                  <td
                    className="max-w-[10rem] border-r border-r-rule border-b border-b-rule px-2 font-medium"
                    title={row.company}
                  >
                    <span className="block truncate">{row.company}</span>
                  </td>
                  <td
                    className="max-w-[12rem] border-r border-r-rule border-b border-b-rule px-2"
                    title={row.role}
                  >
                    <span className="block truncate">{row.role}</span>
                  </td>
                  <td className="whitespace-nowrap border-r border-r-rule border-b border-b-rule px-2">
                    <StatusBadge value={row.status} />
                  </td>
                  <td className="border-b border-b-rule px-2 text-right">
                    <span className="figure whitespace-nowrap">
                      {toLocalYmd(new Date(row.created_at))}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {result.ready.length > 10 ? (
            <p className="mt-2 text-xs text-ink-2">
              Showing first 10 of {result.ready.length} ready rows.
            </p>
          ) : null}
        </div>
      ) : null}

      {result.skipped.length > 0 ? (
        <IssueList
          title={`Skipped (${result.skipped.length})`}
          items={result.skipped.map((item) => ({
            line: item.line,
            text: item.reason,
          }))}
        />
      ) : null}

      {result.warnings.length > 0 ? (
        <IssueList
          title={`Warnings (${result.warnings.length})`}
          items={result.warnings.map((item) => ({
            line: item.line,
            text: item.message,
          }))}
        />
      ) : null}
    </div>
  )
}

function SummaryCell({
  label,
  value,
  last = false,
}: {
  label: string
  value: number
  last?: boolean
}) {
  return (
    <div
      className={
        last
          ? 'flex flex-col gap-0.5 px-2 py-2'
          : 'flex flex-col gap-0.5 border-r border-r-rule px-2 py-2'
      }
    >
      <span className="figure text-[32px] leading-9">{value}</span>
      <span className="text-xs text-ink-2">{label}</span>
    </div>
  )
}

function IssueList({
  title,
  items,
}: {
  title: string
  items: { line: number; text: string }[]
}) {
  const [open, setOpen] = useState(items.length <= 10)

  return (
    <details
      open={open}
      onToggle={(event) => setOpen(event.currentTarget.open)}
    >
      <summary className="cursor-pointer text-sm font-medium">{title}</summary>
      <ul className="mt-2 flex max-h-60 flex-col gap-1 overflow-y-auto">
        {items.map((item) => (
          <li
            key={`${title}-${item.line}-${item.text}`}
            className="grid grid-cols-[4.5rem_minmax(0,1fr)] gap-2 text-sm"
          >
            <span className="text-ink-2">
              Line <span className="figure">{item.line}</span>
            </span>
            <span className="text-ink-2">{item.text}</span>
          </li>
        ))}
      </ul>
    </details>
  )
}
