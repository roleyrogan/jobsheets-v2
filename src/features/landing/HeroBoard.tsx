import { StatusMark } from '@/features/applications/StatusMark'
import type { SampleRow } from '@/features/landing/sampleData'
import { STATUSES } from '@/lib/status'

type HeroBoardProps = {
  rows: SampleRow[]
}

export function HeroBoard({ rows }: HeroBoardProps) {
  return (
    <div className="flex h-full gap-2 overflow-x-auto p-2 max-[759px]:snap-x max-[759px]:snap-mandatory">
      {STATUSES.map((status) => {
        const cards = rows.filter((row) => row.status === status.value)
        return (
          <section
            key={status.value}
            className="flex min-w-[9.5rem] flex-1 flex-col border border-rule max-[759px]:snap-center"
          >
            <header className="flex items-center gap-1.5 border-b border-b-ink bg-fill px-2 py-1.5">
              <StatusMark mark={status.mark} color={status.color} />
              <span className="flex-1 text-[12px] font-medium">
                {status.label}
              </span>
              <span className="figure text-[12px]">{cards.length}</span>
            </header>
            <div className="flex flex-col gap-1.5 p-1.5">
              {cards.map((row) => (
                <article
                  key={row.id}
                  className="border border-rule bg-paper p-2 transition-[border-color,transform] duration-[160ms] ease-[var(--ease)] hover:-translate-y-px hover:border-ink"
                >
                  <p className="truncate text-[12px] font-medium">
                    {row.company}
                  </p>
                  <p className="truncate text-[11px] text-ink-2">{row.role}</p>
                </article>
              ))}
            </div>
          </section>
        )
      })}
    </div>
  )
}
