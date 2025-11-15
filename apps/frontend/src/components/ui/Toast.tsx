'use client'

import { Toast as ToastType } from '@/contexts/ToastContext'
import { SuccessIcon, ErrorIcon, WarningIcon, InfoIcon, CloseIcon } from '../icons/Icons'

interface ToastProps {
  toast: ToastType
  onClose: (id: string) => void
}

export default function Toast({ toast, onClose }: ToastProps) {
  const getToastStyles = () => {
    switch (toast.type) {
      case 'success':
        return 'bg-green-50 border-green-200 text-green-800'
      case 'error':
        return 'bg-red-50 border-red-200 text-red-800'
      case 'warning':
        return 'bg-yellow-50 border-yellow-200 text-yellow-800'
      case 'info':
        return 'bg-blue-50 border-blue-200 text-blue-800'
      default:
        return 'bg-gray-50 border-gray-200 text-gray-800'
    }
  }

  const getIcon = () => {
    switch (toast.type) {
      case 'success':
        return <SuccessIcon className="w-5 h-5" />
      case 'error':
        return <ErrorIcon className="w-5 h-5" />
      case 'warning':
        return <WarningIcon className="w-5 h-5" />
      case 'info':
        return <InfoIcon className="w-5 h-5" />
    }
  }

  return (
    <div
      className={`flex items-center gap-3 px-4 py-3 rounded-lg border shadow-lg min-w-[300px] max-w-md slide-up ${getToastStyles()}`}
    >
      <div className="flex-shrink-0">{getIcon()}</div>
      <p className="flex-1 text-sm font-medium">{toast.message}</p>
      <button
        onClick={() => onClose(toast.id)}
        className="flex-shrink-0 text-gray-400 hover:text-gray-600 transition-colors"
        aria-label="Fechar"
      >
        <CloseIcon className="w-4 h-4" />
      </button>
    </div>
  )
}

