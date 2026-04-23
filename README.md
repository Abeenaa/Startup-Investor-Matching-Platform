# Innobiz-K Ethiopia: Startup-Investor Matching Platform

###  Vision
Innobiz-K Ethiopia is the nation's premier incubation center. This platform serves as the digital bridge between high-potential Ethiopian startups and global/local investors, fostering a transparent, data-driven, and scalable entrepreneurship ecosystem.

---

## 🛠 Tech Stack (2026 Enterprise Standard)
- **Frontend:** [React.js](https://reactjs.org/) + [Tailwind CSS](https://tailwindcss.com/)
- **Backend:** [Node.js](https://nodejs.org/) + [Express.js](https://expressjs.com/)
- **Database:** [PostgreSQL](https://www.postgresql.org/) (Powered by [Supabase](https://supabase.com/))
- **Authentication:** Supabase Auth (JWT & Role-Based Access Control)
- **State Management:** React Context API / TanStack Query
- **Deployment:** Vercel (Frontend) & Railway/Render (Backend)

---

## ✨ Key Features
- **Verified Startup Directory:** A curated list of startups vetted by the Innobiz-K management team.
- **Investor Discovery Engine:** Advanced filtering for investors based on sector, ticket size, and startup stage.
- **Admin Control Center:** A robust "Gatekeeper" dashboard for Innobiz-K staff to approve profiles and monitor platform health.
- **Facilitated Matchmaking:** A double opt-in introduction system to ensure high-quality founder-investor connections.
- **Impact Scoreboard:** Real-time tracking of KPIs, including total capital mobilized and jobs created within the ecosystem.

---

## 🏗 Project Architecture
The project follows a **Monorepo-style** structure for simplicity during the 6-week sprint:

```text
/
├── client/             # React + Tailwind (Frontend)
│   ├── src/components/ # Reusable UI atoms
│   ├── src/pages/      # Feature views (Admin, Startup, Investor)
│   └── src/hooks/      # Custom Supabase integration hooks
├── server/             # Node.js + Express (API Layer)
│   ├── controllers/    # Business logic
│   ├── routes/         # API endpoints
│   └── middleware/     # Auth & Role verification
└── docs/               # SRS, UI Designs, and Meeting Minutes
```

---

## 🔒 Security & Performance
- **Row Level Security (RLS):** Database-level protection ensuring users only access authorized data.
- **Middleware Protection:** All API routes are guarded by JWT verification via Node.js.
- **Scalability:** Optimized PostgreSQL indexing for fast search and discovery across thousands of profiles.

---

## 🚀 Getting Started

### 1. Prerequisites
- Node.js (v18+)
- npm or yarn
- A Supabase Project URL and Anon Key

### 2. Installation
```bash
# Clone the repository
git clone https://github.com/your-username/innobiz-k-platform.git

# Install Client dependencies
cd client && npm install

# Install Server dependencies
cd ../server && npm install
```

### 3. Environment Variables
Create a `.env` file in both `/client` and `/server` folders:
```env
SUPABASE_URL=your_supabase_url
SUPABASE_KEY=your_supabase_anon_key
```

### 4. Running the Project
```bash
# Run Frontend (from /client)
npm run dev

# Run Backend (from /server)
npm start
```

---

## 🤝 Contribution Guidelines
1. **Branching:** Create a feature branch for every task (`git checkout -b feature/feature-name`).
2. **Commits:** Use descriptive commit messages (`feat: add investor filter logic`).
3. **Pull Requests:** All code must be reviewed and approved before merging into `main`.

---

© 2026 Innobiz-K Ethiopia Project Team. Supported by the Ministry of Innovation and Technology (MInT).
