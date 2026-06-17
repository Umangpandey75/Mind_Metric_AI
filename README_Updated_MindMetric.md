<div align="center">

# 🧠 MindMetric

### *Know Your Mind. Own Your Story.*

**A premium, research-backed psychological assessment platform — completely free, fully private, and AI-powered.**

[![React](https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-8-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vitejs.dev/)
[![TailwindCSS](https://img.shields.io/badge/Tailwind-4-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![Framer Motion](https://img.shields.io/badge/Framer_Motion-latest-FF0055?style=for-the-badge&logo=framer&logoColor=white)](https://www.framer.com/motion/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow?style=for-the-badge)](LICENSE)

🌐 **Live Demo:** https://mindmetric001.vercel.app/

</div>

---

## 📖 Table of Contents

- [About the Project](#-about-the-project)
- [Key Features](#-key-features)
- [Assessments Available](#-assessments-available)
- [Tech Stack](#-tech-stack)
- [Project Structure](#-project-structure)
- [Getting Started](#-getting-started)
- [Environment Variables](#-environment-variables)
- [How It Works](#-how-it-works)
- [AI Insights (Groq)](#-ai-insights-groq)
- [PDF Report Generation](#-pdf-report-generation)
- [Privacy Policy](#-privacy-policy)
- [Contributing](#-contributing)
- [Disclaimer](#-disclaimer)
- [Author](#-author)

---

## 🌟 About the Project

**MindMetric** is a modern, full-featured psychological assessment platform built entirely on the frontend. It allows anyone to explore peer-reviewed, clinically validated psychological tests — from the **Big Five Personality Model** to **PHQ-9 Depression Screening** — and instantly receive:

- 📊 Detailed, visual score breakdowns
- 🤖 AI-generated psychological insights (powered by Groq's `llama3-8b-8192` model)
- 📄 Downloadable A4 PDF reports with all results and guidance
- 🗂️ A personal dashboard to track progress over time

**No account. No server. No data ever leaves your device.**

---

## 🏆 Resume Highlights

- Developed a full-featured AI-powered psychological assessment platform using React 19 and Vite.
- Integrated Groq LLM API for personalized psychological insights.
- Implemented a client-side scoring engine for validated psychological assessments.
- Generated downloadable PDF reports using jsPDF.
- Designed a responsive and accessible UI using Tailwind CSS and Framer Motion.
- Ensured complete user privacy with localStorage-based data persistence.

---

## ✨ Key Features

| Feature | Description |
|---|---|
| 🧪 **5 Validated Assessments** | Peer-reviewed instruments used globally |
| 🤖 **AI Insights** | Personalised profile, strengths, growth areas & guidance via Groq |
| 📄 **PDF Report Export** | Beautiful, multi-page A4 report via jsPDF |
| 📈 **Results Dashboard** | Track and compare all your past assessments |
| 🌙 **Dark / Light Mode** | Fully themed across all components |
| 🔒 **100% Private** | All data stored in `localStorage` — nothing sent to any server |
| ⚡ **Instant Results** | Scoring computed client-side in milliseconds |
| 📱 **Fully Responsive** | Works on mobile, tablet, and desktop |
| ♿ **Accessible** | Semantic HTML, keyboard navigable, ARIA attributes |
| 🎨 **Premium UI** | Framer Motion animations, glassmorphism, smooth transitions |

---

## 🧪 Assessments Available

| ID | Assessment | Category | Questions | Duration |
|---|---|---|---|---|
| `big-five` | **Big Five Personality (BFI-44)** | Personality | 44 | ~10 min |
| `phq-9` | **Patient Health Questionnaire (PHQ-9)** | Mental Health | 9 | ~3 min |
| `gad-7` | **Generalised Anxiety Disorder Scale (GAD-7)** | Mental Health | 7 | ~3 min |
| `rosenberg-self-esteem` | **Rosenberg Self-Esteem Scale (RSES)** | Mental Health | 10 | ~4 min |
| `attachment-style` | **Adult Attachment Style (ECR-R)** | Behavioral | 36 | ~12 min |

Each assessment includes:
- Full question bank with validated Likert-scale items
- Subscale scoring with normalization (percentile-based)
- Interpretation ranges (Low / Medium / High / Clinical)
- Support for reverse-scored items

---

## 🛠️ Tech Stack

**Frontend Framework**
- [React 19](https://react.dev/) — UI library
- [Vite 8](https://vitejs.dev/) — Lightning-fast build tool & dev server
- [React Router v7](https://reactrouter.com/) — Client-side routing

**Styling & Animation**
- [Tailwind CSS v4](https://tailwindcss.com/) — Utility-first CSS
- [Framer Motion](https://www.framer.com/motion/) — Micro-animations and page transitions
- [Lucide React](https://lucide.dev/) — Icon system

**AI & Reporting**
- [Groq API](https://console.groq.com/) (`llama3-8b-8192`) — AI psychological insights
- [jsPDF](https://github.com/parallax/jsPDF) — Client-side PDF generation
- [html2canvas](https://html2canvas.hertzen.com/) — Canvas rendering for charts
- [Recharts](https://recharts.org/) — Data visualization (radar/bar charts)

**Storage**
- `localStorage` — All results persisted locally; no backend required

---

## 📁 Project Structure

```
mindmetric/
├── public/
│   └── images/                  # Photography assets (hero, assessments, CTA)
├── src/
│   ├── assets/                  # Static assets (fonts, icons)
│   ├── components/
│   │   ├── assessment/          # Question stepper, progress bar, answer UI
│   │   ├── home/                # Landing page sections (hero, features)
│   │   ├── layout/              # Navbar & Footer
│   │   ├── results/             # Score cards, charts, interpretation display
│   │   └── ui/                  # Shared UI primitives (buttons, badges, cards)
│   ├── context/
│   │   └── ThemeContext.jsx     # Dark/light mode context provider
│   ├── data/
│   │   ├── assessmentRegistry.js # Central registry of all assessments
│   │   ├── bigFive.js           # Big Five BFI-44 question bank & scoring config
│   │   ├── clinicalAssessments.js # PHQ-9, GAD-7, Rosenberg RSES
│   │   └── attachmentStyle.js   # ECR-R attachment style assessment
│   ├── hooks/                   # Custom React hooks (useGroqAPI, useLocalStorage)
│   ├── pages/
│   │   ├── Home.jsx             # Landing page
│   │   ├── AssessmentLibrary.jsx # Browse & filter all assessments
│   │   ├── AssessmentDetail.jsx  # Assessment overview & start page
│   │   ├── AssessmentTaking.jsx  # Active assessment (question flow)
│   │   ├── Results.jsx          # Full results with scores, charts, AI insights
│   │   ├── Dashboard.jsx        # Personal history & progress tracking
│   │   ├── About.jsx            # About MindMetric page
│   │   └── LegalPages.jsx       # Privacy Policy, Terms of Service, Disclaimer
│   ├── utils/
│   │   ├── scoring.js           # Scoring engine (total-sum, subscale, normalized)
│   │   └── reportGenerator.js   # jsPDF report builder (cover, scores, AI page)
│   ├── App.jsx                  # Root app with router and layout
│   ├── main.jsx                 # React DOM entry point
│   ├── index.css                # Global styles & CSS design tokens
│   └── App.css                  # App-level styles
├── .env.example                 # Environment variable template
├── .gitignore
├── index.html                   # HTML entry point
├── package.json
├── tailwind.config.js
├── vite.config.js
└── vercel.json                  # Vercel SPA routing config
```

---

## 🚀 Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) v18 or higher
- [npm](https://www.npmjs.com/) (comes with Node.js)
- A free [Groq API key](https://console.groq.com/) (for AI insights — optional)

### 1. Clone the Repository

```bash
git clone https://github.com/amritanshguptadev/mindmetric.git
cd mindmetric
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Set Up Environment Variables

```bash
# Copy the example file
cp .env.example .env
```

Then open `.env` and add your Groq API key:

```env
VITE_GROQ_API_KEY=your_groq_api_key_here
```

> **Note:** AI insights are optional. Without a Groq key, all assessments still work — only the AI-generated interpretation section will be disabled.

### 4. Start the Development Server

```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

### 5. Build for Production

```bash
npm run build
```

The production-ready build will be output to the `dist/` folder.

---

## 🔑 Environment Variables

| Variable | Required | Description |
|---|---|---|
| `VITE_GROQ_API_KEY` | Optional | Your Groq API key for AI-powered psychological insights |

Get a **free** Groq API key at [console.groq.com](https://console.groq.com). The free tier is more than sufficient for personal use.

---

## ⚙️ How It Works

### 1. Assessment Engine

Each assessment is defined as a JavaScript data module with:
- **Questions** — array of question objects with `id`, `text`, `reverse` flag
- **Scoring config** — method (`total-sum`, `subscale-sum-normalized`, `subscale-average-normalized`, etc.), subscales, and reverse formula
- **Interpretations** — range bands mapping score percentiles to labels and descriptive text

The `calculateScore(assessment, responses)` utility function routes to the correct scoring algorithm at runtime.

### 2. Scoring Methods

| Method | Used By | Description |
|---|---|---|
| `total-sum` | PHQ-9, GAD-7 | Sum all item scores; map to interpretation band |
| `total-sum-normalized` | Rosenberg RSES | Sum then normalize to 0–100% |
| `subscale-sum-normalized` | Big Five BFI-44 | Per-subscale sums normalized to 0–100% |
| `subscale-average-normalized` | ECR-R Attachment | Per-subscale averages normalized; combined type lookup |

### 3. Data Persistence

Results are stored with `saveResult()` into `localStorage` under the key `mindmetric_results`. Each result object contains:

```json
{
  "assessmentId": "big-five",
  "assessmentTitle": "Big Five Personality (BFI-44)",
  "category": "Personality",
  "completedAt": "2026-05-06T02:00:00.000Z",
  "responses": { "bfi_1": 4, "bfi_2": 2, ... },
  "scores": {
    "method": "subscale-sum-normalized",
    "subscales": { "Openness": 72, "Conscientiousness": 58, ... }
  }
}
```

### 4. Routing

| Route | Page |
|---|---|
| `/` | Home (landing page) |
| `/assessments` | Assessment Library |
| `/assessments/:id` | Assessment Detail |
| `/assessments/:id/take` | Take Assessment |
| `/results/:id` | View Results |
| `/dashboard` | Personal Dashboard |
| `/about` | About |
| `/privacy` | Privacy Policy |
| `/terms` | Terms of Service |
| `/disclaimer` | Disclaimer |

---

## 🤖 AI Insights (Groq)

After completing an assessment, MindMetric calls the **Groq API** (model: `llama3-8b-8192`) with your score profile to generate a personalised 4-section psychological report:

| Section | Description |
|---|---|
| **Profile** | A narrative summary of your overall psychological profile |
| **Strengths** | Bullet-pointed personal strengths based on your scores |
| **Growth Areas** | Areas for personal development and reflection |
| **Guidance** | Evidence-based, actionable advice tailored to your results |

> ⚠️ **Important:** AI insights are generated by a large language model and are **not reviewed by licensed clinicians**. They are intended as a starting point for self-reflection only.

---

## 📄 PDF Report Generation

MindMetric generates beautiful, multi-page **A4 PDF reports** using **jsPDF**, entirely in the browser:

- **Page 1 — Cover Page:** Assessment title, completion date, disclaimer box, and report contents
- **Page 2 — Score Breakdown:** Visual progress bars for each trait/subscale with color-coded level badges (High / Medium / Low)
- **Page 3 — AI Insights:** Profile, Strengths, Growth Areas, and Guidance sections

Reports are saved as `MindMetric-{assessment-name}-{date}.pdf`.

---

## 🔒 Privacy Policy

MindMetric is built with privacy as a core principle:

- ✅ **No user accounts** — no sign-up or login required
- ✅ **No server-side data storage** — your results are never transmitted
- ✅ **No tracking or analytics** — no cookies, no telemetry
- ✅ **localStorage only** — all data lives in your browser, on your device
- ✅ **You own your data** — clear it anytime via your browser settings

The only external call made is to the **Groq API** for AI interpretation, which receives only your numerical score profile (not your individual question responses).

---

## 🤝 Contributing

Contributions are welcome! Here's how to get started:

1. **Fork** the repository
2. **Create** a feature branch: `git checkout -b feature/your-feature-name`
3. **Commit** your changes: `git commit -m "feat: add amazing feature"`
4. **Push** to the branch: `git push origin feature/your-feature-name`
5. **Open** a Pull Request

### Adding a New Assessment

1. Create a new data file in `src/data/` following the schema of an existing assessment (e.g., `bigFive.js`)
2. Register it in `src/data/assessmentRegistry.js`
3. The assessment will automatically appear in the library, detail, taking, and results pages

### Commit Convention

This project follows [Conventional Commits](https://www.conventionalcommits.org/):

```
feat: add new assessment
fix: correct reverse scoring for GAD-7
docs: update README
style: improve mobile layout on results page
```

---

## ⚠️ Disclaimer

MindMetric assessments are provided for **educational and self-awareness purposes only**. The results do not constitute a clinical diagnosis and must not be used as a substitute for professional psychological, psychiatric, or medical evaluation and treatment.

If you are experiencing distress or symptoms that impact your daily functioning, please consult a **licensed mental health professional**.

---

## 👤 Author

**Umang Pandey**

- GitHub: https://github.com/Umangpandey75
- LinkedIn: [Add Your LinkedIn URL]
- Email: [Add Your Email]

---

<div align="center">

Made by Umang Pandey ❤️ 

**MindMetric** — *"Know your mind. Own your story."*

</div>
