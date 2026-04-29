'use client'

import React, { useEffect, useState } from 'react'
import { Toast } from '@/types/quran'
import { cn } from '@/lib/utils'
import { onToast, dismiss } from '@/hooks/useToast'

interface ToastItemProps {
  toast: Toast
  onDismiss: (id: string) => void
}

function ToastItem({ toast, onDismiss }: ToastItemProps) {
  const styles = {
    success: 'bg-success text-white',
    error: 'bg-error text-white',
    info: 'bg-primary text-white',
  }

  const icons = {
    success: '✓',
    error: '✕',
    info: 'ℹ',
  }

  return (
    <div
      className={cn(
        'flex items-center gap-3 rounded-lg px-4 py-3 shadow-lg animate-slide-up',
        styles[toast.type]
      )}
    >
      <span className="text-lg">{icons[toast.type]}</span>
      <span className="flex-1">{toast.message}</span>
      <button
        onClick={() => onDismiss(toast.id)}
        className="opacity-70 hover:opacity-100 transition-opacity"
        aria-label="Dismiss toast"
      >
        ×
      </button>
    </div>
  )
}

export function ToastContainer() {
  const [toasts, setToasts] = useState<Toast[]>([])

  useEffect(() => {
    const unsubscribe = onToast((toast) => {
      if (toast.message) {
        setToasts((prev) => [...prev.filter((t) => t.id !== toast.id), toast])
      } else {
        setToasts((prev) => prev.filter((t) => t.id !== toast.id))
      }
    })

    return unsubscribe
  }, [])

  return (
    <div className="fixed bottom-32 right-4 z-50 flex flex-col gap-2 max-w-sm md:max-w-md">
      {toasts.map((toast) => (
        <ToastItem
          key={toast.id}
          toast={toast}
          onDismiss={() => dismiss(toast.id)}
        />
      ))}
    </div>
  )
}
