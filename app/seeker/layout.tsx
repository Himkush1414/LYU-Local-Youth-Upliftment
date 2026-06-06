'use client'

import { useState, useEffect } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import {
  LayoutDashboard, Briefcase, FileText, Bookmark,
  Sparkles, BookOpen, MessageSquare, User, Settings,
  Menu, X, Bell, Search, ChevronRight, Zap
} from 'lucide-react'

const C = {
  bg:       '#0a0a0f',
  sidebar:  '#0d0d14',
  border:   '#1e1e2e',
  purple:   '#6c63ff',
  purpleDim:'rgba(108,99,255,0.12)',
  text:     '#f8fafc',
  sub:      '#94a3b8',
  muted:    '#475569',
  hover:    '#15151f',
}

const NAV = [
  { label: 'Dashboard',    href: '/seeker/dashboard',     icon: LayoutDashboard },
  { label: 'Opportunities',href: '/seeker/opportunities',  icon: Briefcase       },
  { label: 'Applications', href: '/seeker/applications',   icon: FileText        },
  { label: 'Saved',        href: '/seeker/saved',          icon: Bookmark        },
  { label: 'Career AI',    href: '/seeker/chat',           icon: Sparkles        },
  { label: 'Resume Studio',href: '/seeker/resume',         icon: FileText        },
  { label: 'Learning Path',href: '/seeker/learning',       icon: BookOpen        },
  { label: 'Messages',     href: '/seeker/messages',       icon: MessageSquare   },
  { label: 'Profile',      href: '/seeker/profile',        icon: User            },
  { label: 'Settings',     href: '/seeker/settings',       icon: Settings        },
]

function NavItem({ item, active, onClick }: {
  item: typeof NAV[0]
  active: boolean
  onClick: () => void
}) {
  const [hov, setHov] = useState(false)
  const Icon = item.icon
  return (
    <div
      onClick={onClick}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        display: 'flex', alignItems: 'center', gap: '10px',
        padding: '9px 14px', borderRadius: '10px', cursor: 'pointer',
        marginBottom: '2px',
        background: active
          ? C.purpleDim
          : hov ? C.hover : 'transparent',
        borderLeft: active ? `2px solid ${C.purple}` : '2px solid transparent',
        transition: 'all 0.15s ease',
      }}
    >
      <Icon
        size={16}
        color={active ? C.purple : hov ? C.sub : C.muted}
        style={{ flexShrink: 0 }}
      />
      <span style={{
        fontSize: '13px', fontWeight: active ? 600 : 500,
        color: active ? C.text : hov ? C.sub : C.muted,
        whiteSpace: 'nowrap',
      }}>
        {item.label}
      </span>
    </div>
  )
}

function Sidebar({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = usePathname()
  const router = useRouter()
  return (
    <div style={{
      width: '220px', height: '100%', display: 'flex', flexDirection: 'column',
      background: C.sidebar, borderRight: `1px solid ${C.border}`,
      padding: '0',
    }}>
      {/* Logo */}
      <div style={{
        padding: '20px 18px 16px', borderBottom: `1px solid ${C.border}`,
        display: 'flex', alignItems: 'center', gap: '10px',
      }}>
        <div style={{
          width: '32px', height: '32px', borderRadius: '9px',
          background: C.purple, display: 'flex', alignItems: 'center',
          justifyContent: 'center', flexShrink: 0,
        }}>
          <Zap size={16} color="#fff" />
        </div>
        <div>
          <div style={{ fontSize: '15px', fontWeight: 800, color: C.text, letterSpacing: '-0.02em' }}>LYU</div>
          <div style={{ fontSize: '10px', color: C.muted, fontWeight: 500 }}>Career Platform</div>
        </div>
      </div>

      {/* Nav */}
      <nav style={{ flex: 1, padding: '12px 10px', overflowY: 'auto' }}>
        {NAV.map(item => (
          <NavItem
            key={item.href}
            item={item}
            active={pathname === item.href || (item.href !== '/seeker/dashboard' && pathname.startsWith(item.href))}
            onClick={() => {
              router.push(item.href)
              onNavigate?.()
            }}
          />
        ))}
      </nav>

      {/* Bottom user pill */}
      <div style={{
        padding: '14px 12px', borderTop: `1px solid ${C.border}`,
        display: 'flex', alignItems: 'center', gap: '10px',
      }}>
        <div style={{
          width: '32px', height: '32px', borderRadius: '50%',
          background: 'linear-gradient(135deg,#6c63ff,#06b6d4)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: '12px', fontWeight: 700, color: '#fff', flexShrink: 0,
        }}>M</div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: '12px', fontWeight: 600, color: C.text, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>Manik Rana</div>
          <div style={{ fontSize: '10.5px', color: C.muted }}>Job Seeker</div>
        </div>
        <ChevronRight size={13} color={C.muted} />
      </div>
    </div>
  )
}

export default function SeekerLayout({ children }: { children: React.ReactNode }) {
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [vw, setVw] = useState(1280)

  useEffect(() => {
    const upd = () => setVw(window.innerWidth)
    upd()
    window.addEventListener('resize', upd)
    return () => window.removeEventListener('resize', upd)
  }, [])

  const isDesktop = vw >= 1024

  return (
    <div style={{
      display: 'flex', height: '100dvh', background: C.bg,
      fontFamily: "'DM Sans', 'Inter', system-ui, sans-serif",
      overflow: 'hidden',
    }}>
      {/* Desktop sidebar */}
      {isDesktop && (
        <div style={{ flexShrink: 0, height: '100%' }}>
          <Sidebar />
        </div>
      )}

      {/* Mobile drawer overlay */}
      {!isDesktop && drawerOpen && (
        <>
          {/* backdrop */}
          <div
            onClick={() => setDrawerOpen(false)}
            style={{
              position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)',
              zIndex: 40, backdropFilter: 'blur(2px)',
            }}
          />
          {/* drawer */}
          <div style={{
            position: 'fixed', top: 0, left: 0, height: '100%', zIndex: 50,
            animation: 'slideIn 0.22s ease',
          }}>
            <Sidebar onNavigate={() => setDrawerOpen(false)} />
          </div>
        </>
      )}

      {/* Right side: topbar + content */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0, height: '100%' }}>
        {/* Topbar */}
        <header style={{
          height: '56px', borderBottom: `1px solid ${C.border}`,
          display: 'flex', alignItems: 'center', gap: '12px',
          padding: '0 16px', flexShrink: 0, background: C.sidebar,
        }}>
          {!isDesktop && (
            <button
              onClick={() => setDrawerOpen(true)}
              style={{
                background: 'none', border: 'none', cursor: 'pointer',
                color: C.sub, display: 'flex', alignItems: 'center', padding: '4px',
              }}
            >
              <Menu size={20} />
            </button>
          )}

          {/* Search bar */}
          <div style={{
            flex: 1, maxWidth: '400px', display: 'flex', alignItems: 'center',
            gap: '8px', background: C.hover, border: `1px solid ${C.border}`,
            borderRadius: '10px', padding: '7px 12px',
          }}>
            <Search size={14} color={C.muted} />
            <input
              placeholder="Search jobs, companies, skills..."
              style={{
                background: 'none', border: 'none', outline: 'none',
                color: C.text, fontSize: '13px', flex: 1,
              }}
            />
          </div>

          <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: '10px' }}>
            {/* Notif bell */}
            <button style={{
              background: 'none', border: 'none', cursor: 'pointer',
              color: C.sub, position: 'relative', display: 'flex', alignItems: 'center',
            }}>
              <Bell size={18} />
              <span style={{
                position: 'absolute', top: '-2px', right: '-2px',
                width: '7px', height: '7px', borderRadius: '50%',
                background: '#ef4444', border: `1.5px solid ${C.sidebar}`,
              }} />
            </button>

            {/* Avatar */}
            <div style={{
              width: '30px', height: '30px', borderRadius: '50%',
              background: 'linear-gradient(135deg,#6c63ff,#06b6d4)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '12px', fontWeight: 700, color: '#fff', cursor: 'pointer',
            }}>M</div>
          </div>
        </header>

        {/* Scrollable content */}
        <main style={{ flex: 1, overflowY: 'auto', background: C.bg }}>
          {children}
        </main>
      </div>

      <style>{`
        @keyframes slideIn {
          from { transform: translateX(-100%); opacity: 0; }
          to   { transform: translateX(0);    opacity: 1; }
        }
        * { box-sizing: border-box; margin: 0; padding: 0; }
        ::-webkit-scrollbar { width: 5px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: #1e1e2e; border-radius: 10px; }
        ::-webkit-scrollbar-thumb:hover { background: #2d2d44; }
        input::placeholder { color: #475569; }
      `}</style>
    </div>
  )
}
