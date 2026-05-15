import { useNavigate } from 'react-router-dom'
import DashboardLayout from '../../components/DashboardLayout'

const NAV = [
  { path: '/startup/dashboard',    label: 'Dashboard'       },
  { path: '/startup/profile',      label: 'My Profile'      },
  { path: '/startup/programs',     label: 'Programs'        },
  { path: '/startup/applications', label: 'My Applications' },
  { path: '/startup/investors',    label: 'Investors'       },
  { path: '/startup/resources',    label: 'Resources'       },
]

const GUIDES = [
  {
    icon: '📋',
    title: 'How to Complete Your Profile',
    desc: 'A step-by-step guide to filling out your startup profile for maximum visibility and approval.',
    color: '#28C3BE',
  },
  {
    icon: '📝',
    title: 'Applying to Programs',
    desc: 'Learn how to find the right program, prepare your application, and submit it successfully.',
    color: '#056EDC',
  },
  {
    icon: '📊',
    title: 'Pitch Deck Best Practices',
    desc: 'Tips on creating a compelling pitch deck that resonates with investors and reviewers.',
    color: '#FFC300',
  },
  {
    icon: '🤝',
    title: 'Connecting with Investors',
    desc: 'How to make the most of the investor directory and initiate meaningful connections.',
    color: '#FF8700',
  },
]

const LINKS = [
  {
    category: 'Government & Policy',
    items: [
      { label: 'Ministry of Innovation and Technology (MInT)', url: 'https://www.mint.gov.et' },
      { label: 'Ethiopian Startup Act', url: 'https://www.mint.gov.et' },
      { label: 'National Digital Transformation Strategy', url: 'https://www.mint.gov.et' },
    ],
  },
  {
    category: 'Funding & Investment',
    items: [
      { label: 'KOICA Ethiopia ICT Innovation Center', url: 'https://www.koica.go.kr' },
      { label: 'African Development Bank — Startup Fund', url: 'https://www.afdb.org' },
      { label: 'Seedstars Africa', url: 'https://www.seedstars.com' },
    ],
  },
  {
    category: 'Learning & Development',
    items: [
      { label: 'Google for Startups Africa', url: 'https://startup.google.com' },
      { label: 'Coursera — Entrepreneurship Courses', url: 'https://www.coursera.org' },
      { label: 'Ycombinator Startup School', url: 'https://www.startupschool.org' },
    ],
  },
]

const CONTACTS = [
  { label: 'General Support',    value: 'support@innobiz-k.et',   icon: '✉️' },
  { label: 'Program Inquiries',  value: 'programs@innobiz-k.et',  icon: '📋' },
  { label: 'Technical Help',     value: 'tech@innobiz-k.et',      icon: '🛠️' },
  { label: 'Phone',              value: '+251 11 XXX XXXX',        icon: '📞' },
]

function SectionTitle({ children }) {
  return (
    <h2 className="text-base font-bold text-ink-black mb-4 flex items-center gap-2">
      <span className="w-1 h-5 rounded-full inline-block" style={{ backgroundColor: '#28C3BE' }} />
      {children}
    </h2>
  )
}

export default function StartupResources() {
  const navigate = useNavigate()

  return (
    <DashboardLayout navItems={NAV} hubLabel="Startup Hub">
      <div className="max-w-4xl space-y-8">

        {/* Header */}
        <div className="flex items-center gap-3">
          <button onClick={() => navigate('/startup/dashboard')} className="text-gray-400 hover:text-ink-black transition-colors">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="15 18 9 12 15 6"/>
            </svg>
          </button>
          <div>
            <h1 className="text-xl font-bold text-ink-black">Resources</h1>
            <p className="text-xs text-gray-400">Guides, links, and support for your startup journey</p>
          </div>
        </div>

        {/* Getting Started Guides */}
        <div>
          <SectionTitle>Getting Started</SectionTitle>
          <div className="grid grid-cols-2 gap-4">
            {GUIDES.map((g) => (
              <div
                key={g.title}
                className="bg-white rounded-xl p-5 shadow-sm flex gap-4 items-start"
                style={{ borderLeft: `4px solid ${g.color}` }}
              >
                <span className="text-2xl flex-shrink-0">{g.icon}</span>
                <div>
                  <p className="font-semibold text-ink-black text-sm">{g.title}</p>
                  <p className="text-xs text-gray-500 mt-1 leading-relaxed">{g.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Useful Links */}
        <div>
          <SectionTitle>Useful Links</SectionTitle>
          <div className="grid grid-cols-3 gap-4">
            {LINKS.map((section) => (
              <div key={section.category} className="bg-white rounded-xl p-5 shadow-sm">
                <p className="text-xs font-semibold uppercase tracking-wide mb-3" style={{ color: '#28C3BE' }}>
                  {section.category}
                </p>
                <ul className="space-y-2">
                  {section.items.map((item) => (
                    <li key={item.label}>
                      <a
                        href={item.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-gray-600 hover:text-ink-black flex items-start gap-1.5 group"
                      >
                        <span className="mt-0.5 flex-shrink-0" style={{ color: '#28C3BE' }}>→</span>
                        <span className="group-hover:underline">{item.label}</span>
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* FAQ */}
        <div>
          <SectionTitle>Frequently Asked Questions</SectionTitle>
          <div className="bg-white rounded-xl shadow-sm divide-y divide-gray-50">
            {[
              { q: 'How long does profile approval take?', a: 'Admin review typically takes 2–5 business days. You will be notified once a decision is made.' },
              { q: 'Can I apply to multiple programs?', a: 'Yes. You can apply to as many open programs as you are eligible for, one application per program.' },
              { q: 'What happens after my application is submitted?', a: 'Your application moves to UNDER_REVIEW status. Assigned reviewers will evaluate it and staff admins make the final decision.' },
              { q: 'Can I edit my profile after approval?', a: 'Approved profiles cannot be edited directly. Contact support or your admin to request changes.' },
              { q: 'How do I connect with investors?', a: 'Once your profile is approved it appears in the public directory. Investors can discover and reach out to you through the platform.' },
            ].map(({ q, a }) => (
              <div key={q} className="px-5 py-4">
                <p className="text-sm font-semibold text-ink-black">{q}</p>
                <p className="text-sm text-gray-500 mt-1">{a}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Contact Support */}
        <div>
          <SectionTitle>Contact & Support</SectionTitle>
          <div className="grid grid-cols-4 gap-4">
            {CONTACTS.map((c) => (
              <div key={c.label} className="bg-white rounded-xl p-4 shadow-sm text-center">
                <span className="text-2xl">{c.icon}</span>
                <p className="text-xs text-gray-400 mt-2">{c.label}</p>
                <p className="text-sm font-medium text-ink-black mt-0.5 break-all">{c.value}</p>
              </div>
            ))}
          </div>
        </div>

      </div>
    </DashboardLayout>
  )
}
