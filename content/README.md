# Portfolio content

Page copy for Parth Chauhan lives in `site.json`. Edit that file and rebuild;
no component changes are needed for copy updates.

## Files

- `site.json` — structured page content, section labels, and the `profile.bio`
  paragraphs
- `../public/resume.pdf` — résumé

## Placeholders to replace

### Other files

- `../public/resume.pdf` — placeholder résumé; replace it with the latest
  export.

## Rules

- Keep `id` values unique and kebab-case.
- Keep arrays in display order.
- Hrefs must be `https://`, `mailto:`, or root-relative.
- Each `experience[]` entry needs a `description`, `highlights`, or both.
- The site rebuilds content at build time; run `vp run build` after edits.
- Do not use another person's identity as a placeholder.
