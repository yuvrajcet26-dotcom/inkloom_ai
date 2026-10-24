<div align="center">

# 🛡️ Inkloom AI (BrandShield AI)
### *Every Content Piece. On Brand. Every Time.*

**Intelligent Pre-Publication Brand Governance Platform**

[![Next.js](https://img.shields.io/badge/Next.js-14.2-blue?logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-18.3-61DAFB?logo=react)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.6-3178C6?logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/TailwindCSS-3.4-38B2AC?logo=tailwind-css)](https://tailwindcss.com/)
[![Vercel](https://img.shields.io/badge/Deploy-Vercel-black?logo=vercel)](https://vercel.com/)
[![License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)

*Built for the **Inkloom AI Hackathon — Brand Governance Challenge***

---

### 🏛️ Academic & Team Credentials
**SVKM Institute of Technology (IOT), Dhule**  
*Department of Computer Engineering (Third Year TY Students)*

| Name | Role |
| :--- | :--- |
| **Yuvraj Nandu Patil** | **Team Leader** |
| **Yash Narendra Pawar** | Core Developer |
| **Tushar Kishor Salunkhe** | Core Developer |

---

</div>

## 📌 Executive Summary & Problem Statement

In today's digital world, organisations publish high volumes of content through multiple employees, agencies, freelancers, and generative AI tools. Maintaining a consistent, legally compliant, and trustworthy brand identity across platforms has become a major challenge:

1. **Inconsistent Brand Voice:** Content fails to follow approved tone, language, and messaging.
2. **Incorrect / Outdated Information:** Outdated facts, unverified metrics, and misleading claims risk legal liability and reputation loss.
3. **Visual Inconsistency:** Unapproved logos, clashing color palettes, and wrong font assets dilute brand recognition.
4. **Manual Review Bottlenecks:** Reviewing content manually is slow, error-prone, and unscalable.
5. **Limited Accountability:** Untracked edits and unrecorded approvals leave teams vulnerable to audit failures.

**The Solution:** **Inkloom AI** is a centralized, explainable brand-governance system that reviews content *before* publication. It detects guideline conflicts, verifies claims against approved internal facts, suggests actionable intent-preserving corrections, and routes submissions through human reviewers.

---

## ⚡ The Five-Step Workflow

```
[1. Upload Content] ──> [2. AI Review] ──> [3. Identify Issues] ──> [4. Suggest Corrections] ──> [5. Human Approval]
  (Text/Doc/Image)      (Rules + LLM)      (Tone, Facts, Rules)      (Intent-Preserving Diff)      (Signed Sign-Off)
```

1. **Upload Content:** Creators enter text directly or upload TXT, PDF, DOCX, or images.
2. **AI Brand Review:** Content is analyzed against verified guidelines, approved facts, and tone policies.
3. **Identify Issues:** Detects prohibited terms, unverified superlatives, customer count exaggerations, and accessibility gaps.
4. **Suggest Corrections:** Generates explainable findings, cites exact guidelines, and provides instant side-by-side diff fixes.
5. **Human Approval:** Authorized Brand Managers and Reviewers verify suggestions, collaborate via comments, and sign off for publication.

---

## 🌟 Six Originality & Innovation Pillars

1. **Context-Aware Brand Intelligence:** Checks content against your organisation’s actual guidelines, approved facts, and prohibited vocabularies rather than generic spell-checking.
2. **Multi-Modal Review:** Evaluates copy, documents (PDF, DOCX), and visual assets within a unified interface.
3. **Explainable & Actionable Feedback:** Every finding explains *why* it matters, cites the specific brand rule or approved source, and gives an editable correction.
4. **Human-in-the-Loop Workflow:** AI assists with decision-support, but human reviewers retain absolute authority over approvals.
5. **Governance Insights:** Identifies recurring terminology mistakes and confusing guidelines to improve team performance over time.
6. **Secure & Confidential:** Role-based access control (Admin, Manager, Reviewer, Creator), server-side AI execution, and full audit logging.

---

## 🛠️ Technology Stack

| Layer | Technologies |
| :--- | :--- |
| **Frontend** | Next.js 14 (App Router), React 18, TypeScript |
| **Styling** | Tailwind CSS with custom Hackathon Light Pastel Design System |
| **Charts & Visuals** | Recharts (Area charts, Bar charts, Responsive containers) |
| **Icons** | Lucide React |
| **Backend & APIs** | Next.js Route Handlers (`/api/analyze`, `/api/submissions`, `/api/approvals`, `/api/extract`, `/api/brands`) |
| **AI Engine** | Multi-tier: Google Gemini (`gemini-1.5-flash`), OpenAI (`gpt-4o-mini`), and Built-in Semantic Governor |
| **Document Parsing** | Native UTF-8, OpenXML DOCX archive extraction, and PDF stream parsing |
| **Database** | Server-side Persistent Adapter (`.data/db.json`) + PostgreSQL Supabase Schema Migration |
| **Deployment** | 100% Vercel production ready with automated CI/CD builds |

---

## 🚀 Quick Start (Local Development)

### 1. Prerequisites
* Node.js v18.0.0+ (Node v20+ recommended)
* npm or pnpm or yarn

### 2. Installation
```bash
# Clone the repository
git clone https://github.com/your-username/inkloom-ai.git
cd inkloom-ai

# Install dependencies
npm install
```

### 3. Environment Setup (Optional)
Copy the example environment file:
```bash
cp .env.example .env.local
```
*(The application runs out of the box using the built-in deterministic semantic engine and persistent storage if no API keys are provided!)*

### 4. Run the Development Server
```bash
npm run dev
```
Open **[http://localhost:3000](http://localhost:3000)** in your browser.

### 5. Build for Production
```bash
npm run build
npm run start
```

---

## 🌐 Deploy to Vercel (1-Click Ready)

Inkloom AI is structured to deploy on Vercel with zero additional configuration:

### Method A: Deploy via Vercel Web Dashboard
1. Push your repository to GitHub.
2. Go to [Vercel](https://vercel.com) and click **"Add New..." ➔ "Project"**.
3. Import your `inkloom-ai` GitHub repository.
4. In **Environment Variables**, optionally add:
   * `GOOGLE_GEMINI_API_KEY`: Your Gemini API key (optional)
   * `OPENAI_API_KEY`: Your OpenAI API key (optional)
   * `NEXT_PUBLIC_SUPABASE_URL`: Your Supabase URL (optional)
   * `SUPABASE_SERVICE_ROLE_KEY`: Your Supabase Service Key (optional)
5. Click **Deploy**. Vercel will build and deploy your site in ~60 seconds!

### Method B: Deploy via Vercel CLI
```bash
npm i -g vercel
vercel
```

---

## 📁 Repository Structure

```
├── app/
│   ├── api/                     # Backend API Route Handlers
│   │   ├── analyze/route.ts     # AI Brand Analysis Engine API
│   │   ├── approvals/route.ts   # RBAC-enforced approval endpoint
│   │   ├── brands/route.ts      # Brand profiles CRUD API
│   │   ├── extract/route.ts     # Document text extraction API
│   │   └── submissions/route.ts # Content submissions API
│   ├── approvals/page.tsx       # Manager review & approval queue
│   ├── architecture/page.tsx    # Interactive System Architecture visualizer
│   ├── brands/                  # Brand profiles & guidelines manager
│   ├── content/page.tsx         # Central content repository & library
│   ├── dashboard/page.tsx       # Executive governance analytics & charts
│   ├── insights/page.tsx        # Violation trends & report export
│   ├── review/new/page.tsx      # Pre-publication review workspace
│   ├── reviews/[id]/            # Findings report & suggested corrections
│   ├── settings/page.tsx        # System configuration & immutable audit log
│   ├── team/page.tsx            # Team & Role-Based Access Control (RBAC)
│   ├── globals.css              # Light pastel color variables & utilities
│   ├── layout.tsx               # Root layout with AuthProvider & Navbar
│   └── page.tsx                 # Landing page matching PPT
├── components/
│   ├── common/                  # Badges, ComplianceGauge, DiffViewer, FindingCard
│   └── layout/                  # Navbar with Persona Switcher, Footer
├── lib/
│   ├── ai/                      # Multi-tier AI Engine (Gemini / OpenAI / Semantic)
│   ├── context/                 # AuthContext with dynamic role switching
│   ├── data/                    # Seed mock dataset matching presentation
│   ├── db/                      # Server-side persistent database adapter
│   ├── extraction/              # Document & PDF/DOCX stream text parser
│   └── types/                   # TypeScript schemas and models
├── supabase/
│   └── migrations/              # PostgreSQL RLS Database Migrations
├── .env.example                 # Environment variables specification
├── .gitignore                   # Production git exclusion list
├── package.json                 # Next.js 14, React 18, Tailwind, Recharts
└── tsconfig.json                # Strict TypeScript configuration
```

---

## 🎯 How to Demonstrate to Hackathon Judges

1. **Explore the Landing Page (`/`):**
   * Review the problem analysis, 5-step workflow, and six innovation pillars.
2. **Switch Roles Dynamically:**
   * In the top-right header, switch between **Brand Manager (Alex Rivera)**, **Content Creator (Emily Watson)**, and **Reviewer (Marcus Vance)** to show strict RBAC enforcement.
3. **Launch a Content Review (`/review/new`):**
   * Click **"NovaTech Violations Test"** in the 1-click test scenarios bar.
   * Watch the animated 5-step analysis pipeline inspect guidelines, facts, and tone rules.
4. **Inspect Findings & Citations (`/reviews/sub-101`):**
   * Observe the **54/100 Compliance Score**.
   * Note how prohibited terms (`"cheapest cloud"`, `"foolproof"`), legal security liabilities (`"unbreakable security"`), and exaggerated metrics (`10,000 customers` vs verified `4,500`) are flagged with exact guideline citations.
5. **Apply Corrections with Side-by-Side Diff (`/reviews/sub-101/edit`):**
   * Compare the original and proposed copy in the **Diff Viewer**.
   * Click **"Apply All Brand Fixes"** or individual fix pills, then click **"Re-Run Analysis"** to see the compliance score increase to **90+**!
   * Save as a new version and submit to the manager review queue.
6. **Manager Approval & Signed Audit Trail (`/approvals`):**
   * Open the approval queue, enter the reviewer rationale, and sign off.
   * Open **`/settings`** to show the immutable audit event permanently recorded.
7. **Governance Insights & CSV Export (`/insights`):**
   * Show recurring violation trends, guideline confusion metrics, and download the full compliance report in 1 click.

---

<div align="center">
  <b>Inkloom AI — Built with ❤️ for the Inkloom AI Hackathon</b><br />
  <i>SVKM IOT, Dhule • Department of Computer Engineering</i>
</div>
