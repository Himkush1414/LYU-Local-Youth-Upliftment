'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Eye, EyeOff, ArrowLeft, ArrowRight, Loader2, Briefcase, CheckCircle } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { toast } from 'sonner'

export default function EmployerRegisterPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [showPass, setShowPass] = useState(false)
  const [form, setForm] = useState({ fullName: '', companyName: '', email: '', password: '' })
  const [errors, setErrors] = useState<Record<string, string>>({})

  const validate = () => {
    const e: Record<string, string> = {}
    if (!form.fullName.trim()) e.fullName = 'Your name is required'
    if (!form.companyName.trim()) e.companyName = 'Company name is required'
    if (!form.email.includes('@')) e.email = 'Enter a valid email'
    if (form.password.length < 8) e.password = 'At least 8 characters required'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validate()) return
    setLoading(true)
    try {
      const supabase = createClient()
      const { error } = await supabase.auth.signUp({
        email: form.email,
        password: form.password,
        options: {
          data: { full_name: form.fullName, company_name: form.companyName, role: 'employer' },
          emailRedirectTo: `${window.location.origin}/auth/verify-email`,
        },
      })
      if (error) throw error
      toast.success('Account created! Check your email to verify.')
      router.push('/auth/verify-email')
    } catch (err: any) {
      toast.error(err.message || 'Something went wrong. Try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col lg:flex-row">
      <div className="hidden lg:flex lg:w-[45%] bg-gradient-to-br from-violet-600 to-violet-900 flex-col justify-between p-12 relative overflow-hidden">
        <div className="absolute inset-0 opacity-20" style={{background:'radial-gradient(at 30% 20%, rgba(255,255,255,0.3) 0px, transparent 50%)'}} />
        <Link href="/" className="relative flex items-center gap-2">
          <div className="w-9 h-9 bg-white/20 rounded-xl flex items-center justify-center">
            <span className="text-white font-black text-sm">LY</span>
          </div>
          <span className="text-white font-black text-xl">LYU</span>
        </Link>
        <div className="relative">
          <h2 className="text-3xl font-black text-white mb-3 leading-tight">Find the best local<br />talent near you</h2>
          <p className="text-violet-100 mb-8 leading-relaxed">Post jobs, screen candidates with AI, hire faster than ever.</p>
          <div className="space-y-3">
            {['Post jobs in minutes', 'AI-ranked candidates by match score', 'Local talent pool — state & district level', 'Real-time chat with applicants', 'Analytics and hiring funnel dashboard'].map(p => (
              <div key={p} className="flex items-center gap-3 text-white text-sm">
                <CheckCircle className="w-4 h-4 text-violet-200 shrink-0" /> {p}
              </div>
            ))}
          </div>
        </div>
        <p className="relative text-violet-200 text-sm">© 2026 LYU · Trusted by 800+ companies</p>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center px-4 py-12">
        <div className="w-full max-w-md">
          <Link href="/auth/register" className="inline-flex items-center gap-2 text-sm text-slate-500 hover:text-slate-800 mb-8 transition-colors group">
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" /> Back
          </Link>
          <div className="flex items-center gap-3 mb-8">
            <div className="w-10 h-10 bg-violet-50 rounded-2xl flex items-center justify-center">
              <Briefcase className="w-5 h-5 text-violet-600" />
            </div>
            <div>
              <h1 className="text-2xl font-black text-slate-900">Create employer account</h1>
              <p className="text-sm text-slate-400">Start hiring local talent today</p>
            </div>
          </div>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">Your Name</label>
                <input type="text" placeholder="Amit Kumar" value={form.fullName}
                  onChange={e => setForm(f => ({ ...f, fullName: e.target.value }))}
                  className={`w-full px-4 py-3.5 rounded-xl border-2 focus:outline-none text-slate-900 placeholder:text-slate-400 text-sm transition-colors bg-white ${errors.fullName ? 'border-red-400' : 'border-slate-200 focus:border-violet-500'}`} />
                {errors.fullName && <p className="text-red-500 text-xs mt-1">{errors.fullName}</p>}
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">Company Name</label>
                <input type="text" placeholder="TechCorp" value={form.companyName}
                  onChange={e => setForm(f => ({ ...f, companyName: e.target.value }))}
                  className={`w-full px-4 py-3.5 rounded-xl border-2 focus:outline-none text-slate-900 placeholder:text-slate-400 text-sm transition-colors bg-white ${errors.companyName ? 'border-red-400' : 'border-slate-200 focus:border-violet-500'}`} />
                {errors.companyName && <p className="text-red-500 text-xs mt-1">{errors.companyName}</p>}
              </div>
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">Work Email</label>
              <input type="email" placeholder="amit@techcorp.com" value={form.email}
                onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                className={`w-full px-4 py-3.5 rounded-xl border-2 focus:outline-none text-slate-900 placeholder:text-slate-400 text-sm transition-colors bg-white ${errors.email ? 'border-red-400' : 'border-slate-200 focus:border-violet-500'}`} />
              {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">Password</label>
              <div className="relative">
                <input type={showPass ? 'text' : 'password'} placeholder="Min. 8 characters" value={form.password}
                  onChange={e => setForm(f => ({ ...f, password: e.target.value }))}
                  className={`w-full px-4 py-3.5 rounded-xl border-2 focus:outline-none text-slate-900 placeholder:text-slate-400 text-sm pr-12 transition-colors bg-white ${errors.password ? 'border-red-400' : 'border-slate-200 focus:border-violet-500'}`} />
                <button type="button" onClick={() => setShowPass(!showPass)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
                  {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password}</p>}
            </div>
            <button type="submit" disabled={loading}
              className="w-full bg-violet-600 hover:bg-violet-700 disabled:opacity-60 text-white font-bold py-3.5 rounded-xl transition-all flex items-center justify-center gap-2 text-sm hover:shadow-lg hover:shadow-violet-200 active:scale-[0.98]">
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <> Create Employer Account <ArrowRight className="w-4 h-4" /> </>}
            </button>
          </form>
          <p className="text-center text-sm text-slate-500 mt-6">
            Already have an account?{' '}
            <Link href="/auth/login" className="text-blue-600 font-bold hover:underline">Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  )
}
