# types/adapters/index.ts

## Overview

Aggregates type exports for bank adapters.

## Responsibilities

- Re-export adapter-specific type definitions.

## Inputs and outputs

- Input: N/A
- Output: Adapter type exports.

## API / Signature

```ts
export * from './itau';
export * from './bradesco';
```

## Main flow

```mermaid
flowchart TD
  A[types/adapters/index.ts] --> B[itau types]
  A --> C[bradesco types]
```

## Error handling and edge cases

- No runtime logic.

## Examples

```ts
import type { ItauWalletCode, BradescoWalletCode } from '@linkiez/boleto-sdk';
```

## Dependencies and integrations

- Depends on `src/types/adapters/itau/index.ts` and `src/types/adapters/bradesco/index.ts`.
