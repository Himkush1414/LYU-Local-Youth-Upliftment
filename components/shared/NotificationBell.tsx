'use client'

import { useState, useEffect, useCallback } from 'react'
import { Bell, X, CheckCheck } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { useRealtimeNotifications } from '@/hooks/useRealtimeNotifications'

interface Notification {
  id: string
  title: string
  body: string
  action_url: string
  is_read: boolean
  created_at: string
  type: string
}

export default function NotificationBell({ userId }: { userId: string }) {
  const [open, setOpen] = useState(false)
  const [notifications, setNotifications] = useState<Notification[]>([])
  const unread = notifications.filter(n => !n.is_read).length

  const fetchNotifications = useCallback(async () => {
    const supabase = createClient()
    const { data } = await supabase
      .from('notifications')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(10)
    if (data) setNotifications(data)
  }, [userId])

  useEffect(() => { fetchNotifications() }, [fetchNotifications])

  useRealtimeNotifications(userId, (n) => {
    setNotifications(prev => [n as Notification, ...prev.slice(0, 9)])
  })

  const markAllRead = async () => {
    const supabase = createClient()
    await supabase.from('notifications').update({ is_read: true }).eq('user_id', userId).eq('is_read', false)
    setNotifications(prev => prev.map(n => ({ ...n, is_read: true })))
  }

  const timeAgo = (date: string) => {
    const diff = Date.now() - new Date(date).getTime()
    const mins = Math.floor(diff / 60000)
    if (mins < 1) return 'just now'
    if (mins < 60) return `${mins}m ago`
    const hrs = Math.floor(mins / 60)
    if (hrs < 24) return `${hrs}h ago`
    return `${Math.floor(hrs / 24)}d ago`
  }

  return (
    <div style={{ position: 'relative' }}>
      <button onClick={() => setOpen(!open)} style={{
        position: 'relative', width: 38, height: 38, borderRadius: 10,
        background: open ? '#eff6ff' : 'transparent', border: '1px solid #e2e8f0',
        display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer',
      }}>
        <Bell style={{ width: 17, height: 17, color: '#374151' }} />
        {unread > 0 && (
          <span style={{
            position: 'absolute', top: -4, right: -4, width: 18, height: 18,
            background: '#ef4444', borderRadius: '50%', fontSize: 10, fontWeight: 800,
            color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center',
            border: '2px solid white',
          }}>{unread > 9 ? '9+' : unread}</span>
        )}
      </button>

      {open && (
        <div style={{
          position: 'absolute', top: 46, right: 0, width: 340, background: 'white',
          borderRadius: 16, border: '1px solid #e2e8f0', boxShadow: '0 16px 48px rgba(0,0,0,0.12)',
          zIndex: 200, overflow: 'hidden',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 16px', borderBottom: '1px solid #f1f5f9' }}>
            <span style={{ fontWeight: 800, fontSize: 15, color: '#0f172a' }}>Notifications</span>
            <div style={{ display: 'flex', gap: 8 }}>
              {unread > 0 && (
                <button onClick={markAllRead} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#2563eb', fontSize: 12, fontWeight: 600, display: 'flex', alignItems: 'center', gap: 4 }}>
                  <CheckCheck style={{ width: 14, height: 14 }} /> Mark all read
                </button>
              )}
              <button onClick={() => setOpen(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#94a3b8' }}>
                <X style={{ width: 16, height: 16 }} />
              </button>
            </div>
          </div>

          <div style={{ maxHeight: 380, overflowY: 'auto' }}>
            {notifications.length === 0 ? (
              <div style={{ padding: '32px 16px', textAlign: 'center' }}>
                <Bell style={{ width: 28, height: 28, color: '#cbd5e1', margin: '0 auto 8px' }} />
                <p style={{ color: '#94a3b8', fontSize: 13 }}>No notifications yet</p>
              </div>
            ) : notifications.map(n => (
              <a key={n.id} href={n.action_url || '#'} onClick={() => setOpen(false)} style={{
                display: 'block', padding: '12px 16px', textDecoration: 'none',
                background: n.is_read ? 'white' : '#f8faff',
                borderBottom: '1px solid #f8fafc', transition: 'background 0.15s',
              }}>
                <div style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
                  {!n.is_read && <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#2563eb', flexShrink: 0, marginTop: 5 }} />}
                  <div style={{ flex: 1, marginLeft: n.is_read ? 18 : 0 }}>
                    <p style={{ fontSize: 13, fontWeight: 700, color: '#0f172a', marginBottom: 2 }}>{n.title}</p>
                    <p style={{ fontSize: 12, color: '#64748b', lineHeight: 1.5 }}>{n.body}</p>
                    <p style={{ fontSize: 11, color: '#94a3b8', marginTop: 4 }}>{timeAgo(n.created_at)}</p>
                  </div>
                </div>
              </a>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
