export interface Job {
  id: string
  title: string
  company: string
  city: string | null
  state: string | null
  salary_min: number | null
  salary_max: number | null
  work_type: 'onsite' | 'remote' | 'hybrid'
  employment_type: string
  description: string
  source: 'lyu' | 'adzuna' | 'jsearch' | 'remoteok' | 'ncs'
  external_url: string | null
  skills_required: string[]
  posted_at: string
  experience_level: string
  logo_url: string | null
}

export function normalizeAdzunaJob(raw: Record<string, unknown>): Job {
  const location = raw.location as Record<string, unknown> | undefined
  const displayName = (location?.display_name as string) || ''
  const parts = displayName.split(',').map((p: string) => p.trim())
  const city = parts[0] || null
  const state = parts[parts.length - 1] || null

  const category = raw.category as Record<string, unknown> | undefined

  return {
    id: `adzuna_${raw.id as string}`,
    title: (raw.title as string) || '',
    company: (raw.company as Record<string, unknown>)?.display_name as string || 'Unknown',
    city,
    state,
    salary_min: raw.salary_min ? Math.round(raw.salary_min as number / 12) : null,
    salary_max: raw.salary_max ? Math.round(raw.salary_max as number / 12) : null,
    work_type: detectWorkType(raw.title as string, raw.description as string),
    employment_type: (raw.contract_type as string) === 'part_time' ? 'part_time' : 'full_time',
    description: (raw.description as string) || '',
    source: 'adzuna',
    external_url: (raw.redirect_url as string) || null,
    skills_required: extractSkillsFromText((raw.description as string) || ''),
    posted_at: (raw.created as string) || new Date().toISOString(),
    experience_level: 'any',
    logo_url: null,
  }
}

export function normalizeJSearchJob(raw: Record<string, unknown>): Job {
  const skills = (raw.job_required_skills as string[]) || []
  const skillsFromDesc = extractSkillsFromText((raw.job_description as string) || '')

  return {
    id: `jsearch_${raw.job_id as string}`,
    title: (raw.job_title as string) || '',
    company: (raw.employer_name as string) || 'Unknown',
    city: (raw.job_city as string) || null,
    state: (raw.job_state as string) || null,
    salary_min: raw.job_min_salary ? Math.round(raw.job_min_salary as number / 12) : null,
    salary_max: raw.job_max_salary ? Math.round(raw.job_max_salary as number / 12) : null,
    work_type: (raw.job_is_remote as boolean) ? 'remote' : 'onsite',
    employment_type: (raw.job_employment_type as string)?.toLowerCase() || 'full_time',
    description: (raw.job_description as string) || '',
    source: 'jsearch',
    external_url: (raw.job_apply_link as string) || null,
    skills_required: [...new Set([...skills, ...skillsFromDesc])],
    posted_at: (raw.job_posted_at_datetime_utc as string) || new Date().toISOString(),
    experience_level: 'any',
    logo_url: (raw.employer_logo as string) || null,
  }
}

export function normalizeRemoteOKJob(raw: Record<string, unknown>): Job {
  const tags = (raw.tags as string[]) || []

  return {
    id: `remoteok_${raw.id as string}`,
    title: (raw.position as string) || '',
    company: (raw.company as string) || 'Unknown',
    city: null,
    state: null,
    salary_min: raw.salary_min ? Number(raw.salary_min) : null,
    salary_max: raw.salary_max ? Number(raw.salary_max) : null,
    work_type: 'remote',
    employment_type: 'full_time',
    description: (raw.description as string) || '',
    source: 'remoteok',
    external_url: (raw.url as string) || null,
    skills_required: tags,
    posted_at: raw.date ? new Date((raw.date as number) * 1000).toISOString() : new Date().toISOString(),
    experience_level: 'any',
    logo_url: (raw.logo as string) || null,
  }
}

function detectWorkType(title = '', description = ''): 'onsite' | 'remote' | 'hybrid' {
  const text = `${title} ${description}`.toLowerCase()
  if (text.includes('remote') || text.includes('work from home') || text.includes('wfh')) {
    if (text.includes('hybrid')) return 'hybrid'
    return 'remote'
  }
  if (text.includes('hybrid')) return 'hybrid'
  return 'onsite'
}

const COMMON_SKILLS = [
  'JavaScript','TypeScript','React','Node.js','Python','Java','PHP','C++','C#','Go',
  'Vue.js','Angular','Next.js','Express','Django','FastAPI','Spring','Laravel',
  'MySQL','PostgreSQL','MongoDB','Redis','AWS','Docker','Kubernetes','Git',
  'HTML','CSS','Figma','UI/UX','Excel','Tally','Accounting','Sales','Marketing',
  'SEO','Content Writing','Digital Marketing','Data Entry','Customer Service',
  'Machine Learning','Data Science','Power BI','Tableau','SQL','GraphQL',
  'React Native','Flutter','iOS','Android','Swift','Kotlin',
]

function extractSkillsFromText(text: string): string[] {
  const lower = text.toLowerCase()
  return COMMON_SKILLS.filter(skill => lower.includes(skill.toLowerCase()))
}
