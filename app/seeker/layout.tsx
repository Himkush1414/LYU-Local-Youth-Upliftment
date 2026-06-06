'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  LayoutDashboard, Briefcase, FileText, Bookmark, Sparkles,
  FileEdit, GraduationCap, MessageSquare, User, Settings,
  Bell, Search, LogOut, ChevronRight, Menu, X,
} from 'lucide-react';

const NAV_MAIN = [
  { label: 'Dashboard',     href: '/seeker/dashboard',     icon: LayoutDashboard },
  { label: 'Opportunities', href: '/seeker/opportunities',  icon: Briefcase },
  { label: 'Applications',  href: '/seeker/applications',   icon: FileText },
  { label: 'Saved',         href: '/seeker/saved',          icon: Bookmark },
  { label: 'Career AI',     href: '/seeker/chat',           icon: Sparkles },
  { label: 'Resume Studio', href: '/seeker/resume',         icon: FileEdit },
  { label: 'Learning Path', href: '/seeker/learning',       icon: GraduationCap },
  { label: 'Messages',      href: '/seeker/messages',       icon: MessageSquare },
];

const NAV_BOTTOM = [
  { label: 'Profile',  href: '/seeker/profile',  icon: User },
  { label: 'Settings', href: '/seeker/settings', icon: Settings },
];

const SIDEBAR_W = 240;
const BG        = '#0d0d14';
const BORDER    = 'rgba(255,255,255,0.06)';
const MUTED     = '#64748b';
const SUB       = '#94a3b8';
const WHITE     = '#f1f5f9';
const ACTIVE    = '#4f46e5';
const HOVER_BG  = 'rgba(255,255,255,0.05)';

function NavItem({ href, icon: Icon, label, active, onClick }: {
  href: string; icon: React.ElementType; label: string; active: boolean; onClick?: () => void;
}) {
  const [hov, setHov] = useState(false);
  return (
    <Link href={href} style={{ textDecoration: 'none' }} onClick={onClick}>
      <div
        onMouseEnter={() => setHov(true)}
        onMouseLeave={() => setHov(false)}
        style={{
          display: 'flex', alignItems: 'center', gap: '10px',
          padding: '9px 12px', borderRadius: '8px', cursor: 'pointer',
          backgroundColor: active ? ACTIVE : hov ? HOVER_BG : 'transparent',
          color: active ? '#fff' : hov ? WHITE : SUB,
          transition: 'all 0.15s ease', marginBottom: '2px',
          fontSize: '13.5px', fontWeight: active ? 600 : 400,
          letterSpacing: '0.01em',
        }}
      >
        <Icon size={16} strokeWidth={active ? 2.2 : 1.8} style={{ flexShrink: 0 }} />
        <span style={{ flex: 1 }}>{label}</span>
        {active && <ChevronRight size={13} style={{ opacity: 0.7 }} />}
      </div>
    </Link>
  );
}

function Sidebar({ pathname, onClose, isMobile }: { pathname: string; onClose?: () => void; isMobile: boolean }) {
  const router = useRouter();
  return (
    <aside style={{
      width: `${SIDEBAR_W}px`, height: '100%',
      backgroundColor: BG,
      display: 'flex', flexDirection: 'column',
      borderRight: `1px solid ${BORDER}`,
      overflow: 'hidden',
    }}>
      {/* Logo */}
      <div style={{ padding: '20px 16px 16px', borderBottom: `1px solid ${BORDER}`, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: 'linear-gradient(135deg,#4f46e5,#7c3aed)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <Sparkles size={16} color="#fff" />
          </div>
          <div>
            <div style={{ fontSize: '16px', fontWeight: 700, color: WHITE, letterSpacing: '-0.02em' }}>LYU</div>
            <div style={{ fontSize: '10px', color: MUTED, letterSpacing: '0.08em', marginTop: '-1px' }}>CAREER PLATFORM</div>
          </div>
        </div>
        {isMobile && onClose && (
          <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: MUTED, padding: '4px', borderRadius: '6px', display: 'flex' }}>
            <X size={18} />
          </button>
        )}
      </div>

      {/* Nav */}
      <nav style={{ flex: 1, padding: '12px 10px', overflowY: 'auto' }}>
        <div style={{ fontSize: '10px', fontWeight: 600, color: '#334155', letterSpacing: '0.1em', padding: '0 4px', marginBottom: '6px' }}>MAIN MENU</div>
        {NAV_MAIN.map(item => (
          <NavItem
            key={item.href} href={item.href} icon={item.icon} label={item.label}
            active={pathname === item.href || pathname.startsWith(item.href + '/')}
            onClick={isMobile ? onClose : undefined}
          />
        ))}
        <div style={{ height: '1px', background: BORDER, margin: '10px 4px' }} />
        <div style={{ fontSize: '10px', fontWeight: 600, color: '#334155', letterSpacing: '0.1em', padding: '0 4px', marginBottom: '6px' }}>ACCOUNT</div>
        {NAV_BOTTOM.map(item => (
          <NavItem
            key={item.href} href={item.href} icon={item.icon} label={item.label}
            active={pathname === item.href}
            onClick={isMobile ? onClose : undefined}
          />
        ))}
      </nav>

      {/* User footer */}
      <div style={{ padding: '12px 16px', borderTop: `1px solid ${BORDER}`, display: 'flex', alignItems: 'center', gap: '10px' }}>
        <div style={{ width: '34px', height: '34px', borderRadius: '50%', background: 'linear-gradient(135deg,#4f46e5,#7c3aed)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 700, fontSize: '13px', flexShrink: 0 }}>A</div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: '13px', fontWeight: 600, color: WHITE, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>Job Seeker</div>
          <div style={{ fontSize: '11px', color: MUTED }}>Free Plan</div>
        </div>
        <button
          onClick={() => router.push('/')}
          title="Sign out"
          style={{ background: 'none', border: 'none', cursor: 'pointer', color: MUTED, padding: '4px', borderRadius: '6px', display: 'flex' }}
          onMouseEnter={e => (e.currentTarget.style.color = '#ef4444')}
          onMouseLeave={e => (e.currentTarget.style.color = MUTED)}
        >
          <LogOut size={15} />
        </button>
      </div>
    </aside>
  );
}

export default function SeekerLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchVal, setSearchVal] = useState('');
  const [isDesktop, setIsDesktop] = useState(true);

  useEffect(() => {
    const check = () => setIsDesktop(window.innerWidth >= 1024);
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  // Close sidebar on route change (mobile)
  useEffect(() => { setSidebarOpen(false); }, [pathname]);

  return (
    <div style={{ display: 'flex', height: '100vh', overflow: 'hidden', fontFamily: "'Inter','DM Sans','Helvetica Neue',sans-serif", background: '#0a0a0f' }}>

      {/* Desktop sidebar — always visible */}
      {isDesktop && (
        <div style={{ width: `${SIDEBAR_W}px`, minWidth: `${SIDEBAR_W}px`, height: '100vh', flexShrink: 0 }}>
          <Sidebar pathname={pathname} isMobile={false} />
        </div>
      )}

      {/* Mobile sidebar — overlay drawer */}
      {!isDesktop && sidebarOpen && (
        <>
          {/* Backdrop */}
          <div
            onClick={() => setSidebarOpen(false)}
            style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', zIndex: 40, backdropFilter: 'blur(2px)' }}
          />
          {/* Drawer */}
          <div style={{ position: 'fixed', top: 0, left: 0, width: `${SIDEBAR_W}px`, height: '100vh', zIndex: 50 }}>
            <Sidebar pathname={pathname} onClose={() => setSidebarOpen(false)} isMobile={true} />
          </div>
        </>
      )}

      {/* Right side */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden', minWidth: 0 }}>

        {/* Top bar */}
        <header style={{
          height: '60px', backgroundColor: '#0d0d14',
          borderBottom: `1px solid ${BORDER}`,
          display: 'flex', alignItems: 'center',
          padding: '0 20px', gap: '12px', flexShrink: 0,
        }}>
          {/* Hamburger — mobile only */}
          {!isDesktop && (
            <button
              onClick={() => setSidebarOpen(true)}
              style={{ background: 'none', border: 'none', cursor: 'pointer', color: SUB, padding: '6px', borderRadius: '8px', display: 'flex', flexShrink: 0 }}
            >
              <Menu size={20} />
            </button>
          )}

          {/* Logo on mobile topbar */}
          {!isDesktop && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexShrink: 0 }}>
              <div style={{ width: '26px', height: '26px', borderRadius: '6px', background: 'linear-gradient(135deg,#4f46e5,#7c3aed)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Sparkles size={13} color="#fff" />
              </div>
              <span style={{ fontSize: '14px', fontWeight: 700, color: WHITE }}>LYU</span>
            </div>
          )}

          {/* Search */}
          <div style={{ flex: 1, display: 'flex', justifyContent: 'center' }}>
            <div style={{ position: 'relative', width: '100%', maxWidth: isDesktop ? '440px' : '100%' }}>
              <Search size={14} style={{ position: 'absolute', left: '11px', top: '50%', transform: 'translateY(-50%)', color: MUTED, pointerEvents: 'none' }} />
              <input
                type="text"
                placeholder="Search jobs, companies, skills…"
                value={searchVal}
                onChange={e => setSearchVal(e.target.value)}
                style={{
                  width: '100%', padding: '8px 14px 8px 34px',
                  borderRadius: '10px', border: `1.5px solid rgba(255,255,255,0.08)`,
                  backgroundColor: 'rgba(255,255,255,0.05)',
                  fontSize: '13px', color: WHITE, outline: 'none',
                  transition: 'border-color 0.15s', boxSizing: 'border-box',
                }}
                onFocus={e => (e.currentTarget.style.borderColor = '#4f46e5')}
                onBlur={e => (e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)')}
              />
            </div>
          </div>

          {/* Right controls */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexShrink: 0 }}>
            <button style={{ position: 'relative', background: 'rgba(255,255,255,0.05)', border: `1px solid rgba(255,255,255,0.08)`, borderRadius: '10px', width: '36px', height: '36px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: SUB }}>
              <Bell size={15} />
              <span style={{ position: 'absolute', top: '7px', right: '7px', width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#ef4444', border: '1.5px solid #0d0d14' }} />
            </button>
            <div style={{ width: '34px', height: '34px', borderRadius: '50%', background: 'linear-gradient(135deg,#4f46e5,#7c3aed)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 700, fontSize: '13px', cursor: 'pointer', flexShrink: 0 }}>A</div>
          </div>
        </header>

        {/* Page content */}
        <main style={{ flex: 1, overflowY: 'auto', backgroundColor: '#0a0a0f' }}>
          {children}
        </main>
      </div>
    </div>
  );
}
