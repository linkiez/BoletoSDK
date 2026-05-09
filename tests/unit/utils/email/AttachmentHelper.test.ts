import { createPdfAttachment, createHtmlAttachment } from '@utils/email/AttachmentHelper';

describe('createPdfAttachment', () => {
  it('should return an attachment with application/pdf content type', () => {
    const content = Buffer.from('%PDF-1.4');
    const attachment = createPdfAttachment('boleto.pdf', content);

    expect(attachment.filename).toBe('boleto.pdf');
    expect(attachment.content).toBe(content);
    expect(attachment.contentType).toBe('application/pdf');
  });
});

describe('createHtmlAttachment', () => {
  it('should encode HTML string as utf-8 buffer', () => {
    const html = '<html><body>Boleto</body></html>';
    const attachment = createHtmlAttachment('boleto.html', html);

    expect(attachment.filename).toBe('boleto.html');
    expect(attachment.content.toString('utf-8')).toBe(html);
    expect(attachment.contentType).toBe('text/html');
  });
});
