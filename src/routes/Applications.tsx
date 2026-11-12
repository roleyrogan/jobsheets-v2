import { ApplicationsList } from '@/features/applications/ApplicationsList'

export function Applications() {
  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-2xl font-medium tracking-tight">Applications</h1>
      <ApplicationsList />
    </div>
  )
}
