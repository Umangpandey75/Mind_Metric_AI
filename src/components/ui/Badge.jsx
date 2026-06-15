import { clsx } from 'clsx'

// ── Color variants ──────────────────────────────────────────────────────────
const COLOR = {
  indigo: 'bg-indigo-100  dark:bg-indigo-900/30  text-indigo-700  dark:text-indigo-300  border-indigo-200  dark:border-indigo-700/50',
  green:  'bg-green-100   dark:bg-green-900/30   text-green-700   dark:text-green-300   border-green-200   dark:border-green-700/50',
  yellow: 'bg-yellow-100  dark:bg-yellow-900/30  text-yellow-700  dark:text-yellow-300  border-yellow-200  dark:border-yellow-700/50',
  red:    'bg-red-100     dark:bg-red-900/30     text-red-700     dark:text-red-300     border-red-200     dark:border-red-700/50',
  gray:   'bg-gray-100    dark:bg-gray-800/60    text-gray-600    dark:text-gray-400    border-gray-200    dark:border-gray-700/50',
  purple: 'bg-purple-100  dark:bg-purple-900/30  text-purple-700  dark:text-purple-300  border-purple-200  dark:border-purple-700/50',
  gold:   'bg-amber-100   dark:bg-amber-900/30   text-amber-700   dark:text-amber-300   border-amber-200   dark:border-amber-700/50',
}

const SIZE = {
  sm: 'px-2 py-0.5 text-[10px] rounded-md',
  md: 'px-2.5 py-1 text-xs rounded-lg',
  lg: 'px-3 py-1.5 text-sm rounded-xl',
}

// ── Component ───────────────────────────────────────────────────────────────
export default function Badge({
  text,
  color     = 'indigo',
  size      = 'md',
  dot       = false,
  className = '',
  id,
}) {
  return (
    <span
      id={id}
      className={clsx(
        'inline-flex items-center gap-1.5 font-semibold border',
        'leading-none tracking-wide',
        COLOR[color] ?? COLOR.gray,
        SIZE[size]  ?? SIZE.md,
        className,
      )}
    >
      {/* Optional status dot */}
      {dot && (
        <span
          className={clsx(
            'w-1.5 h-1.5 rounded-full flex-shrink-0',
            // Match dot color to text color via currentColor trick
            'bg-current opacity-80',
          )}
          aria-hidden="true"
        />
      )}
      {text}
    </span>
  )
}
