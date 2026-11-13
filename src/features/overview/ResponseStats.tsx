import type { OutcomeStats, TimeToFirstResponseStats } from '@/lib/stats'

type ResponseStatsProps = {
  rate: number | null
  timing: TimeToFirstResponseStats
  outcomes: OutcomeStats
}

export function ResponseStats({
  rate,
  timing,
  outcomes,
}: ResponseStatsProps) {
  const rateLabel = rate === null ? '—' : `${Math.round(rate)}%`
  const enoughTiming = timing.sampleSize >= 3

  return (
    <section
      aria-labelledby="overview-response-heading"
      className="flex flex-col gap-3"
    >
      <h2 id="overview-response-heading" className="text-sm font-medium">
        Response
      </h2>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="flex flex-col gap-1">
          <p className="text-2xl font-medium tabular-nums">{rateLabel}</p>
          <p className="text-sm text-muted-foreground">
            of applications got any response
          </p>
        </div>

        <div className="flex flex-col gap-1">
          {enoughTiming ? (
            <>
              <p className="text-2xl font-medium tabular-nums">
                {timing.medianDays === null
                  ? '—'
                  : `${timing.medianDays} days`}
              </p>
              <p className="text-sm text-muted-foreground">
                median time until a response was logged
              </p>
              <p className="text-sm text-muted-foreground">
                based on {timing.sampleSize} applications
                {timing.excludedUnknownTiming > 0
                  ? ` · ${timing.excludedUnknownTiming} without known timing not counted`
                  : ''}
              </p>
            </>
          ) : (
            <>
              <p className="text-2xl font-medium">Not enough data yet</p>
              <p className="text-sm text-muted-foreground">
                median time until a response was logged
              </p>
            </>
          )}
        </div>
      </div>

      <p className="text-sm text-muted-foreground">
        {outcomes.rejectedWithoutInterview} rejected before interview ·{' '}
        {outcomes.rejectedAfterInterview} after interview · {outcomes.offers}{' '}
        offers · {outcomes.active} still active
      </p>
    </section>
  )
}
