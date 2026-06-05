'use client'

import { useState, useRef, useEffect, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, CheckCircle, RefreshCw, AlertCircle } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'

function VerifyEmailContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const email = searchParams.get('email') || ''

  const [otp, setOtp] = useState(['', '', '', '', '', ''])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [resending, setResending] = useState(false)
  const [resent, setResent] = useState(false)
  const [countdown, setCountdown] = useState(60)
  const [canResend, setCanResend] = useState(false)
  const [shake, setShake] = useState(false)
  const inputs = useRef<(HTMLInputElement | null)[]>([])

  useEffect(() => {
    inputs.current[0]?.focus()
    const timer = setInterval(() => {
      setCountdown(c => {
        if (c <= 1) { setCanResend(true); clearInterval(timer); return 0 }
        return c - 1
      })
    }, 1000)
    return () => clearInterval(timer)
  }, [])

  const handleChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return
    const next = [...otp]
    next[index] = value.slice(-1)
    setOtp(next)
    setError('')
    if (value && index < 5) {
      inputs.current[index + 1]?.focus()
    }
    if (next.every(d => d !== '') && next.join('').length === 6) {
      submitOtp(next.join(''))
    }
  }

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputs.current[index - 1]?.focus()
    }
  }

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault()
    const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6)
    if (pasted.length === 6) {
      const next = pasted.split('')
      setOtp(next)
      inputs.current[5]?.focus()
      submitOtp(pasted)
    }
  }

  const submitOtp = async (token: string) => {
    if (!email) {
      setError('Email not found. Please go back and register again.')
      return
    }
    setLoading(true)
    setError('')
    try {
      const supabase = createClient()
      const { data, error: verifyError } = await supabase.auth.verifyOtp({
        email,
        token,
        type: 'signup',
      })

      if (verifyError) throw verifyError
      if (!data.user) throw new Error('Verification failed. Please try again.')

      // Success — go to role selection or onboarding
      router.push('/auth/role-select')
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Invalid or expired code. Please try again.'
      setError(msg)
      setShake(true)
      setOtp(['', '', '', '', '', ''])
      setTimeout(() => {
        setShake(false)
        inputs.current[0]?.focus()
      }, 600)
    } finally {
      setLoading(false)
    }
  }

  const handleResend = async () => {
    if (!canResend || !email) return
    setResending(true)
    setError('')
    try {
      const supabase = createClient()
      const { error: resendError } = await supabase.auth.resend({
        email,
        type: 'signup',
      })
      if (resendError) throw resendError
      setResent(true)
      setCanResend(false)
      setCountdown(60)
      setTimeout(() => setResent(false), 5000)
      const timer = setInterval(() => {
        setCountdown(c => {
          if (c <= 1) { setCanResend(true); clearInterval(timer); return 0 }
          return c - 1
        })
      }, 1000)
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to resend. Try again in a moment.'
      setError(msg)
    } finally {
      setResending(false)
    }
  }

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f8fafc', padding: '24px', fontFamily: 'Inter, system-ui, sans-serif' }}>
      <style>{`
        @keyframes shake {
          0%,100%{transform:translateX(0)}
          15%{transform:translateX(-10px)}
          30%{transform:translateX(10px)}
          45%{transform:translateX(-8px)}
          60%{transform:translateX(8px)}
          75%{transform:translateX(-4px)}
          90%{transform:translateX(4px)}
        }
        @keyframes spin { from{transform:rotate(0deg)} to{transform:rotate(360deg)} }
        @keyframes fadeIn { from{opacity:0;transform:translateY(8px)} to{opacity:1;transform:translateY(0)} }
        .otp-shake { animation: shake 0.5s ease; }
        .fade-in { animation: fadeIn 0.3s ease; }
        input::-webkit-outer-spin-button,
        input::-webkit-inner-spin-button { -webkit-appearance: none; margin: 0; }
        input[type=number] { -moz-appearance: textfield; }
      `}</style>

      <div style={{ width: '100%', maxWidth: 460 }} className="fade-in">

        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <Link href="/" style={{ display: 'inline-flex', alignItems: 'center', gap: 9, textDecoration: 'none', marginBottom: 28 }}>
            <div style={{ width: 40, height: 40, borderRadius: 12, background: 'linear-gradient(135deg,#2563eb,#4f46e5)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 0 16px rgba(37,99,235,0.3)' }}>
              <span style={{ color: 'white', fontWeight: 900, fontSize: 13 }}>LY</span>
            </div>
            <span style={{ fontWeight: 900, fontSize: 20, color: '#0f172a' }}>LYU</span>
          </Link>

          {/* Email icon */}
          <div style={{ width: 72, height: 72, borderRadius: 20, background: 'linear-gradient(135deg,#eff6ff,#dbeafe)', border: '2px solid #bfdbfe', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px' }}>
            <svg style={{ width: 32, height: 32, color: '#2563eb' }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
            </svg>
          </div>

          <h1 style={{ fontSize: 26, fontWeight: 900, color: '#0f172a', marginBottom: 8, letterSpacing: '-0.02em' }}>Check your email</h1>
          <p style={{ color: '#64748b', fontSize: 14, lineHeight: 1.65 }}>
            We sent a 6-digit verification code to
          </p>
          <p style={{ color: '#1d4ed8', fontSize: 15, fontWeight: 700, marginTop: 4 }}>
            {email || 'your email'}
          </p>
        </div>

        {/* Card */}
        <div style={{ background: 'white', borderRadius: 24, border: '1px solid #e2e8f0', boxShadow: '0 4px 24px rgba(0,0,0,0.06)', padding: '32px 32px 28px' }}>

          {/* Error */}
          {error && (
            <div className="fade-in" style={{ display: 'flex', alignItems: 'flex-start', gap: 10, background: '#fef2f2', border: '1px solid #fecaca', color: '#b91c1c', fontSize: 13, padding: '11px 14px', borderRadius: 12, marginBottom: 24, lineHeight: 1.5 }}>
              <AlertCircle style={{ width: 15, height: 15, flexShrink: 0, marginTop: 1 }} /> {error}
            </div>
          )}

          {/* Resent confirmation */}
          {resent && (
            <div className="fade-in" style={{ display: 'flex', alignItems: 'center', gap: 8, background: '#f0fdf4', border: '1px solid #bbf7d0', color: '#15803d', fontSize: 13, fontWeight: 600, padding: '10px 14px', borderRadius: 12, marginBottom: 24 }}>
              <CheckCircle style={{ width: 15, height: 15 }} /> New code sent! Check your inbox.
            </div>
          )}

          <p style={{ textAlign: 'center', fontSize: 13, color: '#64748b', marginBottom: 20 }}>Enter the 6-digit code below</p>

          {/* OTP Input Boxes */}
          <div
            className={shake ? 'otp-shake' : ''}
            style={{ display: 'flex', gap: 10, justifyContent: 'center', marginBottom: 28 }}
            onPaste={handlePaste}
          >
            {otp.map((digit, i) => (
              <input
                key={i}
                ref={el => { inputs.current[i] = el }}
                type="number"
                inputMode="numeric"
                pattern="[0-9]*"
                maxLength={1}
                value={digit}
                onChange={e => handleChange(i, e.target.value)}
                onKeyDown={e => handleKeyDown(i, e)}
                disabled={loading}
                style={{
                  width: 52, height: 60,
                  textAlign: 'center',
                  fontSize: 24, fontWeight: 900,
                  color: '#0f172a',
                  background: digit ? '#eff6ff' : 'white',
                  border: `2.5px solid ${error && !digit ? '#fca5a5' : digit ? '#2563eb' : '#e2e8f0'}`,
                  borderRadius: 14,
                  outline: 'none',
                  fontFamily: 'inherit',
                  transition: 'all 0.15s',
                  cursor: loading ? 'not-allowed' : 'text',
                  opacity: loading ? 0.7 : 1,
                }}
                onFocus={e => { e.target.style.borderColor = '#2563eb'; e.target.style.boxShadow = '0 0 0 3px rgba(37,99,235,0.12)' }}
                onBlur={e => { if (!digit) { e.target.style.borderColor = '#e2e8f0'; e.target.style.boxShadow = 'none' } }}
              />
            ))}
          </div>

          {/* Verify button */}
          <button
            onClick={() => submitOtp(otp.join(''))}
            disabled={loading || otp.some(d => !d)}
            style={{
              width: '100%', padding: '14px', borderRadius: 13, border: 'none',
              background: (loading || otp.some(d => !d)) ? '#93c5fd' : 'linear-gradient(135deg,#2563eb,#1d4ed8)',
              color: 'white', fontWeight: 700, fontSize: 15,
              cursor: (loading || otp.some(d => !d)) ? 'not-allowed' : 'pointer',
              fontFamily: 'inherit', marginBottom: 20,
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
              boxShadow: '0 4px 16px rgba(37,99,235,0.25)',
              transition: 'all 0.15s',
            }}
          >
            {loading
              ? <><RefreshCw style={{ width: 17, height: 17, animation: 'spin 1s linear infinite' }} /> Verifying...</>
              : 'Verify & Continue'
            }
          </button>

          {/* Resend section */}
          <div style={{ textAlign: 'center' }}>
            {canResend ? (
              <button
                onClick={handleResend}
                disabled={resending}
                style={{
                  background: 'none', border: 'none',
                  color: '#2563eb', fontWeight: 700, fontSize: 14,
                  cursor: resending ? 'not-allowed' : 'pointer',
                  fontFamily: 'inherit',
                  display: 'inline-flex', alignItems: 'center', gap: 7,
                  opacity: resending ? 0.7 : 1,
                }}
              >
                {resending && <RefreshCw style={{ width: 14, height: 14, animation: 'spin 1s linear infinite' }} />}
                {resending ? 'Sending...' : 'Resend code'}
              </button>
            ) : (
              <p style={{ color: '#94a3b8', fontSize: 13 }}>
                Resend code in{' '}
                <span style={{ color: '#374151', fontWeight: 700, fontVariantNumeric: 'tabular-nums' }}>
                  {String(Math.floor(countdown / 60)).padStart(2, '0')}:{String(countdown % 60).padStart(2, '0')}
                </span>
              </p>
            )}
          </div>
        </div>

        {/* Info box */}
        <div style={{ marginTop: 16, background: '#fafafa', border: '1px solid #f1f5f9', borderRadius: 14, padding: '14px 18px' }}>
          <p style={{ fontSize: 12, color: '#64748b', lineHeight: 1.65, textAlign: 'center' }}>
            Didn't receive the email? Check your <strong>spam folder</strong>. The code expires in 10 minutes.
          </p>
        </div>

        {/* Back link */}
        <div style={{ textAlign: 'center', marginTop: 20 }}>
          <Link href="/auth/login" style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 13, color: '#64748b', textDecoration: 'none', fontWeight: 500 }}>
            <ArrowLeft style={{ width: 14, height: 14 }} /> Back to Sign In
          </Link>
        </div>
      </div>
    </div>
  )
}

export default function VerifyEmailPage() {
  return (
    <Suspense fallback={
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'Inter, system-ui, sans-serif' }}>
        <p style={{ color: '#64748b' }}>Loading...</p>
      </div>
    }>
      <VerifyEmailContent />
    </Suspense>
  )
}
