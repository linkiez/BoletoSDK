# WebhookNotification

## Overview

Builds and sends webhook notifications for boleto events.

## Responsibilities

- Build normalized webhook payloads.
- Deliver webhook payloads with JSON POST requests.
- Support optional request signing and timeout control.

## Inputs and outputs

- Inputs:
  - Webhook event name.
  - Event data.
  - Destination URL.
  - Optional headers, timeout, and secret.
- Outputs:
  - Webhook payload objects.
  - Delivery results with HTTP response details.

## API / Signature

```ts
export type WebhookNotificationEvent =
  | 'boleto.generated'
  | 'boleto.pdf.generated'
  | 'boleto.email.generated';

export interface WebhookNotificationPayload<TData = unknown> {
  event: WebhookNotificationEvent;
  source: 'boleto-sdk';
  timestamp: string;
  data: TData;
}

export interface WebhookNotificationOptions<TData = unknown> {
  url: string;
  event: WebhookNotificationEvent;
  data: TData;
  headers?: Record<string, string>;
  timeoutMs?: number;
  secret?: string;
}

export interface WebhookNotificationResult {
  ok: boolean;
  status: number;
  statusText: string;
  responseBody: string;
  signature?: string;
}

export function createWebhookNotificationPayload<TData>(
  event: WebhookNotificationEvent,
  data: TData,
  now?: Date,
): WebhookNotificationPayload<TData>;

export async function sendWebhookNotification<TData>(
  options: WebhookNotificationOptions<TData>,
): Promise<WebhookNotificationResult>;
```

## Error handling and edge cases

- Rejects invalid URLs before making a network request.
- Uses a default timeout to avoid hanging delivery attempts.
- Clears the timeout handle after every request.

## Examples

```ts
import { sendWebhookNotification } from '@utils/webhooks';

await sendWebhookNotification({
  url: 'https://example.com/webhook',
  event: 'boleto.generated',
  data: { documentNumber: 'INV-001' },
});
```
