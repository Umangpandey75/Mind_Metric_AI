import { clsx } from 'clsx'
import { Loader2 } from 'lucide-react'

// ── Style maps ──────────────────────────────────────────────────────────────
const VARIANT = {
  primary: [
    'bg-primary text-white',
    'hover:bg-accent hover:shadow-lg hover:shadow-primary/25',
    'active:scale-[0.97]',
    'focus:ring-primary/50',
    'dark:bg-primaryDark dark:hover:bg-accent dark:hover:shadow-primaryDark/25',
    'disabled:bg-primary/50 dark:disabled:bg-primaryDark/40',
  ],
  secondary: [
    'bg-cardLight dark:bg-cardDark text-gray-800 dark:text-gray-100',
    'border border-gray-200 dark:border-gray-700',
    'hover:border-primary/50 dark:hover:border-primaryDark/50',
    'hover:bg-primary/5 dark:hover:bg-primaryDark/10',
    'hover:text-primary dark:hover:text-primaryDark',
    'active:scale-[0.97]',
    'focus:ring-primary/40',
    'disabled:opacity-50',
  ],
  outline: [
    'bg-transparent text-primary dark:text-primaryDark',
    'border-2 border-primary dark:border-primaryDark',
    'hover:bg-primary hover:text-white dark:hover:bg-primaryDark',
    'active:scale-[0.97]',
    'focus:ring-primary/40 dark:focus:ring-primaryDark/40',
    'disabled:opacity-50',
  ],
  ghost: [
    'bg-transparent text-gray-600 dark:text-gray-300',
    'hover:bg-gray-100 dark:hover:bg-gray-800',
    'hover:text-primary dark:hover:text-primaryDark',
    'active:scale-[0.97]',
    'focus:ring-gray-300 dark:focus:ring-gray-600',
    'disabled:opacity-40',
  ],
}

const SIZE = {
  small:  'px-3 py-1.5 text-xs rounded-lg  gap-1.5',
  medium: 'px-5 py-2.5 text-sm rounded-xl  gap-2',
  large:  'px-7 py-3.5 text-base rounded-2xl gap-2.5',
}

const SPINNER_SIZE = { small: 12, medium: 15, large: 18 }

// ── Component ───────────────────────────────────────────────────────────────
export default function Button({
  children,
  variant  = 'primary',
  size     = 'medium',
  loading  = false,
  disabled = false,
  onClick,
  type     = 'button',
  id,
  className = '',
  fullWidth = false,
  leftIcon,
  rightIcon,
}) {
  const isDisabled = disabled || loading

  return (
    <button
      id={id}
      type={type}
      onClick={onClick}
      disabled={isDisabled}
      className={clsx(
        // Base
        'inline-flex items-center justify-center font-semibold',
        'transition-all duration-200 ease-in-out select-none',
        'focus:outline-none focus:ring-2 focus:ring-offset-2',
        'dark:focus:ring-offset-surfaceDark',
        'disabled:cursor-not-allowed disabled:pointer-events-none',
        // Variant + size
        VARIANT[variant],
        SIZE[size],
        // Optional full-width
        fullWidth && 'w-full',
        className,
      )}
    >
      {/* Leading spinner when loading */}
      {loading && (
        <Loader2
          size={SPINNER_SIZE[size]}
          className="animate-spin flex-shrink-0"
          aria-hidden="true"
        />
      )}

      {/* Optional left icon (hidden while loading) */}
      {!loading && leftIcon && (
        <span className="flex-shrink-0">{leftIcon}</span>
      )}

      {children}

      {/* Optional right icon (hidden while loading) */}
      {!loading && rightIcon && (
        <span className="flex-shrink-0">{rightIcon}</span>
      )}
    </button>
  )
}
