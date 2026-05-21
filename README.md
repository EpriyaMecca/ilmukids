<div align="center">

# 🕌 IlmuKids
### Gamified Islamic Learning Platform for Elementary Students

[![Next.js](https://img.shields.io/badge/Next.js-16.2-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-4.0-38B2AC?style=for-the-badge&logo=tailwind-css)](https://tailwindcss.com/)
[![Supabase](https://img.shields.io/badge/Supabase-Database-green?style=for-the-badge&logo=supabase)](https://supabase.com/)
[![Vercel](https://img.shields.io/badge/Deployed-Vercel-black?style=for-the-badge&logo=vercel)](https://ilmukids.vercel.app)

**[🚀 Live Demo](https://ilmukids.vercel.app)** • **[📱 Try as Student](#demo-accounts)** • **[👨‍🏫 Try as Teacher](#demo-accounts)**

![IlmuKids Banner](https://placehold.co/1200x400/22c55e/white?text=IlmuKids+%7C+Gamified+Islamic+Learning)

</div>

---

## 📖 About This Project

**IlmuKids** is a full-stack gamified Islamic education platform built for Indonesian elementary students (Grade 4–6). Inspired by Duolingo, Quizizz, and Khan Academy Kids, it transforms Islamic learning into an engaging game-like experience.

> Built as a **portfolio project** to demonstrate full-stack development skills for remote work opportunities.

### 🎯 Problem It Solves
- Traditional Islamic education is often passive and boring for kids
- Teachers lack digital tools to create interactive Islamic content
- No gamified platform specifically designed for Indonesian Islamic curriculum

### 💡 Solution
A platform where teachers create quizzes, students earn XP, level up, and compete on leaderboards — all while learning Al-Quran, Hadith, and Islamic values.

---

## ✨ Key Features

### 👦 For Students
| Feature | Description |
|---------|-------------|
| 🎮 **Interactive Quiz** | Multiple choice with timer, streak combo, instant feedback |
| 🧠 **Memory Card Game** | Match dzikir with meanings, flip animations |
| ⭐ **XP & Level System** | Earn XP, level up, unlock badges |
| 🏆 **Leaderboard** | Global & per-class rankings |
| 📊 **Progress Dashboard** | Track learning progress, badge collection |
| 🌙 **Dark Mode** | Easy on the eyes for night learning |

### 👨‍🏫 For Teachers
| Feature | Description |
|---------|-------------|
| 📝 **Quiz Builder** | Create multi-question quizzes with explanations |
| 👦 **Student Management** | Add students, auto-generate credentials |
| 📈 **Progress Monitoring** | Track student XP and quiz results |
| 🎯 **Class Targeting** | Assign quizzes to specific grade levels |

---

## 🛠️ Tech Stack

```
Frontend          Backend           Database          Tools
─────────         ───────           ────────          ─────
Next.js 16        Supabase Auth     PostgreSQL        Vercel (Deploy)
TypeScript        Supabase API      Row Level         GitHub Actions
Tailwind CSS v4   REST API          Security          Framer Motion
React 19                            Real-time         next-themes
```

### Architecture Decisions
- **Next.js App Router** — Modern routing with server components
- **Supabase RLS** — Row-level security ensures teachers only see their own data
- **TypeScript** — Type safety across the entire codebase
- **Tailwind v4** — Latest utility-first CSS with custom dark mode variants

---

## 🗄️ Database Schema

```
auth.users (Supabase Auth)
    │
    ├── siswa (students)
    │     ├── username, password_plain
    │     ├── kelas (grade), xp, level
    │     └── auth_id → auth.users
    │
    ├── quiz
    │     ├── judul_quiz, deskripsi
    │     ├── total_xp, waktu_menit
    │     └── guru_id → auth.users
    │
    ├── soal_quiz (questions)
    │     └── quiz_id → quiz
    │
    ├── pilihan_jawaban (answer choices)
    │     └── soal_id → soal_quiz
    │
    └── hasil_quiz (results)
          ├── siswa_id, quiz_id
          ├── skor, xp_didapat
          └── UNIQUE(siswa_id, quiz_id) — prevents XP farming
```

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- Supabase account
- Git

### Installation

```bash
# Clone repository
git clone https://github.com/EpriyaMecca/ilmukids.git
cd ilmukids

# Install dependencies
npm install

# Setup environment variables
cp .env.example .env.local
# Fill in your Supabase URL and anon key

# Run development server
npm run dev
```

### Environment Variables

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

---

## 🎮 Demo Accounts

| Role | Username/Email | Password |
|------|---------------|----------|
| 👨‍🏫 Teacher | guru@ilmukids.com | ilmukids123 |
| 👦 Student | ahmad_demo | belajar123 |

> ⚠️ Demo accounts are read-only. Please don't change passwords.

---

## 📱 Screenshots

### Landing Page
> Modern hero section with Framer Motion animations

### Student Dashboard  
> XP progress, badge collection, available quizzes

### Interactive Quiz
> Timer, instant feedback, XP rewards

### Memory Card Game
> Flip animations, match dzikir with meanings

### Leaderboard
> Global & class rankings with podium display

### Teacher Dashboard
> Student management, quiz builder

---

## 🏗️ Project Structure

```
ilmukids/
├── src/
│   ├── app/                    # Next.js App Router pages
│   │   ├── dashboard/
│   │   │   ├── guru/           # Teacher dashboard
│   │   │   └── siswa/          # Student dashboard
│   │   ├── games/
│   │   │   └── memory-card/    # Memory card game
│   │   ├── quiz/[id]/          # Dynamic quiz page
│   │   ├── leaderboard/        # Rankings page
│   │   ├── login/              # Auth pages
│   │   ├── register/
│   │   └── reset-password/
│   ├── components/
│   │   ├── layout/             # Navbar, Sidebar, Wrappers
│   │   └── ui/                 # Reusable UI components
│   ├── hooks/                  # Custom React hooks
│   └── lib/                    # Supabase client, utilities
├── public/
│   └── sounds/                 # Quiz sound effects
└── ...config files
```

---

## 🎯 What I Learned Building This

- **Full-stack development** with Next.js App Router and Supabase
- **Database design** with relational tables and Row Level Security
- **Authentication flows** — different UX for teachers vs students
- **Game design patterns** — XP systems, leaderboards, anti-farming logic
- **State management** — complex game states without external libraries
- **Framer Motion** — smooth animations for better UX
- **GitHub workflow** — branches, PRs, conventional commits

---

## 🗺️ Roadmap

- [ ] Drag & Drop game (match Asmaul Husna)
- [ ] Puzzle logic game (maze to masjid)
- [ ] Push notifications for daily reminders
- [ ] Parent dashboard
- [ ] Offline mode with PWA
- [ ] Multi-language support (Arabic, English)

---

## 👨‍💻 About the Developer

Built by **EpriyaMecca** as a portfolio project to demonstrate frontend engineering skills for remote work opportunities.

- 🌐 Deployed: [ilmukids.vercel.app](https://ilmukids.vercel.app)
- 📧 Contact: [meccaprogrammerhandal@gmail.com]
- 💼 LinkedIn: [https://www.linkedin.com/in/epriya-mecca-040b42265/]

---

<div align="center">

**If you find this project interesting, please give it a ⭐**

*Built with ❤️ for Islamic education in Indonesia*

</div>