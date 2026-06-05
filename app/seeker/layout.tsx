'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'

const NAV_ITEMS = [
  { label: 'Dashboard', href: '/seeker/dashboard', icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg> },
  { label: 'Browse Jobs', href: '/seeker/jobs', icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg> },
  { label: 'Applications', href: '/seeker/applications', icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg> },
  { label: 'Saved Jobs', href: '/seeker/jobs/saved', icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/></svg> },
  { label: 'For You', href: '/seeker/recommendations', icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg> },
  { label: 'Learning', href: '/seeker/learning', icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/></svg> },
  { label: 'Messages', href: '/seeker/messages', icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg> },
  { label: 'Career AI', href: '/seeker/chat', icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3"/><path d="M19.07 4.93a10 10 0 0 1 0 14.14M4.93 4.93a10 10 0 0 0 0 14.14"/></svg> },
]

const ACCOUNT_ITEMS = [
  { label: 'Profile', href: '/seeker/profile', icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg> },
  { label: 'Location', href: '/seeker/location', icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg> },
  { label: 'Settings', href: '/seeker/settings', icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3"/><path d="M19.07 4.93a10 10 0 0 1 0 14.14M4.93 4.93a10 10 0 0 0 0 14.14"/></svg> },
]

const MOBILE_BOTTOM = [
  { label: 'Home', href: '/seeker/dashboard', icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg> },
  { label: 'Jobs', href: '/seeker/jobs', icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg> },
  { label: 'Applied', href: '/seeker/applications', icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg> },
  { label: 'Messages', href: '/seeker/messages', icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg> },
  { label: 'Profile', href: '/seeker/profile', icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg> },
]

export default function SeekerLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const router = useRouter()
  const supabase = createClient()
  const [user, setUser] = useState<any>(null)
  const [profile, setProfile] = useState<any>(null)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [profileOpen, setProfileOpen] = useState(false)
  const [notifOpen, setNotifOpen] = useState(false)
  const [searchVal, setSearchVal] = useState('')

  useEffect(() => {
    async function load() {
      const { data: { user } } = await supabase.auth.getUser()
      setUser(user)
      if (user) {
        const { data } = await supabase.from('profiles').select('full_name,avatar_url,profile_completion').eq('user_id', user.id).single()
        setProfile(data)
      }
    }
    load()
  }, [])

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/')
  }

  const name = profile?.full_name || user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'You'
  const firstName = name.split(' ')[0]
  const initials = name.split(' ').map((n: string) => n[0]).join('').toUpperCase().slice(0, 2)

  const NavLink = ({ item }: { item: typeof NAV_ITEMS[0] }) => {
    const active = pathname === item.href || (item.href !== '/seeker/dashboard' && pathname.startsWith(item.href))
    return (
      <Link href={item.href} onClick={() => setMobileOpen(false)}
        style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '8px 12px', borderRadius: 10, textDecoration: 'none', fontSize: 13, fontWeight: active ? 700 : 500, color: active ? '#2563eb' : '#475569', background: active ? '#eff6ff' : 'transparent', transition: 'all 0.15s' }}
        onMouseEnter={e => { if (!active) e.currentTarget.style.background = '#f8fafc' }}
        onMouseLeave={e => { if (!active) e.currentTarget.style.background = 'transparent' }}>
        <span style={{ color: active ? '#2563eb' : '#94a3b8', display: 'flex', flexShrink: 0 }}>{item.icon}</span>
        {item.label}
      </Link>
    )
  }

  const SidebarInner = () => (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      {/* Logo */}
      <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: 9, padding: '16px 16px 14px', textDecoration: 'none', borderBottom: '1px solid #f1f5f9', marginBottom: 8 }}>
        <div style={{ width: 30, height: 30, borderRadius: 8, background: 'linear-gradient(135deg,#2563eb,#4f46e5)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 0 12px rgba(37,99,235,0.25)' }}>
          <span style={{ color: 'white', fontWeight: 900, fontSize: 10 }}>LY</span>
        </div>
        <span style={{ fontWeight: 900, fontSize: 15, color: '#0f172a', letterSpacing: '-0.01em' }}>LYU</span>
        <span style={{ fontSize: 10, fontWeight: 700, color: '#2563eb', background: '#eff6ff', padding: '2px 8px', borderRadius: 9999, border: '1px solid #bfdbfe', marginLeft: 2 }}>Seeker</span>
      </Link>

      {/* Main nav */}
      <nav style={{ flex: 1, padding: '4px 8px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 2 }}>
        {NAV_ITEMS.map(item => <NavLink key={item.href} item={item} />)}

        <div style={{ height: 1, background: '#f1f5f9', margin: '10px 4px' }} />
        <p style={{ fontSize: 10, fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.07em', padding: '4px 12px' }}>Account</p>
        {ACCOUNT_ITEMS.map(item => <NavLink key={item.href} item={item} />)}
      </nav>

      {/* User + logout */}
      <div style={{ padding: '12px 8px 8px', borderTop: '1px solid #f1f5f9' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '8px 12px', marginBottom: 4 }}>
          <div style={{ width: 32, height: 32, borderRadius: '50%', background: 'linear-gradient(135deg,#2563eb,#4f46e5)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 800, fontSize: 11, flexShrink: 0, overflow: 'hidden' }}>
            {profile?.avatar_url ? <img src={profile.avatar_url} alt={name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : initials}
          </div>
          <div style={{ minWidth: 0 }}>
            <p style={{ fontWeight: 700, color: '#0f172a', fontSize: 13, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{name}</p>
            <p style={{ fontSize: 11, color: '#94a3b8', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{user?.email}</p>
          </div>
        </div>
        <button onClick={handleLogout} style={{ display: 'flex', alignItems: 'center', gap: 9, padding: '8px 12px', borderRadius: 10, background: 'none', border: 'none', color: '#ef4444', fontSize: 13, fontWeight: 600, cursor: 'pointer', width: '100%', fontFamily: 'inherit', transition: 'background 0.15s' }}
          onMouseEnter={e => e.currentTarget.style.background = '#fef2f2'}
          onMouseLeave={e => e.currentTarget.style.background = 'none'}>
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
          Sign Out
        </button>
      </div>
    </div>
  )

  return (
    <div style={{ minHeight: '100vh', background: '#f8fafc', fontFamily: 'Inter, system-ui, sans-serif', display: 'flex' }}>

      {/* Desktop sidebar */}
      <aside style={{ width: 228, flexShrink: 0, position: 'fixed', top: 0, left: 0, bottom: 0, background: 'white', borderRight: '1px solid #f1f5f9', zIndex: 40, overflowY: 'auto', display: 'flex', flexDirection: 'column' }} className="lyu-sidebar">
        <SidebarInner />
      </aside>

      {/* Mobile sidebar overlay */}
      {mobileOpen && (
        <>
          <div onClick={() => setMobileOpen(false)} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.45)', zIndex: 50, backdropFilter: 'blur(2px)' }} />
          <aside style={{ position: 'fixed', top: 0, left: 0, bottom: 0, width: 256, background: 'white', zIndex: 51, overflowY: 'auto', boxShadow: '4px 0 24px rgba(0,0,0,0.12)', display: 'flex', flexDirection: 'column' }}>
            <div style={{ padding: '14px 16px', display: 'flex', justifyContent: 'flex-end', borderBottom: '1px solid #f1f5f9' }}>
              <button onClick={() => setMobileOpen(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#64748b', display: 'flex', alignItems: 'center', padding: 4 }}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
              </button>
            </div>
            <SidebarInner />
          </aside>
        </>
      )}

      {/* Main area */}
      <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column' }} className="lyu-main">

        {/* ONE single top bar */}
        <header style={{ height: 58, background: 'white', borderBottom: '1px solid #f1f5f9', display: 'flex', alignItems: 'center', padding: '0 20px', gap: 12, position: 'sticky', top: 0, zIndex: 30, boxShadow: '0 1px 3px rgba(0,0,0,0.04)' }}>

          {/* Mobile hamburger */}
          <button onClick={() => setMobileOpen(true)} style={{ display: 'none', width: 36, height: 36, border: '1.5px solid #e2e8f0', borderRadius: 9, background: 'white', cursor: 'pointer', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }} className="lyu-hamburger">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#374151" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/></svg>
          </button>

          {/* Search bar */}
          <div style={{ flex: 1, maxWidth: 360, display: 'flex', alignItems: 'center', gap: 9, background: '#f8fafc', border: '1.5px solid #e2e8f0', borderRadius: 10, padding: '7px 13px', transition: 'all 0.15s' }}
            onFocus={() => {}} >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
            <input type="text" value={searchVal} onChange={e => setSearchVal(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && searchVal.trim() && router.push(`/seeker/jobs?q=${encodeURIComponent(searchVal.trim())}`)}
              placeholder="Search jobs, companies..."
              style={{ background: 'transparent', border: 'none', outline: 'none', fontSize: 13, color: '#0f172a', width: '100%', fontFamily: 'inherit' }} />
          </div>

          <div style={{ flex: 1 }} />

          {/* Bell notification — WORKS */}
          <div style={{ position: 'relative' }}>
            <button onClick={() => { setNotifOpen(!notifOpen); setProfileOpen(false) }}
              style={{ width: 36, height: 36, border: '1.5px solid #e2e8f0', borderRadius: 9, background: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', flexShrink: 0 }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#475569" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>
              <span style={{ position: 'absolute', top: 7, right: 7, width: 7, height: 7, background: '#ef4444', borderRadius: '50%', border: '2px solid white' }} />
            </button>

            {notifOpen && (
              <>
                <div style={{ position: 'fixed', inset: 0, zIndex: 40 }} onClick={() => setNotifOpen(false)} />
                <div style={{ position: 'absolute', top: 'calc(100% + 8px)', right: 0, background: 'white', borderRadius: 16, border: '1px solid #e2e8f0', boxShadow: '0 16px 40px rgba(0,0,0,0.12)', width: 320, zIndex: 50, overflow: 'hidden' }}>
                  <div style={{ padding: '14px 16px', borderBottom: '1px solid #f1f5f9', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <p style={{ fontWeight: 800, color: '#0f172a', fontSize: 14 }}>Notifications</p>
                    <button style={{ fontSize: 11, color: '#2563eb', fontWeight: 600, background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'inherit' }}>Mark all read</button>
                  </div>
                  <div>
                    {[
                      { icon: '💼', title: 'New job match', desc: 'React Developer at TechCorp matches 92% of your profile', time: '2h ago', unread: true },
                      { icon: '👁', title: 'Application viewed', desc: 'InfoSys viewed your application for Data Entry', time: '5h ago', unread: true },
                      { icon: '✅', title: 'Profile tip', desc: 'Add your resume to get 3x more interview calls', time: '1d ago', unread: false },
                    ].map((n, i) => (
                      <div key={i} style={{ display: 'flex', gap: 12, padding: '12px 16px', background: n.unread ? '#fafbff' : 'white', borderBottom: i < 2 ? '1px solid #f8fafc' : 'none', cursor: 'pointer' }}>
                        <div style={{ width: 36, height: 36, borderRadius: 10, background: '#f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16, flexShrink: 0 }}>{n.icon}</div>
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <p style={{ fontWeight: 700, color: '#0f172a', fontSize: 13, marginBottom: 2 }}>{n.title}</p>
                          <p style={{ fontSize: 12, color: '#64748b', lineHeight: 1.4 }}>{n.desc}</p>
                          <p style={{ fontSize: 11, color: '#94a3b8', marginTop: 4 }}>{n.time}</p>
                        </div>
                        {n.unread && <div style={{ width: 8, height: 8, background: '#2563eb', borderRadius: '50%', flexShrink: 0, marginTop: 4 }} />}
                      </div>
                    ))}
                  </div>
                  <div style={{ padding: '10px 16px', borderTop: '1px solid #f1f5f9' }}>
                    <Link href="/seeker/notifications" onClick={() => setNotifOpen(false)} style={{ fontSize: 13, color: '#2563eb', fontWeight: 600, textDecoration: 'none' }}>View all notifications →</Link>
                  </div>
                </div>
              </>
            )}
          </div>

          {/* Profile avatar dropdown — WORKS */}
          <div style={{ position: 'relative' }}>
            <button onClick={() => { setProfileOpen(!profileOpen); setNotifOpen(false) }}
              style={{ display: 'flex', alignItems: 'center', gap: 8, background: 'white', border: '1.5px solid #e2e8f0', borderRadius: 11, padding: '5px 10px 5px 5px', cursor: 'pointer', fontFamily: 'inherit', transition: 'all 0.15s' }}>
              <div style={{ width: 28, height: 28, borderRadius: '50%', background: 'linear-gradient(135deg,#2563eb,#4f46e5)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 800, fontSize: 10, flexShrink: 0, overflow: 'hidden' }}>
                {profile?.avatar_url ? <img src={profile.avatar_url} alt={name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : initials}
              </div>
              <div style={{ textAlign: 'left' }} className="lyu-name-block">
                <p style={{ fontWeight: 700, color: '#0f172a', fontSize: 13, lineHeight: 1.2, whiteSpace: 'nowrap' }}>{firstName}</p>
                <p style={{ fontSize: 10, color: '#94a3b8', lineHeight: 1 }}>Seeker</p>
              </div>
              <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9"/></svg>
            </button>

            {profileOpen && (
              <>
                <div style={{ position: 'fixed', inset: 0, zIndex: 40 }} onClick={() => setProfileOpen(false)} />
                <div style={{ position: 'absolute', top: 'calc(100% + 8px)', right: 0, background: 'white', borderRadius: 16, border: '1px solid #e2e8f0', boxShadow: '0 16px 40px rgba(0,0,0,0.12)', minWidth: 220, zIndex: 50, overflow: 'hidden' }}>
                  <div style={{ padding: '14px 16px', borderBottom: '1px solid #f1f5f9' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
                      <div style={{ width: 38, height: 38, borderRadius: '50%', background: 'linear-gradient(135deg,#2563eb,#4f46e5)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 800, fontSize: 13, overflow: 'hidden' }}>
                        {profile?.avatar_url ? <img src={profile.avatar_url} alt={name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : initials}
                      </div>
                      <div>
                        <p style={{ fontWeight: 800, color: '#0f172a', fontSize: 14 }}>{name}</p>
                        <p style={{ color: '#94a3b8', fontSize: 11, marginTop: 1 }}>{user?.email}</p>
                      </div>
                    </div>
                    <span style={{ fontSize: 10, fontWeight: 700, color: '#2563eb', background: '#eff6ff', padding: '2px 10px', borderRadius: 9999, border: '1px solid #bfdbfe' }}>Job Seeker</span>
                  </div>
                  <div style={{ padding: '6px' }}>
                    {[
                      { label: 'My Dashboard', href: '/seeker/dashboard' },
                      { label: 'My Profile', href: '/seeker/profile' },
                      { label: 'My Applications', href: '/seeker/applications' },
                      { label: 'Settings', href: '/seeker/settings' },
                    ].map(item => (
                      <Link key={item.label} href={item.href} onClick={() => setProfileOpen(false)}
                        style={{ display: 'flex', alignItems: 'center', padding: '9px 12px', borderRadius: 10, textDecoration: 'none', color: '#374151', fontSize: 13, fontWeight: 600, transition: 'background 0.15s' }}
                        onMouseEnter={e => e.currentTarget.style.background = '#f8fafc'}
                        onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                        {item.label}
                      </Link>
                    ))}
                  </div>
                  <div style={{ borderTop: '1px solid #f1f5f9', padding: '6px' }}>
                    <button onClick={handleLogout} style={{ display: 'flex', alignItems: 'center', gap: 9, padding: '9px 12px', borderRadius: 10, background: 'none', border: 'none', color: '#ef4444', fontSize: 13, fontWeight: 600, cursor: 'pointer', width: '100%', fontFamily: 'inherit', transition: 'background 0.15s' }}
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
        </header>

        {/* Page content */}
        <main style={{ flex: 1, padding: '24px 28px', maxWidth: 1200, width: '100%', margin: '0 auto', boxSizing: 'border-box' }} className="lyu-content">
          {children}
        </main>
      </div>

      {/* Mobile bottom nav */}
      <nav style={{ display: 'none', position: 'fixed', bottom: 0, left: 0, right: 0, background: 'white', borderTop: '1px solid #f1f5f9', zIndex: 50, boxShadow: '0 -4px 12px rgba(0,0,0,0.06)' }} className="lyu-bottom-nav">
        <div style={{ display: 'flex' }}>
          {MOBILE_BOTTOM.map(item => {
            const active = pathname === item.href || (item.href !== '/seeker/dashboard' && pathname.startsWith(item.href))
            return (
              <Link key={item.href} href={item.href} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '10px 0 8px', gap: 3, textDecoration: 'none', color: active ? '#2563eb' : '#94a3b8', transition: 'color 0.15s' }}>
                <span>{item.icon}</span>
                <span style={{ fontSize: 10, fontWeight: active ? 700 : 500 }}>{item.label}</span>
              </Link>
            )
          })}
        </div>
      </nav>

      <style>{`
        @media(min-width:1024px) {
          .lyu-sidebar { display: flex !important; }
          .lyu-main { margin-left: 228px; }
          .lyu-hamburger { display: none !important; }
          .lyu-bottom-nav { display: none !important; }
        }
        @media(max-width:1023px) {
          .lyu-sidebar { display: none !important; }
          .lyu-main { margin-left: 0 !important; }
          .lyu-hamburger { display: flex !important; }
          .lyu-bottom-nav { display: flex !important; }
          .lyu-name-block { display: none !important; }
          .lyu-content { padding: 16px 16px 80px !important; }
        }
        @media(max-width:640px) {
          .lyu-content { padding: 12px 12px 80px !important; }
        }
      `}</style>
    </div>
  )
}
