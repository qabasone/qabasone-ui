# UI Component Architecture

This directory is the source of truth for reusable UI building blocks.

## Layers

- `atoms/`
- Small, highly reusable presentational primitives.
- Should not depend on `organisms/`.

- `molecules/`
- Compositions of atoms and focused interaction patterns.
- Can depend on `atoms/` and `hooks/`.

- `organisms/`
- Heavier interactive or stateful components that orchestrate multiple pieces.
- Can depend on `atoms/`, `molecules/`, and `hooks/`.

- `hooks/`
- Shared React hooks extracted from reusable behavior.
- Keep UI-agnostic where possible.

## Boundaries

- `src/ui/components` contains reusable components only.
- `src/app/components/sections` is for showcase pages and design-system demos.
- Do not move showcase sections into `src/ui/components`.

## Export Strategy

- Public package API is exposed through `src/ui/*` and package subpath exports.
- Keep compatibility wrapper files at `src/ui/components/*.tsx` stable.
- Prefer implementing new logic in the layer folders (`atoms`, `molecules`, `organisms`) and re-export from wrappers.

## Naming

- Components: `PascalCase.tsx`
- Hooks: `useXxx.ts`
- Use explicit named exports for components and hooks.
