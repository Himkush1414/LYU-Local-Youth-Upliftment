'use client'

import { useState } from 'react'
import { Save, User, Mail, Phone, MapPin, Loader2, Github, Linkedin, Globe } from 'lucide-react'
import { toast } from 'sonner'

export default function SeekerSettingsPage() {
  const [loading, setLoading] = useState(false)
  const [form, setForm] = useState({
    fullName: 'Rahul Sharma',
    email: 'rahul@example.com',
    phone: '',
    state: 'Punjab',
    city: 'Chandigarh',
    headline: 'React Developer | 2 yrs exp',
    linkedin: '',
    github: '',
    portfolio: '',
    openToWork: true,
    remoteOk: false,
  })

  const handleSave = async () => {
    setLoading(true)
    await new Promise((r) => setTimeout(r, 1000))
    setLoading(false)
    toast.success('Profile saved!')
  }

  return (
    <div className="space-y-6 pb-24 lg:pb-0 animate-fade-up max-w-2xl">
      <div>
        <h1 className="text-2xl font-black text-slate-900">Account Settings</h1>
        <p className="text-slate-500 mt-1">Manage your profile and preferences</p>
      </div>

      <div className="bg-white rounded-2xl border border-slate-100 card-shadow p-6 space-y-5">
        <h2 className="font-black text-slate-900">Personal Information</h2>
        <div className="grid sm:grid-cols-2 gap-5">
          {[
            { label: 'Full Name', icon: User, name: 'fullName', placeholder: 'Your name' },
            { label: 'Email', icon: Mail, name: 'email', type: 'email', placeholder: 'your@email.com' },
            { label: 'Phone', icon: Phone, name: 'phone', placeholder: '+91 XXXXX XXXXX' },
            { label: 'Headline', icon: User, name: 'headline', placeholder: 'React Dev | 2 yrs' },
            { label: 'State', icon: MapPin, name: 'state', placeholder: 'Punjab' },
            { label: 'City', icon: MapPin, name: 'city', placeholder: 'Chandigarh' },
            { label: 'LinkedIn', icon: Linkedin, name: 'linkedin', placeholder: 'linkedin.com/in/...' },
            { label: 'GitHub', icon: Github, name: 'github', placeholder: 'github.com/...' },
            { label: 'Portfolio', icon: Globe, name: 'portfolio', placeholder: 'yoursite.com' },
          ].map((f) => (
            <div key={f.name} className={f.name === 'headline' ? 'sm:col-span-2' : ''}>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">{f.label}</label>
              <div className="relative">
                <f.icon className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type={f.type || 'text'}
                  value={form[f.name as keyof typeof form] as string}
                  onChange={(e) => setForm((prev) => ({ ...prev, [f.name]: e.target.value }))}
                  placeholder={f.placeholder}
                  className="w-full pl-11 pr-4 py-3.5 rounded-xl border-2 border-slate-200 focus:border-blue-500 focus:outline-none text-slate-900 placeholder:text-slate-400 text-sm transition-colors bg-white"
                />
              </div>
            </div>
          ))}
        </div>

        <div className="flex flex-col sm:flex-row gap-4 pt-2">
          {[
            { key: 'openToWork', label: 'Open to Work', desc: 'Show employers you are available' },
            { key: 'remoteOk', label: 'Remote OK', desc: 'Accept remote job opportunities' },
          ].map((toggle) => (
            <label key={toggle.key} className="flex items-center gap-3 cursor-pointer p-4 bg-slate-50 rounded-xl flex-1">
              <div
                className={`relative w-11 h-6 rounded-full transition-colors ${form[toggle.key as keyof typeof form] ? 'bg-blue-600' : 'bg-slate-300'}`}
                onClick={() => setForm((f) => ({ ...f, [toggle.key]: !f[toggle.key as keyof typeof f] }))}
              >
                <div className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow transition-transform ${form[toggle.key as keyof typeof form] ? 'translate-x-6' : 'translate-x-1'}`} />
              </div>
              <div>
                <p className="text-sm font-bold text-slate-900">{toggle.label}</p>
                <p className="text-xs text-slate-400">{toggle.desc}</p>
              </div>
            </label>
          ))}
        </div>

        <button onClick={handleSave} disabled={loading} className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-60 text-white font-bold px-6 py-3 rounded-xl transition-all hover:shadow-lg hover:shadow-blue-200 text-sm">
          {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
          Save Changes
        </button>
      </div>
    </div>
  )
}
