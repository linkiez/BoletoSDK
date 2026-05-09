import { createHmac } from 'node:crypto';

/**
 * Validates whether a string is a usable webhook URL.
 *
 * @param webhookUrl - The webhook endpoint URL.
 * @returns `true` when the URL uses HTTP or HTTPS and can be parsed.
 */
export function isValidWebhookUrl(webhookUrl: string): boolean {
  if (typeof webhookUrl !== 'string' || webhookUrl.trim().length === 0) {
    return false;
  }

  try {
    const url = new URL(webhookUrl);
    return url.protocol === 'http:' || url.protocol === 'https:';
  } catch {
    return false;
  }
}

/**
 * Creates a SHA-256 signature for a webhook payload.
 *
 * @param payload - Raw JSON payload string.
 * @param secret - Secret used to sign the payload.
 * @returns Hex-encoded signature string.
 */
export function createWebhookSignature(payload: string, secret: string): string {
  if (secret.length === 0) {
    return '';
  }

  return createHmac('sha256', secret).update(payload).digest('hex');
}
