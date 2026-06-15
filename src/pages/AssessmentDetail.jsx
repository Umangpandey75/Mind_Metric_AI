import { useParams, useNavigate, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  ArrowLeft, ArrowRight, Clock, FileQuestion, BookOpen,
  ShieldCheck, ListChecks, BarChart3, AlertCircle, CheckCircle2,
  Info, History, Heart, Lightbulb, ChevronRight,
} from 'lucide-react'
import assessmentRegistry from '../data/assessmentRegistry'

/* ── category colours ─────────────────────────────────────────────────────── */
const CAT_COLOR = {
  Personality:    'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-300',
  'Mental Health':'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300',
  Behavioral:     'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300',
  Cognitive:      'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300',
}
const DIFF_COLOR = {
  Beginner: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300',
  Medium:   'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300',
  Advanced: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300',
}

/* ── Per-assessment real photographs ────────────────────────────────────── */
const ASSESSMENT_IMAGE = {
  'big-five':              '/images/personality_real.jpg',
  'phq-9':                 '/images/mentalhealth_real.jpg',
  'gad-7':                 '/images/anxiety_real.jpg',
  'rosenberg-self-esteem': '/images/selfesteem_real.jpg',
  'attachment-style':      '/images/attachment_real.jpg',
}

/* ── default instructions per scale ──────────────────────────────────────── */
const DEFAULT_INSTRUCTIONS = {
  likert5: [
    'Read each statement carefully before responding.',
    'Rate how much you agree using the 1–5 scale provided.',
    'Answer based on how you generally feel, not just right now.',
    'There are no right or wrong answers — be as honest as you can.',
    'Complete all questions for the most accurate result.',
  ],
  likert4: [
    'Think about the past two weeks as you answer each question.',
    'Select the option that best describes how often you have experienced each symptom.',
    'Answer every question, even if some feel difficult.',
    'Your responses are stored privately on your device only.',
  ],
  likert7: [
    'Think about your relationships in general, not just your most recent one.',
    'Rate each statement on the 1–7 scale from Strongly Disagree to Strongly Agree.',
    'Go with your first instinct — there are no right or wrong answers.',
    'Complete all questions for the most meaningful result.',
  ],
}

/* ── Card wrapper ─────────────────────────────────────────────────────────── */
function Card({ icon: Icon, title, iconColor = 'text-primary dark:text-primaryDark', children }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
      className="p-6 sm:p-7 rounded-2xl border border-gray-200 dark:border-gray-700/60 bg-white dark:bg-cardDark"
    >
      <div className="flex items-center gap-2.5 mb-5">
        <Icon size={16} className={`flex-shrink-0 ${iconColor}`} strokeWidth={2.2} />
        <h2 className="text-sm font-bold text-gray-700 dark:text-gray-200 uppercase tracking-wider">{title}</h2>
      </div>
      {children}
    </motion.div>
  )
}

/* ── Prose paragraph ──────────────────────────────────────────────────────── */
function P({ children }) {
  return <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">{children}</p>
}

/* ── Not found page ───────────────────────────────────────────────────────── */
function NotFound({ id }) {
  return (
    <div className="min-h-screen bg-surfaceLight dark:bg-surfaceDark flex items-center justify-center px-6">
      <div className="max-w-sm w-full text-center space-y-5">
        <div className="w-16 h-16 rounded-2xl bg-red-100 dark:bg-red-900/30 flex items-center justify-center mx-auto">
          <AlertCircle className="w-8 h-8 text-red-500" />
        </div>
        <div>
          <h1 className="text-xl font-extrabold text-gray-900 dark:text-white mb-2">Assessment not found</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            No assessment with id <code className="bg-gray-100 dark:bg-gray-800 px-1.5 py-0.5 rounded text-xs">{id}</code> exists.
          </p>
        </div>
        <Link to="/assessments" className="inline-flex items-center gap-1.5 text-sm font-semibold text-primary dark:text-primaryDark hover:underline">
          ← Browse all assessments
        </Link>
      </div>
    </div>
  )
}

export default function AssessmentDetail() {
  const params = useParams()
  const id = params.assessmentId ?? params.id
  const navigate = useNavigate()
  const assessment = assessmentRegistry.getById(id)

  if (!assessment) return <NotFound id={id} />

  const detail = assessment.detail
  const instructions = DEFAULT_INSTRUCTIONS[assessment.scale?.type] ?? DEFAULT_INSTRUCTIONS.likert5
  const catClass  = CAT_COLOR[assessment.category]  ?? 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-300'
  const diffClass = DIFF_COLOR[assessment.difficulty] ?? DIFF_COLOR.Beginner
  const heroImg   = ASSESSMENT_IMAGE[id]

  return (
    <div className="min-h-screen bg-surfaceLight dark:bg-surfaceDark">
      <div className="max-w-4xl mx-auto px-6 sm:px-8 lg:px-12 py-10 sm:py-14 space-y-8">

        {/* ── Top nav ──────────────────────────────────────── */}
        <div className="flex items-center justify-between flex-wrap gap-3">
          <button
            onClick={() => navigate(-1)}
            className="inline-flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 hover:text-primary dark:hover:text-primaryDark transition-colors font-medium"
          >
            <ArrowLeft size={15} /> Back
          </button>
          <Link to="/assessments" className="text-xs text-gray-400 dark:text-gray-500 hover:text-primary dark:hover:text-primaryDark transition-colors">
            All Assessments
          </Link>
        </div>

        {/* ── Hero card ────────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="relative p-8 sm:p-10 rounded-3xl bg-gradient-to-br from-primary via-accent to-primary/80 text-white overflow-hidden"
        >
          {/* Background circles */}
          <div className="absolute top-0 right-0 w-72 h-72 rounded-full bg-white/8 -translate-y-1/2 translate-x-1/3 pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-48 h-48 rounded-full bg-white/5 translate-y-1/2 -translate-x-1/4 pointer-events-none" />

          <div className="relative grid grid-cols-1 lg:grid-cols-2 gap-6 items-center">
            {/* Left: text */}
            <div>
              {/* Badges */}
              <div className="flex flex-wrap items-center gap-2 mb-4">
                <span className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full ${catClass}`}>
                  {assessment.category}
                </span>
                <span className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full ${diffClass}`}>
                  {assessment.difficulty}
                </span>
              </div>

              {/* Title */}
              <h1 className="text-2xl sm:text-3xl font-extrabold text-white mb-2 tracking-tight leading-tight">
                {assessment.title}
              </h1>
              <p className="text-white/70 text-sm mb-6 leading-relaxed">{assessment.description}</p>

              {/* Quick meta */}
              <div className="flex flex-wrap items-center gap-5 text-sm text-white/80 mb-8">
                <span className="flex items-center gap-1.5"><Clock size={14} /> {assessment.duration} minutes</span>
                <span className="flex items-center gap-1.5"><FileQuestion size={14} /> {assessment.questionCount} questions</span>
                <span className="flex items-center gap-1.5"><BookOpen size={14} /> {assessment.theorist}</span>
              </div>

              {/* Start button */}
              <button
                id="start-assessment-btn"
                onClick={() => navigate(`/assessments/${id}/take`)}
                className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full bg-white text-primary font-extrabold text-sm hover:scale-105 active:scale-95 shadow-xl shadow-black/20 transition-all duration-200"
              >
                Start Assessment <ArrowRight size={15} />
              </button>
              <p className="mt-3 text-xs text-white/50">Your answers are private and never leave your device</p>
            </div>

            {/* Right: illustration */}
            {heroImg && (
              <div className="hidden lg:flex items-center justify-center">
                <div className="relative w-56 h-56">
                  <div className="absolute inset-0 rounded-2xl bg-white/10 blur-xl" />
                  <img
                    src={heroImg}
                    alt={assessment.title}
                    className="relative w-full h-full object-cover rounded-2xl shadow-2xl shadow-black/30 border border-white/10"
                  />
                </div>
              </div>
            )}
          </div>
        </motion.div>

        {/* ── Stats grid ───────────────────────────────────── */}
        {detail?.stats && (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
            {detail.stats.map(({ label, value }) => (
              <motion.div
                key={label}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3 }}
                className="flex flex-col items-center justify-center p-4 rounded-2xl border border-gray-200 dark:border-gray-700/60 bg-white dark:bg-cardDark text-center"
              >
                <p className="text-xl font-extrabold text-primary dark:text-primaryDark tabular-nums mb-1">{value}</p>
                <p className="text-[10px] font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider">{label}</p>
              </motion.div>
            ))}
          </div>
        )}

        {/* ── Clinical disclaimer ──────────────────────────── */}
        {(assessment.disclaimer || detail?.clinicalNote) && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="flex items-start gap-3 p-5 rounded-2xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800/40"
          >
            <ShieldCheck size={16} className="flex-shrink-0 mt-0.5 text-amber-500" strokeWidth={2} />
            <div>
              <p className="text-sm font-bold text-amber-800 dark:text-amber-300 mb-1">Important Note</p>
              <p className="text-sm text-amber-700 dark:text-amber-400/80 leading-relaxed">
                {detail?.clinicalNote ?? assessment.disclaimer}
              </p>
            </div>
          </motion.div>
        )}

        {/* ── What it measures ─────────────────────────────── */}
        {detail?.whatItMeasures && (
          <Card icon={BarChart3} title="What This Measures">
            <P>{detail.whatItMeasures}</P>
          </Card>
        )}

        {/* ── Dimensions grid ──────────────────────────────── */}
        {detail?.dimensions && detail.dimensions.length > 0 && (
          <Card icon={ListChecks} title="What You'll Discover">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {detail.dimensions.map(({ name, icon, description }) => (
                <div key={name} className="flex items-start gap-3 p-4 rounded-xl bg-surfaceLight dark:bg-surfaceDark border border-gray-100 dark:border-gray-700/40">
                  <span className="text-xl flex-shrink-0 leading-none mt-0.5">{icon}</span>
                  <div>
                    <p className="text-sm font-bold text-gray-900 dark:text-white mb-1">{name}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">{description}</p>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        )}

        {/* ── Why it matters ───────────────────────────────── */}
        {detail?.whyItMatters && (
          <Card icon={Heart} title="Why This Matters" iconColor="text-rose-500">
            <P>{detail.whyItMatters}</P>
          </Card>
        )}

        {/* ── History ──────────────────────────────────────── */}
        {detail?.history && (
          <Card icon={History} title="Research Background" iconColor="text-amber-500">
            <P>{detail.history}</P>
          </Card>
        )}

        {/* ── What to expect ───────────────────────────────── */}
        {detail?.whatToExpect && (
          <Card icon={Info} title="What to Expect" iconColor="text-sky-500">
            <P>{detail.whatToExpect}</P>
          </Card>
        )}

        {/* ── Instructions ─────────────────────────────────── */}
        <Card icon={Lightbulb} title="Before You Begin" iconColor="text-emerald-500">
          <ul className="space-y-3">
            {(assessment.instructions ? [assessment.instructions] : instructions).concat(
              assessment.instructions ? instructions : []
            ).slice(0, 5).map((step, i) => (
              <li key={i} className="flex items-start gap-3">
                <span className="flex-shrink-0 w-6 h-6 rounded-full bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 text-xs font-bold flex items-center justify-center mt-0.5">
                  {i + 1}
                </span>
                <span className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">{step}</span>
              </li>
            ))}
          </ul>
        </Card>

        {/* ── Related assessments ──────────────────────────── */}
        {(() => {
          const related = assessmentRegistry.assessments.filter(a => a.category === assessment.category && a.id !== id).slice(0, 3)
          if (!related.length) return null
          return (
            <div>
              <h3 className="text-sm font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider mb-4">Similar Assessments</h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {related.map(a => (
                  <Link
                    key={a.id}
                    to={`/assessments/${a.id}`}
                    className="group flex items-center gap-3 p-4 rounded-2xl border border-gray-200 dark:border-gray-700/60 bg-white dark:bg-cardDark hover:border-primary dark:hover:border-primaryDark hover:-translate-y-0.5 hover:shadow-md transition-all duration-200"
                  >
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-bold text-gray-900 dark:text-white group-hover:text-primary dark:group-hover:text-primaryDark transition-colors truncate">{a.title}</p>
                      <p className="text-[10px] text-gray-400 dark:text-gray-500 mt-0.5">{a.duration} min · {a.questionCount} questions</p>
                    </div>
                    <ChevronRight size={14} className="flex-shrink-0 text-gray-300 dark:text-gray-600 group-hover:text-primary dark:group-hover:text-primaryDark transition-colors" />
                  </Link>
                ))}
              </div>
            </div>
          )
        })()}

        {/* ── Bottom CTA ───────────────────────────────────── */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-6 rounded-2xl border border-primary/20 dark:border-primaryDark/20 bg-primary/5 dark:bg-primaryDark/8">
          <div>
            <p className="text-sm font-bold text-gray-900 dark:text-white mb-1">Ready to get started?</p>
            <p className="text-xs text-gray-500 dark:text-gray-400">Takes about {assessment.duration} minutes · Completely private</p>
          </div>
          <button
            onClick={() => navigate(`/assessments/${id}/take`)}
            className="inline-flex items-center gap-2 px-8 py-3 rounded-full bg-primary dark:bg-primaryDark text-white font-bold text-sm hover:opacity-90 hover:scale-105 active:scale-95 shadow-md shadow-primary/25 transition-all duration-200 flex-shrink-0"
          >
            Start Now <ArrowRight size={15} />
          </button>
        </div>

      </div>
    </div>
  )
}
