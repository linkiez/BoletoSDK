import { generateBoletoEmail } from '@utils/email/EmailTemplateGenerator';
import type { BoletoTemplateData } from '@templates/BoletoTemplate';

function createBoleto(): BoletoTemplateData {
  return {
    beneficiary: {
      name: 'ACME Corp',
      document: '12345678000195',
      address: 'Main Avenue, 1000',
    },
    payer: {
      name: 'John Doe',
      document: '12345678901',
      address: 'Sunset Street, 10',
    },
    payment: {
      documentNumber: 'INV-001',
      ourNumber: '12345678',
      amount: 150.5,
      dueDate: new Date('2026-03-15'),
      barcode: '34100000000000000000000000000000000000000000',
      digitableLine: '34190.00000 00000.000000 00000.000000 0 00000000000000',
    },
    bank: {
      code: '341',
      name: 'ITAU UNIBANCO SA',
    },
  };
}

describe('generateBoletoEmail', () => {
  it('should generate email with correct recipient', () => {
    const email = generateBoletoEmail({
      to: 'customer@example.com',
      boleto: createBoleto(),
    });

    expect(email.to).toBe('customer@example.com');
  });

  it('should include beneficiary name and due date in subject', () => {
    const email = generateBoletoEmail({
      to: 'customer@example.com',
      boleto: createBoleto(),
    });

    expect(email.subject).toContain('ACME Corp');
    expect(email.subject).toContain('15/03/2026');
  });

  it('should use custom subject prefix when provided', () => {
    const email = generateBoletoEmail({
      to: 'customer@example.com',
      boleto: createBoleto(),
      subjectPrefix: 'Invoice',
    });

    expect(email.subject).toMatch(/^Invoice - /);
  });

  it('should include payer name and digitable line in body', () => {
    const email = generateBoletoEmail({
      to: 'customer@example.com',
      boleto: createBoleto(),
    });

    expect(email.body).toContain('John Doe');
    expect(email.body).toContain('34190.00000');
  });

  it('should include amount formatted with comma in body', () => {
    const email = generateBoletoEmail({
      to: 'customer@example.com',
      boleto: createBoleto(),
    });

    expect(email.body).toContain('150,50');
  });

  it('should attach PDF when pdfBuffer is provided', () => {
    const pdfBuffer = Buffer.from('%PDF-1.4');
    const email = generateBoletoEmail({
      to: 'customer@example.com',
      boleto: createBoleto(),
      pdfBuffer,
    });

    expect(email.attachments).toHaveLength(1);
    expect(email.attachments[0].filename).toBe('boleto.pdf');
    expect(email.attachments[0].contentType).toBe('application/pdf');
  });

  it('should attach HTML when htmlContent is provided', () => {
    const email = generateBoletoEmail({
      to: 'customer@example.com',
      boleto: createBoleto(),
      htmlContent: '<html>boleto</html>',
    });

    expect(email.attachments).toHaveLength(1);
    expect(email.attachments[0].filename).toBe('boleto.html');
    expect(email.attachments[0].contentType).toBe('text/html');
  });

  it('should attach both PDF and HTML when both are provided', () => {
    const email = generateBoletoEmail({
      to: 'customer@example.com',
      boleto: createBoleto(),
      pdfBuffer: Buffer.alloc(10),
      htmlContent: '<html>boleto</html>',
    });

    expect(email.attachments).toHaveLength(2);
  });

  it('should use custom filenames for attachments', () => {
    const email = generateBoletoEmail({
      to: 'customer@example.com',
      boleto: createBoleto(),
      pdfBuffer: Buffer.alloc(10),
      htmlContent: '<html>boleto</html>',
      pdfFilename: 'invoice-001.pdf',
      htmlFilename: 'invoice-001.html',
    });

    expect(email.attachments[0].filename).toBe('invoice-001.pdf');
    expect(email.attachments[1].filename).toBe('invoice-001.html');
  });

  it('should return empty attachments when none are provided', () => {
    const email = generateBoletoEmail({
      to: 'customer@example.com',
      boleto: createBoleto(),
    });

    expect(email.attachments).toHaveLength(0);
  });

  it('should throw when recipient email is invalid', () => {
    expect(() =>
      generateBoletoEmail({
        to: 'not-an-email',
        boleto: createBoleto(),
      }),
    ).toThrow('Invalid recipient email address');
  });

  it('should escape HTML special characters in body to prevent XSS', () => {
    const boleto = createBoleto();
    boleto.payer.name = '<script>alert("xss")</script>';

    const email = generateBoletoEmail({
      to: 'customer@example.com',
      boleto,
    });

    expect(email.body).not.toContain('<script>');
    expect(email.body).toContain('&lt;script&gt;');
  });
});
