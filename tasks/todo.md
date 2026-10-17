# Portfolio Build — Task List

Plan: [`tasks/plan.md`](./plan.md) · Spec: [`SPEC.md`](../SPEC.md)

Merge strictly top to bottom. Each PR targets the branch above it until that PR
merges, then retargets to `main`.

## PR stack

- [ ] PR 1 — `docs/portfolio-spec-plan` → `main`
- [ ] PR 2 — `content/portfolio-content` → `docs/portfolio-spec-plan`
- [ ] PR 3 — `feat/content-pipeline` → `content/portfolio-content`
- [ ] PR 4 — `feat/design-foundation` → `feat/content-pipeline`
- [ ] PR 5 — `feat/site-header` → `feat/design-foundation`
- [ ] PR 6 — `feat/theme-toggle` → `feat/site-header`
- [ ] PR 7 — `feat/about-sections` → `feat/theme-toggle`
- [ ] PR 8 — `feat/work-sections` → `feat/about-sections`
- [ ] PR 9 — `feat/motion-responsive` → `feat/work-sections`
- [ ] PR 10 — `feat/seo-qa` → `feat/motion-responsive`

## Tasks

- [ ] **Task 1 — Commit spec and plan**
  - Acceptance: spec approved; plan and todo agree; docs only.
  - Verify: `pnpm exec oxfmt --check SPEC.md tasks/plan.md tasks/todo.md`;
    `git diff --check`; CI green.
  - Files: `SPEC.md`, `tasks/plan.md`, `tasks/todo.md`.
  - Depends: none.

- [ ] **Task 2 — Add real portfolio content**
  - Acceptance: schema-valid JSON; real bio; résumé PDF; no placeholder copy.
  - Verify: JSON parse, `file public/resume.pdf`, format check, manual review.
  - Files: `content/site.json`, `content/profile.md`, `public/resume.pdf`,
    optional `public/og.png`.
  - Depends: Task 1 and content from Parth.
  - Gate: do not merge placeholders.

- [ ] **Task 3 — Content pipeline and semantic render**
  - Acceptance: loader, validator, `getStaticProps`, Markdown conversion; all
    sections render from content; invalid content fails build; no `marked` in
    client chunks.
  - Verify: `pnpm typecheck`, `pnpm build`, grep `out/index.html`, invalid-field
    build failure, grep `.next/static`.
  - Files: `package.json`, `pnpm-lock.yaml`, `src/lib/content.ts`,
    `src/pages/index.tsx`.
  - Depends: Task 2.

- [ ] **Task 4 — Design tokens and page foundation**
  - Acceptance: exact tokens, system fonts, container, numbered sections,
    footer; no 360px overflow.
  - Verify: build, 390/1440 browser check, computed tokens, heading order.
  - Files: `src/styles/globals.css`, `src/components/Section.tsx`,
    `src/components/SiteFooter.tsx`, `src/pages/index.tsx`.
  - Depends: Task 3.

- [ ] **Task 5 — Site header and skip link**
  - Acceptance: 52px sticky header, monogram, skip link, `#main` target,
    correct focus order.
  - Verify: build, keyboard pass, anchor offset, 360px check.
  - Files: `src/components/SiteHeader.tsx`, `src/components/SkipLink.tsx`,
    `src/styles/globals.css`, `src/pages/index.tsx`.
  - Depends: Task 4.

- [ ] **Task 6 — Theme toggle and no-flash bootstrap**
  - Acceptance: persisted theme, system fallback, no flash, correct
    `aria-pressed`/label, icons.
  - Verify: build, reload tests, keyboard activation, state inspection.
  - Files: `src/hooks/useTheme.ts`, `src/components/ThemeToggle.tsx`,
    `src/components/ThemeToggle.module.css`, `src/pages/_document.tsx`,
    `src/components/SiteHeader.tsx`, `src/styles/globals.css`.
  - Depends: Task 5.

- [ ] **Task 7 — Hero, profile, networking**
  - Acceptance: reference type/layout, Markdown bio, facts, résumé link,
    two-column to one-column at 560px, hover/focus states.
  - Verify: build, screenshots at 390/820/1440, keyboard, résumé download.
  - Files: `src/components/Hero.tsx`, `src/components/Profile.tsx`,
    `src/components/Networking.tsx`, `src/components/About.module.css`,
    `src/pages/index.tsx`.
  - Depends: Task 6.

- [ ] **Task 8 — Experience and tech stack**
  - Acceptance: jobs and stack from content, dates as `start — end`, 132px
    column collapse, `h3` per job.
  - Verify: build, screenshots at 390/820/1440, overflow check.
  - Files: `src/components/Experience.tsx`, `src/components/TechStack.tsx`,
    `src/components/Work.module.css`, `src/pages/index.tsx`.
  - Depends: Task 7.

- [ ] **Task 9 — Reveal motion and responsive polish**
  - Acceptance: progressive reveal, reduced-motion opt-out, 1.8s failsafe,
    no horizontal scroll across the matrix, visible focus.
  - Verify: build, full viewport matrix, no-JS reload, reduced-motion reload,
    scrollWidth check.
  - Files: `src/hooks/useReveal.ts`, `src/styles/globals.css`,
    `src/components/About.module.css`, `src/components/Work.module.css`,
    `src/pages/index.tsx`.
  - Depends: Task 8.

- [ ] **Task 10 — SEO metadata and final QA**
  - Acceptance: metadata from `meta`, OG/Twitter tags, favicon, robots, social
    image; all spec success criteria pass; Lighthouse targets met.
  - Verify: `pnpm check`, `pnpm build`, `out/` contents, QA matrix, Lighthouse.
  - Files: `src/pages/index.tsx`, `src/pages/_document.tsx`,
    `public/robots.txt`, `public/favicon.svg`, `public/og.png`.
  - Depends: Task 9.

## Checkpoints

- [ ] **After Task 3** — CI green, content renders, invalid content fails build
- [ ] **After Task 6** — shell and theme complete, no flash
- [ ] **After Task 8** — all sections styled, layout holds
- [ ] **After Task 10** — all spec criteria met, deployed and verified

## Pre-flight

- [ ] Spec approved and open questions resolved
- [ ] Real content and résumé received
- [ ] `marked` approved
- [ ] Intermediate deploy policy confirmed
- [ ] `.agents/` handling decided
- [ ] PR tooling decided (`gh` install or web UI)
