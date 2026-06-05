'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { toast } from 'sonner'

export default function SettingsPage() {
  const [tab, setTab] = useState<'account' | 'notifications' | 'privacy'>('account')
  const [user, setUser] = useState<any>(null)
  const [profile, setProfile] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [form, setForm] = useState({ firstName: '', lastName: '', email: '', phone: '' })
  const [passwords, setPasswords] = useState({ current: '', newPass: '', confirm: '' })
  const [notifications, setNotifications] = useState({ email_jobs: true, email_messages: true, email_status: true, push_all: false })
  const supabase = createClient()

  useEffect(() => {
    async function load() {
      const { data: { user } } = await supabase.auth.getUser()
      setUser(user)
      if (user) {
        const { data } = await supabase.from('profiles').select('*').eq('user_id', user.id).single()
        if (data) {
          setProfile(data)
          const parts = (data.full_name || '').split(' ')
          setForm({
            firstName: parts[0] || '',
            lastName: parts.slice(1).join(' ') || '',
            email: user.email || '',
            phone: data.phone || '',
          })
        } else {
          const name = user.user_metadata?.full_name || user.email?.split('@')[0] || ''
          const parts = name.split(' ')
          setForm({ firstName: parts[0] || '', lastName: parts.slice(1).join(' ') || '', email: user.email || '', phone: '' })
        }
      }
      setLoading(false)
    }
    load()
  }, [])

  const saveProfile = async () => {
    if (!user) return
    setSaving(true)
    try {
      await supabase.from('profiles').upsert({
        user_id: user.id,
        full_name: `${form.firstName} ${form.lastName}`.trim(),
        phone: form.phone,
      })
      toast.success('Profile updated successfully!')
    } catch {
      toast.error('Failed to save changes')
    } finally {
      setSaving(false)
    }
  }

  const updatePassword = async () => {
    if (passwords.newPass !== passwords.confirm) { toast.error('Passwords do not match'); return }
    if (passwords.newPass.length < 8) { toast.error('Password must be at least 8 characters'); return }
    setSaving(true)
    try {
      const { error } = await supabase.auth.updateUser({ password: passwords.newPass })
      if (error) throw error
      toast.success('Password updated successfully!')
      setPasswords({ current: '', newPass: '', confirm: '' })
    } catch (e: any) {
      toast.error(e.message || 'Failed to update password')
    } finally {
      setSaving(false)
    }
  }

  const deleteAccount = async () => {
    if (!confirm('This will permanently delete your account and all data. This cannot be undone.')) return
    toast.error('Please contact support@lyu.in to delete your account.')
  }

  const inputStyle = (focus?: boolean) => ({
    width: '100%', padding: '11px 14px', borderRadius: 11, border: '1.5px solid #e2e8f0',
    fontSize: 14, color: '#0f172a', background: 'white', fontFamily: 'inherit', outline: 'none',
    boxSizing: 'border-box' as const, transition: 'border-color 0.15s',
  })

  const tabStyle = (active: boolean) => ({
    padding: '10px 20px', borderRadius: 9, fontSize: 13, fontWeight: active ? 700 : 500,
    cursor: 'pointer', border: 'none', fontFamily: 'inherit', transition: 'all 0.15s',
    background: active ? 'white' : 'transparent', color: active ? '#0f172a' : '#64748b',
    boxShadow: active ? '0 1px 3px rgba(0,0,0,0.08)' : 'none',
  })

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24, maxWidth: 680, fontFamily: 'Inter, system-ui, sans-serif', paddingBottom: 40 }}>
      <div>
        <h1 style={{ fontSize: 22, fontWeight: 900, color: '#0f172a', letterSpacing: '-0.02em' }}>Settings</h1>
        <p style={{ fontSize: 13, color: '#64748b', marginTop: 4 }}>Manage your account and preferences</p>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: 2, background: '#f1f5f9', borderRadius: 12, padding: 4, width: 'fit-content' }}>
        {(['account', 'notifications', 'privacy'] as const).map(t => (
          <button key={t} onClick={() => setTab(t)} style={tabStyle(tab === t)}>
            {t.charAt(0).toUpperCase() + t.slice(1)}
          </button>
        ))}
      </div>

      {tab === 'account' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>

          {/* Account info */}
          <div style={{ background: 'white', borderRadius: 16, border: '1px solid #e2e8f0', padding: '24px', boxShadow: '0 1px 3px rgba(0,0,0,0.04)' }}>
            <h2 style={{ fontWeight: 800, color: '#0f172a', fontSize: 15, marginBottom: 20 }}>Account Information</h2>

            {loading ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                {[...Array(4)].map((_, i) => (
                  <div key={i} style={{ height: 44, borderRadius: 11, background: 'linear-gradient(90deg,#f1f5f9 25%,#e8edf2 50%,#f1f5f9 75%)', backgroundSize: '200% 100%', animation: 'shimmer 1.5s infinite' }} />
                ))}
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }} className="settings-grid">
                  <div>
                    <label style={{ display: 'block', fontSize: 11, fontWeight: 700, color: '#374151', textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: 7 }}>First Name</label>
                    <input value={form.firstName} onChange={e => setForm(f => ({ ...f, firstName: e.target.value }))} placeholder="Your first name"
                      style={inputStyle()} onFocus={e => e.target.style.borderColor = '#2563eb'} onBlur={e => e.target.style.borderColor = '#e2e8f0'} />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: 11, fontWeight: 700, color: '#374151', textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: 7 }}>Last Name</label>
                    <input value={form.lastName} onChange={e => setForm(f => ({ ...f, lastName: e.target.value }))} placeholder="Your last name"
                      style={inputStyle()} onFocus={e => e.target.style.borderColor = '#2563eb'} onBlur={e => e.target.style.borderColor = '#e2e8f0'} />
                  </div>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: 11, fontWeight: 700, color: '#374151', textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: 7 }}>Email Address</label>
                  <div style={{ position: 'relative' }}>
                    <input value={form.email} disabled placeholder="Email"
                      style={{ ...inputStyle(), background: '#f8fafc', color: '#94a3b8', paddingRight: 90 }} />
                    {user?.email_confirmed_at && (
                      <span style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', display: 'flex', alignItems: 'center', gap: 4, fontSize: 11, fontWeight: 700, color: '#16a34a', background: '#f0fdf4', padding: '3px 9px', borderRadius: 9999, border: '1px solid #bbf7d0' }}>
                        <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                        Verified
                      </span>
                    )}
                  </div>
                  <p style={{ fontSize: 11, color: '#94a3b8', marginTop: 5 }}>Email cannot be changed here. Contact support if needed.</p>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: 11, fontWeight: 700, color: '#374151', textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: 7 }}>Phone Number</label>
                  <input type="tel" value={form.phone} onChange={e => setForm(f => ({ ...f, phone: e.target.value }))} placeholder="+91 XXXXX XXXXX"
                    style={inputStyle()} onFocus={e => e.target.style.borderColor = '#2563eb'} onBlur={e => e.target.style.borderColor = '#e2e8f0'} />
                </div>

                <button onClick={saveProfile} disabled={saving} style={{ display: 'inline-flex', alignItems: 'center', gap: 7, background: saving ? '#93c5fd' : '#2563eb', color: 'white', border: 'none', borderRadius: 11, padding: '11px 22px', fontWeight: 700, fontSize: 14, cursor: saving ? 'not-allowed' : 'pointer', fontFamily: 'inherit', alignSelf: 'flex-start', transition: 'all 0.15s' }}>
                  {saving ? (
                    <><svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ animation: 'spin 1s linear infinite' }}><line x1="12" y1="2" x2="12" y2="6"/><line x1="12" y1="18" x2="12" y2="22"/><line x1="4.93" y1="4.93" x2="7.76" y2="7.76"/><line x1="16.24" y1="16.24" x2="19.07" y2="19.07"/><line x1="2" y1="12" x2="6" y2="12"/><line x1="18" y1="12" x2="22" y2="12"/><line x1="4.93" y1="19.07" x2="7.76" y2="16.24"/><line x1="16.24" y1="7.76" x2="19.07" y2="4.93"/></svg> Saving...</>
                  ) : (
                    <><svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg> Save Changes</>
                  )}
                </button>
              </div>
            )}
          </div>

          {/* Change password */}
          <div style={{ background: 'white', borderRadius: 16, border: '1px solid #e2e8f0', padding: '24px', boxShadow: '0 1px 3px rgba(0,0,0,0.04)' }}>
            <h2 style={{ fontWeight: 800, color: '#0f172a', fontSize: 15, marginBottom: 20 }}>Change Password</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              {[
                { label: 'New Password', key: 'newPass', placeholder: 'Min. 8 characters' },
                { label: 'Confirm New Password', key: 'confirm', placeholder: 'Repeat new password' },
              ].map(field => (
                <div key={field.key}>
                  <label style={{ display: 'block', fontSize: 11, fontWeight: 700, color: '#374151', textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: 7 }}>{field.label}</label>
                  <input type="password" value={passwords[field.key as keyof typeof passwords]} onChange={e => setPasswords(p => ({ ...p, [field.key]: e.target.value }))} placeholder={field.placeholder}
                    style={inputStyle()} onFocus={e => e.target.style.borderColor = '#2563eb'} onBlur={e => e.target.style.borderColor = '#e2e8f0'} />
                </div>
              ))}
              <button onClick={updatePassword} disabled={saving || !passwords.newPass} style={{ display: 'inline-flex', alignItems: 'center', gap: 7, background: (!passwords.newPass || saving) ? '#e2e8f0' : '#0f172a', color: (!passwords.newPass || saving) ? '#94a3b8' : 'white', border: 'none', borderRadius: 11, padding: '11px 22px', fontWeight: 700, fontSize: 14, cursor: (!passwords.newPass || saving) ? 'not-allowed' : 'pointer', fontFamily: 'inherit', alignSelf: 'flex-start', transition: 'all 0.15s' }}>
                Update Password
              </button>
            </div>
          </div>

          {/* Danger zone */}
          <div style={{ background: '#fef2f2', borderRadius: 16, border: '1px solid #fecaca', padding: '20px 24px' }}>
            <h2 style={{ fontWeight: 800, color: '#b91c1c', fontSize: 14, marginBottom: 6, display: 'flex', alignItems: 'center', gap: 7 }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
              Danger Zone
            </h2>
            <p style={{ fontSize: 13, color: '#dc2626', marginBottom: 14 }}>Deleting your account is permanent and cannot be undone.</p>
            <button onClick={deleteAccount} style={{ display: 'inline-flex', alignItems: 'center', gap: 7, background: 'white', color: '#dc2626', border: '1.5px solid #fca5a5', borderRadius: 10, padding: '9px 18px', fontWeight: 700, fontSize: 13, cursor: 'pointer', fontFamily: 'inherit' }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/></svg>
              Delete My Account
            </button>
          </div>
        </div>
      )}

      {tab === 'notifications' && (
        <div style={{ background: 'white', borderRadius: 16, border: '1px solid #e2e8f0', padding: '24px', boxShadow: '0 1px 3px rgba(0,0,0,0.04)' }}>
          <h2 style={{ fontWeight: 800, color: '#0f172a', fontSize: 15, marginBottom: 20 }}>Notification Preferences</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
            {[
              { key: 'email_jobs', label: 'New job matches', desc: 'Get emailed when new jobs match your skills', section: 'Email' },
              { key: 'email_messages', label: 'New messages', desc: 'Get emailed when an employer messages you' },
              { key: 'email_status', label: 'Application updates', desc: 'Get emailed when your application status changes' },
              { key: 'push_all', label: 'Push notifications', desc: 'Browser notifications for all activity', section: 'Browser' },
            ].map((item, i, arr) => (
              <div key={item.key}>
                {item.section && (
                  <p style={{ fontSize: 11, fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.07em', marginTop: i > 0 ? 20 : 0, marginBottom: 12 }}>{item.section}</p>
                )}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 0', borderBottom: i < arr.length - 1 ? '1px solid #f8fafc' : 'none' }}>
                  <div>
                    <p style={{ fontWeight: 600, color: '#0f172a', fontSize: 14 }}>{item.label}</p>
                    <p style={{ fontSize: 12, color: '#94a3b8', marginTop: 2 }}>{item.desc}</p>
                  </div>
                  <div onClick={() => setNotifications(n => ({ ...n, [item.key]: !n[item.key as keyof typeof n] }))}
                    style={{ width: 44, height: 24, borderRadius: 12, background: notifications[item.key as keyof typeof notifications] ? '#22c55e' : '#e2e8f0', position: 'relative', cursor: 'pointer', transition: 'background 0.2s', flexShrink: 0 }}>
                    <div style={{ position: 'absolute', top: 3, left: notifications[item.key as keyof typeof notifications] ? 22 : 3, width: 18, height: 18, background: 'white', borderRadius: '50%', boxShadow: '0 1px 3px rgba(0,0,0,0.2)', transition: 'left 0.2s' }} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {tab === 'privacy' && (
        <div style={{ background: 'white', borderRadius: 16, border: '1px solid #e2e8f0', padding: '24px', boxShadow: '0 1px 3px rgba(0,0,0,0.04)' }}>
          <h2 style={{ fontWeight: 800, color: '#0f172a', fontSize: 15, marginBottom: 8 }}>Privacy Settings</h2>
          <p style={{ fontSize: 13, color: '#64748b', marginBottom: 24, lineHeight: 1.6 }}>Control who can see your profile and how your data is used.</p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {[
              { label: 'Profile visibility', desc: 'Who can see your profile', options: ['Public', 'Employers only', 'Private'] },
              { label: 'Contact visibility', desc: 'Who can message you', options: ['All employers', 'Verified only', 'Nobody'] },
            ].map(item => (
              <div key={item.label} style={{ padding: '16px', background: '#f8fafc', borderRadius: 12, border: '1px solid #f1f5f9' }}>
                <p style={{ fontWeight: 700, color: '#0f172a', fontSize: 14, marginBottom: 4 }}>{item.label}</p>
                <p style={{ fontSize: 12, color: '#64748b', marginBottom: 12 }}>{item.desc}</p>
                <div style={{ display: 'flex', gap: 7, flexWrap: 'wrap' }}>
                  {item.options.map((opt, i) => (
                    <button key={opt} style={{ padding: '6px 14px', borderRadius: 9999, fontSize: 12, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit', border: 'none', background: i === 1 ? '#2563eb' : '#e2e8f0', color: i === 1 ? 'white' : '#475569' }}>{opt}</button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <style>{`
        @keyframes shimmer { 0%{background-position:-200% 0} 100%{background-position:200% 0} }
        @keyframes spin { from{transform:rotate(0deg)} to{transform:rotate(360deg)} }
        @media(max-width:640px) { .settings-grid { grid-template-columns: 1fr !important; } }
      `}</style>
    </div>
  )
}
