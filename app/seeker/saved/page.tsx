'use client'

import { Bookmark } from 'lucide-react'

export default function SavedJobsPage() {
  return (
    <div style={{ padding: '32px', maxWidth: '900px', margin: '0 auto' }}>
      <h1 style={{ fontSize: '22px', fontWeight: 800, color: '#0f172a', marginBottom: '8px' }}>Saved Jobs</h1>
      <p style={{ fontSize: '14px', color: '#64748b', marginBottom: '32px' }}>Jobs you have bookmarked will appear here.</p>
      <div style={{ textAlign: 'center', padding: '80px 20px', background: 'white', borderRadius: '16px', border: '1px solid #f1f5f9' }}>
        <div style={{ width: '56px', height: '56px', background: '#eef2ff', borderRadius: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
          <Bookmark size={24} color="#4f46e5" />
        </div>
        <p style={{ fontWeight: 700, color: '#0f172a', fontSize: '16px', marginBottom: '8px' }}>No saved jobs yet</p>
        <p style={{ fontSize: '14px', color: '#64748b', marginBottom: '24px' }}>Browse jobs and save the ones you like</p>
        <a href="/seeker/jobs" style={{ background: '#4f46e5', color: 'white', padding: '10px 24px', borderRadius: '10px', textDecoration: 'none', fontSize: '14px', fontWeight: 700 }}>
          Browse Jobs
        </a>
      </div>
    </div>
  )
}
