# generators/qrcode/index.ts

## Overview

Exports PIX QR code generation utilities.

## Responsibilities

- Provide public exports for PIX payload and QR code generators

## Inputs and outputs

- Input: N/A
- Output: QR code generator exports

## API / Signature

```ts
export * from './PixPayloadGenerator';
export * from './QRCodeGenerator';
export * from './QRCodeRenderer';
```

## Main flow

```mermaid
flowchart TD
  A[qrcode/index.ts] --> B[PixPayloadGenerator]
  A --> C[QRCodeGenerator]
  A --> D[QRCodeRenderer]
```

## Error handling and edge cases

- No runtime logic

## Examples

```ts
import { generatePixQRCode } from '@linkiez/boleto-sdk';
```

## Dependencies and integrations

- Used by `src/generators/index.ts`
