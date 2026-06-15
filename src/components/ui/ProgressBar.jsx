import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import { clsx } from 'clsx'

// ── Color map ───────────────────────────────────────────────────────────────
const COLOR = {
  indigo: 'bg-primary dark:bg-primaryDark',
  purple: 'bg-accent',
  green:  'bg-emerald-500 dark:bg-emerald-400',
  yellow: 'bg-gold',
  red:    'bg-red-500 dark:bg-red-400',
  gray:   'bg-gray-400 dark:bg-gray-500',
  blue:   'bg-blue-500 dark:bg-blue-400',
}

// ── Height map ──────────────────────────────────────────────────────────────
const HEIGHT = {
  xs:  'h-1',
  sm:  'h-1.5',
  md:  'h-2.5',
  lg:  'h-4',
  xl:  'h-6',
}

// ── Component ───────────────────────────────────────────────────────────────
export default function ProgressBar({
  value       = 0,
  color       = 'indigo',
  height      = 'md',
  animated    = true,
  showLabel   = false,
  label       = '',
  className   = '',
  trackClass  = '',
  id,
}) {
  // Clamp value between 0–100
  const pct = Math.min(100, Math.max(0, value))

  // Trigger animation once when bar scrolls into view
  const ref    = useRef(null)
  const inView = useInView(ref, { once: true, margin: '0px 0px -40px 0px' })

  const fillStyle = animated
    ? { width: inView ? `${pct}%` : '0%' }
    : { width: `${pct}%` }

  const transition = animated
    ? { duration: 1, ease: [0.4, 0, 0.2, 1], delay: 0.1 }
    : { duration: 0 }

  return (
    <div id={id} className={clsx('w-full', className)}>
      {/* Optional label row */}
      {(showLabel || label) && (
        <div className="flex items-center justify-between mb-1.5">
          {label && (
            <span className="text-xs font-medium text-gray-600 dark:text-gray-400">
              {label}
            </span>
          )}
          {showLabel && (
            <span className="text-xs font-semibold text-gray-700 dark:text-gray-300 ml-auto">
              {pct}%
            </span>
          )}
        </div>
      )}

      {/* Track */}
      <div
        ref={ref}
        role="progressbar"
        aria-valuenow={pct}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label={label || `Progress: ${pct}%`}
        className={clsx(
          'w-full overflow-hidden rounded-full',
          'bg-gray-200 dark:bg-gray-700/60',
          HEIGHT[height] ?? HEIGHT.md,
          trackClass,
        )}
      >
        {/* Fill */}
        <motion.div
          className={clsx(
            'h-full rounded-full',
            COLOR[color] ?? COLOR.indigo,
          )}
          initial={{ width: '0%' }}
          animate={fillStyle}
          transition={transition}
        />
      </div>
    </div>
  )
}
