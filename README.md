

# CodeArena 🏆

> A production-ready, full-stack coding practice platform — inspired by LeetCode — built with modern web technologies.

[![Next.js](https://img.shields.io/badge/Next.js-15-black?logo=next.js)](https://nextjs.org/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-Neon-blue?logo=postgresql)](https://neon.tech/)
[![Prisma](https://img.shields.io/badge/Prisma-5-indigo?logo=prisma)](https://prisma.io/)
[![Clerk](https://img.shields.io/badge/Auth-Clerk-purple?logo=clerk)](https://clerk.com/)
[![Vercel](https://img.shields.io/badge/Deployed-Vercel-black?logo=vercel)](https://vercel.com/)

---

## 🔗 Live Demo

**[https://codearena-e6et-nk01llxcq-rifaz-shaikh-razaks-projects.vercel.app](https://codearena-e6et-nk01llxcq-rifaz-shaikh-razaks-projects.vercel.app)**

> Sign in with GitHub to start solving problems instantly.

---

## 📸 What is CodeArena?

CodeArena is a **full-stack coding judge platform** where developers can:

- Solve algorithmic problems with a VS Code-like editor
- Execute code in real-time using Judge0 engine
- Track submission history with memory and time stats
- Organize problems into custom playlists
- View their coding progress on a personal profile

Built as a portfolio project to demonstrate full-stack engineering skills including **backend API design, database modeling, authentication, third-party API integration, and cloud deployment.**
## 📸 What is CodeArena?

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
| 🔐 GitHub OAuth | One-click login via Clerk |
| 👤 Role-based Access | Admin creates problems, Users solve them |
| 💻 Monaco Editor | VS Code-powered code editor in the browser |
| ⚡ Real-time Execution | Code runs via Judge0 against all test cases |
| 📊 Submission History | Track every submission with memory & time stats |
| 📋 Custom Playlists | Organize and save problems into collections |
| 👤 Profile Dashboard | View solved problems, stats, and playlists |
| 🌙 Dark / Light Mode | Full theme support |
| 🛡️ Admin Panel | Create and manage problems with validation |

---

## 🛠️ Tech Stack

### Frontend
| Technology | Purpose |
|---|---|
| Next.js 15 (App Router) | Full-stack React framework with SSR |
| Tailwind CSS | Utility-first CSS framework |
| shadcn/ui | Accessible, reusable UI components |
| Monaco Editor | VS Code editor in the browser |
| React Hook Form + Zod | Form state management & validation |
| next-themes | Dark/Light mode support |

### Backend
| Technology | Purpose |
|---|---|
| Next.js API Routes | RESTful backend endpoints |
| Prisma 5 | Type-safe ORM for database operations |
| PostgreSQL (Neon) | Cloud-hosted relational database |
| Clerk | Authentication & session management |
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

```
┌─────────────────────────────────────────────────────┐
│                    User Browser                      │
└────────────────────────┬────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────┐
│                 Vercel (Next.js 15)                  │
│                                                      │
│  ┌─────────────┐  ┌──────────────┐  ┌────────────┐ │
│  │   Pages     │  │  API Routes  │  │  Middleware │ │
│  │ (App Router)│  │   /api/*     │  │  (Clerk)   │ │
│  └─────────────┘  └──────────────┘  └────────────┘ │
└──────┬──────────────────┬───────────────────────────┘
       │                  │
       ▼                  ▼
┌──────────────┐  ┌───────────────┐  ┌──────────────┐
│   Clerk      │  │   Neon DB     │  │   Judge0 CE  │
│   (Auth)     │  │  (PostgreSQL) │  │  (Code Exec) │
└──────────────┘  └───────────────┘  └──────────────┘
```

---

## 🔄 Code Execution Flow

```
User submits code
       ↓
Next.js API Route validates request
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
Saves submission to PostgreSQL via Prisma
       ↓
Returns results to user
```

---

## 🗄️ Database Schema

```
User ──────────────────────────────────────┐
 ├── problems[]      (created by admin)     │
 ├── submissions[]   (code submissions)     │
 ├── solvedProblems[] (solved tracking)     │
 └── playlists[]     (custom collections)  │
                                           │
Problem ────────────────────────────────── │
 ├── user            (creator)  ←──────────┘
 ├── submissions[]
 ├── solvedBy[]
 └── problemsPlaylists[]

Submission
 └── testCases[]     (per test case results)

Playlist
 └── problems[]      (ProblemInPlaylist)
```

---

## 📁 Project Structure

```
codearena/
├── app/
│   ├── (auth)/                  # Auth pages (sign-in, sign-up)
│   ├── (root)/                  # Protected app pages
│   │   ├── about/               # About page
│   │   ├── problems/            # Problems list
│   │   └── profile/             # User profile
│   ├── api/
│   │   ├── create-problem/      # Problem creation API
│   │   └── playlists/           # Playlist management API
│   ├── create-problem/          # Admin problem creation page
│   └── problem/[id]/            # Dynamic problem solving page
├── components/
│   ├── providers/               # Theme provider
│   └── ui/                      # shadcn/ui components
├── lib/
│   ├── db.js                    # Prisma client singleton
│   └── judge0.js                # Judge0 API helpers
├── modules/
│   ├── auth/actions/            # Auth server actions
│   ├── home/components/         # Navbar component
│   ├── problems/
│   │   ├── actions/             # Problem server actions
│   │   └── components/          # Problem UI components
│   └── profile/
│       ├── actions/             # Profile server actions
│       └── components/          # Profile UI components
└── prisma/
    └── schema.prisma            # Database schema
```

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
```

**4. Run database migrations**
```bash
npx prisma migrate dev
```

**5. Start the development server**
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
3. Create a [Clerk](https://clerk.com) application with GitHub OAuth
4. Import the repo on [Vercel](https://vercel.com)
5. Add all environment variables in Vercel settings
6. Run `npx prisma migrate deploy` against your Neon DB

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

---

## 👥 User Roles

| Role | Permissions |
|---|---|
| `USER` | Browse problems, write & submit code, create playlists, view profile |
| `ADMIN` | Everything USER can do + create problems with Judge0 validation |

> To set a user as ADMIN, run this SQL in your database:
> ```sql
> UPDATE "User" SET role = 'ADMIN' WHERE email = 'your@email.com';
> ```

---

## 📝 Git Flow

```
main (production)
└── dev (integration)
    ├── feature/project-setup
    ├── feature/database-setup
    ├── feature/auth-clerk
    ├── feature/user-onboarding
    ├── feature/navbar-homepage
    ├── feature/judge0-setup
    ├── feature/create-problem
    ├── feature/get-problems
    ├── feature/problem-solving-page
    ├── feature/submission-history-fetch
    ├── feature/playlist-system
    ├── feature/profile-page-ui
    └── feature/about-page
```

---

## 📦 Key Dependencies

```json
{
  "next": "16.1.7",
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
- Live: [codearena.vercel.app](https://codearena-e6et-nk01llxcq-rifaz-shaikh-razaks-projects.vercel.app)

---

⭐ **If you found this project helpful, please give it a star on GitHub!**

