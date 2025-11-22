# Amadaius Monorepo

This repository now uses a pnpm + Turborepo workspace to manage the Amadaius packages.

## Structure

- `packages/amadaius/` – the core Amadaius library (published to npm as [`amadaius`](https://www.npmjs.com/package/amadaius)).
- `apps/` – reserved for future applications and examples.
- `turbo.json` – shared task pipeline definitions for linting, testing, building, and formatting.
- `tsconfig.base.json` – shared TypeScript compiler options for workspace packages.

## Scripts

Run workspace tasks with pnpm from the repository root:

- `pnpm lint` – run lint tasks via Turborepo
- `pnpm test` – run tests (after building dependencies)
- `pnpm build` – build all packages
- `pnpm format` – run format checks

For package-specific instructions, see the README inside each package directory.
