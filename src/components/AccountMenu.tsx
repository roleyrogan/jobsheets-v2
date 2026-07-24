import { useEffect, useRef, useState } from 'react'
import type { Session } from '@supabase/supabase-js'
import { Button } from '@heroui/react'
import { AnimatePresence, motion } from 'motion/react'
import type { ToastType } from './Toast'
import { supabase } from '../supabase'

type AccountMenuProps = {
  session: Session
  showToast: (message: string, type: ToastType) => void
  onAccountDeleted: () => void
}

export default function AccountMenu({
  session,
  showToast,
  onAccountDeleted,
}: AccountMenuProps) {
  const [open, setOpen] = useState(false)
  const [confirmingDelete, setConfirmingDelete] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)

  const email = session.user.email ?? ''
  const initial = (email.charAt(0) || '?').toUpperCase()

  useEffect(() => {
    if (!open) return

    function handlePointerDown(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setOpen(false)
        setConfirmingDelete(false)
      }
    }

    document.addEventListener('mousedown', handlePointerDown)
    return () => document.removeEventListener('mousedown', handlePointerDown)
  }, [open])

  function handleToggle() {
    setOpen(prev => !prev)
    setConfirmingDelete(false)
  }

  async function handleConfirmDelete() {
    setDeleting(true)

    // Calls Supabase Edge Function which uses service role key
    // server-side to safely delete the auth user — service role
    // key is never exposed to the frontend
    const { error } = await supabase.functions.invoke('delete-account')

    if (error) {
      setDeleting(false)
      showToast('Failed to delete account. Please try again.', 'error')
      return
    }

    await supabase.auth.signOut()
    setDeleting(false)
    setOpen(false)
    setConfirmingDelete(false)
    onAccountDeleted()
  }

  return (
    <div ref={menuRef} className="relative">
      <button
        type="button"
        aria-label="Account menu"
        aria-expanded={open}
        onClick={handleToggle}
        className="flex size-9 shrink-0 items-center justify-center rounded-full border border-[#3C096C] bg-[#10002B] text-sm font-medium text-[#E0AAFF] transition-colors hover:bg-[#3C096C]"
      >
        {initial}
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -8, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -6, scale: 0.96 }}
            transition={{ duration: 0.18, ease: 'easeOut' }}
            className="absolute right-0 top-full z-50 mt-2 w-64 origin-top-right rounded-xl border border-[#3C096C] bg-[#240046] p-3 shadow-lg"
          >
            {confirmingDelete ? (
              <div className="flex flex-col gap-3">
                <p className="text-xs leading-relaxed text-[#f87171]">
                  This will permanently delete your account and all your applications.
                  This cannot be undone.
                </p>
                <Button
                  type="button"
                  size="sm"
                  onPress={handleConfirmDelete}
                  isDisabled={deleting}
                  className="w-full rounded-lg border border-[#f87171] bg-[#3a0a0a] text-sm text-[#f87171]"
                >
                  {deleting ? 'Deleting...' : 'Yes, delete everything'}
                </Button>
                <Button
                  type="button"
                  size="sm"
                  variant="outline"
                  onPress={() => setConfirmingDelete(false)}
                  isDisabled={deleting}
                  className="w-full rounded-lg border border-[#3C096C] bg-transparent text-sm text-[#C77DFF] hover:bg-[#3C096C] data-[hovered=true]:bg-[#3C096C]"
                >
                  Cancel
                </Button>
              </div>
            ) : (
              <div className="flex flex-col gap-2">
                <p className="truncate px-1 text-xs text-[#C77DFF]" title={email}>
                  {email}
                </p>
                <div className="border-t border-[#3C096C]" />
                <button
                  type="button"
                  onClick={() => setConfirmingDelete(true)}
                  className="w-full rounded-lg px-3 py-2 text-left text-sm text-[#f87171] transition-colors hover:bg-[#3a0a0a]"
                >
                  Delete Account
                </button>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
