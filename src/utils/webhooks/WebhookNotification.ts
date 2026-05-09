import { createWebhookSignature, isValidWebhookUrl } from './WebhookValidator';

/**
 * Supported webhook notification events.
 */
export type WebhookNotificationEvent =
  | 'boleto.generated'
  | 'boleto.pdf.generated'
  | 'boleto.email.generated';

/**
 * Generic webhook payload sent by the SDK.
 */
export interface WebhookNotificationPayload<TData = unknown> {
  event: WebhookNotificationEvent;
  source: 'boleto-sdk';
  timestamp: string;
  data: TData;
}

/**
 * Options used to send a webhook notification.
 */
export interface WebhookNotificationOptions<TData = unknown> {
  url: string;
  event: WebhookNotificationEvent;
  data: TData;
  headers?: Record<string, string>;
  timeoutMs?: number;
  secret?: string;
}

/**
 * Result returned after a webhook delivery attempt.
 */
export interface WebhookNotificationResult {
  ok: boolean;
  status: number;
  statusText: string;
  responseBody: string;
  signature?: string;
}

/**
 * Builds a webhook notification payload.
 *
 * @param event - Notification event name.
 * @param data - Event payload data.
 * @param now - Optional timestamp override for deterministic tests.
 * @returns Normalized webhook payload.
 */
export function createWebhookNotificationPayload<TData>(
  event: WebhookNotificationEvent,
  data: TData,
  now: Date = new Date(),
): WebhookNotificationPayload<TData> {
  return {
    event,
    source: 'boleto-sdk',
    timestamp: now.toISOString(),
    data,
  };
}

/**
 * Sends a webhook notification to the provided URL.
 *
 * @param options - Webhook delivery options.
 * @returns Delivery result with response details.
 * @throws {Error} If the URL is invalid or the request cannot be completed.
 */
export async function sendWebhookNotification<TData>(
  options: WebhookNotificationOptions<TData>,
): Promise<WebhookNotificationResult> {
  if (!isValidWebhookUrl(options.url)) {
    throw new Error(`Invalid webhook URL: ${options.url}`);
  }

  const payload = createWebhookNotificationPayload(options.event, options.data);
  const body = JSON.stringify(payload);
  const headers: Record<string, string> = {
    'content-type': 'application/json',
    ...options.headers,
  };

  if (options.secret) {
    headers['x-boleto-signature'] = createWebhookSignature(body, options.secret);
  }

  const abortController = new AbortController();
  const timeoutMs = options.timeoutMs ?? 5000;
  const timeoutId = setTimeout(() => abortController.abort(), timeoutMs);

  try {
    const response = await fetch(options.url, {
      method: 'POST',
      headers,
      body,
      signal: abortController.signal,
    });

    const responseBody = await response.text();
    return {
      ok: response.ok,
      status: response.status,
      statusText: response.statusText,
      responseBody,
      signature: headers['x-boleto-signature'],
    };
  } finally {
    clearTimeout(timeoutId);
  }
}
