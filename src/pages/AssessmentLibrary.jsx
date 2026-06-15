import { useState, useMemo, useRef } from 'react'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Search, X, Clock, FileQuestion, ArrowRight, BookOpen } from 'lucide-react'
import { assessments } from '../data/assessmentRegistry'
import Badge from '../components/ui/Badge'

/* ── Constants ──────────────────────────────────────────────────────────── */
const CATEGORIES = ['All', 'Personality', 'Mental Health', 'Behavioral', 'Cognitive', 'Specialized']

const BADGE_COLOR = { Personality: 'indigo', 'Mental Health': 'green', Behavioral: 'purple', Cognitive: 'blue', Specialized: 'gold' }
const DIFF_COLOR  = { Beginner: 'green', Medium: 'yellow', Advanced: 'red' }

const ASSESSMENT_IMAGE = {
  'big-five':              '/images/personality_real.jpg',
  'phq-9':                 '/images/mentalhealth_real.jpg',
  'gad-7':                 '/images/anxiety_real.jpg',
  'rosenberg-self-esteem': '/images/selfesteem_real.jpg',
  'attachment-style':      '/images/attachment_real.jpg',
}

const cardVariants = {
  hidden:  { opacity: 0, y: 20, scale: 0.97 },
  visible: (i) => ({ opacity: 1, y: 0, scale: 1, transition: { duration: 0.35, delay: i * 0.05, ease: [0.4, 0, 0.2, 1] } }),
  exit:    { opacity: 0, scale: 0.95, transition: { duration: 0.18 } },
}

/* ── Assessment Card ────────────────────────────────────────────────────── */
function AssessmentCard({ assessment, index }) {
  const imgSrc = ASSESSMENT_IMAGE[assessment.id]
  return (
    <motion.div layout variants={cardVariants} initial="hidden" animate="visible" exit="exit" custom={index}>
      <Link
        to={`/assessments/${assessment.id}`}
        id={`card-${assessment.id}`}
        className="group flex flex-col h-full rounded-2xl border border-gray-200 dark:border-gray-700/60 bg-white dark:bg-cardDark hover:border-primary dark:hover:border-primaryDark hover:shadow-2xl hover:shadow-primary/15 dark:hover:shadow-primaryDark/20 hover:-translate-y-1.5 transition-all duration-300 cursor-pointer block overflow-hidden"
      >
        {/* Image header */}
        <div className="relative h-36 overflow-hidden bg-gradient-to-br from-primary/5 to-accent/5 dark:from-primaryDark/10 dark:to-accent/10">
          {imgSrc && (
            <img src={imgSrc} alt={assessment.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-white/70 dark:from-cardDark/70 to-transparent" />
          <div className="absolute top-3 left-3 right-3 flex items-center justify-between">
            <Badge text={assessment.category}   color={BADGE_COLOR[assessment.category] ?? 'gray'} size="sm" />
            <Badge text={assessment.difficulty} color={DIFF_COLOR[assessment.difficulty] ?? 'gray'} size="sm" />
          </div>
        </div>

        {/* Content */}
        <div className="flex flex-col flex-1 p-5">
          <h3 className="text-base font-bold text-gray-900 dark:text-white mb-1 leading-snug group-hover:text-primary dark:group-hover:text-primaryDark transition-colors">
            {assessment.title}
          </h3>
          <p className="text-[11px] text-gray-400 dark:text-gray-500 mb-3 italic">{assessment.theorist}</p>
          <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed flex-1 mb-5 line-clamp-3">{assessment.description}</p>
          <div className="flex items-center gap-5 text-xs text-gray-400 dark:text-gray-500 mb-5">
            <span className="flex items-center gap-1.5"><Clock size={12} />{assessment.duration} min</span>
            <span className="flex items-center gap-1.5"><FileQuestion size={12} />{assessment.questionCount} questions</span>
          </div>
          <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-primary dark:text-primaryDark group-hover:gap-3 transition-all duration-200">
            View Assessment <ArrowRight size={13} />
          </div>
        </div>
      </Link>
    </motion.div>
  )
}

/* ── Empty State ────────────────────────────────────────────────────────── */
function EmptyState({ query, category }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35 }}
      className="col-span-full flex flex-col items-center justify-center py-24 text-center gap-4"
    >
      <div className="w-16 h-16 rounded-2xl bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
        <BookOpen size={28} className="text-gray-400 dark:text-gray-500" />
      </div>
      <div>
        <p className="text-base font-semibold text-gray-700 dark:text-gray-200 mb-1">No assessments found</p>
        <p className="text-sm text-gray-400 dark:text-gray-500 max-w-xs mx-auto">
          {query
            ? <>No results for <span className="font-medium text-gray-600 dark:text-gray-300">"{query}"</span>. Try a different search term.</>
            : <>No assessments in the <span className="font-medium text-gray-600 dark:text-gray-300">{category}</span> category yet.</>
          }
        </p>
      </div>
    </motion.div>
  )
}

/* ── Page ───────────────────────────────────────────────────────────────── */
export default function AssessmentLibrary() {
  const [query, setQuery]       = useState('')
  const [category, setCategory] = useState('All')
  const inputRef = useRef(null)

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    return assessments.filter(a => {
      const matchCat   = category === 'All' || a.category === category
      const matchQuery = !q || a.title.toLowerCase().includes(q) || a.description.toLowerCase().includes(q)
      return matchCat && matchQuery
    })
  }, [query, category])

  return (
    <div className="min-h-screen bg-surfaceLight dark:bg-surfaceDark">

      {/* ── Hero Banner ──────────────────────────────────────────────── */}
      <div className="relative overflow-hidden border-b border-gray-200 dark:border-gray-800">
        <img src="/images/library_real.jpg" alt="" className="absolute inset-0 w-full h-full object-cover" aria-hidden="true" />
        <div className="absolute inset-0 bg-gradient-to-br from-gray-950/92 via-indigo-950/88 to-gray-950/92" />

        <div className="relative max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 py-20">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <p className="text-xs uppercase tracking-widest font-semibold text-violet-300 mb-3">Assessment Library</p>
            <h1 className="text-4xl sm:text-5xl font-extrabold text-white mb-4 tracking-tight">
              Find Your <span className="bg-gradient-to-r from-violet-300 to-indigo-200 bg-clip-text text-transparent">Assessment</span>
            </h1>
            <p className="text-indigo-200/80 text-base max-w-lg">
              Browse validated psychological tools across personality, mental health, cognitive ability, and behaviour.
            </p>
          </motion.div>

          {/* Search bar */}
          <motion.div
            initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.15 }}
            className="relative mt-8 max-w-xl"
          >
            <Search size={17} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/50 pointer-events-none" />
            <input
              ref={inputRef}
              id="search-assessments"
              type="search"
              value={query}
              onChange={e => setQuery(e.target.value)}
              placeholder="Search assessments..."
              className="w-full pl-11 pr-10 py-3.5 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 text-white placeholder-white/40 text-sm focus:outline-none focus:ring-2 focus:ring-white/30 focus:border-white/40 transition"
            />
            {query && (
              <button onClick={() => { setQuery(''); inputRef.current?.focus() }} className="absolute right-4 top-1/2 -translate-y-1/2 text-white/40 hover:text-white/70 transition-colors">
                <X size={15} />
              </button>
            )}
          </motion.div>

          {/* Category filter pills */}
          <motion.div
            initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.25 }}
            className="flex flex-wrap gap-2 mt-5"
          >
            {CATEGORIES.map(cat => (
              <button
                key={cat}
                id={`filter-${cat.toLowerCase().replace(' ', '-')}`}
                onClick={() => setCategory(cat)}
                className={`px-4 py-2 rounded-full text-xs font-semibold transition-all duration-200 border ${
                  category === cat
                    ? 'bg-white text-primary border-white shadow-lg'
                    : 'bg-white/10 text-white/70 border-white/20 hover:bg-white/20 hover:text-white'
                }`}
              >
                {cat}
              </button>
            ))}
          </motion.div>
        </div>
      </div>

      {/* ── Grid ─────────────────────────────────────────────────────── */}
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 py-10">
        <div className="flex items-center justify-between mb-6">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            <span className="font-semibold text-gray-900 dark:text-white">{filtered.length}</span> assessment{filtered.length !== 1 ? 's' : ''} found
            {category !== 'All' && <> in <span className="font-medium text-primary dark:text-primaryDark">{category}</span></>}
          </p>
          {(query || category !== 'All') && (
            <button
              onClick={() => { setQuery(''); setCategory('All') }}
              className="text-xs text-gray-400 hover:text-primary dark:hover:text-primaryDark transition-colors flex items-center gap-1"
            >
              <X size={12} /> Clear filters
            </button>
          )}
        </div>

        <AnimatePresence mode="popLayout">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {filtered.length > 0
              ? filtered.map((a, i) => <AssessmentCard key={a.id} assessment={a} index={i} />)
              : <EmptyState query={query} category={category} />
            }
          </div>
        </AnimatePresence>
      </div>
    </div>
  )
}
