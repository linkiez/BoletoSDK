# ItauReturnMapper

## Overview

Maps Itaú CNAB400 return-only metadata that is not covered by occurrence mapping, focusing on liquidation channel codes and rejection message area normalization.

## Responsibilities

- Map supported Itaú liquidation codes to normalized semantic categories.
- Validate whether a liquidation code is supported.
- Normalize rejection message area into code-based or text-based metadata.
- Prioritize known rejection code catalog descriptions before generic fallback descriptions.
- Expose the source of each rejection description (`catalog`, `fallback`, `free-text`).
- Normalize numeric rejection codes to 8 digits before catalog/fallback resolution.

## Inputs and outputs

- Inputs:
  - `liquidationCode: string`
  - `rejectionMessage: string | undefined`
- Outputs:
  - `ItauLiquidationMapping`
  - `ItauRejectionMessageMapping | undefined`

## API / Signature

```ts
export const ITAU_LIQUIDATION_CODE_MAP: Record<ItauLiquidationCode, ItauLiquidationMapping>;

export function isValidItauLiquidationCode(
  liquidationCode: string,
): liquidationCode is ItauLiquidationCode;

export function mapItauLiquidationCode(liquidationCode: string): ItauLiquidationMapping;

export function mapItauRejectionMessage(
  rejectionMessage: string | undefined,
): ItauRejectionMessageMapping | undefined;
```

## Main flow

```mermaid
flowchart TD
  A[Return metadata fields] --> B{Liquidation code present?}
  B -- Yes --> C[Validate and map liquidation channel]
  B -- No --> D[Skip liquidation mapping]
  A --> E{Rejection message present?}
  E -- Yes --> F[Normalize as code or text]
  E -- No --> G[Return undefined]
```

## Error handling and edge cases

- Rejects unsupported liquidation codes in strict mapping function.
- Returns `undefined` for empty rejection message area.
- Returns `undefined` for all-zero numeric rejection message payloads.
- Distinguishes numeric rejection payloads from free-text messages.
- Uses known-code descriptions when available, otherwise falls back to generic code description.
- Adds `source` metadata so SDK consumers can distinguish catalog-driven versus inferred descriptions.
- Converts short numeric codes (for example `1`) to canonical 8-digit codes (`00000001`).

## Examples

```ts
mapItauLiquidationCode('02');
// { code: '02', category: 'clearing', description: 'Liquidation channel 02 (clearing)' }

mapItauRejectionMessage('12345678');
// {
//   raw: '12345678',
//   category: 'code',
//   code: '12345678',
//   source: 'fallback',
//   description: 'Itaú rejection code from return message area: 12345678'
// }

mapItauRejectionMessage('00000001');
// {
//   raw: '00000001',
//   category: 'code',
//   code: '00000001',
//   source: 'catalog',
//   description: 'Rejected due to invalid wallet code'
// }

mapItauRejectionMessage('1');
// {
//   raw: '1',
//   category: 'code',
//   code: '00000001',
//   source: 'catalog',
//   description: 'Rejected due to invalid wallet code'
// }

mapItauRejectionMessage('TITLEERR');
// {
//   raw: 'TITLEERR',
//   category: 'text',
//   source: 'free-text',
//   description: 'Itaú free-text rejection message from return message area'
// }
```

## Dependencies and integrations

- Depends on `src/types/adapters/itau/index.ts`.
- Consumed by `src/adapters/itau/ItauAdapter.ts`.
