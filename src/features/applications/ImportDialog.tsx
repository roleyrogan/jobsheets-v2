import { useState } from 'react'
import { toast } from 'sonner'

import { parseApplicationsCsv, type ParseApplicationsCsvResult } from '@/lib/csv'
import { useApplications } from '@/features/applications/queries'
import { useImportApplications } from '@/features/applications/mutations'
import { ImportFileStep } from '@/features/applications/ImportFileStep'
import { ImportPreview } from '@/features/applications/ImportPreview'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogBody,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'

type ImportDialogProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function ImportDialog({ open, onOpenChange }: ImportDialogProps) {
  const { data: existing = [] } = useApplications()
  const importMutation = useImportApplications()
  const [result, setResult] = useState<ParseApplicationsCsvResult | null>(null)

  function handleOpenChange(next: boolean) {
    if (!next) {
      setResult(null)
      importMutation.reset()
    }
    onOpenChange(next)
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>Import applications</DialogTitle>
        </DialogHeader>

        <DialogBody>
          {result ? (
            <ImportPreview result={result} />
          ) : (
            <ImportFileStep
              onTextLoaded={(text) => {
                setResult(parseApplicationsCsv(text, existing))
              }}
            />
          )}
        </DialogBody>

        <DialogFooter>
          {result ? (
            <>
              <Button
                type="button"
                variant="outline"
                onClick={() => setResult(null)}
                disabled={importMutation.isPending}
              >
                Choose another file
              </Button>
              <Button
                type="button"
                disabled={result.ready.length === 0 || importMutation.isPending}
                onClick={() => {
                  importMutation.mutate(result.ready, {
                    onSuccess: (count) => {
                      toast.success(
                        `Imported ${count} application${count === 1 ? '' : 's'}`,
                      )
                      handleOpenChange(false)
                    },
                    onError: (error) => {
                      toast.error(
                        error instanceof Error
                          ? error.message
                          : 'Import failed',
                      )
                    },
                  })
                }}
              >
                {importMutation.isPending
                  ? 'Importing…'
                  : `Import ${result.ready.length} application${result.ready.length === 1 ? '' : 's'}`}
              </Button>
            </>
          ) : (
            <Button
              type="button"
              variant="outline"
              onClick={() => handleOpenChange(false)}
            >
              Cancel
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
