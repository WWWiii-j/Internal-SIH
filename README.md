# E-Consultation AI — SIH 2025 PS-25035

An AI-powered platform for analyzing stakeholder comments received through the Government e-Consultation module.

## Problem Statement

**SIH 2025 — PS-25035**

**Sentiment analysis of comments received through E-Consultation module**

The project is designed to help government departments efficiently understand large volumes of stakeholder feedback by applying sentiment analysis, summarization, keyword/theme extraction, and multilingual input capabilities.

## Project Phases

### Phase 1 — Comment Analysis Dashboard

Phase 1 focuses on analyzing consultation comments from structured datasets.

**Key features:**
- Upload consultation comments through CSV
- Automatic comment/column detection
- Sentiment classification
- Comment-level analysis
- Sentiment distribution dashboard
- Keyword and theme insights
- Executive-style summary of feedback
- Visual dashboard for quickly understanding stakeholder sentiment

**Live Demo:**  
https://internal-sih-phase1.vercel.app/

### Phase 2 — Multilingual & Interactive Intelligence

Phase 2 extends the system toward a more accessible consultation-analysis workflow, including multilingual and interactive input capabilities and additional AI-assisted analysis.

**Live Demo:**  
https://internal-sih-phase2.vercel.app/

## Tech Stack

- React
- TypeScript
- Vite
- JavaScript / TypeScript-based frontend
- NLP / sentiment-analysis pipeline
- Data visualization
- Responsive web UI
- Vercel for deployment

## Project Structure

```text
Internal-SIH/
│
├── Phase 1/
│   └── Phase 1 application
│
├── Phase 2/
│   └── Phase 2 application
│
└── README.md
```

## How It Works

```text
Stakeholder Comments
        │
        ▼
   Data / User Input
        │
        ▼
   NLP Processing
        │
        ├── Sentiment Analysis
        ├── Keyword Extraction
        ├── Theme Identification
        └── Summary Generation
        │
        ▼
 Interactive Dashboard
        │
        ▼
 Policy / Executive Insights
```

## Getting Started

Clone the repository:

```bash
git clone https://github.com/WWWiii-j/Internal-SIH.git
cd Internal-SIH
```

Open the required phase:

```bash
cd "Phase 1"
```

Install dependencies:

```bash
npm install
```

Run the development server:

```bash
npm run dev
```

Create a production build:

```bash
npm run build
```

Preview the production build:

```bash
npm run preview
```

Repeat the same process inside the `Phase 2` folder when working on Phase 2.

## Deployment

Both phases are deployed separately on Vercel:

| Phase | Deployment |
|---|---|
| Phase 1 | https://internal-sih-phase1.vercel.app/ |
| Phase 2 | https://internal-sih-phase2.vercel.app/ |

## Objective

The overall objective is to transform large volumes of stakeholder feedback into understandable, actionable insights so that decision-makers can identify public sentiment, recurring concerns, important themes, and major areas of feedback more efficiently.

## Smart India Hackathon

This project was developed for **Smart India Hackathon 2025**.

**Problem Statement:** PS-25035  
**Title:** Sentiment analysis of comments received through E-Consultation module

---

## Authors

**Lokesh Venkat Sai (Loki)**  
B.Tech — Computer Science & Engineering (AI & ML)  
GITAM University

GitHub: https://github.com/WWWiii-j  
LinkedIn: https://www.linkedin.com/in/m-lokesh-venkat-sai-14654536b/

---

> Built as part of Smart India Hackathon 2025.
