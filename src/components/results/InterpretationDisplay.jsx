import { useMemo } from 'react'
import { motion } from 'framer-motion'
import { clsx } from 'clsx'
import { User, Zap, TrendingUp, Compass, AlertCircle, Loader2 } from 'lucide-react'

/* ── Section config ─────────────────────────────────────────────────────── */
const SECTIONS = [
  {
    key: 'PROFILE',
    heading: 'Profile',
    Icon: User,
    accent: 'bg-indigo-50  dark:bg-indigo-950/30  border-indigo-200/60  dark:border-indigo-700/30  text-indigo-600  dark:text-indigo-400',
    headingColor: 'text-indigo-700 dark:text-indigo-300',
  },
  {
    key: 'STRENGTHS',
    heading: 'Strengths',
    Icon: Zap,
    accent: 'bg-emerald-50 dark:bg-emerald-950/30 border-emerald-200/60 dark:border-emerald-700/30 text-emerald-600 dark:text-emerald-400',
    headingColor: 'text-emerald-700 dark:text-emerald-300',
  },
  {
    key: 'GROWTH AREAS',
    heading: 'Growth Areas',
    Icon: TrendingUp,
    accent: 'bg-amber-50   dark:bg-amber-950/30   border-amber-200/60   dark:border-amber-700/30   text-amber-600   dark:text-amber-400',
    headingColor: 'text-amber-700 dark:text-amber-300',
  },
  {
    key: 'GUIDANCE',
    heading: 'Guidance',
    Icon: Compass,
    accent: 'bg-violet-50  dark:bg-violet-950/30  border-violet-200/60  dark:border-violet-700/30  text-violet-600  dark:text-violet-400',
    headingColor: 'text-violet-700 dark:text-violet-300',
  },
]

/* ── Text parser ─────────────────────────────────────────────────────────
   Splits the Groq response into sections keyed by the headings.
   Handles variations like "PROFILE:", "PROFILE", "Profile:", etc.
────────────────────────────────────────────────────────────────────────── */
function parseInterpretation(text) {
  if (!text) return {}

  const result = {}
  const keys   = SECTIONS.map((s) => s.key)

  // Build a regex that matches any of the section headings (case-insensitive)
  const headingPattern = new RegExp(
    `(${keys.map((k) => k.replace(' ', '\\s+')).join('|')}):?`,
    'gi',
  )

  const parts  = text.split(headingPattern).map((s) => s.trim()).filter(Boolean)

  let currentKey = null
  for (const part of parts) {
    const upperPart = part.toUpperCase().replace(/\s+/g, ' ')
    const matched   = keys.find((k) => upperPart === k || upperPart === `${k}:`)
    if (matched) {
      currentKey = matched
      result[matched] = result[matched] ?? ''
    } else if (currentKey) {
      result[currentKey] += (result[currentKey] ? '\n' : '') + part
    }
  }

  return result
}

/* ── Bullet list renderer ────────────────────────────────────────────────── */
function BulletList({ text }) {
  const lines = text
    .split('\n')
    .map((l) => l.replace(/^[-•*]\s*/, '').trim())
    .filter(Boolean)

  return (
    <ul className="space-y-2.5">
      {lines.map((line, i) => (
        <li key={i} className="flex items-start gap-2.5">
          <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-current opacity-60 flex-shrink-0" />
          <span className="text-sm leading-relaxed text-gray-700 dark:text-gray-300">{line}</span>
        </li>
      ))}
    </ul>
  )
}

/* ── Paragraph renderer ─────────────────────────────────────────────────── */
function Paragraphs({ text }) {
  const paragraphs = text.split(/\n{2,}/).map((p) => p.trim()).filter(Boolean)
  return (
    <div className="space-y-3">
      {paragraphs.map((p, i) => (
        <p key={i} className="text-sm leading-relaxed text-gray-700 dark:text-gray-300">
          {p}
        </p>
      ))}
    </div>
  )
}

/* ── Loading skeleton ────────────────────────────────────────────────────── */
function LoadingSkeleton() {
  return (
    <div className="flex flex-col items-center justify-center gap-4 py-16 text-center">
      <Loader2 className="w-8 h-8 animate-spin text-primary dark:text-primaryDark" />
      <div>
        <p className="text-sm font-medium text-gray-700 dark:text-gray-200">
          Generating your personalised insights…
        </p>
        <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
          Powered by Groq · llama3-8b-8192
        </p>
      </div>
    </div>
  )
}

/* ── Error state ─────────────────────────────────────────────────────────── */
function ErrorState({ message }) {
  return (
    <div className="flex items-start gap-3 p-4 rounded-xl bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-700/40">
      <AlertCircle className="w-4 h-4 text-red-500 flex-shrink-0 mt-0.5" />
      <div>
        <p className="text-sm font-medium text-red-700 dark:text-red-300">
          Could not load AI insights
        </p>
        <p className="text-xs text-red-500 dark:text-red-400 mt-0.5">{message}</p>
      </div>
    </div>
  )
}

/* ── Main component ─────────────────────────────────────────────────────── */
export default function InterpretationDisplay({ text = '', loading = false, error = null }) {
  const parsed = useMemo(() => parseInterpretation(text), [text])

  if (loading) return <LoadingSkeleton />
  if (error)   return <ErrorState message={error} />
  if (!text)   return null

  const isBulletSection = (key) =>
    key === 'STRENGTHS' || key === 'GROWTH AREAS'

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
      {SECTIONS.map(({ key, heading, Icon, accent, headingColor }, i) => {
        const content = parsed[key]
        if (!content) return null

        return (
          <motion.div
            key={key}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: i * 0.1, ease: 'easeOut' }}
            className={clsx(
              'rounded-2xl border p-5',
              'bg-cardLight dark:bg-cardDark',
              'border-gray-200/80 dark:border-gray-700/50',
            )}
          >
            {/* Section header */}
            <div className="flex items-center gap-2.5 mb-4">
              <span className={clsx('p-2 rounded-xl border', accent)}>
                <Icon size={15} strokeWidth={2.2} />
              </span>
              <h3 className={clsx('text-sm font-bold tracking-wide', headingColor)}>
                {heading}
              </h3>
            </div>

            {/* Content */}
            {isBulletSection(key)
              ? <BulletList text={content} />
              : <Paragraphs  text={content} />
            }
          </motion.div>
        )
      })}
    </div>
  )
}
