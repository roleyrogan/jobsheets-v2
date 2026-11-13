import { Button } from '@/components/ui/button'

type ApplicationsHeaderProps = {
  onAdd: () => void
  onImport: () => void
}

export function ApplicationsHeader({
  onAdd,
  onImport,
}: ApplicationsHeaderProps) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-3">
      <h1 className="text-2xl font-medium tracking-tight">Applications</h1>
      <div className="flex flex-wrap gap-2">
        <Button onClick={onAdd}>Add application</Button>
        <Button variant="outline" onClick={onImport}>
          Import
        </Button>
      </div>
    </div>
  )
}
