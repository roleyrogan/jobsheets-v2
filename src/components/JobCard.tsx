import { useEffect, useState, type ChangeEvent } from 'react'
import { supabase } from '../supabase'
import type { Application } from '../types'

type JobCardProps = {
  application: Application
  onDelete: (id: string) => void
  onStatusUpdate: (id: string, newStatus: string) => void
}

const STATUS_OPTIONS: Application['status'][] = ['Applied', 'Interview', 'Offer', 'Rejected']

const STATUS_STYLES: Record<Application['status'], { bg: string; text: string }> = {
  Applied: { bg: '#1a3a5c', text: '#60a5fa' },
  Interview: { bg: '#3a2a00', text: '#fbbf24' },
  Offer: { bg: '#0a3a1a', text: '#34d399' },
  Rejected: { bg: '#3a0a0a', text: '#f87171' },
}

export default function JobCard({ application, onDelete, onStatusUpdate }: JobCardProps) {
  const [deleteLoading, setDeleteLoading] = useState(false)
  const [statusLoading, setStatusLoading] = useState(false)
  const [status, setStatus] = useState<Application['status']>(application.status)
  const [error, setError] = useState('')

  useEffect(() => {
    setStatus(application.status)
  }, [application.status])

  const statusStyle = STATUS_STYLES[status]

  async function handleStatusChange(e: ChangeEvent<HTMLSelectElement>) {
    const previous = status
    const newStatus = e.target.value as Application['status']

    setStatus(newStatus)
    setStatusLoading(true)
    setError('')

    const { error } = await supabase
      .from('applications')
      .update({ status: newStatus })
      .eq('id', application.id)

    if (error) {
      setStatus(previous)
      setError(error.message)
      setStatusLoading(false)
      return
    }

    onStatusUpdate(application.id, newStatus)
    setStatusLoading(false)
  }

  async function handleDelete() {
    if (!confirm('Delete this application?')) return

    setDeleteLoading(true)
    setError('')

    const { error } = await supabase
      .from('applications')
      .delete()
      .eq('id', application.id)

    if (error) {
      setError(error.message)
      setDeleteLoading(false)
      return
    }

    onDelete(application.id)
  }

  return (
    <div className="bg-[#240046] border border-[#3C096C] rounded-xl p-6 flex gap-4 justify-between">
      <div className="flex flex-col gap-2 min-w-0 flex-1">
        <h3 className="text-[#E0AAFF] text-xl font-bold truncate">{application.company}</h3>
        <p className="text-[#C77DFF] text-sm">{application.role}</p>
        <p className="text-[#7B2CBF] text-xs font-mono">{application.date}</p>

        {application.application_url && (
          <a
            href={application.application_url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-[#C77DFF] text-sm hover:text-[#E0AAFF] underline underline-offset-2 w-fit"
          >
            View application
          </a>
        )}

        {application.location && (
          <div className="flex flex-col gap-0.5">
            <span className="text-[#7B2CBF] text-xs">Location</span>
            <span className="text-[#C77DFF] text-sm">{application.location}</span>
          </div>
        )}

        {application.deadline && (
          <div className="flex flex-col gap-0.5">
            <span className="text-[#7B2CBF] text-xs">Deadline</span>
            <span className="text-[#C77DFF] text-sm font-mono">{application.deadline}</span>
          </div>
        )}

        {application.notes && (
          <p className="text-[#9D4EDD] text-sm mt-1">{application.notes}</p>
        )}

        {error && (
          <p className="text-red-400 text-sm">{error}</p>
        )}
      </div>

      <div className="flex flex-col items-end gap-3 shrink-0">
        <select
          value={status}
          onChange={handleStatusChange}
          disabled={statusLoading}
          aria-label="Application status"
          className={`rounded-full px-3 py-1 text-xs font-medium font-mono whitespace-nowrap outline-none cursor-pointer appearance-none pr-6 disabled:opacity-50 disabled:cursor-not-allowed ${
            statusLoading ? 'opacity-50' : ''
          }`}
          style={{
            backgroundColor: statusStyle.bg,
            color: statusStyle.text,
            backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='${encodeURIComponent(statusStyle.text)}' d='M3 4.5L6 8l3-3.5'/%3E%3C/svg%3E")`,
            backgroundRepeat: 'no-repeat',
            backgroundPosition: 'right 0.5rem center',
          }}
        >
          {STATUS_OPTIONS.map(option => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>

        <button
          type="button"
          onClick={handleDelete}
          disabled={deleteLoading}
          className="border border-[#7B2CBF] text-[#C77DFF] hover:bg-[#3C096C] rounded-lg px-3 py-1.5 text-sm font-medium transition-colors disabled:opacity-50"
        >
          {deleteLoading ? 'Deleting...' : 'Delete'}
        </button>
      </div>
    </div>
  )
}
