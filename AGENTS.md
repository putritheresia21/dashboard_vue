# Dashboard Vue Agent Instructions

## Project overview

- Vue 3 application using Vite, TypeScript, Tailwind CSS, Pinia, and Vue Router.
- Use npm for package management and scripts.
- UI primitives and shells come from the private `@bernofarm/core` and `@bernofarm/shell` packages.
- Keep the application light-mode, clean, minimal, and driven by Bernofarm theme tokens.

## Source architecture

```text
src/
├── app/       # application composition: router, navigation, config
├── features/  # domain modules and business logic
├── shared/    # reusable components, composables, services, utils, mocks
├── views/     # route entry wrappers only
└── assets/    # static assets
```

- Keep route wrappers in `src/views/`; page behavior belongs in `src/features/`.
- Put reusable code in `src/shared/`, not in a growing root-level `components/` or `utils/` folder.
- Prefer the existing primitive from `@bernofarm/core` before creating a consumer-side replacement.
- Prefer `@bernofarm/shell` for application and authentication layout behavior.
- Keep feature boundaries explicit. Do not import business logic across unrelated features without a shared abstraction.

## UI and styling

- Use Tailwind CSS and Bernofarm theme tokens as the source of truth for colors, spacing, radius, shadows, and animation.
- Do not add vanilla CSS for component or page styling.
- Do not hardcode repeated brand colors when a Bernofarm token exists.
- New icons should use the approved Hugeicons integration. Do not add new PrimeVue or PrimeIcons usage.
- Consumer pages should require minimal configuration and should work with the library defaults.

## Code conventions

- Use TypeScript in this dashboard project; avoid `any` unless there is no safe alternative and the boundary is documented.
- Use PascalCase for Vue component files, kebab-case for folders, and framework-required names such as `[id].vue` for dynamic routes.
- Keep imports sorted with the configured ESLint rule.
- Provide defaults for optional Vue props.
- Avoid unused variables, duplicate imports, nested ternaries, parameter mutation, and business logic in templates.
- Use `===` and `!==`, always brace conditional blocks, and prefer `const`.
- Keep accessibility intact: labels must reference element `id` values, interactive elements need accessible labels, and lists need stable keys.

## Repository rules

- Do not add `specs/`, `plans/`, or similar planning artifacts to the repository.
- Do not commit or push changes unless explicitly requested.
- Preserve unrelated user changes in the working tree.
- Use `apply_patch` for source edits when possible.

## Verification

Run the relevant checks after changes:

```bash
npm run lint -- --no-fix
npm run type-check
npm run format:check
git diff --check
```

Run `npm run build-only` when the change affects routing, bundling, or production behavior. Report pre-existing failures separately from regressions introduced by the change.
