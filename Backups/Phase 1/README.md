# AI-Powered E-Consultation Feedback Analysis
### Smart India Hackathon (SIH) 2025 · Problem Statement 25035

> **Problem Statement 25035**: *"Sentiment analysis of comments received through E-Consultation module"*

---

## 🌟 Overview

When government ministries release draft legislation, acts, or policy amendments for public consultation, they receive thousands of lengthy stakeholder comments across citizens, industry bodies, legal scholars, and advocacy groups.

Manually reading and summarizing each submission causes severe review delays, introduces cognitive bias, and obscures critical operational concerns.

**E-Consultation AI** provides an end-to-end intelligence platform that automatically ingests CSV submissions, runs NLP sentiment and keyword extraction, generates a formal government executive briefing, and visualizes actionable stakeholder sentiment through an interactive dashboard.

---

## 🚀 Core Features

1. **Intelligent CSV Ingestion & Validation**:
   - Drag-and-drop or browse CSV uploads.
   - Automatic detection of comment columns (`comment`, `feedback`, `suggestion`, `text`, `opinion`, `remarks`).
   - Manual column override if automatic detection is ambiguous.
   - Structural diagnostics for empty files, blank rows, and formatting errors.
   - Built-in multi-domain **1-Click Sample Datasets** (Green Hydrogen Policy, DPDP Rules, Higher Education).

2. **Deterministic & Domain-Aware NLP Engine**:
   - VADER-style multi-clause polarity scoring calibrated with governance terminology (e.g. *compliance, draconian, streamlined, arbitrary, bottleneck*).
   - Negation handling (*"not effective"*) and intensity scaling (*"severely burdensome"*).
   - N-gram (Unigram & Bigram) TF-IDF keyword extraction.
   - Thematic category clustering (Governance, Financial Impact, Timelines, Definitions, Infrastructure, Rights).

3. **Government Executive Briefing (AI Summary)**:
   - High-level Public Stance Index (-100 to +100 Net Sentiment).
   - 4-Pillar synthesis: Major Positive Highlights, Key Concerns, Common Suggestions, and Critical Risk Alerts.
   - One-click copy and official Government PDF briefing export.

4. **Interactive Analytics Dashboard**:
   - Key KPI Cards (Total comments, Positive %, Negative %, Neutral %, Avg Confidence, Net Stance).
   - Sentiment Share Donut Chart & Volume Bar Chart (Recharts).
   - Interactive Word Cloud with sentiment color coding and **click-to-filter** capability.
   - Keyword Frequency Bar Chart.

5. **Granular Comments Explorer**:
   - Search across full comment text, keywords, and stakeholder types.
   - Filter by sentiment (Positive, Negative, Neutral) and confidence thresholds.
   - Sort by confidence, sentiment, or comment length.
   - Expandable modal view for long submissions.
   - Client-side pagination.

6. **Multi-Format Export**:
   - Export enriched CSV (with Sentiment, Confidence, Polarity, and Keywords).
   - Export formal Executive Briefing PDF (via jsPDF).
   - Export raw JSON payload for API pipelines.

---

## 🛠️ Tech Stack

- **Frontend & UI**: React 18, TypeScript, Tailwind CSS, Lucide Icons, Canvas Confetti
- **Charts & Data Viz**: Recharts (Pie, Bar, Area charts), SVG/Canvas Word Cloud
- **NLP & Parsing**: PapaParse (CSV streaming), Custom VADER-enhanced Rule Engine, N-gram TF-IDF Extractor
- **Report Generation**: jsPDF, jsPDF-AutoTable
- **Build Tool**: Vite 5

---

## ⚡ Quick Start

### 1. Install Dependencies
```bash
npm install
```

### 2. Run Development Server
```bash
npm run dev
```
Open your browser at `http://localhost:3000`.

### 3. Build for Production
```bash
npm run build
```

---

## 🔌 Connecting External AI / ML Models

The application operates **100% offline out-of-the-box** using its built-in NLP engine. However, you can easily connect real LLMs or custom Python backends:

### Method A: Environment Variables (`.env`)
Create a `.env` file in the root directory:
```env
# Optional Google Gemini 1.5 Flash
VITE_GEMINI_API_KEY=AIzaSy...

# Optional OpenAI
VITE_OPENAI_API_KEY=sk-...

# Optional Custom Python FastAPI Backend
VITE_BACKEND_URL=http://localhost:8000/api/analyze
```

### Method B: In-App UI Settings
Click the **"AI Settings"** button in the top navigation bar to configure or test your API key during live presentations.

---

## 📋 Evaluation Checklist for SIH Judges

- [x] Tested with 70+ realistic stakeholder submissions
- [x] Tested with invalid and empty CSV files
- [x] Zero external dependency lock-in (deterministic offline fallback)
- [x] Professional Government of India aesthetic
- [x] Instant client-side response time (< 500ms for 1,000+ rows)
- [x] Mobile and desktop responsive layout
