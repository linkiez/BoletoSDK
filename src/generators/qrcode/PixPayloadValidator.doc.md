# PixPayloadValidator

## Overview

Validates generated PIX EMV payloads before QR code rendering or downstream use.

## Responsibilities

- Validate TLV structure
- Validate required PIX fields
- Validate CRC16 checksum

## Inputs and outputs

- Input: PIX payload string
- Output: `void`

## API / Signature

```ts
export function validatePixPayload(payload: string): void;
```

## Error handling and edge cases

- Throws when the payload is empty
- Throws when the CRC field is missing or invalid
- Throws when mandatory PIX fields are missing

## Dependencies and integrations

- Used by `QRCodeGenerator`