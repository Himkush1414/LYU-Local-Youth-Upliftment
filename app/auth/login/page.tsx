'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/client';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [checking, setChecking] = useState(true);

  const supabase = createClient();

  // Check if already logged in — redirect immediately
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        router.replace('/seeker/dashboard');
      } else {
        setChecking(false);
      }
    });
    // Also listen for OAuth callback completing
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session) router.replace('/seeker/dashboard');
    });
    return () => subscription.unsubscribe();
  }, []);

  // Show URL error (e.g. oauth_failed from callback)
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const urlError = params.get('error');
    if (urlError === 'oauth_failed') setError('Google sign-in failed. Please try again.');
  }, []);

  const handleGoogleLogin = async () => {
    setGoogleLoading(true);
    setError('');
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
          queryParams: { access_type: 'offline', prompt: 'consent' },
        },
      });
      if (error) {
        setError(error.message);
        setGoogleLoading(false);
      }
      // If no error, browser will redirect to Google — don't reset loading
    } catch (e) {
      setError('Failed to connect. Check your internet connection.');
      setGoogleLoading(false);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) {
        setError(error.message === 'Invalid login credentials'
          ? 'Incorrect email or password. Please try again.'
          : error.message
        );
        setLoading(false);
      }
      // Session change will trigger onAuthStateChange → redirect
    } catch (e) {
      setError('Failed to connect. Check your internet connection.');
      setLoading(false);
    }
  };

  if (checking) {
    return (
      <div style={{ minHeight: '100vh', background: '#0a0a0f', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ width: 32, height: 32, border: '3px solid rgba(108,99,255,0.25)', borderTopColor: '#6c63ff', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  return (
    <>
      <style>{`
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        body { font-family: system-ui, -apple-system, 'Segoe UI', sans-serif; -webkit-font-smoothing: antialiased; }
        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes fadeUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes floatA { 0%,100% { transform: translateY(0); } 50% { transform: translateY(-18px); } }
        .auth-input {
          width: 100%; background: rgba(255,255,255,0.04);
          border: 1px solid rgba(255,255,255,0.1); border-radius: 11px;
          padding: 13px 15px; color: #f1f5f9;
          font-family: system-ui, sans-serif; font-size: 14.5px; outline: none;
          transition: border-color 0.2s, background 0.2s, box-shadow 0.2s;
        }
        .auth-input:focus {
          border-color: #6c63ff; background: rgba(108,99,255,0.06);
          box-shadow: 0 0 0 3px rgba(108,99,255,0.14);
        }
        .auth-input::placeholder { color: rgba(241,245,249,0.25); }
        .btn-submit {
          width: 100%; background: #6c63ff; color: #fff; border: none;
          border-radius: 11px; padding: 13px; font-family: system-ui, sans-serif;
          font-size: 15px; font-weight: 600; cursor: pointer;
          transition: background 0.2s, transform 0.15s, box-shadow 0.2s;
        }
        .btn-submit:hover:not(:disabled) { background: #5a52e0; transform: translateY(-1px); box-shadow: 0 8px 28px rgba(108,99,255,0.38); }
        .btn-submit:disabled { opacity: 0.5; cursor: not-allowed; }
        .btn-google {
          width: 100%; background: rgba(255,255,255,0.05); color: #f1f5f9;
          border: 1px solid rgba(255,255,255,0.11); border-radius: 11px; padding: 12px;
          font-family: system-ui, sans-serif; font-size: 14.5px; font-weight: 500;
          cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 10px;
          transition: background 0.2s, border-color 0.2s;
        }
        .btn-google:hover:not(:disabled) { background: rgba(255,255,255,0.09); border-color: rgba(255,255,255,0.2); }
        .btn-google:disabled { opacity: 0.5; cursor: not-allowed; }
        .divider { display: flex; align-items: center; gap: 12px; color: rgba(241,245,249,0.22); font-size: 12.5px; }
        .divider::before, .divider::after { content: ''; flex: 1; height: 1px; background: rgba(255,255,255,0.08); }
        @media (max-width: 480px) {
          .auth-card { padding: 28px 20px !important; border-radius: 18px !important; }
        }
      `}</style>

      <div style={{
        minHeight: '100vh', background: '#0a0a0f',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: '20px', position: 'relative', overflow: 'hidden',
      }}>
        {/* BG glows */}
        <div style={{ position: 'absolute', top: '-5%', left: '-5%', width: 550, height: 550, background: 'radial-gradient(circle, rgba(108,99,255,0.1) 0%, transparent 65%)', animation: 'floatA 10s ease-in-out infinite', pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', bottom: '-10%', right: '-5%', width: 450, height: 450, background: 'radial-gradient(circle, rgba(56,189,248,0.07) 0%, transparent 65%)', animation: 'floatA 13s ease-in-out infinite reverse', pointerEvents: 'none' }} />

        <div style={{ width: '100%', maxWidth: 420, animation: 'fadeUp 0.65s cubic-bezier(0.16,1,0.3,1) both', position: 'relative', zIndex: 1 }}>

          {/* Logo */}
          <div style={{ textAlign: 'center', marginBottom: 36 }}>
            <Link href="/" style={{ textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: 9 }}>
              <div style={{ width: 36, height: 36, background: '#6c63ff', borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: 17, color: '#fff' }}>L</div>
              <span style={{ fontWeight: 700, fontSize: 20, color: '#f1f5f9', letterSpacing: '-0.02em' }}>LYU</span>
            </Link>
          </div>

          {/* Card */}
          <div className="auth-card" style={{
            background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)',
            borderRadius: 22, padding: '36px 32px', backdropFilter: 'blur(20px)',
          }}>
            <h1 style={{ fontWeight: 700, fontSize: 24, color: '#f1f5f9', letterSpacing: '-0.02em', marginBottom: 5 }}>Welcome back</h1>
            <p style={{ fontSize: 14, color: 'rgba(241,245,249,0.42)', marginBottom: 28 }}>Sign in to continue your career journey</p>

            {/* Google */}
            <button className="btn-google" onClick={handleGoogleLogin} disabled={googleLoading || loading}>
              {googleLoading ? (
                <div style={{ width: 17, height: 17, border: '2px solid rgba(255,255,255,0.3)', borderTopColor: '#fff', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
              ) : (
                <svg width="18" height="18" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
              )}
              {googleLoading ? 'Redirecting to Google...' : 'Continue with Google'}
            </button>

            <div className="divider" style={{ margin: '22px 0' }}>or continue with email</div>

            {/* Email form */}
            <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              <div>
                <label style={{ display: 'block', fontSize: 12.5, fontWeight: 600, color: 'rgba(241,245,249,0.55)', marginBottom: 7, letterSpacing: '0.01em' }}>Email address</label>
                <input className="auth-input" type="email" placeholder="you@example.com" value={email} onChange={e => setEmail(e.target.value)} required autoComplete="email" />
              </div>

              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 7 }}>
                  <label style={{ fontSize: 12.5, fontWeight: 600, color: 'rgba(241,245,249,0.55)', letterSpacing: '0.01em' }}>Password</label>
                  <Link href="/auth/forgot-password" style={{ fontSize: 12, color: '#818cf8', textDecoration: 'none', fontWeight: 500 }}>Forgot password?</Link>
                </div>
                <div style={{ position: 'relative' }}>
                  <input className="auth-input" type={showPassword ? 'text' : 'password'} placeholder="••••••••" value={password} onChange={e => setPassword(e.target.value)} required autoComplete="current-password" style={{ paddingRight: 44 }} />
                  <button type="button" onClick={() => setShowPassword(!showPassword)} style={{ position: 'absolute', right: 13, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: 'rgba(241,245,249,0.3)', padding: 0, lineHeight: 1 }}>
                    {showPassword
                      ? <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/></svg>
                      : <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                    }
                  </button>
                </div>
              </div>

              {error && (
                <div style={{ background: 'rgba(239,68,68,0.09)', border: '1px solid rgba(239,68,68,0.2)', borderRadius: 10, padding: '11px 14px', fontSize: 13.5, color: '#fca5a5', lineHeight: 1.5 }}>
                  {error}
                </div>
              )}

              <button className="btn-submit" type="submit" disabled={loading || googleLoading} style={{ marginTop: 2 }}>
                {loading ? (
                  <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
                    <div style={{ width: 15, height: 15, border: '2px solid rgba(255,255,255,0.3)', borderTopColor: '#fff', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
                    Signing in...
                  </span>
                ) : 'Sign In'}
              </button>
            </form>
          </div>

          <p style={{ textAlign: 'center', marginTop: 22, fontSize: 13.5, color: 'rgba(241,245,249,0.38)' }}>
            Don't have an account?{' '}
            <Link href="/auth/register" style={{ color: '#818cf8', textDecoration: 'none', fontWeight: 600 }}>Create one free</Link>
          </p>
        </div>
      </div>
    </>
  );
}
