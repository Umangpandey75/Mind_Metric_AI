import { useMemo } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { BarChart3, Calendar, Tag, BookOpen, ArrowRight, Clock, Trash2 } from 'lucide-react'
import { loadAllResults } from '../utils/scoring'
import Badge from '../components/ui/Badge'
import Button from '../components/ui/Button'
import ProgressBar from '../components/ui/ProgressBar'

/* ── Constants ──────────────────────────────────────────────────────────── */
const BADGE_COLOR = { Personality: 'indigo', 'Mental Health': 'green', Behavioral: 'purple', Cognitive: 'blue' }
const BAR_COLOR   = { Personality: 'indigo', 'Mental Health': 'green', Behavioral: 'purple', Cognitive: 'blue' }

const fadeUp = (i = 0) => ({
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.4, delay: i * 0.08, ease: [0.4, 0, 0.2, 1] },
})

/* ── Helpers ────────────────────────────────────────────────────────────── */
function formatDate(iso) {
  return new Date(iso).toLocaleDateString('en-US', { dateStyle: 'medium' })
}

function timeAgo(iso) {
  const diff = Date.now() - new Date(iso).getTime()
  const days = Math.floor(diff / 86400000)
  if (days === 0) return 'Today'
  if (days === 1) return 'Yesterday'
  if (days < 30)  return `${days} days ago`
  if (days < 365) return `${Math.floor(days / 30)} months ago`
  return `${Math.floor(days / 365)} years ago`
}

/* ── Extract top scores for badge display ────────────────────────────────── */
function getTopScores(scores) {
  if (scores?.subscales) {
    return Object.entries(scores.subscales)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 3)
      .map(([trait, pct]) => ({ label: `${trait}: ${Math.round(pct)}%`, value: Math.round(pct) }))
  }
  if (scores?.total !== undefined) {
    const label = scores?.interpretation?.label ?? 'Score'
    return [{ label: `${label} · ${scores.total}`, value: null }]
  }
  return []
}

/* ── Summary Stat Card ───────────────────────────────────────────────────── */
function StatCard({ icon: Icon, label, value, sub, index }) {
  return (
    <motion.div
      {...fadeUp(index)}
      className="flex items-center gap-4 p-5 rounded-2xl border border-gray-200 dark:border-gray-700 bg-cardLight dark:bg-cardDark"
    >
      <div className="w-11 h-11 rounded-xl bg-primary/10 dark:bg-primaryDark/15 flex items-center justify-center flex-shrink-0">
        <Icon size={19} className="text-primary dark:text-primaryDark" strokeWidth={2} />
      </div>
      <div className="min-w-0">
        <p className="text-2xl font-extrabold text-gray-900 dark:text-white leading-none mb-0.5 truncate">{value}</p>
        <p className="text-xs font-medium text-gray-500 dark:text-gray-400">{label}</p>
        {sub && <p className="text-[10px] text-gray-400 dark:text-gray-500 truncate mt-0.5">{sub}</p>}
      </div>
    </motion.div>
  )
}

/* ── Result Card ─────────────────────────────────────────────────────────── */
function ResultCard({ result, index }) {
  const topScores = getTopScores(result.scores)
  const barColor  = BAR_COLOR[result.category] ?? 'indigo'

  return (
    <motion.div
      {...fadeUp(index * 0.5)}
      className="flex flex-col p-6 rounded-2xl border border-gray-200 dark:border-gray-700 bg-cardLight dark:bg-cardDark hover:border-primary/30 dark:hover:border-primaryDark/30 hover:shadow-lg hover:shadow-primary/8 hover:-translate-y-0.5 transition-all duration-300"
    >
      {/* Header */}
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="min-w-0">
          <Badge text={result.category} color={BADGE_COLOR[result.category] ?? 'gray'} size="sm" className="mb-2" />
          <h3 className="text-sm font-bold text-gray-900 dark:text-white leading-snug">{result.assessmentTitle}</h3>
        </div>
        <div className="text-right flex-shrink-0">
          <p className="text-[10px] font-medium text-gray-400 dark:text-gray-500 flex items-center justify-end gap-1">
            <Clock size={10} />{timeAgo(result.completedAt)}
          </p>
          <p className="text-[10px] text-gray-300 dark:text-gray-600 mt-0.5">{formatDate(result.completedAt)}</p>
        </div>
      </div>

      {/* Score preview */}
      {topScores.length > 0 && (
        <div className="space-y-2.5 mb-4">
          {topScores.map(({ label, value }) => (
            <div key={label}>
              <div className="flex items-center justify-between mb-1">
                <span className="text-[11px] text-gray-500 dark:text-gray-400 truncate pr-2">{label}</span>
                {value !== null && <span className="text-[11px] font-bold text-gray-700 dark:text-gray-300 flex-shrink-0">{value}%</span>}
              </div>
              {value !== null && (
                <ProgressBar value={value} color={barColor} height="xs" animated />
              )}
            </div>
          ))}
        </div>
      )}

      {/* Attachment type chip */}
      {result.scores?.attachmentType && (
        <div className="mb-4">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-700/40">
            {result.scores.attachmentType.label}
          </span>
        </div>
      )}

      {/* Actions */}
      <div className="mt-auto pt-1">
        <Link to={`/results/${result.assessmentId}`}>
          <Button variant="outline" size="small" fullWidth rightIcon={<ArrowRight size={13} />}>
            View Full Results
          </Button>
        </Link>
      </div>
    </motion.div>
  )
}

/* ── Empty State ─────────────────────────────────────────────────────────── */
function EmptyState() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}
      className="flex flex-col items-center justify-center py-16 text-center gap-6"
    >
      <div className="relative w-64 h-64 rounded-3xl overflow-hidden shadow-xl">
        <img src="/images/dashboard_real.jpg" alt="Start your first assessment" className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-indigo-950/60 via-transparent to-transparent" />
      </div>
      <div>
        <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-3">No results yet</h2>
        <p className="text-sm text-gray-500 dark:text-gray-400 max-w-sm mx-auto leading-relaxed">
          Complete your first assessment to see your personalised scores, insights, and AI analysis right here.
        </p>
      </div>
      <Link to="/assessments">
        <Button variant="primary" size="medium" rightIcon={<ArrowRight size={15} />}>
          Browse Assessments
        </Button>
      </Link>
    </motion.div>
  )
}

/* ── Page ────────────────────────────────────────────────────────────────── */
export default function Dashboard() {
  const allResults = useMemo(() => {
    const raw = loadAllResults()
    return Object.values(raw).sort(
      (a, b) => new Date(b.completedAt) - new Date(a.completedAt),
    )
  }, [])

  // Summary stats
  const stats = useMemo(() => {
    if (!allResults.length) return null
    const total    = allResults.length
    const latest   = formatDate(allResults[0].completedAt)
    const catCount = allResults.reduce((acc, r) => {
      acc[r.category] = (acc[r.category] ?? 0) + 1
      return acc
    }, {})
    const topCat = Object.entries(catCount).sort(([, a], [, b]) => b - a)[0]?.[0] ?? '—'
    return { total, latest, topCat }
  }, [allResults])

  return (
    <div className="min-h-screen bg-surfaceLight dark:bg-surfaceDark">
      {/* ── Page header ─────────────────────────────────────────────── */}
      <div className="bg-gradient-to-br from-indigo-50 via-white to-violet-50 dark:from-surfaceDark dark:via-[#12122A] dark:to-[#0e0e20] border-b border-gray-200 dark:border-gray-800">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <motion.div {...fadeUp(0)}>
            <p className="text-xs uppercase tracking-widest font-semibold text-primary dark:text-primaryDark mb-2">My Dashboard</p>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 dark:text-white mb-1">Your Results</h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">All your assessment history, stored privately on this device.</p>
          </motion.div>

          {/* Summary stats */}
          {stats && (
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-8">
              <StatCard icon={BarChart3} label="Assessments Completed" value={stats.total}   index={1} />
              <StatCard icon={Calendar}  label="Most Recent"           value={stats.latest}  index={2} />
              <StatCard icon={Tag}       label="Most Active Category"  value={stats.topCat}  index={3} />
            </div>
          )}
        </div>
      </div>

      {/* ── Content ─────────────────────────────────────────────────── */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {allResults.length === 0 ? (
          <EmptyState />
        ) : (
          <>
            <div className="flex items-center justify-between mb-6">
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {allResults.length} {allResults.length === 1 ? 'assessment' : 'assessments'} completed
              </p>
              <Link to="/assessments">
                <Button variant="ghost" size="small" rightIcon={<ArrowRight size={13} />}>
                  Take Another
                </Button>
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {allResults.map((result, i) => (
                <ResultCard key={result.assessmentId} result={result} index={i} />
              ))}
            </div>

            {/* Clear data note */}
            <motion.p
              {...fadeUp(allResults.length * 0.08 + 0.2)}
              className="flex items-center justify-center gap-1.5 mt-12 text-xs text-gray-300 dark:text-gray-600"
            >
              <Trash2 size={11} />
              Results are stored in your browser only. Clearing browser data will remove them.
            </motion.p>
          </>
        )}
      </div>
    </div>
  )
}
