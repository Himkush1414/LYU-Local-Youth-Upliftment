'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/client';

export default function LandingPage() {
  const router = useRouter();
  const [checking, setChecking] = useState(true);
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenu, setMobileMenu] = useState(false);

  useEffect(() => {
    const supabase = createClient();
    // Check session AND listen for auth changes
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        router.replace('/seeker/dashboard');
      } else {
        setChecking(false);
      }
    });
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session) router.replace('/seeker/dashboard');
    });
    return () => subscription.unsubscribe();
  }, [router]);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  if (checking) {
    return (
      <div style={{ minHeight: '100vh', background: '#0a0a0f', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ width: 36, height: 36, border: '3px solid rgba(108,99,255,0.25)', borderTopColor: '#6c63ff', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  const stats = [
    { val: '50K+', label: 'Active Users' },
    { val: '94%', label: 'Interview Success' },
    { val: '200+', label: 'Partner Companies' },
    { val: '4.9★', label: 'Average Rating' },
  ];

  const features = [
    {
      icon: (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 2a10 10 0 1 0 10 10"/><path d="M12 6v6l4 2"/><circle cx="18" cy="6" r="3"/><path d="M15.5 4.5 18 6l-1.5 2.5"/>
        </svg>
      ),
      title: 'Career AI Mentor',
      desc: 'Get real-time career guidance from an AI trained on thousands of Indian job market scenarios — from IT placements to UPSC prep.',
      color: '#6c63ff',
    },
    {
      icon: (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <rect x="3" y="3" width="18" height="18" rx="2"/><path d="M3 9h18M9 21V9"/>
        </svg>
      ),
      title: 'Resume Studio',
      desc: 'Build ATS-optimized resumes in minutes. AI tailors your content to each job description and highlights what recruiters look for.',
      color: '#06b6d4',
    },
    {
      icon: (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <path d="M3 3v18h18"/><path d="m19 9-5 5-4-4-3 3"/>
        </svg>
      ),
      title: 'Learning Path',
      desc: 'Paste a job description and get a curated roadmap — YouTube channels, Coursera courses, NPTEL, and government exam prep material.',
      color: '#10b981',
    },
    {
      icon: (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/><path d="M11 8v6M8 11h6"/>
        </svg>
      ),
      title: 'Skill Gap Analysis',
      desc: 'Instantly discover what skills stand between you and your target role. Get a precise action plan, not vague advice.',
      color: '#f59e0b',
    },
    {
      icon: (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"/>
        </svg>
      ),
      title: 'Opportunities Feed',
      desc: 'Browse private sector openings and government job listings in one place. Filter by role, location, salary, and work mode.',
      color: '#ef4444',
    },
    {
      icon: (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
        </svg>
      ),
      title: 'Recruiter Messaging',
      desc: 'Communicate directly with recruiters inside the platform. No more lost emails or missed LinkedIn messages.',
      color: '#8b5cf6',
    },
  ];

  const steps = [
    { num: '01', title: 'Create your profile', desc: 'Sign up in 30 seconds with Google. Tell us your experience, target role, and location.' },
    { num: '02', title: 'Let AI map your path', desc: 'Our engine compares your skills against live market demand and builds your personalized roadmap.' },
    { num: '03', title: 'Apply and get hired', desc: 'Use your AI-crafted resume, practice with mock interviews, and apply to curated opportunities.' },
  ];

  return (
    <>
      <style>{`
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        html { scroll-behavior: smooth; }
        body { font-family: system-ui, -apple-system, 'Segoe UI', sans-serif; background: #0a0a0f; color: #f1f5f9; -webkit-font-smoothing: antialiased; }
        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes fadeUp { from { opacity: 0; transform: translateY(28px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes floatA { 0%,100% { transform: translateY(0); } 50% { transform: translateY(-16px); } }
        @keyframes floatB { 0%,100% { transform: translateY(0); } 50% { transform: translateY(14px); } }
        @keyframes shimmer { 0% { background-position: -200% center; } 100% { background-position: 200% center; } }
        .fade-up { animation: fadeUp 0.8s cubic-bezier(0.16,1,0.3,1) both; }
        .fade-up-1 { animation: fadeUp 0.8s 0.1s cubic-bezier(0.16,1,0.3,1) both; }
        .fade-up-2 { animation: fadeUp 0.8s 0.2s cubic-bezier(0.16,1,0.3,1) both; }
        .fade-up-3 { animation: fadeUp 0.8s 0.35s cubic-bezier(0.16,1,0.3,1) both; }
        .fade-up-4 { animation: fadeUp 0.8s 0.5s cubic-bezier(0.16,1,0.3,1) both; }
        .gradient-text {
          background: linear-gradient(135deg, #a78bfa 0%, #6c63ff 45%, #38bdf8 100%);
          background-size: 200% auto;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          animation: shimmer 5s linear infinite;
        }
        .nav-link { color: rgba(241,245,249,0.55); text-decoration: none; font-size: 14px; font-weight: 500; transition: color 0.2s; }
        .nav-link:hover { color: #f1f5f9; }
        .btn-ghost {
          display: inline-flex; align-items: center; gap: 6px;
          background: transparent; color: rgba(241,245,249,0.7);
          text-decoration: none; font-size: 14px; font-weight: 500;
          padding: 9px 20px; border-radius: 10px;
          border: 1px solid rgba(255,255,255,0.1); cursor: pointer;
          transition: border-color 0.2s, color 0.2s, background 0.2s;
        }
        .btn-ghost:hover { border-color: rgba(255,255,255,0.22); color: #fff; background: rgba(255,255,255,0.05); }
        .btn-primary {
          display: inline-flex; align-items: center; gap: 7px;
          background: #6c63ff; color: #fff; text-decoration: none;
          font-size: 14px; font-weight: 500; padding: 9px 20px;
          border-radius: 10px; border: none; cursor: pointer;
          transition: background 0.2s, transform 0.15s, box-shadow 0.2s;
        }
        .btn-primary:hover { background: #5a52e0; transform: translateY(-1px); box-shadow: 0 8px 28px rgba(108,99,255,0.35); }
        .hero-btn {
          display: inline-flex; align-items: center; gap: 9px;
          background: #6c63ff; color: #fff; text-decoration: none;
          font-size: 16px; font-weight: 600; padding: 15px 34px;
          border-radius: 12px; border: none; cursor: pointer;
          box-shadow: 0 8px 36px rgba(108,99,255,0.32);
          transition: background 0.2s, transform 0.15s, box-shadow 0.2s;
        }
        .hero-btn:hover { background: #5a52e0; transform: translateY(-2px); box-shadow: 0 14px 48px rgba(108,99,255,0.45); }
        .feature-card {
          background: rgba(255,255,255,0.028); border: 1px solid rgba(255,255,255,0.07);
          border-radius: 18px; padding: 28px 26px;
          transition: transform 0.25s ease, border-color 0.25s, background 0.25s;
        }
        .feature-card:hover { transform: translateY(-3px); border-color: rgba(108,99,255,0.25); background: rgba(255,255,255,0.045); }
        .step-card {
          display: flex; gap: 24px; align-items: flex-start;
          padding: 32px; background: rgba(255,255,255,0.02);
          border: 1px solid rgba(255,255,255,0.06); border-radius: 18px;
        }
        @media (max-width: 640px) {
          .hero-headline { font-size: 40px !important; }
          .hero-sub { font-size: 16px !important; }
          .hero-btn { font-size: 15px !important; padding: 13px 26px !important; }
          .stats-row { gap: 10px !important; }
          .stat-chip { padding: 12px 16px !important; }
          .features-grid { grid-template-columns: 1fr !important; }
          .steps-col { gap: 12px !important; }
          .cta-box { padding: 40px 24px !important; }
          .footer-inner { flex-direction: column !important; align-items: flex-start !important; gap: 20px !important; }
          .nav-links { display: none !important; }
          .mobile-menu-btn { display: flex !important; }
        }
        @media (min-width: 641px) {
          .mobile-menu-btn { display: none !important; }
          .mobile-menu { display: none !important; }
        }
      `}</style>

      {/* NAV */}
      <nav style={{
        position: 'fixed', top: 14, left: '50%', transform: 'translateX(-50%)',
        width: 'calc(100% - 32px)', maxWidth: 1080, zIndex: 100,
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '12px 20px', borderRadius: 14,
        background: scrolled ? 'rgba(10,10,15,0.9)' : 'rgba(10,10,15,0.6)',
        backdropFilter: 'blur(24px)', WebkitBackdropFilter: 'blur(24px)',
        border: '1px solid rgba(255,255,255,0.08)',
        transition: 'background 0.3s, box-shadow 0.3s',
        boxShadow: scrolled ? '0 4px 32px rgba(0,0,0,0.5)' : 'none',
      }}>
        {/* Logo */}
        <Link href="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 9 }}>
          <div style={{
            width: 30, height: 30, background: '#6c63ff',
            borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontWeight: 800, fontSize: 15, color: '#fff', fontFamily: 'system-ui',
          }}>L</div>
          <span style={{ fontWeight: 700, fontSize: 17, color: '#fff', letterSpacing: '-0.02em' }}>LYU</span>
        </Link>

        {/* Desktop nav links */}
        <div className="nav-links" style={{ display: 'flex', alignItems: 'center', gap: 32 }}>
          <a href="#features" className="nav-link">Features</a>
          <a href="#how" className="nav-link">How it works</a>
        </div>

        {/* Desktop CTA */}
        <div className="nav-links" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <Link href="/auth/login" className="btn-ghost">Sign In</Link>
          <Link href="/auth/register" className="btn-primary">Get Started</Link>
        </div>

        {/* Mobile menu button */}
        <button
          className="mobile-menu-btn"
          onClick={() => setMobileMenu(!mobileMenu)}
          style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 4, display: 'none', flexDirection: 'column', gap: 5 }}
        >
          <div style={{ width: 22, height: 2, background: '#f1f5f9', borderRadius: 2, transition: 'transform 0.2s', transform: mobileMenu ? 'rotate(45deg) translate(5px, 5px)' : 'none' }} />
          <div style={{ width: 22, height: 2, background: '#f1f5f9', borderRadius: 2, opacity: mobileMenu ? 0 : 1, transition: 'opacity 0.2s' }} />
          <div style={{ width: 22, height: 2, background: '#f1f5f9', borderRadius: 2, transition: 'transform 0.2s', transform: mobileMenu ? 'rotate(-45deg) translate(5px, -5px)' : 'none' }} />
        </button>
      </nav>

      {/* Mobile menu dropdown */}
      {mobileMenu && (
        <div className="mobile-menu" style={{
          position: 'fixed', top: 78, left: 16, right: 16, zIndex: 99,
          background: 'rgba(17,17,24,0.98)', border: '1px solid rgba(255,255,255,0.1)',
          borderRadius: 14, padding: '16px', backdropFilter: 'blur(24px)',
          display: 'flex', flexDirection: 'column', gap: 10,
        }}>
          <Link href="/auth/login" onClick={() => setMobileMenu(false)} style={{ padding: '12px 16px', borderRadius: 10, color: '#f1f5f9', textDecoration: 'none', fontSize: 15, fontWeight: 500, border: '1px solid rgba(255,255,255,0.1)', textAlign: 'center' }}>Sign In</Link>
          <Link href="/auth/register" onClick={() => setMobileMenu(false)} style={{ padding: '12px 16px', borderRadius: 10, color: '#fff', textDecoration: 'none', fontSize: 15, fontWeight: 600, background: '#6c63ff', textAlign: 'center' }}>Get Started Free</Link>
        </div>
      )}

      {/* HERO */}
      <section style={{
        minHeight: '100vh', display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center',
        textAlign: 'center', padding: '130px 20px 80px',
        position: 'relative', overflow: 'hidden',
      }}>
        {/* Background glows */}
        <div style={{ position: 'absolute', top: '10%', left: '5%', width: 600, height: 600, background: 'radial-gradient(circle, rgba(108,99,255,0.14) 0%, transparent 65%)', animation: 'floatA 8s ease-in-out infinite', pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', bottom: '5%', right: '5%', width: 500, height: 500, background: 'radial-gradient(circle, rgba(56,189,248,0.1) 0%, transparent 65%)', animation: 'floatB 11s ease-in-out infinite', pointerEvents: 'none' }} />

        {/* Badge */}
        <div className="fade-up" style={{
          display: 'inline-flex', alignItems: 'center', gap: 8,
          background: 'rgba(108,99,255,0.1)', border: '1px solid rgba(108,99,255,0.28)',
          borderRadius: 100, padding: '6px 16px', fontSize: 12.5, fontWeight: 600,
          color: '#a5b4fc', letterSpacing: '0.04em', textTransform: 'uppercase',
          marginBottom: 32,
        }}>
          <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#6c63ff', display: 'inline-block' }} />
          AI-Powered Career Platform for India
        </div>

        {/* Headline */}
        <h1 className="hero-headline fade-up-1" style={{
          fontWeight: 800, fontSize: 72, lineHeight: 1.02,
          letterSpacing: '-0.035em', color: '#f1f5f9',
          maxWidth: 780, marginBottom: 24,
        }}>
          Your Career,{' '}
          <span className="gradient-text">Supercharged</span>
          <br />by Intelligence
        </h1>

        {/* Sub */}
        <p className="hero-sub fade-up-2" style={{
          fontSize: 18, color: 'rgba(241,245,249,0.5)',
          maxWidth: 520, lineHeight: 1.7, marginBottom: 44, fontWeight: 400,
        }}>
          LYU combines AI-driven career tools with real opportunities — helping India's local talent discover their path, build real skills, and land meaningful work.
        </p>

        {/* CTA */}
        <div className="fade-up-3" style={{ display: 'flex', gap: 12, flexWrap: 'wrap', justifyContent: 'center' }}>
          <Link href="/auth/register" className="hero-btn">
            Get Started Free
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
          </Link>
          <Link href="/auth/login" className="btn-ghost" style={{ fontSize: 15, padding: '14px 26px', borderRadius: 12 }}>
            Sign In
          </Link>
        </div>

        <p className="fade-up-3" style={{ marginTop: 16, fontSize: 12.5, color: 'rgba(241,245,249,0.3)', fontWeight: 400 }}>
          Free forever · No credit card required · 2-minute setup
        </p>

        {/* Stats */}
        <div className="stats-row fade-up-4" style={{
          display: 'flex', gap: 14, marginTop: 64, flexWrap: 'wrap', justifyContent: 'center',
        }}>
          {stats.map(({ val, label }) => (
            <div key={label} className="stat-chip" style={{
              background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)',
              borderRadius: 12, padding: '14px 22px', textAlign: 'center',
            }}>
              <div style={{ fontWeight: 700, fontSize: 22, color: '#f1f5f9', letterSpacing: '-0.02em' }}>{val}</div>
              <div style={{ fontSize: 11.5, color: 'rgba(241,245,249,0.4)', marginTop: 2, fontWeight: 500 }}>{label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* FEATURES */}
      <section id="features" style={{ padding: '96px 20px', maxWidth: 1080, margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: 60 }}>
          <p style={{ fontSize: 11.5, fontWeight: 700, letterSpacing: '0.12em', color: '#6c63ff', textTransform: 'uppercase', marginBottom: 14 }}>Platform Features</p>
          <h2 style={{ fontWeight: 800, fontSize: 'clamp(30px,4vw,46px)', letterSpacing: '-0.03em', color: '#f1f5f9', lineHeight: 1.12 }}>
            Everything you need to<br />
            <span className="gradient-text">advance your career</span>
          </h2>
        </div>
        <div className="features-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 18 }}>
          {features.map((f) => (
            <div key={f.title} className="feature-card">
              <div style={{
                width: 44, height: 44, background: `${f.color}18`,
                border: `1px solid ${f.color}30`, borderRadius: 12,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                color: f.color, marginBottom: 18,
              }}>{f.icon}</div>
              <h3 style={{ fontWeight: 700, fontSize: 17, color: '#f1f5f9', marginBottom: 9, letterSpacing: '-0.01em' }}>{f.title}</h3>
              <p style={{ fontSize: 14, color: 'rgba(241,245,249,0.45)', lineHeight: 1.7 }}>{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section id="how" style={{ padding: '96px 20px', background: 'rgba(255,255,255,0.015)', borderTop: '1px solid rgba(255,255,255,0.05)', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
        <div style={{ maxWidth: 760, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 56 }}>
            <p style={{ fontSize: 11.5, fontWeight: 700, letterSpacing: '0.12em', color: '#6c63ff', textTransform: 'uppercase', marginBottom: 14 }}>How It Works</p>
            <h2 style={{ fontWeight: 800, fontSize: 'clamp(30px,4vw,46px)', letterSpacing: '-0.03em', color: '#f1f5f9', lineHeight: 1.12 }}>
              Three steps to your<br />next opportunity
            </h2>
          </div>
          <div className="steps-col" style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            {steps.map((step, i) => (
              <div key={step.num} className="step-card" style={{ animationDelay: `${i * 0.1}s` }}>
                <div style={{ fontWeight: 800, fontSize: 32, color: 'rgba(108,99,255,0.22)', lineHeight: 1, flexShrink: 0, minWidth: 52, fontVariantNumeric: 'tabular-nums' }}>{step.num}</div>
                <div>
                  <h3 style={{ fontWeight: 700, fontSize: 17, color: '#f1f5f9', marginBottom: 7, letterSpacing: '-0.01em' }}>{step.title}</h3>
                  <p style={{ fontSize: 14.5, color: 'rgba(241,245,249,0.48)', lineHeight: 1.65 }}>{step.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA BANNER */}
      <section style={{ padding: '96px 20px', textAlign: 'center' }}>
        <div className="cta-box" style={{
          maxWidth: 600, margin: '0 auto', padding: '60px 48px',
          background: 'linear-gradient(135deg, rgba(108,99,255,0.1), rgba(56,189,248,0.06))',
          border: '1px solid rgba(108,99,255,0.2)', borderRadius: 24,
          position: 'relative', overflow: 'hidden',
        }}>
          <div style={{ position: 'absolute', top: -80, right: -80, width: 240, height: 240, background: 'radial-gradient(circle, rgba(108,99,255,0.18), transparent 65%)', pointerEvents: 'none' }} />
          <h2 style={{ fontWeight: 800, fontSize: 'clamp(26px,4vw,36px)', color: '#f1f5f9', letterSpacing: '-0.025em', marginBottom: 14, lineHeight: 1.18, position: 'relative' }}>
            Ready to transform your career?
          </h2>
          <p style={{ fontSize: 15.5, color: 'rgba(241,245,249,0.48)', marginBottom: 34, lineHeight: 1.65, position: 'relative' }}>
            Join thousands of young professionals across India using LYU to get ahead — from Tier 1 cities to Tier 3 towns.
          </p>
          <Link href="/auth/register" className="hero-btn" style={{ fontSize: 15, padding: '13px 30px', position: 'relative' }}>
            Start for free
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
          </Link>
        </div>
      </section>

      {/* FOOTER */}
      <footer style={{ borderTop: '1px solid rgba(255,255,255,0.06)', padding: '28px 20px' }}>
        <div className="footer-inner" style={{ maxWidth: 1080, margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 16 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <div style={{ width: 24, height: 24, background: '#6c63ff', borderRadius: 6, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 800, color: '#fff' }}>L</div>
            <span style={{ fontWeight: 600, color: 'rgba(241,245,249,0.4)', fontSize: 13.5 }}>LYU — Local Youth Upliftment</span>
          </div>
          <p style={{ fontSize: 12.5, color: 'rgba(241,245,249,0.28)' }}>© {new Date().getFullYear()} LYU. All rights reserved.</p>
          <div style={{ display: 'flex', gap: 20 }}>
            {['Privacy', 'Terms', 'Contact'].map(item => (
              <a key={item} href="#" style={{ fontSize: 13, color: 'rgba(241,245,249,0.32)', textDecoration: 'none', transition: 'color 0.2s' }}
                onMouseEnter={e => (e.currentTarget.style.color = 'rgba(241,245,249,0.65)')}
                onMouseLeave={e => (e.currentTarget.style.color = 'rgba(241,245,249,0.32)')}
              >{item}</a>
            ))}
          </div>
        </div>
      </footer>
    </>
  );
}
