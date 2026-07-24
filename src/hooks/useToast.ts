import { useCallback, useState } from 'react'
import type { ToastType } from '../components/Toast'

export type ToastState = {
  message: string
  type: ToastType
} | null

export function useToast() {
  const [toast, setToast] = useState<ToastState>(null)

  const showToast = useCallback((message: string, type: ToastType) => {
    setToast({ message, type })
  }, [])

  const hideToast = useCallback(() => {
    setToast(null)
  }, [])

  return { toast, showToast, hideToast }
}
