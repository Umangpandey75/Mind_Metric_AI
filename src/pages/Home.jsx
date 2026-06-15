import { useState, useRef, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence, useInView } from 'framer-motion'
import {
  ArrowRight, Clock, FileQuestion, ChevronDown,
  CheckCircle, Zap, BarChart3, BookOpen, Brain,
  Shield, Star, Users, TrendingUp,
} from 'lucide-react'
import { assessments } from '../data/assessmentRegistry'

/* ── Category image map ─────────────────────────────────────────────────── */
const CATEGORY_IMAGE = {
  Personality:    '/images/personality.png',
  'Mental Health':'/images/mental_health.png',
  Behavioral:     '/images/attachment.png',
  Cognitive:      '/images/mental_health.png',
}
const ASSESSMENT_IMAGE = {
  'big-five':              '/images/personality_real.jpg',
  'phq-9':                 '/images/mentalhealth_real.jpg',
  'gad-7':                 '/images/anxiety_real.jpg',
  'rosenberg-self-esteem': '/images/selfesteem_real.jpg',
  'attachment-style':      '/images/attachment_real.jpg',
}

/* ── helpers ─────────────────────────────────────────────────────────────── */
const CATEGORY_COLOR = {
  Personality:    'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-300',
  'Mental Health':'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300',
  Behavioral:     'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300',
  Cognitive:      'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300',
  Specialized:    'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300',
}

/* ── Count-up ─────────────────────────────────────────────────────────────── */
function CountUp({ target, suffix = '', duration = 1600 }) {
  const [count, setCount] = useState(0)
  const ref = useRef(null)
  const inView = useInView(ref, { once: true })

  useEffect(() => {
    if (!inView) return
    let start = null
    const step = (ts) => {
      if (!start) start = ts
      const elapsed = ts - start
      const progress = Math.min(elapsed / duration, 1)
      const eased = 1 - Math.pow(1 - progress, 3)
      setCount(Math.round(eased * target))
      if (progress < 1) requestAnimationFrame(step)
    }
    requestAnimationFrame(step)
  }, [inView, target, duration])

  return <span ref={ref} className="tabular-nums">{count}{suffix}</span>
}

/* ── FAQ Item ─────────────────────────────────────────────────────────────── */
const FAQS = [
  {
    q: 'Are these assessments clinically accurate?',
    a: 'Our assessments are based on validated, peer-reviewed psychological instruments used worldwide. However, they are designed for self-awareness and education — not clinical diagnosis. Always consult a licensed mental health professional for medical concerns.',
  },
  {
    q: 'Is my data private?',
    a: 'Completely. All your results are stored only on your device using browser localStorage. Nothing is sent to any server. No account or sign-up is required.',
  },
  {
    q: 'How long does each assessment take?',
    a: 'Most assessments take between 3 and 15 minutes. Each test page shows the estimated duration before you begin, so you can plan accordingly.',
  },
  {
    q: 'Can I retake an assessment?',
    a: 'Yes — you can retake any assessment as many times as you like. Your most recent result will be saved. Retaking assessments over time can help you track your personal growth.',
  },
  {
    q: 'What do the AI insights do?',
    a: 'After you complete an assessment, an AI model analyses your scores and generates a personalised psychological profile, highlighting your strengths, growth areas, and practical guidance — all grounded in evidence-based psychology.',
  },
]

function FAQItem({ q, a, index }) {
  const [open, setOpen] = useState(false)
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4, delay: index * 0.07 }}
      className="border border-gray-200 dark:border-gray-700/60 rounded-2xl overflow-hidden bg-white dark:bg-cardDark"
    >
      <button
        onClick={() => setOpen(o => !o)}
        className="flex items-center justify-between w-full px-6 py-5 text-left gap-4 hover:bg-gray-50 dark:hover:bg-white/5 transition-colors"
      >
        <span className="text-sm font-semibold text-gray-900 dark:text-white">{q}</span>
        <motion.span animate={{ rotate: open ? 180 : 0 }} transition={{ duration: 0.25 }} className="flex-shrink-0 text-gray-400 dark:text-gray-500">
          <ChevronDown size={18} />
        </motion.span>
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            key="answer"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.28, ease: [0.4, 0, 0.2, 1] }}
          >
            <div className="px-6 pb-5">
              <div className="h-px bg-gray-100 dark:bg-gray-700/50 mb-4" />
              <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">{a}</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}

/* ── Assessment Card ──────────────────────────────────────────────────────── */
function AssessmentCard({ assessment, index }) {
  const categoryClass = CATEGORY_COLOR[assessment.category] ?? 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-300'
  const imgSrc = ASSESSMENT_IMAGE[assessment.id] ?? CATEGORY_IMAGE[assessment.category]

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4, delay: index * 0.06 }}
    >
      <Link
        to={`/assessments/${assessment.id}`}
        className="group flex flex-col h-full rounded-2xl border border-gray-200 dark:border-gray-700/50 bg-white dark:bg-cardDark hover:border-primary dark:hover:border-primaryDark hover:shadow-xl hover:shadow-primary/10 dark:hover:shadow-primaryDark/15 hover:-translate-y-1 transition-all duration-300 cursor-pointer overflow-hidden"
      >
        {/* Illustration */}
        <div className="relative h-36 overflow-hidden bg-gradient-to-br from-primary/5 to-accent/5 dark:from-primaryDark/10 dark:to-accent/10">
          {imgSrc && (
            <img
              src={imgSrc}
              alt={assessment.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-white/60 dark:from-cardDark/60 to-transparent" />
          <span className={`absolute top-3 left-3 text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full backdrop-blur-sm ${categoryClass}`}>
            {assessment.category}
          </span>
          <span className="absolute top-3 right-3 text-[10px] text-gray-500 dark:text-gray-400 font-medium bg-white/80 dark:bg-black/40 backdrop-blur-sm px-2 py-1 rounded-full">
            {assessment.difficulty}
          </span>
        </div>

        {/* Content */}
        <div className="flex flex-col flex-1 p-5">
          <h3 className="text-sm font-bold text-gray-900 dark:text-white mb-0.5 group-hover:text-primary dark:group-hover:text-primaryDark transition-colors leading-snug">
            {assessment.title}
          </h3>
          <p className="text-[11px] text-gray-400 dark:text-gray-500 italic mb-3">{assessment.theorist}</p>
          <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed line-clamp-2 flex-1 mb-4">
            {assessment.description}
          </p>
          <div className="flex items-center gap-4 text-[11px] text-gray-400 dark:text-gray-500 mb-4">
            <span className="flex items-center gap-1.5"><Clock size={11} />{assessment.duration} min</span>
            <span className="flex items-center gap-1.5"><FileQuestion size={11} />{assessment.questionCount} questions</span>
          </div>
          <div className="flex items-center gap-1.5 text-xs font-bold text-primary dark:text-primaryDark group-hover:gap-3 transition-all duration-200">
            Start Assessment <ArrowRight size={12} />
          </div>
        </div>
      </Link>
    </motion.div>
  )
}

/* ── Page ─────────────────────────────────────────────────────────────────── */
export default function Home() {
  const navigate = useNavigate()
  const featured = assessments.slice(0, 6)

  return (
    <div className="flex flex-col">

      {/* ══════════════════════════════════════════════════════════════════
          HERO
      ══════════════════════════════════════════════════════════════════ */}
      <section className="relative min-h-screen flex items-center bg-surfaceLight dark:bg-surfaceDark overflow-hidden">
        {/* Background decoration */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-primary/8 dark:bg-primaryDark/8 blur-3xl" />
          <div className="absolute bottom-0 right-0 w-[400px] h-[400px] rounded-full bg-accent/6 dark:bg-accent/6 blur-3xl" />
        </div>

        {/* ── Hero split layout ───────────────────────────────────────── */}
        <div className="relative max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 pt-24 pb-16 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">

          {/* Left: Text content */}
          <div className="text-left">

          <motion.div
            initial={{ opacity: 0, y: -16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 mb-8 px-5 py-2.5 rounded-full bg-white dark:bg-white/5 border border-gray-200 dark:border-gray-700/50 shadow-sm text-sm text-gray-600 dark:text-gray-300 font-medium"
          >
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            Understand yourself better — take a free assessment today
          </motion.div>

          {/* Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-4xl sm:text-6xl lg:text-7xl font-extrabold text-gray-900 dark:text-white leading-tight tracking-tight mb-6"
          >
            Know Your Mind.{' '}
            <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              Own Your Story.
            </span>
          </motion.h1>

          {/* Subheadline */}
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-lg sm:text-xl text-gray-500 dark:text-gray-400 max-w-2xl mx-auto mb-10 leading-relaxed"
          >
            Explore thoughtful, research-backed assessments — from personality to mental wellness.
            Get clear, personalised insights in just a few minutes.
          </motion.p>

          {/* CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12"
          >
            <button
              onClick={() => navigate('/assessments/big-five/take')}
              className="inline-flex items-center gap-2 px-8 py-4 rounded-full bg-primary dark:bg-primaryDark text-white font-bold text-sm hover:opacity-90 hover:scale-105 active:scale-95 shadow-lg shadow-primary/30 dark:shadow-primaryDark/25 transition-all duration-200"
            >
              Take a Free Assessment <ArrowRight size={16} />
            </button>
            <Link
              to="/assessments"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-full border-2 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-200 font-bold text-sm hover:border-primary dark:hover:border-primaryDark hover:text-primary dark:hover:text-primaryDark transition-all duration-200"
            >
              See All Assessments
            </Link>
          </motion.div>

          {/* Social proof pills */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.5 }}
            className="flex flex-wrap items-center gap-3 text-xs text-gray-500 dark:text-gray-400"
          >
            {['Completely Free', 'Totally Private', 'No Sign-Up Needed', 'Instant Results', 'AI-Powered Insights'].map(t => (
              <span key={t} className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white dark:bg-white/5 border border-gray-200 dark:border-gray-700/50 shadow-sm">
                <CheckCircle size={11} className="text-emerald-500" /> {t}
              </span>
            ))}
          </motion.div>
          </div>{/* end left col */}

          {/* Right: Real person photo */}
          <motion.div
            initial={{ opacity: 0, x: 40, scale: 0.95 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            transition={{ duration: 0.9, delay: 0.25, ease: [0.4, 0, 0.2, 1] }}
            className="hidden lg:flex items-center justify-center"
          >
            <div className="relative w-full max-w-lg">
              <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-primary/30 to-accent/30 blur-3xl scale-110" />
              <img
                src="/images/hero_user.png"
                alt="Understand your mind with MindMetric"
                className="relative w-full rounded-3xl shadow-2xl shadow-primary/20 object-cover object-top aspect-[4/5]"
              />
              {/* Soft vignette overlay */}
              <div className="absolute inset-0 rounded-3xl bg-gradient-to-t from-primary/10 via-transparent to-transparent" />
            </div>
          </motion.div>

        </div>{/* end grid */}
      </section>

      {/* ══════════════════════════════════════════════════════════════════
          HOW IT WORKS
      ══════════════════════════════════════════════════════════════════ */}
      <section className="py-24 bg-white dark:bg-cardDark overflow-hidden">
        <div className="max-w-6xl mx-auto px-6 sm:px-8 lg:px-12">

          <div className="text-center mb-16">
            <p className="text-xs font-bold uppercase tracking-widest text-primary dark:text-primaryDark mb-3">Simple Process</p>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 dark:text-white mb-4">How It Works</h2>
            <p className="text-gray-500 dark:text-gray-400 max-w-md mx-auto">From curious to informed in three simple steps</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
            {[
              { icon: BookOpen, step: '01', title: 'Choose a Test', desc: 'Browse our library of validated assessments across personality, mental health, and behavioral dimensions.' },
              { icon: CheckCircle, step: '02', title: 'Answer Honestly', desc: 'Take the assessment at your own pace. Your answers are private and stored only on your device.' },
              { icon: Zap, step: '03', title: 'Get Your Insights', desc: 'Receive detailed results, AI-generated psychological insights, and a downloadable report instantly.' },
            ].map(({ icon: Icon, step, title, desc }, i) => (
              <motion.div
                key={step}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.45, delay: i * 0.1 }}
                className="relative flex flex-col gap-4 p-8 rounded-3xl border border-gray-200 dark:border-gray-700/50 bg-surfaceLight dark:bg-surfaceDark hover:shadow-lg hover:shadow-primary/8 dark:hover:shadow-primaryDark/8 transition-shadow duration-300"
              >
                <span className="absolute top-6 right-6 text-6xl font-black text-gray-100 dark:text-gray-800/80 select-none leading-none">{step}</span>
                <div className="w-12 h-12 rounded-2xl bg-primary/10 dark:bg-primaryDark/15 flex items-center justify-center flex-shrink-0">
                  <Icon size={22} className="text-primary dark:text-primaryDark" strokeWidth={1.8} />
                </div>
                <div>
                  <h3 className="text-base font-bold text-gray-900 dark:text-white mb-2">{title}</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">{desc}</p>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Real how-it-works photo strip */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="relative rounded-3xl overflow-hidden shadow-2xl shadow-primary/10 aspect-[21/9]"
          >
            <img src="/images/howitworks_real.jpg" alt="Take an assessment" className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-r from-primary/70 via-primary/30 to-transparent" />
            <div className="absolute inset-0 flex items-center px-10">
              <div className="max-w-sm">
                <p className="text-white/80 text-xs font-bold uppercase tracking-widest mb-2">Built for everyone</p>
                <p className="text-white text-2xl font-extrabold leading-snug">Simple. Private. Insightful.</p>
                <p className="text-white/70 text-sm mt-2">Answer honestly. Your results stay with you.</p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════════
          STATS
      ══════════════════════════════════════════════════════════════════ */}
      <section className="py-20 bg-gradient-to-br from-primary via-accent to-primary dark:from-primary/90 dark:to-accent/90">
        <div className="max-w-6xl mx-auto px-6 sm:px-8 lg:px-12">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center text-white">
            {[
              { icon: BarChart3, value: 5, suffix: '+',   label: 'Assessments Available' },
              { icon: Star,      value: 100, suffix: '%', label: 'Completely Free' },
              { icon: Shield,    value: 100, suffix: '%', label: 'Research Backed'  },
              { icon: Zap,       value: 60,  suffix: 's', label: 'Instant Results'  },
            ].map(({ icon: Icon, value, suffix, label }, i) => (
              <motion.div
                key={label}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.08 }}
                className="flex flex-col items-center gap-3"
              >
                <Icon size={24} className="opacity-80" strokeWidth={1.5} />
                <p className="text-4xl sm:text-5xl font-extrabold tracking-tight">
                  <CountUp target={value} suffix={suffix} />
                </p>
                <p className="text-sm text-white/75 font-medium">{label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════════
          FEATURED ASSESSMENTS
      ══════════════════════════════════════════════════════════════════ */}
      <section className="py-24 bg-surfaceLight dark:bg-surfaceDark">
        <div className="max-w-6xl mx-auto px-6 sm:px-8 lg:px-12">

          <div className="text-center mb-14">
            <p className="text-xs font-bold uppercase tracking-widest text-primary dark:text-primaryDark mb-3">Our Assessments</p>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 dark:text-white mb-4">Explore the Library</h2>
            <p className="text-gray-500 dark:text-gray-400 max-w-lg mx-auto">
              Scientifically validated tools used by millions, now available free to everyone.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
            {featured.map((a, i) => <AssessmentCard key={a.id} assessment={a} index={i} />)}
          </div>

          <div className="flex justify-center">
            <Link
              to="/assessments"
              className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full border-2 border-primary dark:border-primaryDark text-primary dark:text-primaryDark font-bold text-sm hover:bg-primary dark:hover:bg-primaryDark hover:text-white transition-all duration-200"
            >
              View All Assessments <ArrowRight size={15} />
            </Link>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════════
          TRUST / WHY MINDMETRIC
      ══════════════════════════════════════════════════════════════════ */}
      <section className="py-20 bg-white dark:bg-cardDark">
        <div className="max-w-6xl mx-auto px-6 sm:px-8 lg:px-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -24 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              <p className="text-xs font-bold uppercase tracking-widest text-primary dark:text-primaryDark mb-4">Why MindMetric</p>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 dark:text-white mb-6 leading-tight">
                Built on real science.<br />Designed for everyone.
              </h2>
              <p className="text-gray-500 dark:text-gray-400 leading-relaxed mb-8">
                Every assessment on MindMetric is based on peer-reviewed psychological research. We translate complex academic instruments into accessible, engaging experiences — with AI-powered insights to help you actually understand your results.
              </p>
              <div className="grid grid-cols-2 gap-4">
                {[
                  { icon: Brain,    title: 'Evidence-based',   desc: 'Published & validated scales' },
                  { icon: Shield,   title: 'Private',          desc: 'Data never leaves your device' },
                  { icon: Zap,      title: 'Instant insights', desc: 'AI analysis in seconds' },
                  { icon: TrendingUp, title: 'Track progress', desc: 'Dashboard history included' },
                ].map(({ icon: Icon, title, desc }) => (
                  <div key={title} className="flex items-start gap-3 p-4 rounded-2xl bg-surfaceLight dark:bg-surfaceDark border border-gray-200 dark:border-gray-700/40">
                    <div className="w-8 h-8 rounded-xl bg-primary/10 dark:bg-primaryDark/15 flex items-center justify-center flex-shrink-0">
                      <Icon size={15} className="text-primary dark:text-primaryDark" strokeWidth={2} />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-gray-900 dark:text-white mb-0.5">{title}</p>
                      <p className="text-[11px] text-gray-500 dark:text-gray-400">{desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 24 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.15 }}
              className="flex flex-col gap-4"
            >
              {[
                { icon: CheckCircle, text: 'Free to use, forever. No premium plan, no credit card.' },
                { icon: CheckCircle, text: 'Your answers stay on your device — we never see them.' },
                { icon: CheckCircle, text: 'Instant AI-generated insights in plain, empathetic language.' },
                { icon: CheckCircle, text: 'Download your full PDF report with all scores and guidance.' },
                { icon: CheckCircle, text: 'Track your results over time in the personal Dashboard.' },
              ].map(({ icon: Icon, text }, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: 16 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.35, delay: i * 0.08 }}
                  className="flex items-start gap-3 p-5 rounded-2xl border border-gray-200 dark:border-gray-700/50 bg-surfaceLight dark:bg-surfaceDark"
                >
                  <Icon size={16} className="text-emerald-500 flex-shrink-0 mt-0.5" strokeWidth={2.5} />
                  <p className="text-sm text-gray-700 dark:text-gray-200 leading-relaxed">{text}</p>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════════
          FAQ
      ══════════════════════════════════════════════════════════════════ */}
      <section className="py-24 bg-surfaceLight dark:bg-surfaceDark">
        <div className="max-w-3xl mx-auto px-6 sm:px-8 lg:px-12">

          <div className="text-center mb-14">
            <p className="text-xs font-bold uppercase tracking-widest text-primary dark:text-primaryDark mb-3">FAQ</p>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 dark:text-white mb-4">Common Questions</h2>
            <p className="text-gray-500 dark:text-gray-400">Everything you need to know before you start</p>
          </div>

          <div className="flex flex-col gap-3">
            {FAQS.map((faq, i) => <FAQItem key={i} {...faq} index={i} />)}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════════
          CTA BANNER
      ══════════════════════════════════════════════════════════════════ */}
      <section className="py-24 bg-white dark:bg-cardDark">
        <div className="max-w-6xl mx-auto px-6 sm:px-8 lg:px-12">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="relative rounded-3xl overflow-hidden text-white"
          >
            {/* Background: real landscape photo */}
            <img src="/images/cta_real.jpg" alt="" className="absolute inset-0 w-full h-full object-cover" aria-hidden="true" />
            {/* Strong overlay for text readability */}
            <div className="absolute inset-0 bg-gradient-to-br from-primary/90 via-accent/85 to-primary/90" />

            <div className="relative grid grid-cols-1 lg:grid-cols-2 gap-8 items-center p-10 sm:p-14">
              {/* Text */}
              <div>
                <div className="w-14 h-14 rounded-2xl bg-white/15 flex items-center justify-center mb-6">
                  <Brain size={28} className="text-white" strokeWidth={1.5} />
                </div>
                <h2 className="text-3xl sm:text-4xl font-extrabold mb-4 leading-tight">Ready to discover yourself?</h2>
                <p className="text-white/75 mb-8 text-base leading-relaxed max-w-md">
                  Take your first assessment in under 5 minutes. No sign-up, no fees, no data collected.
                </p>
                <button
                  onClick={() => navigate('/assessments')}
                  className="inline-flex items-center gap-2 px-8 py-4 rounded-full bg-white text-primary font-extrabold text-sm hover:scale-105 active:scale-95 shadow-xl shadow-black/20 transition-all duration-200"
                >
                  Start Exploring <ArrowRight size={16} />
                </button>
              </div>
              {/* Real dashboard/results image */}
              <div className="hidden lg:flex items-center justify-center">
                <div className="relative w-72 h-72">
                  <div className="absolute inset-0 rounded-3xl shadow-2xl" />
                  <img src="/images/dashboard_real.jpg" alt="Your personal growth journey" className="relative w-full h-full object-cover rounded-3xl shadow-2xl" />
                  <div className="absolute inset-0 rounded-3xl bg-gradient-to-t from-primary/40 to-transparent" />
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

    </div>
  )
}
