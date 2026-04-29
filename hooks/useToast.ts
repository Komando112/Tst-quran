'use client'

import { useCallback, useRef } from 'react'
import { generateId } from '@/lib/utils'
import { Toast } from '@/types/quran'

const listeners = new Set<(toast: Toast) => void>()

export function useToast() {
  const timeoutRef = useRef<NodeJS.Timeout>()

  const show = useCallback((message: string, type: 'success' | 'error' | 'info' = 'info', duration = 3000) => {
    const id = generateId()
    const toast: Toast = { id, message, type, duration }

    listeners.forEach((listener) => listener(toast))

    if (duration > 0) {
      timeoutRef.current = setTimeout(() => {
        dismiss(id)
      }, duration)
    }

    return id
  }, [])

  const success = useCallback((message: string, duration?: number) => {
    return show(message, 'success', duration)
  }, [show])

  const error = useCallback((message: string, duration?: number) => {
    return show(message, 'error', duration)
  }, [show])

  const info = useCallback((message: string, duration?: number) => {
    return show(message, 'info', duration)
  }, [show])

  return { show, success, error, info }
}

export function dismiss(id: string) {
  listeners.forEach((listener) => listener({ id, message: '', type: 'info' }))
}

export function onToast(listener: (toast: Toast) => void) {
  listeners.add(listener)
  return () => listeners.delete(listener)
}
