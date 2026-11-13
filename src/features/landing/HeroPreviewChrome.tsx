import type { ReactNode } from 'react'

const TABS = ['Sheet', 'Board', 'Overview'] as const
export type HeroTab = (typeof TABS)[number]
export { TABS }

type HeroPreviewChromeProps = {
  tab: HeroTab
  onSelectTab: (tab: HeroTab) => void
  onReplay: () => void
  children: ReactNode
}

export function HeroPreviewChrome({
  tab,
  onSelectTab,
  onReplay,
  children,
}: HeroPreviewChromeProps) {
  const tabIndex = TABS.indexOf(tab)

  return (
    <div className="flex flex-col gap-2">
      <div className="border border-ink bg-paper">
        <div className="flex items-center border-b border-b-rule">
          <div role="tablist" aria-label="Demo views" className="relative flex">
            {TABS.map((name) => (
              <button
                key={name}
                type="button"
                role="tab"
                aria-selected={tab === name}
                className={
                  tab === name
                    ? 'relative z-10 h-9 w-[104px] text-[13px] font-medium text-ink max-[759px]:w-[84px]'
                    : 'relative z-10 h-9 w-[104px] text-[13px] text-ink-2 max-[759px]:w-[84px]'
                }
                onClick={() => onSelectTab(name)}
              >
                {name}
              </button>
            ))}
            <span
              className="absolute bottom-0 left-0 h-0.5 w-[104px] bg-ink max-[759px]:w-[84px]"
              style={{
                transform: `translateX(${tabIndex * 100}%)`,
                transition: 'transform 260ms var(--ease)',
              }}
            />
          </div>
          <button
            type="button"
            className="landing-press ml-auto px-3 text-[13px] text-ink-2 hover:text-ink"
            onClick={onReplay}
          >
            Replay demo
          </button>
        </div>
        <div className="relative h-[336px]">{children}</div>
      </div>
      <p className="text-xs text-ink-2">
        Try it: click a column header to sort, click a status to change it, or
        switch views. Sample data.
      </p>
    </div>
  )
}

export function ViewPane({
  show,
  hiding,
  children,
}: {
  show: boolean
  hiding: boolean
  children: ReactNode
}) {
  const visible = show || hiding
  return (
    <div
      className="absolute inset-0"
      style={{
        opacity: show ? 1 : 0,
        visibility: visible ? 'visible' : 'hidden',
        pointerEvents: show ? 'auto' : 'none',
        transition: 'opacity 220ms var(--ease)',
      }}
      aria-hidden={!show}
    >
      {children}
    </div>
  )
}
