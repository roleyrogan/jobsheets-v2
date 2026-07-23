import { useEffect, useState, type Key } from 'react'
import { Button, ListBox, Select } from '@heroui/react'
import { outlineButtonClass } from '../lib/heroui-button'
import { supabase } from '../supabase'
import type { Application } from '../types'
import SpotlightCard from './SpotlightCard'

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
  const [confirmingDelete, setConfirmingDelete] = useState(false)
  const [statusLoading, setStatusLoading] = useState(false)
  const [status, setStatus] = useState<Application['status']>(application.status)
  const [error, setError] = useState('')

  useEffect(() => {
    setStatus(application.status)
  }, [application.status])

  const statusStyle = STATUS_STYLES[status]

  async function handleStatusChange(key: Key | Key[] | null) {
    if (typeof key !== 'string' || key === status) return

    const previous = status
    const newStatus = key as Application['status']

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
    <SpotlightCard
      className="!rounded-xl !border !border-[#3C096C] !bg-[#240046] p-6"
      spotlightColor="rgba(157, 78, 221, 0.35)"
    >
      <div className="relative z-10 flex gap-4 justify-between">
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

          {application.notes && (
            <p className="text-[#9D4EDD] text-sm mt-1">{application.notes}</p>
          )}

          {error && (
            <p className="text-red-400 text-sm">{error}</p>
          )}
        </div>

        <div className="flex flex-col items-end gap-3 shrink-0">
          <Select
            aria-label="Application status"
            value={status}
            onChange={handleStatusChange}
            isDisabled={statusLoading}
          >
            <Select.Trigger
              className={`relative inline-flex items-center gap-2 rounded-full pl-3 pr-8 py-1.5 text-xs font-medium font-mono whitespace-nowrap outline-none h-auto min-h-0 min-w-[7.5rem] ${
                statusLoading ? 'opacity-50' : ''
              }`}
              style={{
                backgroundColor: statusStyle.bg,
                color: statusStyle.text,
              }}
            >
              <Select.Value className="flex-1 text-left" />
              <Select.Indicator
                className="absolute right-2.5 top-1/2 -translate-y-1/2 size-3.5 shrink-0"
                style={{ color: statusStyle.text }}
              />
            </Select.Trigger>
            <Select.Popover className="bg-[#240046] border border-[#3C096C] rounded-lg overflow-hidden min-w-[10rem]">
              <ListBox className="bg-[#240046] p-1 outline-none">
                {STATUS_OPTIONS.map(option => (
                  <ListBox.Item
                    key={option}
                    id={option}
                    textValue={option}
                    className="rounded-full px-3 py-1.5 text-xs font-medium font-mono outline-none cursor-pointer my-0.5"
                    style={{
                      backgroundColor: STATUS_STYLES[option].bg,
                      color: STATUS_STYLES[option].text,
                    }}
                  >
                    {option}
                    <ListBox.ItemIndicator />
                  </ListBox.Item>
                ))}
              </ListBox>
            </Select.Popover>
          </Select>

          {confirmingDelete ? (
            <div className="flex flex-col items-end gap-2">
              <p className="text-[#C77DFF] text-sm">Delete this application?</p>
              <div className="flex items-center gap-2">
                <Button
                  type="button"
                  size="sm"
                  onPress={handleDelete}
                  isDisabled={deleteLoading}
                  className="rounded-lg text-sm bg-[#3a0a0a] text-[#f87171]"
                >
                  {deleteLoading ? 'Deleting...' : 'Yes, delete'}
                </Button>
                <Button
                  type="button"
                  size="sm"
                  onPress={() => setConfirmingDelete(false)}
                  isDisabled={deleteLoading}
                  className="rounded-lg text-sm bg-transparent border border-[#3C096C] text-[#C77DFF]"
                >
                  Cancel
                </Button>
              </div>
            </div>
          ) : (
            <Button
              type="button"
              variant="outline"
              size="sm"
              onPress={() => setConfirmingDelete(true)}
              className={outlineButtonClass}
            >
              Delete
            </Button>
          )}
        </div>
      </div>
    </SpotlightCard>
  )
}
