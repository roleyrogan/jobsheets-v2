import { useMemo } from 'react'

import {
  funnel,
  outcomes,
  responseRate,
  summary,
  timeToFirstResponse,
} from '@/lib/stats'
import {
  useApplicationEvents,
  useApplications,
} from '@/features/applications/queries'
import { useApplicationDialogs } from '@/features/applications/useApplicationDialogs'
import { ActivityHeatmap } from '@/features/overview/ActivityHeatmap'
import { FunnelChart } from '@/features/overview/FunnelChart'
import { GhostedList } from '@/features/overview/GhostedList'
import { OverviewSkeleton } from '@/features/overview/OverviewSkeleton'
import { ResponseStats } from '@/features/overview/ResponseStats'
import { SummaryRow } from '@/features/overview/SummaryRow'
import { WeeklyBars } from '@/features/overview/WeeklyBars'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'

export function OverviewView() {
  const { openCreate } = useApplicationDialogs()
  const appsQuery = useApplications()
  const eventsQuery = useApplicationEvents()

  const apps = appsQuery.data
  const events = eventsQuery.data

  const stats = useMemo(() => {
    if (!apps || !events) return null
    const now = new Date()
    return {
      now,
      summary: summary(apps, now),
      funnel: funnel(apps, events),
      outcomes: outcomes(apps, events),
      responseRate: responseRate(apps, events),
      timing: timeToFirstResponse(apps, events),
    }
  }, [apps, events])

  if (appsQuery.isPending || eventsQuery.isPending) {
    return <OverviewSkeleton />
  }

  if (appsQuery.isError || eventsQuery.isError) {
    const message =
      (appsQuery.error instanceof Error && appsQuery.error.message) ||
      (eventsQuery.error instanceof Error && eventsQuery.error.message) ||
      'Could not load overview'
    const fetching = appsQuery.isFetching || eventsQuery.isFetching

    return (
      <Alert variant="destructive">
        <AlertDescription className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <span>{message}</span>
          <Button
            variant="outline"
            size="sm"
            disabled={fetching}
            onClick={() => {
              void appsQuery.refetch()
              void eventsQuery.refetch()
            }}
          >
            {fetching ? 'Retrying…' : 'Try again'}
          </Button>
        </AlertDescription>
      </Alert>
    )
  }

  if (!apps || apps.length === 0 || !events || !stats) {
    return (
      <div className="flex flex-col items-start gap-3">
        <div className="flex flex-col gap-1">
          <p className="font-medium">No applications yet</p>
          <p className="text-sm text-muted-foreground">
            When you add one, stats will show up here.
          </p>
        </div>
        <Button onClick={openCreate}>Add your first application</Button>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-8">
      {apps.length < 5 ? (
        <p className="text-sm text-muted-foreground">
          Stats get more useful after a few more applications.
        </p>
      ) : null}

      <SummaryRow stats={stats.summary} />
      <FunnelChart stats={stats.funnel} />
      <ResponseStats
        rate={stats.responseRate}
        timing={stats.timing}
        outcomes={stats.outcomes}
      />
      <ActivityHeatmap applications={apps} now={stats.now} />
      <WeeklyBars applications={apps} now={stats.now} />
      <GhostedList applications={apps} events={events} now={stats.now} />
    </div>
  )
}
