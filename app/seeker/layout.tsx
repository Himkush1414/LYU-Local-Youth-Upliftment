'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  LayoutDashboard,
  Briefcase,
  FileText,
  Bookmark,
  Sparkles,
  FileEdit,
  GraduationCap,
  MessageSquare,
  User,
  Settings,
  Bell,
  Search,
  LogOut,
  ChevronRight,
} from 'lucide-react';

const NAV_MAIN = [
  { label: 'Dashboard',     href: '/seeker/dashboard',    icon: LayoutDashboard },
  { label: 'Opportunities', href: '/seeker/jobs',         icon: Briefcase },
  { label: 'Applications',  href: '/seeker/applications', icon: FileText },
  { label: 'Saved',         href: '/seeker/saved',        icon: Bookmark },
  { label: 'Career AI',     href: '/seeker/chat',         icon: Sparkles },
  { label: 'Resume Studio', href: '/seeker/resume',       icon: FileEdit },
  { label: 'Learning Path', href: '/seeker/learning',     icon: GraduationCap },
  { label: 'Messages',      href: '/seeker/messages',     icon: MessageSquare },
];

const NAV_BOTTOM = [
  { label: 'Profile',  href: '/seeker/profile',   icon: User },
  { label: 'Settings', href: '/seeker/settings',  icon: Settings },
];

const ACTIVE_BG   = '#4f46e5';
const SIDEBAR_BG  = '#0f172a';
const HOVER_BG    = 'rgba(255,255,255,0.06)';
const TEXT_MUTED  = '#94a3b8';
const TEXT_WHITE  = '#f1f5f9';

function NavItem({
  href,
  icon: Icon,
  label,
  active,
}: {
  href: string;
  icon: React.ElementType;
  label: string;
  active: boolean;
}) {
  const [hovered, setHovered] = useState(false);

  return (
    <Link href={href} style={{ textDecoration: 'none' }}>
      <div
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          padding: '9px 12px',
          borderRadius: '8px',
          cursor: 'pointer',
          backgroundColor: active ? ACTIVE_BG : hovered ? HOVER_BG : 'transparent',
          color: active ? '#fff' : hovered ? TEXT_WHITE : TEXT_MUTED,
          transition: 'all 0.15s ease',
          marginBottom: '2px',
          fontSize: '13.5px',
          fontWeight: active ? 600 : 400,
          letterSpacing: '0.01em',
        }}
      >
        <Icon size={16} strokeWidth={active ? 2.2 : 1.8} />
        <span style={{ flex: 1 }}>{label}</span>
        {active && (
          <ChevronRight size={13} style={{ opacity: 0.7 }} />
        )}
      </div>
    </Link>
  );
}

export default function SeekerLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router   = useRouter();
  const [searchVal, setSearchVal] = useState('');

  const handleSignOut = () => {
    router.push('/');
  };

  return (
    <div style={{ display: 'flex', height: '100vh', overflow: 'hidden', fontFamily: "'DM Sans', 'Helvetica Neue', sans-serif" }}>

      {/* ── SIDEBAR ─────────────────────────────────── */}
      <aside
        style={{
          width: '240px',
          minWidth: '240px',
          height: '100vh',
          backgroundColor: SIDEBAR_BG,
          display: 'flex',
          flexDirection: 'column',
          padding: '0',
          overflow: 'hidden',
          borderRight: '1px solid rgba(255,255,255,0.05)',
        }}
      >
        {/* Logo */}
        <div
          style={{
            padding: '20px 16px 16px',
            borderBottom: '1px solid rgba(255,255,255,0.06)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div
              style={{
                width: '32px',
                height: '32px',
                borderRadius: '8px',
                background: 'linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
              }}
            >
              <Sparkles size={16} color="#fff" strokeWidth={2} />
            </div>
            <div>
              <div style={{ fontSize: '16px', fontWeight: 700, color: '#f1f5f9', letterSpacing: '-0.02em' }}>
                LYU
              </div>
              <div style={{ fontSize: '10px', color: TEXT_MUTED, letterSpacing: '0.08em', marginTop: '-1px' }}>
                CAREER PLATFORM
              </div>
            </div>
          </div>
        </div>

        {/* Main nav */}
        <nav style={{ flex: 1, padding: '12px 10px', overflowY: 'auto' }}>
          <div style={{ marginBottom: '4px' }}>
            <div style={{ fontSize: '10px', fontWeight: 600, color: '#475569', letterSpacing: '0.1em', padding: '0 4px', marginBottom: '6px' }}>
              MAIN MENU
            </div>
            {NAV_MAIN.map((item) => (
              <NavItem
                key={item.href}
                href={item.href}
                icon={item.icon}
                label={item.label}
                active={pathname === item.href || pathname.startsWith(item.href + '/')}
              />
            ))}
          </div>

          {/* Divider */}
          <div style={{ height: '1px', background: 'rgba(255,255,255,0.06)', margin: '10px 4px' }} />

          <div>
            <div style={{ fontSize: '10px', fontWeight: 600, color: '#475569', letterSpacing: '0.1em', padding: '0 4px', marginBottom: '6px' }}>
              ACCOUNT
            </div>
            {NAV_BOTTOM.map((item) => (
              <NavItem
                key={item.href}
                href={item.href}
                icon={item.icon}
                label={item.label}
                active={pathname === item.href}
              />
            ))}
          </div>
        </nav>

        {/* User footer */}
        <div
          style={{
            padding: '12px 16px',
            borderTop: '1px solid rgba(255,255,255,0.06)',
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
          }}
        >
          <div
            style={{
              width: '34px',
              height: '34px',
              borderRadius: '50%',
              background: 'linear-gradient(135deg, #4f46e5, #7c3aed)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#fff',
              fontWeight: 700,
              fontSize: '13px',
              flexShrink: 0,
            }}
          >
            A
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: '13px', fontWeight: 600, color: TEXT_WHITE, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
              Alex Kumar
            </div>
            <div style={{ fontSize: '11px', color: TEXT_MUTED }}>Job Seeker</div>
          </div>
          <button
            onClick={handleSignOut}
            title="Sign out"
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              color: TEXT_MUTED,
              padding: '4px',
              borderRadius: '6px',
              display: 'flex',
              alignItems: 'center',
              transition: 'color 0.15s',
            }}
            onMouseEnter={(e) => (e.currentTarget.style.color = '#ef4444')}
            onMouseLeave={(e) => (e.currentTarget.style.color = TEXT_MUTED)}
          >
            <LogOut size={15} />
          </button>
        </div>
      </aside>

      {/* ── RIGHT SIDE ──────────────────────────────── */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>

        {/* Top bar */}
        <header
          style={{
            height: '60px',
            backgroundColor: '#ffffff',
            borderBottom: '1px solid #e2e8f0',
            display: 'flex',
            alignItems: 'center',
            padding: '0 24px',
            gap: '16px',
            flexShrink: 0,
            boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
          }}
        >
          {/* Search — centred */}
          <div style={{ flex: 1, display: 'flex', justifyContent: 'center' }}>
            <div style={{ position: 'relative', width: '100%', maxWidth: '440px' }}>
              <Search
                size={15}
                style={{
                  position: 'absolute',
                  left: '12px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  color: '#94a3b8',
                }}
              />
              <input
                type="text"
                placeholder="Search jobs, companies, skills…"
                value={searchVal}
                onChange={(e) => setSearchVal(e.target.value)}
                style={{
                  width: '100%',
                  padding: '9px 14px 9px 36px',
                  borderRadius: '10px',
                  border: '1.5px solid #e2e8f0',
                  backgroundColor: '#f8fafc',
                  fontSize: '13.5px',
                  color: '#0f172a',
                  outline: 'none',
                  transition: 'border-color 0.15s',
                  boxSizing: 'border-box',
                }}
                onFocus={(e) => (e.currentTarget.style.borderColor = '#4f46e5')}
                onBlur={(e) => (e.currentTarget.style.borderColor = '#e2e8f0')}
              />
            </div>
          </div>

          {/* Right controls */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <button
              style={{
                position: 'relative',
                background: '#f8fafc',
                border: '1.5px solid #e2e8f0',
                borderRadius: '10px',
                width: '38px',
                height: '38px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                color: '#64748b',
              }}
            >
              <Bell size={16} />
              <span
                style={{
                  position: 'absolute',
                  top: '7px',
                  right: '7px',
                  width: '7px',
                  height: '7px',
                  borderRadius: '50%',
                  backgroundColor: '#ef4444',
                  border: '1.5px solid #fff',
                }}
              />
            </button>

            <div
              style={{
                width: '36px',
                height: '36px',
                borderRadius: '50%',
                background: 'linear-gradient(135deg, #4f46e5, #7c3aed)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#fff',
                fontWeight: 700,
                fontSize: '13px',
                cursor: 'pointer',
                border: '2px solid #e2e8f0',
              }}
            >
              A
            </div>
          </div>
        </header>

        {/* Page content */}
        <main
          style={{
            flex: 1,
            overflowY: 'auto',
            backgroundColor: '#f8fafc',
          }}
        >
          {children}
        </main>
      </div>
    </div>
  );
}
