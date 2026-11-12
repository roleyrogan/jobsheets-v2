import { Button } from '@/components/ui/button'

type ApplicationsHeaderProps = {
  exportCount: number
  onAdd: () => void
  onImport: () => void
  onExport: () => void
}

export function ApplicationsHeader({
  exportCount,
  onAdd,
  onImport,
  onExport,
}: ApplicationsHeaderProps) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-3">
      <h1 className="text-2xl font-medium tracking-tight">Applications</h1>
      <div className="flex flex-wrap gap-2">
        <Button onClick={onAdd}>Add application</Button>
        <Button variant="outline" onClick={onImport}>
          Import
        </Button>
        <Button
          variant="outline"
          onClick={onExport}
          disabled={exportCount === 0}
        >
          {exportCount === 0 ? 'Export' : `Export ${exportCount}`}
        </Button>
      </div>
    </div>
  )
}
