# types/index.ts

## Overview

Aggregates TypeScript types for CNAB240, CNAB400, common, JSON, and bank adapter representations.

## Responsibilities

- Re-export CNAB240 types
- Re-export CNAB400 types with conflict-safe aliases
- Re-export common and JSON types
- Re-export adapter-specific type contracts

## Inputs and outputs

- Input: N/A
- Output: TypeScript type exports

## API / Signature

```ts
export * from './cnab240'
export type { Cnab400File, Cnab400ReturnFile, ... } from './cnab400'
export * from './common'
export * from './json'
export * from './adapters'
```

## Main flow

```mermaid
flowchart TD
  A[types/index.ts] --> B[cnab240]
  A --> C[cnab400]
  A --> D[common]
  A --> E[json]
  A --> F[adapters]
```

## Error handling and edge cases

- No runtime logic

## Examples

```ts
import type { Cnab240File, Cnab400File, ItauWalletCode } from '@linkiez/boleto-sdk';
```

## Dependencies and integrations

- Used by public APIs and documentation
