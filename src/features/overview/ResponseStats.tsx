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
      className="flex flex-col gap-4"
    >
      <h2 id="overview-response-heading">Response</h2>

      <div className="grid gap-6 sm:grid-cols-2">
        <div className="flex flex-col gap-1">
          <p className="figure text-[32px] leading-9">{rateLabel}</p>
          <p className="text-sm text-ink-2">Response rate</p>
        </div>

        <div className="flex flex-col gap-1">
          {enoughTiming ? (
            <>
              <p className="figure text-[32px] leading-9">
                {timing.medianDays === null ? '—' : timing.medianDays}
              </p>
              <p className="text-sm text-ink-2">Median days to response</p>
              <p className="text-xs text-ink-2">
                Based on {timing.sampleSize} applications
              </p>
              {timing.excludedUnknownTiming > 0 ? (
                <p className="text-xs text-ink-2">
                  {timing.excludedUnknownTiming} without known timing not
                  counted
                </p>
              ) : null}
            </>
          ) : (
            <>
              <p className="figure text-[32px] leading-9">—</p>
              <p className="text-sm text-ink-2">Median days to response</p>
              <p className="text-xs text-ink-2">Not enough data yet</p>
            </>
          )}
        </div>
      </div>

      <table className="w-full max-w-md border-collapse text-[13px] leading-5">
        <thead className="bg-fill">
          <tr className="border-b border-ink">
            <th
              scope="col"
              className="border-r border-rule px-2 py-1.5 text-left text-xs font-medium"
            >
              Outcome
            </th>
            <th
              scope="col"
              className="px-2 py-1.5 text-right text-xs font-medium"
            >
              Count
            </th>
          </tr>
        </thead>
        <tbody>
          <OutcomeRow
            label="Rejected before interview"
            value={outcomes.rejectedWithoutInterview}
          />
          <OutcomeRow
            label="Rejected after interview"
            value={outcomes.rejectedAfterInterview}
          />
          <OutcomeRow label="Offers" value={outcomes.offers} />
          <OutcomeRow label="Still active" value={outcomes.active} last />
        </tbody>
      </table>
    </section>
  )
}

function OutcomeRow({
  label,
  value,
  last = false,
}: {
  label: string
  value: number
  last?: boolean
}) {
  return (
    <tr className={last ? undefined : 'border-b border-rule'}>
      <td className="border-r border-rule px-2 py-1.5">{label}</td>
      <td className="figure px-2 py-1.5 text-right">{value}</td>
    </tr>
  )
}
