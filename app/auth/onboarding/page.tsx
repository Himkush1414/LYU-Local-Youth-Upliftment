'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/client';

type Role = 'talent' | 'recruiter' | null;

export default function OnboardingPage() {
  const router = useRouter();
  const [selected, setSelected] = useState<Role>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const supabase = createClient();

  const handleContinue = async () => {
    if (!selected) return;
    setLoading(true);
    setError('');

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      router.replace('/auth/login');
      return;
    }

    const { error: upsertError } = await supabase
      .from('profiles')
      .upsert({
        id: user.id,
        role: selected,
        full_name: user.user_metadata?.full_name || '',
        email: user.email,
        updated_at: new Date().toISOString(),
      });

    if (upsertError) {
      setError(upsertError.message);
      setLoading(false);
      return;
    }

    router.replace(selected === 'talent' ? '/seeker/dashboard' : '/employer/dashboard');
  };

  const cards = [
    {
      id: 'talent' as Role,
      icon: (
        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
          <circle cx="12" cy="7" r="4"/>
        </svg>
      ),
      label: 'Talent',
      subtitle: 'I\'m looking for work',
      bullets: [
        'AI-powered resume builder',
        'Personalized job roadmap',
        'Skill gap analysis',
        'Mock interview practice',
        'Career AI chat assistant',
      ],
      color: '#4f46e5',
      glow: 'rgba(79,70,229,0.2)',
    },
    {
      id: 'recruiter' as Role,
      icon: (
        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <rect x="2" y="7" width="20" height="14" rx="2" ry="2"/>
          <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/>
        </svg>
      ),
      label: 'Recruiter',
      subtitle: 'I\'m hiring talent',
      bullets: [
        'Smart candidate matching',
        'AI-screened applicants',
        'Post jobs in minutes',
        'Talent pool access',
        'Analytics dashboard',
      ],
      color: '#7c3aed',
      glow: 'rgba(124,58,237,0.2)',
    },
  ];

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=DM+Sans:opsz,wght@9..40,300;9..40,400;9..40,500&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        body { font-family: 'DM Sans', sans-serif; }
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(24px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes floatOrb {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-20px); }
        }
        @keyframes cardIn {
          from { opacity: 0; transform: translateY(32px) scale(0.97); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }
        .role-card {
          flex: 1;
          min-width: 260px;
          max-width: 340px;
          background: rgba(255,255,255,0.03);
          border: 2px solid rgba(255,255,255,0.08);
          border-radius: 24px;
          padding: 36px 32px;
          cursor: pointer;
          transition: transform 0.25s cubic-bezier(0.16,1,0.3,1), border-color 0.25s, box-shadow 0.25s, background 0.25s;
          position: relative;
          overflow: hidden;
          animation: cardIn 0.7s cubic-bezier(0.16,1,0.3,1) both;
        }
        .role-card:hover {
          transform: translateY(-4px);
        }
        .role-card.selected-talent {
          border-color: #4f46e5;
          background: rgba(79,70,229,0.06);
          box-shadow: 0 16px 64px rgba(79,70,229,0.2), 0 0 0 1px rgba(79,70,229,0.2);
        }
        .role-card.selected-recruiter {
          border-color: #7c3aed;
          background: rgba(124,58,237,0.06);
          box-shadow: 0 16px 64px rgba(124,58,237,0.2), 0 0 0 1px rgba(124,58,237,0.2);
        }
        .btn-continue {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
          background: linear-gradient(135deg, #4f46e5, #6d28d9);
          color: #fff;
          border: none;
          border-radius: 14px;
          padding: 16px 48px;
          font-family: 'DM Sans', sans-serif;
          font-size: 16px;
          font-weight: 500;
          cursor: pointer;
          transition: opacity 0.2s, transform 0.15s, box-shadow 0.2s;
          letter-spacing: 0.01em;
          box-shadow: 0 8px 32px rgba(79,70,229,0.3);
        }
        .btn-continue:hover:not(:disabled) {
          opacity: 0.92;
          transform: translateY(-1px);
          box-shadow: 0 12px 48px rgba(79,70,229,0.45);
        }
        .btn-continue:disabled {
          opacity: 0.35;
          cursor: not-allowed;
          transform: none;
          box-shadow: none;
        }
        .check-badge {
          position: absolute;
          top: 16px;
          right: 16px;
          width: 24px;
          height: 24px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: opacity 0.2s, transform 0.2s;
        }
      `}</style>

      <div style={{
        minHeight: '100vh',
        background: '#0a0a0f',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '32px 24px',
        position: 'relative',
        overflow: 'hidden',
      }}>
        {/* BG orbs */}
        <div style={{
          position: 'absolute', top: '5%', left: '5%', width: 500, height: 500,
          background: 'radial-gradient(circle, rgba(79,70,229,0.1) 0%, transparent 65%)',
          animation: 'floatOrb 10s ease-in-out infinite', pointerEvents: 'none',
        }} />
        <div style={{
          position: 'absolute', bottom: '5%', right: '5%', width: 400, height: 400,
          background: 'radial-gradient(circle, rgba(124,58,237,0.1) 0%, transparent 65%)',
          animation: 'floatOrb 13s ease-in-out infinite reverse', pointerEvents: 'none',
        }} />

        <div style={{ position: 'relative', zIndex: 1, width: '100%', maxWidth: 760 }}>
          {/* Logo */}
          <div style={{ textAlign: 'center', marginBottom: 48, animation: 'fadeUp 0.6s cubic-bezier(0.16,1,0.3,1) both' }}>
            <Link href="/" style={{ textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: 10 }}>
              <div style={{
                width: 36,
                height: 36,
                background: 'linear-gradient(135deg, #4f46e5, #7c3aed)',
                borderRadius: 10,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontFamily: 'Syne, sans-serif', fontWeight: 800, fontSize: 16, color: '#fff',
              }}>L</div>
              <span style={{ fontFamily: 'Syne, sans-serif', fontWeight: 700, fontSize: 20, color: '#fff', letterSpacing: '-0.02em' }}>LYU</span>
            </Link>
          </div>

          {/* Header */}
          <div style={{ textAlign: 'center', marginBottom: 48, animation: 'fadeUp 0.7s 0.05s cubic-bezier(0.16,1,0.3,1) both' }}>
            <div style={{
              display: 'inline-flex', alignItems: 'center', gap: 8,
              background: 'rgba(79,70,229,0.1)', border: '1px solid rgba(79,70,229,0.25)',
              borderRadius: 100, padding: '6px 16px', fontSize: 12,
              color: '#a5b4fc', fontWeight: 500, marginBottom: 20, letterSpacing: '0.04em',
              textTransform: 'uppercase',
            }}>
              Step 1 of 1 · Almost there
            </div>

            <h1 style={{
              fontFamily: 'Syne, sans-serif',
              fontWeight: 800,
              fontSize: 'clamp(28px, 4vw, 42px)',
              color: '#fff',
              letterSpacing: '-0.025em',
              marginBottom: 14,
              lineHeight: 1.15,
            }}>What brings you to LYU?</h1>
            <p style={{
              fontSize: 16,
              color: 'rgba(232,232,240,0.45)',
              lineHeight: 1.6,
              maxWidth: 480,
              margin: '0 auto',
            }}>
              Tell us your goal and we'll tailor your entire experience — from dashboard to recommendations.
            </p>
          </div>

          {/* Role cards */}
          <div style={{
            display: 'flex',
            gap: 20,
            justifyContent: 'center',
            flexWrap: 'wrap',
            marginBottom: 40,
          }}>
            {cards.map((card, i) => (
              <div
                key={card.id}
                className={`role-card ${selected === card.id ? `selected-${card.id}` : ''}`}
                style={{ animationDelay: `${0.1 + i * 0.1}s` }}
                onClick={() => setSelected(card.id)}
              >
                {/* Check */}
                <div className="check-badge" style={{
                  background: selected === card.id ? card.color : 'rgba(255,255,255,0.06)',
                  opacity: selected === card.id ? 1 : 0.4,
                  transform: selected === card.id ? 'scale(1)' : 'scale(0.8)',
                }}>
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20 6 9 17 4 12"/>
                  </svg>
                </div>

                {/* Icon */}
                <div style={{
                  width: 64,
                  height: 64,
                  background: selected === card.id ? `${card.color}22` : 'rgba(255,255,255,0.05)',
                  border: `1px solid ${selected === card.id ? card.color + '40' : 'rgba(255,255,255,0.08)'}`,
                  borderRadius: 18,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  marginBottom: 24,
                  color: selected === card.id ? card.color : 'rgba(232,232,240,0.45)',
                  transition: 'background 0.25s, border-color 0.25s, color 0.25s',
                }}>
                  {card.icon}
                </div>

                <h3 style={{
                  fontFamily: 'Syne, sans-serif',
                  fontWeight: 700,
                  fontSize: 22,
                  color: '#fff',
                  letterSpacing: '-0.02em',
                  marginBottom: 4,
                }}>{card.label}</h3>
                <p style={{
                  fontSize: 14,
                  color: 'rgba(232,232,240,0.45)',
                  marginBottom: 24,
                }}>{card.subtitle}</p>

                <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                  {card.bullets.map(b => (
                    <div key={b} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <div style={{
                        width: 18,
                        height: 18,
                        borderRadius: '50%',
                        background: selected === card.id ? `${card.color}20` : 'rgba(255,255,255,0.05)',
                        border: `1px solid ${selected === card.id ? card.color + '35' : 'rgba(255,255,255,0.08)'}`,
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        flexShrink: 0,
                        transition: 'all 0.25s',
                      }}>
                        <svg width="10" height="10" viewBox="0 0 24 24" fill="none"
                          stroke={selected === card.id ? card.color : 'rgba(232,232,240,0.3)'}
                          strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"
                          style={{ transition: 'stroke 0.25s' }}>
                          <polyline points="20 6 9 17 4 12"/>
                        </svg>
                      </div>
                      <span style={{
                        fontSize: 13.5,
                        color: selected === card.id ? 'rgba(232,232,240,0.75)' : 'rgba(232,232,240,0.4)',
                        transition: 'color 0.25s',
                      }}>{b}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Error */}
          {error && (
            <div style={{
              background: 'rgba(239,68,68,0.1)',
              border: '1px solid rgba(239,68,68,0.2)',
              borderRadius: 10,
              padding: '12px 16px',
              fontSize: 13.5,
              color: '#fca5a5',
              marginBottom: 20,
              textAlign: 'center',
            }}>
              {error}
            </div>
          )}

          {/* CTA */}
          <div style={{ textAlign: 'center', animation: 'fadeUp 0.8s 0.35s cubic-bezier(0.16,1,0.3,1) both' }}>
            <button
              className="btn-continue"
              onClick={handleContinue}
              disabled={!selected || loading}
            >
              {loading ? (
                <>
                  <div style={{ width: 18, height: 18, border: '2px solid rgba(255,255,255,0.3)', borderTopColor: '#fff', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
                  Setting up your account...
                </>
              ) : (
                <>
                  Continue as {selected === 'talent' ? 'Talent' : selected === 'recruiter' ? 'Recruiter' : '...'}
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M5 12h14M12 5l7 7-7 7"/>
                  </svg>
                </>
              )}
            </button>
            {!selected && (
              <p style={{ marginTop: 12, fontSize: 13, color: 'rgba(232,232,240,0.25)' }}>
                Select a role above to continue
              </p>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
