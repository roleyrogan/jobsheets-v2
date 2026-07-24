import { useState, type FormEvent, type Key } from 'react'
import { Button, ListBox, Select } from '@heroui/react'
import { filledButtonClass, outlineButtonClass } from '../lib/heroui-button'
import { supabase } from '../supabase'
import type { Application } from '../types'

type EditFormProps = {
  application: Application
  onSave: (application: Application) => void
  onClose: () => void
}

const STATUS_OPTIONS: Application['status'][] = ['Applied', 'Interview', 'Offer', 'Rejected']

const inputClassName =
  'bg-[#10002B] border border-[#3C096C] rounded-lg px-4 py-2 text-[#E0AAFF] placeholder-[#7B2CBF] outline-none focus:border-[#7B2CBF] w-full'

export default function EditForm({ application, onSave, onClose }: EditFormProps) {
  const [company, setCompany] = useState(application.company)
  const [role, setRole] = useState(application.role)
  const [status, setStatus] = useState<Application['status']>(application.status)
  const [applicationUrl, setApplicationUrl] = useState(application.application_url ?? '')
  const [location, setLocation] = useState(application.location ?? '')
  const [notes, setNotes] = useState(application.notes ?? '')
  const [loading, setLoading] = useState(false)
  const [validationError, setValidationError] = useState('')
  const [supabaseError, setSupabaseError] = useState('')

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setValidationError('')
    setSupabaseError('')

    if (!company.trim() || !role.trim()) {
      setValidationError('Company and role are required')
      return
    }

    setLoading(true)

    const updates = {
      company: company.trim(),
      role: role.trim(),
      status,
      application_url: applicationUrl.trim() || null,
      location: location.trim() || null,
      notes: notes.trim() || null,
    }

    const { data, error } = await supabase
      .from('applications')
      .update(updates)
      .eq('id', application.id)
      .select()
      .single()

    setLoading(false)

    if (error) {
      setSupabaseError(error.message)
      return
    }

    onSave((data as Application) ?? { ...application, ...updates })
    onClose()
  }

  return (
    <div className="bg-[#240046] border border-[#3C096C] rounded-xl p-8 w-full">
      <h2 className="text-[#E0AAFF] text-xl font-bold mb-6">Edit Application</h2>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex flex-col gap-1">
            <label htmlFor="edit-company" className="text-[#C77DFF] text-sm">
              Company <span className="text-[#7B2CBF]">*</span>
            </label>
            <input
              id="edit-company"
              type="text"
              value={company}
              onChange={e => setCompany(e.target.value)}
              className={inputClassName}
            />
          </div>

          <div className="flex flex-col gap-1">
            <label htmlFor="edit-role" className="text-[#C77DFF] text-sm">
              Role <span className="text-[#7B2CBF]">*</span>
            </label>
            <input
              id="edit-role"
              type="text"
              value={role}
              onChange={e => setRole(e.target.value)}
              className={inputClassName}
            />
          </div>
        </div>

        <div className="flex flex-col gap-1">
          <label htmlFor="edit-status" className="text-[#C77DFF] text-sm">
            Status <span className="text-[#7B2CBF]">*</span>
          </label>
          <Select
            aria-label="Status"
            fullWidth
            value={status}
            onChange={(key: Key | Key[] | null) => {
              if (typeof key === 'string') {
                setStatus(key as Application['status'])
              }
            }}
          >
            <Select.Trigger
              id="edit-status"
              className="w-full bg-[#10002B] border border-[#3C096C] rounded-lg px-4 py-2 text-[#E0AAFF] outline-none data-[focus-visible=true]:border-[#7B2CBF] data-[hovered=true]:border-[#7B2CBF]"
            >
              <Select.Value className="text-[#E0AAFF]" />
              <Select.Indicator className="text-[#C77DFF]" />
            </Select.Trigger>
            <Select.Popover className="bg-[#240046] border border-[#3C096C] rounded-lg overflow-hidden">
              <ListBox className="bg-[#240046] p-1 outline-none">
                {STATUS_OPTIONS.map(option => (
                  <ListBox.Item
                    key={option}
                    id={option}
                    textValue={option}
                    className="rounded-md px-3 py-2 text-sm text-[#E0AAFF] outline-none cursor-pointer data-[focused=true]:bg-[#3C096C] data-[selected=true]:bg-[#7B2CBF] data-[selected=true]:text-[#E0AAFF]"
                  >
                    {option}
                    <ListBox.ItemIndicator />
                  </ListBox.Item>
                ))}
              </ListBox>
            </Select.Popover>
          </Select>
        </div>

        <div className="flex flex-col gap-1">
          <label htmlFor="edit-applicationUrl" className="text-[#C77DFF] text-sm">
            Application URL
          </label>
          <input
            id="edit-applicationUrl"
            type="url"
            value={applicationUrl}
            onChange={e => setApplicationUrl(e.target.value)}
            placeholder="https://"
            className={inputClassName}
          />
        </div>

        <div className="flex flex-col gap-1">
          <label htmlFor="edit-location" className="text-[#C77DFF] text-sm">
            Location
          </label>
          <input
            id="edit-location"
            type="text"
            value={location}
            onChange={e => setLocation(e.target.value)}
            className={inputClassName}
          />
        </div>

        <div className="flex flex-col gap-1">
          <label htmlFor="edit-notes" className="text-[#C77DFF] text-sm">
            Notes
          </label>
          <textarea
            id="edit-notes"
            value={notes}
            onChange={e => setNotes(e.target.value)}
            rows={3}
            className={`${inputClassName} resize-y`}
          />
        </div>

        {validationError && (
          <p className="text-red-400 text-sm">{validationError}</p>
        )}

        <div className="flex flex-col gap-2 sm:flex-row">
          <Button
            type="submit"
            fullWidth
            isDisabled={loading}
            className={filledButtonClass}
          >
            {loading ? 'Saving...' : 'Save Changes'}
          </Button>
          <Button
            type="button"
            variant="outline"
            fullWidth
            isDisabled={loading}
            onPress={onClose}
            className={outlineButtonClass}
          >
            Cancel
          </Button>
        </div>
      </form>

      {supabaseError && (
        <p className="text-red-400 text-sm mt-4">{supabaseError}</p>
      )}
    </div>
  )
}
