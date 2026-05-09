/**
 * Represents an email file attachment.
 */
export interface EmailAttachment {
  /** Attachment filename including extension. */
  filename: string;
  /** Raw file content as a Buffer. */
  content: Buffer;
  /** MIME content type of the attachment. */
  contentType: string;
}

/**
 * Wraps a PDF buffer as an email attachment.
 *
 * @param filename - Filename for the attachment (e.g. `boleto.pdf`).
 * @param content - PDF buffer to attach.
 * @returns An `EmailAttachment` with `application/pdf` content type.
 *
 * @example
 * const attachment = createPdfAttachment('boleto.pdf', pdfBuffer);
 */
export function createPdfAttachment(filename: string, content: Buffer): EmailAttachment {
  return { filename, content, contentType: 'application/pdf' };
}

/**
 * Wraps an HTML string as an email attachment.
 *
 * @param filename - Filename for the attachment (e.g. `boleto.html`).
 * @param htmlContent - HTML string to attach.
 * @returns An `EmailAttachment` with `text/html` content type.
 *
 * @example
 * const attachment = createHtmlAttachment('boleto.html', htmlString);
 */
export function createHtmlAttachment(
  filename: string,
  htmlContent: string,
): EmailAttachment {
  return {
    filename,
    content: Buffer.from(htmlContent, 'utf-8'),
    contentType: 'text/html',
  };
}
