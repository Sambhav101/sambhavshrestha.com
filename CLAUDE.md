# Portfolio v2 — CLAUDE.md

## Project
Single-file portfolio: `portfolio.html`. No build step, no dependencies beyond CDN fonts/icons.
Open with: `open portfolio.html`

## Assets
All images live alongside `portfolio.html`:
- `logo_sbu.png` — Stony Brook University
- `logo_sjc.png` — St. Joseph's College New York
- `logo_meta.png` — Meta (used for HCL/Meta experience card)
- `logo_amazon.png`, `logo_microsoft.png`, `logo_tarifica.png` — experience cards
- Source: `~/Downloads/portfolio/Sambhav101.github.io/src/images/`

## Design tokens (CSS vars)
```
--bg: #02020a   --bg2: #08081a   --bg3: #0e0e24
--gold: #d4a017  --gold2: #f0c040  --green: #00ff88
--text: #f0f0f4  --muted: #9090a8  --dim: #505068
--card-bg: rgba(255,255,255,0.07)  --card-b: rgba(255,255,255,0.13)
--r: 14px  --font: Inter  --mono: Fira Code
```
Light theme overrides via `[data-theme="light"]`.

## Section order & backgrounds
About (`--bg`) → Experience (`--bg2`) → Education (`--bg`) → Projects (`--bg2`) → Contact (`--bg`)
Wave-bottom dividers use `fill: <next-section-bg>` to create smooth transitions.

## Section-by-section state

### Nav
Fixed, blur backdrop, gold gradient bottom edge, hamburger at 780px.
Links: About, Experience, Education, Projects, Contact, Resume ↗
JS: `ids=['about','experience','education','projects','contact']` for active-link tracking.

### Hero
Full-viewport, typed text animation, glitch on name hover, space/particle canvas background.

### About (`#about`, bg: `--bg`)
2-col grid: text left, animated terminal right.
Skills integrated at bottom of text column — 3 rows with `.about-skills`:
- ML/AI: PyTorch, HuggingFace, LLaMA, CUDA, RAG, Fine-tuning, Distributed Training, scikit-learn, wandb
- Languages: Python, Go, Java, Kotlin, TypeScript, C/C++, R, Verilog
- Infra: AWS, GCP, Docker, Kubernetes, PostgreSQL, CI/CD

Sherlock description: "production Agentic AI system that fine-tunes LLaMA on Meta's internal Workplace forum data to autonomously resolve ML infrastructure queries"

### Experience (`#experience`, bg: `--bg2`)
**Vertical timeline** design. Gold center line, glowing node dots, staggered `data-anim="up"`.
Classes: `.exp-timeline`, `.exp-entry`, `.exp-node`, `.exp-card`, `.exp-header`, `.exp-logo` (40px), `.exp-header-text`, `.exp-role` (gold), `.exp-meta` (mono), `.exp-details`, `.exp-tags`, `.exp-tag`, `.exp-chevron`

**Accordion expand on hover:**
- Default: shows logo + company + role + meta only
- Hover: `.exp-details` expands (max-height 0→600px), chevron rotates 180°
- Others fade to 45% opacity + scale(0.98) via `:has(.exp-entry:hover)`

Companies (newest → oldest):
1. HCL Technologies · embedded at Meta — ML Infra Engineer (Mar 2024–Jul 2025) — logo_meta.png
   Tags: Agentic AI, LLaMA, RAG, PyTorch, Python, Monitoring
2. Tarifica — Software/Data Engineer (Jun 2023–Feb 2024) — logo_tarifica.png
3. Amazon — SDE (Jul 2022–Mar 2023) — logo_amazon.png
4. Microsoft Research DS3 — Data Science Fellow (Jun–Jul 2021) — logo_microsoft.png

### Education (`#education`, bg: `--bg`)
**Vertical timeline** design. Classes mirror experience: `.edu-timeline`, `.edu-entry`, `.edu-node`, `.edu-card`.
Each card: left badge col (logo seal + degree abbr + year range) | vertical divider | right content.
- SBU: M.S. CS, 2025–2027, GPA 3.4, coursework tags
- SJC: B.S. CS & Math, 2018–2022, GPA 3.93, coursework tags, awards (President's Scholar, Delta Epsilon Sigma, Dean's List ×4)
Cards slide right (`translateX(5px)`) on hover.

### Projects (`#projects`, bg: `--bg2`)
**VS Code file explorer** design.

**Filter bar** — styled as editor tabs (monospace, `border-bottom`, 2px gold underline on active).
Filters: All, ML/AI, Systems, Data & R. No Python filter (those projects removed).

**Cards** — each is a code file:
- `.vsc-tab`: language dot + filename + GitHub link (or `internal · meta` for Sherlock)
- `.vsc-title`: bold project title between tab and editor
- `.vsc-editor`: `.vsc-gutter` (12 line numbers) + `.vsc-code` (12 `.vsc-line` divs)
- `.vsc-statusbar`: language + UTF-8 + Ln 12

Language dot colors: Python `#3572A5`, Verilog `#b2b7f8`, R `#198CE7`, Rust `#dea584`
Syntax classes: `.syn-kw` purple, `.syn-mod` teal, `.syn-fn` yellow, `.syn-str` orange, `.syn-cmt` green, `.syn-num` light-green, `.syn-op` gray

Cards have `resize: both; overflow: auto; min-width: 220px; min-height: 180px` (drag to resize).

**"See More"** button: on "All" filter, shows 3 cards initially (desktop), 4 on tablet, 3 on mobile. `showMoreProjects()` reveals collapsed cards with staggered animation.

**Current projects (7 + Sherlock = 8 total):**
- ML/AI: Sherlock (internal·meta), Argument Quality Ranking, Frequency Prior, Stock LSTM
- Systems: Raft/Paxos Simulator (`consensus_sim.go`), Pipelined MIPS Processor
- Data & R: Police Complaints Analysis, Credit Card Fraud Detection

Grid: `repeat(3, 1fr)`. Collapses to 2-col at 900px, 1-col at 580px.

### Contact (`#contact`, bg: `--bg`)
Centered. Cards: email, LinkedIn, GitHub.

## Animation system
`[data-anim]` elements: `1.4s cubic-bezier(.22,1,.36,1)`.
Variants: `up` (translateY 80px), `left`, `right`, `scale`, `flip`, `clip`.
IntersectionObserver adds `.in` + `.visible` at 12% threshold.
Project cards: JS auto-applies `data-anim="scale"` + staggered delay.

## Responsive breakpoints
- `780px`: single-col about grid, mobile nav
- `900px`: projects → 2-col
- `580px`: projects → 1-col, resize disabled implicitly by single col

## Key JS functions
- `filterProjects(cat, btn)` — toggles `.hidden` + calls `applyCollapse` when cat==='all'
- `applyCollapse(cards)` — hides cards beyond initial count, shows See More button
- `showMoreProjects()` — reveals `.collapsed` cards with animation
- `getInitialCount()` — returns 3/4/3 based on viewport width
- `toggleTheme()` — toggles `data-theme` on `<html>`
- `toggleMenu()` — hamburger nav

## Notes
- Skills section removed — skills integrated into About section
- Raft/Paxos GitHub link points to profile root — update when repo exists
- Sherlock has no GitHub link (internal Meta project)
