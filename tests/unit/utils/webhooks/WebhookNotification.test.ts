import {
  createWebhookNotificationPayload,
  sendWebhookNotification,
} from '@utils/webhooks/WebhookNotification';

describe('createWebhookNotificationPayload', () => {
  it('should build a normalized webhook payload', () => {
    const now = new Date('2026-05-09T12:00:00.000Z');
    const payload = createWebhookNotificationPayload('boleto.generated', { id: 'INV-001' }, now);

    expect(payload).toEqual({
      event: 'boleto.generated',
      source: 'boleto-sdk',
      timestamp: '2026-05-09T12:00:00.000Z',
      data: { id: 'INV-001' },
    });
  });
});

describe('sendWebhookNotification', () => {
  const originalFetch = globalThis.fetch;

  beforeEach(() => {
    jest.restoreAllMocks();
  });

  afterEach(() => {
    globalThis.fetch = originalFetch;
  });

  it('should send a JSON webhook with signature header when secret is provided', async () => {
    jest.useFakeTimers();
    jest.setSystemTime(new Date('2026-05-09T12:00:00.000Z'));

    const response = {
      ok: true,
      status: 200,
      statusText: 'OK',
      text: jest.fn().mockResolvedValue('accepted'),
    };

    const fetchSpy = jest
      .spyOn(globalThis, 'fetch')
      .mockResolvedValue(response as never);

    const result = await sendWebhookNotification({
      url: 'https://example.com/webhook',
      event: 'boleto.email.generated',
      data: { id: 'INV-001' },
      secret: 'secret',
      headers: {
        'x-custom-header': 'custom-value',
      },
    });

    expect(fetchSpy).toHaveBeenCalledTimes(1);
    const [url, init] = fetchSpy.mock.calls[0];
    expect(url).toBe('https://example.com/webhook');
    expect(init?.method).toBe('POST');
    expect(init?.headers).toMatchObject({
      'content-type': 'application/json',
      'x-custom-header': 'custom-value',
      'x-boleto-signature': '3fbf810eff0c0f51fcbcf060442abe8919c474da643d4741b30e29670d7a4d41',
    });
    expect(result).toEqual({
      ok: true,
      status: 200,
      statusText: 'OK',
      responseBody: 'accepted',
      signature: '3fbf810eff0c0f51fcbcf060442abe8919c474da643d4741b30e29670d7a4d41',
    });

    jest.useRealTimers();
  });

  it('should reject invalid webhook urls', async () => {
    await expect(
      sendWebhookNotification({
        url: 'not-a-url',
        event: 'boleto.generated',
        data: {},
      }),
    ).rejects.toThrow('Invalid webhook URL');
  });

  it('should abort requests after the configured timeout', async () => {
    jest.useFakeTimers();

    const fetchSpy = jest.spyOn(globalThis, 'fetch').mockImplementation((_, init) => {
      return new Promise((_, reject) => {
        init?.signal?.addEventListener('abort', () => {
          reject(new Error('aborted'));
        });
      }) as never;
    });

    const promise = sendWebhookNotification({
      url: 'https://example.com/webhook',
      event: 'boleto.generated',
      data: {},
      timeoutMs: 10,
    });

    jest.advanceTimersByTime(10);
    await expect(promise).rejects.toThrow('aborted');
    expect(fetchSpy).toHaveBeenCalledTimes(1);

    jest.useRealTimers();
  });
});
