# Testing

This document describes the testing strategy and how to run tests in BoletoSDK.

## Test Types

- **Unit Tests**: Validate isolated modules (formatters, parsers, generators, validators)
- **Integration Tests**: Validate end-to-end parsing/generation and real fixtures

## Running Tests

```bash
# All tests
yarn test

# Watch mode
yarn test:watch

# Coverage report
yarn test:coverage
```

## Coverage Targets

- Line coverage ≥ 90%
- Branch coverage ≥ 85%
- Function coverage ≥ 90%

## Fixtures

- `tests/fixtures/cnab400/` contains real CNAB400 files
- CNAB240 tests rely on helpers in `tests/helpers/`

## Useful Commands

```bash
# Lint
yarn lint

# Format
yarn format
```

## Notes

- Use deterministic inputs (no random data)
- Keep tests independent and fast
- Prefer meaningful assertions over snapshots
