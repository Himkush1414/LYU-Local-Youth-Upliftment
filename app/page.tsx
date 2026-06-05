'use client'
import NavbarAuthSection from './components/NavbarAuthSection'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion'
import {
  Search, MapPin, Briefcase, Zap, Shield, TrendingUp,
  ArrowRight, Star, CheckCircle, Users, Building2,
  Sparkles, Menu, X, Mail, Phone, Linkedin, Instagram, Youtube
} from 'lucide-react'

const NAV_LINKS = [
  { label: 'Features', href: '#features' },
  { label: 'Jobs', href: '/jobs' },
  { label: 'About', href: '/about' },
  { label: 'For Employers', href: '/auth/login?role=employer' },
]

const STATS = [
  { value: '12,000+', label: 'Jobs Posted' },
  { value: '4,500+', label: 'Youth Placed' },
  { value: '180+', label: 'Cities Covered' },
  { value: '800+', label: 'Companies' },
]

const FEATURES = [
  { icon: MapPin, title: 'Hyperlocal Matching', desc: 'Jobs in your district, city, or state — filtered by how close they are to you.', bg: '#eff6ff', iconColor: '#2563eb' },
  { icon: Zap, title: 'AI Fit Score', desc: 'Every job shows a % match. Know your chances before you apply.', bg: '#f5f3ff', iconColor: '#7c3aed' },
  { icon: Shield, title: 'Verified Employers', desc: 'Every company is screened. Zero fake listings. Your safety first.', bg: '#f0fdf4', iconColor: '#15803d' },
  { icon: TrendingUp, title: 'Skill Gap Roadmap', desc: 'AI tells you exactly what to learn to land the job you want.', bg: '#fff7ed', iconColor: '#c2410c' },
]

const STEPS = [
  { num: '01', title: 'Create your profile', desc: 'Enter your name, email, location and skills. Takes under 3 minutes.' },
  { num: '02', title: 'Get matched by AI', desc: 'Our AI shows jobs that match your skills and are near you.' },
  { num: '03', title: 'Apply & get hired', desc: 'One-click apply. Track every application in real-time.' },
]

const TESTIMONIALS = [
  { text: 'LYU found me a job 3km from my home. The skill match feature is incredible.', name: 'Priya Sharma', role: 'Placed at TechCorp, Chandigarh', rating: 5 },
  { text: 'We hired 12 local candidates in one month. Quality applicants, zero noise.', name: 'Rahul Verma', role: 'HR Manager, Punjab', rating: 5 },
  { text: 'The AI resume review helped me fix my CV. Got 3 interview calls in a week.', name: 'Ananya Singh', role: 'Fresher, Ludhiana', rating: 5 },
]

const TRENDING = ['React Developer', 'Data Entry', 'Sales Executive', 'Python Developer', 'Digital Marketing', 'Accountant', 'ITI Electrician', 'Graphic Designer']

const SOCIAL = [
  { icon: Linkedin, label: 'LinkedIn', href: '#' },
  { icon: Instagram, label: 'Instagram', href: '#' },
  { icon: Youtube, label: 'YouTube', href: '#' },
]

const BADGES = ['🔒 SSL Secured', '✅ Verified Employers', '🆓 Free for Seekers', '🇮🇳 Made in India']

export default function LandingPage() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [trendingIdx, setTrendingIdx] = useState(0)
  const { scrollY } = useScroll()
  const heroY = useTransform(scrollY, [0, 400], [0, -60])
  const heroOpacity = useTransform(scrollY, [0, 350], [1, 0.4])

  useEffect(() => {
    const unsub = scrollY.on('change', v => setScrolled(v > 20))
    return unsub
  }, [scrollY])

  useEffect(() => {
    const t = setInterval(() => setTrendingIdx(i => (i + 1) % TRENDING.length), 2500)
    return () => clearInterval(t)
  }, [])

  return (
    <div style={{ minHeight: '100vh', background: 'white', overflowX: 'hidden', fontFamily: 'Inter, system-ui, sans-serif' }}>

      {/* ── FLOATING NAVBAR ── */}
      <motion.div
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 1.5, ease: 'easeOut' }}
        style={{
          position: 'fixed', top: 12, left: 0, right: 0, margin: '0 auto',
          width: 'calc(100% - 32px)', maxWidth: 1200, zIndex: 100,
          borderRadius: 16,
          background: scrolled ? 'rgba(255,255,255,0.97)' : 'rgba(255,255,255,0.88)',
          backdropFilter: 'blur(20px)', WebkitBackdropFilter: 'blur(20px)',
          boxShadow: scrolled ? '0 4px 32px rgba(0,0,0,0.12)' : '0 2px 16px rgba(0,0,0,0.06)',
          border: '1px solid rgba(226,232,240,0.9)',
          transition: 'box-shadow 0.3s ease, background 0.3s ease',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 20px' }}>

          {/* Logo */}
          <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: 10, textDecoration: 'none', flexShrink: 0 }}>
            <motion.div
              animate={{ y: [0, -2, 0, 1, 0], rotate: [0, 0.4, 0, -0.4, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
              style={{
                width: 36, height: 36, borderRadius: 10,
                background: 'linear-gradient(135deg,#2563eb,#4f46e5)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                boxShadow: '0 0 16px rgba(37,99,235,0.35)',
                position: 'relative', overflow: 'hidden', flexShrink: 0,
              }}
            >
              <motion.div
                animate={{ x: ['-30%', '30%'], y: ['-30%', '30%'], opacity: [0.5, 1, 0.5] }}
                transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
                style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse at 30% 30%, rgba(255,255,255,0.3) 0%, transparent 65%)', pointerEvents: 'none' }}
              />
              <span style={{ color: 'white', fontWeight: 900, fontSize: 12, position: 'relative', zIndex: 1 }}>LY</span>
            </motion.div>
            <motion.span
              animate={{ opacity: [1, 0.82, 1], letterSpacing: ['-0.02em', '0em', '-0.02em'] }}
              transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
              style={{ fontWeight: 900, fontSize: 18, color: '#0f172a' }}
            >
              LYU
            </motion.span>
          </Link>

          {/* Desktop nav links */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 2 }} className="nav-desktop">
            {NAV_LINKS.map(link => (
              <Link key={link.label} href={link.href} style={{
                fontSize: 14, fontWeight: 500, color: '#475569', padding: '7px 14px',
                borderRadius: 10, textDecoration: 'none', transition: 'all 0.15s',
              }}
                onMouseEnter={e => { e.currentTarget.style.background = '#f1f5f9'; e.currentTarget.style.color = '#0f172a' }}
                onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = '#475569' }}>
                {link.label}
              </Link>
            ))}
          </div>

          {/* Desktop auth */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }} className="nav-desktop">
            <Link href="/auth/login" style={{
              fontSize: 14, fontWeight: 600, color: '#374151', padding: '8px 16px',
              borderRadius: 10, textDecoration: 'none', transition: 'all 0.15s',
            }}
              onMouseEnter={e => e.currentTarget.style.background = '#f1f5f9'}
              onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
              Sign In
            </Link>
            <Link href="/auth/register" style={{
              fontSize: 14, fontWeight: 700, color: 'white', padding: '9px 20px', borderRadius: 12,
              background: 'linear-gradient(135deg,#2563eb,#1d4ed8)', textDecoration: 'none',
              boxShadow: '0 4px 14px rgba(37,99,235,0.35)',
              display: 'inline-flex', alignItems: 'center', gap: 6,
            }}>
              Get Started <ArrowRight style={{ width: 14, height: 14 }} />
            </Link>
          </div>

          {/* Mobile hamburger — only shows on small screens */}
          <button className="nav-mobile-btn" onClick={() => setMenuOpen(!menuOpen)} style={{
            width: 38, height: 38, borderRadius: 10, background: menuOpen ? '#f1f5f9' : 'transparent',
            border: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', justifyContent: 'center',
            cursor: 'pointer', transition: 'all 0.15s',
          }}>
            {menuOpen ? <X style={{ width: 18, height: 18, color: '#374151' }} /> : <Menu style={{ width: 18, height: 18, color: '#374151' }} />}
          </button>
        </div>

        {/* Mobile dropdown */}
        <AnimatePresence>
          {menuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              style={{ overflow: 'hidden', borderTop: '1px solid #f1f5f9' }}
            >
              <div style={{ padding: '12px 16px 16px' }}>
                {NAV_LINKS.map(link => (
                  <Link key={link.label} href={link.href} onClick={() => setMenuOpen(false)} style={{
                    display: 'block', padding: '11px 12px', borderRadius: 10,
                    color: '#374151', fontWeight: 500, fontSize: 15, textDecoration: 'none',
                  }}>{link.label}</Link>
                ))}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginTop: 12 }}>
                  <Link href="/auth/login" onClick={() => setMenuOpen(false)} style={{
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    padding: '11px 16px', borderRadius: 12, fontSize: 14, fontWeight: 700,
                    color: '#374151', background: '#f8fafc', border: '1.5px solid #e2e8f0', textDecoration: 'none',
                  }}>Sign In</Link>
                  <Link href="/auth/register" onClick={() => setMenuOpen(false)} style={{
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    padding: '11px 16px', borderRadius: 12, fontSize: 14, fontWeight: 700,
                    color: 'white', background: 'linear-gradient(135deg,#2563eb,#1d4ed8)', textDecoration: 'none',
                  }}>Get Started</Link>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* ── HERO ── */}
      <section style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', paddingTop: 90, position: 'relative', background: 'linear-gradient(160deg,#fafbff 0%,#f0f4ff 100%)' }}>
        <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', pointerEvents: 'none' }}>
          <div style={{ position: 'absolute', top: -100, right: -100, width: 500, height: 500, background: 'rgba(96,165,250,0.10)', borderRadius: '50%', filter: 'blur(80px)' }} />
          <div style={{ position: 'absolute', bottom: -100, left: -100, width: 400, height: 400, background: 'rgba(129,140,248,0.08)', borderRadius: '50%', filter: 'blur(80px)' }} />
        </div>

        <div style={{ maxWidth: 1200, margin: '0 auto', padding: '60px 24px', width: '100%', position: 'relative' }}>
          <div className="hero-grid">
            <motion.div style={{ y: heroY, opacity: heroOpacity }}>
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
                style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: '#eff6ff', border: '1px solid #bfdbfe', color: '#1d4ed8', padding: '6px 14px', borderRadius: 9999, fontSize: 12, fontWeight: 600, marginBottom: 24 }}>
                <span style={{ width: 6, height: 6, background: '#3b82f6', borderRadius: '50%', flexShrink: 0 }} />
                Now live in Punjab, Haryana & Delhi NCR
              </motion.div>

              <motion.h1 initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
                style={{ fontSize: 'clamp(2.4rem,5.5vw,4.2rem)', fontWeight: 900, color: '#0f172a', lineHeight: 1.06, letterSpacing: '-0.03em', marginBottom: 20 }}>
                Find jobs in your{' '}
                <span style={{ background: 'linear-gradient(135deg,#2563eb,#6366f1)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>neighbourhood</span>
              </motion.h1>

              <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
                style={{ fontSize: 17, color: '#64748b', lineHeight: 1.7, marginBottom: 10, maxWidth: 460 }}>
                LYU connects Indian youth with verified local employers. AI matches your skills to jobs near you — not just any job.
              </motion.p>

              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.35 }}
                style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, color: '#94a3b8', marginBottom: 28 }}>
                <span>People are finding:</span>
                <AnimatePresence mode="wait">
                  <motion.span key={trendingIdx} initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -5 }}
                    style={{ color: '#2563eb', fontWeight: 700 }}>{TRENDING[trendingIdx]}</motion.span>
                </AnimatePresence>
              </motion.div>

              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}
                style={{ display: 'flex', gap: 10, marginBottom: 18, maxWidth: 500 }}>
                <div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: 10, background: 'white', border: '2px solid #e2e8f0', borderRadius: 14, padding: '11px 16px', minWidth: 0 }}>
                  <Search style={{ width: 17, height: 17, color: '#94a3b8', flexShrink: 0 }} />
                  <input value={searchQuery} onChange={e => setSearchQuery(e.target.value)} placeholder="Job title, skill, or company..."
                    style={{ flex: 1, fontSize: 14, color: '#0f172a', background: 'transparent', border: 'none', outline: 'none', fontFamily: 'inherit', minWidth: 0 }} />
                </div>
                <Link href="/auth/register" style={{
                  display: 'inline-flex', alignItems: 'center', gap: 6, flexShrink: 0,
                  background: 'linear-gradient(135deg,#2563eb,#1d4ed8)', color: 'white',
                  fontWeight: 700, fontSize: 14, padding: '11px 22px', borderRadius: 14,
                  textDecoration: 'none', whiteSpace: 'nowrap',
                }}>Search <ArrowRight style={{ width: 14, height: 14 }} /></Link>
              </motion.div>

              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}
                style={{ display: 'flex', flexWrap: 'wrap', gap: 12 }}>
                <Link href="/auth/register" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: '#0f172a', color: 'white', fontWeight: 700, padding: '13px 24px', borderRadius: 14, textDecoration: 'none', fontSize: 14 }}>
                  <Briefcase style={{ width: 15, height: 15 }} /> I'm looking for work
                </Link>
                <Link href="/auth/login?role=employer" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: 'white', color: '#1e293b', fontWeight: 700, padding: '13px 24px', borderRadius: 14, border: '2px solid #e2e8f0', textDecoration: 'none', fontSize: 14 }}>
                  <Building2 style={{ width: 15, height: 15 }} /> I want to hire
                </Link>
              </motion.div>

              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.7 }}
                style={{ display: 'flex', flexWrap: 'wrap', gap: 16, marginTop: 28, paddingTop: 24, borderTop: '1px solid #f1f5f9' }}>
                {['Free forever for seekers', 'Verified employers only', 'AI-powered matching'].map(t => (
                  <div key={t} style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, color: '#64748b' }}>
                    <CheckCircle style={{ width: 13, height: 13, color: '#22c55e', flexShrink: 0 }} /> {t}
                  </div>
                ))}
              </motion.div>
            </motion.div>

            {/* Right card */}
            <motion.div initial={{ opacity: 0, x: 40 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.4, duration: 0.7 }}
              style={{ display: 'flex', justifyContent: 'center' }} className="hero-card-col">
              <div style={{ position: 'relative', maxWidth: 340, width: '100%' }}>
                <motion.div animate={{ y: [0, -8, 0] }} transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
                  style={{ background: 'white', borderRadius: 24, boxShadow: '0 24px 60px rgba(0,0,0,0.10)', border: '1px solid #f1f5f9', padding: 24 }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
                    <div>
                      <p style={{ fontSize: 10, color: '#94a3b8', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em' }}>Jobs for you</p>
                      <p style={{ fontSize: 14, fontWeight: 800, color: '#0f172a' }}>Based on your skills</p>
                    </div>
                    <div style={{ width: 34, height: 34, background: '#eff6ff', borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <Sparkles style={{ width: 16, height: 16, color: '#2563eb' }} />
                    </div>
                  </div>
                  {[
                    { title: 'React Developer', co: 'TechCorp · Chandigarh', match: 92, matchColor: '#16a34a', salary: '₹30K/mo' },
                    { title: 'Data Entry', co: 'InfoSys · Ludhiana', match: 78, matchColor: '#2563eb', salary: '₹15K/mo' },
                    { title: 'Sales Executive', co: 'RetailMax · Amritsar', match: 65, matchColor: '#ea580c', salary: '₹20K/mo' },
                  ].map((job, i) => (
                    <div key={job.title} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '11px 0', borderBottom: i < 2 ? '1px solid #f8fafc' : 'none' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 11 }}>
                        <div style={{ width: 34, height: 34, borderRadius: 10, background: 'linear-gradient(135deg,#2563eb,#4f46e5)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                          <span style={{ color: 'white', fontWeight: 800, fontSize: 11 }}>{job.title[0]}</span>
                        </div>
                        <div>
                          <p style={{ fontSize: 13, fontWeight: 800, color: '#0f172a', lineHeight: 1.2 }}>{job.title}</p>
                          <p style={{ fontSize: 11, color: '#94a3b8' }}>{job.co}</p>
                        </div>
                      </div>
                      <div style={{ textAlign: 'right' }}>
                        <p style={{ fontSize: 14, fontWeight: 900, color: job.matchColor }}>{job.match}%</p>
                        <p style={{ fontSize: 11, color: '#94a3b8' }}>{job.salary}</p>
                      </div>
                    </div>
                  ))}
                </motion.div>
                <motion.div animate={{ y: [0, 5, 0] }} transition={{ duration: 4, repeat: Infinity, delay: 1 }}
                  style={{ position: 'absolute', top: -14, right: -14, background: 'rgba(255,255,255,0.96)', backdropFilter: 'blur(16px)', border: '1px solid #e2e8f0', borderRadius: 14, padding: '10px 14px', boxShadow: '0 8px 24px rgba(0,0,0,0.08)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <div style={{ width: 26, height: 26, background: '#f0fdf4', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                      <CheckCircle style={{ width: 14, height: 14, color: '#16a34a' }} />
                    </div>
                    <div>
                      <p style={{ fontSize: 11, fontWeight: 800, color: '#0f172a' }}>Application Viewed</p>
                      <p style={{ fontSize: 10, color: '#94a3b8' }}>TechCorp is reviewing you</p>
                    </div>
                  </div>
                </motion.div>
                <motion.div animate={{ y: [0, -5, 0] }} transition={{ duration: 5, repeat: Infinity, delay: 0.5 }}
                  style={{ position: 'absolute', bottom: -18, left: -18, background: 'rgba(255,255,255,0.96)', backdropFilter: 'blur(16px)', border: '1px solid #e2e8f0', borderRadius: 14, padding: '10px 16px', boxShadow: '0 8px 24px rgba(0,0,0,0.08)' }}>
                  <p style={{ fontSize: 10, color: '#64748b', marginBottom: 2, fontWeight: 600 }}>Your match score</p>
                  <p style={{ fontSize: 26, fontWeight: 900, color: '#2563eb', lineHeight: 1 }}>92%</p>
                  <p style={{ fontSize: 10, color: '#94a3b8', marginTop: 2 }}>React Developer</p>
                </motion.div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── STATS ── */}
      <section style={{ background: '#0f172a', padding: '56px 24px' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 24 }}>
          {STATS.map((stat, i) => (
            <motion.div key={stat.label} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }} transition={{ delay: i * 0.1 }} style={{ textAlign: 'center' }}>
              <p style={{ fontSize: 'clamp(1.5rem,3vw,2.2rem)', fontWeight: 900, color: 'white', marginBottom: 4 }}>{stat.value}</p>
              <p style={{ color: '#64748b', fontSize: 13, fontWeight: 500 }}>{stat.label}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── FEATURES ── */}
      <section id="features" style={{ padding: '96px 24px', background: 'white' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} style={{ textAlign: 'center', marginBottom: 56 }}>
            <p style={{ color: '#2563eb', fontSize: 11, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 12 }}>Why LYU</p>
            <h2 style={{ fontSize: 'clamp(1.8rem,3.5vw,2.8rem)', fontWeight: 900, color: '#0f172a', marginBottom: 14 }}>Built for Indian youth</h2>
            <p style={{ color: '#64748b', fontSize: 16, maxWidth: 460, margin: '0 auto', lineHeight: 1.7 }}>Not a generic job board. Every feature is designed for local job seekers.</p>
          </motion.div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(220px,1fr))', gap: 18 }}>
            {FEATURES.map((f, i) => (
              <motion.div key={f.title} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }} transition={{ delay: i * 0.1 }}
                whileHover={{ y: -4, transition: { duration: 0.2 } }}
                style={{ background: 'white', borderRadius: 18, border: '1px solid #f1f5f9', padding: 24, boxShadow: '0 1px 4px rgba(0,0,0,0.04)' }}>
                <div style={{ width: 46, height: 46, borderRadius: 13, background: f.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 16 }}>
                  <f.icon style={{ width: 22, height: 22, color: f.iconColor }} />
                </div>
                <h3 style={{ fontWeight: 800, color: '#0f172a', marginBottom: 8, fontSize: 15 }}>{f.title}</h3>
                <p style={{ color: '#64748b', fontSize: 13, lineHeight: 1.6 }}>{f.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS ── */}
      <section style={{ padding: '96px 24px', background: '#f8fafc' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} style={{ textAlign: 'center', marginBottom: 56 }}>
            <p style={{ color: '#2563eb', fontSize: 11, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 12 }}>Simple process</p>
            <h2 style={{ fontSize: 'clamp(1.8rem,3.5vw,2.8rem)', fontWeight: 900, color: '#0f172a' }}>Get hired in 3 steps</h2>
          </motion.div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(220px,1fr))', gap: 32 }}>
            {STEPS.map((step, i) => (
              <motion.div key={step.num} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }} transition={{ delay: i * 0.2 }} style={{ textAlign: 'center' }}>
                <div style={{ width: 58, height: 58, background: 'white', border: '2px solid #bfdbfe', borderRadius: 16, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
                  <span style={{ color: '#2563eb', fontWeight: 900, fontSize: 17 }}>{step.num}</span>
                </div>
                <h3 style={{ fontWeight: 800, color: '#0f172a', marginBottom: 8, fontSize: 16 }}>{step.title}</h3>
                <p style={{ color: '#64748b', fontSize: 13, lineHeight: 1.65 }}>{step.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── TESTIMONIALS ── */}
      <section style={{ padding: '96px 24px', background: 'white' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} style={{ textAlign: 'center', marginBottom: 56 }}>
            <p style={{ color: '#2563eb', fontSize: 11, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 12 }}>Real stories</p>
            <h2 style={{ fontSize: 'clamp(1.8rem,3.5vw,2.8rem)', fontWeight: 900, color: '#0f172a' }}>Real impact, real people</h2>
          </motion.div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(260px,1fr))', gap: 18 }}>
            {TESTIMONIALS.map((t, i) => (
              <motion.div key={t.name} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }} transition={{ delay: i * 0.1 }}
                style={{ background: 'white', borderRadius: 18, border: '1px solid #f1f5f9', padding: 24, boxShadow: '0 1px 4px rgba(0,0,0,0.04)' }}>
                <div style={{ display: 'flex', gap: 2, marginBottom: 14 }}>
                  {[...Array(t.rating)].map((_, j) => <Star key={j} style={{ width: 13, height: 13, fill: '#fbbf24', color: '#fbbf24' }} />)}
                </div>
                <p style={{ color: '#374151', lineHeight: 1.7, marginBottom: 18, fontSize: 14 }}>"{t.text}"</p>
                <div style={{ display: 'flex', alignItems: 'center', gap: 11, paddingTop: 16, borderTop: '1px solid #f8fafc' }}>
                  <div style={{ width: 34, height: 34, borderRadius: 10, background: 'linear-gradient(135deg,#2563eb,#6366f1)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <span style={{ color: 'white', fontWeight: 800, fontSize: 12 }}>{t.name[0]}</span>
                  </div>
                  <div>
                    <p style={{ fontWeight: 800, color: '#0f172a', fontSize: 13 }}>{t.name}</p>
                    <p style={{ fontSize: 11, color: '#94a3b8' }}>{t.role}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section style={{ padding: '96px 24px', background: 'linear-gradient(135deg,#0f172a 0%,#1e3a8a 50%,#0f172a 100%)', position: 'relative', overflow: 'hidden' }}>
        <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
          style={{ maxWidth: 600, margin: '0 auto', textAlign: 'center', position: 'relative' }}>
          <p style={{ color: '#93c5fd', fontSize: 11, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 16 }}>Join thousands of youth</p>
          <h2 style={{ fontSize: 'clamp(1.8rem,3.5vw,2.8rem)', fontWeight: 900, color: 'white', marginBottom: 16 }}>
            Your next job is{' '}
            <span style={{ background: 'linear-gradient(135deg,#60a5fa,#818cf8)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>waiting</span>
          </h2>
          <p style={{ color: '#94a3b8', fontSize: 16, marginBottom: 40, lineHeight: 1.7 }}>Join 4,500+ youth who found jobs through LYU. Free forever for job seekers.</p>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 14, justifyContent: 'center' }}>
            <Link href="/auth/register" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: '#2563eb', color: 'white', fontWeight: 700, padding: '14px 32px', borderRadius: 16, textDecoration: 'none', fontSize: 15 }}>
              Create Free Account <ArrowRight style={{ width: 17, height: 17 }} />
            </Link>
            <Link href="/jobs" style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(255,255,255,0.08)', color: 'white', fontWeight: 700, padding: '14px 32px', borderRadius: 16, border: '1px solid rgba(255,255,255,0.18)', textDecoration: 'none', fontSize: 15 }}>
              Browse Jobs First
            </Link>
          </div>
        </motion.div>
      </section>

      {/* ── FOOTER ── */}
      <footer style={{ background: '#020617', fontFamily: 'Inter, system-ui, sans-serif' }}>

        {/* Contact bar */}
        <div style={{ borderBottom: '1px solid rgba(255,255,255,0.07)', padding: '16px 24px' }}>
          <div style={{ maxWidth: 1200, margin: '0 auto', display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: 12 }}>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 20 }}>
              <a href="mailto:support@lyu.in" style={{ display: 'flex', alignItems: 'center', gap: 7, color: '#64748b', textDecoration: 'none', fontSize: 13 }}>
                <Mail style={{ width: 14, height: 14, color: '#3b82f6' }} /> support@lyu.in
              </a>
              <a href="tel:+911800000000" style={{ display: 'flex', alignItems: 'center', gap: 7, color: '#64748b', textDecoration: 'none', fontSize: 13 }}>
                <Phone style={{ width: 14, height: 14, color: '#3b82f6' }} /> 1800-000-0000
              </a>
            </div>
            <div style={{ display: 'flex', gap: 8 }}>
              {SOCIAL.map(s => (
                <a key={s.label} href={s.href} aria-label={s.label}
                  style={{ width: 32, height: 32, background: 'rgba(255,255,255,0.06)', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <s.icon style={{ width: 14, height: 14, color: '#64748b' }} />
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Main footer — fixed 5-column grid, no overflow */}
        <div style={{ maxWidth: 1200, margin: '0 auto', padding: '48px 24px' }}>
          <div style={{
            display: 'grid',
            gridTemplateColumns: '220px 1fr 1fr 1fr 1fr',
            gap: '32px 40px',
            alignItems: 'start',
          }}>

            {/* Brand col */}
            <div>
              <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: 9, textDecoration: 'none', marginBottom: 14 }}>
                <div style={{ width: 34, height: 34, borderRadius: 10, background: 'linear-gradient(135deg,#2563eb,#4f46e5)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 0 14px rgba(37,99,235,0.3)', flexShrink: 0 }}>
                  <span style={{ color: 'white', fontWeight: 900, fontSize: 11 }}>LY</span>
                </div>
                <span style={{ fontWeight: 900, fontSize: 18, color: 'white' }}>LYU</span>
              </Link>
              <p style={{ color: '#64748b', fontSize: 12, lineHeight: 1.7, marginBottom: 16 }}>
                Empowering Indian youth through verified local jobs and AI-powered skill matching.
              </p>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 18 }}>
                {BADGES.map(b => (
                  <span key={b} style={{ fontSize: 10, background: 'rgba(255,255,255,0.05)', color: '#94a3b8', padding: '3px 10px', borderRadius: 9999, border: '1px solid rgba(255,255,255,0.08)' }}>{b}</span>
                ))}
              </div>
              <p style={{ color: '#475569', fontSize: 11, fontWeight: 600, marginBottom: 8 }}>Job alerts in your city</p>
              <div style={{ display: 'flex', gap: 6 }}>
                <input type="email" placeholder="your@email.com" style={{ flex: 1, minWidth: 0, background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8, padding: '7px 11px', fontSize: 12, color: 'white', outline: 'none', fontFamily: 'inherit' }} />
                <button style={{ background: '#2563eb', color: 'white', fontWeight: 700, fontSize: 12, padding: '7px 12px', borderRadius: 8, border: 'none', cursor: 'pointer', flexShrink: 0, fontFamily: 'inherit' }}>Go</button>
              </div>
            </div>

            {/* Job Seekers */}
            <div>
              <h4 style={{ fontWeight: 800, color: 'white', marginBottom: 14, fontSize: 12, textTransform: 'uppercase', letterSpacing: '0.06em' }}>Job Seekers</h4>
              <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 9 }}>
                {[{ label: 'Browse All Jobs', href: '/jobs' }, { label: 'Create Profile', href: '/auth/register' }, { label: 'AI Resume Review', href: '/auth/register' }, { label: 'Skill Analysis', href: '/auth/register' }, { label: 'Job Alerts', href: '/auth/register' }].map(l => (
                  <li key={l.label}><Link href={l.href} style={{ color: '#64748b', textDecoration: 'none', fontSize: 13 }}>{l.label}</Link></li>
                ))}
              </ul>
            </div>

            {/* Employers */}
            <div>
              <h4 style={{ fontWeight: 800, color: 'white', marginBottom: 14, fontSize: 12, textTransform: 'uppercase', letterSpacing: '0.06em' }}>Employers</h4>
              <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 9 }}>
                {[{ label: 'Post a Job', href: '/auth/login' }, { label: 'Browse Candidates', href: '/auth/login' }, { label: 'Analytics', href: '/auth/login' }, { label: 'Pricing', href: '#' }, { label: 'Verified Badge', href: '#' }].map(l => (
                  <li key={l.label}><Link href={l.href} style={{ color: '#64748b', textDecoration: 'none', fontSize: 13 }}>{l.label}</Link></li>
                ))}
              </ul>
            </div>

            {/* Company */}
            <div>
              <h4 style={{ fontWeight: 800, color: 'white', marginBottom: 14, fontSize: 12, textTransform: 'uppercase', letterSpacing: '0.06em' }}>Company</h4>
              <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 9 }}>
                {[{ label: 'About LYU', href: '/about' }, { label: 'Features', href: '#features' }, { label: 'Blog', href: '#' }, { label: 'Careers', href: '#' }, { label: 'Press', href: '#' }].map(l => (
                  <li key={l.label}><Link href={l.href} style={{ color: '#64748b', textDecoration: 'none', fontSize: 13 }}>{l.label}</Link></li>
                ))}
              </ul>
            </div>

            {/* Legal & Support */}
            <div>
              <h4 style={{ fontWeight: 800, color: 'white', marginBottom: 14, fontSize: 12, textTransform: 'uppercase', letterSpacing: '0.06em' }}>Legal & Support</h4>
              <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 9 }}>
                {[{ label: 'Terms of Service', href: '/terms' }, { label: 'Privacy Policy', href: '/privacy' }, { label: 'Cookie Policy', href: '/cookies' }, { label: 'Grievance Policy', href: '/grievance' }, { label: 'Help Centre', href: '/help' }].map(l => (
                  <li key={l.label}><Link href={l.href} style={{ color: '#64748b', textDecoration: 'none', fontSize: 13 }}>{l.label}</Link></li>
                ))}
              </ul>
            </div>

          </div>
        </div>

        {/* Bottom bar */}
        <div style={{ borderTop: '1px solid rgba(255,255,255,0.05)', padding: '20px 24px', textAlign: 'center' }}>
          <div style={{ maxWidth: 1200, margin: '0 auto', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10 }}>
            <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '6px 20px' }}>
              {[{ label: 'Terms of Service', href: '/terms' }, { label: 'Privacy Policy', href: '/privacy' }, { label: 'Cookie Policy', href: '/cookies' }, { label: 'Grievance Officer', href: '/grievance' }, { label: 'Sitemap', href: '#' }].map(l => (
                <Link key={l.label} href={l.href} style={{ color: '#475569', textDecoration: 'none', fontSize: 12 }}>{l.label}</Link>
              ))}
            </div>
            <p style={{ color: '#475569', fontSize: 12 }}>© 2026 Local Youth Upliftment Pvt. Ltd. All rights reserved. · Registered in India</p>
          </div>
        </div>
      </footer>

      <style>{`
        * { box-sizing: border-box; }
        .nav-desktop { display: flex !important; }
        .nav-mobile-btn { display: none !important; }
        .hero-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 48px; align-items: center; }
        .hero-card-col { display: flex; }

        @media (max-width: 1024px) {
          footer div[style*="grid-template-columns: 220px"] {
            grid-template-columns: 1fr 1fr 1fr !important;
          }
        }
        @media (max-width: 900px) {
          .nav-desktop { display: none !important; }
          .nav-mobile-btn { display: flex !important; }
          .hero-grid { grid-template-columns: 1fr !important; }
          .hero-card-col { display: none !important; }
          footer div[style*="grid-template-columns: 220px"] {
            grid-template-columns: 1fr 1fr !important;
          }
        }
        @media (max-width: 540px) {
          footer div[style*="grid-template-columns: 220px"] {
            grid-template-columns: 1fr !important;
          }
          .stats-grid { grid-template-columns: repeat(2,1fr) !important; }
        }
        @keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.4; } }
      `}</style>
    </div>
  )
}
