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
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 id="overview-ghosted-heading" className="text-sm font-medium">
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
        <p className="text-sm text-muted-foreground">
          Nothing has gone quiet. Nice.
        </p>
      ) : (
        <ul className="flex flex-col divide-y border-y">
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
        </ul>
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
