import {
  useEffect,
  useRef,
  type MouseEvent,
  type PointerEvent,
} from 'react'
import { cn } from 'cn'

type SheetCheckboxProps = {
  checked: boolean
  indeterminate?: boolean
  'aria-label': string
  className?: string
  /** Simple toggle (header select-all). */
  onChange?: () => void
  /**
   * Modifier-aware click (row gutter). When set, the native change is
   * suppressed so Shift/Cmd/Ctrl can be read from the click event.
   */
  onSelectClick?: (event: {
    shiftKey: boolean
    metaKey: boolean
    ctrlKey: boolean
    pointerType?: string
  }) => void
}

export function SheetCheckbox({
  checked,
  indeterminate = false,
  'aria-label': ariaLabel,
  className,
  onChange,
  onSelectClick,
}: SheetCheckboxProps) {
  const inputRef = useRef<HTMLInputElement>(null)
  const pointerTypeRef = useRef<string | undefined>(undefined)

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.indeterminate = indeterminate
    }
  }, [indeterminate])

  function handlePointerDown(event: PointerEvent<HTMLInputElement>) {
    pointerTypeRef.current = event.pointerType
  }

  function handleClick(event: MouseEvent<HTMLInputElement>) {
    if (!onSelectClick) return
    event.preventDefault()
    event.stopPropagation()
    onSelectClick({
      shiftKey: event.shiftKey,
      metaKey: event.metaKey,
      ctrlKey: event.ctrlKey,
      pointerType: pointerTypeRef.current,
    })
  }

  const filled = checked || indeterminate

  return (
    <label
      className={cn(
        'relative inline-flex size-3.5 shrink-0 cursor-pointer items-center justify-center',
        className,
      )}
      onClick={(event) => event.stopPropagation()}
    >
      <input
        ref={inputRef}
        type="checkbox"
        checked={checked}
        aria-label={ariaLabel}
        className="peer absolute inset-0 z-10 cursor-pointer opacity-0"
        onPointerDown={handlePointerDown}
        onClick={onSelectClick ? handleClick : undefined}
        onChange={
          onSelectClick
            ? () => {
                /* controlled via onSelectClick */
              }
            : onChange
        }
      />
      <span
        aria-hidden
        className={cn(
          'pointer-events-none flex size-3.5 items-center justify-center rounded-none border border-ink-2 bg-paper text-[10px] leading-none text-paper peer-focus-visible:outline peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-select',
          filled && 'border-ink bg-ink',
        )}
      >
        {checked ? '✓' : indeterminate ? '−' : null}
      </span>
    </label>
  )
}
