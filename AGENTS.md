# parth-p-chauhan.github.io

Personal site, statically exported and deployed to GitHub Pages on every push
to `main`.

## Stack

- Next.js 16.4.2 **Pages Router** (`src/pages`), React 19.3, TypeScript strict
- pnpm 12.8.1 (pinned in `package.json`); CI uses Node 22
- oxlint + oxfmt, not ESLint/Prettier
- lefthook pre-commit hook

## Commands

- `pnpm dev` — local dev server
- `pnpm check` — lint + format check + typecheck; run before declaring work done
- `pnpm lint` / `pnpm lint:fix` — oxlint
- `pnpm format` / `pnpm format:check` — oxfmt over the whole repo
- `pnpm typecheck` — `tsc --noEmit`
- `pnpm build` — static export into `out/`

There is no test framework. `pnpm check` and `pnpm build` are the verification
steps; CI runs both on every PR and push to `main`.

## Layout

- `src/pages/_app.tsx` — global CSS import and app shell
- `src/pages/_document.tsx` — HTML document
- `src/pages/index.tsx` — home page
- `src/styles/globals.css` — global styles only
- `@/*` maps to `src/*` (use `@/styles/globals.css`, not relative hops)

Pages are default-exported functions typed with `AppProps` where applicable.
Metadata goes through `next/head`; fonts through `next/font/google`.

## Formatting and lint

oxfmt is the source of truth: double quotes, semicolons, 2-space indent,
80-column width, trailing commas, and sorted imports. Do not hand-format
against it. oxlint enables `correctness` as error and `suspicious` as warning,
with the `typescript`, `unicorn`, `oxc`, `react`, `nextjs`, and `jsx-a11y`
plugins.

The pre-commit hook runs `oxlint --fix` and `oxfmt --write` on staged files and
re-stages them, so a commit may modify your files.

## Static-export constraints (easy to break)

`next.config.ts` sets `output: "export"`, `images.unoptimized`, and
`trailingSlash`. The site is plain static files in `out/`:

- No API routes, middleware, ISR, or `getServerSideProps`.
- Data fetching must happen at build time via `getStaticProps` /
  `getStaticPaths`.
- `next/image` only works because optimization is globally disabled; do not
  turn it back on without a loader.
- `pnpm build` must succeed locally before pushing, because deploy uploads
  `out/` and fails otherwise.

## Gotchas

- Do not create `src/app/` or React Server Components. This is the Pages
  Router on purpose.
- Do not edit `next-env.d.ts` or `*.tsbuildinfo`; both are generated and
  gitignored.
- The `nextjs-agent-rules` block at the bottom of this file is rewritten in
  place by `next dev`. Leave it where it is and include it in commits.
- Use pnpm only. CI installs with `--frozen-lockfile`, so commit
  `pnpm-lock.yaml` with any dependency change.
- `format:check` scans the entire repo, including Markdown under `.agents/`;
  vendored skill files must be formatted or excluded before `pnpm check`
  passes.
- Pushing to `main` deploys directly. There is no staging environment or
  release step.

<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
