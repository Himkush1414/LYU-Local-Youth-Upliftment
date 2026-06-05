'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { toast } from 'sonner'

const STATES = ['Andhra Pradesh','Assam','Bihar','Chandigarh','Chhattisgarh','Delhi','Goa','Gujarat','Haryana','Himachal Pradesh','Jharkhand','Karnataka','Kerala','Madhya Pradesh','Maharashtra','Manipur','Meghalaya','Mizoram','Nagaland','Odisha','Punjab','Rajasthan','Sikkim','Tamil Nadu','Telangana','Tripura','Uttar Pradesh','Uttarakhand','West Bengal','Jammu & Kashmir','Ladakh']

export default function LocationPage() {
  const [state, setState] = useState('')
  const [city, setCity] = useState('')
  const [pincode, setPincode] = useState('')
  const [remoteOk, setRemoteOk] = useState(false)
  const [radius, setRadius] = useState('50')
  const [saving, setSaving] = useState(false)
  const [loading, setLoading] = useState(true)
  const supabase = createClient()

  useEffect(() => {
    async function load() {
      const { data: { user } } = await supabase.auth.getUser()
      if (user) {
        const { data } = await supabase.from('profiles').select('state,city,pin_code,remote_ok').eq('user_id', user.id).single()
        if (data) {
          setState(data.state || '')
          setCity(data.city || '')
          setPincode(data.pin_code || '')
          setRemoteOk(data.remote_ok || false)
        }
      }
      setLoading(false)
    }
    load()
  }, [])

  const save = async () => {
    setSaving(true)
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (user) {
        await supabase.from('profiles').upsert({ user_id: user.id, state, city, pin_code: pincode, remote_ok: remoteOk })
        toast.success('Location saved! Your job feed will update.')
      }
    } catch {
      toast.error('Failed to save location')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24, maxWidth: 600, fontFamily: 'Inter, system-ui, sans-serif', paddingBottom: 40 }}>
      <div>
        <h1 style={{ fontSize: 22, fontWeight: 900, color: '#0f172a', letterSpacing: '-0.02em' }}>Location Preferences</h1>
        <p style={{ fontSize: 13, color: '#64748b', marginTop: 4 }}>We show you jobs closest to you first</p>
      </div>

      {/* Info card */}
      <div style={{ background: '#eff6ff', border: '1px solid #bfdbfe', borderRadius: 14, padding: '14px 18px', display: 'flex', gap: 10, alignItems: 'flex-start' }}>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#2563eb" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0, marginTop: 1 }}><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
        <p style={{ fontSize: 13, color: '#1d4ed8', lineHeight: 1.6 }}>LYU prioritises jobs within your district first, then state, then national remote jobs — so you see the most accessible opportunities first.</p>
      </div>

      <div style={{ background: 'white', borderRadius: 16, border: '1px solid #e2e8f0', padding: '24px', boxShadow: '0 1px 3px rgba(0,0,0,0.04)', display: 'flex', flexDirection: 'column', gap: 20 }}>
        <h2 style={{ fontWeight: 800, color: '#0f172a', fontSize: 15, marginBottom: 4 }}>Your Location</h2>

        <div>
          <label style={{ display: 'block', fontSize: 11, fontWeight: 700, color: '#374151', textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: 8 }}>State</label>
          <div style={{ position: 'relative' }}>
            <select value={state} onChange={e => setState(e.target.value)} style={{ width: '100%', padding: '11px 36px 11px 14px', border: '1.5px solid #e2e8f0', borderRadius: 11, fontSize: 14, color: state ? '#0f172a' : '#94a3b8', background: 'white', cursor: 'pointer', appearance: 'none', fontFamily: 'inherit', outline: 'none', boxSizing: 'border-box' }}>
              <option value="">Select your state</option>
              {STATES.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
            <svg style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }} width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9"/></svg>
          </div>
        </div>

        <div>
          <label style={{ display: 'block', fontSize: 11, fontWeight: 700, color: '#374151', textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: 8 }}>City / District</label>
          <input type="text" value={city} onChange={e => setCity(e.target.value)} placeholder="e.g. Chandigarh, Ludhiana, Amritsar"
            style={{ width: '100%', padding: '11px 14px', border: '1.5px solid #e2e8f0', borderRadius: 11, fontSize: 14, color: '#0f172a', background: 'white', fontFamily: 'inherit', outline: 'none', boxSizing: 'border-box' }}
            onFocus={e => e.target.style.borderColor = '#2563eb'} onBlur={e => e.target.style.borderColor = '#e2e8f0'} />
        </div>

        <div>
          <label style={{ display: 'block', fontSize: 11, fontWeight: 700, color: '#374151', textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: 8 }}>Pin Code (optional)</label>
          <input type="text" value={pincode} onChange={e => setPincode(e.target.value)} placeholder="e.g. 160001" maxLength={6}
            style={{ width: '100%', padding: '11px 14px', border: '1.5px solid #e2e8f0', borderRadius: 11, fontSize: 14, color: '#0f172a', background: 'white', fontFamily: 'inherit', outline: 'none', boxSizing: 'border-box' }}
            onFocus={e => e.target.style.borderColor = '#2563eb'} onBlur={e => e.target.style.borderColor = '#e2e8f0'} />
        </div>

        <div>
          <label style={{ display: 'block', fontSize: 11, fontWeight: 700, color: '#374151', textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: 8 }}>Search Radius: {radius} km</label>
          <input type="range" min="10" max="200" step="10" value={radius} onChange={e => setRadius(e.target.value)}
            style={{ width: '100%', accentColor: '#2563eb' }} />
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, color: '#94a3b8', marginTop: 4 }}>
            <span>10 km</span><span>200 km</span>
          </div>
        </div>

        <label style={{ display: 'flex', alignItems: 'center', gap: 14, cursor: 'pointer', padding: '14px 16px', background: '#f8fafc', borderRadius: 12, border: '1px solid #f1f5f9' }}>
          <div onClick={() => setRemoteOk(!remoteOk)} style={{ width: 44, height: 24, borderRadius: 12, background: remoteOk ? '#22c55e' : '#e2e8f0', position: 'relative', cursor: 'pointer', transition: 'background 0.2s', flexShrink: 0 }}>
            <div style={{ position: 'absolute', top: 3, left: remoteOk ? 22 : 3, width: 18, height: 18, background: 'white', borderRadius: '50%', boxShadow: '0 1px 3px rgba(0,0,0,0.2)', transition: 'left 0.2s' }} />
          </div>
          <div>
            <p style={{ fontWeight: 700, color: '#0f172a', fontSize: 14 }}>Show remote jobs too</p>
            <p style={{ fontSize: 12, color: '#64748b' }}>Include remote-friendly jobs from anywhere in India</p>
          </div>
        </label>

        <button onClick={save} disabled={saving || !state} style={{ display: 'inline-flex', alignItems: 'center', gap: 7, background: (!state || saving) ? '#e2e8f0' : '#2563eb', color: (!state || saving) ? '#94a3b8' : 'white', border: 'none', borderRadius: 11, padding: '12px 22px', fontWeight: 700, fontSize: 14, cursor: (!state || saving) ? 'not-allowed' : 'pointer', fontFamily: 'inherit', alignSelf: 'flex-start', transition: 'all 0.15s' }}>
          {saving ? 'Saving...' : (
            <><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg> Save Location</>
          )}
        </button>
      </div>
    </div>
  )
}
