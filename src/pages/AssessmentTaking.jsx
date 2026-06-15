import { useState, useEffect, useRef, useCallback } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronLeft, ChevronRight, CheckCircle } from 'lucide-react'
import assessmentRegistry from '../data/assessmentRegistry'
import { calculateScore, saveResult } from '../utils/scoring'
import Button from '../components/ui/Button'

/* ── Slide animation variants ────────────────────────────────────────────── */
const slideVariants = {
  enter:  (dir) => ({ x: dir > 0 ? 60 : -60, opacity: 0 }),
  center: { x: 0, opacity: 1, transition: { duration: 0.28, ease: [0.4, 0, 0.2, 1] } },
  exit:   (dir) => ({ x: dir > 0 ? -60 : 60, opacity: 0, transition: { duration: 0.2 } }),
}

/* ── Likert option button ────────────────────────────────────────────────── */
function OptionBtn({ value, label, selected, onClick }) {
  return (
    <button
      onClick={() => onClick(value)}
      className={[
        'flex items-center gap-3 w-full px-4 py-3 rounded-xl border text-sm text-left',
        'transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary/50',
        selected
          ? 'border-primary dark:border-primaryDark bg-primary/8 dark:bg-primaryDark/12 text-primary dark:text-primaryDark font-semibold shadow-sm shadow-primary/10'
          : 'border-gray-200 dark:border-gray-700 bg-white dark:bg-cardDark text-gray-700 dark:text-gray-200 hover:border-primary/40 dark:hover:border-primaryDark/40 hover:bg-primary/4 dark:hover:bg-primaryDark/8',
      ].join(' ')}
    >
      <span className={[
        'flex-shrink-0 w-6 h-6 rounded-full border-2 flex items-center justify-center text-[10px] font-bold',
        selected
          ? 'border-primary dark:border-primaryDark bg-primary dark:bg-primaryDark text-white'
          : 'border-gray-300 dark:border-gray-600 text-gray-400',
      ].join(' ')}>
        {value}
      </span>
      <span className="leading-snug">{label}</span>
    </button>
  )
}

/* ── Compact 7-point scale (ECR-R) ──────────────────────────────────────── */
function Scale7({ value, labels, minLabel, maxLabel, onChange }) {
  return (
    <div className="w-full">
      <div className="flex justify-between text-[10px] text-gray-400 dark:text-gray-500 mb-2 px-1">
        <span>{minLabel}</span><span>{maxLabel}</span>
      </div>
      <div className="flex gap-2 justify-between">
        {labels.map((_, i) => {
          const v = i + 1
          return (
            <button
              key={v}
              onClick={() => onChange(v)}
              className={[
                'flex-1 flex flex-col items-center gap-1 py-3 rounded-xl border text-xs font-bold transition-all duration-200',
                value === v
                  ? 'border-primary dark:border-primaryDark bg-primary dark:bg-primaryDark text-white shadow-md shadow-primary/20'
                  : 'border-gray-200 dark:border-gray-700 bg-white dark:bg-cardDark text-gray-500 dark:text-gray-400 hover:border-primary/40 dark:hover:border-primaryDark/40',
              ].join(' ')}
            >
              {v}
            </button>
          )
        })}
      </div>
      <div className="flex justify-between text-[10px] text-gray-400 dark:text-gray-500 mt-2 px-1">
        <span>Strongly Disagree</span><span>Strongly Agree</span>
      </div>
    </div>
  )
}

/* ── Question renderer ───────────────────────────────────────────────────── */
function QuestionInput({ question, scale, currentValue, onChange }) {
  if (scale?.type === 'likert7') {
    return (
      <Scale7
        value={currentValue}
        labels={scale.labels}
        minLabel={scale.labels[0]}
        maxLabel={scale.labels[scale.labels.length - 1]}
        onChange={onChange}
      />
    )
  }
  // likert4 or likert5
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
      {scale?.labels?.map((label, i) => {
        const v = scale.min + i
        return (
          <OptionBtn
            key={v}
            value={v}
            label={label}
            selected={currentValue === v}
            onClick={onChange}
          />
        )
      })}
    </div>
  )
}

/* ── Page ────────────────────────────────────────────────────────────────── */
export default function AssessmentTaking() {
  const params = useParams()
  const assessmentId = params.assessmentId ?? params.id
  const navigate = useNavigate()

  const assessment = assessmentRegistry.getById(assessmentId)

  const [currentIndex, setCurrentIndex] = useState(0)
  const [responses, setResponses] = useState({})
  const [direction, setDirection] = useState(1)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [hasAttemptedNext, setHasAttemptedNext] = useState(false)

  const questions = assessment?.questions ?? []
  const total = questions.length
  const question = questions[currentIndex]
  const currentValue = responses[question?.id]
  const progress = Math.round(((currentIndex) / total) * 100)
  const isLast = currentIndex === total - 1
  const answered = Object.keys(responses).length

  // Load saved progress
  useEffect(() => {
    if (!assessmentId) return
    try {
      const saved = localStorage.getItem(`mindmetric_progress_${assessmentId}`)
      if (saved) setResponses(JSON.parse(saved))
    } catch { /* ignore */ }
  }, [assessmentId])

  // Save progress whenever responses change
  useEffect(() => {
    if (!assessmentId || Object.keys(responses).length === 0) return
    localStorage.setItem(`mindmetric_progress_${assessmentId}`, JSON.stringify(responses))
  }, [responses, assessmentId])

  const handleAnswer = useCallback((value) => {
    setHasAttemptedNext(false)
    setResponses(prev => ({ ...prev, [question.id]: value }))
  }, [question?.id])

  const goNext = () => {
    if (currentValue === undefined) { setHasAttemptedNext(true); return }
    setHasAttemptedNext(false)
    if (isLast) {
      handleSubmit()
      return
    }
    setDirection(1)
    setCurrentIndex(i => i + 1)
  }

  const goPrev = () => {
    if (currentIndex === 0) return
    setHasAttemptedNext(false)
    setDirection(-1)
    setCurrentIndex(i => i - 1)
  }

  const handleSubmit = () => {
    setIsSubmitting(true)
    try {
      const scoreResult = calculateScore(assessment, responses)
      saveResult(assessment, responses, scoreResult)
      // Clear progress cache
      localStorage.removeItem(`mindmetric_progress_${assessmentId}`)
      navigate(`/results/${assessmentId}`)
    } catch (e) {
      console.error('Scoring error:', e)
      setIsSubmitting(false)
    }
  }

  if (!assessment) {
    return (
      <div className="min-h-screen flex items-center justify-center text-center px-4">
        <div>
          <p className="text-xl font-bold text-gray-900 dark:text-white mb-2">Assessment not found</p>
          <Link to="/assessments" className="text-primary dark:text-primaryDark text-sm hover:underline">← Back to library</Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-surfaceLight dark:bg-surfaceDark flex flex-col">

      {/* ── Progress bar (full width) ──────────────────────────────── */}
      <div className="fixed top-16 left-0 right-0 z-40 h-1 bg-gray-100 dark:bg-gray-800">
        <motion.div
          className="h-full bg-gradient-to-r from-primary to-accent"
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.4, ease: 'easeOut' }}
        />
      </div>

      {/* ── Header ────────────────────────────────────────────────── */}
      <div className="sticky top-16 z-30 bg-white/90 dark:bg-surfaceDark/90 backdrop-blur-md border-b border-gray-100 dark:border-gray-800/60">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between">
          <Link to={`/assessments/${assessmentId}`} className="text-xs text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors">
            ✕ Exit
          </Link>
          <div className="text-center">
            <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 truncate max-w-[180px] sm:max-w-xs">
              {assessment.shortTitle ?? assessment.title}
            </p>
          </div>
          <span className="text-xs font-medium text-gray-500 dark:text-gray-400 tabular-nums">
            {currentIndex + 1} / {total}
          </span>
        </div>
      </div>

      {/* ── Main content ──────────────────────────────────────────── */}
      <div className="flex-1 flex max-w-5xl mx-auto w-full px-4 sm:px-6 py-10 gap-10">

        {/* Question area */}
        <div className="flex-1 flex flex-col justify-center">

        {/* Question card */}
        <AnimatePresence mode="wait" custom={direction}>
          <motion.div
            key={question.id}
            custom={direction}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            className="mb-8"
          >
            {/* Subscale tag */}
            {question.subscale && (
              <span className="inline-block mb-3 text-[10px] uppercase tracking-widest font-semibold text-primary/70 dark:text-primaryDark/70">
                {question.subscale}
              </span>
            )}

            {/* Question text */}
            <p className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white leading-snug mb-8">
              {assessment.scale?.questionPrefix
                ? <><span className="text-gray-400 dark:text-gray-500 font-normal">{assessment.scale.questionPrefix} </span>{question.text}</>
                : question.text
              }
            </p>

            {/* Answer input */}
            <QuestionInput
              question={question}
              scale={assessment.scale}
              currentValue={currentValue}
              onChange={handleAnswer}
            />

            {/* "Please answer" nudge */}
            <AnimatePresence>
              {hasAttemptedNext && currentValue === undefined && (
                <motion.p
                  initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                  className="mt-3 text-xs text-amber-600 dark:text-amber-400 flex items-center gap-1.5"
                >
                  <span>⚠</span> Please select an answer before continuing.
                </motion.p>
              )}
            </AnimatePresence>
          </motion.div>
        </AnimatePresence>

        {/* ── Navigation buttons ─────────────────────────────────── */}
        <div className="flex items-center justify-between gap-4">
          <Button
            variant="ghost"
            size="medium"
            leftIcon={<ChevronLeft size={16} />}
            onClick={goPrev}
            disabled={currentIndex === 0}
          >
            Previous
          </Button>

          <div className="flex flex-col items-center gap-1">
            <span className="text-[10px] text-gray-300 dark:text-gray-600">
              {answered} of {total} answered
            </span>
            {/* Dot progress */}
            <div className="flex gap-1">
              {Array.from({ length: Math.min(total, 12) }).map((_, i) => {
                const qId = questions[Math.floor((i / 12) * total)]?.id ?? questions[i]?.id
                const done = responses[qId] !== undefined
                return (
                  <span
                    key={i}
                    className={`w-1.5 h-1.5 rounded-full transition-colors duration-200 ${done ? 'bg-primary dark:bg-primaryDark' : 'bg-gray-200 dark:bg-gray-700'}`}
                  />
                )
              })}
            </div>
          </div>

          <Button
            id="next-question-btn"
            variant="primary"
            size="medium"
            rightIcon={isLast ? <CheckCircle size={16} /> : <ChevronRight size={16} />}
            loading={isSubmitting}
            onClick={goNext}
          >
            {isLast ? 'Submit' : 'Next'}
          </Button>
        </div>{/* end nav */}
        </div>{/* end question area */}

        {/* Right: real focused person photo (hidden on mobile) */}
        <div className="hidden lg:flex flex-col items-center justify-center flex-shrink-0 w-64">
          <div className="relative w-full rounded-3xl overflow-hidden shadow-lg aspect-[3/4]">
            <img
              src="/images/taking_real.jpg"
              alt="Take your time and answer thoughtfully"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-indigo-950/50 via-transparent to-transparent" />
          </div>
          <p className="mt-4 text-xs text-center text-gray-400 dark:text-gray-500 leading-relaxed max-w-[180px]">
            Take your time. There are no right or wrong answers.
          </p>
        </div>

      </div>{/* end flex outer */}
    </div>
  )
}
