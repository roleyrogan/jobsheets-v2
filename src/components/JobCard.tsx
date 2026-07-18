import { useState } from 'react'
import { supabase } from '../supabase'
import type { Application } from '../types'

type JobCardProps = {
  application: Application
  onDelete: (id: string) => void
}

const STATUS_STYLES: Record<Application['status'], { bg: string; text: string }> = {
  Applied: { bg: '#1a3a5c', text: '#60a5fa' },
  Interview: { bg: '#3a2a00', text: '#fbbf24' },
  Offer: { bg: '#0a3a1a', text: '#34d399' },
  Rejected: { bg: '#3a0a0a', text: '#f87171' },
}

export default function JobCard({ application, onDelete }: JobCardProps) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const statusStyle = STATUS_STYLES[application.status]

  async function handleDelete() {
    if (!confirm('Delete this application?')) return

    setLoading(true)
    setError('')

    const { error } = await supabase
      .from('applications')
      .delete()
      .eq('id', application.id)

    if (error) {
      setError(error.message)
      setLoading(false)
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
        <span
          className="rounded-full px-3 py-1 text-xs font-medium font-mono whitespace-nowrap"
          style={{ backgroundColor: statusStyle.bg, color: statusStyle.text }}
        >
          {application.status}
        </span>

        <button
          type="button"
          onClick={handleDelete}
          disabled={loading}
          className="border border-[#7B2CBF] text-[#C77DFF] hover:bg-[#3C096C] rounded-lg px-3 py-1.5 text-sm font-medium transition-colors disabled:opacity-50"
        >
          {loading ? 'Deleting...' : 'Delete'}
        </button>
      </div>
    </div>
  )
}
