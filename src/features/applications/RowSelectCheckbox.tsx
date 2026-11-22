import { cn } from 'cn'

import { SheetCheckbox } from '@/components/sheet/SheetCheckbox'

const GUTTER_TITLE = 'Select (Shift-click to select a range)'

type RowSelectCheckboxProps = {
  checked: boolean
  label: string
  rowNumber: number
  /** When true, every row shows its checkbox (selection mode). */
  selectionMode: boolean
  onSelect: (modifiers: {
    shiftKey: boolean
    metaKey: boolean
    ctrlKey: boolean
    pointerType?: string
  }) => void
}

export function RowSelectCheckbox({
  checked,
  label,
  rowNumber,
  selectionMode,
  onSelect,
}: RowSelectCheckboxProps) {
  return (
    <div
      className="group/gutter relative flex h-9 w-full cursor-pointer items-center justify-end px-2"
      title={GUTTER_TITLE}
    >
      <span
        className={cn(
          'figure text-ink-2',
          selectionMode && 'invisible',
          'group-hover/row:invisible group-data-[focus-visible]/row:invisible group-focus-visible/gutter:invisible pointer-coarse:invisible',
        )}
        aria-hidden
      >
        {rowNumber}
      </span>
      {/* Hit target stays active; face only on hover / keyboard focus-visible / selection. */}
      <div
        className={cn(
          'absolute inset-0 flex items-center justify-end px-2',
          selectionMode
            ? 'opacity-100'
            : 'opacity-0 group-hover/row:opacity-100 group-data-[focus-visible]/row:opacity-100 group-focus-visible/gutter:opacity-100 pointer-coarse:opacity-100',
        )}
      >
        <SheetCheckbox
          checked={checked}
          aria-label={label}
          onSelectClick={onSelect}
        />
      </div>
    </div>
  )
}
