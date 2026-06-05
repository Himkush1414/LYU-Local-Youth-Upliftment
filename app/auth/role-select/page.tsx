'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Loader2 } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'

export default function RoleSelectPage() {
  const router = useRouter()
  const [selected, setSelected] = useState<'seeker' | 'employer' | null>(null)
  const [loading, setLoading] = useState(false)
  const supabase = createClient()

  const handleContinue = async () => {
    if (!selected) return
    setLoading(true)
    try {
      await supabase.auth.updateUser({ data: { role: selected } })
      if (selected === 'seeker') router.push('/auth/onboarding')
      else router.push('/employer/dashboard')
    } catch { setLoading(false) }
  }

  return (
    <div style={{ minHeight: '100vh', background: '#f8fafc', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '24px', fontFamily: 'Inter, system-ui, sans-serif' }}>
      <div style={{ width: '100%', maxWidth: 480 }}>

        {/* Logo */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10, marginBottom: 40 }}>
          <div style={{ width: 44, height: 44, borderRadius: 13, background: 'linear-gradient(135deg,#2563eb,#4f46e5)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 0 20px rgba(37,99,235,0.3)' }}>
            <span style={{ color: 'white', fontWeight: 900, fontSize: 14 }}>LY</span>
          </div>
          <span style={{ fontWeight: 900, fontSize: 22, color: '#0f172a', letterSpacing: '-0.02em' }}>LYU</span>
        </div>

        {/* Heading */}
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <h1 style={{ fontSize: 28, fontWeight: 900, color: '#0f172a', marginBottom: 8, letterSpacing: '-0.02em' }}>Who are you?</h1>
          <p style={{ color: '#64748b', fontSize: 15 }}>This helps us personalise your experience</p>
        </div>

        {/* Cards */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14, marginBottom: 28 }}>

          {/* Job Seeker */}
          <button onClick={() => setSelected('seeker')} style={{
            display: 'flex', alignItems: 'center', gap: 18,
            background: selected === 'seeker' ? '#eff6ff' : 'white',
            border: `2px solid ${selected === 'seeker' ? '#2563eb' : '#e2e8f0'}`,
            borderRadius: 18, padding: '20px 22px', cursor: 'pointer',
            textAlign: 'left', width: '100%', fontFamily: 'inherit',
            boxShadow: selected === 'seeker' ? '0 8px 24px rgba(37,99,235,0.12)' : '0 1px 4px rgba(0,0,0,0.04)',
            transition: 'all 0.2s', position: 'relative',
          }}>
            {/* Icon */}
            <div style={{ width: 54, height: 54, borderRadius: 15, background: selected === 'seeker' ? '#dbeafe' : '#f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, transition: 'all 0.2s' }}>
              <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke={selected === 'seeker' ? '#2563eb' : '#64748b'} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                <circle cx="12" cy="7" r="4"/>
              </svg>
            </div>
            <div style={{ flex: 1 }}>
              <p style={{ fontWeight: 900, color: '#0f172a', fontSize: 17, marginBottom: 4 }}>Job Seeker</p>
              <p style={{ color: '#64748b', fontSize: 13, lineHeight: 1.5, marginBottom: 8 }}>Find local jobs, get AI matched, track applications, build your resume</p>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                {['Free forever', 'AI matching', 'Resume builder'].map(t => (
                  <span key={t} style={{ fontSize: 11, fontWeight: 700, color: '#2563eb', background: '#eff6ff', padding: '3px 10px', borderRadius: 9999, border: '1px solid #bfdbfe' }}>{t}</span>
                ))}
              </div>
            </div>
            {/* Check */}
            {selected === 'seeker' && (
              <div style={{ position: 'absolute', top: 14, right: 14, width: 22, height: 22, background: '#2563eb', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="20 6 9 17 4 12"/>
                </svg>
              </div>
            )}
          </button>

          {/* Employer */}
          <button onClick={() => setSelected('employer')} style={{
            display: 'flex', alignItems: 'center', gap: 18,
            background: selected === 'employer' ? '#faf5ff' : 'white',
            border: `2px solid ${selected === 'employer' ? '#7c3aed' : '#e2e8f0'}`,
            borderRadius: 18, padding: '20px 22px', cursor: 'pointer',
            textAlign: 'left', width: '100%', fontFamily: 'inherit',
            boxShadow: selected === 'employer' ? '0 8px 24px rgba(124,58,237,0.12)' : '0 1px 4px rgba(0,0,0,0.04)',
            transition: 'all 0.2s', position: 'relative',
          }}>
            <div style={{ width: 54, height: 54, borderRadius: 15, background: selected === 'employer' ? '#ede9fe' : '#f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, transition: 'all 0.2s' }}>
              <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke={selected === 'employer' ? '#7c3aed' : '#64748b'} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="2" y="7" width="20" height="14" rx="2"/>
                <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/>
              </svg>
            </div>
            <div style={{ flex: 1 }}>
              <p style={{ fontWeight: 900, color: '#0f172a', fontSize: 17, marginBottom: 4 }}>Employer</p>
              <p style={{ color: '#64748b', fontSize: 13, lineHeight: 1.5, marginBottom: 8 }}>Post jobs, find verified local talent, manage applicants, grow your team</p>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                {['Post jobs', 'AI screening', 'Analytics'].map(t => (
                  <span key={t} style={{ fontSize: 11, fontWeight: 700, color: '#7c3aed', background: '#f5f3ff', padding: '3px 10px', borderRadius: 9999, border: '1px solid #ddd6fe' }}>{t}</span>
                ))}
              </div>
            </div>
            {selected === 'employer' && (
              <div style={{ position: 'absolute', top: 14, right: 14, width: 22, height: 22, background: '#7c3aed', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="20 6 9 17 4 12"/>
                </svg>
              </div>
            )}
          </button>
        </div>

        {/* Continue button */}
        <button onClick={handleContinue} disabled={!selected || loading} style={{
          width: '100%', padding: '15px 20px', borderRadius: 14, border: 'none',
          background: !selected ? '#e2e8f0' : selected === 'seeker' ? 'linear-gradient(135deg,#2563eb,#1d4ed8)' : 'linear-gradient(135deg,#7c3aed,#6d28d9)',
          color: !selected ? '#94a3b8' : 'white', fontWeight: 700, fontSize: 15,
          cursor: !selected || loading ? 'not-allowed' : 'pointer',
          fontFamily: 'inherit', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
          boxShadow: selected ? '0 4px 16px rgba(37,99,235,0.25)' : 'none',
          transition: 'all 0.2s',
        }}>
          {loading ? <Loader2 style={{ width: 18, height: 18, animation: 'spin 1s linear infinite' }} /> : (
            <>
              Continue
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/>
              </svg>
            </>
          )}
        </button>

        <p style={{ textAlign: 'center', fontSize: 13, color: '#94a3b8', marginTop: 20 }}>
          You can change this later in your settings
        </p>
      </div>
      <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
    </div>
  )
}
