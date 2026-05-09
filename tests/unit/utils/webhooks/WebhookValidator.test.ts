import { createWebhookSignature, isValidWebhookUrl } from '@utils/webhooks/WebhookValidator';

describe('isValidWebhookUrl', () => {
  it('should accept https urls', () => {
    expect(isValidWebhookUrl('https://example.com/webhook')).toBe(true);
  });

  it('should accept http urls', () => {
    expect(isValidWebhookUrl('http://localhost:3000/webhook')).toBe(true);
  });

  it('should reject unsupported protocols', () => {
    expect(isValidWebhookUrl('ftp://example.com/webhook')).toBe(false);
  });

  it('should reject malformed urls', () => {
    expect(isValidWebhookUrl('not-a-url')).toBe(false);
  });
});

describe('createWebhookSignature', () => {
  it('should generate a deterministic sha256 signature', () => {
    const signature = createWebhookSignature('{"event":"test"}', 'secret');

    expect(signature).toBe('8419ab361b37d61b696d008ef7549a18325132dae5da84c7424e8e1c590d0498');
  });

  it('should return an empty string for an empty secret', () => {
    expect(createWebhookSignature('payload', '')).toBe('');
  });
});
