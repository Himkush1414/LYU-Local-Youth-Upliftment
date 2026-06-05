-- Enable extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_trgm";

-- USERS table (mirrors auth.users)
CREATE TABLE IF NOT EXISTS public.users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT UNIQUE NOT NULL,
  role TEXT NOT NULL DEFAULT 'seeker' CHECK (role IN ('seeker','employer','admin')),
  is_verified BOOLEAN DEFAULT FALSE,
  is_suspended BOOLEAN DEFAULT FALSE,
  last_login_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  deleted_at TIMESTAMPTZ
);

-- PROFILES
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID UNIQUE NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  full_name TEXT NOT NULL DEFAULT '',
  avatar_url TEXT,
  headline TEXT,
  bio TEXT,
  state TEXT,
  city TEXT,
  pin_code TEXT,
  remote_ok BOOLEAN DEFAULT FALSE,
  open_to_work BOOLEAN DEFAULT TRUE,
  years_of_experience SMALLINT DEFAULT 0,
  experience_level TEXT DEFAULT 'fresher',
  highest_education TEXT,
  resume_url TEXT,
  work_type_pref TEXT DEFAULT 'any',
  employment_type_pref TEXT DEFAULT 'any',
  profile_completion SMALLINT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  deleted_at TIMESTAMPTZ
);

-- COMPANIES
CREATE TABLE IF NOT EXISTS public.companies (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  owner_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  logo_url TEXT,
  website TEXT,
  industry TEXT,
  company_type TEXT DEFAULT 'startup',
  company_size TEXT DEFAULT '1-10',
  description TEXT,
  tagline TEXT,
  hq_state TEXT,
  hq_city TEXT,
  is_verified BOOLEAN DEFAULT FALSE,
  profile_completion SMALLINT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  deleted_at TIMESTAMPTZ
);

-- SKILLS
CREATE TABLE IF NOT EXISTS public.skills (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT UNIQUE NOT NULL,
  category TEXT NOT NULL DEFAULT 'general',
  is_trending BOOLEAN DEFAULT FALSE,
  usage_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- USER SKILLS
CREATE TABLE IF NOT EXISTS public.user_skills (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  skill_id UUID NOT NULL REFERENCES public.skills(id) ON DELETE CASCADE,
  level TEXT DEFAULT 'beginner' CHECK (level IN ('beginner','intermediate','advanced','expert')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, skill_id)
);

-- JOBS
CREATE TABLE IF NOT EXISTS public.jobs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  company_id UUID NOT NULL REFERENCES public.companies(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT NOT NULL,
  requirements TEXT,
  employment_type TEXT DEFAULT 'full_time',
  work_type TEXT DEFAULT 'onsite',
  experience_level TEXT DEFAULT 'fresher',
  salary_min INTEGER,
  salary_max INTEGER,
  salary_disclosed BOOLEAN DEFAULT TRUE,
  state TEXT,
  city TEXT,
  openings_count SMALLINT DEFAULT 1,
  status TEXT DEFAULT 'active' CHECK (status IN ('draft','under_review','active','paused','filled','expired','rejected')),
  view_count INTEGER DEFAULT 0,
  application_count INTEGER DEFAULT 0,
  expires_at TIMESTAMPTZ DEFAULT (NOW() + INTERVAL '60 days'),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  deleted_at TIMESTAMPTZ
);

-- JOB SKILLS
CREATE TABLE IF NOT EXISTS public.job_skills (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  job_id UUID NOT NULL REFERENCES public.jobs(id) ON DELETE CASCADE,
  skill_id UUID NOT NULL REFERENCES public.skills(id) ON DELETE CASCADE,
  is_required BOOLEAN DEFAULT TRUE,
  UNIQUE(job_id, skill_id)
);

-- APPLICATIONS
CREATE TABLE IF NOT EXISTS public.applications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  job_id UUID NOT NULL REFERENCES public.jobs(id) ON DELETE CASCADE,
  seeker_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  status TEXT DEFAULT 'applied' CHECK (status IN ('applied','viewed','shortlisted','rejected','hired','withdrawn')),
  cover_letter TEXT,
  match_score SMALLINT,
  employer_notes TEXT,
  applied_at TIMESTAMPTZ DEFAULT NOW(),
  viewed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(job_id, seeker_id)
);

-- CONVERSATIONS
CREATE TABLE IF NOT EXISTS public.conversations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  application_id UUID UNIQUE REFERENCES public.applications(id) ON DELETE SET NULL,
  seeker_id UUID NOT NULL REFERENCES public.users(id),
  employer_id UUID NOT NULL REFERENCES public.users(id),
  last_message_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- MESSAGES
CREATE TABLE IF NOT EXISTS public.messages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  conversation_id UUID NOT NULL REFERENCES public.conversations(id) ON DELETE CASCADE,
  sender_id UUID NOT NULL REFERENCES public.users(id),
  body TEXT NOT NULL,
  is_read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  deleted_at TIMESTAMPTZ
);

-- NOTIFICATIONS
CREATE TABLE IF NOT EXISTS public.notifications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  type TEXT NOT NULL,
  title TEXT NOT NULL,
  body TEXT,
  action_url TEXT,
  is_read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- AUDIT LOGS
CREATE TABLE IF NOT EXISTS public.audit_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  actor_id UUID REFERENCES public.users(id),
  action TEXT NOT NULL,
  target_type TEXT,
  target_id UUID,
  metadata JSONB,
  ip_address INET,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- INDEXES
CREATE INDEX IF NOT EXISTS profiles_user_id_idx ON public.profiles(user_id);
CREATE INDEX IF NOT EXISTS profiles_location_idx ON public.profiles(state, city);
CREATE INDEX IF NOT EXISTS jobs_status_idx ON public.jobs(status) WHERE deleted_at IS NULL;
CREATE INDEX IF NOT EXISTS jobs_location_idx ON public.jobs(state, city);
CREATE INDEX IF NOT EXISTS applications_job_id_idx ON public.applications(job_id);
CREATE INDEX IF NOT EXISTS applications_seeker_id_idx ON public.applications(seeker_id);
CREATE INDEX IF NOT EXISTS notifications_user_idx ON public.notifications(user_id);
CREATE INDEX IF NOT EXISTS messages_conv_idx ON public.messages(conversation_id);

-- ROW LEVEL SECURITY
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.companies ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.jobs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

-- RLS POLICIES
CREATE POLICY "Users can read own record" ON public.users FOR SELECT USING (id = auth.uid());
CREATE POLICY "Users can update own record" ON public.users FOR UPDATE USING (id = auth.uid());
CREATE POLICY "Profiles: own" ON public.profiles USING (user_id = auth.uid());
CREATE POLICY "Jobs: public read" ON public.jobs FOR SELECT USING (status = 'active' AND deleted_at IS NULL);
CREATE POLICY "Jobs: employer write" ON public.jobs FOR ALL USING (
  company_id IN (SELECT id FROM public.companies WHERE owner_id = auth.uid())
);
CREATE POLICY "Applications: seeker own" ON public.applications USING (seeker_id = auth.uid());
CREATE POLICY "Applications: employer own jobs" ON public.applications FOR SELECT USING (
  job_id IN (SELECT id FROM public.jobs WHERE company_id IN (
    SELECT id FROM public.companies WHERE owner_id = auth.uid()
  ))
);
CREATE POLICY "Messages: participants only" ON public.messages USING (
  conversation_id IN (
    SELECT id FROM public.conversations WHERE seeker_id = auth.uid() OR employer_id = auth.uid()
  )
);
CREATE POLICY "Notifications: own" ON public.notifications USING (user_id = auth.uid());

-- SEED SKILLS
INSERT INTO public.skills (name, category, is_trending) VALUES
('JavaScript','frontend',true),('TypeScript','frontend',true),('React','frontend',true),
('Next.js','frontend',true),('Node.js','backend',true),('Python','backend',true),
('Java','backend',false),('PHP','backend',false),('MySQL','database',false),
('PostgreSQL','database',true),('MongoDB','database',false),('Redis','database',false),
('Docker','devops',true),('AWS','devops',false),('Git','tools',true),
('Figma','design',true),('UI/UX Design','design',true),('Photoshop','design',false),
('Excel','office',true),('Tally','accounting',true),('Data Entry','office',true),
('Sales','sales',true),('Customer Service','service',false),('Digital Marketing','marketing',true),
('SEO','marketing',true),('Content Writing','writing',true),('Social Media Marketing','marketing',true),
('Teaching','education',false),('Welding','trade',false),('Electrician','trade',false),
('Driving','trade',false),('Accounting','finance',true),('GST Filing','finance',true)
ON CONFLICT (name) DO NOTHING;

-- TRIGGER: auto-create profile on user insert
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.users (id, email, role)
  VALUES (NEW.id, NEW.email, COALESCE(NEW.raw_user_meta_data->>'role', 'seeker'))
  ON CONFLICT (id) DO NOTHING;

  INSERT INTO public.profiles (user_id, full_name)
  VALUES (NEW.id, COALESCE(NEW.raw_user_meta_data->>'full_name', ''))
  ON CONFLICT (user_id) DO NOTHING;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- External jobs table
CREATE TABLE IF NOT EXISTS public.external_jobs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  company TEXT NOT NULL,
  city TEXT,
  state TEXT,
  salary_min INTEGER,
  salary_max INTEGER,
  work_type TEXT DEFAULT 'onsite',
  description TEXT,
  source TEXT NOT NULL CHECK (source IN ('adzuna','jsearch','remoteok','ncs')),
  external_url TEXT UNIQUE NOT NULL,
  skills TEXT[] DEFAULT '{}',
  is_expired BOOLEAN DEFAULT FALSE,
  posted_at TIMESTAMPTZ,
  synced_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS ext_jobs_location_idx ON public.external_jobs(state, city);
CREATE INDEX IF NOT EXISTS ext_jobs_expired_idx ON public.external_jobs(is_expired) WHERE is_expired = FALSE;

-- Push subscriptions
CREATE TABLE IF NOT EXISTS public.push_subscriptions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  subscription JSONB NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id)
);

-- Job alerts
CREATE TABLE IF NOT EXISTS public.job_alerts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  keywords TEXT[],
  state TEXT,
  district TEXT,
  city TEXT,
  work_type TEXT[],
  salary_min INTEGER,
  employment_type TEXT[],
  frequency TEXT DEFAULT 'daily' CHECK (frequency IN ('instant','daily','weekly')),
  is_active BOOLEAN DEFAULT TRUE,
  last_sent_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Resumes
CREATE TABLE IF NOT EXISTS public.resumes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  version INTEGER DEFAULT 1,
  resume_url TEXT,
  ai_score INTEGER,
  ats_score INTEGER,
  last_reviewed_at TIMESTAMPTZ,
  ai_feedback JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Add metadata column to notifications if not exists
ALTER TABLE public.notifications ADD COLUMN IF NOT EXISTS metadata JSONB;

-- Notification trigger: new application → notify employer
CREATE OR REPLACE FUNCTION public.notify_employer_on_application()
RETURNS TRIGGER AS $$
DECLARE v_job RECORD; v_seeker RECORD;
BEGIN
  SELECT j.title, c.owner_id, c.name as company_name INTO v_job
  FROM public.jobs j JOIN public.companies c ON j.company_id = c.id WHERE j.id = NEW.job_id;
  SELECT full_name INTO v_seeker FROM public.profiles WHERE user_id = NEW.seeker_id;
  INSERT INTO public.notifications (user_id, type, title, body, action_url, metadata)
  VALUES (v_job.owner_id, 'application_received', 'New application received',
    COALESCE(v_seeker.full_name,'Someone') || ' applied for ' || COALESCE(v_job.title,'your job'),
    '/employer/jobs/' || NEW.job_id || '/applicants',
    jsonb_build_object('application_id', NEW.id, 'job_id', NEW.job_id));
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_application_insert ON public.applications;
CREATE TRIGGER on_application_insert
  AFTER INSERT ON public.applications
  FOR EACH ROW EXECUTE FUNCTION public.notify_employer_on_application();

-- Notification trigger: status change → notify seeker
CREATE OR REPLACE FUNCTION public.notify_seeker_on_status_change()
RETURNS TRIGGER AS $$
DECLARE v_job RECORD; v_status_text TEXT;
BEGIN
  IF OLD.status = NEW.status THEN RETURN NEW; END IF;
  SELECT j.title, c.name as company_name INTO v_job
  FROM public.jobs j JOIN public.companies c ON j.company_id = c.id WHERE j.id = NEW.job_id;
  v_status_text := CASE NEW.status
    WHEN 'viewed' THEN 'viewed your application'
    WHEN 'shortlisted' THEN 'shortlisted you! 🎉'
    WHEN 'rejected' THEN 'updated your application'
    WHEN 'hired' THEN 'offered you the position! 🎊'
    ELSE 'updated your application'
  END;
  INSERT INTO public.notifications (user_id, type, title, body, action_url, metadata)
  VALUES (NEW.seeker_id, 'application_update',
    COALESCE(v_job.company_name,'Company') || ' ' || v_status_text,
    'Your application for ' || COALESCE(v_job.title,'the job') || ' is now: ' || NEW.status,
    '/seeker/applications/' || NEW.id,
    jsonb_build_object('application_id', NEW.id, 'new_status', NEW.status));
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_application_status_change ON public.applications;
CREATE TRIGGER on_application_status_change
  AFTER UPDATE OF status ON public.applications
  FOR EACH ROW EXECUTE FUNCTION public.notify_seeker_on_status_change();

-- Notification trigger: new message
CREATE OR REPLACE FUNCTION public.notify_on_new_message()
RETURNS TRIGGER AS $$
DECLARE v_conv RECORD; v_sender_name TEXT; v_recipient_id UUID;
BEGIN
  SELECT seeker_id, employer_id INTO v_conv FROM public.conversations WHERE id = NEW.conversation_id;
  SELECT full_name INTO v_sender_name FROM public.profiles WHERE user_id = NEW.sender_id;
  v_recipient_id := CASE WHEN NEW.sender_id = v_conv.seeker_id THEN v_conv.employer_id ELSE v_conv.seeker_id END;
  INSERT INTO public.notifications (user_id, type, title, body, action_url, metadata)
  VALUES (v_recipient_id, 'new_message',
    'Message from ' || COALESCE(v_sender_name,'Someone'),
    LEFT(NEW.body, 80),
    '/seeker/messages/' || NEW.conversation_id,
    jsonb_build_object('conversation_id', NEW.conversation_id));
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_new_message ON public.messages;
CREATE TRIGGER on_new_message
  AFTER INSERT ON public.messages
  FOR EACH ROW EXECUTE FUNCTION public.notify_on_new_message();
