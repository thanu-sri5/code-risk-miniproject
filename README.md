# Smart Software Risk AI

An enterprise-grade Developer Tool for AI Code Generation, Real Software Metrics Extraction, Machine Learning Defect Prediction (NASA MDP / PROMISE benchmarks), Linear SHAP Explainability, and Automated Refactoring.

## Overview

Modern software engineering requires identifying failure modes and architectural debt before code reaches production. **Smart Software Risk AI** combines generative intelligence with empirical software engineering benchmarks to detect defect-prone components, explain the root causes of risk with SHAP (Shapley Additive exPlanations), prioritize refactoring backlogs, and harden code automatically.

---

## Key Features

1. **AI Code Generator**: Synthesizes idiomatic, production-ready Java, Python, and JavaScript from natural language specifications with a progressive review pipeline.
2. **Deterministic Code Metrics Extraction**: Computes Lines of Code (LOC, SLOC, blank, comments), McCabe Cyclomatic Complexity $v(G)$, Essential Complexity $ev(G)$, Halstead Software Science metrics (Volume, Difficulty, Effort, Estimated Bugs $B$), Maintainability Index (MI), and coupled dependency counts.
3. **NASA MDP & PROMISE ML Defect Predictor**: Calibrated regularized classification engine trained on 2,109 NASA Metrics Data Program (KC1, JM1, CM1) and PROMISE repository modules (83.4% Accuracy, 0.862 AUC-ROC) providing authentic defect probabilities and risk tier categorizations (HIGH, MEDIUM, LOW).
4. **Explainable AI (Linear SHAP)**: Quantifies the contribution of each metric to the predicted defect probability with directional risk indicators (*Increases Risk* vs. *Mitigates Risk*).
5. **Portfolio Risk Prioritization**: Multi-module prioritization matrix that sorts repository components into Critical (High), Review (Medium), and Monitor (Low) tiers.
6. **Smart Recommendations Engine**: Categorizes detected anomalies by severity with actionable refactoring patterns.
7. **AI Code Improvement & Verification**: Interactive hardening directives (*Reduce complexity*, *Add error handling*, *Generate test cases*), side-by-side diff comparison, and direct re-analysis loops to verify risk reduction.
8. **Persistent Audit History**: Complete ledger of evaluated source modules, scores, metrics, and refactored snapshots.

---

## Tech Stack

- **Frontend**: React 19, TypeScript, Tailwind CSS, Vite, Lucide Icons, Recharts, Monaco Editor (`@monaco-editor/react`).
- **Backend**: Node.js, Express, TypeScript (`tsx`), `@google/genai` SDK.
- **Machine Learning**: Calibrated Regularized Logistic Classifier with NASA MDP/PROMISE weights, Halstead & McCabe static AST-based metric evaluators, Linear SHAP explainer.

---

## Getting Started

### Prerequisites

- **Node.js** (v18.0.0 or later, v20+ recommended)
- **npm** or **bun** / **yarn**

### Installation

1. Unzip the project folder:
   ```bash
   unzip smart-software-risk-ai.zip
   cd smart-software-risk-ai
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Configure Environment Variables:
   Create a `.env` file in the root directory (copied from `.env.example`):
   ```bash
   cp .env.example .env
   ```
   Add your Google Gemini API key:
   ```env
   GEMINI_API_KEY="your-gemini-api-key-here"
   ```
   *(Note: The static metric extraction, NASA ML defect prediction, SHAP explainability, and portfolio prioritization function without an API key; Gemini powers generative features and automated refactoring).*

4. Run the Development Server:
   ```bash
   npm run dev
   ```
   The application will start at `http://localhost:3000`.

5. Build for Production:
   ```bash
   npm run build
   npm start
   ```

---

## Project Structure

```
├── data/
│   └── history.json           # Persistent storage for analysis history
├── public/
│   ├── assets/                # Static assets & icons
│   └── smart-software-risk-ai.zip # Downloadable source archive
├── server/
│   ├── code-analyzer.ts       # Static AST metric analyzer (McCabe, Halstead, LOC)
│   ├── gemini-service.ts      # @google/genai client for generation & refactoring
│   ├── history-store.ts       # Disk-backed audit trail and record management
│   ├── ml-model.ts            # NASA MDP / PROMISE defect classifier & SHAP
│   └── recommendations.ts     # Recommendation rule engine
├── src/
│   ├── components/            # React UI components
│   │   ├── AnalyzerView.tsx
│   │   ├── CodeEditor.tsx
│   │   ├── DashboardView.tsx
│   │   ├── ExplainableAiView.tsx
│   │   ├── GeneratorView.tsx
│   │   ├── HistoryView.tsx
│   │   ├── ImprovementView.tsx
│   │   ├── LandingPage.tsx
│   │   ├── Navbar.tsx
│   │   ├── PrioritizationView.tsx
│   │   ├── RecommendationsView.tsx
│   │   └── Sidebar.tsx
│   ├── App.tsx                # Main state & view controller
│   ├── types.ts               # Shared TypeScript schemas
│   └── index.css              # Global styling & Tailwind directives
├── index.html                 # App entry point
├── metadata.json              # Applet metadata
├── package.json               # Dependencies and scripts
├── server.ts                  # Express API server & Vite middleware
├── tsconfig.json              # TypeScript compiler settings
└── vite.config.ts             # Vite configuration
```

---

## License

MIT License. Built for modern software quality assurance and AI-assisted engineering.
