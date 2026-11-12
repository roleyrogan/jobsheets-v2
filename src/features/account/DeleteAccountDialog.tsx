import { useState } from 'react'
import { useNavigate } from 'react-router'
import { toast } from 'sonner'

import { deleteAccount } from '@/lib/api/account'
import { Alert, AlertDescription } from '@/components/ui/alert'
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

type DeleteAccountDialogProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  email: string
}

export function DeleteAccountDialog({
  open,
  onOpenChange,
  email,
}: DeleteAccountDialogProps) {
  const navigate = useNavigate()
  const [confirmation, setConfirmation] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [pending, setPending] = useState(false)
  const canDelete =
    email !== '' &&
    confirmation.trim().toLowerCase() === email.toLowerCase()

  function handleOpenChange(next: boolean) {
    if (!next) {
      setConfirmation('')
      setError(null)
    }
    onOpenChange(next)
  }

  return (
    <AlertDialog open={open} onOpenChange={handleOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete your account?</AlertDialogTitle>
          <AlertDialogDescription>
            This permanently deletes your account and all applications. Type{' '}
            <span className="font-medium text-foreground">{email}</span> to
            confirm.
          </AlertDialogDescription>
        </AlertDialogHeader>

        <div className="flex flex-col gap-3">
          {error ? (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          ) : null}
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="delete-account-confirm">Email</Label>
            <Input
              id="delete-account-confirm"
              type="email"
              autoComplete="off"
              value={confirmation}
              onChange={(event) => setConfirmation(event.target.value)}
              disabled={pending}
            />
          </div>
        </div>

        <AlertDialogFooter>
          <AlertDialogCancel disabled={pending}>Cancel</AlertDialogCancel>
          <Button
            type="button"
            variant="destructive"
            disabled={!canDelete || pending}
            onClick={() => {
              setError(null)
              setPending(true)
              void deleteAccount()
                .then(() => {
                  handleOpenChange(false)
                  navigate('/', { replace: true })
                  toast.success('Your account has been deleted')
                })
                .catch((caught: unknown) => {
                  setError(
                    caught instanceof Error
                      ? caught.message
                      : 'Failed to delete account',
                  )
                })
                .finally(() => {
                  setPending(false)
                })
            }}
          >
            {pending ? 'Deleting…' : 'Delete my account'}
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
