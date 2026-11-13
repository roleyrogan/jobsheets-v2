import type { StatusMarkKind } from '@/lib/status'

type StatusMarkProps = {
  mark: StatusMarkKind
  color: string
}

export function StatusMark({ mark, color }: StatusMarkProps) {
  return (
    <svg
      width="8"
      height="8"
      viewBox="0 0 8 8"
      aria-hidden
      className="shrink-0"
      style={{ color }}
    >
      {mark === 'open' ? (
        <circle
          cx="4"
          cy="4"
          r="2.75"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.25"
        />
      ) : null}
      {mark === 'half' ? (
        <>
          <circle
            cx="4"
            cy="4"
            r="2.75"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.25"
          />
          <path d="M4 1.25 A2.75 2.75 0 0 1 4 6.75 Z" fill="currentColor" />
        </>
      ) : null}
      {mark === 'filled' ? (
        <circle cx="4" cy="4" r="3" fill="currentColor" />
      ) : null}
      {mark === 'cross' ? (
        <path
          d="M2 2 L6 6 M6 2 L2 6"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.25"
          strokeLinecap="square"
        />
      ) : null}
    </svg>
  )
}
