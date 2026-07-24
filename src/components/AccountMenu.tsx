import { useEffect, useRef, useState, type FormEvent } from 'react'
import type { Session } from '@supabase/supabase-js'
import { Button } from '@heroui/react'
import { Eye, EyeOff } from 'lucide-react'
import { AnimatePresence, motion } from 'motion/react'
import type { ToastType } from './Toast'
import { supabase } from '../supabase'

type AccountMenuProps = {
  session: Session
  showToast: (message: string, type: ToastType) => void
  onLogout: () => void | Promise<void>
  onAccountDeleted: () => void
}

type MenuView = 'menu' | 'logout' | 'delete' | 'email' | 'password' | 'forgot'

const inputClassName =
  'w-full rounded-lg border border-[#3C096C] bg-[#10002B] px-3 py-2 pr-10 text-sm text-[#E0AAFF] placeholder-[#7B2CBF] outline-none focus:border-[#7B2CBF]'

const menuItemClassName =
  'w-full rounded-lg px-3 py-2 text-left text-sm text-[#C77DFF] transition-colors hover:bg-[#3C096C] hover:text-[#E0AAFF]'

const filledButtonClassName =
  'w-full rounded-lg border border-[#7B2CBF] bg-[#7B2CBF] text-sm text-[#E0AAFF] hover:bg-[#9D4EDD] data-[hovered=true]:bg-[#9D4EDD]'

export default function AccountMenu({
  session,
  showToast,
  onLogout,
  onAccountDeleted,
}: AccountMenuProps) {
  const [open, setOpen] = useState(false)
  const [view, setView] = useState<MenuView>('menu')
  const [deleting, setDeleting] = useState(false)
  const [loggingOut, setLoggingOut] = useState(false)
  const [updating, setUpdating] = useState(false)
  const [newEmail, setNewEmail] = useState('')
  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showCurrentPassword, setShowCurrentPassword] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const menuRef = useRef<HTMLDivElement>(null)
  const closeTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const email = session.user.email ?? ''
  const initial = (email.charAt(0) || '?').toUpperCase()

  useEffect(() => {
    return () => {
      if (closeTimeoutRef.current) clearTimeout(closeTimeoutRef.current)
    }
  }, [])

  useEffect(() => {
    if (!open) return

    function handlePointerDown(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        closeMenu()
      }
    }

    document.addEventListener('mousedown', handlePointerDown)
    return () => document.removeEventListener('mousedown', handlePointerDown)
  }, [open])

  function resetForms() {
    setNewEmail('')
    setCurrentPassword('')
    setNewPassword('')
    setConfirmPassword('')
    setShowCurrentPassword(false)
    setShowPassword(false)
    setShowConfirmPassword(false)
    setError('')
    setSuccess('')
    setUpdating(false)
  }

  function closeMenu() {
    if (closeTimeoutRef.current) {
      clearTimeout(closeTimeoutRef.current)
      closeTimeoutRef.current = null
    }
    setOpen(false)
    setView('menu')
    resetForms()
  }

  function goToMenu() {
    if (closeTimeoutRef.current) {
      clearTimeout(closeTimeoutRef.current)
      closeTimeoutRef.current = null
    }
    setView('menu')
    resetForms()
  }

  function openView(next: MenuView) {
    resetForms()
    setView(next)
  }

  function handleToggle() {
    if (open) {
      closeMenu()
      return
    }
    setOpen(true)
    setView('menu')
    resetForms()
  }

  async function handleConfirmLogout() {
    setLoggingOut(true)
    try {
      await onLogout()
      closeMenu()
    } finally {
      setLoggingOut(false)
    }
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
    closeMenu()
    onAccountDeleted()
  }

  async function handleUpdateEmail(e: FormEvent) {
    e.preventDefault()
    setUpdating(true)
    setError('')
    setSuccess('')

    const { error } = await supabase.auth.updateUser({ email: newEmail })

    if (error) {
      setError(error.message)
      setUpdating(false)
      return
    }

    setSuccess('Check your new email to confirm the change')
    setUpdating(false)
  }

  async function handleUpdatePassword(e: FormEvent) {
    e.preventDefault()
    setError('')
    setSuccess('')

    if (newPassword !== confirmPassword) {
      setError('Passwords do not match')
      return
    }

    if (!email) {
      setError('No email associated with this account')
      return
    }

    setUpdating(true)

    const { error: authError } = await supabase.auth.signInWithPassword({
      email,
      password: currentPassword,
    })

    if (authError) {
      setError('Current password is incorrect')
      setUpdating(false)
      return
    }

    const { error } = await supabase.auth.updateUser({ password: newPassword })

    if (error) {
      setError(error.message)
      setUpdating(false)
      return
    }

    setSuccess('Password updated successfully')
    setUpdating(false)

    closeTimeoutRef.current = setTimeout(() => {
      closeMenu()
    }, 2000)
  }

  async function handleForgotPassword(e: FormEvent) {
    e.preventDefault()
    setUpdating(true)
    setError('')
    setSuccess('')

    if (!email) {
      setError('No email associated with this account')
      setUpdating(false)
      return
    }

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: window.location.origin,
    })

    if (error) {
      setError(error.message)
      setUpdating(false)
      return
    }

    setSuccess('Check your email for a password reset link')
    setUpdating(false)
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
            className="absolute right-0 top-full z-50 mt-2 w-64 origin-top-right overflow-hidden rounded-xl border border-[#3C096C] bg-[#240046] p-3 shadow-lg"
          >
            <AnimatePresence mode="wait" initial={false}>
              <motion.div
                key={view}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ duration: 0.16, ease: 'easeOut' }}
              >
            {view === 'logout' ? (
              <div className="flex flex-col gap-3">
                <p className="text-xs leading-relaxed text-[#C77DFF]">
                  Are you sure you want to log out?
                </p>
                <Button
                  type="button"
                  size="sm"
                  onPress={handleConfirmLogout}
                  isDisabled={loggingOut}
                  className={filledButtonClassName}
                >
                  {loggingOut ? 'Logging out...' : 'Yes, log out'}
                </Button>
                <Button
                  type="button"
                  size="sm"
                  variant="outline"
                  onPress={goToMenu}
                  isDisabled={loggingOut}
                  className="w-full rounded-lg border border-[#3C096C] bg-transparent text-sm text-[#C77DFF] hover:bg-[#3C096C] data-[hovered=true]:bg-[#3C096C]"
                >
                  Cancel
                </Button>
              </div>
            ) : view === 'delete' ? (
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
                  onPress={goToMenu}
                  isDisabled={deleting}
                  className="w-full rounded-lg border border-[#3C096C] bg-transparent text-sm text-[#C77DFF] hover:bg-[#3C096C] data-[hovered=true]:bg-[#3C096C]"
                >
                  Cancel
                </Button>
              </div>
            ) : view === 'email' ? (
              <form onSubmit={handleUpdateEmail} className="flex flex-col gap-3">
                <p className="text-xs font-medium text-[#E0AAFF]">Change Email</p>
                <input
                  type="email"
                  placeholder="New email address"
                  value={newEmail}
                  onChange={e => setNewEmail(e.target.value)}
                  required
                  className={inputClassName.replace(' pr-10', '')}
                />
                <Button
                  type="submit"
                  size="sm"
                  isDisabled={updating}
                  className={filledButtonClassName}
                >
                  {updating ? 'Updating...' : 'Update Email'}
                </Button>
                {success && (
                  <p className="text-xs text-[#34d399]">{success}</p>
                )}
                {error && (
                  <p className="text-xs text-red-400">{error}</p>
                )}
                <button
                  type="button"
                  onClick={goToMenu}
                  disabled={updating}
                  className="self-start text-sm text-[#C77DFF] transition-colors hover:text-[#E0AAFF] disabled:opacity-50"
                >
                  Cancel
                </button>
              </form>
            ) : view === 'password' ? (
              <form onSubmit={handleUpdatePassword} className="flex flex-col gap-3">
                <p className="text-xs font-medium text-[#E0AAFF]">Change Password</p>

                <div className="flex flex-col gap-1.5">
                  <div className="relative">
                    <input
                      type={showCurrentPassword ? 'text' : 'password'}
                      placeholder="Current password"
                      value={currentPassword}
                      onChange={e => setCurrentPassword(e.target.value)}
                      required
                      className={inputClassName}
                    />
                    <Button
                      type="button"
                      isIconOnly
                      variant="ghost"
                      size="sm"
                      aria-label={showCurrentPassword ? 'Hide current password' : 'Show current password'}
                      onPress={() => setShowCurrentPassword(v => !v)}
                      className="absolute right-1 top-1/2 min-w-8 -translate-y-1/2 bg-transparent text-[#C77DFF] hover:text-[#E0AAFF]"
                    >
                      {showCurrentPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </Button>
                  </div>
                  <button
                    type="button"
                    onClick={() => openView('forgot')}
                    className="self-end text-xs text-[#C77DFF] no-underline transition-colors hover:text-[#E0AAFF] hover:underline"
                  >
                    Forgot password?
                  </button>
                </div>

                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    placeholder="New password"
                    value={newPassword}
                    onChange={e => setNewPassword(e.target.value)}
                    required
                    className={inputClassName}
                  />
                  <Button
                    type="button"
                    isIconOnly
                    variant="ghost"
                    size="sm"
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                    onPress={() => setShowPassword(v => !v)}
                    className="absolute right-1 top-1/2 min-w-8 -translate-y-1/2 bg-transparent text-[#C77DFF] hover:text-[#E0AAFF]"
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </Button>
                </div>

                <div className="relative">
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    placeholder="Confirm new password"
                    value={confirmPassword}
                    onChange={e => setConfirmPassword(e.target.value)}
                    required
                    className={inputClassName}
                  />
                  <Button
                    type="button"
                    isIconOnly
                    variant="ghost"
                    size="sm"
                    aria-label={showConfirmPassword ? 'Hide confirm password' : 'Show confirm password'}
                    onPress={() => setShowConfirmPassword(v => !v)}
                    className="absolute right-1 top-1/2 min-w-8 -translate-y-1/2 bg-transparent text-[#C77DFF] hover:text-[#E0AAFF]"
                  >
                    {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </Button>
                </div>

                <Button
                  type="submit"
                  size="sm"
                  isDisabled={updating}
                  className={filledButtonClassName}
                >
                  {updating ? 'Updating...' : 'Update Password'}
                </Button>
                {success && (
                  <p className="text-xs text-[#34d399]">{success}</p>
                )}
                {error && (
                  <p className="text-xs text-red-400">{error}</p>
                )}
                <button
                  type="button"
                  onClick={goToMenu}
                  disabled={updating}
                  className="self-start text-sm text-[#C77DFF] transition-colors hover:text-[#E0AAFF] disabled:opacity-50"
                >
                  Cancel
                </button>
              </form>
            ) : view === 'forgot' ? (
              <form onSubmit={handleForgotPassword} className="flex flex-col gap-3">
                <p className="text-xs font-medium text-[#E0AAFF]">Reset your password</p>
                <p className="text-xs leading-relaxed text-[#C77DFF]">
                  We&apos;ll send a reset link to{' '}
                  <span className="break-all text-[#E0AAFF]">{email}</span>
                </p>
                <Button
                  type="submit"
                  size="sm"
                  isDisabled={updating}
                  className={filledButtonClassName}
                >
                  {updating ? 'Sending...' : 'Send Reset Link'}
                </Button>
                {success && (
                  <p className="text-xs text-[#34d399]">{success}</p>
                )}
                {error && (
                  <p className="text-xs text-red-400">{error}</p>
                )}
                <button
                  type="button"
                  onClick={() => openView('password')}
                  disabled={updating}
                  className="self-start text-sm text-[#C77DFF] transition-colors hover:text-[#E0AAFF] disabled:opacity-50"
                >
                  Back
                </button>
              </form>
            ) : (
              <div className="flex flex-col gap-2">
                <p className="truncate px-1 text-xs text-[#C77DFF]" title={email}>
                  {email}
                </p>
                <button
                  type="button"
                  onClick={() => openView('email')}
                  className={menuItemClassName}
                >
                  Change Email
                </button>
                <button
                  type="button"
                  onClick={() => openView('password')}
                  className={menuItemClassName}
                >
                  Change Password
                </button>
                <div className="border-t border-[#3C096C]" />
                <button
                  type="button"
                  onClick={() => setView('logout')}
                  className="w-full rounded-lg px-3 py-2 text-left text-sm text-[#C77DFF] transition-colors hover:bg-[#3C096C] hover:text-[#E0AAFF]"
                >
                  Log Out
                </button>
                <button
                  type="button"
                  onClick={() => setView('delete')}
                  className="w-full rounded-lg px-3 py-2 text-left text-sm text-[#f87171] transition-colors hover:bg-[#3a0a0a]"
                >
                  Delete Account
                </button>
              </div>
            )}
              </motion.div>
            </AnimatePresence>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
