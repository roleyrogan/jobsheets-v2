import { useState, type FormEvent } from 'react'
import { supabase } from '../supabase'
import type { Application } from '../types'

type JobFormProps = {
  userId: string
  onAdd: (application: Application) => void
  onCancel: () => void
}

const STATUS_OPTIONS: Application['status'][] = ['Applied', 'Interview', 'Offer', 'Rejected']

const inputClassName =
  'bg-[#10002B] border border-[#3C096C] rounded-lg px-4 py-2 text-[#E0AAFF] placeholder-[#7B2CBF] outline-none focus:border-[#7B2CBF] w-full'

function formatTodayUS(): string {
  const today = new Date()
  const month = String(today.getMonth() + 1).padStart(2, '0')
  const day = String(today.getDate()).padStart(2, '0')
  const year = today.getFullYear()
  return `${month}/${day}/${year}`
}

export default function JobForm({ userId, onAdd, onCancel }: JobFormProps) {
  const [company, setCompany] = useState('')
  const [role, setRole] = useState('')
  const [status, setStatus] = useState<Application['status']>('Applied')
  const [applicationUrl, setApplicationUrl] = useState('')
  const [location, setLocation] = useState('')
  const [deadline, setDeadline] = useState('')
  const [notes, setNotes] = useState('')
  const [loading, setLoading] = useState(false)
  const [validationError, setValidationError] = useState('')
  const [supabaseError, setSupabaseError] = useState('')

  function clearForm() {
    setCompany('')
    setRole('')
    setStatus('Applied')
    setApplicationUrl('')
    setLocation('')
    setDeadline('')
    setNotes('')
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setValidationError('')
    setSupabaseError('')

    if (!company.trim() || !role.trim()) {
      setValidationError('Company and role are required')
      return
    }

    setLoading(true)

    const { data, error } = await supabase
      .from('applications')
      .insert({
        user_id: userId,
        company: company.trim(),
        role: role.trim(),
        status,
        date: formatTodayUS(),
        application_url: applicationUrl.trim() || null,
        location: location.trim() || null,
        deadline: deadline || null,
        notes: notes.trim() || null,
      })
      .select()
      .single()

    setLoading(false)

    if (error) {
      setSupabaseError(error.message)
      return
    }

    onAdd(data as Application)
    clearForm()
  }

  return (
    <div className="bg-[#240046] border border-[#3C096C] rounded-xl p-8 w-full">
      <h2 className="text-[#E0AAFF] text-xl font-bold mb-6">Add Application</h2>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex flex-col gap-1">
            <label htmlFor="company" className="text-[#C77DFF] text-sm">
              Company <span className="text-[#7B2CBF]">*</span>
            </label>
            <input
              id="company"
              type="text"
              value={company}
              onChange={e => setCompany(e.target.value)}
              className={inputClassName}
            />
          </div>

          <div className="flex flex-col gap-1">
            <label htmlFor="role" className="text-[#C77DFF] text-sm">
              Role <span className="text-[#7B2CBF]">*</span>
            </label>
            <input
              id="role"
              type="text"
              value={role}
              onChange={e => setRole(e.target.value)}
              className={inputClassName}
            />
          </div>
        </div>

        <div className="flex flex-col gap-1">
          <label htmlFor="status" className="text-[#C77DFF] text-sm">
            Status <span className="text-[#7B2CBF]">*</span>
          </label>
          <select
            id="status"
            value={status}
            onChange={e => setStatus(e.target.value as Application['status'])}
            className={inputClassName}
          >
            {STATUS_OPTIONS.map(option => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </div>

        <div className="flex flex-col gap-1">
          <label htmlFor="applicationUrl" className="text-[#C77DFF] text-sm">
            Application URL
          </label>
          <input
            id="applicationUrl"
            type="url"
            value={applicationUrl}
            onChange={e => setApplicationUrl(e.target.value)}
            placeholder="https://"
            className={inputClassName}
          />
        </div>

        <div className="flex flex-col gap-1">
          <label htmlFor="location" className="text-[#C77DFF] text-sm">
            Location
          </label>
          <input
            id="location"
            type="text"
            value={location}
            onChange={e => setLocation(e.target.value)}
            className={inputClassName}
          />
        </div>

        <div className="flex flex-col gap-1">
          <label htmlFor="deadline" className="text-[#C77DFF] text-sm">
            Deadline
          </label>
          <input
            id="deadline"
            type="date"
            value={deadline}
            onChange={e => setDeadline(e.target.value)}
            className={inputClassName}
          />
        </div>

        <div className="flex flex-col gap-1">
          <label htmlFor="notes" className="text-[#C77DFF] text-sm">
            Notes
          </label>
          <textarea
            id="notes"
            value={notes}
            onChange={e => setNotes(e.target.value)}
            rows={3}
            className={`${inputClassName} resize-y`}
          />
        </div>

        {validationError && (
          <p className="text-red-400 text-sm">{validationError}</p>
        )}

        <button
          type="submit"
          disabled={loading}
          className="bg-[#7B2CBF] hover:bg-[#9D4EDD] text-[#E0AAFF] rounded-lg py-2 font-medium transition-colors disabled:opacity-50"
        >
          {loading ? 'Adding...' : 'Add Application'}
        </button>

        <button
          type="button"
          onClick={onCancel}
          disabled={loading}
          className="border border-[#7B2CBF] text-[#C77DFF] hover:bg-[#3C096C] rounded-lg py-2 font-medium transition-colors disabled:opacity-50"
        >
          Cancel
        </button>
      </form>

      {supabaseError && (
        <p className="text-red-400 text-sm mt-4">{supabaseError}</p>
      )}
    </div>
  )
}
