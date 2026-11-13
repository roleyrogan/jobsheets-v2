import { PageTitle } from '@/components/PageTitle'
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
      <PageTitle>Applications</PageTitle>
      <div className="flex flex-wrap gap-2">
        <Button onClick={onAdd}>Add application</Button>
        <Button variant="outline" onClick={onImport}>
          Import
        </Button>
      </div>
    </div>
  )
}
