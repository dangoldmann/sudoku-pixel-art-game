# AGENTS.md

## Project Overview

- Name: `sudoku-pixel-art-game`
- Stack: Next.js 16, React 19, TypeScript (strict), Tailwind CSS 4
- Tooling: ESLint 9 (flat config) + Prettier 3
- Origin: Bootstrapped with v0 and linked to a v0 project

## Goals For Agents

- Keep changes small, clear, and easy to review.
- Preserve existing behavior unless a task explicitly requests behavior changes.
- Prioritize accessibility and responsive behavior for UI work.
- Prefer consistent patterns already used in `app/`, `components/`, `hooks/`, and `lib/`.

## Repository Layout

- `app/`: Next.js App Router pages/layouts.
- `components/`: Reusable UI and feature components.
- `hooks/`: Custom React hooks.
- `lib/`: Shared utilities/helpers.
- `styles/`: Global styling assets.
- `public/`: Static assets.

## Local Commands

- Install deps: `npm install`
- Dev server: `npm run dev`
- Build: `npm run build`
- Start prod server: `npm run start`
- Lint: `npm run lint`
- Auto-fix lint issues: `npm run lint:fix`
- Format code: `npm run format`
- Check formatting without writing: `npm run format:check`

## Coding Conventions

- Use TypeScript with strict typing; avoid `any` unless unavoidable.
- Respect existing import alias usage (`@/*` from `tsconfig.json`).
- Prefer functional React components and hooks.
- Keep components focused and composable; split large files when needed.
- Reuse shared UI components under `components/ui/` instead of duplicating styles/logic.
- Keep formatting Prettier-compatible; do not hand-format against Prettier output.
- Treat ESLint warnings/errors as actionable (`lint` runs with `--max-warnings=0`).

## UI/UX Expectations

- Keep layouts responsive for mobile and desktop.
- Maintain visual consistency with existing design tokens and class usage.
- Ensure keyboard/focus behavior remains usable when adding interactive components.

## Change Workflow

1. Understand the target files and current behavior.
2. Make the minimal set of edits needed to satisfy the request.
3. Run relevant checks (`npm run lint`, `npm run format:check`, and `npm run build` when behavior/runtime could be affected).
4. Summarize changed files and any known limitations.

## Safety Rules

- Do not remove or rewrite unrelated user changes.
- Do not perform destructive git operations (`reset --hard`, force checkout) unless explicitly requested.
- If a required tool fails due environment issues, report it clearly and continue with the best available verification.

## Notes

- Both `package-lock.json` and `pnpm-lock.yaml` are present; avoid unnecessary lockfile churn unless dependency changes are requested.
