'use client'

import { useState } from 'react'
import { Bell, CheckCheck, Briefcase, MessageSquare, Star, Info } from 'lucide-react'
import { toast } from 'sonner'
import { timeAgo } from '@/lib/utils/format'

const initialNotifications = [
  { id: '1', type: 'application_update', title: 'Application Viewed', body: 'TechCorp viewed your application for React Developer.', action_url: '/seeker/applications', is_read: false, created_at: new Date(Date.now() - 3600000).toISOString() },
  { id: '2', type: 'new_message', title: 'New Message', body: 'InfoSys Recruiter sent you a message about Data Entry position.', action_url: '/seeker/messages', is_read: false, created_at: new Date(Date.now() - 7200000).toISOString() },
  { id: '3', type: 'job_alert', title: 'New Jobs in Chandigarh', body: '5 new React Developer jobs posted near you today.', action_url: '/seeker/jobs', is_read: false, created_at: new Date(Date.now() - 86400000).toISOString() },
  { id: '4', type: 'application_update', title: 'You were Shortlisted!', body: 'Congratulations! RetailMax shortlisted you for Sales Executive.', action_url: '/seeker/applications', is_read: true, created_at: new Date(Date.now() - 172800000).toISOString() },
  { id: '5', type: 'system', title: 'Complete Your Profile', body: 'Add your work experience to get 3x more interview calls.', action_url: '/seeker/profile', is_read: true, created_at: new Date(Date.now() - 259200000).toISOString() },
]

const iconMap: Record<string, any> = {
  application_update: Briefcase,
  new_message: MessageSquare,
  job_alert: Star,
  system: Info,
}

const colorMap: Record<string, string> = {
  application_update: 'bg-blue-50 text-blue-600',
  new_message: 'bg-violet-50 text-violet-600',
  job_alert: 'bg-amber-50 text-amber-600',
  system: 'bg-slate-50 text-slate-600',
}

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState(initialNotifications)

  const markAllRead = () => {
    setNotifications(n => n.map(item => ({ ...item, is_read: true })))
    toast.success('All notifications marked as read')
  }

  const markRead = (id: string) => {
    setNotifications(n => n.map(item => item.id === id ? { ...item, is_read: true } : item))
  }

  const unread = notifications.filter(n => !n.is_read).length

  return (
    <div className="space-y-6 pb-24 lg:pb-0 max-w-2xl">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black text-slate-900">Notifications</h1>
          <p className="text-slate-500 mt-1">{unread > 0 ? `${unread} unread` : 'All caught up!'}</p>
        </div>
        {unread > 0 && (
          <button onClick={markAllRead} className="flex items-center gap-2 text-sm text-blue-600 font-semibold hover:underline">
            <CheckCheck className="w-4 h-4" /> Mark all read
          </button>
        )}
      </div>

      <div className="space-y-2">
        {notifications.map(notif => {
          const Icon = iconMap[notif.type] || Bell
          const color = colorMap[notif.type] || 'bg-slate-50 text-slate-600'
          return (
            <div key={notif.id} onClick={() => markRead(notif.id)}
              className={`bg-white rounded-2xl border p-4 flex items-start gap-4 cursor-pointer hover:border-blue-100 transition-all ${!notif.is_read ? 'border-blue-200 shadow-sm' : 'border-slate-100'}`}>
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${color}`}>
                <Icon className="w-5 h-5" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2">
                  <p className={`text-sm font-bold ${notif.is_read ? 'text-slate-700' : 'text-slate-900'}`}>{notif.title}</p>
                  {!notif.is_read && <span className="w-2 h-2 bg-blue-600 rounded-full shrink-0 mt-1.5" />}
                </div>
                <p className="text-xs text-slate-500 mt-0.5 leading-relaxed">{notif.body}</p>
                <p className="text-xs text-slate-400 mt-1.5">{timeAgo(notif.created_at)}</p>
              </div>
            </div>
          )
        })}
      </div>

      {notifications.length === 0 && (
        <div className="text-center py-16 bg-white rounded-2xl border border-slate-100">
          <div className="w-16 h-16 bg-slate-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Bell className="w-8 h-8 text-slate-300" />
          </div>
          <p className="font-bold text-slate-900 mb-1">No notifications yet</p>
          <p className="text-sm text-slate-500">We'll notify you about applications, messages, and job alerts</p>
        </div>
      )}
    </div>
  )
}
