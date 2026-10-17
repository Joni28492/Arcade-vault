# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

Arcade Vault: a platform for playing games online and competing for the highest score. Currently a fresh Create Next App scaffold (a single `app/page.tsx`, no game logic, API, or tests yet). The README states the project follows spec-driven development (`/spec` and `/spec-impl`) using skills from `Klerith/fernando-skills` (installed via `npx skills@latest add Klerith/fernando-skills`).


## Skills
usa siempre el /frontend-design para hacer interfaces de usuario


## Commands

```bash
npm run dev     # next dev
npm run build   # next build
npm run start   # next start (after build)
npm run lint    # eslint (flat config in eslint.config.mjs, eslint-config-next)
```

There is no test runner configured.

## Stack and conventions

- Next.js 16.4 (App Router, `app/` at repo root, no `src/`), React 19.3, TypeScript strict, Tailwind CSS v4.
- **Next.js here has breaking changes versus common training data.** Per `AGENTS.md`, read the relevant guide in `node_modules/next/dist/docs/` (start at `index.md`) before writing Next.js code, and heed deprecation notices.
- The `AGENTS.md` block (`nextjs-agent-rules`) is written and re-added by `next dev`; if it shows up in a diff, commit it rather than deleting it.
- Tailwind is wired through `@tailwindcss/turbopack` (devDependency) instead of PostCSS.
- Path alias: `@/*` maps to the repo root (not `src/`).
- Tailwind v4 is configured in CSS only: `app/globals.css` uses `@import "tailwindcss"` and `@theme inline` to expose `--background`/`--foreground` and the Geist font variables as theme tokens. There is no `tailwind.config` or `postcss.config`.
- `app/layout.tsx` types its props with the globally generated `LayoutProps<"/">` helper (from Next's typed routes) rather than a hand-written props type, and loads Geist / Geist Mono via `next/font/google`.
