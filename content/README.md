# Portfolio content

Phase 1 ships placeholder content so the design and content pipeline can be
built. Replace every item below before the site is considered finished.

## Files

- `site.json` — structured page content, section labels, and the `profile.bio`
  paragraphs
- `../public/resume.pdf` — résumé

## Placeholders to replace

### `site.json`

- `meta.description` — generic description
- `hero.intro` — placeholder intro sentence
- `profile.bio` — placeholder bio paragraphs
- `profile.facts[0].value` — `City, Country (TZ)`
- `profile.facts[1].value` — generic availability wording
- `networking[]` — LinkedIn, X, and email are placeholders; GitHub is real
- `experience[]` — company names, roles, dates, and descriptions
- `stack[]` — generic frontend stack

### Other files

- `../public/resume.pdf` — placeholder résumé

## Rules

- Keep `id` values unique and kebab-case.
- Keep arrays in display order.
- Hrefs must be `https://`, `mailto:`, or root-relative.
- The site rebuilds content at build time; run `pnpm build` after edits.
- Do not use another person's identity as a placeholder.
