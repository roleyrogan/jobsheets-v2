import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

type AccountPasswordFieldsProps = {
  currentPassword: string
  newPassword: string
  confirmPassword: string
  errors: Partial<
    Record<'currentPassword' | 'newPassword' | 'confirmPassword', string>
  >
  pending: boolean
  onChange: (
    field: 'currentPassword' | 'newPassword' | 'confirmPassword',
    value: string,
  ) => void
}

export function AccountPasswordFields({
  currentPassword,
  newPassword,
  confirmPassword,
  errors,
  pending,
  onChange,
}: AccountPasswordFieldsProps) {
  return (
    <>
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="settings-current-password">Current password</Label>
        <Input
          id="settings-current-password"
          type="password"
          autoComplete="current-password"
          value={currentPassword}
          onChange={(event) => onChange('currentPassword', event.target.value)}
          aria-invalid={Boolean(errors.currentPassword)}
          disabled={pending}
        />
        {errors.currentPassword ? (
          <p className="text-sm text-destructive">{errors.currentPassword}</p>
        ) : null}
      </div>

      <div className="flex flex-col gap-1.5">
        <Label htmlFor="settings-new-password">New password</Label>
        <Input
          id="settings-new-password"
          type="password"
          autoComplete="new-password"
          value={newPassword}
          onChange={(event) => onChange('newPassword', event.target.value)}
          aria-invalid={Boolean(errors.newPassword)}
          disabled={pending}
        />
        {errors.newPassword ? (
          <p className="text-sm text-destructive">{errors.newPassword}</p>
        ) : null}
      </div>

      <div className="flex flex-col gap-1.5">
        <Label htmlFor="settings-confirm-password">Confirm new password</Label>
        <Input
          id="settings-confirm-password"
          type="password"
          autoComplete="new-password"
          value={confirmPassword}
          onChange={(event) => onChange('confirmPassword', event.target.value)}
          aria-invalid={Boolean(errors.confirmPassword)}
          disabled={pending}
        />
        {errors.confirmPassword ? (
          <p className="text-sm text-destructive">{errors.confirmPassword}</p>
        ) : null}
      </div>
    </>
  )
}
