'use client'

import { useState } from 'react'
import { Save, Building2, Globe, Mail, Phone, MapPin, Users, Loader2 } from 'lucide-react'
import { toast } from 'sonner'

type FormState = {
  companyName: string
  industry: string
  size: string
  website: string
  email: string
  phone: string
  state: string
  city: string
  description: string
}

type FieldProps = {
  label: string
  icon: React.ComponentType<{ className?: string }>
  name: keyof FormState
  type?: string
  placeholder?: string
}

export default function EmployerSettingsPage() {
  const [loading, setLoading] = useState(false)
  const [form, setForm] = useState<FormState>({
    companyName: 'TechCorp',
    industry: 'Technology',
    size: '11-50',
    website: 'https://techcorp.com',
    email: 'hr@techcorp.com',
    phone: '',
    state: 'Punjab',
    city: 'Chandigarh',
    description: 'We build great software products.',
  })

  const handleSave = async () => {
    setLoading(true)
    await new Promise((r) => setTimeout(r, 1000))
    setLoading(false)
    toast.success('Settings saved!')
  }

  const Field = ({ label, icon: Icon, name, type = 'text', placeholder }: FieldProps) => (
    <div>
      <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">{label}</label>
      <div className="relative">
        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
          <Icon className="w-4 h-4" />
        </div>
        <input
          type={type}
          value={form[name]}
          placeholder={placeholder}
          onChange={(e) => setForm((f) => ({ ...f, [name]: e.target.value }))}
          className="w-full pl-11 pr-4 py-3.5 rounded-xl border-2 border-slate-200 focus:border-blue-500 focus:outline-none text-slate-900 placeholder:text-slate-400 text-sm transition-colors bg-white"
        />
      </div>
    </div>
  )

  return (
    <div className="space-y-6 pb-24 lg:pb-0 animate-fade-up max-w-2xl">
      <div>
        <h1 className="text-2xl font-black text-slate-900">Settings</h1>
        <p className="text-slate-500 mt-1">Manage your company profile and account</p>
      </div>

      <div className="bg-white rounded-2xl border border-slate-100 card-shadow p-6 space-y-5">
        <h2 className="font-black text-slate-900">Company Information</h2>
        <div className="grid sm:grid-cols-2 gap-5">
          <Field label="Company Name" icon={Building2} name="companyName" placeholder="TechCorp" />
          <Field label="Industry" icon={Building2} name="industry" placeholder="Technology" />
          <Field label="Website" icon={Globe} name="website" placeholder="https://..." />
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">Company Size</label>
            <div className="relative">
              <Users className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <select value={form.size} onChange={(e) => setForm((f) => ({ ...f, size: e.target.value }))} className="w-full pl-11 pr-4 py-3.5 rounded-xl border-2 border-slate-200 focus:border-blue-500 focus:outline-none text-slate-900 text-sm transition-colors bg-white appearance-none">
                {['1-10', '11-50', '51-200', '201-500', '500+'].map((s) => (
                  <option key={s}>{s}</option>
                ))}
              </select>
            </div>
          </div>
          <Field label="Contact Email" icon={Mail} name="email" type="email" placeholder="hr@company.com" />
          <Field label="Phone" icon={Phone} name="phone" placeholder="+91 XXXXX XXXXX" />
          <Field label="State" icon={MapPin} name="state" placeholder="Punjab" />
          <Field label="City" icon={MapPin} name="city" placeholder="Chandigarh" />
        </div>
        <div>
          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">About Company</label>
          <textarea
            value={form.description}
            onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
            rows={4}
            placeholder="Describe your company..."
            className="w-full px-4 py-3.5 rounded-xl border-2 border-slate-200 focus:border-blue-500 focus:outline-none text-slate-900 placeholder:text-slate-400 text-sm transition-colors bg-white resize-none"
          />
        </div>
        <button onClick={handleSave} disabled={loading} className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-60 text-white font-bold px-6 py-3 rounded-xl transition-all hover:shadow-lg hover:shadow-blue-200 text-sm">
          {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
          Save Changes
        </button>
      </div>
    </div>
  )
}
