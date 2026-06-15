import { useState, useEffect } from 'react'
import { Link, NavLink, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Menu, X, Brain } from 'lucide-react'
import { useTheme } from '../../context/ThemeContext'
import ThemeToggle from '../ui/ThemeToggle'

const NAV_LINKS = [
  { label: 'Home',        to: '/'            },
  { label: 'Assessments', to: '/assessments' },
  { label: 'Dashboard',   to: '/dashboard'   },
  { label: 'About',       to: '/about'       },
]

const drawerVariants = {
  hidden:  { opacity: 0, height: 0 },
  visible: { opacity: 1, height: 'auto', transition: { duration: 0.28, ease: [0.4, 0, 0.2, 1] } },
  exit:    { opacity: 0, height: 0,      transition: { duration: 0.2 } },
}

const linkItemVariants = {
  hidden:  { opacity: 0, x: -10 },
  visible: (i) => ({ opacity: 1, x: 0, transition: { delay: i * 0.05, duration: 0.2 } }),
}

export default function Navbar() {
  const navigate = useNavigate()
  const [scrolled,    setScrolled]    = useState(false)
  const [mobileOpen,  setMobileOpen]  = useState(false)

  /* scroll shadow */
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  /* close drawer on desktop resize */
  useEffect(() => {
    const onResize = () => { if (window.innerWidth >= 768) setMobileOpen(false) }
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [])

  /* lock scroll when drawer open */
  useEffect(() => {
    document.body.style.overflow = mobileOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [mobileOpen])

  const navBg = scrolled
    ? 'bg-white/90 dark:bg-[#08081A]/90 backdrop-blur-xl shadow-sm border-b border-gray-200/70 dark:border-gray-700/40'
    : 'bg-white/70 dark:bg-[#08081A]/70 backdrop-blur-md'

  const navLinkClass = ({ isActive }) => [
    'relative text-sm font-medium transition-colors duration-200 pb-0.5',
    'after:absolute after:bottom-0 after:left-0 after:h-[2px] after:rounded-full after:transition-all after:duration-300',
    isActive
      ? 'text-primary dark:text-primaryDark after:w-full after:bg-primary dark:after:bg-primaryDark'
      : 'text-gray-600 dark:text-gray-300 hover:text-primary dark:hover:text-primaryDark after:w-0 hover:after:w-full after:bg-primary dark:after:bg-primaryDark',
  ].join(' ')

  const mobileLinkClass = ({ isActive }) => [
    'block w-full text-left px-4 py-3 rounded-xl text-sm font-medium transition-colors duration-200',
    isActive
      ? 'bg-primary/10 dark:bg-primaryDark/15 text-primary dark:text-primaryDark font-semibold'
      : 'text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800',
  ].join(' ')

  return (
    <header
      id="main-navbar"
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${navBg}`}
    >
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">

          {/* Logo */}
          <Link
            to="/"
            id="navbar-logo"
            className="flex items-center gap-2 flex-shrink-0"
            onClick={() => setMobileOpen(false)}
          >
            <div className="w-8 h-8 rounded-xl bg-primary dark:bg-primaryDark flex items-center justify-center">
              <Brain size={18} className="text-white" strokeWidth={2} />
            </div>
            <span className="text-base font-extrabold text-gray-900 dark:text-white tracking-tight">
              Mind<span className="text-primary dark:text-primaryDark">Metric</span>
            </span>
          </Link>

          {/* Desktop nav */}
          <ul className="hidden md:flex items-center gap-8">
            {NAV_LINKS.map(({ label, to }) => (
              <li key={to}>
                <NavLink to={to} className={navLinkClass} end={to === '/'}>
                  {label}
                </NavLink>
              </li>
            ))}
          </ul>

          {/* Desktop actions */}
          <div className="hidden md:flex items-center gap-3">
            <ThemeToggle />
            <button
              id="navbar-get-started"
              onClick={() => navigate('/assessments')}
              className="px-5 py-2 rounded-full text-sm font-semibold bg-primary dark:bg-primaryDark text-white hover:opacity-90 active:scale-95 shadow-md shadow-primary/25 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:ring-offset-2"
            >
              Get Started
            </button>
          </div>

          {/* Mobile: ThemeToggle + Hamburger */}
          <div className="flex md:hidden items-center gap-2">
            <ThemeToggle />
            <button
              id="navbar-hamburger"
              onClick={() => setMobileOpen(p => !p)}
              aria-expanded={mobileOpen}
              aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
              className="w-9 h-9 flex items-center justify-center rounded-xl text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            >
              <AnimatePresence mode="wait" initial={false}>
                {mobileOpen
                  ? <motion.span key="x"  initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }} transition={{ duration: 0.15 }}><X    size={20} /></motion.span>
                  : <motion.span key="mn" initial={{ rotate:  90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate:-90, opacity: 0 }} transition={{ duration: 0.15 }}><Menu size={20} /></motion.span>
                }
              </AnimatePresence>
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile drawer */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            id="mobile-drawer"
            variants={drawerVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="md:hidden overflow-hidden bg-white/97 dark:bg-[#08081A]/97 backdrop-blur-xl border-b border-gray-200/60 dark:border-gray-700/40 shadow-xl"
          >
            <div className="max-w-7xl mx-auto px-4 pb-5 pt-2 space-y-1">
              {NAV_LINKS.map(({ label, to }, i) => (
                <motion.div key={to} custom={i} variants={linkItemVariants} initial="hidden" animate="visible">
                  <NavLink to={to} end={to === '/'} className={mobileLinkClass} onClick={() => setMobileOpen(false)}>
                    {label}
                  </NavLink>
                </motion.div>
              ))}
              <div className="h-px bg-gray-200 dark:bg-gray-700/60 my-3" />
              <motion.div custom={NAV_LINKS.length} variants={linkItemVariants} initial="hidden" animate="visible">
                <button
                  id="mobile-get-started"
                  onClick={() => { setMobileOpen(false); navigate('/assessments') }}
                  className="w-full py-3 rounded-xl text-sm font-bold bg-primary dark:bg-primaryDark text-white hover:opacity-90 active:scale-95 shadow-md transition-all duration-200"
                >
                  Get Started
                </button>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}
