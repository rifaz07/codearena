# CodeArena 🏆

> A production-ready, full-stack coding practice platform with timed mock interviews — inspired by LeetCode — built with modern web technologies.

[![Next.js](https://img.shields.io/badge/Next.js-16-black?logo=next.js)](https://nextjs.org/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-Neon-blue?logo=postgresql)](https://neon.tech/)
[![Prisma](https://img.shields.io/badge/Prisma-5-indigo?logo=prisma)](https://prisma.io/)
[![Clerk](https://img.shields.io/badge/Auth-Clerk-purple?logo=clerk)](https://clerk.com/)
[![Vercel](https://img.shields.io/badge/Deployed-Vercel-black?logo=vercel)](https://vercel.com/)
[![Release](https://img.shields.io/badge/Release-v1.1.0-orange)](https://github.com/rifaz07/codearena/releases)

---

## 🔗 Live Demo

**[codearena-e6et.vercel.app](https://codearena-e6et.vercel.app/)**

> Sign in with GitHub or Google to start solving problems instantly.

---

## 📸 What is CodeArena?

CodeArena is a **full-stack coding judge platform with timed mock interviews**, where developers can:

- Solve algorithmic problems with a VS Code-like editor
- Execute code in real-time using the Judge0 engine
- Take **60-minute mock interviews** with real-time feedback and behavior analysis
- Track submission history with memory and time stats
- Organize problems into custom playlists
- View their coding progress on a personal profile

Built as a portfolio project to demonstrate full-stack engineering including **backend API design, database modeling, authentication, third-party API integration, stateful UX under time pressure, and cloud deployment.**

![Home](./assets/home.png)
![Problems](./assets/problems.png)
![Problem](./assets/problem.png)
![Profile](./assets/profile.png)
![Profile Details](./assets/profile1.png)
![Playlist](./assets/playlist.png)

---

## ✨ Features

| Feature | Description |
|---|---|
| 🎤 **Mock Interviews** | 60-minute timed sessions with 2 problems, behavior analysis, and next-step recommendations |
| 🔐 GitHub & Google OAuth | One-click login via Clerk |
| 👤 Role-based Access | Admin creates problems, Users solve them |
| 💻 Monaco Editor | VS Code-powered code editor with localStorage-backed autosave |
| ⚡ Real-time Execution | Code runs via Judge0 batch API against all test cases |
| 📊 Submission History | Track every submission with memory & time stats |
| 📋 Custom Playlists | Organize and save problems into collections |
| 👤 Profile Dashboard | View solved problems, stats, and playlists |
| 🌙 Dark / Light Mode | Full theme support |
| 🛡️ Admin Panel | Create and manage problems with validation |

---

## 🎤 Mock Interview Feature (v1.1.0)

A complete timed interview simulator built on top of CodeArena.

### How it works

1. **Setup** — User selects a company (Google, Amazon, Microsoft) and difficulty (Easy, Medium)
2. **Interview** — System picks 2 problems from different topics, starts a 60-min server-tracked timer
3. **Execution** — Code is run live via Judge0, pass/fail surfaces instantly
4. **Results** — A detailed breakdown page shows:
   - Score + solved/failed/skipped per question
   - Time verdict (Fast / On Track / Slow / Very Slow)
   - Time split visualization (Q1 vs Q2 percentages)
   - Weak area detection from failed/skipped problems
   - Behavior insight (detects rushing, stalling, unbalanced time)
   - 3 next-step problem recommendations

### Key engineering decisions

- **Server-side timer** — the 60-min countdown is computed from `session.startTime` on every load. Client timer is for display only. Prevents client tampering.
- **Prisma transactions** — session/question/submission updates happen atomically. No partial state.
- **Idempotent cron cleanup** — a POST route at `/api/cron/cleanup-sessions` catches timed-out sessions even if the user closes their tab. Auth-guarded via header secret.
- **localStorage autosave** — user code auto-saves every 2 seconds under a composite key `mock-interview:{sessionId}:q{order}:{language}`. Draft survives refresh.
- **Optimistic UI** — Q1/Q2 status badges update instantly after submit/skip without a server round-trip.
- **Topic diversity** — the question picker groups problems by `primaryTag` and pulls from two different tags, so a user never gets two problems from the same topic.

---

## 🛠️ Tech Stack

### Frontend
| Technology | Purpose |
|---|---|
| Next.js 16 (App Router) | Full-stack React framework with SSR |
| React 19 | UI library |
| Tailwind CSS v4 | Utility-first CSS framework |
| shadcn/ui | Accessible, reusable UI components |
| Monaco Editor | VS Code editor in the browser |
| React Hook Form + Zod | Form state management & validation |
| next-themes | Dark/Light mode support |
| Sonner | Toast notifications |

### Backend
| Technology | Purpose |
|---|---|
| Next.js Server Actions | Type-safe backend endpoints |
| Prisma 5 | Type-safe ORM for database operations |
| PostgreSQL (Neon) | Cloud-hosted relational database |
| Clerk v7 | Authentication & session management |
| Judge0 CE | Sandboxed code execution engine |
| Axios | HTTP client for Judge0 API calls |

### DevOps
| Technology | Purpose |
|---|---|
| Vercel | Cloud deployment & CI/CD |
| Neon DB | Serverless PostgreSQL in the cloud |
| Docker | Local PostgreSQL containerization |
| Git Flow | Feature branch workflow |

---

## 🏗️ System Architecture
┌─────────────────────────────────────────────────────┐
│                    User Browser                      │
└────────────────────────┬────────────────────────────┘
│
▼
┌─────────────────────────────────────────────────────┐
│                 Vercel (Next.js 16)                  │
│                                                      │
│  ┌─────────────┐  ┌──────────────┐  ┌────────────┐ │
│  │   Pages     │  │Server Actions│  │  Middleware │ │
│  │ (App Router)│  │  + API Route │  │  (Clerk)   │ │
│  └─────────────┘  └──────────────┘  └────────────┘ │
└──────┬──────────────────┬───────────────────────────┘
│                  │
▼                  ▼
┌──────────────┐  ┌───────────────┐  ┌──────────────┐
│   Clerk      │  │   Neon DB     │  │   Judge0 CE  │
│   (Auth)     │  │  (PostgreSQL) │  │  (Code Exec) │
└──────────────┘  └───────────────┘  └──────────────┘

---

## 🔄 Code Execution Flow
User submits code
↓
Server Action validates request + session ownership
↓
Gets Judge0 language ID
↓
Sends code + test cases as batch to Judge0
↓
Receives tokens (one per test case)
↓
Polls Judge0 every 1s until complete
↓
status.id === 3 → Accepted ✅
status.id === 4 → Wrong Answer ❌
status.id === 5 → Time Limit Exceeded ⏰
status.id === 6 → Compilation Error 💥
↓
Saves submission in Prisma transaction
(creates Submission + TestCaseResult + updates MockSessionQuestion)
↓
Returns results to user

---

## 🗄️ Database Schema
User ────────────────────────────────────────────┐
├── problems[]        (created by admin)        │
├── submissions[]     (code submissions)        │
├── solvedProblems[]  (solved tracking)         │
├── playlists[]       (custom collections)      │
└── mockSessions[]    (mock interview history)  │
│
Problem ──────────────────────────────────────── │
├── user              (creator)  ←──────────────┘
├── submissions[]
├── solvedBy[]
├── problemsPlaylists[]
├── mockQuestions[]   (appearances in mock interviews)
├── companies[]       (GOOGLE | AMAZON | MICROSOFT)
├── primaryTag        (Array | String | Tree | Graph | DP | ...)
└── expectedTime      (seconds — for pace verdicts)
MockSession
├── userId
├── company, difficulty, status (IN_PROGRESS | COMPLETED | TIMED_OUT)
├── startTime, endTime, totalTime
└── questions[]       (MockSessionQuestion)
MockSessionQuestion
├── sessionId, problemId, order (1 | 2)
├── status            (PENDING | SOLVED | FAILED | SKIPPED)
├── submissionId      (links to Submission)
└── questionStartTime, questionEndTime, timeTaken
Submission
└── testCases[]       (per test case results)
Playlist
└── problems[]        (ProblemInPlaylist)

---

## 📁 Project Structure
codearena/
├── app/
│   ├── (auth)/                          # Auth pages (sign-in, sign-up)
│   ├── (root)/                          # Protected app pages
│   │   ├── about/                       # About page
│   │   ├── mock-interview/              # 🎤 Mock Interview feature
│   │   │   ├── page.jsx                 #    Landing page
│   │   │   ├── setup/                   #    Company + difficulty select
│   │   │   └── [sessionId]/             #    Active interview room
│   │   │       ├── page.jsx
│   │   │       └── result/              #    Results breakdown
│   │   ├── problems/                    # Problems list
│   │   └── profile/                     # User profile
│   ├── api/
│   │   ├── create-problem/              # Problem creation API
│   │   ├── cron/cleanup-sessions/       # 🎤 Timed-out session cleanup
│   │   └── playlists/                   # Playlist management API
│   ├── create-problem/                  # Admin problem creation page
│   └── problem/[id]/                    # Dynamic problem solving page
├── components/
│   ├── providers/                       # Theme provider
│   └── ui/                              # shadcn/ui components
├── lib/
│   ├── db.js                            # Prisma client singleton
│   └── judge0.js                        # Judge0 API helpers
├── modules/
│   ├── auth/actions/                    # Auth server actions
│   ├── home/components/                 # Navbar component
│   ├── mock-interview/                  # 🎤 Mock Interview module
│   │   ├── actions/                     #    6 server actions (start, submit, skip, timeout, get, result)
│   │   └── components/                  #    Room client, timer, panels, result cards
│   ├── problems/
│   │   ├── actions/                     # Problem server actions
│   │   └── components/                  # Problem UI components
│   └── profile/
│       ├── actions/                     # Profile server actions
│       └── components/                  # Profile UI components
└── prisma/
├── schema.prisma                    # Database schema
├── migrations/                      # DB migration history
└── seed.mjs                         # 🎤 15-problem seed script

---

## ⚙️ Getting Started Locally

### Prerequisites

- Node.js 20+
- Docker Desktop
- Git

### Installation

**1. Clone the repository**
```bash
git clone https://github.com/rifaz07/codearena.git
cd codearena
```

**2. Install dependencies**
```bash
npm install
```

**3. Set up environment variables**

Create a `.env` file in the root:

```env
# Local development (Docker PostgreSQL)
DATABASE_URL="postgresql://postgres:postgres123@localhost:5433/codearena?schema=public"

# For production use Neon DB URL:
# DATABASE_URL="postgresql://user:pass@ep-xxx.neon.tech/neondb?sslmode=require"

NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
CLERK_SECRET_KEY=your_clerk_secret_key

NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
NEXT_PUBLIC_CLERK_SIGN_IN_FALLBACK_REDIRECT_URL=/
NEXT_PUBLIC_CLERK_SIGN_UP_FALLBACK_REDIRECT_URL=/
NEXT_PUBLIC_CLERK_SIGN_IN_FORCE_REDIRECT_URL=/
NEXT_PUBLIC_CLERK_SIGN_UP_FORCE_REDIRECT_URL=/

JUDGE0_API_URL=https://ce.judge0.com

# Mock Interview cron secret (for /api/cron/cleanup-sessions)
CRON_SECRET=your_strong_random_secret
```

**4. Run database migrations**
```bash
npx prisma migrate dev
```

**5. Seed the database with 15 interview problems**
```bash
npx prisma db seed
```

**6. Start the development server**
```bash
npm run dev
```

> This starts Docker (PostgreSQL) + Next.js together via the dev script.

Visit `http://localhost:3000` 🎉

---

## 🚀 Deployment

This project is deployed on **Vercel** with **Neon DB** as the cloud PostgreSQL database.

### Deploy your own:
1. Fork this repository
2. Create a [Neon DB](https://neon.tech) project and copy the connection string
3. Create a [Clerk](https://clerk.com) application with GitHub + Google OAuth
4. Import the repo on [Vercel](https://vercel.com)
5. Add all environment variables in Vercel settings
6. Run `npx prisma migrate deploy` against your Neon DB
7. Run `npx prisma db seed` to seed the 15 interview problems

---

## 🔑 Environment Variables

| Variable | Description |
|---|---|
| `DATABASE_URL` | PostgreSQL connection string |
| `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` | Clerk public key |
| `CLERK_SECRET_KEY` | Clerk secret key |
| `NEXT_PUBLIC_CLERK_SIGN_IN_URL` | Sign-in page URL |
| `NEXT_PUBLIC_CLERK_SIGN_UP_URL` | Sign-up page URL |
| `NEXT_PUBLIC_CLERK_SIGN_IN_FALLBACK_REDIRECT_URL` | Fallback after sign-in |
| `NEXT_PUBLIC_CLERK_SIGN_UP_FALLBACK_REDIRECT_URL` | Fallback after sign-up |
| `NEXT_PUBLIC_CLERK_SIGN_IN_FORCE_REDIRECT_URL` | Force redirect after sign-in |
| `NEXT_PUBLIC_CLERK_SIGN_UP_FORCE_REDIRECT_URL` | Force redirect after sign-up |
| `JUDGE0_API_URL` | Judge0 API base URL |
| `CRON_SECRET` | Shared secret for the mock interview cleanup cron endpoint |

---

## 👥 User Roles

| Role | Permissions |
|---|---|
| `USER` | Browse problems, write & submit code, take mock interviews, create playlists, view profile |
| `ADMIN` | Everything USER can do + create problems with Judge0 validation |

> To set a user as ADMIN, run this SQL in your database:
> ```sql
> UPDATE "User" SET role = 'ADMIN' WHERE email = 'your@email.com';
> ```

---

## 📝 Git Flow
main (production)
└── dev (integration)
├── feature/project-setup
├── feature/database-setup
├── feature/auth-clerk
├── feature/navbar-homepage
├── feature/judge0-setup
├── feature/create-problem
├── feature/get-problems
├── feature/problem-solving-page
├── feature/submission-history-fetch
├── feature/playlist-system
├── feature/profile-page-ui
├── feature/about-page
│
│── 🎤 Mock Interview (v1.1.0)
├── feature/mock-interview-db          # Prisma schema
├── feature/mock-interview-backend     # 6 server actions
├── feature/mock-interview-security    # Cron + middleware
├── feature/mock-interview-setup       # Setup page UI
├── feature/mock-interview-room        # Interview room UI
├── feature/mock-interview-results     # Results screen UI
├── feature/mock-interview-seed        # 15 problem seed script
├── feature/mock-interview-testing     # Full flow QA
└── feature/mock-interview-polish      # Error states + bug fixes

---

## 📦 Key Dependencies

```json
{
  "next": "16.1.7",
  "react": "19.2.3",
  "@clerk/nextjs": "^7.0.5",
  "@prisma/client": "^5.22.0",
  "@monaco-editor/react": "^4.7.0",
  "react-hook-form": "^7.72.0",
  "zod": "^4.3.6",
  "axios": "^1.13.6",
  "sonner": "^2.0.7",
  "next-themes": "^0.4.6",
  "tailwindcss": "^4"
}
```

---

## 🙏 Acknowledgements

- [Judge0](https://judge0.com/) — Open source code execution engine
- [Clerk](https://clerk.com/) — Authentication infrastructure
- [shadcn/ui](https://ui.shadcn.com/) — Beautiful UI components
- [Monaco Editor](https://microsoft.github.io/monaco-editor/) — The editor that powers VS Code
- [Neon](https://neon.tech/) — Serverless PostgreSQL

---

## 👨‍💻 Author

**Rifaz Shaikh**
- GitHub: [@rifaz07](https://github.com/rifaz07)
- Project: [CodeArena](https://github.com/rifaz07/codearena)
- Live: [codearena.vercel.app](https://codearena-e6et.vercel.app/)

---

⭐ **If you found this project helpful, please give it a star on GitHub!**
