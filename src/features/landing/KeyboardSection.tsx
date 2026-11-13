import { useReveal } from '@/features/landing/useReveal'

const SHORTCUTS = [
  { keys: '↑ ↓', action: 'Move between rows' },
  { keys: 'Enter', action: 'Edit the application' },
  { keys: 'S', action: 'Change its status' },
  { keys: '/', action: 'Search' },
] as const

export function KeyboardSection() {
  const ref = useReveal<HTMLElement>()

  return (
    <section
      id="keyboard"
      ref={ref}
      className="flex flex-col gap-8 min-[760px]:grid min-[760px]:grid-cols-2 min-[760px]:gap-16"
    >
      <div className="landing-reveal-child flex flex-col gap-2">
        <h2 className="text-[22px] leading-7 font-semibold min-[760px]:text-[28px] min-[760px]:leading-8">
          Fast with a keyboard.
        </h2>
        <p className="max-w-[40ch] text-[15px] leading-6 text-ink-2">
          Navigate the sheet without leaving the home row.
        </p>
      </div>

      <ul className="landing-reveal-child flex flex-col border-t border-t-rule">
        {SHORTCUTS.map((item) => (
          <li
            key={item.keys}
            className="landing-reveal-child flex items-center justify-between gap-4 border-b border-b-rule py-3"
          >
            <span className="text-sm">{item.action}</span>
            <kbd className="figure rounded-[3px] border border-ink border-b-2 px-2 py-1 text-[12px]">
              {item.keys}
            </kbd>
          </li>
        ))}
      </ul>
    </section>
  )
}
