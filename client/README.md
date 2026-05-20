# Innobiz-K Client Application

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation
```bash
npm install
```

### Development
```bash
npm run dev
```
Visit: http://localhost:3000

### Build for Production
```bash
npm run build
npm start
```

## 📁 Project Structure

```
client/
├── app/                      # Next.js App Router
│   ├── (public)/            # Public pages (login, signup, landing)
│   ├── (dashboard)/         # Protected dashboard pages
│   ├── globals.css          # Global styles & animations
│   └── layout.tsx           # Root layout
├── components/              # Reusable components
│   ├── dashboard/           # Dashboard-specific components
│   ├── landing/             # Landing page components
│   ├── ui/                  # UI components (buttons, cards, etc.)
│   └── dashboard-shell-optimized.tsx  # Main dashboard layout
├── lib/                     # Utilities
│   ├── api.ts              # API client
│   ├── session.ts          # Session management
│   └── utils.ts            # Helper functions
└── public/                  # Static assets
```

## 🔐 Authentication

### Login Flow
1. User enters credentials at `/login`
2. API returns user data + tokens
3. Session saved to localStorage
4. Redirect to role-specific dashboard

### Protected Routes
All dashboard routes check for valid session. If not authenticated, redirects to `/login`.

### Roles
- `STARTUP` → `/dashboard/startup`
- `INVESTOR` → `/dashboard/investor`
- `REVIEWER` → `/dashboard/reviewer`
- `STAFF_ADMIN` → `/dashboard/staff`
- `SYSTEM_ADMIN` → `/dashboard/system-admin`

## 🎨 Styling

### Tailwind CSS v4
- Using `@import "tailwindcss"` syntax
- Custom animations in `globals.css`
- Color scheme: Teal (#28C3BE), Blue (#056EDC), Yellow (#FFC300)

### Custom Classes
- `.stat-card` - Animated stat cards
- `.table-row-hover` - Smooth table row hover
- `.badge-animate` - Badge scale animation
- `.icon-hover` - Icon rotation on hover
- `.fade-in`, `.slide-in-left`, `.slide-in-right` - Entry animations
- `.stagger-item` - Sequential list animations

## 🔌 API Integration

### Base URL
Set in `.env.local`:
```
NEXT_PUBLIC_API_BASE_URL=http://localhost:5000/api
```

### API Client (`lib/api.ts`)
All API calls go through the `request()` function which:
- Adds authentication headers
- Handles token refresh
- Manages errors
- Returns typed responses

### Example Usage
```typescript
import { getDashboard, getPrograms } from '@/lib/api'

// Get dashboard data
const data = await getDashboard()

// Get programs list
const programs = await getPrograms()
```

## 📊 Dashboard Pages

### Startup Dashboard
- View applications
- Create/submit applications
- Manage profile
- View programs

### Investor Dashboard
- Discover startups
- View matches
- Manage portfolio
- Profile settings

### Reviewer Dashboard
- View assigned applications
- Submit evaluations
- Scoring guide
- Conflict management

### Staff Admin Dashboard
- Manage applications
- Manage programs
- Manage users
- View reports

### System Admin Dashboard
- System overview
- Database management
- Security settings
- Server monitoring

## 🎭 Components

### Dashboard Shell
Main layout component with:
- Sidebar navigation
- Top bar with title
- Mobile menu
- Logout functionality

Usage:
```tsx
<DashboardShell
  title="Dashboard"
  description="Overview"
  navItems={[...]}
  portalLabel="STARTUP PORTAL"
>
  {children}
</DashboardShell>
```

### Stat Cards
Display key metrics with animations:
```tsx
<div className="stat-card border-l-4 border-l-[#28C3BE]">
  <div className="flex items-start justify-between">
    <div>
      <p className="text-xs font-medium text-muted-foreground">Label</p>
      <p className="mt-2 text-3xl font-bold">{value}</p>
    </div>
    <Icon className="text-[#28C3BE] icon-hover" />
  </div>
</div>
```

## 🐛 Known Issues

1. **Type Safety**: Some API responses use `any` type - needs proper TypeScript interfaces
2. **Error Boundaries**: Not implemented - add React error boundaries
3. **Loading States**: Some pages could have better loading indicators
4. **Form Validation**: Client-side validation could be improved

## 🔧 Configuration Files

### `next.config.mjs`
- Turbopack enabled for dev
- Image optimization configured
- Environment variables setup

### `tailwind.config.ts`
- Custom colors
- Font configuration
- Plugin setup

### `tsconfig.json`
- Path aliases (`@/` → `./`)
- Strict mode enabled

## 📝 TODO for Frontend Team

### High Priority
- [ ] Add proper TypeScript types for all API responses
- [ ] Implement error boundaries
- [ ] Add form validation library (e.g., react-hook-form + zod)
- [ ] Add loading skeletons for all pages
- [ ] Add toast notifications for success/error messages

### Medium Priority
- [ ] Add unit tests (Jest + React Testing Library)
- [ ] Add E2E tests (Playwright or Cypress)
- [ ] Optimize images and assets
- [ ] Add SEO meta tags
- [ ] Implement dark mode

### Low Priority
- [ ] Add accessibility improvements (ARIA labels, keyboard navigation)
- [ ] Add analytics tracking
- [ ] Add performance monitoring
- [ ] Add PWA support

## 🚢 Deployment

### Environment Variables
Update `.env.local` for production:
```
NEXT_PUBLIC_API_BASE_URL=https://api.innobiz-k.com/api
```

### Build
```bash
npm run build
```

### Deploy to Vercel
```bash
vercel deploy
```

Or use GitHub integration for automatic deployments.

## 📞 Support

For questions or issues:
- Backend API: Check `server/README.md`
- Frontend: Review this README
- Issues: Create GitHub issue

## 🎯 Performance

### Current Optimizations
- ✅ Turbopack for faster dev builds
- ✅ Component memoization (Sidebar, StatCard)
- ✅ Optimized images with Next.js Image
- ✅ Code splitting with App Router
- ✅ CSS animations (hardware-accelerated)

### Lighthouse Scores (Target)
- Performance: >90
- Accessibility: >90
- Best Practices: >90
- SEO: >90

## 🔒 Security

- ✅ JWT tokens stored in localStorage
- ✅ Automatic token refresh
- ✅ Protected routes with session checks
- ✅ HTTPS required in production
- ⚠️ Add CSRF protection
- ⚠️ Add rate limiting on client

---

**Last Updated**: May 20, 2026
**Version**: 0.1.0
**Status**: Ready for frontend team review
