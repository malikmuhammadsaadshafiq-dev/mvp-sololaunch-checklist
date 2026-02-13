'use client'

import { useEffect } from 'react'
import { X, CheckCircle, AlertCircle, Info } from 'lucide-react'
import { cn } from '@/lib/utils'

interface ToastProps {
  id: string
  message: string
  type: 'success' | 'error' | 'info'
  onClose: () => void
}

export function Toast({ message, type, onClose }: ToastProps) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose()
    }, 3000)
    return () => clearTimeout(timer)
  }, [onClose])

  const icons = {
    success: <CheckCircle className="w-5 h-5 text-emerald-500" />,
    error: <AlertCircle className="w-5 h-5 text-rose-500" />,
    info: <Info className="w-5 h-5 text-amber-500" />,
  }

  const styles = {
    success: 'border-emerald-200 bg-emerald-50/90',
    error: 'border-rose-200 bg-rose-50/90',
    info: 'border-amber-200 bg-amber-50/90',
  }

  return (
    <div
      className={cn(
        'fixed bottom-4 right-4 z-50 flex items-center gap-3 px-4 py-3 rounded-xl shadow-lg backdrop-blur-sm border animate-slide-in-right',
        styles[type]
      )}
      role="alert"
    >
      {icons[type]}
      <p className="text-sm font-medium text-gray-800">{message}</p>
      <button
        onClick={onClose}
        className="ml-2 p-1 hover:bg-black/5 rounded-full transition-colors"
        aria-label="Close notification"
      >
        <X className="w-4 h-4 text-gray-500" />
      </button>
    </div>
  )
}