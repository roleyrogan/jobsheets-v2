import { useEffect } from 'react'
import { CloseButton } from '@heroui/react'
import { motion } from 'framer-motion'

export type ToastType = 'success' | 'error'

type ToastProps = {
  message: string
  type: ToastType
  onClose: () => void
}

const TOAST_STYLES: Record<
  ToastType,
  { bg: string; border: string; text: string; prefix: string }
> = {
  success: {
    bg: '#0a3a1a',
    border: '#34d399',
    text: '#34d399',
    prefix: '✓',
  },
  error: {
    bg: '#3a0a0a',
    border: '#f87171',
    text: '#f87171',
    prefix: '✕',
  },
}

export default function Toast({ message, type, onClose }: ToastProps) {
  const styles = TOAST_STYLES[type]

  useEffect(() => {
    const timer = window.setTimeout(onClose, 3000)
    return () => window.clearTimeout(timer)
  }, [onClose, message, type])

  return (
    <motion.div
      role="status"
      aria-live="polite"
      initial={{ opacity: 0, y: 16, x: 8 }}
      animate={{ opacity: 1, y: 0, x: 0 }}
      transition={{ duration: 0.25, ease: 'easeOut' }}
      className="fixed bottom-6 right-6 z-[100] flex max-w-sm items-center gap-3 rounded-xl px-4 py-3 shadow-lg"
      style={{
        backgroundColor: styles.bg,
        border: `1px solid ${styles.border}`,
        color: styles.text,
      }}
    >
      <span className="shrink-0 font-medium" aria-hidden="true">
        {styles.prefix}
      </span>
      <p className="flex-1 text-sm leading-snug">{message}</p>
      <CloseButton
        aria-label="Dismiss notification"
        onPress={onClose}
        className={`shrink-0 bg-transparent opacity-80 hover:opacity-100 data-[hovered=true]:opacity-100 ${
          type === 'success'
            ? 'hover:bg-[#34d399]/20 data-[hovered=true]:bg-[#34d399]/20'
            : 'hover:bg-[#f87171]/20 data-[hovered=true]:bg-[#f87171]/20'
        }`}
        style={{ color: styles.text }}
      />
    </motion.div>
  )
}
