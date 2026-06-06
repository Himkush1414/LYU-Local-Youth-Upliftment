<div align="center">

<img src="https://img.shields.io/badge/LYU-2.0-6c63ff?style=for-the-badge&labelColor=0a0a0f" alt="LYU 2.0" />

# LYU — Local Youth Upliftment

**AI-Powered Career Platform for India's Next Generation**

*Empowering local talent to discover their path, build real skills, and land meaningful work.*

[![Live Demo](https://img.shields.io/badge/Live%20Demo-lyu--local--youth--upliftment.vercel.app-6c63ff?style=flat-square&logo=vercel&logoColor=white)](https://lyu-local-youth-upliftment.vercel.app)
[![Next.js](https://img.shields.io/badge/Next.js-16.2-black?style=flat-square&logo=next.js)](https://nextjs.org)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178c6?style=flat-square&logo=typescript&logoColor=white)](https://typescriptlang.org)
[![Supabase](https://img.shields.io/badge/Supabase-Auth%20%2B%20DB-3ecf8e?style=flat-square&logo=supabase&logoColor=white)](https://supabase.com)
[![Groq](https://img.shields.io/badge/AI-Groq%20%7C%20LLaMA%203.3%2070B-f55036?style=flat-square)](https://groq.com)
[![License](https://img.shields.io/badge/License-MIT-10b981?style=flat-square)](LICENSE)

</div>

---

## ✨ What is LYU?

LYU (Local Youth Upliftment) is a premium, full-stack career platform built specifically for Indian job seekers — from fresh graduates chasing their first placement to experienced professionals eyeing their next move. It combines real-time AI mentorship, curated learning paths, government exam prep, and a powerful resume studio into one dark-themed, mobile-first experience.

---

## 🚀 Live Demo

🌐 **[lyu-local-youth-upliftment.vercel.app](https://lyu-local-youth-upliftment.vercel.app)**

> Try the Career AI, generate a personalized learning path, or explore job opportunities — no sign-up required for demo browsing.

---

## 📸 Features at a Glance

| Module | Description |
|--------|-------------|
| 🏠 **Dashboard** | Animated stat cards, profile strength radial chart, upcoming interviews, Career AI tips, activity feed |
| 💼 **Opportunities** | Job feed with search/filter/sort, private + government sections, split-panel detail view |
| 📋 **Applications** | 5-stage kanban tracker (Applied → Offer), expandable rows with notes and smart action buttons |
| 🔖 **Saved Jobs** | Deadline urgency banners, match % badges, 3 sort modes, trash with exit animation |
| 🤖 **Career AI** | Real-time streaming chat powered by Groq (LLaMA 3.3 70B) — deep Indian career mentor persona |
| 📚 **Learning Path** | Paste a JD → AI generates a phased roadmap with YouTube channels, courses, books, and mock tests |
| 💬 **Messages** | Recruiter DM UI with conversation list, chat bubbles, read receipts, and company avatars |
| 👤 **Profile Builder** | Completion tracker, work experience, education, skills tags, social links, Supabase-backed |
| ⚙️ **Settings** | Notifications, privacy toggles, job preferences, salary range sliders, danger zone |
| 📄 **Resume Studio** | AI-assisted resume builder with live preview and export |

---

## 🛠️ Tech Stack

### Frontend
- **[Next.js 16.2](https://nextjs.org)** — App Router, React Server Components, Turbopack
- **[React 19](https://react.dev)** — Latest concurrent features
- **[TypeScript 5](https://typescriptlang.org)** — Strict mode, zero `any` types
- **[Tailwind CSS v4](https://tailwindcss.com)** — Utility-first styling
- **[Framer Motion](https://framer.motion.com)** — Smooth animations throughout
- **[Lucide React](https://lucide.dev)** — Consistent icon system

### Backend & Infrastructure
- **[Supabase](https://supabase.com)** — PostgreSQL database, Auth (email + OAuth), Row Level Security
- **[Vercel](https://vercel.com)** — Edge deployment, serverless functions, CI/CD from GitHub
- **[Upstash Redis](https://upstash.com)** — Rate limiting and caching
- **[Resend](https://resend.com)** — Transactional emails

### AI & Intelligence
- **[Groq](https://groq.com)** — Ultra-fast LLaMA 3.3 70B inference for Career AI chat and Learning Path generation
- **[Zustand](https://zustand-demo.pmnd.rs)** — Lightweight global state management
- **[TanStack Query](https://tanstack.com/query)** — Server state, caching, and background sync

### UI & UX
- **[Sonner](https://sonner.emilkowal.ski)** — Beautiful toast notifications
- **[Recharts](https://recharts.org)** — Data visualization
- **[Radix UI](https://radix-ui.com)** — Accessible, unstyled component primitives
- **[Vaul](https://vaul.emilkowal.ski)** — Drawer component for mobile sheets

---

## 🗂️ Project Structure

```
LYU2.0/
├── app/
│   ├── seeker/                  # All job seeker pages
│   │   ├── layout.tsx           # Responsive sidebar + topbar layout
│   │   ├── dashboard/           # Dashboard with stats & AI tips
│   │   ├── opportunities/       # Job discovery & filtering
│   │   ├── applications/        # Application status tracker
│   │   ├── saved/               # Saved jobs manager
│   │   ├── chat/                # AI career mentor (Groq streaming)
│   │   ├── learning/            # AI learning path generator
│   │   ├── messages/            # Recruiter messaging
│   │   ├── profile/             # Profile builder
│   │   ├── resume/              # Resume studio
│   │   └── settings/            # Account settings
│   ├── employer/                # Employer portal
│   ├── auth/                    # Auth flows (login, register, OTP)
│   ├── admin/                   # Admin dashboard
│   └── api/v1/                  # API routes (AI, jobs, notifications)
├── lib/
│   └── supabase/                # Supabase client & server helpers
├── components/                  # Shared UI components
└── public/                      # Static assets
```

---

## ⚡ Getting Started

### Prerequisites
- Node.js 18+
- npm or pnpm
- A [Supabase](https://supabase.com) project
- A [Groq](https://console.groq.com) API key (free)

### 1. Clone the repo

```bash
git clone https://github.com/Himkush1414/LYU-Local-Youth-Upliftment.git
cd LYU-Local-Youth-Upliftment
```

### 2. Install dependencies

```bash
npm install
```

### 3. Set up environment variables

Create a `.env.local` file in the root:

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key

# AI (Groq — free at console.groq.com)
NEXT_PUBLIC_GROQ_API_KEY=your_groq_api_key
```

### 4. Run the development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) 🎉

---

## 🌐 Deployment

This project is deployed on **Vercel** with automatic deployments on every push to `main`.

### Deploy your own

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/Himkush1414/LYU-Local-Youth-Upliftment)

Add the 3 environment variables in Vercel's dashboard and you're live in ~60 seconds.

---

## 🎨 Design System

LYU uses a custom dark design system with consistent tokens across every page:

| Token | Value | Usage |
|-------|-------|-------|
| Background | `#0a0a0f` | Page background |
| Card | `#111118` | All card surfaces |
| Purple | `#6c63ff` | Primary accent, CTAs |
| Cyan | `#06b6d4` | Secondary accent, info |
| Green | `#10b981` | Success, verified states |
| Amber | `#f59e0b` | Warnings, notifications |
| Red | `#ef4444` | Errors, danger actions |
| Text | `#f8fafc` | Primary text |
| Subtext | `#94a3b8` | Secondary text |

All styling is done via **inline styles** for zero CSS-in-JS overhead and perfect theme consistency.

---

## 🤖 AI Features

### Career AI Chat
- Powered by **Groq + LLaMA 3.3 70B** with real-time SSE streaming
- Deep system prompt tuned for the Indian job market — knows FAANG, PSUs, UPSC, startups, tier-2 cities
- Full conversation history, stop mid-stream, 6 quick-start suggestion prompts
- Covers: resume reviews, salary negotiation, interview prep, career pivots, skill gaps

### Learning Path Generator
- Paste any job description → AI generates a phased learning roadmap in seconds
- Returns real resources: YouTube channels (Hitesh Choudhary, Krish Naik, Apna College), platforms (Coursera, NPTEL, Internshala), books for government exams
- Each resource tagged: type badge, FREE/PAID, duration, star rating
- Progress tracking — check off resources as you complete them
- Quick paths: React Dev, Data Science, Cloud/DevOps, UPSC, SSC CGL, Banking PO, Product Manager

---

## 📋 Roadmap

- [ ] Real job listings via Naukri / LinkedIn API integration
- [ ] Employer portal — post jobs, review applications, message seekers
- [ ] Resume PDF export from Resume Studio
- [ ] Government exam mock test module
- [ ] Push notifications for application status changes
- [ ] Mobile app (React Native)
- [ ] Referral and community features

---

## 🤝 Contributing

Contributions are welcome! Please open an issue first to discuss what you'd like to change.

```bash
# Fork the repo, then:
git checkout -b feature/your-feature-name
git commit -m "Add: your feature"
git push origin feature/your-feature-name
# Open a Pull Request
```

---

## 📄 License

This project is licensed under the [MIT License](LICENSE).

---

<div align="center">

Built with ❤️ for India's youth

**[Live Demo](https://lyu-local-youth-upliftment.vercel.app)** · **[Report Bug](https://github.com/Himkush1414/LYU-Local-Youth-Upliftment/issues)** · **[Request Feature](https://github.com/Himkush1414/LYU-Local-Youth-Upliftment/issues)**

</div>
