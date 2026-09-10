# Portfolio v3 redesign — DESIGN.md

Status: approved 2026-09-10. Living doc; update when a decision changes.

## Problem & goals

The current `index.html` (v2, ~1800 lines) has too many competing devices: particle
canvas, typed text, glitch effect, animated terminal, two timelines, VS Code-styled
project cards with filter tabs, a light/dark toggle, and a chatbot. It reads as
"a lot of things" and signals "developer" rather than "person".

Goal: a calm, simple, warm site that a non-technical visitor can read comfortably
and a technical visitor can still use to find work history, projects, and contact.

Success looks like:
- A visitor knows who Sambhav is, what he does, and how to reach him within one screen.
- The whole page is four to five screens on desktop, readable top to bottom in under a minute.
- Nothing moves except on hover.
- Adding a job or a project is one HTML block, no new CSS.

## Non-goals / out of scope

- Personal content (photo, hobbies, blog, "now" page). Decided: keep it professional.
- Rewriting role and project copy into fully plain English. Descriptions are shortened
  to one line each, but the audience stays mostly professional.
- Dark theme or theme toggle.
- Separate project pages.
- Removing the chatbot backend (`api/`, `vercel.json`, `package.json`). Only the widget
  in `index.html` goes; the backend files stay untouched for possible future use.
- Any framework or build step.

## Requirements & constraints

- Single `index.html`, no build, served statically by Vercel (domain `sambhavshrestha.com`
  is on Vercel; `CNAME` is a legacy GitHub Pages artifact).
- Content that must survive: 4 roles, 8 projects, 2 degrees, contact links, résumé link.
- Works at 390px phone width with no horizontal scroll.
- External dependencies: Google Fonts only. No icon libraries, no JS libraries.
- Motion: hover states only. No scroll-triggered or load-triggered animation.

## Proposed architecture

### Page structure (top to bottom)

| Section | Content | Component used |
|---|---|---|
| Header | Name (italic Newsreader) left; anchor links Work · Projects · Education · Contact right. Static, not fixed. | `.site-header` |
| Intro (`#top`) | Name at display size, two-sentence paragraph, "Get in touch" pill (mailto), "Résumé ↗" link. | `.intro` |
| Work (`#work`) | Four rows: logo, company (+ "via HCL" for Meta), role, one line, years. | `.section` + `.row` |
| Projects (`#projects`) | Four featured tinted cards; "Show all 8" button reveals the other four in the same grid. | `.section` + `.grid` + `.card` |
| Education (`#education`) | Two bordered cards: logo, school, degree, years, GPA and one award line for SJC. | `.section` + `.grid` + `.card.card-outline` |
| Contact (`#contact`) | Full-width ink band: "Let's talk.", email, LinkedIn, GitHub. | `.contact` |

### Components (reuse rule from `~/projects/CLAUDE.md`)

- **`.section`** — rule on top, uppercase Inter label, then content. Every section
  uses it. Variation is only the child content.
- **`.row`** — flex row: optional logo, text block (title, subtitle, one-liner), right-aligned
  date. Used by all four Work entries. Education uses cards instead, but if a third
  degree ever appears it can switch to rows without new CSS.
- **`.card`** — tinted block with `--tint` custom property, title, one-liner, label line,
  optional link. All eight projects use it; the four hidden ones carry a `hidden`
  attribute toggled by one small script. `.card-outline` variant (border, no tint) is
  used for the two education cards.
- **`.pill`** and **`.link`** — the only two interactive text styles.

Invariant: a new job or project is one more `.row` or `.card` block. If a future change
needs a new CSS class for a single entry, the boundary is wrong; stop and extract.

### Behaviour

- Anchor navigation with `scroll-behavior: smooth`.
- One script, under 15 lines: the "Show all" button removes `hidden` from the four
  collapsed cards and hides itself. No other JavaScript.
- Hover: links get an underline in the accent color; cards translate up 2px.
- Responsive: single breakpoint at 640px. Grid goes from two columns to one; header
  links wrap under the name; intro type scales down with `clamp()`.

### Data model

None. Content is inline HTML. Draft copy is in the appendix below.

## Visual system

### Tokens

```
--paper:  #fbf9f4   background
--ink:    #1a1c19   text, contact band, buttons
--muted:  #6a6e67   labels, dates, secondary text
--line:   #e6e3da   rules and card borders
--accent: #2f6b45   links, hover underline, focus ring

--tint-1: #e6ede4   project card tints (green, sand, blue, rose)
--tint-2: #f0e8d9
--tint-3: #e3e8ee
--tint-4: #eee3e8

--serif:  "Newsreader", Georgia, "Times New Roman", serif
--sans:   "Inter", -apple-system, "Helvetica Neue", sans-serif

--measure: 880px   container width
--radius:  10px
--space:   8px base; scale 1, 2, 3, 5, 8, 13 units
```

### Type scale

| Use | Font | Size | Notes |
|---|---|---|---|
| Display name | Newsreader 400 | clamp(44px, 8vw, 72px) | line-height 1, letter-spacing -0.015em |
| Section label | Inter 500 | 11px | uppercase, letter-spacing .14em, muted |
| Card / row title | Newsreader 500 | 20px | |
| Body | Newsreader 400 | 17px | line-height 1.5, ink at 90% |
| Meta (dates, tags, nav) | Inter 400 | 13px | muted |

Fonts load from Google Fonts with `display=swap`. Georgia is an acceptable fallback,
so a brief swap flash is tolerated.

## Stack choice + why

Single hand-written HTML file with embedded CSS and one small script. Content is small
enough that a framework would add tooling without removing work. The deployment target
(Vercel static) needs nothing more. Astro was considered and rejected below.

## Alternatives considered

- **Layout A, single narrow "letter" column.** Simplest, but eight projects as prose ran
  long and the user found it too plain. Rejected.
- **Layout B, fixed sidebar.** Good for long lists, but collapses to layout A on phones,
  so half the audience never sees the distinguishing feature. Rejected.
- **Warm serif (Fraunces + terracotta) and clean sans (Instrument Sans + blue).** Both fine;
  the user preferred classic serif with forest green. Rejected on taste.
- **Astro.** Markdown content and real components, but adds Node tooling and a build step
  for four screens of content. Rejected as not worth it at this size.
- **All 8 projects visible.** Rejected for page length; four featured plus "Show all" chosen.
- **Fade-in on scroll.** Rejected; hover-only keeps the calm and avoids an observer.

## Failure modes / risks

| Risk | Guard |
|---|---|
| Drift back to "a lot of things" during build. | Any new visual element must replace one, not add. Token list above is closed; no new colors or fonts. |
| Logo PNGs were made for a navy background; some may have dark fringes or non-transparent boxes on ivory. | Check each PNG's alpha and edge color before use; pad on a white tile or re-export as needed. |
| `logo_amazon.png` (3840px) and `logo_meta.png` (2000px) are far larger than the 40px they render at. | Downscale all six logos to 160px on the long edge during the build; keep originals in git history only. |
| Google Fonts blocked or slow. | Georgia fallback; layout uses no font-metric-dependent sizing. |
| Copy drafted by Claude misstates a role. | All copy is marked DRAFT in the appendix; user edits before ship. |
| Removing the widget breaks nothing, but `api/chat.js` still deploys and can be hit directly. | Out of scope by decision; noted here so it isn't a surprise. |

## Rollout / deploy plan

1. Build v3 as a clean rewrite of `index.html` on a branch. The v2 file stays in git
   history; no copy is kept in the tree.
2. Smoke test (below) passes locally.
3. Push branch; Vercel preview deploy; check on a real phone.
4. Merge to `main`; Vercel deploys production automatically.

## Testing

Playwright smoke test at `tests/smoke.spec.js`, run with `npm test`:
- Page loads with zero console errors.
- The header plus the five section ids (`#top`, `#work`, `#projects`, `#education`, `#contact`) exist.
- "Show all" reveals eight `.card` elements inside `#projects`.
- At 390px viewport, `document.documentElement.scrollWidth <= 390`.
- Every `href` to a `.pdf` or `github.com` resolves (status < 400) — checked offline via a
  link list, not live in CI.

GitHub Actions workflow runs `npm test` on every push. Kept light per project rules;
tighten (HTML validation, Lighthouse budget) if the site grows.

## Open questions

- Raft/Paxos GitHub link still points at the profile root. Update when the repo exists.
- Should the "Get in touch" pill open mailto or scroll to the contact band? Default: mailto.

## Appendix: draft copy (DRAFT, user to edit)

### Intro
Software engineer working on the infrastructure behind machine learning. Recently at
Meta; now at Stony Brook for a master's in computer science.

### Work
- **Meta** via HCL Technologies — ML Infrastructure Engineer — Mar 2024 to Jul 2025
  Built Sherlock, an AI assistant that resolves ML-infrastructure questions on its own,
  plus the monitoring and tooling that keep model training and deployment running.
- **Tarifica** — Software & Data Engineer — Jun 2023 to Feb 2024
  Built the pipelines that validate and route telecom pricing data into analytics, and
  refactored a legacy codebase with logging, observability, and tests.
- **Amazon** — Software Development Engineer — Jul 2022 to Mar 2023
  Operated production microservices and led a high-traffic service's migration to AWS.
- **Microsoft Research** DS3 — Data Science Fellow — Jun to Jul 2021
  Extended the Financial Times police complaints study with statistical models in R.

### Projects (featured first)
1. **Sherlock** — An AI assistant built at Meta that answers engineers' ML-infrastructure
   questions, trained on internal forum data. `LLaMA · RAG · PyTorch` · internal, no link
2. **Argument Quality Ranking** — A model that ranks how well-made a written argument is.
   `Python · NLP` · github.com/Sambhav101/Argument-Quality-Ranking
3. **Raft / Paxos Consensus Simulator** — Watch distributed systems agree, disagree, and
   recover from failures. `Go` · github.com/Sambhav101 (repo pending)
4. **Pipelined MIPS Processor** — A 32-bit five-stage CPU with caches, built from scratch.
   `Verilog` · github.com/Sambhav101/Cache-enabled-Pipelined-MIPS-Processor
5. **Frequency Prior for Image Generation** — Replacing attention with a frequency-based
   prior in image generation models. `Python · PyTorch` · github.com/Sambhav101/CSE_590_03_VLM
6. **Stock Price Prediction** — An LSTM that forecasts stock prices from historical data.
   `Python` · github.com/Sambhav101/Stocks-Prediction-Using-LSTM
7. **Police Complaints Analysis** — Race and gender patterns in police complaints across
   NYC, Chicago, and Philadelphia, at Microsoft Research. `R` · github.com/msr-ds3/officer-complaints-2021-group-6
8. **Credit Card Fraud Detection** — Catching rare fraudulent transactions in an imbalanced
   dataset with XGBoost and SMOTE. `R` · github.com/Sambhav101/Credit-Card-Fraud-Detection

### Education
- **Stony Brook University** — M.S. Computer Science — 2025 to 2027
- **St. Joseph's College New York** — B.S. Computer Science & Mathematics — 2018 to 2022
  GPA 3.93 · President's Scholar
