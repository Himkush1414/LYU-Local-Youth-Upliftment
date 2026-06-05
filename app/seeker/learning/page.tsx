'use client'

import { useState } from 'react'
import Link from 'next/link'

const courses = [
  { id: '1', title: 'Complete React Developer Course', provider: 'Udemy', duration: '40 hrs', level: 'Intermediate', skill: 'React', rating: 4.8, free: false, url: '#' },
  { id: '2', title: 'JavaScript Fundamentals', provider: 'freeCodeCamp', duration: '15 hrs', level: 'Beginner', skill: 'JavaScript', rating: 4.9, free: true, url: '#' },
  { id: '3', title: 'TypeScript Crash Course', provider: 'YouTube', duration: '8 hrs', level: 'Intermediate', skill: 'TypeScript', rating: 4.7, free: true, url: '#' },
  { id: '4', title: 'Python for Beginners', provider: 'Coursera', duration: '25 hrs', level: 'Beginner', skill: 'Python', rating: 4.6, free: false, url: '#' },
  { id: '5', title: 'Excel & Data Entry Mastery', provider: 'Udemy', duration: '12 hrs', level: 'Beginner', skill: 'Excel', rating: 4.5, free: false, url: '#' },
  { id: '6', title: 'Digital Marketing Fundamentals', provider: 'Google', duration: '10 hrs', level: 'Beginner', skill: 'Marketing', rating: 4.8, free: true, url: '#' },
]

const gaps = [
  { skill: 'TypeScript', importance: 'High', jobs: 45, weeks: 4 },
  { skill: 'Node.js', importance: 'Medium', jobs: 32, weeks: 6 },
  { skill: 'Docker', importance: 'Low', jobs: 18, weeks: 8 },
]

const faqItems = [
  { title: 'How are missing skills identified?', content: 'We compare your listed skills against requirements of jobs you have saved or applied to, and identify what is most commonly required.' },
  { title: 'Are the courses free?', content: 'We link to both free and paid resources. Free resources are clearly marked. We do not charge any commission.' },
  { title: 'Will learning these skills guarantee a job?', content: 'No platform can guarantee employment. However, having in-demand skills significantly increases your match score and the number of jobs you qualify for.' },
]

const importanceColor = (i: string) =>
  i === 'High' ? { color: '#b91c1c', bg: '#fef2f2', border: '1px solid #fecaca' } :
  i === 'Medium' ? { color: '#b45309', bg: '#fffbeb', border: '1px solid #fde68a' } :
  { color: '#475569', bg: '#f8fafc', border: '1px solid #e2e8f0' }

export default function LearningPage() {
  const [openFaq, setOpenFaq] = useState<number | null>(null)
  const [filter, setFilter] = useState('All')

  const filtered = filter === 'All' ? courses : filter === 'Free' ? courses.filter(c => c.free) : courses.filter(c => c.level === filter)

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 28, fontFamily: 'Inter, system-ui, sans-serif' }}>
      <div>
        <h1 style={{ fontSize: 22, fontWeight: 900, color: '#0f172a', marginBottom: 4 }}>Learning & Skill Gap</h1>
        <p style={{ color: '#64748b', fontSize: 14 }}>Skills you need to land the jobs you want</p>
      </div>

      {/* Skill gaps */}
      <div style={{ background: 'white', borderRadius: 16, border: '1px solid #e2e8f0', overflow: 'hidden', boxShadow: '0 1px 4px rgba(0,0,0,0.04)' }}>
        <div style={{ padding: '16px 20px', borderBottom: '1px solid #f1f5f9', display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ width: 36, height: 36, borderRadius: 10, background: '#fff7ed', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#c2410c' }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/>
            </svg>
          </div>
          <div>
            <h2 style={{ fontWeight: 800, color: '#0f172a', fontSize: 15 }}>Your Skill Gaps</h2>
            <p style={{ fontSize: 12, color: '#94a3b8' }}>Based on jobs you are interested in</p>
          </div>
        </div>
        <div>
          {gaps.map((g, i) => {
            const ic = importanceColor(g.importance)
            return (
              <div key={g.skill} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 20px', borderBottom: i < gaps.length - 1 ? '1px solid #f8fafc' : 'none', flexWrap: 'wrap', gap: 10 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <span style={{ fontSize: 12, fontWeight: 700, padding: '3px 10px', borderRadius: 9999, ...ic }}>{g.skill}</span>
                  <div>
                    <p style={{ fontSize: 13, color: '#475569' }}>{g.jobs} jobs require this</p>
                    <p style={{ fontSize: 11, color: '#94a3b8' }}>~{g.weeks} weeks to learn</p>
                  </div>
                </div>
                <a href="#" style={{ display: 'inline-flex', alignItems: 'center', gap: 4, fontSize: 12, fontWeight: 700, color: '#2563eb', textDecoration: 'none' }}>
                  Learn now
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="9 18 15 12 9 6"/>
                  </svg>
                </a>
              </div>
            )
          })}
        </div>
      </div>

      {/* Courses */}
      <div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14, flexWrap: 'wrap', gap: 10 }}>
          <h2 style={{ fontWeight: 800, color: '#0f172a', fontSize: 16 }}>Recommended Courses</h2>
          <div style={{ display: 'flex', gap: 6 }}>
            {['All', 'Free', 'Beginner', 'Intermediate'].map(f => (
              <button key={f} onClick={() => setFilter(f)} style={{
                padding: '5px 13px', borderRadius: 9999, fontSize: 12, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit', border: 'none',
                background: filter === f ? '#2563eb' : '#f1f5f9', color: filter === f ? 'white' : '#475569', transition: 'all 0.15s',
              }}>{f}</button>
            ))}
          </div>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(260px,1fr))', gap: 14 }}>
          {filtered.map(c => (
            <div key={c.id} style={{ background: 'white', borderRadius: 14, border: '1px solid #e2e8f0', padding: '18px 20px', boxShadow: '0 1px 4px rgba(0,0,0,0.04)', transition: 'all 0.2s' }}
              onMouseEnter={e => { e.currentTarget.style.boxShadow = '0 6px 20px rgba(0,0,0,0.08)'; e.currentTarget.style.transform = 'translateY(-2px)' }}
              onMouseLeave={e => { e.currentTarget.style.boxShadow = '0 1px 4px rgba(0,0,0,0.04)'; e.currentTarget.style.transform = 'translateY(0)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 10 }}>
                <p style={{ fontWeight: 800, color: '#0f172a', fontSize: 14, flex: 1, lineHeight: 1.4, marginRight: 8 }}>{c.title}</p>
                {c.free && <span style={{ fontSize: 10, fontWeight: 800, color: '#15803d', background: '#f0fdf4', padding: '3px 8px', borderRadius: 9999, border: '1px solid #bbf7d0', flexShrink: 0 }}>FREE</span>}
              </div>
              <p style={{ fontSize: 12, color: '#94a3b8', marginBottom: 12 }}>{c.provider}</p>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 14 }}>
                <span style={{ fontSize: 11, fontWeight: 600, color: '#1d4ed8', background: '#eff6ff', padding: '3px 9px', borderRadius: 9999, border: '1px solid #bfdbfe' }}>{c.skill}</span>
                <span style={{ fontSize: 11, fontWeight: 600, color: '#475569', background: '#f8fafc', padding: '3px 9px', borderRadius: 9999, border: '1px solid #e2e8f0' }}>{c.level}</span>
                <span style={{ fontSize: 11, color: '#64748b', display: 'flex', alignItems: 'center', gap: 3 }}>
                  <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                  {c.duration}
                </span>
                <span style={{ fontSize: 11, color: '#d97706', display: 'flex', alignItems: 'center', gap: 3 }}>
                  <svg width="11" height="11" viewBox="0 0 24 24" fill="#fbbf24" stroke="#fbbf24" strokeWidth="0"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
                  {c.rating}
                </span>
              </div>
              <a href={c.url} style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 12, fontWeight: 700, color: '#2563eb', textDecoration: 'none' }}>
                Start Learning
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/>
                </svg>
              </a>
            </div>
          ))}
        </div>
      </div>

      {/* FAQ */}
      <div>
        <h2 style={{ fontWeight: 800, color: '#0f172a', fontSize: 16, marginBottom: 12 }}>FAQ</h2>
        <div style={{ borderRadius: 16, border: '1px solid #e2e8f0', background: 'white', overflow: 'hidden' }}>
          {faqItems.map((item, i) => (
            <div key={i} style={{ borderBottom: i < faqItems.length - 1 ? '1px solid #f1f5f9' : 'none' }}>
              <button onClick={() => setOpenFaq(openFaq === i ? null : i)}
                style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px 20px', background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'inherit', textAlign: 'left' }}>
                <span style={{ fontWeight: 600, color: '#0f172a', fontSize: 14 }}>{item.title}</span>
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"
                  style={{ flexShrink: 0, transform: openFaq === i ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }}>
                  <polyline points="6 9 12 15 18 9"/>
                </svg>
              </button>
              {openFaq === i && (
                <div style={{ padding: '0 20px 16px', fontSize: 13, color: '#475569', lineHeight: 1.7 }}>
                  {item.content}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
