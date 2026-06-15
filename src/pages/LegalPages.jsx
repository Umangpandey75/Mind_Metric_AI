import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ShieldCheck, ArrowLeft, Clock, FileText } from 'lucide-react'

const LAST_UPDATED = 'May 6, 2025'

function PageWrapper({ title, subtitle, icon: Icon, children }) {
  return (
    <div className="min-h-screen bg-surfaceLight dark:bg-surfaceDark">
      <div className="max-w-3xl mx-auto px-6 sm:px-8 py-10 sm:py-16">

        {/* Back */}
        <Link to="/" className="inline-flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 hover:text-primary dark:hover:text-primaryDark transition-colors mb-10">
          <ArrowLeft size={15} /> Back to Home
        </Link>

        {/* Hero */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.45 }}>
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-2xl bg-primary/10 dark:bg-primaryDark/15 flex items-center justify-center">
              <Icon size={20} className="text-primary dark:text-primaryDark" strokeWidth={1.8} />
            </div>
            <span className="text-xs font-bold uppercase tracking-widest text-primary dark:text-primaryDark">MindMetric</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 dark:text-white mb-3 tracking-tight">{title}</h1>
          <p className="text-gray-500 dark:text-gray-400 text-sm mb-2">{subtitle}</p>
          <div className="flex items-center gap-1.5 text-xs text-gray-400 dark:text-gray-500">
            <Clock size={11} /> Last updated: {LAST_UPDATED}
          </div>
        </motion.div>

        {/* Divider */}
        <div className="h-px bg-gradient-to-r from-transparent via-gray-200 dark:via-gray-700 to-transparent my-10" />

        {/* Content */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, delay: 0.15 }}
          className="prose-custom space-y-8"
        >
          {children}
        </motion.div>

      </div>
    </div>
  )
}

function Section({ title, children }) {
  return (
    <section className="p-6 sm:p-8 rounded-2xl border border-gray-200 dark:border-gray-700/60 bg-white dark:bg-cardDark">
      <h2 className="text-base font-bold text-gray-900 dark:text-white mb-4">{title}</h2>
      <div className="space-y-3">{children}</div>
    </section>
  )
}

function P({ children }) {
  return <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">{children}</p>
}

function Ul({ items }) {
  return (
    <ul className="space-y-2 mt-2">
      {items.map((item, i) => (
        <li key={i} className="flex items-start gap-2.5 text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
          <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-primary dark:bg-primaryDark flex-shrink-0" />
          {item}
        </li>
      ))}
    </ul>
  )
}

/* ══════════════════════════════════════════
   PRIVACY POLICY
══════════════════════════════════════════ */
export function PrivacyPolicy() {
  return (
    <PageWrapper title="Privacy Policy" subtitle="How MindMetric collects, uses, and protects your information." icon={ShieldCheck}>

      <Section title="1. Our Core Commitment">
        <P>MindMetric is designed from the ground up to be private by default. We believe your psychological data is deeply personal, and we treat it that way.</P>
        <P>The simplest summary: we do not collect your personal data. We do not have a database of users. We do not know who you are.</P>
      </Section>

      <Section title="2. Data We Do NOT Collect">
        <P>MindMetric does not collect, store, or transmit:</P>
        <Ul items={[
          'Your name, email address, or any contact information.',
          'Your assessment answers or results — these never leave your device.',
          'Your IP address or device identifiers.',
          'Any health, psychological, or sensitive personal data.',
          'Cookies used for tracking or advertising.',
        ]} />
      </Section>

      <Section title="3. Local Storage — How Your Results Are Saved">
        <P>When you complete an assessment, your results are saved using your browser's built-in localStorage technology. This means:</P>
        <Ul items={[
          'Your data is stored directly on your device, in your browser.',
          'No data is sent to any MindMetric server or third party.',
          'You can delete your data at any time by clearing your browser\'s site data.',
          'Your results are only visible to you on the device and browser you used.',
        ]} />
        <P>If you use a different browser or device, or clear your browser data, your results will not be available.</P>
      </Section>

      <Section title="4. AI Insights — Groq API">
        <P>When you request AI-generated insights after completing an assessment, your score summary (numbers only — not your individual answers) is sent to the Groq API to generate a personalised interpretation.</P>
        <P>This data is processed under Groq's own privacy policy. No personally identifying information is included in this request. The AI is given only numerical scores and the name of the assessment.</P>
      </Section>

      <Section title="5. No Third-Party Advertising">
        <P>MindMetric contains no advertising of any kind. We do not work with advertising networks, data brokers, or analytics companies that track users across websites.</P>
      </Section>

      <Section title="6. Children's Privacy">
        <P>MindMetric is intended for adults aged 18 and over. We do not knowingly provide services to minors. If you are under 18, please use this platform with parental guidance.</P>
      </Section>

      <Section title="7. Changes to This Policy">
        <P>We may update this policy as the platform evolves. Any material changes will be reflected in the "Last updated" date above. Continued use of MindMetric after a change constitutes acceptance of the revised policy.</P>
      </Section>

      <Section title="8. Contact">
        <P>This is a personal educational project. For questions or concerns about privacy, please reach out via the GitHub repository linked in the footer.</P>
      </Section>

    </PageWrapper>
  )
}

/* ══════════════════════════════════════════
   TERMS OF SERVICE
══════════════════════════════════════════ */
export function TermsOfService() {
  return (
    <PageWrapper title="Terms of Service" subtitle="The rules and conditions that govern your use of MindMetric." icon={FileText}>

      <Section title="1. Acceptance of Terms">
        <P>By using MindMetric, you agree to these Terms of Service. If you do not agree, please do not use the platform. These terms apply to all visitors and users of MindMetric.</P>
      </Section>

      <Section title="2. What MindMetric Is">
        <P>MindMetric is a free, educational self-assessment platform. It allows you to take validated psychological assessments and receive informational results and AI-generated interpretations.</P>
        <P>MindMetric is a personal, non-commercial educational project. It is not a healthcare service, a clinical tool, or a medical product.</P>
      </Section>

      <Section title="3. What MindMetric Is NOT">
        <Ul items={[
          'MindMetric is NOT a substitute for professional mental health care.',
          'MindMetric does NOT provide clinical diagnoses of any kind.',
          'MindMetric is NOT a licensed medical or therapeutic service.',
          'MindMetric assessments are NOT intended to be used as the sole basis for health-related decisions.',
          'MindMetric is NOT a crisis service. If you are in distress or danger, please call emergency services immediately.',
        ]} />
      </Section>

      <Section title="4. Your Responsibilities">
        <P>By using MindMetric, you agree to:</P>
        <Ul items={[
          'Use the platform for educational and personal self-awareness purposes only.',
          'Not use your results to self-diagnose, self-medicate, or avoid professional help.',
          'Consult a qualified mental health professional if your results suggest you may need support.',
          'Not attempt to reverse-engineer, scrape, or commercially exploit any part of the platform.',
          'Accept that your results are informational only and may not accurately reflect a clinical assessment.',
        ]} />
      </Section>

      <Section title="5. Disclaimer of Warranties">
        <P>MindMetric is provided "as is" without warranties of any kind, express or implied. We make no guarantee that the platform will be error-free, continuously available, or that results will be accurate for your specific circumstances.</P>
      </Section>

      <Section title="6. Limitation of Liability">
        <P>To the maximum extent permitted by law, MindMetric and its creator shall not be liable for any damages arising from your use of or reliance on the platform, including any physical, psychological, financial, or other harm.</P>
        <P>You use MindMetric entirely at your own risk and discretion.</P>
      </Section>

      <Section title="7. Intellectual Property">
        <P>The MindMetric application code, design, and content are the intellectual property of the creator. The psychological assessment instruments (BFI, PHQ-9, GAD-7, Rosenberg, ECR-R) are reproduced under their respective academic licensing terms and are credited to their original authors.</P>
      </Section>

      <Section title="8. Modifications">
        <P>We reserve the right to modify these terms at any time. The "Last updated" date at the top of this page reflects the most recent revision. Continued use of MindMetric after changes constitutes your acceptance of the new terms.</P>
      </Section>

    </PageWrapper>
  )
}

/* ══════════════════════════════════════════
   DISCLAIMER
══════════════════════════════════════════ */
export function Disclaimer() {
  return (
    <PageWrapper title="Important Disclaimer" subtitle="Please read this carefully before using any MindMetric assessment." icon={ShieldCheck}>

      {/* Alert banner */}
      <div className="flex items-start gap-3 p-5 rounded-2xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800/40">
        <ShieldCheck size={18} className="text-amber-500 flex-shrink-0 mt-0.5" strokeWidth={2} />
        <div>
          <p className="text-sm font-bold text-amber-800 dark:text-amber-300 mb-1">For Educational Purposes Only</p>
          <p className="text-sm text-amber-700 dark:text-amber-400/80 leading-relaxed">
            MindMetric assessments are educational tools, not clinical instruments. They are designed to increase self-awareness, not to diagnose any mental health condition.
          </p>
        </div>
      </div>

      <Section title="Not a Clinical Diagnosis">
        <P>The assessments on MindMetric — including the PHQ-9, GAD-7, Rosenberg Self-Esteem Scale, Big Five Inventory, and ECR-R — are validated research instruments. However, completing them on MindMetric does not constitute a clinical evaluation.</P>
        <P>A clinical diagnosis can only be made by a qualified, licensed mental health professional after a comprehensive evaluation that considers your full history, context, and presentation.</P>
        <P>Your MindMetric results are a starting point for self-reflection — not a medical conclusion.</P>
      </Section>

      <Section title="If You Are in Distress">
        <div className="p-5 rounded-xl bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800/40 mb-4">
          <p className="text-sm font-bold text-red-700 dark:text-red-400 mb-2">🆘 If you are having thoughts of suicide or self-harm, please reach out immediately:</p>
          <Ul items={[
            'India: iCall — 9152987821',
            'India: Vandrevala Foundation — 1860-2662-345 (24/7)',
            'International: findahelpline.com for your country\'s crisis line',
            'Emergency: Call your local emergency number (100 / 112 in India)',
          ]} />
        </div>
        <P>You are not alone. Help is available. Seeking support is an act of strength, not weakness.</P>
      </Section>

      <Section title="Limitations of AI Insights">
        <P>After completing an assessment, you receive AI-generated insights produced by an AI language model (Groq / LLaMA). These insights are:</P>
        <Ul items={[
          'Generated automatically based on your numeric scores only.',
          'Not reviewed or verified by a human mental health professional.',
          'Intended to help you reflect and understand your results — not to diagnose or prescribe.',
          'Sometimes imperfect. AI can make errors or produce generalised content.',
        ]} />
        <P>Always interpret AI insights with critical thinking and, where relevant, discuss them with a qualified professional.</P>
      </Section>

      <Section title="Accuracy and Research Basis">
        <P>All assessments are based on peer-reviewed, published psychological instruments with established validity and reliability. Their inclusion on MindMetric reflects their widespread academic use. However:</P>
        <Ul items={[
          'Results may vary based on your current state of mind when completing the assessment.',
          'Online self-report assessments have known limitations compared to structured clinical interviews.',
          'Personality and mental health exist on continuums — any score is a snapshot, not a fixed label.',
        ]} />
      </Section>

      <Section title="Who Should Use MindMetric">
        <P>MindMetric is suitable for:</P>
        <Ul items={[
          'Adults (18+) seeking to understand themselves better.',
          'People curious about psychology and personality.',
          'Individuals who want an accessible introduction to validated psychological concepts.',
        ]} />
        <P>MindMetric is not suitable as a replacement for treatment, therapy, or professional evaluation for anyone experiencing significant distress, impairment, or safety concerns.</P>
      </Section>

    </PageWrapper>
  )
}
