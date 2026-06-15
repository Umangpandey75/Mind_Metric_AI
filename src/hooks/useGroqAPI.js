import { useState, useEffect, useRef } from 'react'

const GROQ_URL   = 'https://api.groq.com/openai/v1/chat/completions'
const MODEL      = 'llama-3.1-8b-instant'
const MAX_TOKENS = 1500

function buildPrompt(assessmentTitle, scores) {
  return `You are a compassionate, evidence-based psychologist interpreting assessment results for a non-clinical audience.

A user completed the "${assessmentTitle}" psychological assessment. Their scores are:
${JSON.stringify(scores, null, 2)}

Write a detailed, warm, and personalised interpretation using exactly these four section headings:

PROFILE:
Write three paragraphs. First: describe their overall psychological profile based on the scores. Second: explain what these patterns mean in daily life situations. Third: describe how these traits likely shape their relationships and work style.

STRENGTHS:
List five specific, concrete strengths this person likely has based on their scores. Start each point with a dash and a strength label in capitals followed by a colon, then explain it.

GROWTH AREAS:
List four specific growth opportunities tied directly to their lower scores. Start each point with a dash and the growth area label in capitals followed by a colon, then give a practical suggestion.

GUIDANCE:
Write three paragraphs of warm, practical, actionable advice. Include one specific habit or practice they can start this week. End with an encouraging closing sentence.

Tone: empathetic, professional, encouraging. Use plain text only — no asterisks, no markdown formatting.`
}

/**
 * useGroqAPI
 * @param {string} assessmentTitle  — e.g. "Big Five Personality (BFI)"
 * @param {object|null} scores      — score object; pass null to skip the call
 * @returns {{ interpretation: string, loading: boolean, error: string|null }}
 */
export default function useGroqAPI(assessmentTitle, scores) {
  const [interpretation, setInterpretation] = useState('')
  const [loading, setLoading]               = useState(false)
  const [error, setError]                   = useState(null)

  // Keep a ref to abort in-flight requests when inputs change or component unmounts
  const abortRef = useRef(null)

  useEffect(() => {
    // Skip if no scores provided yet
    if (!scores || !assessmentTitle) return

    const apiKey = import.meta.env.VITE_GROQ_API_KEY
    if (!apiKey) {
      setError('Groq API key is not configured. Add VITE_GROQ_API_KEY to your .env file.')
      return
    }

    // Cancel any previous in-flight request
    if (abortRef.current) abortRef.current.abort()
    const controller = new AbortController()
    abortRef.current = controller

    async function fetchInterpretation() {
      setLoading(true)
      setError(null)
      setInterpretation('')

      try {
        const response = await fetch(GROQ_URL, {
          method: 'POST',
          signal: controller.signal,
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${apiKey}`,
          },
          body: JSON.stringify({
            model: MODEL,
            max_tokens: MAX_TOKENS,
            messages: [
              {
                role: 'user',
                content: buildPrompt(assessmentTitle, scores),
              },
            ],
          }),
        })

        if (!response.ok) {
          const errBody = await response.json().catch(() => ({}))
          throw new Error(
            errBody?.error?.message ?? `Groq API error ${response.status}`
          )
        }

        const data = await response.json()
        const text = data?.choices?.[0]?.message?.content ?? ''

        if (!text) throw new Error('Empty response from Groq API.')

        setInterpretation(text.trim())
      } catch (err) {
        if (err.name === 'AbortError') return   // intentional cancel — no state update
        setError(err.message ?? 'An unexpected error occurred.')
      } finally {
        setLoading(false)
      }
    }

    fetchInterpretation()

    return () => {
      controller.abort()
    }
  // Re-run only when the scores object identity changes (caller should memoize)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [assessmentTitle, scores])

  return { interpretation, loading, error }
}
