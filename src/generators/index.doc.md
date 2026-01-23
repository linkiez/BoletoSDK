# generators/index.ts

## Overview

Aggregates public generator exports.

## Responsibilities

- Re-export generator modules (CNAB, barcode, factories)

## Inputs and outputs

- Input: N/A
- Output: Generator exports

## API / Signature

```ts
export * from './barcode';
export * from './cnab240';
export * from './cnab400';
export * from './CnabGeneratorFactory';
```

## Main flow

```mermaid
flowchart TD
  A[generators/index.ts] --> B[barcode]
  A --> C[cnab240]
  A --> D[cnab400]
  A --> E[CnabGeneratorFactory]
```

## Error handling and edge cases

- No runtime logic

## Examples

```ts
import { renderI2of5Svg } from '@linkiez/boleto-sdk';
```

## Dependencies and integrations

- Exported by `src/index.ts`
