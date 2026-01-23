import { generatePixPayload, renderPixQrCodePng, renderPixQrCodeSvg } from '@generators';

describe('QRCodeRenderer', () => {
  it('should render SVG from payload', async () => {
    const payload = generatePixPayload({
      key: '12345678900',
      merchantName: 'ACME STORE',
      merchantCity: 'SAO PAULO',
      transactionId: 'INV001',
    });

    const svg = await renderPixQrCodeSvg(payload, { width: 200 });

    expect(svg).toContain('<svg');
    expect(svg).toContain('</svg>');
  });

  it('should render PNG buffer from payload', async () => {
    const payload = generatePixPayload({
      key: '12345678900',
      merchantName: 'ACME STORE',
      merchantCity: 'SAO PAULO',
      transactionId: 'INV001',
    });

    const png = await renderPixQrCodePng(payload, { width: 200 });

    expect(Buffer.isBuffer(png)).toBe(true);
    expect(png.length).toBeGreaterThan(0);
  });
});
