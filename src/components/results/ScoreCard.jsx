import { clsx } from 'clsx'
import { motion } from 'framer-motion'
import ProgressBar from '../ui/ProgressBar'

/* ── Level → color mapping ───────────────────────────────────────────────── */
const LEVEL_STYLES = {
  High:   { badge: 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-700/50', bar: 'green'  },
  Medium: { badge: 'bg-amber-100   dark:bg-amber-900/30   text-amber-700   dark:text-amber-300   border-amber-200   dark:border-amber-700/50',   bar: 'yellow' },
  Low:    { badge: 'bg-blue-100    dark:bg-blue-900/30    text-blue-700    dark:text-blue-300    border-blue-200    dark:border-blue-700/50',    bar: 'blue'   },
}

/* ── Derive level from score ─────────────────────────────────────────────── */
function deriveLevel(score) {
  if (score >= 67) return 'High'
  if (score >= 34) return 'Medium'
  return 'Low'
}

/* ── Component ──────────────────────────────────────────────────────────── */
export default function ScoreCard({
  trait,
  score,
  interpretationText = '',
  interpretationLabel = '',
  color = 'indigo',
  index = 0,
  className = '',
}) {
  const pct   = Math.round(Math.min(100, Math.max(0, score)))
  const level = interpretationLabel || deriveLevel(pct)
  const styles = LEVEL_STYLES[level] ?? LEVEL_STYLES.Medium

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.08, ease: 'easeOut' }}
      className={clsx(
        'bg-cardLight dark:bg-cardDark rounded-2xl p-5',
        'border border-gray-200/80 dark:border-gray-700/50',
        'hover:border-primary/30 dark:hover:border-primaryDark/30',
        'hover:-translate-y-0.5 hover:shadow-lg hover:shadow-primary/8',
        'transition-all duration-300',
        className,
      )}
    >
      {/* ── Header row ─────────────────────────────────────────────── */}
      <div className="flex items-start justify-between gap-3 mb-4">
        <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-200 leading-tight">
          {trait}
        </h3>

        {/* Level badge */}
        <span className={clsx(
          'flex-shrink-0 inline-flex items-center px-2 py-0.5 rounded-full',
          'text-[10px] font-semibold border leading-none',
          styles.badge,
        )}>
          {level}
        </span>
      </div>

      {/* ── Score number ───────────────────────────────────────────── */}
      <div className="flex items-end gap-1 mb-3">
        <span className="text-4xl font-extrabold leading-none text-gray-900 dark:text-white tabular-nums">
          {pct}
        </span>
        <span className="text-sm font-medium text-gray-400 dark:text-gray-500 mb-1">%</span>
      </div>

      {/* ── Progress bar ───────────────────────────────────────────── */}
      <ProgressBar
        value={pct}
        color={styles.bar}
        height="sm"
        animated
        className="mb-3"
      />

      {/* ── Interpretation text ────────────────────────────────────── */}
      {interpretationText && (
        <p className="text-xs leading-relaxed text-gray-500 dark:text-gray-400 line-clamp-3">
          {interpretationText}
        </p>
      )}
    </motion.div>
  )
}
