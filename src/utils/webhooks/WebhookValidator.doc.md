# WebhookValidator

## Overview

Validates webhook endpoint URLs and generates payload signatures.

## Responsibilities

- Validate whether a URL is HTTP or HTTPS.
- Create SHA-256 signatures for webhook payloads.

## Inputs and outputs

- Inputs:
  - Webhook URL strings.
  - Raw JSON payload strings.
  - Signing secrets.
- Outputs:
  - `boolean` for URL validation.
  - Hex-encoded signature strings.

## API / Signature

```ts
export function isValidWebhookUrl(webhookUrl: string): boolean;
export function createWebhookSignature(payload: string, secret: string): string;
```

## Examples

```ts
import { createWebhookSignature, isValidWebhookUrl } from '@utils/webhooks';

const valid = isValidWebhookUrl('https://example.com/webhook');
const signature = createWebhookSignature('{"ok":true}', 'secret');
```
