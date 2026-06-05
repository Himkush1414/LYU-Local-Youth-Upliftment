import Link from 'next/link'
import { MapPin, Clock, ArrowRight } from 'lucide-react'

const jobs = [
  {
    id: '1',
    title: 'React Developer',
    company: 'TechCorp',
    city: 'Chandigarh',
    type: 'Full Time',
    salary: '₹25K–35K/mo',
    posted: '2h ago',
  },
  {
    id: '2',
    title: 'Sales Executive',
    company: 'RetailMax',
    city: 'Amritsar',
    type: 'Full Time',
    salary: '₹18K–22K/mo',
    posted: '5h ago',
  },
  {
    id: '3',
    title: 'Data Entry Operator',
    company: 'InfoSys Ltd',
    city: 'Ludhiana',
    type: 'Part Time',
    salary: '₹12K–15K/mo',
    posted: '1d ago',
  },
]

export default function PublicJobsPage() {
  return (
    <div className="min-h-screen bg-slate-50">
      <nav className="bg-white border-b border-slate-200 px-4 py-4">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <Link href="/" className="font-black text-slate-900 text-xl">
            LYU
          </Link>
          <Link
            href="/auth/register"
            className="bg-blue-600 text-white text-sm font-bold px-4 py-2 rounded-xl hover:bg-blue-700 transition-colors"
          >
            Sign Up Free
          </Link>
        </div>
      </nav>
      <div className="max-w-5xl mx-auto px-4 py-10">
        <h1 className="text-3xl font-black text-slate-900 mb-2">
          Latest Jobs
        </h1>
        <p className="text-slate-500 mb-8">
          Sign up to apply and see your match score
        </p>
        <div className="space-y-4">
          {jobs.map((job) => (
            <div
              key={job.id}
              className="bg-white rounded-2xl border border-slate-100 p-5 shadow-sm"
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h3 className="font-black text-slate-900">{job.title}</h3>
                  <p className="text-slate-500 text-sm mt-1">{job.company}</p>
                  <div className="flex flex-wrap gap-2 mt-2">
                    <span className="flex items-center gap-1 text-xs text-slate-400">
                      <MapPin className="w-3 h-3" />
                      {job.city}
                    </span>
                    <span className="text-xs bg-slate-50 border border-slate-100 text-slate-600 px-2 py-0.5 rounded-full">
                      {job.type}
                    </span>
                    <span className="text-xs font-semibold text-slate-700">
                      {job.salary}
                    </span>
                  </div>
                </div>
                <Link
                  href="/auth/register/seeker"
                  className="shrink-0 flex items-center gap-1 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold px-3 py-2 rounded-xl transition-colors"
                >
                  Apply <ArrowRight className="w-3 h-3" />
                </Link>
              </div>
              <div className="mt-3 pt-3 border-t border-slate-50 flex items-center gap-1 text-xs text-slate-400">
                <Clock className="w-3 h-3" /> {job.posted}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}