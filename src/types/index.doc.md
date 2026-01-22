# types/index.ts

## Overview

Aggregates TypeScript types for CNAB240, CNAB400, common, and JSON representations.

## Responsibilities

- Re-export CNAB240 types
- Re-export CNAB400 types with conflict-safe aliases
- Re-export common and JSON types

## Inputs and outputs

- Input: N/A
- Output: TypeScript type exports

## API / Signature

```ts
export * from './cnab240'
export type { Cnab400File, Cnab400ReturnFile, ... } from './cnab400'
export * from './common'
export * from './json'
```

## Main flow

```mermaid
flowchart TD
  A[types/index.ts] --> B[cnab240]
  A --> C[cnab400]
  A --> D[common]
  A --> E[json]
```

## Error handling and edge cases

- No runtime logic

## Examples

```ts
import type { Cnab240File, Cnab400File } from '@linkiez/boleto-sdk';
```

## Dependencies and integrations

- Used by public APIs and documentation
