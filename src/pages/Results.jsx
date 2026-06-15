import { useEffect, useState, useMemo } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Download, ArrowLeft, ShieldCheck, Brain, RefreshCw,
  AlertCircle, ArrowRight, Sparkles, TrendingUp, User2,
  Target, Lightbulb, BarChart2, CheckCircle2, Clock,
} from 'lucide-react'
import { loadResult } from '../utils/scoring'
import { generateReport } from '../utils/reportGenerator'
import assessmentRegistry from '../data/assessmentRegistry'
import useGroqAPI from '../hooks/useGroqAPI'
import RadarChart from '../components/results/RadarChart'
import Badge from '../components/ui/Badge'
import Button from '../components/ui/Button'

/* ── Disclaimer ──────────────────────────────────────────────────────────── */
const DISCLAIMER =
  'MindMetric assessments are for educational and self-awareness purposes only. ' +
  'Results do not constitute a clinical diagnosis and must not replace professional evaluation.'

/* ══════════════════════════════════════════════════════════════════════════
   LOADING SCREEN
══════════════════════════════════════════════════════════════════════════ */
function LoadingScreen() {
  const [dots, setDots] = useState('')
  useEffect(() => {
    const t = setInterval(() => setDots(d => d.length >= 3 ? '' : d + '.'), 500)
    return () => clearInterval(t)
  }, [])

  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-white dark:bg-[#08081A] gap-8">
      <motion.div
        animate={{ scale: [1, 1.1, 1], opacity: [0.6, 1, 0.6] }}
        transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
        className="w-20 h-20 rounded-3xl bg-primary/10 dark:bg-primaryDark/15 flex items-center justify-center"
      >
        <Brain className="w-10 h-10 text-primary dark:text-primaryDark" strokeWidth={1.5} />
      </motion.div>
      <div className="text-center space-y-2">
        <p className="text-xl font-bold text-gray-900 dark:text-white">Calculating your results{dots}</p>
        <p className="text-sm text-gray-500 dark:text-gray-400">Analysing your responses with care</p>
      </div>
      <div className="w-64 h-1.5 rounded-full bg-gray-100 dark:bg-gray-800 overflow-hidden">
        <motion.div
          className="h-full bg-gradient-to-r from-primary to-accent rounded-full"
          initial={{ width: '0%' }}
          animate={{ width: '100%' }}
          transition={{ duration: 1.8, ease: 'easeInOut' }}
        />
      </div>
    </div>
  )
}

/* ══════════════════════════════════════════════════════════════════════════
   SCORE BAR — animated on mount
══════════════════════════════════════════════════════════════════════════ */
function ScoreBar({ label, pct, index, interp }) {
  const [width, setWidth] = useState(0)
  useEffect(() => {
    const t = setTimeout(() => setWidth(pct), 120 + index * 80)
    return () => clearTimeout(t)
  }, [pct, index])

  const color = pct >= 67 ? '#10B981' : pct >= 34 ? '#F59E0B' : '#EF4444'
  const level = interp?.level ?? (pct >= 67 ? 'High' : pct >= 34 ? 'Average' : 'Low')

  return (
    <div className="p-4 rounded-2xl border border-gray-100 dark:border-gray-700/60 bg-white dark:bg-[#111128] hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm font-semibold text-gray-800 dark:text-gray-100">{label}</span>
        <div className="flex items-center gap-2">
          <span className="text-lg font-extrabold tabular-nums" style={{ color }}>{Math.round(pct)}%</span>
          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full" style={{ background: color + '20', color }}>{level}</span>
        </div>
      </div>
      <div className="h-2.5 rounded-full bg-gray-100 dark:bg-gray-800 overflow-hidden">
        <div
          className="h-full rounded-full transition-all duration-700 ease-out"
          style={{ width: `${width}%`, backgroundColor: color }}
        />
      </div>
      {interp?.text && (
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-2 leading-relaxed">{interp.text}</p>
      )}
    </div>
  )
}

/* ══════════════════════════════════════════════════════════════════════════
   AI INTERPRETATION DISPLAY
══════════════════════════════════════════════════════════════════════════ */
const SECTION_META = {
  PROFILE:        { icon: User2,      title: 'Your Profile',     color: '#5B50F0', bg: 'bg-indigo-50 dark:bg-indigo-950/30',  border: 'border-indigo-200 dark:border-indigo-800/40' },
  STRENGTHS:      { icon: TrendingUp, title: 'Your Strengths',   color: '#10B981', bg: 'bg-emerald-50 dark:bg-emerald-950/30', border: 'border-emerald-200 dark:border-emerald-800/40' },
  'GROWTH AREAS': { icon: Target,     title: 'Growth Areas',     color: '#F59E0B', bg: 'bg-amber-50 dark:bg-amber-950/30',    border: 'border-amber-200 dark:border-amber-800/40' },
  GUIDANCE:       { icon: Lightbulb,  title: 'Personal Guidance', color: '#8B5CF6', bg: 'bg-violet-50 dark:bg-violet-950/30',  border: 'border-violet-200 dark:border-violet-800/40' },
}

const SECTION_KEYS = ['PROFILE', 'STRENGTHS', 'GROWTH AREAS', 'GUIDANCE']

function parseInterpretation(text) {
  if (!text) return {}
  const result = {}
  const parts = text.split(/\n(?=(?:PROFILE|STRENGTHS|GROWTH AREAS|GUIDANCE):)/i)
  for (const part of parts) {
    const match = part.match(/^(PROFILE|STRENGTHS|GROWTH AREAS|GUIDANCE):\s*/i)
    if (match) {
      const key = match[1].toUpperCase()
      result[key] = part.slice(match[0].length).trim()
    }
  }
  return result
}

function BulletLine({ text, color }) {
  const cleaned = text.replace(/^[-•*]\s*/, '').trim()
  if (!cleaned) return null
  const colonIdx = cleaned.indexOf(':')
  const label = colonIdx > 0 && colonIdx < 35 ? cleaned.slice(0, colonIdx) : null
  const rest  = label ? cleaned.slice(colonIdx + 1).trim() : cleaned

  return (
    <li className="flex items-start gap-3 py-2 border-b border-gray-100 dark:border-gray-800/60 last:border-0">
      <span className="mt-1 w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: color }} />
      <span className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
        {label && <strong className="text-gray-900 dark:text-white">{label}: </strong>}
        {rest}
      </span>
    </li>
  )
}

function InterpretationSection({ sectionKey, content }) {
  const meta = SECTION_META[sectionKey]
  if (!meta || !content) return null
  const Icon = meta.icon

  const isList = sectionKey === 'STRENGTHS' || sectionKey === 'GROWTH AREAS'
  const lines  = content.split('\n').map(l => l.trim()).filter(Boolean)

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, ease: [0.4, 0, 0.2, 1] }}
      className={`rounded-2xl border p-6 ${meta.bg} ${meta.border}`}
    >
      <div className="flex items-center gap-3 mb-4">
        <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0" style={{ backgroundColor: meta.color + '20' }}>
          <Icon size={16} style={{ color: meta.color }} strokeWidth={2.2} />
        </div>
        <h3 className="text-base font-bold text-gray-900 dark:text-white">{meta.title}</h3>
      </div>

      {isList ? (
        <ul className="space-y-0">
          {lines.map((line, i) => <BulletLine key={i} text={line} color={meta.color} />)}
        </ul>
      ) : (
        <div className="space-y-3">
          {lines.map((para, i) => (
            <p key={i} className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">{para}</p>
          ))}
        </div>
      )}
    </motion.div>
  )
}

function AIInsights({ title, scores, onInterpretation }) {
  const { interpretation, loading, error } = useGroqAPI(title, scores)
  const parsed = useMemo(() => parseInterpretation(interpretation), [interpretation])

  useEffect(() => {
    if (interpretation) onInterpretation?.(interpretation)
  }, [interpretation, onInterpretation])

  if (loading) return (
    <div className="flex flex-col items-center gap-4 py-14 text-center">
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 1.5, repeat: Infinity, ease: 'linear' }}
        className="w-10 h-10 rounded-full border-4 border-primary/20 border-t-primary"
      />
      <div>
        <p className="text-sm font-semibold text-gray-700 dark:text-gray-200">AI is generating your insights…</p>
        <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">Powered by Groq · llama-3.1-8b-instant</p>
      </div>
    </div>
  )

  if (error) return (
    <div className="flex items-start gap-3 p-5 rounded-2xl bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800/40">
      <AlertCircle size={18} className="text-red-500 flex-shrink-0 mt-0.5" />
      <div>
        <p className="text-sm font-semibold text-red-700 dark:text-red-400 mb-1">Could not load AI insights</p>
        <p className="text-xs text-red-600 dark:text-red-500 leading-relaxed">{error}</p>
        <p className="text-xs text-red-400 dark:text-red-600 mt-2">
          Ensure <code className="bg-red-100 dark:bg-red-900/40 px-1 rounded">VITE_GROQ_API_KEY</code> is set in your <code className="bg-red-100 dark:bg-red-900/40 px-1 rounded">.env</code> file.
        </p>
      </div>
    </div>
  )

  if (!interpretation) return null

  return (
    <div className="space-y-4">
      {SECTION_KEYS.map(key => <InterpretationSection key={key} sectionKey={key} content={parsed[key]} />)}
    </div>
  )
}

/* ══════════════════════════════════════════════════════════════════════════
   RECOMMENDED CARD
══════════════════════════════════════════════════════════════════════════ */
function RecommendedCard({ assessment }) {
  return (
    <Link
      to={`/assessments/${assessment.id}`}
      className="group block p-5 rounded-2xl border border-gray-200 dark:border-gray-700/60 bg-white dark:bg-[#111128] hover:border-primary dark:hover:border-primaryDark hover:shadow-lg hover:shadow-primary/10 hover:-translate-y-1 transition-all duration-300"
    >
      <div className="flex items-start justify-between gap-2 mb-3">
        <Badge text={assessment.category} color="indigo" size="sm" />
        <span className="text-xs text-gray-400 dark:text-gray-500 flex items-center gap-1">
          <Clock size={10} />{assessment.duration}m
        </span>
      </div>
      <h4 className="text-sm font-bold text-gray-900 dark:text-white group-hover:text-primary dark:group-hover:text-primaryDark transition-colors mb-1">{assessment.title}</h4>
      <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-2 leading-relaxed mb-3">{assessment.description}</p>
      <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-primary dark:text-primaryDark group-hover:gap-2.5 transition-all">
        Start <ArrowRight size={11} />
      </span>
    </Link>
  )
}

/* ══════════════════════════════════════════════════════════════════════════
   TOTAL SCORE DISPLAY (PHQ-9, GAD-7, Rosenberg)
══════════════════════════════════════════════════════════════════════════ */
function TotalScoreDisplay({ scores }) {
  const [displayVal, setDisplayVal] = useState(0)
  const target = scores.total ?? 0

  useEffect(() => {
    let start = 0
    const step = () => {
      start += Math.ceil((target - start) / 6)
      if (start >= target) { setDisplayVal(target); return }
      setDisplayVal(start)
      requestAnimationFrame(step)
    }
    const t = setTimeout(() => requestAnimationFrame(step), 300)
    return () => clearTimeout(t)
  }, [target])

  const label = scores?.interpretation?.label ?? ''
  const text  = scores?.interpretation?.text  ?? ''
  const colorMap = { 'indigo': '#5B50F0', 'green': '#10B981', 'yellow': '#F59E0B', 'red': '#EF4444', 'gray': '#6B7280' }
  const dotColor = colorMap[scores?.interpretation?.color] ?? '#5B50F0'

  return (
    <div className="flex flex-col items-center gap-5 p-10 rounded-3xl border border-gray-200 dark:border-gray-700/60 bg-white dark:bg-[#111128] text-center">
      <p className="text-xs font-bold uppercase tracking-widest text-gray-400 dark:text-gray-500">Total Score</p>
      <div className="relative">
        <p className="text-8xl font-extrabold tabular-nums text-gray-900 dark:text-white leading-none">{displayVal}</p>
        <div className="absolute -right-3 -top-2 w-4 h-4 rounded-full" style={{ backgroundColor: dotColor }} />
      </div>
      {label && (
        <span className="px-5 py-2 rounded-full text-sm font-bold" style={{ backgroundColor: dotColor + '15', color: dotColor, border: `1.5px solid ${dotColor}40` }}>
          {label}
        </span>
      )}
      {text && <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed max-w-sm">{text}</p>}
      {scores.percent !== undefined && (
        <div className="w-full max-w-sm">
          <div className="flex justify-between text-xs text-gray-400 mb-1.5">
            <span>Score range</span>
            <span>{Math.round(scores.percent)}th percentile</span>
          </div>
          <div className="h-2.5 rounded-full bg-gray-100 dark:bg-gray-800 overflow-hidden">
            <motion.div
              className="h-full rounded-full"
              style={{ backgroundColor: dotColor }}
              initial={{ width: 0 }}
              animate={{ width: `${scores.percent}%` }}
              transition={{ duration: 1, delay: 0.5, ease: 'easeOut' }}
            />
          </div>
        </div>
      )}
    </div>
  )
}

/* ══════════════════════════════════════════════════════════════════════════
   MAIN PAGE
══════════════════════════════════════════════════════════════════════════ */
export default function Results() {
  const params = useParams()
  const assessmentId = params.assessmentId ?? params.id
  const navigate = useNavigate()

  const [ready,      setReady]      = useState(false)
  const [result,     setResult]     = useState(null)
  const [pdfLoading, setPdfLoading] = useState(false)

  useEffect(() => {
    const data = loadResult(assessmentId)
    setResult(data)
    const t = setTimeout(() => setReady(true), 2200)
    return () => clearTimeout(t)
  }, [assessmentId])

  const assessment = assessmentRegistry.getById(assessmentId)

  const groqScores = useMemo(() => {
    if (!result?.scores) return null
    return result.scores.subscales ?? { 'Total Score': result.scores.total }
  }, [result])

  const recommended = useMemo(() => {
    if (!assessment) return []
    return assessmentRegistry.assessments
      .filter(a => a.category === assessment.category && a.id !== assessmentId)
      .slice(0, 3)
  }, [assessment, assessmentId])

  const [savedInterp, setSavedInterp] = useState('')

  const handleDownload = async () => {
    if (!result) return
    setPdfLoading(true)
    try {
      await generateReport(result.assessmentTitle, result.completedAt, result.scores, savedInterp)
    } catch (e) {
      console.error('PDF error:', e)
    } finally {
      setPdfLoading(false)
    }
  }

  const hasSubscales = Boolean(result?.scores?.subscales)
  const isMultiTrait = hasSubscales && Object.keys(result.scores.subscales).length >= 3

  /* ── Render ── */
  return (
    <>
      <AnimatePresence>{!ready && <LoadingScreen />}</AnimatePresence>

      {ready && (
        <div className="min-h-screen bg-[#F5F5FF] dark:bg-[#08081A]">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">

            {/* ── Top bar ──────────────────────────────────────── */}
            <div className="flex items-center justify-between flex-wrap gap-3">
              <button onClick={() => navigate(-1)} className="inline-flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 hover:text-primary dark:hover:text-primaryDark transition-colors font-medium">
                <ArrowLeft size={16} /> Back
              </button>
              <Button
                id="download-pdf-btn"
                variant="outline"
                size="small"
                loading={pdfLoading}
                leftIcon={<Download size={14} />}
                onClick={handleDownload}
                disabled={!result}
              >
                Download PDF
              </Button>
            </div>

            {/* ── No result guard ───────────────────────────────── */}
            {!result ? (
              <div className="flex flex-col items-center justify-center gap-5 py-28 text-center">
                <div className="w-16 h-16 rounded-2xl bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center">
                  <AlertCircle className="w-8 h-8 text-amber-500" />
                </div>
                <div>
                  <p className="text-xl font-bold text-gray-900 dark:text-white mb-2">No results found</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Complete the assessment first to see your results.</p>
                </div>
                <Link to="/assessments"><Button variant="primary">Go to Assessments</Button></Link>
              </div>
            ) : (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }} className="space-y-8">

                {/* ── Header card ──────────────────────────────── */}
                <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-primary to-accent text-white relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-64 h-64 rounded-full bg-white/5 -translate-y-1/2 translate-x-1/2" />
                  <div className="absolute bottom-0 left-0 w-40 h-40 rounded-full bg-white/5 translate-y-1/2 -translate-x-1/2" />
                  <div className="relative grid grid-cols-1 lg:grid-cols-2 gap-6 items-center">
                    <div>
                      <div className="flex items-center gap-2 mb-3">
                        <Badge text={assessment?.category ?? result.category} color="indigo" />
                        <span className="text-white/70 text-xs">·</span>
                        <span className="text-xs text-white/70 flex items-center gap-1">
                          <CheckCircle2 size={11} /> Completed {new Date(result.completedAt).toLocaleDateString('en-US', { dateStyle: 'medium' })}
                        </span>
                      </div>
                      <h1 className="text-2xl sm:text-3xl font-extrabold text-white mb-2 tracking-tight">{result.assessmentTitle}</h1>
                      <p className="text-white/70 text-sm mb-3">{assessment?.description}</p>
                      <p className="text-white/50 text-xs flex items-center gap-1.5">
                        <CheckCircle2 size={11} /> Your results are saved privately on this device
                      </p>
                    </div>
                    {/* Real insight photo */}
                    <div className="hidden lg:flex items-center justify-center">
                      <div className="relative w-48 h-48 rounded-2xl overflow-hidden shadow-2xl">
                        <img src="/images/results_real.jpg" alt="Your personalised insights" className="w-full h-full object-cover object-top" />
                        <div className="absolute inset-0 bg-gradient-to-t from-white/20 to-transparent" />
                      </div>
                    </div>
                  </div>
                </div>

                {/* ── Disclaimer ───────────────────────────────── */}
                <div className="flex items-start gap-3 p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200/70 dark:border-amber-800/40">
                  <ShieldCheck size={15} className="flex-shrink-0 mt-0.5 text-amber-500" />
                  <p className="text-xs leading-relaxed text-amber-700 dark:text-amber-300/80">
                    <span className="font-bold">Important: </span>{DISCLAIMER}
                  </p>
                </div>

                {/* ── Attachment type banner (ECR-R) ────────────── */}
                {result.scores?.attachmentType && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.97 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.3 }}
                    className="p-7 rounded-3xl border border-primary/20 dark:border-primaryDark/20 bg-gradient-to-br from-primary/5 to-accent/5 dark:from-primaryDark/10 dark:to-accent/10 text-center"
                  >
                    <p className="text-xs uppercase tracking-widest font-bold text-primary dark:text-primaryDark mb-2">Your Attachment Style</p>
                    <p className="text-4xl font-extrabold text-gray-900 dark:text-white mb-3">{result.scores.attachmentType.label}</p>
                    <p className="text-sm text-gray-600 dark:text-gray-300 max-w-md mx-auto leading-relaxed">{result.scores.attachmentType.text}</p>
                  </motion.div>
                )}

                {/* ══ SCORES SECTION ════════════════════════════ */}
                <section>
                  <div className="flex items-center gap-2 mb-5">
                    <BarChart2 size={18} className="text-primary dark:text-primaryDark" />
                    <h2 className="text-lg font-bold text-gray-900 dark:text-white">Your Scores</h2>
                  </div>

                  {/* Radar chart for multi-trait */}
                  {isMultiTrait && (
                    <div className="mb-5 p-5 rounded-2xl border border-gray-200 dark:border-gray-700/60 bg-white dark:bg-[#111128]">
                      <RadarChart scores={result.scores.subscales} />
                    </div>
                  )}

                  {/* Subscale bars */}
                  {hasSubscales && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {Object.entries(result.scores.subscales).map(([trait, pct], i) => (
                        <ScoreBar
                          key={trait}
                          label={trait}
                          pct={pct}
                          index={i}
                          interp={result.scores.interpretations?.subscales?.[trait]}
                        />
                      ))}
                    </div>
                  )}

                  {/* Total score */}
                  {!hasSubscales && result.scores?.total !== undefined && (
                    <TotalScoreDisplay scores={result.scores} />
                  )}
                </section>

                {/* ══ AI INSIGHTS SECTION ═══════════════════════ */}
                <section>
                  <div className="flex items-center gap-2 mb-5">
                    <Sparkles size={18} className="text-primary dark:text-primaryDark" />
                    <h2 className="text-lg font-bold text-gray-900 dark:text-white">AI Psychological Insights</h2>
                    <Badge text="Groq AI" color="purple" size="sm" />
                  </div>
                  <AIInsights title={assessment?.title ?? ''} scores={ready ? groqScores : null} onInterpretation={setSavedInterp} />
                </section>

                {/* ══ RECOMMENDED ════════════════════════════════ */}
                {recommended.length > 0 && (
                  <section>
                    <div className="flex items-center justify-between mb-5">
                      <div className="flex items-center gap-2">
                        <ArrowRight size={18} className="text-primary dark:text-primaryDark" />
                        <h2 className="text-lg font-bold text-gray-900 dark:text-white">Explore Next</h2>
                      </div>
                      <Link to="/assessments">
                        <Button variant="ghost" size="small" rightIcon={<ArrowRight size={12} />}>View all</Button>
                      </Link>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      {recommended.map(a => <RecommendedCard key={a.id} assessment={a} />)}
                    </div>
                  </section>
                )}

                {/* ══ RETAKE ════════════════════════════════════ */}
                <div className="flex items-center justify-center gap-4 py-4 border-t border-gray-200 dark:border-gray-800">
                  <Button
                    variant="ghost"
                    size="small"
                    leftIcon={<RefreshCw size={14} />}
                    onClick={() => navigate(`/assessments/${assessmentId}`)}
                  >
                    Retake Assessment
                  </Button>
                  <Button
                    variant="ghost"
                    size="small"
                    leftIcon={<Download size={14} />}
                    loading={pdfLoading}
                    onClick={handleDownload}
                  >
                    Download Report
                  </Button>
                </div>

              </motion.div>
            )}
          </div>
        </div>
      )}
    </>
  )
}
