import Link from 'next/link'
import { ArrowRight } from 'lucide-react'

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-white">
      <nav className="border-b border-slate-200 px-4 py-4">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <Link href="/" className="font-black text-slate-900 text-xl">
            LYU
          </Link>
          <Link
            href="/auth/register"
            className="bg-blue-600 text-white text-sm font-bold px-4 py-2 rounded-xl hover:bg-blue-700 transition-colors"
          >
            Get Started
          </Link>
        </div>
      </nav>
      <div className="max-w-3xl mx-auto px-4 py-20 text-center">
        <h1 className="text-4xl font-black text-slate-900 mb-6">About LYU</h1>
        <p className="text-lg text-slate-600 leading-relaxed mb-6">
          Local Youth Upliftment (LYU) is a platform built to connect Indian
          youth with verified local employers. We focus on state and
          district-level job matching so that opportunity comes to you — not
          the other way around.
        </p>
        <p className="text-slate-500 mb-10">
          Built with AI-powered skill matching, real-time notifications, and a
          clean mobile-first design. Free for job seekers. Always.
        </p>
        <Link
          href="/auth/register"
          className="inline-flex items-center gap-2 bg-blue-600 text-white font-bold px-8 py-4 rounded-xl hover:bg-blue-700 transition-colors"
        >
          Join LYU Free <ArrowRight className="w-5 h-5" />
        </Link>
      </div>
    </div>
  )
}