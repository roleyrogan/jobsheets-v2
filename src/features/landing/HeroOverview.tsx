import { sampleStatusCounts, type SampleRow } from '@/features/landing/sampleData'

type HeroOverviewProps = {
  rows: SampleRow[]
  active: boolean
}

const FUNNEL = [
  { label: 'Applied', key: 'Applied' as const, opacity: 1, width: '100%' },
  { label: 'Interview', key: 'Interview' as const, opacity: 0.6, width: '38%' },
  { label: 'Offer', key: 'Offer' as const, opacity: 0.3, width: '12%' },
]

export function HeroOverview({ rows, active }: HeroOverviewProps) {
  const counts = sampleStatusCounts(rows)
  const total = rows.length
  const activeCount = counts.Applied + counts.Interview
  const offers = counts.Offer
  const responses = counts.Interview + counts.Offer + counts.Rejected

  return (
    <div className="flex h-full flex-col gap-4 p-3">
      <div className="grid grid-cols-2 border-b-[3px] border-double border-b-ink sm:grid-cols-4">
        <SummaryCell label="Total" value={total} edge />
        <SummaryCell label="Active" value={activeCount} />
        <SummaryCell label="Offers" value={offers} />
        <SummaryCell label="Responses" value={responses} last />
      </div>

      <div className="flex flex-col gap-2">
        <p className="text-xs font-medium">Funnel</p>
        {FUNNEL.map((stage) => (
          <div
            key={stage.label}
            className="grid grid-cols-[5rem_minmax(0,1fr)_2rem] items-center gap-2"
          >
            <span className="text-[12px]">{stage.label}</span>
            <div className="h-2.5 bg-fill">
              <div
                className={`h-full origin-left bg-ink ${active ? 'landing-funnel-grow-active' : 'landing-funnel-grow'}`}
                style={{ width: stage.width, opacity: stage.opacity }}
              />
            </div>
            <span className="figure text-right text-[12px]">
              {counts[stage.key]}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}

function SummaryCell({
  label,
  value,
  edge = false,
  last = false,
}: {
  label: string
  value: number
  edge?: boolean
  last?: boolean
}) {
  return (
    <div
      className={
        last
          ? 'px-2 py-2'
          : edge
            ? 'border-r border-r-rule px-2 py-2 max-[759px]:[&:nth-child(2)]:border-r-0'
            : 'border-r border-r-rule px-2 py-2 max-[759px]:odd:border-r-rule max-[759px]:even:border-r-0'
      }
    >
      <p className="figure text-[22px] leading-7">{value}</p>
      <p className="text-[11px] text-ink-2">{label}</p>
    </div>
  )
}
