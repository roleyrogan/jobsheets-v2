import { useState } from 'react'

import { ApplicationsList } from '@/features/applications/ApplicationsList'
import { ApplicationDialog } from '@/features/applications/ApplicationDialog'
import { Button } from '@/components/ui/button'
import type { Application } from '@/types/index'

export function Applications() {
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editing, setEditing] = useState<Application | null>(null)

  function openCreate() {
    setEditing(null)
    setDialogOpen(true)
  }

  function openEdit(application: Application) {
    setEditing(application)
    setDialogOpen(true)
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-2xl font-medium tracking-tight">Applications</h1>
        <Button onClick={openCreate}>Add application</Button>
      </div>

      <ApplicationsList onAdd={openCreate} onEdit={openEdit} />

      <ApplicationDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        application={editing}
      />
    </div>
  )
}
