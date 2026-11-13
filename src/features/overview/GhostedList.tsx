import { useState } from 'react'
import { toast } from 'sonner'

import { getGhostAfterDays, setGhostAfterDays } from '@/lib/ghostSetting'
import { ghosted } from '@/lib/stats'
import { useUpdateStatus } from '@/features/applications/mutations'
import { useApplicationDialogs } from '@/features/applications/useApplicationDialogs'
import { GhostedRow } from '@/features/overview/GhostedRow'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import type { Application, ApplicationEvent } from '@/types/index'

const THRESHOLDS = [7, 14, 21, 30, 45, 60] as const

type GhostedListProps = {
  applications: Application[]
  events: ApplicationEvent[]
  now: Date
}

export function GhostedList({
  applications,
  events,
  now,
}: GhostedListProps) {
  const { openEdit } = useApplicationDialogs()
  const updateStatus = useUpdateStatus()
  const [afterDays, setAfterDays] = useState(getGhostAfterDays)
  const [expanded, setExpanded] = useState(false)
  const items = ghosted(applications, events, now, afterDays)
  const visible = expanded ? items : items.slice(0, 10)

  function changeThreshold(value: string) {
    const days = Number(value)
    if (!THRESHOLDS.some((option) => option === days)) return
    setAfterDays(days)
    setGhostAfterDays(days)
  }

  return (
    <section
      aria-labelledby="overview-ghosted-heading"
      className="flex flex-col gap-3"
    >
      <div className="flex flex-wrap items-center gap-3">
        <h2 id="overview-ghosted-heading">
          No response in {afterDays}+ days
        </h2>
        <div className="flex items-center gap-2">
          <Label htmlFor="ghost-threshold" className="sr-only">
            Ghosted after days
          </Label>
          <Select value={String(afterDays)} onValueChange={changeThreshold}>
            <SelectTrigger id="ghost-threshold" size="sm" className="w-24">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {THRESHOLDS.map((days) => (
                <SelectItem key={days} value={String(days)}>
                  {days} days
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {items.length === 0 ? (
        <p className="text-sm text-ink-2">Nothing has gone quiet. Nice.</p>
      ) : (
        <div className="max-md:overflow-x-auto">
          <table className="w-full min-w-[520px] border-collapse text-[13px] leading-5">
            <thead className="bg-fill">
              <tr className="border-b border-ink">
                <th
                  scope="col"
                  className="border-r border-rule px-2 text-left text-xs font-medium"
                >
                  Company
                </th>
                <th
                  scope="col"
                  className="border-r border-rule px-2 text-left text-xs font-medium"
                >
                  Role
                </th>
                <th
                  scope="col"
                  className="border-r border-rule px-2 text-right text-xs font-medium"
                >
                  Days
                </th>
                <th scope="col" className="px-2 text-left text-xs font-medium">
                  <span className="sr-only">Actions</span>
                </th>
              </tr>
            </thead>
            <tbody>
              {visible.map(({ application, daysSince }) => (
                <GhostedRow
                  key={application.id}
                  application={application}
                  daysSince={daysSince}
                  onEdit={() => openEdit(application)}
                  onReject={() => {
                    updateStatus.mutate(
                      { id: application.id, status: 'Rejected' },
                      {
                        onError: () => {
                          toast.error("Couldn't update status")
                        },
                      },
                    )
                  }}
                />
              ))}
            </tbody>
          </table>
        </div>
      )}

      {!expanded && items.length > 10 ? (
        <Button
          type="button"
          variant="outline"
          size="sm"
          className="self-start"
          onClick={() => setExpanded(true)}
        >
          Show all {items.length}
        </Button>
      ) : null}
    </section>
  )
}
