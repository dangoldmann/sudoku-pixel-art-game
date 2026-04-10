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

## Tooling Source Of Truth

- Scripts and command behavior: `package.json`
- Lint config: `eslint.config.mjs` (flat config with Next core-web-vitals + TypeScript)
- Formatting config: `.prettierrc.json`
- TypeScript strictness and path aliases: `tsconfig.json`

## Testing Status

- There is currently no test runner configured in `package.json` (`npm test` is not defined).
- If tests are introduced, add and document single-test commands in this file in the same PR.

## Coding Conventions

- Use TypeScript with strict typing; avoid `any` unless unavoidable.
- Respect existing import alias usage (`@/*` from `tsconfig.json`).
- Prefer alias imports (`@/...`) for cross-folder references; use relative imports for nearby siblings when clearer.
- Keep import groups ordered: external packages first, then internal modules.
- Prefer functional React components and hooks.
- Default to App Router server components; add `'use client'` only when hooks/browser APIs are required.
- In React 19 code paths, prioritize the `use()` hook for consuming promises and context when it is a clean fit.
- Keep components focused and composable; split large files when needed.
- Reuse shared UI components under `components/ui/` instead of duplicating styles/logic.
- Use explicit prop and return types when inference is not clear at boundaries.
- Guard nullable/optional values before use in render and event paths.
- Keep formatting Prettier-compatible; do not hand-format against Prettier output.
- Match existing formatting style (single quotes, semicolons, trailing commas).
- Treat ESLint warnings/errors as actionable (`lint` runs with `--max-warnings=0`).

## Naming Conventions

- Components and type names: `PascalCase`
- Hooks, variables, and functions: `camelCase` (`useXxx` for hooks)
- Constants: `UPPER_SNAKE_CASE` for fixed immutable values
- File names should follow the dominant convention already used in the target folder

## UI/UX Expectations

- Keep layouts responsive for mobile and desktop.
- Maintain visual consistency with existing design tokens and class usage.
- Avoid manual CSS for component styling; prefer Tailwind utilities and existing design patterns.
- Exception: defining keyframes/animation utilities in `app/globals.css` is acceptable.
- Ensure keyboard/focus behavior remains usable when adding interactive components.
- Use semantic elements and preserve logical heading order.
- Provide accessible labels for icon-only controls (`aria-label`).
- For dialogs/modals, preserve keyboard-close (`Escape`) behavior and set correct dialog semantics.

## Error Handling Expectations

- Fail safely in UI for recoverable states; avoid throwing during render for expected conditions.
- In async flows/effects, clean up listeners/timers and avoid stale updates.
- Keep user-visible errors concise and actionable.

## Performance Guidelines

- Prefer server-rendered data flow in App Router when possible instead of unnecessary client state.
- Avoid adding dependencies unless they provide clear value relative to bundle cost.
- Prefer CSS/Tailwind animations and transitions for lightweight motion.

## Change Workflow

1. Understand the target files and current behavior.
2. Make the minimal set of edits needed to satisfy the request.
3. Run relevant checks (`npm run lint`, `npm run format:check`, and `npm run build` when behavior/runtime could be affected).
4. Summarize changed files and any known limitations.

## Safety Rules

- Do not remove or rewrite unrelated user changes.
- Do not perform destructive git operations (`reset --hard`, force checkout) unless explicitly requested.
- Do not rewrite git history unless explicitly requested.
- Do not commit secrets or environment values.
- If a required tool fails due environment issues, report it clearly and continue with the best available verification.

## Agent Workflow Checklist

1. Before editing, read target files and nearby shared components to reuse existing patterns.
2. Keep diffs focused on the requested task; avoid unrelated refactors.
3. After editing, run relevant checks (`npm run lint`, `npm run format:check`, and `npm run build` when behavior/runtime could be affected).
4. Summarize changed files, validation performed, and any follow-up needed.

## Cursor / Copilot Rules

- Checked locations currently not present:
  - `.cursor/rules/`
  - `.cursorrules`
  - `.github/copilot-instructions.md`
- If any of these are added later, treat them as higher-priority repository instructions and update this file accordingly.

## Notes

- Both `package-lock.json` and `pnpm-lock.yaml` are present; avoid unnecessary lockfile churn unless dependency changes are requested.
