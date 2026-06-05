'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

export default function NavbarAuthSection() {
  const [user, setUser] = useState<any>(null)
  const [profile, setProfile] = useState<any>(null)
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(true)
  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    async function load() {
      const { data: { user } } = await supabase.auth.getUser()
      setUser(user)
      if (user) {
        const { data } = await supabase.from('profiles').select('full_name,avatar_url').eq('user_id', user.id).single()
        setProfile(data)
      }
      setLoading(false)
    }
    load()
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_e, session) => {
      setUser(session?.user ?? null)
      if (!session?.user) setProfile(null)
      setLoading(false)
    })
    return () => subscription.unsubscribe()
  }, [])

  const logout = async () => {
    await supabase.auth.signOut()
    setUser(null); setProfile(null); setOpen(false)
    router.push('/'); router.refresh()
  }

  const name = profile?.full_name || user?.user_metadata?.full_name || user?.email?.split('@')[0] || ''
  const initials = name ? name.split(' ').map((n: string) => n[0]).join('').toUpperCase().slice(0, 2) : 'U'
  const role = user?.user_metadata?.role || 'seeker'
  const dashHref = role === 'employer' ? '/employer/dashboard' : '/seeker/dashboard'

  if (loading) return <div style={{ width: 120, height: 36 }} />

  if (!user) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        <Link href="/auth/login" style={{ fontSize: 14, fontWeight: 600, color: '#374151', padding: '8px 14px', borderRadius: 10, textDecoration: 'none' }}>Sign In</Link>
        <Link href="/auth/register" style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 14, fontWeight: 700, color: 'white', padding: '9px 18px', borderRadius: 12, background: 'linear-gradient(135deg,#2563eb,#1d4ed8)', textDecoration: 'none', boxShadow: '0 4px 12px rgba(37,99,235,0.3)' }}>
          Get Started
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
        </Link>
      </div>
    )
  }

  return (
    <div style={{ position: 'relative' }}>
      <button onClick={() => setOpen(!open)} style={{ display: 'flex', alignItems: 'center', gap: 8, background: 'white', border: '1.5px solid #e2e8f0', borderRadius: 12, padding: '5px 10px 5px 5px', cursor: 'pointer', fontFamily: 'inherit' }}>
        <div style={{ width: 28, height: 28, borderRadius: '50%', background: 'linear-gradient(135deg,#2563eb,#4f46e5)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 800, fontSize: 10, overflow: 'hidden' }}>
          {profile?.avatar_url ? <img src={profile.avatar_url} alt={name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : initials}
        </div>
        <span style={{ fontSize: 13, fontWeight: 600, color: '#0f172a', maxWidth: 90, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{name || 'Account'}</span>
        <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9"/></svg>
      </button>

      {open && (
        <>
          <div style={{ position: 'fixed', inset: 0, zIndex: 40 }} onClick={() => setOpen(false)} />
          <div style={{ position: 'absolute', top: 'calc(100% + 8px)', right: 0, background: 'white', borderRadius: 16, border: '1px solid #e2e8f0', boxShadow: '0 16px 40px rgba(0,0,0,0.12)', minWidth: 220, zIndex: 50, overflow: 'hidden' }}>
            <div style={{ padding: '14px 16px', borderBottom: '1px solid #f1f5f9' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6 }}>
                <div style={{ width: 36, height: 36, borderRadius: '50%', background: 'linear-gradient(135deg,#2563eb,#4f46e5)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 800, fontSize: 12, overflow: 'hidden' }}>
                  {initials}
                </div>
                <div>
                  <p style={{ fontWeight: 800, color: '#0f172a', fontSize: 14 }}>{name}</p>
                  <p style={{ color: '#94a3b8', fontSize: 11 }}>{user.email}</p>
                </div>
              </div>
              <span style={{ fontSize: 10, fontWeight: 700, color: '#2563eb', background: '#eff6ff', padding: '2px 10px', borderRadius: 9999, border: '1px solid #bfdbfe', textTransform: 'capitalize' }}>{role === 'employer' ? 'Employer' : 'Job Seeker'}</span>
            </div>
            <div style={{ padding: '6px' }}>
              {[
                { label: 'Dashboard', href: dashHref },
                { label: role === 'employer' ? 'My Jobs' : 'My Applications', href: role === 'employer' ? '/employer/jobs' : '/seeker/applications' },
                { label: 'Settings', href: role === 'employer' ? '/employer/settings' : '/seeker/settings' },
              ].map(item => (
                <Link key={item.label} href={item.href} onClick={() => setOpen(false)}
                  style={{ display: 'flex', alignItems: 'center', padding: '9px 12px', borderRadius: 10, textDecoration: 'none', color: '#374151', fontSize: 13, fontWeight: 600 }}
                  onMouseEnter={e => e.currentTarget.style.background = '#f8fafc'}
                  onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                  {item.label}
                </Link>
              ))}
            </div>
            <div style={{ borderTop: '1px solid #f1f5f9', padding: '6px' }}>
              <button onClick={logout} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '9px 12px', borderRadius: 10, background: 'none', border: 'none', color: '#ef4444', fontSize: 13, fontWeight: 600, cursor: 'pointer', width: '100%', fontFamily: 'inherit' }}
                onMouseEnter={e => e.currentTarget.style.background = '#fef2f2'}
                onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
                Sign Out
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  )
}
