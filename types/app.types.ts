export type UserRole = 'seeker' | 'employer' | 'admin'
export type WorkType = 'remote' | 'onsite' | 'hybrid'
export type EmploymentType = 'full_time' | 'part_time' | 'internship' | 'contract' | 'apprenticeship'
export type ApplicationStatus = 'applied' | 'viewed' | 'shortlisted' | 'rejected' | 'hired' | 'withdrawn'
export type JobStatus = 'draft' | 'under_review' | 'active' | 'paused' | 'filled' | 'expired' | 'rejected'

export interface Job {
  id: string
  title: string
  company: string
  city: string
  state: string
  type: EmploymentType
  work: WorkType
  salary: string
  match: number
  posted: string
  logo: string
  skills: string[]
  description?: string
  salary_min?: number
  salary_max?: number
  salary_disclosed?: boolean
  openings_count?: number
  status?: JobStatus
  view_count?: number
  application_count?: number
  expires_at?: string
  created_at?: string
}

export interface Application {
  id: string
  title: string
  company: string
  logo: string
  status: ApplicationStatus
  appliedAt: string
  city: string
  salary: string
  match: number
}

export interface Notification {
  id: string
  type: 'application_update' | 'new_message' | 'job_alert' | 'system'
  title: string
  body: string
  action_url?: string
  is_read: boolean
  created_at: string
}
