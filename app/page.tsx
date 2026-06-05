'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/client';

export default function LandingPage() {
  const router = useRouter();
  const [checking, setChecking] = useState(true);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        router.replace('/seeker/dashboard');
      } else {
        setChecking(false);
      }
    });
  }, [router]);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  if (checking) {
    return (
      <div style={{
        minHeight: '100vh',
        background: '#0a0a0f',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}>
        <div style={{
          width: 40,
          height: 40,
          border: '3px solid rgba(79,70,229,0.3)',
          borderTopColor: '#4f46e5',
          borderRadius: '50%',
          animation: 'spin 0.8s linear infinite',
        }} />
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  const features = [
    {
      icon: '✦',
      title: 'Career AI Chat',
      desc: 'Get personalized career advice, answer your toughest questions, and map your ideal path — powered by AI that understands your goals.',
      color: '#4f46e5',
    },
    {
      icon: '◈',
      title: 'Resume Builder',
      desc: 'Craft ATS-optimized resumes in minutes. Our AI tailors your content to match job descriptions and maximize recruiter attention.',
      color: '#7c3aed',
    },
    {
      icon: '◎',
      title: 'Job Roadmap',
      desc: 'Get a step-by-step roadmap to your dream role. We analyze your profile and chart the most efficient path forward.',
      color: '#2563eb',
    },
    {
      icon: '◉',
      title: 'Skill Gap Analysis',
      desc: 'Instantly discover which skills are missing between where you are and where you want to be. No more guesswork.',
      color: '#0891b2',
    },
    {
      icon: '⬡',
      title: 'Mock Interviews',
      desc: 'Practice with AI interviewers tailored to your target role. Get instant feedback on answers, tone, and structure.',
      color: '#059669',
    },
  ];

  const steps = [
    {
      num: '01',
      title: 'Create your profile',
      desc: 'Sign up in seconds. Tell us about your experience, goals, and the role you\'re after.',
    },
    {
      num: '02',
      title: 'Let AI analyze your path',
      desc: 'Our engine maps your current skills against market demand and identifies your fastest route.',
    },
    {
      num: '03',
      title: 'Land your dream job',
      desc: 'Apply with a perfect resume, nail interviews with practice, and get hired with confidence.',
    },
  ];

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;500;600;700;800&family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;1,9..40,300&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        html { scroll-behavior: smooth; }
        body { font-family: 'DM Sans', sans-serif; background: #0a0a0f; color: #e8e8f0; }
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(32px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes floatA {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-18px) rotate(3deg); }
        }
        @keyframes floatB {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(12px) rotate(-2deg); }
        }
        @keyframes pulseGlow {
          0%, 100% { box-shadow: 0 0 40px rgba(79,70,229,0.15); }
          50% { box-shadow: 0 0 80px rgba(79,70,229,0.35); }
        }
        @keyframes shimmer {
          0% { background-position: -200% center; }
          100% { background-position: 200% center; }
        }
        .hero-headline {
          font-family: 'Syne', sans-serif;
          font-weight: 800;
          font-size: clamp(48px, 7vw, 88px);
          line-height: 1.0;
          letter-spacing: -0.03em;
          animation: fadeUp 0.9s cubic-bezier(0.16,1,0.3,1) both;
        }
        .gradient-text {
          background: linear-gradient(135deg, #818cf8 0%, #4f46e5 40%, #a78bfa 70%, #60a5fa 100%);
          background-size: 200% auto;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          animation: shimmer 4s linear infinite;
        }
        .nav-link {
          color: rgba(232,232,240,0.6);
          text-decoration: none;
          font-size: 14px;
          font-weight: 500;
          letter-spacing: 0.01em;
          transition: color 0.2s;
        }
        .nav-link:hover { color: #e8e8f0; }
        .btn-primary {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          background: #4f46e5;
          color: #fff;
          text-decoration: none;
          font-family: 'DM Sans', sans-serif;
          font-size: 15px;
          font-weight: 500;
          padding: 11px 24px;
          border-radius: 10px;
          border: none;
          cursor: pointer;
          transition: background 0.2s, transform 0.15s, box-shadow 0.2s;
          letter-spacing: 0.01em;
        }
        .btn-primary:hover {
          background: #4338ca;
          transform: translateY(-1px);
          box-shadow: 0 8px 32px rgba(79,70,229,0.4);
        }
        .btn-ghost {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          background: transparent;
          color: rgba(232,232,240,0.75);
          text-decoration: none;
          font-family: 'DM Sans', sans-serif;
          font-size: 15px;
          font-weight: 500;
          padding: 11px 24px;
          border-radius: 10px;
          border: 1px solid rgba(255,255,255,0.1);
          cursor: pointer;
          transition: border-color 0.2s, color 0.2s, background 0.2s;
        }
        .btn-ghost:hover {
          border-color: rgba(255,255,255,0.25);
          color: #fff;
          background: rgba(255,255,255,0.05);
        }
        .feature-card {
          background: rgba(255,255,255,0.03);
          border: 1px solid rgba(255,255,255,0.07);
          border-radius: 20px;
          padding: 32px;
          transition: transform 0.3s cubic-bezier(0.16,1,0.3,1), border-color 0.3s, background 0.3s;
          position: relative;
          overflow: hidden;
        }
        .feature-card::before {
          content: '';
          position: absolute;
          inset: 0;
          background: radial-gradient(600px circle at var(--mx, 50%) var(--my, 50%), rgba(79,70,229,0.06), transparent 40%);
          opacity: 0;
          transition: opacity 0.4s;
        }
        .feature-card:hover::before { opacity: 1; }
        .feature-card:hover {
          transform: translateY(-4px);
          border-color: rgba(79,70,229,0.3);
          background: rgba(255,255,255,0.05);
        }
        .step-card {
          display: flex;
          gap: 28px;
          align-items: flex-start;
          padding: 36px;
          background: rgba(255,255,255,0.02);
          border: 1px solid rgba(255,255,255,0.06);
          border-radius: 20px;
          animation: fadeUp 0.7s cubic-bezier(0.16,1,0.3,1) both;
        }
        .hero-cta-btn {
          display: inline-flex;
          align-items: center;
          gap: 10px;
          background: linear-gradient(135deg, #4f46e5, #6d28d9);
          color: #fff;
          text-decoration: none;
          font-family: 'DM Sans', sans-serif;
          font-size: 17px;
          font-weight: 500;
          padding: 16px 36px;
          border-radius: 14px;
          border: none;
          cursor: pointer;
          transition: transform 0.2s, box-shadow 0.2s;
          animation: fadeUp 1s 0.5s cubic-bezier(0.16,1,0.3,1) both;
          animation: pulseGlow 3s ease-in-out infinite, fadeUp 1s 0.5s cubic-bezier(0.16,1,0.3,1) both;
          letter-spacing: 0.01em;
          box-shadow: 0 8px 40px rgba(79,70,229,0.3);
        }
        .hero-cta-btn:hover {
          transform: translateY(-2px) scale(1.02);
          box-shadow: 0 16px 56px rgba(79,70,229,0.5);
        }
      `}</style>

      {/* NAV */}
      <nav style={{
        position: 'fixed',
        top: 16,
        left: '50%',
        transform: 'translateX(-50%)',
        width: 'calc(100% - 48px)',
        maxWidth: 1100,
        zIndex: 100,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '14px 24px',
        borderRadius: 16,
        background: scrolled ? 'rgba(10,10,15,0.85)' : 'rgba(10,10,15,0.5)',
        backdropFilter: 'blur(20px)',
        border: '1px solid rgba(255,255,255,0.08)',
        transition: 'background 0.3s, box-shadow 0.3s',
        boxShadow: scrolled ? '0 8px 40px rgba(0,0,0,0.4)' : 'none',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{
            width: 32,
            height: 32,
            background: 'linear-gradient(135deg, #4f46e5, #7c3aed)',
            borderRadius: 9,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 14,
            fontWeight: 800,
            color: '#fff',
            fontFamily: 'Syne, sans-serif',
          }}>L</div>
          <span style={{ fontFamily: 'Syne, sans-serif', fontWeight: 700, fontSize: 18, color: '#fff', letterSpacing: '-0.02em' }}>LYU</span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <Link href="/auth/login" className="btn-ghost" style={{ padding: '9px 20px', fontSize: 14 }}>Login</Link>
          <Link href="/auth/register" className="btn-primary" style={{ padding: '9px 20px', fontSize: 14 }}>Get Started</Link>
        </div>
      </nav>

      {/* HERO */}
      <section style={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
        padding: '120px 24px 80px',
        position: 'relative',
        overflow: 'hidden',
      }}>
        {/* BG orbs */}
        <div style={{
          position: 'absolute',
          top: '15%',
          left: '10%',
          width: 500,
          height: 500,
          background: 'radial-gradient(circle, rgba(79,70,229,0.18) 0%, transparent 65%)',
          animation: 'floatA 7s ease-in-out infinite',
          pointerEvents: 'none',
        }} />
        <div style={{
          position: 'absolute',
          bottom: '10%',
          right: '8%',
          width: 400,
          height: 400,
          background: 'radial-gradient(circle, rgba(124,58,237,0.14) 0%, transparent 65%)',
          animation: 'floatB 9s ease-in-out infinite',
          pointerEvents: 'none',
        }} />
        <div style={{
          position: 'absolute',
          top: '40%',
          right: '20%',
          width: 250,
          height: 250,
          background: 'radial-gradient(circle, rgba(37,99,235,0.12) 0%, transparent 65%)',
          animation: 'floatA 11s ease-in-out infinite reverse',
          pointerEvents: 'none',
        }} />

        {/* Badge */}
        <div style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: 8,
          background: 'rgba(79,70,229,0.12)',
          border: '1px solid rgba(79,70,229,0.3)',
          borderRadius: 100,
          padding: '7px 18px',
          fontSize: 13,
          color: '#a5b4fc',
          fontWeight: 500,
          marginBottom: 36,
          animation: 'fadeUp 0.7s cubic-bezier(0.16,1,0.3,1) both',
          letterSpacing: '0.02em',
        }}>
          <span style={{ color: '#4f46e5', fontSize: 10 }}>●</span>
          AI-Powered Career Platform for India's Youth
        </div>

        <h1 className="hero-headline" style={{ maxWidth: 820, marginBottom: 28 }}>
          Your Career,{' '}
          <span className="gradient-text">Supercharged</span>
          <br />by Intelligence
        </h1>

        <p style={{
          fontSize: 19,
          color: 'rgba(232,232,240,0.55)',
          maxWidth: 560,
          lineHeight: 1.65,
          marginBottom: 48,
          fontWeight: 300,
          animation: 'fadeUp 0.9s 0.2s cubic-bezier(0.16,1,0.3,1) both',
        }}>
          LYU combines AI-driven career tools with real opportunities — helping local talent discover their path, build their skills, and land meaningful work.
        </p>

        <Link href="/auth/register" className="hero-cta-btn">
          Get Started Free
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M5 12h14M12 5l7 7-7 7"/>
          </svg>
        </Link>

        <p style={{
          marginTop: 20,
          fontSize: 13,
          color: 'rgba(232,232,240,0.3)',
          animation: 'fadeUp 1s 0.7s cubic-bezier(0.16,1,0.3,1) both',
        }}>
          Free forever. No credit card required.
        </p>

        {/* Floating stat chips */}
        <div style={{
          display: 'flex',
          gap: 16,
          marginTop: 72,
          flexWrap: 'wrap',
          justifyContent: 'center',
          animation: 'fadeUp 1s 0.9s cubic-bezier(0.16,1,0.3,1) both',
        }}>
          {[['50K+', 'Active Users'], ['94%', 'Interview Success'], ['200+', 'Partner Companies']].map(([val, label]) => (
            <div key={label} style={{
              background: 'rgba(255,255,255,0.04)',
              border: '1px solid rgba(255,255,255,0.08)',
              borderRadius: 12,
              padding: '14px 24px',
              textAlign: 'center',
            }}>
              <div style={{ fontFamily: 'Syne, sans-serif', fontWeight: 700, fontSize: 22, color: '#fff' }}>{val}</div>
              <div style={{ fontSize: 12, color: 'rgba(232,232,240,0.4)', marginTop: 2 }}>{label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* FEATURES */}
      <section style={{
        padding: '100px 24px',
        maxWidth: 1100,
        margin: '0 auto',
      }}>
        <div style={{ textAlign: 'center', marginBottom: 64 }}>
          <div style={{
            fontSize: 12,
            fontWeight: 600,
            letterSpacing: '0.12em',
            color: '#6366f1',
            textTransform: 'uppercase',
            marginBottom: 16,
          }}>AI Features</div>
          <h2 style={{
            fontFamily: 'Syne, sans-serif',
            fontWeight: 700,
            fontSize: 'clamp(32px, 4vw, 48px)',
            letterSpacing: '-0.025em',
            color: '#fff',
            lineHeight: 1.15,
          }}>
            Everything you need to<br />
            <span className="gradient-text">advance your career</span>
          </h2>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: 20,
        }}>
          {features.map((f) => (
            <div key={f.title} className="feature-card">
              <div style={{
                width: 48,
                height: 48,
                background: `${f.color}18`,
                border: `1px solid ${f.color}35`,
                borderRadius: 14,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: 22,
                marginBottom: 20,
                color: f.color,
              }}>{f.icon}</div>
              <h3 style={{
                fontFamily: 'Syne, sans-serif',
                fontWeight: 600,
                fontSize: 18,
                color: '#fff',
                marginBottom: 10,
                letterSpacing: '-0.01em',
              }}>{f.title}</h3>
              <p style={{
                fontSize: 14.5,
                color: 'rgba(232,232,240,0.5)',
                lineHeight: 1.7,
              }}>{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section style={{
        padding: '100px 24px',
        background: 'rgba(255,255,255,0.01)',
        borderTop: '1px solid rgba(255,255,255,0.05)',
        borderBottom: '1px solid rgba(255,255,255,0.05)',
      }}>
        <div style={{ maxWidth: 800, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 64 }}>
            <div style={{
              fontSize: 12,
              fontWeight: 600,
              letterSpacing: '0.12em',
              color: '#6366f1',
              textTransform: 'uppercase',
              marginBottom: 16,
            }}>How it works</div>
            <h2 style={{
              fontFamily: 'Syne, sans-serif',
              fontWeight: 700,
              fontSize: 'clamp(32px, 4vw, 48px)',
              letterSpacing: '-0.025em',
              color: '#fff',
              lineHeight: 1.15,
            }}>Three steps to your<br />next opportunity</h2>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {steps.map((step, i) => (
              <div key={step.num} className="step-card" style={{ animationDelay: `${i * 0.12}s` }}>
                <div style={{
                  flexShrink: 0,
                  fontFamily: 'Syne, sans-serif',
                  fontWeight: 800,
                  fontSize: 36,
                  color: 'rgba(79,70,229,0.25)',
                  lineHeight: 1,
                  minWidth: 56,
                }}>{step.num}</div>
                <div>
                  <h3 style={{
                    fontFamily: 'Syne, sans-serif',
                    fontWeight: 600,
                    fontSize: 19,
                    color: '#fff',
                    marginBottom: 8,
                    letterSpacing: '-0.01em',
                  }}>{step.title}</h3>
                  <p style={{
                    fontSize: 15,
                    color: 'rgba(232,232,240,0.5)',
                    lineHeight: 1.65,
                  }}>{step.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA BANNER */}
      <section style={{
        padding: '100px 24px',
        textAlign: 'center',
      }}>
        <div style={{
          maxWidth: 640,
          margin: '0 auto',
          padding: '64px 48px',
          background: 'linear-gradient(135deg, rgba(79,70,229,0.12), rgba(124,58,237,0.08))',
          border: '1px solid rgba(79,70,229,0.2)',
          borderRadius: 28,
          position: 'relative',
          overflow: 'hidden',
        }}>
          <div style={{
            position: 'absolute',
            top: -60,
            right: -60,
            width: 220,
            height: 220,
            background: 'radial-gradient(circle, rgba(79,70,229,0.2), transparent 70%)',
            pointerEvents: 'none',
          }} />
          <h2 style={{
            fontFamily: 'Syne, sans-serif',
            fontWeight: 700,
            fontSize: 'clamp(28px, 4vw, 38px)',
            color: '#fff',
            letterSpacing: '-0.025em',
            marginBottom: 16,
            lineHeight: 1.2,
          }}>Ready to transform your career?</h2>
          <p style={{
            fontSize: 16,
            color: 'rgba(232,232,240,0.5)',
            marginBottom: 36,
            lineHeight: 1.65,
          }}>
            Join thousands of young professionals using LYU to get ahead.
          </p>
          <Link href="/auth/register" className="hero-cta-btn" style={{ fontSize: 16, padding: '14px 32px' }}>
            Start for free
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M5 12h14M12 5l7 7-7 7"/>
            </svg>
          </Link>
        </div>
      </section>

      {/* FOOTER */}
      <footer style={{
        borderTop: '1px solid rgba(255,255,255,0.06)',
        padding: '32px 24px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        maxWidth: 1100,
        margin: '0 auto',
        flexWrap: 'wrap',
        gap: 16,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{
            width: 26,
            height: 26,
            background: 'linear-gradient(135deg, #4f46e5, #7c3aed)',
            borderRadius: 7,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 12,
            fontWeight: 800,
            color: '#fff',
            fontFamily: 'Syne, sans-serif',
          }}>L</div>
          <span style={{ fontFamily: 'Syne, sans-serif', fontWeight: 600, color: 'rgba(232,232,240,0.5)', fontSize: 14 }}>LYU</span>
        </div>
        <p style={{ fontSize: 13, color: 'rgba(232,232,240,0.3)' }}>
          © {new Date().getFullYear()} Local Youth Upliftment. All rights reserved.
        </p>
        <div style={{ display: 'flex', gap: 24 }}>
          {['Privacy', 'Terms', 'Contact'].map(item => (
            <a key={item} href="#" style={{
              fontSize: 13,
              color: 'rgba(232,232,240,0.35)',
              textDecoration: 'none',
              transition: 'color 0.2s',
            }}
            onMouseEnter={e => (e.currentTarget.style.color = 'rgba(232,232,240,0.7)')}
            onMouseLeave={e => (e.currentTarget.style.color = 'rgba(232,232,240,0.35)')}
            >{item}</a>
          ))}
        </div>
      </footer>
    </>
  );
}
