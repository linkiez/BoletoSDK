import type { BoletoTemplateData } from '@templates/BoletoTemplate';
import type { EmailAttachment } from './AttachmentHelper';
import { createPdfAttachment, createHtmlAttachment } from './AttachmentHelper';
import { isValidEmail } from './EmailValidator';

/**
 * Represents an email message ready for delivery by an SMTP/transport library.
 */
export interface EmailTemplate {
  /** Recipient email address. */
  to: string;
  /** Email subject line. */
  subject: string;
  /** HTML body content. */
  body: string;
  /** List of file attachments. */
  attachments: EmailAttachment[];
}

/**
 * Options for generating a boleto email.
 */
export interface BoletoEmailOptions {
  /** Recipient email address. Must be a valid email. */
  to: string;
  /** Boleto data used to populate subject and body. */
  boleto: BoletoTemplateData;
  /** Pre-generated PDF buffer to attach. When omitted, no PDF is attached. */
  pdfBuffer?: Buffer;
  /** Pre-generated HTML boleto string to attach. When omitted, no HTML is attached. */
  htmlContent?: string;
  /**
   * Custom subject line prefix.
   * @default 'Boleto'
   */
  subjectPrefix?: string;
  /**
   * Custom PDF attachment filename.
   * @default 'boleto.pdf'
   */
  pdfFilename?: string;
  /**
   * Custom HTML attachment filename.
   * @default 'boleto.html'
   */
  htmlFilename?: string;
}

/**
 * Generates an email template for a boleto, including optional PDF and HTML attachments.
 *
 * @param options - Email generation options.
 * @returns Populated `EmailTemplate` ready for delivery.
 * @throws {Error} If `to` is not a valid email address.
 *
 * @example
 * const email = generateBoletoEmail({
 *   to: 'customer@example.com',
 *   boleto: boletoData,
 *   pdfBuffer: pdfBytes,
 * });
 */
export function generateBoletoEmail(options: BoletoEmailOptions): EmailTemplate {
  if (!isValidEmail(options.to)) {
    throw new Error(`Invalid recipient email address: ${options.to}`);
  }

  const { boleto, pdfBuffer, htmlContent } = options;
  const prefix = options.subjectPrefix ?? 'Boleto';
  const dueDate = formatDate(boleto.payment.dueDate);
  const amount = formatAmount(boleto.payment.amount);

  const subject = `${prefix} - ${boleto.beneficiary.name} - Vencimento ${dueDate}`;
  const body = buildEmailBody(boleto, dueDate, amount);
  const attachments = buildAttachments(options, pdfBuffer, htmlContent);

  return { to: options.to, subject, body, attachments };
}

function buildEmailBody(
  boleto: BoletoTemplateData,
  dueDate: string,
  amount: string,
): string {
  return `<!DOCTYPE html>
<html lang="pt-BR">
<head><meta charset="UTF-8" /><title>Boleto Bancário</title></head>
<body style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;padding:20px;">
  <h2 style="color:#333;">Boleto Bancário</h2>
  <p>Prezado(a) <strong>${escapeHtml(boleto.payer.name)}</strong>,</p>
  <p>Segue o boleto bancário referente ao documento <strong>${escapeHtml(boleto.payment.documentNumber)}</strong>.</p>
  <table style="width:100%;border-collapse:collapse;margin:20px 0;">
    <tr style="background:#f5f5f5;">
      <td style="padding:8px;border:1px solid #ddd;font-weight:bold;">Beneficiário</td>
      <td style="padding:8px;border:1px solid #ddd;">${escapeHtml(boleto.beneficiary.name)}</td>
    </tr>
    <tr>
      <td style="padding:8px;border:1px solid #ddd;font-weight:bold;">Valor</td>
      <td style="padding:8px;border:1px solid #ddd;">R$ ${amount}</td>
    </tr>
    <tr style="background:#f5f5f5;">
      <td style="padding:8px;border:1px solid #ddd;font-weight:bold;">Vencimento</td>
      <td style="padding:8px;border:1px solid #ddd;">${dueDate}</td>
    </tr>
    <tr>
      <td style="padding:8px;border:1px solid #ddd;font-weight:bold;">Linha Digitável</td>
      <td style="padding:8px;border:1px solid #ddd;font-family:monospace;">${escapeHtml(boleto.payment.digitableLine)}</td>
    </tr>
  </table>
  <p style="color:#555;font-size:14px;">O boleto está em anexo neste email.</p>
</body>
</html>`;
}

function buildAttachments(
  options: BoletoEmailOptions,
  pdfBuffer: Buffer | undefined,
  htmlContent: string | undefined,
): EmailAttachment[] {
  const attachments: EmailAttachment[] = [];

  if (pdfBuffer) {
    const filename = options.pdfFilename ?? 'boleto.pdf';
    attachments.push(createPdfAttachment(filename, pdfBuffer));
  }

  if (htmlContent) {
    const filename = options.htmlFilename ?? 'boleto.html';
    attachments.push(createHtmlAttachment(filename, htmlContent));
  }

  return attachments;
}

function formatDate(date: Date): string {
  const day = String(date.getUTCDate()).padStart(2, '0');
  const month = String(date.getUTCMonth() + 1).padStart(2, '0');
  const year = date.getUTCFullYear();
  return `${day}/${month}/${year}`;
}

function formatAmount(amount: number): string {
  return amount.toFixed(2).replace('.', ',');
}

function escapeHtml(value: string): string {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;');
}
