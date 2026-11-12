import { useRef, useState, type ChangeEvent } from 'react'

import { Alert, AlertDescription } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

const MAX_BYTES = 1_000_000

type ImportFileStepProps = {
  onTextLoaded: (text: string) => void
}

export function ImportFileStep({ onTextLoaded }: ImportFileStepProps) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [error, setError] = useState<string | null>(null)

  async function handleChange(event: ChangeEvent<HTMLInputElement>) {
    setError(null)
    const file = event.target.files?.[0]
    event.target.value = ''
    if (!file) return

    if (file.size > MAX_BYTES) {
      setError('File is larger than 1 MB. Choose a smaller CSV.')
      return
    }

    const text = await file.text()
    onTextLoaded(text)
  }

  return (
    <div className="flex flex-col gap-3">
      <p className="text-sm text-muted-foreground">
        Choose a CSV exported from JobSheets or a compatible spreadsheet.
      </p>
      {error ? (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      ) : null}
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="import-csv">CSV file</Label>
        <Input
          ref={inputRef}
          id="import-csv"
          type="file"
          accept=".csv,text/csv"
          onChange={(event) => {
            void handleChange(event)
          }}
        />
      </div>
      <Button
        type="button"
        variant="outline"
        onClick={() => inputRef.current?.click()}
      >
        Choose file
      </Button>
    </div>
  )
}
