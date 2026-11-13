import { Link } from 'react-router'

import { AuthShell } from '@/components/AuthShell'
import { Button } from '@/components/ui/button'

export function NotFound() {
  return (
    <AuthShell title="Page not found">
      <p className="text-sm text-ink-2">That page doesn&apos;t exist.</p>
      <Button type="button" asChild className="w-fit">
        <Link to="/">Go home</Link>
      </Button>
    </AuthShell>
  )
}
