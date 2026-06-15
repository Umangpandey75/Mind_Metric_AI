import { Sun, Moon } from 'lucide-react'
import { useTheme } from '../../context/ThemeContext'

function ThemeToggle({ className = '' }) {
  const { theme, toggleTheme } = useTheme()
  const isDark = theme === 'dark'

  return (
    <button
      id="theme-toggle-btn"
      onClick={toggleTheme}
      aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
      title={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
      className={[
        'relative inline-flex items-center justify-center',
        'w-10 h-10 rounded-full',
        'bg-cardLight dark:bg-cardDark',
        'border border-gray-200 dark:border-gray-700',
        'text-gray-600 dark:text-gray-300',
        'hover:bg-primary/10 dark:hover:bg-primaryDark/20',
        'hover:text-primary dark:hover:text-primaryDark',
        'hover:border-primary/40 dark:hover:border-primaryDark/40',
        'transition-all duration-300 ease-in-out',
        'shadow-sm hover:shadow-md',
        'focus:outline-none focus:ring-2 focus:ring-primary/50 dark:focus:ring-primaryDark/50',
        className,
      ].join(' ')}
    >
      {/* Sun icon — visible in dark mode to switch to light */}
      <Sun
        size={18}
        className={[
          'absolute transition-all duration-300',
          isDark
            ? 'opacity-100 rotate-0 scale-100'
            : 'opacity-0 rotate-90 scale-75',
        ].join(' ')}
        aria-hidden="true"
      />

      {/* Moon icon — visible in light mode to switch to dark */}
      <Moon
        size={18}
        className={[
          'absolute transition-all duration-300',
          isDark
            ? 'opacity-0 -rotate-90 scale-75'
            : 'opacity-100 rotate-0 scale-100',
        ].join(' ')}
        aria-hidden="true"
      />
    </button>
  )
}

export default ThemeToggle
