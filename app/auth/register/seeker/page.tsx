'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Eye, EyeOff, ArrowLeft, ArrowRight, Loader2, AlertCircle, CheckCircle, X } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'

function getStrength(p: string) {
  let s = 0
  if (p.length >= 8) s++
  if (/[A-Z]/.test(p)) s++
  if (/[a-z]/.test(p)) s++
  if (/[0-9]/.test(p)) s++
  if (/[^A-Za-z0-9]/.test(p)) s++
  const map = ['', 'Weak', 'Fair', 'Good', 'Strong', 'Very Strong']
  const colors = ['', '#ef4444', '#f97316', '#eab308', '#22c55e', '#16a34a']
  const widths = ['0%', '20%', '40%', '60%', '80%', '100%']
  return { score: s, label: map[s], color: colors[s], width: widths[s] }
}

const RULES = [
  { label: 'At least 8 characters', test: (p: string) => p.length >= 8 },
  { label: 'One uppercase letter', test: (p: string) => /[A-Z]/.test(p) },
  { label: 'One lowercase letter', test: (p: string) => /[a-z]/.test(p) },
  { label: 'One number', test: (p: string) => /[0-9]/.test(p) },
  { label: 'One special character', test: (p: string) => /[^A-Za-z0-9]/.test(p) },
]

export default function SeekerRegisterPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [showPass, setShowPass] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [error, setError] = useState('')
  const [focusField, setFocusField] = useState('')

  const strength = getStrength(password)
  const allRulesPassed = RULES.every(r => r.test(password))
  const passwordsMatch = password === confirm && confirm.length > 0

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!allRulesPassed) { setError('Please meet all password requirements'); return }
    if (!passwordsMatch) { setError('Passwords do not match'); return }
    setLoading(true)
    setError('')
    try {
      const supabase = createClient()
      const { error: signUpError } = await supabase.auth.signUp({
        email: email.trim().toLowerCase(),
        password,
        options: {
          data: { full_name: fullName.trim(), role: 'seeker' },
        },
      })
      if (signUpError) throw signUpError
      // Pass email to OTP page so it can verify correctly
      router.push(`/auth/verify-email?email=${encodeURIComponent(email.trim().toLowerCase())}`)
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Something went wrong'
      setError(msg)
      setLoading(false)
    }
  }

  const inputBorder = (field: string, hasErr: boolean) =>
    hasErr ? '#ef4444' : focusField === field ? '#2563eb' : '#e2e8f0'

  return (
    <>
      <style>{`
        * { box-sizing: border-box; }
        @keyframes spin { from{transform:rotate(0deg)} to{transform:rotate(360deg)} }
        .sk-left { display: none; }
        @media(min-width:900px) { .sk-left { display: flex !important; } }
        input:-webkit-autofill { -webkit-box-shadow:0 0 0 30px white inset!important; -webkit-text-fill-color:#0f172a!important; }
      `}</style>

      <div style={{ minHeight: '100vh', display: 'flex', fontFamily: 'Inter, system-ui, sans-serif', background: '#fafbff' }}>

        {/* Left panel — desktop only */}
        <div className="sk-left" style={{
          width: '46%', flexDirection: 'column', justifyContent: 'space-between',
          padding: '48px 56px', position: 'relative', overflow: 'hidden',
          background: 'linear-gradient(145deg,#1d4ed8 0%,#2563eb 60%,#3b82f6 100%)',
        }}>
          <div style={{ position: 'absolute', top: -80, left: -80, width: 320, height: 320, background: 'rgba(255,255,255,0.05)', borderRadius: '50%', filter: 'blur(60px)', pointerEvents: 'none' }} />
          <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: 10, textDecoration: 'none', position: 'relative', zIndex: 1 }}>
            <div style={{ width: 38, height: 38, borderRadius: 11, background: 'rgba(255,255,255,0.18)', border: '1px solid rgba(255,255,255,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <span style={{ color: 'white', fontWeight: 900, fontSize: 12 }}>LY</span>
            </div>
            <span style={{ color: 'white', fontWeight: 900, fontSize: 20 }}>LYU</span>
          </Link>

          <div style={{ position: 'relative', zIndex: 1, display: 'flex', flexDirection: 'column', gap: 24 }}>
            <div>
              <h2 style={{ fontSize: 'clamp(1.8rem,2.5vw,2.4rem)', fontWeight: 900, color: 'white', lineHeight: 1.1, marginBottom: 14, letterSpacing: '-0.02em' }}>
                Start your journey<br /><span style={{ color: '#bfdbfe' }}>to a better job</span>
              </h2>
              <p style={{ color: '#bfdbfe', fontSize: 15, lineHeight: 1.7 }}>AI matches your skills to jobs near you. Free forever for job seekers.</p>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {['Free to join — always free', 'AI-powered job matching', 'Jobs in your city and district', 'Real-time application tracking'].map(p => (
                <div key={p} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <CheckCircle style={{ width: 15, height: 15, color: '#93c5fd', flexShrink: 0 }} />
                  <span style={{ color: '#e0e7ff', fontSize: 14, fontWeight: 500 }}>{p}</span>
                </div>
              ))}
            </div>
            <div style={{ background: 'rgba(255,255,255,0.1)', borderRadius: 16, padding: '18px 20px', border: '1px solid rgba(255,255,255,0.18)' }}>
              <p style={{ color: 'white', fontSize: 13, fontWeight: 600, lineHeight: 1.5, marginBottom: 6 }}>"Found a job 4km from home in 3 days"</p>
              <p style={{ color: '#93c5fd', fontSize: 11 }}>Priya S. — placed at TechCorp, Chandigarh</p>
            </div>
          </div>
          <p style={{ color: '#93c5fd', fontSize: 12, position: 'relative', zIndex: 1 }}>© 2026 LYU · Free for job seekers</p>
        </div>

        {/* Right form */}
        <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '40px 24px', overflowY: 'auto' }}>
          <div style={{ width: '100%', maxWidth: 420 }}>

            <Link href="/auth/register" style={{ display: 'inline-flex', alignItems: 'center', gap: 7, fontSize: 13, color: '#64748b', textDecoration: 'none', marginBottom: 32, fontWeight: 500 }}>
              <ArrowLeft style={{ width: 14, height: 14 }} /> Back
            </Link>

            {/* Badge */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 28 }}>
              <div style={{ width: 40, height: 40, borderRadius: 12, background: '#eff6ff', border: '1px solid #dbeafe', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <svg style={{ width: 20, height: 20, color: '#2563eb' }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
              <div>
                <h1 style={{ fontSize: 24, fontWeight: 900, color: '#0f172a', letterSpacing: '-0.02em' }}>Create your account</h1>
                <p style={{ fontSize: 13, color: '#94a3b8', marginTop: 2 }}>Job Seeker · Free forever</p>
              </div>
            </div>

            {error && (
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10, background: '#fef2f2', border: '1px solid #fecaca', color: '#b91c1c', fontSize: 13, padding: '11px 14px', borderRadius: 12, marginBottom: 18, lineHeight: 1.5 }}>
                <AlertCircle style={{ width: 15, height: 15, flexShrink: 0, marginTop: 1 }} /> {error}
              </div>
            )}

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>

              {/* Full Name */}
              <div>
                <label style={{ display: 'block', fontSize: 11, fontWeight: 700, color: '#374151', textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: 8 }}>Full Name</label>
                <input type="text" placeholder="Manik Rana" value={fullName}
                  onChange={e => setFullName(e.target.value)}
                  onFocus={() => setFocusField('name')} onBlur={() => setFocusField('')}
                  required
                  style={{ width: '100%', background: 'white', border: `2px solid ${inputBorder('name', false)}`, borderRadius: 12, padding: '12px 15px', color: '#0f172a', fontSize: 14, fontFamily: 'inherit', outline: 'none', transition: 'border-color 0.15s' }} />
              </div>

              {/* Email */}
              <div>
                <label style={{ display: 'block', fontSize: 11, fontWeight: 700, color: '#374151', textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: 8 }}>Email Address</label>
                <input type="email" placeholder="rahul@gmail.com" value={email}
                  onChange={e => setEmail(e.target.value)}
                  onFocus={() => setFocusField('email')} onBlur={() => setFocusField('')}
                  required
                  style={{ width: '100%', background: 'white', border: `2px solid ${inputBorder('email', false)}`, borderRadius: 12, padding: '12px 15px', color: '#0f172a', fontSize: 14, fontFamily: 'inherit', outline: 'none', transition: 'border-color 0.15s' }} />
              </div>

              {/* Password */}
              <div>
                <label style={{ display: 'block', fontSize: 11, fontWeight: 700, color: '#374151', textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: 8 }}>Password</label>
                <div style={{ position: 'relative' }}>
                  <input type={showPass ? 'text' : 'password'} placeholder="Create a strong password"
                    value={password} onChange={e => setPassword(e.target.value)}
                    onFocus={() => setFocusField('pass')} onBlur={() => setFocusField('')}
                    required
                    style={{ width: '100%', background: 'white', border: `2px solid ${inputBorder('pass', false)}`, borderRadius: 12, padding: '12px 46px 12px 15px', color: '#0f172a', fontSize: 14, fontFamily: 'inherit', outline: 'none', transition: 'border-color 0.15s' }} />
                  <button type="button" onClick={() => setShowPass(!showPass)} style={{ position: 'absolute', right: 13, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: '#94a3b8', padding: 0, display: 'flex' }}>
                    {showPass ? <EyeOff style={{ width: 17, height: 17 }} /> : <Eye style={{ width: 17, height: 17 }} />}
                  </button>
                </div>

                {/* Strength bar */}
                {password.length > 0 && (
                  <div style={{ marginTop: 10 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
                      <div style={{ flex: 1, height: 5, background: '#f1f5f9', borderRadius: 9999, overflow: 'hidden' }}>
                        <div style={{ height: '100%', width: strength.width, background: strength.color, borderRadius: 9999, transition: 'all 0.4s ease' }} />
                      </div>
                      <span style={{ fontSize: 11, fontWeight: 700, color: strength.color, minWidth: 60 }}>{strength.label}</span>
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '4px 12px' }}>
                      {RULES.map(r => (
                        <div key={r.label} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                          {r.test(password)
                            ? <CheckCircle style={{ width: 12, height: 12, color: '#22c55e', flexShrink: 0 }} />
                            : <X style={{ width: 12, height: 12, color: '#cbd5e1', flexShrink: 0 }} />}
                          <span style={{ fontSize: 11, color: r.test(password) ? '#16a34a' : '#94a3b8' }}>{r.label}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Confirm Password */}
              <div>
                <label style={{ display: 'block', fontSize: 11, fontWeight: 700, color: '#374151', textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: 8 }}>Confirm Password</label>
                <div style={{ position: 'relative' }}>
                  <input type={showConfirm ? 'text' : 'password'} placeholder="Repeat your password"
                    value={confirm} onChange={e => setConfirm(e.target.value)}
                    onFocus={() => setFocusField('confirm')} onBlur={() => setFocusField('')}
                    required
                    style={{ width: '100%', background: 'white', border: `2px solid ${confirm.length > 0 && !passwordsMatch ? '#ef4444' : inputBorder('confirm', false)}`, borderRadius: 12, padding: '12px 46px 12px 15px', color: '#0f172a', fontSize: 14, fontFamily: 'inherit', outline: 'none', transition: 'border-color 0.15s' }} />
                  <button type="button" onClick={() => setShowConfirm(!showConfirm)} style={{ position: 'absolute', right: 13, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: '#94a3b8', padding: 0, display: 'flex' }}>
                    {showConfirm ? <EyeOff style={{ width: 17, height: 17 }} /> : <Eye style={{ width: 17, height: 17 }} />}
                  </button>
                </div>
                {confirm.length > 0 && !passwordsMatch && (
                  <p style={{ color: '#ef4444', fontSize: 12, marginTop: 5 }}>Passwords do not match</p>
                )}
                {confirm.length > 0 && passwordsMatch && (
                  <p style={{ color: '#16a34a', fontSize: 12, marginTop: 5, display: 'flex', alignItems: 'center', gap: 4 }}>
                    <CheckCircle style={{ width: 12, height: 12 }} /> Passwords match
                  </p>
                )}
              </div>

              <button type="submit" disabled={loading || !allRulesPassed || !passwordsMatch} style={{
                width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                padding: '14px 20px', borderRadius: 13, border: 'none',
                background: (loading || !allRulesPassed || !passwordsMatch) ? '#93c5fd' : 'linear-gradient(135deg,#2563eb,#1d4ed8)',
                color: 'white', fontWeight: 700, fontSize: 15,
                cursor: (loading || !allRulesPassed || !passwordsMatch) ? 'not-allowed' : 'pointer',
                fontFamily: 'inherit', boxShadow: '0 4px 16px rgba(37,99,235,0.25)', marginTop: 4,
              }}>
                {loading
                  ? <><Loader2 style={{ width: 18, height: 18, animation: 'spin 1s linear infinite' }} /> Creating account...</>
                  : <>Create Account <ArrowRight style={{ width: 17, height: 17 }} /></>
                }
              </button>
            </form>

            <p style={{ textAlign: 'center', fontSize: 13, color: '#64748b', marginTop: 24 }}>
              Already have an account?{' '}
              <Link href="/auth/login" style={{ color: '#2563eb', fontWeight: 700, textDecoration: 'none' }}>Sign in</Link>
            </p>

            <p style={{ textAlign: 'center', fontSize: 11, color: '#94a3b8', marginTop: 12, lineHeight: 1.6 }}>
              By creating an account you agree to our{' '}
              <Link href="/terms" style={{ color: '#64748b', textDecoration: 'underline' }}>Terms</Link> and{' '}
              <Link href="/privacy" style={{ color: '#64748b', textDecoration: 'underline' }}>Privacy Policy</Link>
            </p>
          </div>
        </div>
      </div>
    </>
  )
}
