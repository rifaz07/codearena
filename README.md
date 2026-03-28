# CodeArena 🏆

CodeArena is a full-stack LeetCode-inspired coding practice platform built with Next.js 15, PostgreSQL, and Judge0.
It allows developers to solve coding problems in JavaScript, Python, and Java with real-time code execution,
instant test case feedback, submission history tracking, and custom problem playlists —
all secured with GitHub OAuth authentication and role-based access control.

---

## 🚀 Live Demo

> Coming soon after deployment

---

## 📸 Features

- 🔐 **GitHub OAuth Authentication** via Clerk
- 👤 **Role-based Access Control** (Admin / User)
- 📝 **Problem Creation** with Judge0 validation (Admin only)
- 💻 **Online Code Editor** powered by Monaco Editor
- ⚡ **Real-time Code Execution** via Judge0 API
- 📊 **Submission History** with memory and time stats
- 📋 **Custom Playlists** to organize problems
- 👤 **User Profile** with stats and solved problems
- 🌙 **Dark / Light Mode**

---

## 🛠️ Tech Stack

| Technology | Purpose |
|---|---|
| Next.js 15 (App Router) | Full-stack React framework |
| PostgreSQL | Relational database |
| Prisma 5 | Type-safe ORM |
| Docker | Database containerization |
| Clerk | Authentication & GitHub OAuth |
| Judge0 CE | Code execution engine |
| Monaco Editor | VS Code-like code editor |
| shadcn/ui | UI component library |
| Tailwind CSS | Utility-first styling |
| React Hook Form + Zod | Form management & validation |
| Axios | HTTP requests |

---

## 📁 Project Structure

```
codearena/
├── app/
│   ├── (auth)/                  # Sign-in, Sign-up pages
│   ├── (root)/                  # Protected pages
│   │   ├── about/               # About page
│   │   ├── problems/            # Problems list page
│   │   └── profile/             # User profile page
│   ├── api/
│   │   ├── create-problem/      # Create problem API
│   │   └── playlists/           # Playlist APIs
│   ├── create-problem/          # Create problem page (Admin)
│   └── problem/[id]/            # Problem solving page
├── components/
│   ├── providers/               # Theme provider
│   └── ui/                      # shadcn components
├── lib/
│   ├── db.js                    # Prisma client
│   └── judge0.js                # Judge0 helper functions
├── modules/
│   ├── auth/actions/            # Auth server actions
│   ├── home/components/         # Navbar
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

## 🗄️ Database Schema

```
User
 ├── problems (Problem[])
 ├── submissions (Submission[])
 ├── solvedProblems (ProblemSolved[])
 └── playlists (Playlist[])

Problem
 ├── submissions (Submission[])
 ├── solvedBy (ProblemSolved[])
 └── problemsPlaylists (ProblemInPlaylist[])

Submission
 └── testCases (TestCaseResult[])

Playlist
 └── problems (ProblemInPlaylist[])
```

---

## ⚙️ Getting Started

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
DATABASE_URL="postgresql://postgres:postgres123@localhost:5433/codearena?schema=public"

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

This will start Docker (PostgreSQL) and Next.js together.

Visit `http://localhost:3000` 🎉

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

## 🔄 How Code Execution Works

```
User submits code
      ↓
Next.js API route receives request
      ↓
For each language (JS, Python, Java):
  - Send code + test cases to Judge0 (batch)
  - Get tokens back
  - Poll until execution complete
  - Check if all test cases passed (status.id === 3)
      ↓
Save submission to database
      ↓
Return results to user
```

**Judge0 Status Codes:**
- `1` → In Queue
- `2` → Processing
- `3` → Accepted ✅
- `4` → Wrong Answer ❌
- `5` → Time Limit Exceeded
- `6` → Compilation Error

---

## 👥 User Roles

| Role | Permissions |
|---|---|
| `USER` | Browse problems, submit solutions, create playlists, view profile |
| `ADMIN` | Everything USER can do + create/manage problems |

---

## 📝 Git Flow

```
main
└── dev
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
  "next-themes": "^0.4.6"
}
```

---

## 🙏 Acknowledgements

- [Apna College](https://www.apnacollege.in/) — Course curriculum
- [Judge0](https://judge0.com/) — Code execution engine
- [Clerk](https://clerk.com/) — Authentication
- [shadcn/ui](https://ui.shadcn.com/) — UI components
- [Monaco Editor](https://microsoft.github.io/monaco-editor/) — Code editor

---

## 👨‍💻 Author

**Rifaz Shaikh**
- GitHub: [@rifaz07](https://github.com/rifaz07)
- Project: [CodeArena](https://github.com/rifaz07/codearena)

---

⭐ If you found this project helpful, please give it a star on GitHub!