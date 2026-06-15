import { jsPDF } from 'jspdf'

/* ── Constants ──────────────────────────────────────────────────────────── */
const PAGE_W   = 210   // A4 mm width
const PAGE_H   = 297   // A4 mm height
const MARGIN   = 18
const CONTENT_W = PAGE_W - MARGIN * 2   // 174mm

const FOOTER_TEXT =
  'This report is for educational purposes only and does not constitute a clinical diagnosis.'

const DISCLAIMER =
  'MindMetric assessments are for educational and self-awareness purposes only. ' +
  'The results in this report do not constitute a clinical diagnosis and must not be used ' +
  'as a substitute for professional psychological, psychiatric, or medical evaluation and ' +
  'treatment. If you are experiencing distress or symptoms that impact daily functioning, ' +
  'please consult a licensed mental health professional. The AI-generated insights included ' +
  'in this report are produced by a large language model and are not reviewed by clinicians. ' +
  'They should be treated as a starting point for personal reflection only.'

/* ── Color palette (RGB) ────────────────────────────────────────────────── */
const C = {
  indigo:    [79,  70,  229],
  indigoLight:[238, 237, 255],
  violet:    [124, 58,  237],
  gold:      [245, 158, 11],
  gray900:   [17,  24,  39],
  gray700:   [55,  65,  81],
  gray500:   [107, 114, 128],
  gray300:   [209, 213, 219],
  gray100:   [243, 244, 246],
  amber50:   [255, 251, 235],
  amber700:  [180, 83,  9],
  white:     [255, 255, 255],
  green:     [16,  185, 128],
  yellow:    [245, 158, 11],
  red:       [239, 68,  68],
}

/* ── Helpers ────────────────────────────────────────────────────────────── */
function setFont(doc, size, style = 'normal', color = C.gray900) {
  doc.setFontSize(size)
  doc.setFont('helvetica', style)
  doc.setTextColor(...color)
}

function addWrappedText(doc, text, x, y, maxW, lineH = 5) {
  const lines = doc.splitTextToSize(String(text), maxW)
  doc.text(lines, x, y)
  return y + lines.length * lineH
}

function newPage(doc) {
  doc.addPage()
  return MARGIN + 10   // top y after margin
}

function drawFooter(doc, pageNum, totalPages) {
  const y = PAGE_H - 10
  // Separator line
  doc.setDrawColor(...C.gray300)
  doc.setLineWidth(0.3)
  doc.line(MARGIN, y - 5, PAGE_W - MARGIN, y - 5)
  // Footer text
  setFont(doc, 7, 'normal', C.gray500)
  doc.text(FOOTER_TEXT, MARGIN, y)
  // Page number right-aligned
  doc.text(`Page ${pageNum} of ${totalPages}`, PAGE_W - MARGIN, y, { align: 'right' })
}

function drawProgressBar(doc, x, y, w, h, pct, color) {
  // Track
  doc.setFillColor(...C.gray100)
  doc.roundedRect(x, y, w, h, h / 2, h / 2, 'F')
  // Fill
  const fillW = Math.max(h, (pct / 100) * w)   // min width = height for rounded ends
  doc.setFillColor(...color)
  doc.roundedRect(x, y, fillW, h, h / 2, h / 2, 'F')
}

function levelColor(pct) {
  if (pct >= 67) return C.green
  if (pct >= 34) return C.yellow
  return C.red
}

function levelLabel(pct) {
  if (pct >= 67) return 'High'
  if (pct >= 34) return 'Medium'
  return 'Low'
}

/* ── Section parser (mirrors InterpretationDisplay logic) ────────────────── */
const SECTION_KEYS = ['PROFILE', 'STRENGTHS', 'GROWTH AREAS', 'GUIDANCE']

function parseInterpretation(text) {
  if (!text) return {}
  const result = {}
  const pattern = new RegExp(
    `(${SECTION_KEYS.map(k => k.replace(' ', '\\s+')).join('|')}):?`,
    'gi',
  )
  const parts = text.split(pattern).map(s => s.trim()).filter(Boolean)
  let current = null
  for (const part of parts) {
    const upper = part.toUpperCase().replace(/\s+/g, ' ')
    const matched = SECTION_KEYS.find(k => upper === k || upper === `${k}:`)
    if (matched) { current = matched; result[matched] = result[matched] ?? '' }
    else if (current) result[current] += (result[current] ? '\n' : '') + part
  }
  return result
}

/* ════════════════════════════════════════════════════════════════════════════
   PAGE 1 — Cover + Disclaimer
══════════════════════════════════════════════════════════════════════════════ */
function buildPage1(doc, assessmentTitle, completedDate) {
  let y = MARGIN

  // ── Brand bar ──
  doc.setFillColor(...C.indigo)
  doc.rect(0, 0, PAGE_W, 22, 'F')

  setFont(doc, 20, 'bold', C.white)
  doc.text('MindMetric', MARGIN, 14)

  setFont(doc, 9, 'normal', [180, 180, 255])
  doc.text('Psychological Assessment Report', PAGE_W - MARGIN, 14, { align: 'right' })

  y = 36

  // ── Assessment title ──
  setFont(doc, 22, 'bold', C.gray900)
  y = addWrappedText(doc, assessmentTitle, MARGIN, y, CONTENT_W, 9) + 3

  // ── Date ──
  setFont(doc, 10, 'normal', C.gray500)
  const dateStr = completedDate
    ? new Date(completedDate).toLocaleDateString('en-US', { dateStyle: 'long' })
    : new Date().toLocaleDateString('en-US', { dateStyle: 'long' })
  doc.text(`Completed: ${dateStr}`, MARGIN, y)
  y += 10

  // ── Divider ──
  doc.setDrawColor(...C.gray300)
  doc.setLineWidth(0.4)
  doc.line(MARGIN, y, PAGE_W - MARGIN, y)
  y += 10

  // ── Disclaimer box ──
  const boxPad = 6
  const disclaimerLines = doc.splitTextToSize(DISCLAIMER, CONTENT_W - boxPad * 2)
  const boxH = disclaimerLines.length * 4.8 + boxPad * 2 + 8

  doc.setFillColor(...C.amber50)
  doc.setDrawColor(...C.gold)
  doc.setLineWidth(0.6)
  doc.roundedRect(MARGIN, y, CONTENT_W, boxH, 3, 3, 'FD')

  setFont(doc, 8, 'bold', C.amber700)
  doc.text('⚠  IMPORTANT DISCLAIMER', MARGIN + boxPad, y + boxPad + 4)

  setFont(doc, 8, 'normal', C.amber700)
  doc.text(disclaimerLines, MARGIN + boxPad, y + boxPad + 11)

  y += boxH + 14

  // ── What's inside ──
  setFont(doc, 10, 'bold', C.gray700)
  doc.text('This report contains:', MARGIN, y)
  y += 6

  const contents = ['Page 2 — Score breakdown for each trait or subscale', 'Page 3 — AI-generated psychological insights (Profile, Strengths, Growth Areas, Guidance)']
  setFont(doc, 9, 'normal', C.gray500)
  for (const line of contents) {
    doc.text(`•  ${line}`, MARGIN + 3, y)
    y += 6
  }

  // ── Decorative accent bar at bottom of page ──
  doc.setFillColor(...C.indigoLight)
  doc.rect(0, PAGE_H - 28, PAGE_W, 18, 'F')
  setFont(doc, 8, 'italic', C.indigo)
  doc.text(
    '"Know your mind. Own your story." — MindMetric',
    PAGE_W / 2, PAGE_H - 17,
    { align: 'center' },
  )
}

/* ════════════════════════════════════════════════════════════════════════════
   PAGE 2 — Scores
══════════════════════════════════════════════════════════════════════════════ */
function buildPage2(doc, scores) {
  let y = MARGIN + 4

  // Page heading
  doc.setFillColor(...C.indigo)
  doc.rect(MARGIN, y, 3, 9, 'F')
  setFont(doc, 14, 'bold', C.gray900)
  doc.text('Your Scores', MARGIN + 7, y + 7)
  y += 18

  const hasSubscales = scores?.subscales && Object.keys(scores.subscales).length > 0
  const interps = scores?.interpretations?.subscales ?? {}

  if (hasSubscales) {
    // ── Subscale rows ──
    const entries = Object.entries(scores.subscales)
    for (const [trait, pct] of entries) {
      if (y > PAGE_H - 45) { doc.addPage(); y = MARGIN + 10 }

      const roundedPct = Math.round(pct)
      const lColor     = levelColor(roundedPct)
      const lLabel     = interps[trait]?.level ?? levelLabel(roundedPct)
      const interpText = interps[trait]?.text ?? ''

      // Trait name + level badge
      setFont(doc, 10, 'bold', C.gray900)
      doc.text(trait, MARGIN, y)

      // Level badge (pill)
      const badgeX = PAGE_W - MARGIN - 22
      doc.setFillColor(...lColor)
      doc.roundedRect(badgeX, y - 5, 22, 6, 3, 3, 'F')
      setFont(doc, 7, 'bold', C.white)
      doc.text(lLabel, badgeX + 11, y - 0.5, { align: 'center' })

      y += 5

      // Percentage
      setFont(doc, 18, 'bold', C.indigo)
      doc.text(`${roundedPct}%`, MARGIN, y + 6)

      // Progress bar
      drawProgressBar(doc, MARGIN + 20, y + 2, CONTENT_W - 20, 5, roundedPct, lColor)

      y += 10

      // Interpretation text
      if (interpText) {
        setFont(doc, 8, 'normal', C.gray500)
        y = addWrappedText(doc, interpText, MARGIN, y, CONTENT_W, 4.5) + 2
      }

      // Separator
      doc.setDrawColor(...C.gray100)
      doc.setLineWidth(0.3)
      doc.line(MARGIN, y, PAGE_W - MARGIN, y)
      y += 7
    }
  } else if (scores?.total !== undefined) {
    // ── Single total score ──
    const label = scores?.interpretation?.label ?? 'Your Score'
    const text  = scores?.interpretation?.text  ?? ''

    setFont(doc, 11, 'normal', C.gray700)
    doc.text('Total Score', MARGIN, y)
    y += 7

    setFont(doc, 36, 'bold', C.indigo)
    doc.text(String(scores.total), MARGIN, y + 8)
    y += 16

    if (label) {
      setFont(doc, 12, 'bold', C.gray700)
      doc.text(label, MARGIN, y)
      y += 7
    }

    if (text) {
      setFont(doc, 9, 'normal', C.gray500)
      y = addWrappedText(doc, text, MARGIN, y, CONTENT_W) + 4
    }
  }

  // Attachment type (ECR-R)
  if (scores?.attachmentType) {
    if (y > PAGE_H - 60) { doc.addPage(); y = MARGIN + 10 }
    y += 4
    doc.setFillColor(...C.indigoLight)
    doc.roundedRect(MARGIN, y, CONTENT_W, 30, 4, 4, 'F')

    setFont(doc, 8, 'bold', C.indigo)
    doc.text('ATTACHMENT STYLE', MARGIN + 6, y + 8)

    setFont(doc, 14, 'bold', C.gray900)
    doc.text(scores.attachmentType.label, MARGIN + 6, y + 17)

    if (scores.attachmentType.text) {
      setFont(doc, 8, 'normal', C.gray700)
      y = addWrappedText(doc, scores.attachmentType.text, MARGIN + 6, y + 24, CONTENT_W - 12, 4.5)
    } else {
      y += 33
    }
  }
}

/* ════════════════════════════════════════════════════════════════════════════
   PAGE 3 — AI Interpretation
══════════════════════════════════════════════════════════════════════════════ */
const SECTION_META = {
  PROFILE:       { title: 'Profile',       color: C.indigo },
  STRENGTHS:     { title: 'Strengths',     color: C.green  },
  'GROWTH AREAS':{ title: 'Growth Areas',  color: C.gold   },
  GUIDANCE:      { title: 'Guidance',      color: C.violet },
}

function buildPage3(doc, interpretationText) {
  let y = MARGIN + 4

  // Page heading
  doc.setFillColor(...C.violet)
  doc.rect(MARGIN, y, 3, 9, 'F')
  setFont(doc, 14, 'bold', C.gray900)
  doc.text('AI Psychological Insights', MARGIN + 7, y + 7)

  setFont(doc, 7, 'italic', C.gray500)
  doc.text('Powered by Groq · llama3-8b-8192 · Not reviewed by a licensed clinician', MARGIN + 7, y + 13)
  y += 22

  if (!interpretationText) {
    setFont(doc, 9, 'normal', C.gray500)
    doc.text('AI interpretation was not available for this report.', MARGIN, y)
    return
  }

  const parsed = parseInterpretation(interpretationText)

  for (const key of SECTION_KEYS) {
    const content = parsed[key]
    if (!content) continue

    const meta = SECTION_META[key] ?? { title: key, color: C.indigo }

    // Check if we need a new page
    const previewLines = doc.splitTextToSize(content, CONTENT_W - 6)
    const neededH = previewLines.length * 4.8 + 22
    if (y + neededH > PAGE_H - 22) { doc.addPage(); y = MARGIN + 10 }

    // Section accent + heading
    doc.setFillColor(...meta.color)
    doc.roundedRect(MARGIN, y, CONTENT_W, 8, 2, 2, 'F')
    setFont(doc, 9, 'bold', C.white)
    doc.text(meta.title.toUpperCase(), MARGIN + 5, y + 5.5)
    y += 11

    // Content
    const isBullet = key === 'STRENGTHS' || key === 'GROWTH AREAS'
    const lines = content.split('\n').map(l => l.replace(/^[-•*]\s*/, '').trim()).filter(Boolean)

    if (isBullet) {
      setFont(doc, 8.5, 'normal', C.gray700)
      for (const line of lines) {
        if (y > PAGE_H - 22) { doc.addPage(); y = MARGIN + 10 }
        // Bullet dot
        doc.setFillColor(...meta.color)
        doc.circle(MARGIN + 2.5, y - 0.8, 1, 'F')
        y = addWrappedText(doc, line, MARGIN + 7, y, CONTENT_W - 7, 4.8) + 2
      }
    } else {
      setFont(doc, 8.5, 'normal', C.gray700)
      const paragraphs = content.split(/\n{2,}/).map(p => p.trim()).filter(Boolean)
      for (const para of paragraphs) {
        if (y > PAGE_H - 22) { doc.addPage(); y = MARGIN + 10 }
        y = addWrappedText(doc, para, MARGIN, y, CONTENT_W, 4.8) + 4
      }
    }

    y += 6
  }
}

/* ════════════════════════════════════════════════════════════════════════════
   MAIN EXPORT
══════════════════════════════════════════════════════════════════════════════ */
/**
 * generateReport
 * @param {string} assessmentTitle   — e.g. "Big Five Personality (BFI)"
 * @param {string} completedDate     — ISO date string
 * @param {object} scores            — result.scores object from localStorage
 * @param {string} interpretationText — raw text from useGroqAPI
 * @returns {void} — triggers browser download
 */
export function generateReport(assessmentTitle, completedDate, scores, interpretationText) {
  const doc = new jsPDF({ unit: 'mm', format: 'a4', orientation: 'portrait' })

  // ── Page 1 ──────────────────────────────────────────────────────────────
  buildPage1(doc, assessmentTitle, completedDate)

  // ── Page 2 ──────────────────────────────────────────────────────────────
  doc.addPage()
  buildPage2(doc, scores)

  // ── Page 3 ──────────────────────────────────────────────────────────────
  doc.addPage()
  buildPage3(doc, interpretationText)

  // ── Footers on all pages ─────────────────────────────────────────────────
  const totalPages = doc.getNumberOfPages()
  for (let p = 1; p <= totalPages; p++) {
    doc.setPage(p)
    drawFooter(doc, p, totalPages)
  }

  // ── Save ─────────────────────────────────────────────────────────────────
  const safeName = assessmentTitle.replace(/[^a-z0-9]/gi, '-').toLowerCase()
  const dateSlug = new Date(completedDate || Date.now()).toISOString().slice(0, 10)
  doc.save(`MindMetric-${safeName}-${dateSlug}.pdf`)
}

export default generateReport
