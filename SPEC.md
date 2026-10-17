# Spec: Personal Portfolio Site

Status: **Approved — 2026-10-17**
Date: 2026-10-17
Reference design: `/Users/parth.chauhan/apps/Minimal-Frontend-Portfolio/frontend-engineer-portfolio.html`

## Scope check

This is one capability: a single-page personal portfolio with a content layer.
There is no capability map and no module decomposition; the content loader is an
implementation detail of the page, not a separately shipped surface.

## Objective

Replace the `create-next-app` placeholder with a one-page portfolio for Parth
Chauhan that matches the reference design's visual system and interactions, with
all prose and structured data stored in `content/` rather than hardcoded in
components.

A visitor should be able to answer, in one scroll:

- Who is this person and what do they do?
- Where are they based, and are they available?
- What have they worked on, and where?
- How do I contact them or download their résumé?

Success means the page looks and behaves like the reference at every target
viewport, while changing any copy is a content-file edit only.

### Out of scope

- Blog, project case studies, CMS, or additional routes
- Contact form, backend, or server-side runtime
- Analytics, cookie banner, i18n, or newsletter signup
- Custom domain migration (site stays on `parth-p-chauhan.github.io` for now)
- Redesigning the visual language

## Users and journeys

1. **Recruiter / hiring manager** — hero → profile → experience → résumé →
   email. Must reach a downloadable résumé in two interactions or fewer.
2. **Peer / collaborator** — hero → networking links.
3. **Mobile visitor** — same content, single column, no horizontal scrolling.

## Tech stack

- Next.js 16.4.2, **Pages Router** (`src/pages`), React 19.3, TypeScript strict
- pnpm 12.8.1; Node 22 in CI
- Global CSS custom properties for tokens + CSS Modules for components
- `marked` for build-time Markdown → HTML conversion (**new dependency, needs
  approval**)
- Static export (`output: "export"`); no runtime data fetching
- oxlint + oxfmt; no test framework currently

## Content model

Content lives outside `src/` so it can be edited without touching application
code.

```
content/
  site.json        # all structured page content
  profile.md       # long-form bio, Markdown
public/
  resume.pdf       # downloadable résumé
  og.png           # optional social preview image (1200×630)
```

`content/site.json` is the single source of structured data. Array order is
display order. The page owns section order; JSON cannot reorder sections.

### Schema

```json
{
  "meta": {
    "title": "Parth Chauhan — Frontend Engineer",
    "description": "One or two sentences for search results and social cards.",
    "canonicalUrl": "https://parth-p-chauhan.github.io/",
    "locale": "en",
    "ogImage": "/og.png"
  },
  "brand": {
    "initials": "PC",
    "ariaLabel": "Parth Chauhan — back to top"
  },
  "hero": {
    "kicker": "Frontend Engineer",
    "name": "Parth Chauhan",
    "intro": "One or two sentences in the reference's voice."
  },
  "labels": {
    "profile": "Profile",
    "networking": "Networking",
    "experience": "Work Experience",
    "stack": "Tech Stack"
  },
  "profile": {
    "facts": [
      { "label": "Location", "value": "City, Country (TZ)" },
      {
        "label": "Availability",
        "value": "Open to contract & full-time",
        "highlight": true
      },
      {
        "label": "Résumé",
        "link": {
          "label": "Download PDF",
          "href": "/resume.pdf",
          "download": true
        }
      }
    ]
  },
  "networking": [
    {
      "id": "github",
      "label": "GitHub",
      "href": "https://github.com/…",
      "external": true
    }
  ],
  "experience": [
    {
      "id": "job-example",
      "company": "Company",
      "role": "Senior Frontend Engineer",
      "start": "2022",
      "end": "Present",
      "description": "One or two sentences about scope and impact."
    }
  ],
  "stack": [
    {
      "id": "languages",
      "label": "Languages",
      "items": ["TypeScript", "JavaScript", "HTML", "CSS", "SQL"]
    }
  ],
  "footer": {
    "copyrightHolder": "Parth Chauhan",
    "note": "Built with Next.js"
  }
}
```

Rules:

- `profile` always renders the bio from `content/profile.md`; the path is fixed,
  not configurable.
- `labels` supplies every section title. Renaming a section is a content edit.
- `profile.facts[]` is a discriminated union: each entry has either `value`
  (string, optional `highlight` for the availability dot) or `link`
  (`label`, `href`, optional `download`).
- `networking[]` and `experience[]` require `id` values that are stable and
  kebab-case; `id` is used only for React keys.
- `start` and `end` are display strings (`"2022"`, `"Present"`). The UI renders
  `start — end` and does not calculate tenure.
- `stack[].items` is a list of short labels, joined with `, `.
- At launch every array must be non-empty. A section whose array is empty is a
  content error, not a hidden section.
- The footer year is computed at build time; JSON stores only the holder name.
- No page copy or section title may live in a component. Fixed control strings
  (skip link, theme-toggle label) are the only exception.

### Markdown

`content/profile.md` supports paragraphs, emphasis, links, and inline code.
Raw HTML is allowed only because the file is repo-owned and trusted; user input
is never rendered this way. The bio is converted to HTML in `getStaticProps` and
passed to the page, so `marked` never reaches the client bundle.

### Loading and validation

- `src/lib/content.ts` exports `SiteContent` types, `loadContent()`, and
  `assertSiteContent()`.
- `loadContent()` reads both files with `fs` inside `getStaticProps`; it is
  never imported into client code.
- Validation fails the build with a message that includes the file and JSON path,
  e.g. `content/site.json: profile.facts[2] must have "value" or "link"`.
- Validation also checks non-empty arrays, absolute `http(s)`/`mailto:`/root-
  relative hrefs, unique `id` values, and presence of referenced files
  (`public/resume.pdf`).
- `getStaticProps` returns `{ content, profileHtml }`. Changing content requires
  a rebuild; that is acceptable for this site.

### Content still needed (blocking)

These are placeholders until Parth supplies real values:

| Field                                           | Status   |
| ----------------------------------------------- | -------- |
| Name, kicker, intro                             | Needed   |
| Meta title/description/canonical URL            | Needed   |
| Location and timezone                           | Needed   |
| Availability wording                            | Needed   |
| Email, GitHub, LinkedIn, X URLs                 | Needed   |
| Work history: company, role, dates, description | Needed   |
| Tech stack groups                               | Needed   |
| `public/resume.pdf`                             | Needed   |
| `public/og.png`                                 | Optional |

Reference copy from Alex Mercer must not survive in the final site.

## Project structure

```
content/                 → editable site content
public/                  → résumé, social image, favicon
src/components/          → presentational sections, colocated CSS Modules
src/hooks/               → useTheme, useReveal
src/lib/content.ts       → content types, loading, validation
src/pages/_app.tsx       → global CSS and app shell
src/pages/_document.tsx  → lang, theme bootstrap script
src/pages/index.tsx      → page composition + getStaticProps
src/styles/globals.css   → tokens, reset, base elements
```

Components:

- `SiteHeader`, `ThemeToggle`, `SkipLink`
- `Hero`, `Section`, `Profile`, `Networking`, `Experience`, `TechStack`
- `SiteFooter`

`Section` owns the numbered heading row (`01`, `02`, …) so numbering stays
consistent when sections are added or removed.

## Code style

- Follow `.oxfmtrc.json`: double quotes, semicolons, 2-space indent, 80 columns,
  sorted imports.
- Default-export page components; named exports for shared components.
- Props are explicit interfaces; no `any`.
- No client-side data fetching.
- Example of the expected shape:

```tsx
export function Section({ number, title, children }: SectionProps) {
  return (
    <section className={styles.section}>
      <div className={styles.head}>
        <span className={styles.number} aria-hidden="true">
          {number}
        </span>
        <h2 className={styles.title}>{title}</h2>
      </div>
      {children}
    </section>
  );
}
```

## Design system

Preserve the reference exactly; these values are the contract.

| Token       | Light                   | Dark                    |
| ----------- | ----------------------- | ----------------------- |
| `--bg`      | `oklch(98.4% 0.003 85)` | `oklch(16.5% 0.004 80)` |
| `--surface` | `oklch(100% 0 0)`       | `oklch(20% 0.005 80)`   |
| `--fg`      | `oklch(18% 0.01 80)`    | `oklch(93% 0.004 85)`   |
| `--muted`   | `oklch(45% 0.008 80)`   | `oklch(70% 0.008 80)`   |
| `--border`  | `oklch(90% 0.005 85)`   | `oklch(28% 0.006 80)`   |
| `--accent`  | `oklch(47% 0.115 42)`   | `oklch(73% 0.095 48)`   |

Also preserve:

- System sans stack for display/body, system mono for meta labels
- `--fs-h1: clamp(38px, 8.5vw, 58px)`, body `16px`, meta `12px`
- `--measure: 680px`, `--gutter: clamp(22px, 5vw, 32px)`, `--radius: 6px`
- 52px sticky header; 132px label column on desktop
- 2-column networking grid, single column at `560px`
- Section rhythm via `clamp()`; hover/focus transitions at `0.15s ease`
- Reveal transition at `0.55s ease`, translate `10px`

Drop the reference's `data-od-id` attributes; they are design-tool annotations,
not production markup. No OpenDesign labels or preview chrome.

## Behaviour

### Theme

- Default follows `prefers-color-scheme`.
- An inline script in `_document.tsx` applies a stored `portfolio-theme` value
  before first paint and adds a `js` class to `<html>`. No flash of wrong theme.
- The toggle writes `data-theme`, persists to `localStorage`, and updates
  `aria-pressed` and `aria-label` ("Switch to light/dark theme").
- Invalid or unavailable `localStorage` is ignored.
- System changes apply only while no explicit preference is stored.

### Reveal on scroll

- Sections reveal with `IntersectionObserver` at `threshold: 0.08` and
  `rootMargin: "0px 0px -8% 0px"`.
- All content is visible without JavaScript; the reveal styles apply only under
  the `js` class.
- A 1.8s failsafe reveals everything if observation never fires.
- `prefers-reduced-motion: reduce` disables reveal and other transitions.

### Links

- External networking links open in the same tab; no `target="_blank"` unless a
  visible or screen-reader-only indication is added.
- Email uses `mailto:`; résumé uses a root-relative download link.
- Focus-visible outline is never removed.

## Accessibility

- One `<h1>`; each section is a `<section>` with `aria-labelledby`; jobs use
  `<h3>`.
- Skip link to `<main id="main">`; `<main tabIndex={-1}>`.
- Section numbers, arrows, and availability dots are `aria-hidden`.
- Theme toggle is a real `<button>` with an accessible name and state.
- Target WCAG 2.2 AA contrast in both themes, including accent hover states.
- Keyboard path: skip link → brand → theme toggle → bio/résumé links →
  networking → footer.
- `lang="en"` on `<html>`.

## SEO and metadata

- `<title>` and `<meta name="description">` from `meta`.
- Canonical URL, Open Graph, and Twitter card tags from `meta`.
- `meta name="color-scheme"` and `theme-color` for light/dark.
- Favicon derived from the `PC` monogram; `og.png` optional but recommended.
- Static export with `trailingSlash: true`, so canonical URLs end in `/`.
- Add `public/robots.txt` allowing all crawlers.

## Responsive contract

Verify no horizontal overflow at:

`360×800`, `390×844`, `430×932`, `600×960`, `820×1180`, `1024×768`,
`1366×768`, `1440×900`, `1920×1080`.

Fluid `clamp()` handles type and spacing; the only layout breakpoint is `560px`.
The sticky header must not obscure anchor targets.

## Testing and verification

No new test framework in this scope. Verification is:

1. `pnpm check` — lint, formatting, typecheck
2. `pnpm build` — static export, content validation, Markdown conversion
3. Confirm `out/index.html` and `out/resume.pdf` exist
4. Browser checks at the full viewport matrix
5. Keyboard-only pass and visible focus check
6. Theme pass: light, dark, system default, persisted choice, no flash on reload
7. Reduced-motion pass
8. JavaScript-disabled pass: all content readable
9. Content edit pass: change a JSON value and a Markdown paragraph, rebuild,
   confirm the page updates without component edits
10. Invalid-content pass: remove a required field, confirm the build fails with a
    pointed error

If visual regressions become likely, adding Playwright screenshots would be a
separate, approved change.

## Boundaries

**Always**

- Keep visible copy in `content/`; components receive content as props.
- Preserve the design tokens, spacing, type scale, and interaction timings above.
- Run `pnpm check` and `pnpm build` before calling the work done.
- Keep semantic HTML, keyboard access, and visible focus states.
- Check the responsive matrix for horizontal overflow.

**Ask first**

- Adding any dependency (`marked` is the only proposed one)
- Changing design tokens, layout geometry, or section order
- Adding routes, analytics, a CMS, or a contact backend
- Changing CI, deployment, or the canonical domain
- Replacing `resume.pdf` with a generated document

**Never**

- Hardcode personal copy or links in components
- Add API routes, middleware, ISR, or `getServerSideProps`
- Render untrusted content with `dangerouslySetInnerHTML`
- Remove the skip link, theme-toggle state, or reduced-motion handling
- Commit secrets, the reference HTML, or design-tool annotations
- Edit generated files (`next-env.d.ts`, `*.tsbuildinfo`)
- Let reference placeholder identity (Alex Mercer, Copenhagen, example.com)
  reach production

## Success criteria

- [ ] Page matches the reference's typography, spacing, colors, and layout at all
      target viewports.
- [ ] All page copy, including section titles, comes from `content/site.json` or
      `content/profile.md`.
- [ ] Editing content and rebuilding changes the site with no component edits.
- [ ] Invalid content fails `pnpm build` with a file-and-field error.
- [ ] Theme toggle persists, respects system preference, and does not flash.
- [ ] Reveal animation is progressive and disabled for reduced motion.
- [ ] Keyboard-only navigation reaches every interactive element with visible
      focus.
- [ ] No horizontal scroll at any viewport in the matrix.
- [ ] `pnpm check` and `pnpm build` pass; `out/` contains the page and résumé.
- [ ] No Alex Mercer / example.com placeholder content remains.
- [ ] Lighthouse (desktop, production build) targets: Performance ≥ 95,
      Accessibility 100, Best Practices ≥ 95, SEO ≥ 95.

## Open questions

1. **Real content** — the table above is still empty. Can you provide résumé,
   work history, stack, location/timezone, availability, email, and social URLs?
2. **Markdown dependency** — approve `marked` for `profile.md`, or keep the bio
   as plain paragraphs inside JSON?
3. **Section labels** — keep "Profile", "Networking", "Work Experience", "Tech
   Stack", or rename (e.g. "About", "Elsewhere")?
4. **Theme default** — follow the OS, or default to light regardless of system?
5. **Canonical URL** — confirm `https://parth-p-chauhan.github.io/` until a
   custom domain exists.
6. **Footer note** — "Built with Next.js", or omit the note entirely?
7. **Social preview** — do you want a generated `og.png` monogram, or skip it
   for now?
8. **Additional pages** — confirm projects/blog are out of scope for this spec.
