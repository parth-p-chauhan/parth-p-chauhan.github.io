# Implementation Plan: Personal Portfolio Site

## Overview

Build the one-page portfolio defined in `SPEC.md` as a stack of small,
independently reviewable PRs. Each PR leaves `main` buildable and is based on
the PR below it, so review and merge happen strictly bottom-up. The design is
ported from the reference HTML; all copy comes from `content/site.json` and
`content/profile.md`.

## Current state

- Next.js 16.4.2 Pages Router with a create-next-app placeholder page.
- Static export to `out/`, deployed to GitHub Pages on every push to `main`.
- No `content/`, `public/`, or `tasks/` directory yet.
- No test framework; verification is `pnpm check`, `pnpm build`, and manual
  browser checks.
- Local Node is 24; CI uses Node 22.
- `gh` is not installed. PRs can be opened in the GitHub web UI, or `gh` can be
  installed with approval.
- Local `pnpm check` currently fails on the untracked
  `.agents/skills/context-engineering/SKILL.md`. CI is unaffected because
  `.agents/` is untracked. Resolve this before relying on full local checks.

## Planning assumptions

These are the spec defaults, pending confirmation:

- Section labels stay: Profile, Networking, Work Experience, Tech Stack.
- Theme follows the OS by default; the toggle persists an override.
- Canonical URL is `https://parth-p-chauhan.github.io/`.
- Footer note is "Built with Next.js".
- `og.png` is generated from the monogram.
- Projects and blog remain out of scope.
- `marked` is approved as the only new dependency.
- Intermediate deployments from stacked merges are acceptable.
- `.agents/` and `skills-lock.json` remain local and untracked.

## Architecture decisions

1. **Content is data, not code.** `content/site.json` holds structured content
   and section labels; `content/profile.md` holds the bio. Components receive
   content through props and contain no personal copy.
2. **Load at build time.** `src/lib/content.ts` reads both files with `fs` in
   `getStaticProps`, validates them, converts Markdown with `marked`, and
   returns `{ content, profileHtml }`. Nothing server-only reaches the client
   bundle.
3. **Hand-rolled validation, no schema library.** A small validator reports
   `content/site.json: <path>` errors and fails the build. This avoids adding
   `zod` or similar.
4. **Global tokens + component CSS Modules.** `src/styles/globals.css` owns
   tokens, reset, base elements, container, header, footer, section chrome, and
   reveal styles. Feature sections use colocated `*.module.css`.
5. **Presentational components.** `Hero`, `Profile`, `Networking`,
   `Experience`, and `TechStack` render props. `Section` owns numbered heading
   rows so numbering stays consistent.
6. **Theme without flash.** An inline script in `_document.tsx` applies the
   stored theme and adds the `js` class before paint; `useTheme` owns toggle
   state and `localStorage`.
7. **Progressive motion.** `useReveal` observes `[data-reveal]`, with a
   no-JS-visible baseline and a reduced-motion opt-out.
8. **No new test framework.** Build-time validation, `pnpm check`, `pnpm build`,
   and the manual QA matrix are the verification.
9. **Stacked PRs, squash merges.** Each branch targets the branch below it,
   not `main`, until that lower PR merges. Then retarget to `main` and rebase.

## PR stack

| PR  | Branch                      | Base                        | Task | Scope |
| --- | --------------------------- | --------------------------- | ---- | ----- |
| 1   | `docs/portfolio-spec-plan`  | `main`                      | 1    | S     |
| 2   | `content/portfolio-content` | `docs/portfolio-spec-plan`  | 2    | S     |
| 3   | `feat/content-pipeline`     | `content/portfolio-content` | 3    | M     |
| 4   | `feat/design-foundation`    | `feat/content-pipeline`     | 4    | M     |
| 5   | `feat/site-header`          | `feat/design-foundation`    | 5    | S     |
| 6   | `feat/theme-toggle`         | `feat/site-header`          | 6    | M     |
| 7   | `feat/about-sections`       | `feat/theme-toggle`         | 7    | M     |
| 8   | `feat/work-sections`        | `feat/about-sections`       | 8    | M     |
| 9   | `feat/motion-responsive`    | `feat/work-sections`        | 9    | M     |
| 10  | `feat/seo-qa`               | `feat/motion-responsive`    | 10   | M     |

Merge order is 1 → 10. Do not merge out of order.

### Stack mechanics

1. Create each branch from the branch below it.
2. Open each PR against the branch below it, with a description naming the task
   and linking `SPEC.md`.
3. Wait for CI (`pnpm check`, `pnpm build`) to pass.
4. Squash-merge the bottom PR into `main`.
5. Retarget the next PR to `main` and rebase:
   `git fetch origin && git rebase --onto origin/main <old-base> <branch>`.
6. Push with `git push --force-with-lease`.
7. Delete the merged branch and repeat.

If PR tooling is installed:

```sh
gh pr create --base <base-branch> --head <branch> --title "<task title>"
gh pr edit <number> --base main
```

### PR conventions

- Titles: `docs:`, `content:`, or `feat:` followed by the task outcome.
- Body: task number, link to `SPEC.md`, acceptance checklist, verification
  commands, and screenshots for UI tasks.
- One task per PR; no drive-by refactors.
- UI PRs include before/after screenshots at 390px and 1440px.
- Keep each PR in draft until its verification is complete.
- Do not merge a PR whose base branch is still unmerged unless it is the bottom
  of the stack.

## Task list

### Task 1: Commit the spec and plan

**Description:** Put the approved spec and this plan under version control as a
docs-only PR. No application code changes.

**Acceptance criteria:**

- [ ] `SPEC.md` status reflects approval.
- [ ] `tasks/plan.md` and `tasks/todo.md` exist and match each other.
- [ ] No source, content, or configuration files change.
- [ ] Docs pass formatting.

**Verification:**

- [ ] `pnpm exec oxfmt --check SPEC.md tasks/plan.md tasks/todo.md`
- [ ] `git diff --check`
- [ ] CI passes (docs-only)

**Dependencies:** None

**Files likely touched:**

- `SPEC.md`
- `tasks/plan.md`
- `tasks/todo.md`

**Estimated scope:** S

### Task 2: Add real portfolio content

**Description:** Encode Parth's real copy, links, work history, and stack in the
content files, and add the résumé PDF. This PR is data-only; nothing renders it
yet.

**Acceptance criteria:**

- [ ] `content/site.json` conforms to the schema in `SPEC.md`.
- [ ] `content/profile.md` contains the real bio.
- [ ] `public/resume.pdf` exists and opens.
- [ ] No Alex Mercer, Copenhagen, or `example.com` placeholders remain.
- [ ] Every content field in the spec's blocking table is filled.

**Verification:**

- [ ] JSON parses: `node -e 'JSON.parse(require("fs").readFileSync("content/site.json","utf8"))'`
- [ ] `file public/resume.pdf`
- [ ] `pnpm exec oxfmt --check content`
- [ ] Manual read-through against the spec schema

**Dependencies:** Task 1 and real content from Parth

**Files likely touched:**

- `content/site.json`
- `content/profile.md`
- `public/resume.pdf`
- `public/og.png` (optional)

**Estimated scope:** S

**Gate:** Do not merge placeholder content. If real content is not ready, stop
after Task 1 and keep this PR in draft.

### Task 3: Add content pipeline and semantic render

**Description:** Implement the typed content loader, validation, Markdown
conversion, and a bare semantic page that renders every section from content.
Styling comes in later tasks; this PR proves the data path end to end.

**Acceptance criteria:**

- [ ] `src/lib/content.ts` exports `SiteContent`, `loadContent()`, and
      `assertSiteContent()`.
- [ ] `getStaticProps` returns `{ content, profileHtml }`.
- [ ] Missing or malformed fields fail `pnpm build` with a file/field error.
- [ ] Page renders hero, profile, networking, experience, stack, and footer
      copy from content files.
- [ ] `marked` and `fs` are absent from client chunks.
- [ ] Section titles come from `labels`.

**Verification:**

- [ ] `pnpm typecheck`
- [ ] `pnpm build`
- [ ] `grep` a known content string in `out/index.html`
- [ ] Temporarily remove a required field; confirm the build fails; restore it
- [ ] Search `.next/static` for `marked` and confirm no result

**Dependencies:** Task 2

**Files likely touched:**

- `package.json`
- `pnpm-lock.yaml`
- `src/lib/content.ts`
- `src/pages/index.tsx`

**Estimated scope:** M (4 files)

### Task 4: Add design tokens and page foundation

**Description:** Replace the create-next-app styles with the reference tokens,
reset, base typography, container, section chrome, and footer. Introduce the
`Section` component and compose the page shell.

**Acceptance criteria:**

- [ ] Light and dark tokens match `SPEC.md` exactly.
- [ ] System sans and mono stacks replace Geist/Arial.
- [ ] Container uses `680px` measure and fluid gutter.
- [ ] Sections use numbered heading rows with `aria-labelledby`.
- [ ] Footer renders content from `site.json`.
- [ ] No horizontal overflow at 360px.

**Verification:**

- [ ] `pnpm build`
- [ ] Browser check at 390px and 1440px
- [ ] Inspect computed tokens in DevTools
- [ ] Confirm heading hierarchy

**Dependencies:** Task 3

**Files likely touched:**

- `src/styles/globals.css`
- `src/components/Section.tsx`
- `src/components/SiteFooter.tsx`
- `src/pages/index.tsx`

**Estimated scope:** M (4 files)

### Task 5: Add site header and skip link

**Description:** Add the sticky 52px header with the monogram brand link and the
skip-to-content link. The theme toggle is added in Task 6.

**Acceptance criteria:**

- [ ] Header is sticky, 52px tall, with the reference border and blur treatment.
- [ ] Brand links to `#main` and exposes the configured accessible name.
- [ ] Skip link is visually hidden until focused and targets `#main`.
- [ ] `<main id="main" tabIndex={-1}>` is the target.
- [ ] Keyboard focus order starts with the skip link.

**Verification:**

- [ ] `pnpm build`
- [ ] Keyboard-only pass in the browser
- [ ] Sticky header does not obscure section anchors
- [ ] 360px viewport check

**Dependencies:** Task 4

**Files likely touched:**

- `src/components/SiteHeader.tsx`
- `src/components/SkipLink.tsx`
- `src/styles/globals.css`
- `src/pages/index.tsx`

**Estimated scope:** S (3-4 files)

### Task 6: Add theme toggle and no-flash bootstrap

**Description:** Implement the accessible theme toggle, persisted preference,
system-preference fallback, and pre-paint bootstrap script.

**Acceptance criteria:**

- [ ] Toggle updates `data-theme`, `aria-pressed`, and its accessible label.
- [ ] Choice persists in `localStorage` under `portfolio-theme`.
- [ ] No explicit choice means the OS preference wins and stays live.
- [ ] Reloading does not flash the wrong theme.
- [ ] Invalid or blocked `localStorage` is ignored.
- [ ] Icons switch correctly in light, dark, and system modes.

**Verification:**

- [ ] `pnpm build`
- [ ] Reload test in light and dark OS settings
- [ ] Toggle, reload, and confirm the choice persists
- [ ] Keyboard activation with Space and Enter
- [ ] Inspect `aria-pressed` and label changes

**Dependencies:** Task 5

**Files likely touched:**

- `src/hooks/useTheme.ts`
- `src/components/ThemeToggle.tsx`
- `src/components/ThemeToggle.module.css`
- `src/pages/_document.tsx`
- `src/components/SiteHeader.tsx`
- `src/styles/globals.css`

**Estimated scope:** M (5-6 files)

### Task 7: Build hero, profile, and networking sections

**Description:** Port the hero, profile facts/bio, and networking link grid from
the reference, using the content model and design tokens.

**Acceptance criteria:**

- [ ] Hero renders kicker, name, and intro with the reference type scale.
- [ ] Bio renders from `profileHtml` with correct paragraph spacing.
- [ ] Bio HTML is injected only from the repo-owned Markdown file.
- [ ] Facts render location, availability with dot, and résumé download.
- [ ] Networking renders a two-column grid and collapses to one column at
      560px.
- [ ] Hover and focus states match the reference.
- [ ] Section numbers are sequential and aria-hidden.

**Verification:**

- [ ] `pnpm build`
- [ ] Compare screenshots at 390px, 820px, and 1440px
- [ ] Keyboard through all links
- [ ] Confirm résumé download works

**Dependencies:** Task 6

**Files likely touched:**

- `src/components/Hero.tsx`
- `src/components/Profile.tsx`
- `src/components/Networking.tsx`
- `src/components/About.module.css`
- `src/pages/index.tsx`

**Estimated scope:** M (5 files)

### Task 8: Build experience and tech stack sections

**Description:** Port the work-history list and tech-stack rows, completing the
page content.

**Acceptance criteria:**

- [ ] Jobs render date, company, role, and description from content order.
- [ ] Dates display as `start — end`.
- [ ] Stack rows render label and comma-joined items.
- [ ] 132px label column collapses at 560px.
- [ ] Section numbering completes correctly after the about sections.

**Verification:**

- [ ] `pnpm build`
- [ ] Compare screenshots at 390px, 820px, and 1440px
- [ ] Confirm no horizontal overflow
- [ ] Check heading hierarchy (`h3` per job)

**Dependencies:** Task 7

**Files likely touched:**

- `src/components/Experience.tsx`
- `src/components/TechStack.tsx`
- `src/components/Work.module.css`
- `src/pages/index.tsx`

**Estimated scope:** M (4-5 files)

### Task 9: Add reveal motion and responsive polish

**Description:** Add progressive reveal-on-scroll, reduced-motion handling, and
final responsive adjustments across the page.

**Acceptance criteria:**

- [ ] Sections reveal with the spec threshold and root margin.
- [ ] Content is visible without JavaScript.
- [ ] Reduced motion disables reveal and transitions.
- [ ] The 1.8s failsafe reveals everything.
- [ ] No horizontal scroll at any viewport in the matrix.
- [ ] Focus-visible outlines remain visible in both themes.

**Verification:**

- [ ] `pnpm build`
- [ ] Browser matrix: 360, 390, 430, 600, 820, 1024, 1366, 1440, 1920
- [ ] Disable JavaScript and reload
- [ ] Enable reduced motion and reload
- [ ] Check `document.documentElement.scrollWidth === clientWidth`

**Dependencies:** Task 8

**Files likely touched:**

- `src/hooks/useReveal.ts`
- `src/styles/globals.css`
- `src/components/About.module.css`
- `src/components/Work.module.css`
- `src/pages/index.tsx`

**Estimated scope:** M (5 files)

### Task 10: Add SEO metadata and final QA

**Description:** Add the document metadata, social tags, favicon, robots file,
and social image. Run the full spec QA pass and fix regressions found in the
stack.

**Acceptance criteria:**

- [ ] Title, description, canonical, OG, and Twitter tags come from `meta`.
- [ ] `lang="en"`, color-scheme, and theme-color are set.
- [ ] Favicon and `robots.txt` exist.
- [ ] `og.png` exists at 1200×630 (if approved).
- [ ] All spec success criteria pass.
- [ ] Lighthouse targets are met on the production build.

**Verification:**

- [ ] `pnpm check`
- [ ] `pnpm build`
- [ ] `out/index.html` and `out/resume.pdf` exist
- [ ] Full browser, keyboard, theme, reduced-motion, and no-JS passes
- [ ] Lighthouse desktop audit
- [ ] Invalid-content failure test

**Dependencies:** Task 9

**Files likely touched:**

- `src/pages/index.tsx`
- `src/pages/_document.tsx`
- `public/robots.txt`
- `public/favicon.svg`
- `public/og.png`

**Estimated scope:** M (5 files plus QA fixes)

## Checkpoints

### Checkpoint: After Task 3

- [ ] CI green
- [ ] Page renders all content from `content/`
- [ ] Invalid content fails the build
- [ ] Human review before styling work

### Checkpoint: After Task 6

- [ ] CI green
- [ ] Shell, header, skip link, and theme toggle work
- [ ] No theme flash on reload
- [ ] Human review before section styling

### Checkpoint: After Task 8

- [ ] CI green
- [ ] All five sections and footer render
- [ ] Layout holds at mobile and desktop widths
- [ ] Human review before motion and SEO

### Checkpoint: After Task 10

- [ ] Every spec success criterion checked
- [ ] Lighthouse targets met
- [ ] `main` deployed and verified on GitHub Pages
- [ ] Human sign-off

## Risks and mitigations

| Risk                                         | Impact | Mitigation                                                                |
| -------------------------------------------- | ------ | ------------------------------------------------------------------------- |
| Real content is not ready                    | High   | Block PR 2; keep it draft; do not merge placeholder identity              |
| Stacked branches drift or conflict           | Medium | Merge strictly bottom-up; squash; rebase with `--onto`; never reorder     |
| Intermediate merges deploy unfinished design | Medium | Accept, or pause the deploy workflow until the stack lands (ask first)    |
| Visual fidelity drifts from the reference    | High   | Freeze tokens; compare screenshots at 390/820/1440; no "close enough"     |
| `marked` leaks into client JS                | Medium | Import only in `getStaticProps`; grep `.next/static` in Task 3            |
| Theme flash or wrong icon state              | Medium | Pre-paint script; manual reload tests in both themes                      |
| Local `pnpm check` fails on `.agents/`       | Low    | Format or exclude the vendored skill locally; CI is unaffected            |
| GitHub CLI missing                           | Low    | Use the web UI or install `gh` with approval                              |
| Content validation is too weak               | Medium | Cover required fields, arrays, ids, hrefs, and referenced files in Task 3 |
| Static export breaks on a server-only API    | High   | No API routes, middleware, ISR, or `getServerSideProps`; build every PR   |
| "Built with Next.js" footer mismatch         | Low    | Confirm wording before Task 4; it is a one-line content change            |

## Open questions

1. Approve the planning assumptions above, especially `marked`, theme default,
   labels, footer note, OG image, and out-of-scope pages.
2. Provide the real content and résumé PDF before Task 2 merges.
3. Are intermediate deployments acceptable, or should deploys pause until the
   stack is complete?
4. Should `.agents/` and `skills-lock.json` be committed or gitignored?
5. Is installing `gh` approved, or should PRs be opened in the web UI?

## Definition of done

- All ten PRs merged in order, each with green CI.
- `main` builds and deploys to GitHub Pages.
- Every success criterion in `SPEC.md` is checked.
- No placeholder identity or copy remains.
- `content/site.json` and `content/profile.md` are the only places to edit copy.
