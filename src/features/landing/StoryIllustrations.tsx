import type { ReactNode } from 'react'

import { StatusMark } from '@/features/applications/StatusMark'
import type { StoryStepId } from '@/features/landing/sampleData'
import { STATUSES } from '@/lib/status'

type StoryIllustrationsProps = {
  active: StoryStepId
}

export function StoryIllustrations({ active }: StoryIllustrationsProps) {
  return (
    <div className="relative h-full w-full">
      <Pane show={active === 'sheet'}>
        <SheetArt />
      </Pane>
      <Pane show={active === 'board'}>
        <BoardArt />
      </Pane>
      <Pane show={active === 'overview'}>
        <OverviewArt active={active === 'overview'} />
      </Pane>
    </div>
  )
}

function Pane({ show, children }: { show: boolean; children: ReactNode }) {
  return (
    <div
      className="absolute inset-0 p-3"
      style={{
        opacity: show ? 1 : 0,
        transition: 'opacity 300ms var(--ease)',
        pointerEvents: show ? 'auto' : 'none',
      }}
      aria-hidden={!show}
    >
      {children}
    </div>
  )
}

function SheetArt() {
  const widths = [72, 58, 80, 45, 66, 52, 70]
  return (
    <div className="flex h-full flex-col border border-rule">
      <div className="grid h-7 grid-cols-[1.5rem_1fr_1.25rem_2.5rem] items-center border-b border-b-ink bg-fill text-[10px]">
        <span className="border-r border-r-rule" />
        <span className="border-r border-r-rule px-1.5 font-medium">Company</span>
        <span className="border-r border-r-rule px-1" />
        <span className="px-1 text-right font-medium">Added</span>
      </div>
      {widths.map((width, index) => (
        <div
          key={width}
          className="grid h-8 grid-cols-[1.5rem_1fr_1.25rem_2.5rem] items-center border-b border-b-rule"
        >
          <span className="figure border-r border-r-rule bg-fill px-1 text-right text-[10px] text-ink-2">
            {index + 1}
          </span>
          <span className="border-r border-r-rule px-1.5">
            <span
              className="block h-1.5 bg-ink"
              style={{ width: `${width}%`, opacity: 0.85 }}
            />
          </span>
          <span className="flex justify-center border-r border-r-rule">
            <StatusMark
              mark={STATUSES[index % STATUSES.length]?.mark ?? 'open'}
              color={STATUSES[index % STATUSES.length]?.color ?? 'var(--ink)'}
            />
          </span>
          <span className="px-1">
            <span className="ml-auto block h-1.5 w-8 bg-rule" />
          </span>
        </div>
      ))}
    </div>
  )
}

function BoardArt() {
  const columns = [3, 2, 1, 2]
  return (
    <div className="grid h-full grid-cols-4 gap-1.5">
      {STATUSES.map((status, index) => (
        <div key={status.value} className="flex flex-col border border-rule">
          <div className="flex items-center gap-1 border-b border-b-ink bg-fill px-1 py-1">
            <StatusMark mark={status.mark} color={status.color} />
          </div>
          <div className="flex flex-1 flex-col gap-1 p-1">
            {Array.from({ length: columns[index] ?? 1 }, (_, card) => (
              <div key={card} className="h-6 border border-rule bg-paper" />
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}

function OverviewArt({ active }: { active: boolean }) {
  const bars = [
    { width: '100%', opacity: 1 },
    { width: '38%', opacity: 0.6 },
    { width: '12%', opacity: 0.3 },
  ]
  return (
    <div className="flex h-full flex-col gap-4">
      <div className="flex flex-col gap-2">
        {bars.map((bar) => (
          <div key={bar.width} className="h-2.5 bg-fill">
            <div
              className={`h-full origin-left bg-ink ${active ? 'landing-funnel-grow-active' : 'landing-funnel-grow'}`}
              style={{ width: bar.width, opacity: bar.opacity }}
            />
          </div>
        ))}
      </div>
      <div className="grid grid-cols-[repeat(18,minmax(0,1fr))] gap-0.5">
        {Array.from({ length: 54 }, (_, i) => (
          <span
            key={i}
            className="aspect-square bg-ink"
            style={{
              opacity: active ? 0.08 + (i % 5) * 0.12 : 0.05,
              transition: active
                ? `opacity 600ms var(--ease) ${i * 8}ms`
                : undefined,
            }}
          />
        ))}
      </div>
    </div>
  )
}
