'use client'

import { useState } from 'react'
import Link from 'next/link'
import { ArrowLeft, ArrowRight, Loader2, Mail } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { toast } from 'sonner'

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [sent, setSent] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email.includes('@')) { toast.error('Enter a valid email'); return }
    setLoading(true)
    try {
      const supabase = createClient()
      await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/auth/reset-password`,
      })
      setSent(true)
      toast.success('Reset link sent to your email!')
    } catch {
      toast.error('Something went wrong. Try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <Link href="/auth/login" className="inline-flex items-center gap-2 text-sm text-slate-500 hover:text-slate-800 mb-10 transition-colors group">
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" /> Back to login
        </Link>
        <div className="bg-white rounded-2xl border border-slate-100 p-8 shadow-sm">
          <div className="w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center mb-6">
            <Mail className="w-6 h-6 text-blue-600" />
          </div>
          {sent ? (
            <div className="text-center">
              <h1 className="text-2xl font-black text-slate-900 mb-3">Check your email</h1>
              <p className="text-slate-500 text-sm mb-6">We sent a password reset link to <strong className="text-slate-800">{email}</strong>. It expires in 24 hours.</p>
              <Link href="/auth/login" className="text-blue-600 font-bold text-sm hover:underline">Back to Sign In</Link>
            </div>
          ) : (
            <>
              <h1 className="text-2xl font-black text-slate-900 mb-1">Forgot password?</h1>
              <p className="text-slate-500 text-sm mb-6">Enter your email and we'll send you a reset link.</p>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">Email address</label>
                  <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="you@example.com" required
                    className="w-full px-4 py-3.5 rounded-xl border-2 border-slate-200 focus:border-blue-500 focus:outline-none text-slate-900 placeholder:text-slate-400 text-sm bg-white" />
                </div>
                <button type="submit" disabled={loading}
                  className="w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-60 text-white font-bold py-3.5 rounded-xl transition-all flex items-center justify-center gap-2 text-sm">
                  {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <> Send Reset Link <ArrowRight className="w-4 h-4" /> </>}
                </button>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
