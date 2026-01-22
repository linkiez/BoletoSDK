# Contributing to BoletoSDK

Thank you for contributing to BoletoSDK! This guide explains how to set up the project locally, follow conventions, and submit changes.

## Prerequisites

- Node.js >= 18
- Yarn 4 (see `packageManager` in package.json)

## Setup

```bash
corepack enable
corepack prepare yarn@4.12.0 --activate

yarn install
```

## Development Workflow

1. Create a branch from `main`.
2. Make changes in small, focused commits.
3. Run tests and linting before opening a PR.

## Commands

```bash
# Run all tests
yarn test

# Run tests in watch mode
yarn test:watch

# Run coverage report
yarn test:coverage

# Lint
yarn lint

# Format
yarn format
```

## Code Style

- TypeScript only (`.ts` files)
- Prefer small, composable functions
- Avoid duplicated logic (DRY)
- Keep public APIs documented with JSDoc

## Commit Convention

Use Conventional Commits (English):

- `feat: add cnab240 parser`
- `fix: handle missing batch header`
- `test: improve cnab400 generator coverage`
- `docs: update API reference`

## Pull Requests

Include:

- Clear description of the change
- Tests for new behavior
- Updated documentation when needed

## Reporting Issues

Open issues at:

- https://github.com/linkiez/BoletoSDK/issues
