# ItauRejectionCodes

## Overview

Provides the known Itaú CNAB400 return rejection-code catalog used by Itaú adapter mapping flows.

## Responsibilities

- Define canonical code-to-description mappings for known Itaú rejection codes.
- Provide a single source of truth reused by mapper and tests.

## Inputs and outputs

- Input: N/A
- Output: `ITAU_REJECTION_CODE_DESCRIPTION_MAP` constant.

## API / Signature

```ts
export const ITAU_REJECTION_CODE_DESCRIPTION_MAP: Record<string, string>;
```

## Error handling and edge cases

- Not applicable (constant-only module).

## Examples

```ts
import { ITAU_REJECTION_CODE_DESCRIPTION_MAP } from '@constants/bancos';

const description = ITAU_REJECTION_CODE_DESCRIPTION_MAP['00000001'];
// "Rejected due to invalid wallet code"
```

## Dependencies and integrations

- Consumed by [src/adapters/itau/ItauReturnMapper.ts](../../adapters/itau/ItauReturnMapper.ts).
