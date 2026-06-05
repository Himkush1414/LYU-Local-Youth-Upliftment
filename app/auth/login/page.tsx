'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Eye, EyeOff, ArrowLeft, ArrowRight, Loader2, AlertCircle } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'

export default function LoginPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [googleLoading, setGoogleLoading] = useState(false)
  const [showPass, setShowPass] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [focusEmail, setFocusEmail] = useState(false)
  const [focusPass, setFocusPass] = useState(false)

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      const supabase = createClient()
      const { data, error: err } = await supabase.auth.signInWithPassword({
        email: email.trim().toLowerCase(),
        password,
      })
      if (err) throw err
      const role = data.user?.user_metadata?.role
      if (role === 'employer') router.push('/employer/dashboard')
      else router.push('/seeker/dashboard')
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Invalid email or password'
      setError(msg === 'Invalid login credentials' ? 'Wrong email or password. Please try again.' : msg)
      setLoading(false)
    }
  }

  async function handleGoogle() {
    setGoogleLoading(true)
    setError('')
    try {
      const supabase = createClient()
      const { error: err } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: { redirectTo: `${window.location.origin}/auth/callback` },
      })
      if (err) throw err
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Google login failed'
      setError(msg)
      setGoogleLoading(false)
    }
  }

  return (
    <>
      <style>{`
        * { box-sizing: border-box; }
        body { font-family: Inter, system-ui, sans-serif; }
        @keyframes spin { from{transform:rotate(0deg)} to{transform:rotate(360deg)} }
        @keyframes fadeIn { from{opacity:0;transform:translateY(8px)} to{opacity:1;transform:translateY(0)} }
        .login-left { display: none; }
        @media(min-width:900px) { .login-left { display: flex !important; } }
        input:-webkit-autofill { -webkit-box-shadow:0 0 0 30px white inset!important; -webkit-text-fill-color:#0f172a!important; }
      `}</style>

      <div style={{ minHeight: '100vh', display: 'flex', fontFamily: 'Inter, system-ui, sans-serif', background: '#fafbff' }}>

        {/* Left panel — desktop only */}
        <div className="login-left" style={{
          width: '46%', flexDirection: 'column', justifyContent: 'space-between',
          padding: '48px 56px', position: 'relative', overflow: 'hidden',
          background: 'linear-gradient(145deg,#1e3a8a 0%,#1d4ed8 50%,#4f46e5 100%)',
        }}>
          <div style={{ position: 'absolute', top: -80, left: -80, width: 320, height: 320, background: 'rgba(255,255,255,0.05)', borderRadius: '50%', filter: 'blur(60px)', pointerEvents: 'none' }} />
          <div style={{ position: 'absolute', bottom: 40, right: -40, width: 280, height: 280, background: 'rgba(99,102,241,0.2)', borderRadius: '50%', filter: 'blur(50px)', pointerEvents: 'none' }} />

          <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: 10, textDecoration: 'none', position: 'relative', zIndex: 1 }}>
            <div style={{ width: 38, height: 38, borderRadius: 11, background: 'rgba(255,255,255,0.18)', border: '1px solid rgba(255,255,255,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <span style={{ color: 'white', fontWeight: 900, fontSize: 12 }}>LY</span>
            </div>
            <span style={{ color: 'white', fontWeight: 900, fontSize: 20 }}>LYU</span>
          </Link>

          <div style={{ position: 'relative', zIndex: 1, display: 'flex', flexDirection: 'column', gap: 28 }}>
            <div>
              <h2 style={{ fontSize: 'clamp(1.8rem,2.5vw,2.5rem)', fontWeight: 900, color: 'white', lineHeight: 1.1, marginBottom: 14, letterSpacing: '-0.02em' }}>
                Your next job is<br /><span style={{ color: '#93c5fd' }}>right here.</span>
              </h2>
              <p style={{ color: '#bfdbfe', fontSize: 15, lineHeight: 1.7 }}>AI matches your skills to verified local jobs. Free forever for job seekers.</p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 10 }}>
              {[['12K+','Active Jobs'],['4.5K+','Placed'],['180+','Cities']].map(([v,l]) => (
                <div key={l} style={{ background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.15)', borderRadius: 14, padding: '14px 10px', textAlign: 'center' }}>
                  <p style={{ fontSize: 20, fontWeight: 900, color: 'white' }}>{v}</p>
                  <p style={{ fontSize: 11, color: '#93c5fd', marginTop: 3 }}>{l}</p>
                </div>
              ))}
            </div>

            {['"Got a job 2km from home in 3 days. Incredible."','"Hired 12 local candidates in one month."'].map((q,i) => (
              <div key={i} style={{ background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.12)', borderRadius: 14, padding: '14px 18px' }}>
                <p style={{ color: 'white', fontSize: 13, lineHeight: 1.6 }}>{q}</p>
              </div>
            ))}
          </div>

          <p style={{ color: '#93c5fd', fontSize: 12, position: 'relative', zIndex: 1 }}>© 2026 LYU · Free for job seekers forever</p>
        </div>

        {/* Right form */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '40px 24px', overflowY: 'auto' }}>
          <div style={{ width: '100%', maxWidth: 420 }} className="fadeIn">

            <Link href="/" style={{ display: 'inline-flex', alignItems: 'center', gap: 7, fontSize: 13, color: '#64748b', textDecoration: 'none', marginBottom: 36, fontWeight: 500 }}>
              <ArrowLeft style={{ width: 14, height: 14 }} /> Back to home
            </Link>

            {/* Mobile logo */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 9, marginBottom: 28 }}>
              <div style={{ width: 34, height: 34, borderRadius: 10, background: 'linear-gradient(135deg,#2563eb,#4f46e5)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 0 16px rgba(37,99,235,0.3)' }}>
                <span style={{ color: 'white', fontWeight: 900, fontSize: 12 }}>LY</span>
              </div>
              <span style={{ fontWeight: 900, fontSize: 19, color: '#0f172a' }}>LYU</span>
            </div>

            <h1 style={{ fontSize: 28, fontWeight: 900, color: '#0f172a', marginBottom: 6, letterSpacing: '-0.02em' }}>Welcome back</h1>
            <p style={{ color: '#64748b', fontSize: 14, marginBottom: 28 }}>Sign in to your LYU account to continue</p>

            {/* Google */}
            <button onClick={handleGoogle} disabled={googleLoading} style={{
              width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 12,
              padding: '13px 20px', borderRadius: 13, border: '2px solid #e2e8f0',
              background: 'white', color: '#374151', fontWeight: 600, fontSize: 14,
              cursor: googleLoading ? 'not-allowed' : 'pointer', fontFamily: 'inherit',
              boxShadow: '0 1px 4px rgba(0,0,0,0.04)', transition: 'all 0.15s', opacity: googleLoading ? 0.7 : 1,
            }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = '#cbd5e1'; e.currentTarget.style.background = '#f8fafc' }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = '#e2e8f0'; e.currentTarget.style.background = 'white' }}>
              {googleLoading
                ? <Loader2 style={{ width: 18, height: 18, animation: 'spin 1s linear infinite' }} />
                : <svg viewBox="0 0 24 24" style={{ width: 18, height: 18, flexShrink: 0 }}>
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                  </svg>
              }
              Continue with Google
            </button>

            <div style={{ display: 'flex', alignItems: 'center', gap: 12, margin: '20px 0', color: '#94a3b8', fontSize: 12 }}>
              <div style={{ flex: 1, height: 1, background: '#e2e8f0' }} />
              or continue with email
              <div style={{ flex: 1, height: 1, background: '#e2e8f0' }} />
            </div>

            {error && (
              <div className="fadeIn" style={{ display: 'flex', alignItems: 'flex-start', gap: 10, background: '#fef2f2', border: '1px solid #fecaca', color: '#b91c1c', fontSize: 13, padding: '11px 14px', borderRadius: 12, marginBottom: 16, lineHeight: 1.5 }}>
                <AlertCircle style={{ width: 15, height: 15, flexShrink: 0, marginTop: 1 }} /> {error}
              </div>
            )}

            <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <div>
                <label style={{ display: 'block', fontSize: 11, fontWeight: 700, color: '#374151', textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: 8 }}>Email address</label>
                <input type="email" placeholder="you@example.com" value={email}
                  onChange={e => setEmail(e.target.value)}
                  onFocus={() => setFocusEmail(true)} onBlur={() => setFocusEmail(false)}
                  required
                  style={{ width: '100%', background: 'white', border: `2px solid ${focusEmail ? '#2563eb' : '#e2e8f0'}`, borderRadius: 12, padding: '12px 15px', color: '#0f172a', fontSize: 14, fontFamily: 'inherit', outline: 'none', transition: 'border-color 0.15s', boxShadow: focusEmail ? '0 0 0 3px rgba(37,99,235,0.1)' : 'none' }} />
              </div>

              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                  <label style={{ fontSize: 11, fontWeight: 700, color: '#374151', textTransform: 'uppercase', letterSpacing: '0.07em' }}>Password</label>
                  <Link href="/auth/forgot-password" style={{ fontSize: 12, color: '#2563eb', fontWeight: 600, textDecoration: 'none' }}>Forgot password?</Link>
                </div>
                <div style={{ position: 'relative' }}>
                  <input type={showPass ? 'text' : 'password'} placeholder="••••••••" value={password}
                    onChange={e => setPassword(e.target.value)}
                    onFocus={() => setFocusPass(true)} onBlur={() => setFocusPass(false)}
                    required
                    style={{ width: '100%', background: 'white', border: `2px solid ${focusPass ? '#2563eb' : '#e2e8f0'}`, borderRadius: 12, padding: '12px 46px 12px 15px', color: '#0f172a', fontSize: 14, fontFamily: 'inherit', outline: 'none', transition: 'border-color 0.15s', boxShadow: focusPass ? '0 0 0 3px rgba(37,99,235,0.1)' : 'none' }} />
                  <button type="button" onClick={() => setShowPass(!showPass)} style={{ position: 'absolute', right: 13, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: '#94a3b8', display: 'flex', alignItems: 'center', padding: 0 }}>
                    {showPass ? <EyeOff style={{ width: 17, height: 17 }} /> : <Eye style={{ width: 17, height: 17 }} />}
                  </button>
                </div>
              </div>

              <button type="submit" disabled={loading} style={{
                width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                padding: '14px 20px', borderRadius: 13, border: 'none',
                background: loading ? '#93c5fd' : 'linear-gradient(135deg,#2563eb,#1d4ed8)',
                color: 'white', fontWeight: 700, fontSize: 15,
                cursor: loading ? 'not-allowed' : 'pointer', fontFamily: 'inherit',
                boxShadow: '0 4px 16px rgba(37,99,235,0.3)', transition: 'all 0.15s', marginTop: 4,
              }}>
                {loading
                  ? <><Loader2 style={{ width: 18, height: 18, animation: 'spin 1s linear infinite' }} /> Signing in...</>
                  : <><span>Sign In</span><ArrowRight style={{ width: 17, height: 17 }} /></>
                }
              </button>
            </form>

            <p style={{ textAlign: 'center', fontSize: 13, color: '#64748b', marginTop: 24 }}>
              Don't have an account?{' '}
              <Link href="/auth/register" style={{ color: '#2563eb', fontWeight: 700, textDecoration: 'none' }}>Create one free</Link>
            </p>
          </div>
        </div>
      </div>
    </>
  )
}
