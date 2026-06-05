'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { LayoutDashboard, PlusCircle, Briefcase, Users, MessageSquare, BarChart2, Settings, Bell, LogOut, Menu, X, ChevronRight } from 'lucide-react'
import { useState } from 'react'

const navItems = [
  { label: 'Dashboard', href: '/employer/dashboard', icon: LayoutDashboard },
  { label: 'Post a Job', href: '/employer/jobs/new', icon: PlusCircle },
  { label: 'My Jobs', href: '/employer/jobs', icon: Briefcase },
  { label: 'Applicants', href: '/employer/applicants', icon: Users },
  { label: 'Messages', href: '/employer/messages', icon: MessageSquare },
  { label: 'Analytics', href: '/employer/analytics', icon: BarChart2 },
  { label: 'Settings', href: '/employer/settings', icon: Settings },
]

function cn(...classes: string[]) { return classes.filter(Boolean).join(' ') }

export default function EmployerLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const [mobileOpen, setMobileOpen] = useState(false)

  return (
    <div className="min-h-screen bg-slate-50 flex">
      <aside className="hidden lg:flex flex-col w-64 min-h-screen bg-white border-r border-slate-100 fixed left-0 top-0 bottom-0 z-40">
        <div className="h-16 flex items-center px-6 border-b border-slate-100">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl gradient-blue flex items-center justify-center shadow-md shadow-blue-200">
              <span className="text-white font-black text-xs">LY</span>
            </div>
            <span className="font-black text-slate-900">LYU</span>
          </Link>
          <span className="ml-auto text-xs bg-violet-50 text-violet-700 font-semibold px-2 py-1 rounded-lg">Employer</span>
        </div>

        <nav className="flex-1 py-5 px-3 overflow-y-auto">
          <div className="space-y-0.5">
            {navItems.map((item) => {
              const active = pathname === item.href || pathname.startsWith(item.href + '/')
              return (
                <Link key={item.href} href={item.href}
                  className={cn('flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all',
                    active ? 'bg-blue-600 text-white shadow-md shadow-blue-200' : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900')}>
                  <item.icon className={cn('w-4 h-4 shrink-0', active ? 'text-white' : 'text-slate-400')} />
                  {item.label}
                  {active && <ChevronRight className="w-4 h-4 ml-auto" />}
                </Link>
              )
            })}
          </div>
        </nav>

        <div className="p-3 border-t border-slate-100">
          <div className="flex items-center gap-3 px-3 py-3 mb-1">
            <div className="w-9 h-9 rounded-full gradient-blue flex items-center justify-center text-white text-xs font-black shrink-0">TC</div>
            <div className="min-w-0">
              <p className="text-sm font-bold text-slate-900 truncate">TechCorp</p>
              <p className="text-xs text-slate-400 truncate">hr@techcorp.com</p>
            </div>
          </div>
          <button className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-slate-500 hover:bg-red-50 hover:text-red-600 transition-all w-full">
            <LogOut className="w-4 h-4" /> Sign Out
          </button>
        </div>
      </aside>

      {mobileOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          <div className="fixed inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setMobileOpen(false)} />
          <aside className="relative w-72 bg-white flex flex-col h-full shadow-2xl animate-fade-in">
            <div className="h-16 flex items-center px-5 border-b border-slate-100">
              <Link href="/" className="flex items-center gap-2" onClick={() => setMobileOpen(false)}>
                <div className="w-8 h-8 rounded-xl gradient-blue flex items-center justify-center">
                  <span className="text-white font-black text-xs">LY</span>
                </div>
                <span className="font-black text-slate-900">LYU</span>
              </Link>
              <button onClick={() => setMobileOpen(false)} className="ml-auto text-slate-400 hover:text-slate-700">
                <X className="w-5 h-5" />
              </button>
            </div>
            <nav className="flex-1 py-5 px-3">
              {navItems.map((item) => {
                const active = pathname === item.href || pathname.startsWith(item.href + '/')
                return (
                  <Link key={item.href} href={item.href} onClick={() => setMobileOpen(false)}
                    className={cn('flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all mb-0.5',
                      active ? 'bg-blue-600 text-white' : 'text-slate-600 hover:bg-slate-50')}>
                    <item.icon className="w-4 h-4 shrink-0" />
                    {item.label}
                  </Link>
                )
              })}
            </nav>
          </aside>
        </div>
      )}

      <div className="lg:ml-64 flex-1 flex flex-col">
        <header className="h-16 bg-white border-b border-slate-100 flex items-center justify-between px-4 sm:px-6 sticky top-0 z-30">
          <div className="flex items-center gap-3">
            <button onClick={() => setMobileOpen(true)} className="lg:hidden w-9 h-9 flex items-center justify-center rounded-xl hover:bg-slate-100 transition-colors">
              <Menu className="w-5 h-5 text-slate-600" />
            </button>
            <div>
              <h1 className="font-bold text-slate-900 text-sm leading-none">Employer Dashboard</h1>
              <p className="text-xs text-slate-400 mt-0.5 hidden sm:block">{new Date().toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long' })}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button className="relative w-9 h-9 flex items-center justify-center rounded-xl hover:bg-slate-100 transition-colors">
              <Bell className="w-5 h-5 text-slate-600" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full" />
            </button>
            <div className="w-9 h-9 rounded-full gradient-blue flex items-center justify-center text-white text-xs font-black cursor-pointer hover:opacity-90 transition-opacity">TC</div>
          </div>
        </header>

        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          {children}
        </main>
      </div>

      <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-slate-100">
        <div className="flex">
          {[navItems[0], navItems[1], navItems[2], navItems[3], navItems[6]].map((item) => {
            const active = pathname === item.href || pathname.startsWith(item.href + '/')
            return (
              <Link key={item.href} href={item.href} className={cn('flex-1 flex flex-col items-center justify-center py-3 gap-1 text-xs font-medium transition-colors', active ? 'text-blue-600' : 'text-slate-400 hover:text-slate-600')}>
                <item.icon className="w-5 h-5" />
                <span className="text-[10px]">{item.label}</span>
              </Link>
            )
          })}
        </div>
      </nav>
    </div>
  )
}
