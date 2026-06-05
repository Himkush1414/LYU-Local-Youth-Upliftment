'use client'

import Link from 'next/link'
import { ArrowRight, User, Briefcase, MapPin, Star, Shield, Zap } from 'lucide-react'

export default function RegisterPage() {
  return (
    <div style={{ minHeight: '100vh', display: 'flex', fontFamily: 'Inter, system-ui, sans-serif' }}>

      {/* LEFT PANEL */}
      <div style={{
        width: '45%', flexDirection: 'column', justifyContent: 'space-between',
        padding: '48px 56px', position: 'relative', overflow: 'hidden',
        background: 'linear-gradient(145deg,#1e3a8a 0%,#1d4ed8 45%,#2563eb 75%,#4f46e5 100%)',
      }} className="register-left">
        <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}>
          <div style={{ position: 'absolute', top: -80, left: -80, width: 320, height: 320, background: 'rgba(255,255,255,0.05)', borderRadius: '50%', filter: 'blur(60px)' }} />
          <div style={{ position: 'absolute', bottom: 60, right: 20, width: 240, height: 240, background: 'rgba(99,102,241,0.2)', borderRadius: '50%', filter: 'blur(50px)' }} />
        </div>

        <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: 10, textDecoration: 'none', position: 'relative' }}>
          <div style={{ width: 38, height: 38, borderRadius: 11, background: 'rgba(255,255,255,0.2)', backdropFilter: 'blur(8px)', border: '1px solid rgba(255,255,255,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <span style={{ color: 'white', fontWeight: 900, fontSize: 12 }}>LY</span>
          </div>
          <span style={{ color: 'white', fontWeight: 900, fontSize: 20 }}>LYU</span>
        </Link>

        <div style={{ position: 'relative', display: 'flex', flexDirection: 'column', gap: 28 }}>
          <div>
            <h1 style={{ fontSize: 'clamp(1.8rem,2.5vw,2.4rem)', fontWeight: 900, color: 'white', lineHeight: 1.1, marginBottom: 14, letterSpacing: '-0.02em' }}>
              Your next job is<br />
              <span style={{ color: '#93c5fd' }}>closer than you think</span>
            </h1>
            <p style={{ color: '#bfdbfe', fontSize: 15, lineHeight: 1.7 }}>
              LYU connects local youth with verified employers in your city. AI matches your skills to the right job — fast.
            </p>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {[
              { icon: MapPin, text: 'Jobs in your city, district & state' },
              { icon: Zap, text: 'AI skill matching — see your fit score' },
              { icon: Shield, text: 'Verified employers only — zero fake jobs' },
              { icon: Star, text: 'Free forever for job seekers' },
            ].map(item => (
              <div key={item.text} style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <div style={{ width: 32, height: 32, background: 'rgba(255,255,255,0.15)', borderRadius: 10, border: '1px solid rgba(255,255,255,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <item.icon style={{ width: 15, height: 15, color: 'white' }} />
                </div>
                <span style={{ color: '#e0e7ff', fontSize: 14, fontWeight: 500 }}>{item.text}</span>
              </div>
            ))}
          </div>

          <div style={{ background: 'rgba(255,255,255,0.1)', backdropFilter: 'blur(8px)', borderRadius: 16, padding: '18px 20px', border: '1px solid rgba(255,255,255,0.18)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
              <div style={{ display: 'flex' }}>
                {['PS','RV','AN'].map(init => (
                  <div key={init} style={{ width: 30, height: 30, borderRadius: '50%', background: 'rgba(255,255,255,0.2)', border: '2px solid rgba(255,255,255,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginLeft: -8, fontSize: 9, fontWeight: 900, color: 'white' }}>{init}</div>
                ))}
              </div>
              <div style={{ display: 'flex', gap: 2 }}>
                {[1,2,3,4,5].map(i => (
                  <svg key={i} style={{ width: 12, height: 12, fill: '#fbbf24' }} viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
                  </svg>
                ))}
              </div>
            </div>
            <p style={{ color: 'white', fontSize: 13, fontWeight: 600, lineHeight: 1.5 }}>"Found a job 4km from home in 3 days"</p>
            <p style={{ color: '#93c5fd', fontSize: 11, marginTop: 4 }}>Priya S. — placed at TechCorp, Chandigarh</p>
          </div>
        </div>

        <p style={{ color: '#93c5fd', fontSize: 12, position: 'relative' }}>© 2026 LYU · Local Youth Upliftment</p>
      </div>

      {/* RIGHT PANEL */}
      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '40px 24px', background: '#f8fafc', overflowY: 'auto' }}>
        <div style={{ width: '100%', maxWidth: 420 }}>

          {/* Mobile logo */}
          <div style={{ marginBottom: 36 }} className="register-mobile-logo">
            <Link href="/" style={{ display: 'inline-flex', alignItems: 'center', gap: 10, textDecoration: 'none' }}>
              <div style={{ width: 36, height: 36, borderRadius: 10, background: 'linear-gradient(135deg,#2563eb,#4f46e5)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 0 16px rgba(37,99,235,0.3)' }}>
                <span style={{ color: 'white', fontWeight: 900, fontSize: 12 }}>LY</span>
              </div>
              <span style={{ fontWeight: 900, fontSize: 20, color: '#0f172a' }}>LYU</span>
            </Link>
          </div>

          <div style={{ marginBottom: 32 }}>
            <h2 style={{ fontSize: 28, fontWeight: 900, color: '#0f172a', marginBottom: 6, letterSpacing: '-0.02em' }}>Join LYU</h2>
            <p style={{ color: '#64748b', fontSize: 15 }}>What best describes you?</p>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 14, marginBottom: 28 }}>

            {/* Job Seeker card */}
            <Link href="/auth/register/seeker" style={{ textDecoration: 'none' }}>
              <div style={{
                display: 'flex', alignItems: 'center', gap: 16,
                background: 'white', border: '2px solid #e2e8f0',
                borderRadius: 18, padding: '18px 20px',
                boxShadow: '0 1px 4px rgba(0,0,0,0.04)',
                cursor: 'pointer', transition: 'all 0.2s',
              }}
                onMouseEnter={e => {
                  const el = e.currentTarget
                  el.style.borderColor = '#2563eb'
                  el.style.background = '#eff6ff'
                  el.style.boxShadow = '0 8px 24px rgba(37,99,235,0.12)'
                  el.style.transform = 'translateY(-2px)'
                }}
                onMouseLeave={e => {
                  const el = e.currentTarget
                  el.style.borderColor = '#e2e8f0'
                  el.style.background = 'white'
                  el.style.boxShadow = '0 1px 4px rgba(0,0,0,0.04)'
                  el.style.transform = 'translateY(0)'
                }}>
                <div style={{ width: 52, height: 52, background: '#eff6ff', borderRadius: 14, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, border: '1px solid #dbeafe' }}>
                  <User style={{ width: 24, height: 24, color: '#2563eb' }} />
                </div>
                <div style={{ flex: 1 }}>
                  <p style={{ fontWeight: 900, color: '#0f172a', fontSize: 16, marginBottom: 3 }}>I am looking for a job</p>
                  <p style={{ color: '#64748b', fontSize: 13, marginBottom: 6 }}>Find local jobs, get AI matched, apply in one click</p>
                  <span style={{ display: 'inline-block', fontSize: 11, fontWeight: 700, color: '#15803d', background: '#f0fdf4', padding: '3px 10px', borderRadius: 9999, border: '1px solid #bbf7d0' }}>Free forever</span>
                </div>
                <ArrowRight style={{ width: 18, height: 18, color: '#cbd5e1', flexShrink: 0 }} />
              </div>
            </Link>

            {/* Employer card */}
            <Link href="/auth/register/employer" style={{ textDecoration: 'none' }}>
              <div style={{
                display: 'flex', alignItems: 'center', gap: 16,
                background: 'white', border: '2px solid #e2e8f0',
                borderRadius: 18, padding: '18px 20px',
                boxShadow: '0 1px 4px rgba(0,0,0,0.04)',
                cursor: 'pointer', transition: 'all 0.2s',
              }}
                onMouseEnter={e => {
                  const el = e.currentTarget
                  el.style.borderColor = '#7c3aed'
                  el.style.background = '#faf5ff'
                  el.style.boxShadow = '0 8px 24px rgba(124,58,237,0.12)'
                  el.style.transform = 'translateY(-2px)'
                }}
                onMouseLeave={e => {
                  const el = e.currentTarget
                  el.style.borderColor = '#e2e8f0'
                  el.style.background = 'white'
                  el.style.boxShadow = '0 1px 4px rgba(0,0,0,0.04)'
                  el.style.transform = 'translateY(0)'
                }}>
                <div style={{ width: 52, height: 52, background: '#faf5ff', borderRadius: 14, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, border: '1px solid #ede9fe' }}>
                  <Briefcase style={{ width: 24, height: 24, color: '#7c3aed' }} />
                </div>
                <div style={{ flex: 1 }}>
                  <p style={{ fontWeight: 900, color: '#0f172a', fontSize: 16, marginBottom: 3 }}>I am hiring talent</p>
                  <p style={{ color: '#64748b', fontSize: 13, marginBottom: 6 }}>Post jobs, find verified local candidates, hire faster</p>
                  <span style={{ display: 'inline-block', fontSize: 11, fontWeight: 700, color: '#6d28d9', background: '#f5f3ff', padding: '3px 10px', borderRadius: 9999, border: '1px solid #ddd6fe' }}>For employers</span>
                </div>
                <ArrowRight style={{ width: 18, height: 18, color: '#cbd5e1', flexShrink: 0 }} />
              </div>
            </Link>
          </div>

          {/* Divider */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20 }}>
            <div style={{ flex: 1, height: 1, background: '#e2e8f0' }} />
            <span style={{ fontSize: 11, color: '#94a3b8', fontWeight: 500 }}>or</span>
            <div style={{ flex: 1, height: 1, background: '#e2e8f0' }} />
          </div>

          {/* Google */}
          <button style={{
            width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 12,
            padding: '13px 20px', borderRadius: 13, border: '2px solid #e2e8f0',
            background: 'white', color: '#374151', fontWeight: 600, fontSize: 14,
            cursor: 'pointer', fontFamily: 'inherit', marginBottom: 20,
            boxShadow: '0 1px 4px rgba(0,0,0,0.04)', transition: 'all 0.15s',
          }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = '#cbd5e1'; e.currentTarget.style.background = '#f8fafc' }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = '#e2e8f0'; e.currentTarget.style.background = 'white' }}>
            <svg viewBox="0 0 24 24" style={{ width: 18, height: 18, flexShrink: 0 }}>
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            Continue with Google
          </button>

          <p style={{ textAlign: 'center', fontSize: 13, color: '#64748b' }}>
            Already have an account?{' '}
            <Link href="/auth/login" style={{ color: '#2563eb', fontWeight: 700, textDecoration: 'none' }}>Sign in</Link>
          </p>
        </div>
      </div>

      <style>{`
        .register-left { display: none; }
        .register-mobile-logo { display: block; }
        @media (min-width: 900px) {
          .register-left { display: flex !important; }
          .register-mobile-logo { display: none !important; }
        }
      `}</style>
    </div>
  )
}
