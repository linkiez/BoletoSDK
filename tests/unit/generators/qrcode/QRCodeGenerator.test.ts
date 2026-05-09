import { generatePixQRCode } from '@generators';
import { validatePixPayload } from '../../../../src/generators/qrcode/PixPayloadValidator';

describe('generatePixQRCode', () => {
  it('should return payload and rendered QR code when renderer is provided', () => {
    const result = generatePixQRCode(
      {
        key: '12345678900',
        amount: 10,
        merchantName: 'ACME STORE',
        merchantCity: 'SAO PAULO',
        transactionId: 'INV001',
      },
      {
        renderer: (payload: string) => `qr:${payload}`,
      },
    );

    expect(result.payload).toContain('br.gov.bcb.pix');
    expect(result.qrCode).toContain('qr:');
  });

  it('should return payload only when renderer is not provided', () => {
    const result = generatePixQRCode({
      key: '12345678900',
      amount: 10,
      merchantName: 'ACME STORE',
      merchantCity: 'SAO PAULO',
      transactionId: 'INV001',
    });

    expect(result.payload).toContain('br.gov.bcb.pix');
    expect(result.qrCode).toBeUndefined();
    expect(() => validatePixPayload(result.payload)).not.toThrow();
  });
});
