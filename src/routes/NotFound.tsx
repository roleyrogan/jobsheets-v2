import { Link } from 'react-router'

export function NotFound() {
  return (
    <div className="flex min-h-svh flex-col items-center justify-center gap-3 px-4">
      <h1 className="text-2xl font-medium tracking-tight">Page not found</h1>
      <Link to="/" className="text-sm underline underline-offset-4">
        Go home
      </Link>
    </div>
  )
}
