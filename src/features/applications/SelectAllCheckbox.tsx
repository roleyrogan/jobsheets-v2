import { SheetCheckbox } from '@/components/sheet/SheetCheckbox'

type SelectAllCheckboxProps = {
  checked: boolean
  indeterminate: boolean
  onToggle: () => void
}

export function SelectAllCheckbox({
  checked,
  indeterminate,
  onToggle,
}: SelectAllCheckboxProps) {
  return (
    <div className="flex h-9 w-full items-center justify-end px-2">
      <SheetCheckbox
        checked={checked}
        indeterminate={indeterminate}
        aria-label="Select all applications"
        onChange={onToggle}
      />
    </div>
  )
}
