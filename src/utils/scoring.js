// Applies reverse formula string like "6-x", "5-x", "8-x"
function rev(value, formula) {
  if (!formula) return value
  return parseInt(formula) - value
}

function scoreTotalSum(assessment, responses) {
  const { scoring, questions, interpretations } = assessment
  let total = 0
  for (const q of questions) {
    const raw = responses[q.id] ?? 0
    total += q.reverse ? rev(raw, scoring.reverseFormula) : raw
  }
  const range = interpretations.total.find(r => total >= r.min && total <= r.max) ?? {}
  return {
    method: scoring.method,
    total,
    interpretation: range,
  }
}

function scoreTotalSumNormalized(assessment, responses) {
  const { scoring, questions, interpretations } = assessment
  let raw = 0
  for (const q of questions) {
    const v = responses[q.id] ?? assessment.scale?.min ?? 1
    raw += q.reverse ? rev(v, scoring.reverseFormula) : v
  }
  const { min, max } = scoring.totalRange
  const percent = Math.round(((raw - min) / (max - min)) * 100)
  const range = interpretations.total.find(r => percent >= r.min && percent <= r.max) ?? {}
  return {
    method: scoring.method,
    total: raw,
    percent,
    subscales: { [assessment.shortTitle]: percent },
    interpretation: range,
  }
}

function scoreSubscaleSumNormalized(assessment, responses) {
  const { scoring, questions, interpretations } = assessment
  const subscaleScores = {}
  const subscaleInterps = {}

  for (const sub of scoring.subscales) {
    let sum = 0
    for (const qId of sub.items) {
      const q = questions.find(q => q.id === qId)
      const raw = responses[qId] ?? 1
      sum += q?.reverse ? rev(raw, scoring.reverseFormula) : raw
    }
    const pct = Math.round(((sum - sub.rawMin) / (sub.rawMax - sub.rawMin)) * 100)
    subscaleScores[sub.id] = pct
    const interps = interpretations.subscales?.[sub.id] ?? []
    subscaleInterps[sub.id] = interps.find(r => pct >= r.min && pct <= r.max) ?? {}
  }

  return { method: scoring.method, subscales: subscaleScores, interpretations: subscaleInterps }
}

function scoreSubscaleAvgNormalized(assessment, responses) {
  const { scoring, questions, interpretations } = assessment
  const subscaleScores = {}
  const subscaleInterps = {}

  for (const sub of scoring.subscales) {
    let sum = 0
    for (const qId of sub.items) {
      const q = questions.find(q => q.id === qId)
      const raw = responses[qId] ?? 1
      sum += q?.reverse ? rev(raw, scoring.reverseFormula) : raw
    }
    const avg = sum / sub.itemCount
    const pct = Math.round(((avg - sub.rawMin) / (sub.rawMax - sub.rawMin)) * 100)
    subscaleScores[sub.id] = pct
    const interps = interpretations.subscales?.[sub.id] ?? []
    subscaleInterps[sub.id] = interps.find(r => pct >= r.min && pct <= r.max) ?? {}
  }

  // Determine combined attachment type
  let attachmentType = null
  if (assessment.id === 'attachment-style') {
    const ax = subscaleScores['Anxiety'] ?? 0
    const av = subscaleScores['Avoidance'] ?? 0
    attachmentType = interpretations.combined?.find(c => {
      const { anxietyMin = 0, anxietyMax = 100, avoidanceMin = 0, avoidanceMax = 100 } = c.condition
      return ax >= anxietyMin && ax <= anxietyMax && av >= avoidanceMin && av <= avoidanceMax
    }) ?? null
  }

  return { method: scoring.method, subscales: subscaleScores, interpretations: subscaleInterps, attachmentType }
}

export function calculateScore(assessment, responses) {
  switch (assessment.scoring.method) {
    case 'total-sum':                   return scoreTotalSum(assessment, responses)
    case 'total-sum-normalized':        return scoreTotalSumNormalized(assessment, responses)
    case 'subscale-sum-normalized':     return scoreSubscaleSumNormalized(assessment, responses)
    case 'subscale-average-normalized': return scoreSubscaleAvgNormalized(assessment, responses)
    default: return { error: 'Unknown scoring method' }
  }
}

export function saveResult(assessment, responses, scoreResult) {
  const key = 'mindmetric_results'
  const all = JSON.parse(localStorage.getItem(key) ?? '{}')
  all[assessment.id] = {
    assessmentId: assessment.id,
    assessmentTitle: assessment.title,
    category: assessment.category,
    completedAt: new Date().toISOString(),
    responses,
    scores: scoreResult,
  }
  localStorage.setItem(key, JSON.stringify(all))
}

export function loadResult(assessmentId) {
  const all = JSON.parse(localStorage.getItem('mindmetric_results') ?? '{}')
  return all[assessmentId] ?? null
}

export function loadAllResults() {
  return JSON.parse(localStorage.getItem('mindmetric_results') ?? '{}')
}
