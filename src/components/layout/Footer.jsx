import { Link } from 'react-router-dom'
import { Brain, Heart, ShieldCheck } from 'lucide-react'

const NAV_COLS = [
  {
    heading: 'Assessments',
    items: [
      { label: 'Big Five Personality', to: '/assessments/big-five' },
      { label: 'PHQ-9 Depression',     to: '/assessments/phq-9' },
      { label: 'GAD-7 Anxiety',        to: '/assessments/gad-7' },
      { label: 'Self-Esteem Scale',    to: '/assessments/rosenberg-self-esteem' },
      { label: 'Attachment Style',     to: '/assessments/attachment-style' },
    ],
  },
  {
    heading: 'Explore',
    items: [
      { label: 'All Assessments', to: '/assessments' },
      { label: 'My Dashboard',    to: '/dashboard'   },
      { label: 'About Us',        to: '/about'       },
    ],
  },
  {
    heading: 'Legal',
    items: [
      { label: 'Privacy Policy',  to: '/privacy'    },
      { label: 'Terms of Use',    to: '/terms'      },
      { label: 'Disclaimer',      to: '/disclaimer' },
    ],
  },
]

const BADGES = [
  { Icon: Brain,       label: 'Evidence-based'  },
  { Icon: Heart,       label: 'For everyone'    },
  { Icon: ShieldCheck, label: 'Always private'  },
]

export default function Footer() {
  const year = new Date().getFullYear()

  return (
    <footer id="main-footer" className="bg-white dark:bg-cardDark border-t border-gray-200 dark:border-gray-800/60 mt-auto">

      {/* Main grid */}
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 pt-14 pb-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">

          {/* Brand — spans 2 cols on large screens */}
          <div className="lg:col-span-2 flex flex-col gap-5">
            <Link to="/" className="inline-flex items-center gap-2 w-fit">
              <div className="w-8 h-8 rounded-xl bg-primary dark:bg-primaryDark flex items-center justify-center">
                <Brain size={17} className="text-white" strokeWidth={2} />
              </div>
              <span className="text-base font-extrabold text-gray-900 dark:text-white tracking-tight">
                Mind<span className="text-primary dark:text-primaryDark">Metric</span>
              </span>
            </Link>

            <p className="text-sm leading-relaxed text-gray-500 dark:text-gray-400 max-w-xs">
              Free, research-backed psychological assessments — designed to help you understand yourself, not overwhelm you.
            </p>

            <div className="flex flex-wrap gap-2">
              {BADGES.map(({ Icon, label }) => (
                <span
                  key={label}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold bg-primary/8 dark:bg-primaryDark/10 text-primary dark:text-primaryDark border border-primary/15 dark:border-primaryDark/20"
                >
                  <Icon size={11} strokeWidth={2.2} />
                  {label}
                </span>
              ))}
            </div>
          </div>

          {/* Link columns */}
          {NAV_COLS.map(({ heading, items }) => (
            <div key={heading} className="flex flex-col gap-4">
              <h3 className="text-xs font-bold uppercase tracking-widest text-gray-400 dark:text-gray-500">{heading}</h3>
              <ul className="flex flex-col gap-2.5">
                {items.map(({ label, to }) => (
                  <li key={label}>
                    <Link
                      to={to}
                      className="text-sm text-gray-600 dark:text-gray-400 hover:text-primary dark:hover:text-primaryDark transition-colors duration-200"
                    >
                      {label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* Divider */}
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
        <div className="h-px bg-gradient-to-r from-transparent via-gray-200 dark:via-gray-700/60 to-transparent" />
      </div>

      {/* Bottom bar */}
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 py-5 flex flex-col sm:flex-row items-center justify-between gap-3">
        <p className="text-xs text-gray-400 dark:text-gray-500">
          © {year} MindMetric · For educational purposes only · Not a clinical service
        </p>
        <div className="flex items-center gap-4">
          <Link to="/privacy"    className="text-xs text-gray-400 dark:text-gray-500 hover:text-primary dark:hover:text-primaryDark transition-colors">Privacy</Link>
          <Link to="/terms"      className="text-xs text-gray-400 dark:text-gray-500 hover:text-primary dark:hover:text-primaryDark transition-colors">Terms</Link>
          <Link to="/disclaimer" className="text-xs text-gray-400 dark:text-gray-500 hover:text-primary dark:hover:text-primaryDark transition-colors">Disclaimer</Link>
        </div>
      </div>

      {/* Disclaimer strip */}
      <div className="bg-amber-50 dark:bg-amber-950/20 border-t border-amber-100 dark:border-amber-900/30">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 py-3 flex items-start gap-2.5">
          <ShieldCheck size={13} className="flex-shrink-0 mt-0.5 text-amber-500" strokeWidth={2.2} />
          <p className="text-xs leading-relaxed text-amber-700 dark:text-amber-400/80">
            <span className="font-semibold">For your wellbeing: </span>
            MindMetric is for personal learning and self-awareness — not clinical diagnosis. If you are struggling, please reach out to a mental health professional.{' '}
            <Link to="/disclaimer" className="underline underline-offset-2 hover:text-amber-900 dark:hover:text-amber-300 transition-colors">
              Read our full disclaimer
            </Link>
          </p>
        </div>
      </div>

    </footer>
  )
}
