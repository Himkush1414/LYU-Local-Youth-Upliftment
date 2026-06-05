'use client'

import { useEffect, useState } from 'react'
import { CheckCircle, AlertCircle, Info, XCircle, X } from 'lucide-react'
import { cn } from '@/lib/utils/cn'

type SnackbarType = 'success' | 'error' | 'info' | 'warning'

interface SnackbarProps {
  message: string
  type?: SnackbarType
  duration?: number
  onClose?: () => void
  action?: { label: string; onClick: () => void }
}

const config = {
  success: { icon: CheckCircle, bg: 'bg-slate-900', iconColor: 'text-emerald-400', border: 'border-emerald-900/30' },
  error:   { icon: XCircle,     bg: 'bg-slate-900', iconColor: 'text-red-400',     border: 'border-red-900/30' },
  info:    { icon: Info,         bg: 'bg-slate-900', iconColor: 'text-blue-400',    border: 'border-blue-900/30' },
  warning: { icon: AlertCircle,  bg: 'bg-slate-900', iconColor: 'text-amber-400',   border: 'border-amber-900/30' },
}

export function Snackbar({ message, type = 'info', duration = 4000, onClose, action }: SnackbarProps) {
  const [visible, setVisible] = useState(true)
  const { icon: Icon, bg, iconColor, border } = config[type]

  useEffect(() => {
    const t = setTimeout(() => { setVisible(false); onClose?.() }, duration)
    return () => clearTimeout(t)
  }, [duration, onClose])

  if (!visible) return null

  return (
    <div className={cn(
      'fixed bottom-6 left-1/2 -translate-x-1/2 z-50 flex items-center gap-3 px-5 py-3.5 rounded-2xl border shadow-2xl text-white min-w-64 max-w-sm transition-all',
      bg, border
    )}>
      <Icon className={cn('w-5 h-5 shrink-0', iconColor)} />
      <span className="text-sm font-medium flex-1">{message}</span>
      {action && (
        <button onClick={action.onClick} className="text-blue-400 text-sm font-bold hover:text-blue-300 transition-colors shrink-0">
          {action.label}
        </button>
      )}
      <button onClick={() => { setVisible(false); onClose?.() }} className="text-slate-400 hover:text-white transition-colors shrink-0">
        <X className="w-4 h-4" />
      </button>
    </div>
  )
}
