import type { BoletoTemplateData } from '@templates/BoletoTemplate';
import { renderI2of5Png } from '@generators/barcode/BarcodeRenderer';
import { formatMoney } from '@utils/formatters';
import type PDFDocument from 'pdfkit';
import { validatePixPayload } from '../qrcode/PixPayloadValidator';
import { renderPixQrCodePng } from '../qrcode/QRCodeRenderer';
import { PdfFormCanvas } from './PdfFormCanvas';
import { derivePdfLayoutFlags, type ResolvedPdfTemplateOptions } from './PdfTemplate';

export interface PdfRendererFonts {
  regular: string;
  bold: string;
  mono: string;
}

type QrImageRenderer = (
  payload: string,
  options?: { width?: number; margin?: number },
) => Promise<Buffer>;

type BarcodeImageRenderer = (
  code: string,
  options?: {
    width?: number;
    height?: number;
    narrowWidth?: number;
    wideWidth?: number;
    quietZone?: number;
  },
) => Buffer;

export interface PdfRendererDependencies {
  renderPixQrCodePng?: QrImageRenderer;
  renderBarcodePng?: BarcodeImageRenderer;
  fonts?: PdfRendererFonts;
}

const MAX_COMPANY_LOGO_BYTES = 2 * 1024 * 1024;
const PNG_SIGNATURE = Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]);

/**
 * Renders a detachable payer receipt and a compact compensation form.
 * Payment values are displayed as supplied, never inferred from the visual reference.
 *
 * @param document - Active PDFKit document.
 * @param data - Beneficiary, payer and payment data.
 * @param options - Resolved layout, barcode and PIX options.
 * @param dependencies - Optional image renderers and registered fonts.
 */
export async function renderBoletoToPdf(
  document: InstanceType<typeof PDFDocument>,
  data: BoletoTemplateData,
  options: ResolvedPdfTemplateOptions,
  dependencies: PdfRendererDependencies = {},
): Promise<void> {
  const canvas = new PdfFormCanvas(
    document,
    dependencies.fonts ?? { regular: 'Helvetica', bold: 'Helvetica-Bold', mono: 'Courier' },
  );
  let qrImage: Buffer | undefined;
  if (options.includePixQr && data.payment.pix?.payload) {
    validatePixPayload(data.payment.pix.payload);
    qrImage = await (dependencies.renderPixQrCodePng ?? renderPixQrCodePng)(
      data.payment.pix.payload,
      { width: 240, margin: 4 },
    );
  }

  renderHeader(canvas, data, qrImage);
  renderReceipt(canvas, data);
  renderCompensationForm(canvas, data);
  renderNotes(canvas, data, options);
  canvas.row([
    {
      label: 'PAGADOR',
      value: data.payer.name,
      detail: `CPF/CNPJ: ${data.payer.document}  |  ${data.payer.address}`,
      fraction: 1,
      style: { font: 'bold' },
    },
  ]);
  renderBarcode(canvas, data, options, dependencies);
  if (qrImage && data.payment.pix) {
    canvas.row([
      {
        label: 'PIX COPIA E COLA',
        value: data.payment.pix.payload,
        fraction: 1,
        borderless: true,
        style: { size: 6.5, font: 'mono' },
      },
    ]);
  }
}

function renderHeader(canvas: PdfFormCanvas, data: BoletoTemplateData, qrImage?: Buffer): void {
  const { document, left, width, colors } = canvas;
  const companyName = data.company?.name.trim() || data.beneficiary.name.trim();
  const nameWidth = qrImage ? width * 0.62 - 40 : width - 40;
  const nameHeight = canvas.textHeight(companyName, nameWidth, {
    size: 14,
    font: 'bold',
  });
  const height = Math.max(64, nameHeight + 40);
  const y = canvas.reserve(height);
  const logo = data.company?.logo;
  let hasLogo = Boolean(logo && isSupportedCompanyLogo(logo));
  if (hasLogo && logo) {
    try {
      document.image(logo, left, y + 2, { fit: [32, 32] });
    } catch {
      // Invalid logo bytes are optional; retain the company name and initials.
      hasLogo = false;
    }
  }
  if (!hasLogo) {
    document.roundedRect(left, y + 4, 28, 28, 3).fill(colors.accent);
    canvas.text(companyName.charAt(0).toUpperCase(), left, y + 11, 28, {
      size: 13,
      font: 'bold',
      color: '#FFFFFF',
      align: 'center',
    });
  }
  canvas.text(companyName, left + 40, y + 4, nameWidth, { size: 14, font: 'bold' });
  canvas.text('BOLETO BANCÁRIO', left + 40, y + nameHeight + 10, nameWidth, {
    size: 7,
    color: colors.muted,
  });
  if (qrImage) {
    const x = left + width * 0.64;
    const cardWidth = width * 0.36;
    document.roundedRect(x, y, cardWidth, 56, 4).fill(colors.surface);
    document.image(qrImage, x + 4, y + 4, { width: 48, height: 48 });
    canvas.text('PAGUE COM PIX', x + 60, y + 10, cardWidth - 68, {
      size: 7,
      font: 'bold',
      color: colors.accent,
    });
    canvas.text('Leia o QR Code no\naplicativo do seu banco.', x + 60, y + 25, cardWidth - 68, {
      size: 7,
    });
  }
  document.y = y + height;
}

function isSupportedCompanyLogo(logo: Buffer): boolean {
  if (logo.length === 0 || logo.length > MAX_COMPANY_LOGO_BYTES) return false;

  if (logo.length >= 24 && logo.subarray(0, 8).equals(PNG_SIGNATURE)) {
    const width = logo.readUInt32BE(16);
    const height = logo.readUInt32BE(20);
    return width > 0 && height > 0 && width <= 4096 && height <= 4096;
  }

  return (
    logo.length >= 4 &&
    logo[0] === 0xff &&
    logo[1] === 0xd8 &&
    logo[2] === 0xff &&
    logo[logo.length - 2] === 0xff &&
    logo[logo.length - 1] === 0xd9
  );
}

function renderReceipt(canvas: PdfFormCanvas, data: BoletoTemplateData): void {
  const { document, left, width, colors } = canvas;
  const y = canvas.reserve(20);
  canvas.text('RECIBO DO PAGADOR', left, y + 4, width, { size: 7, font: 'bold' });
  canvas.rule(y + 18);
  document.y = y + 20;
  canvas.row(
    [
      {
        label: 'BENEFICIÁRIO',
        value: data.beneficiary.name,
        detail: `CPF/CNPJ: ${data.beneficiary.document}\n${data.beneficiary.address}`,
        fraction: 0.5,
        borderless: true,
        style: { font: 'bold' },
      },
      {
        label: 'PAGADOR',
        value: data.payer.name,
        detail: `CPF/CNPJ: ${data.payer.document}\n${data.payer.address}`,
        fraction: 0.5,
        borderless: true,
        style: { font: 'bold' },
      },
    ],
    64,
  );
  canvas.row(
    [
      {
        label: 'VENCIMENTO',
        value: formatDate(data.payment.dueDate),
        fraction: 0.5,
        shaded: true,
        borderless: true,
        style: { size: 12, font: 'bold', color: colors.accent },
      },
      {
        label: 'VALOR DO DOCUMENTO',
        value: formatMoney(data.payment.amount),
        fraction: 0.5,
        shaded: true,
        borderless: true,
        style: { size: 18, font: 'bold', align: 'right' },
      },
    ],
    48,
  );
  canvas.row([
    {
      label: 'NÚMERO DO DOCUMENTO',
      value: data.payment.documentNumber,
      fraction: 0.26,
      borderless: true,
    },
    {
      label: 'NOSSO NÚMERO',
      value: data.payment.ourNumber,
      fraction: 0.29,
      borderless: true,
    },
    { label: 'CARTEIRA', value: wallet(data), fraction: 0.15, borderless: true },
    {
      label: 'AGÊNCIA / CÓDIGO DO BENEFICIÁRIO',
      value: data.additionalInfo?.agenciaCodigoCedente ?? '-',
      fraction: 0.3,
      borderless: true,
    },
  ]);
  canvas.row(
    [
      {
        label: '',
        value: 'AUTENTICAÇÃO MECÂNICA - RECIBO DO PAGADOR',
        fraction: 1,
        borderless: true,
        style: { size: 6, color: colors.muted },
      },
    ],
    18,
  );

  const cutY = canvas.reserve(36);
  canvas.rule(cutY + 18, true);
  document.rect(left + 12, cutY + 11, 95, 14).fill('#FFFFFF');
  canvas.text('DESTAQUE AQUI', left + 18, cutY + 14, 85, {
    size: 6.5,
    color: colors.muted,
  });
  document.y = cutY + 36;
}

function renderCompensationForm(canvas: PdfFormCanvas, data: BoletoTemplateData): void {
  const { document, left, width, colors } = canvas;
  const bankWidth = width * 0.26;
  const bankHeight = canvas.textHeight(data.bank.name, bankWidth - 50, { size: 8, font: 'bold' });
  const lineWidth = width - bankWidth - 12;
  const lineHeight = canvas.textHeight(data.payment.digitableLine, lineWidth, {
    size: 8.5,
    font: 'mono',
  });
  const height = Math.max(36, Math.max(bankHeight, lineHeight) + 16);
  const y = canvas.reserve(height);
  document.roundedRect(left, y + 3, 34, 24, 3).fill(colors.ink);
  canvas.text(data.bank.code, left, y + 10, 34, {
    size: 9,
    font: 'bold',
    align: 'center',
    color: '#FFFFFF',
  });
  canvas.text(data.bank.name, left + 42, y + 7, bankWidth - 50, { size: 8, font: 'bold' });
  document
    .roundedRect(left + bankWidth, y + 3, width - bankWidth, height - 10, 3)
    .fill(colors.surface);
  canvas.text(data.payment.digitableLine, left + bankWidth + 6, y + 10, lineWidth, {
    size: 8.5,
    font: 'mono',
    align: 'right',
  });
  document.y = y + height;
  canvas.row([
    {
      label: 'LOCAL DE PAGAMENTO',
      value: data.additionalInfo?.localPagamento ?? 'PAGÁVEL EM QUALQUER BANCO ATÉ O VENCIMENTO',
      fraction: 0.67,
      style: { size: 7, font: 'bold' },
    },
    {
      label: 'VENCIMENTO',
      value: formatDate(data.payment.dueDate),
      fraction: 0.33,
      style: { size: 10, font: 'bold', align: 'right', color: colors.accent },
    },
  ]);
  canvas.row([
    {
      label: 'BENEFICIÁRIO',
      value: `${data.beneficiary.name} - ${data.beneficiary.document}`,
      fraction: 0.67,
      style: { size: 7, font: 'bold' },
    },
    {
      label: 'AGÊNCIA / CÓDIGO DO BENEFICIÁRIO',
      value: data.additionalInfo?.agenciaCodigoCedente ?? '-',
      fraction: 0.33,
      style: { align: 'right' },
    },
  ]);
  canvas.row([
    {
      label: 'DATA DO DOC.',
      value: data.additionalInfo?.dataDocumento ?? '-',
      fraction: 0.16,
    },
    { label: 'Nº DO DOCUMENTO', value: data.payment.documentNumber, fraction: 0.19 },
    {
      label: 'ESPÉCIE / ACEITE',
      value: `${data.additionalInfo?.especie ?? '-'} / ${data.additionalInfo?.aceite ?? '-'}`,
      fraction: 0.16,
    },
    {
      label: 'PROCESSAMENTO',
      value: data.additionalInfo?.dataProcessamento ?? '-',
      fraction: 0.16,
    },
    {
      label: 'NOSSO NÚMERO',
      value: data.payment.ourNumber,
      fraction: 0.33,
      style: { align: 'right' },
    },
  ]);
  canvas.row([
    { label: 'USO DO BANCO', value: '-', fraction: 0.2 },
    { label: 'CARTEIRA', value: wallet(data), fraction: 0.17 },
    { label: 'MOEDA', value: 'R$', fraction: 0.15 },
    { label: 'QUANTIDADE', value: '-', fraction: 0.15 },
    {
      label: '(=) VALOR DO DOCUMENTO',
      value: formatMoney(data.payment.amount),
      fraction: 0.33,
      shaded: true,
      style: { size: 11, font: 'bold', align: 'right' },
    },
  ]);
}

function renderNotes(
  canvas: PdfFormCanvas,
  data: BoletoTemplateData,
  options: ResolvedPdfTemplateOptions,
): void {
  const { document, left, width } = canvas;
  const flags = derivePdfLayoutFlags(options.layout);
  const notes = flags.showInstructions ? (data.instructions ?? []) : [];
  const formFields = new Set([
    'agenciaCodigoCedente',
    'dataDocumento',
    'dataProcessamento',
    'especie',
    'aceite',
    'Carteira',
    'carteira',
    'walletCode',
    'localPagamento',
  ]);
  const additionalInfo = flags.showAdditionalInfo
    ? Object.entries(data.additionalInfo ?? {})
        .filter(([key]) => !formFields.has(key))
        .map(([key, value]) => `${key}: ${value}`)
    : [];
  const noteCell = {
    label: flags.showInstructions ? 'INSTRUÇÕES DE RESPONSABILIDADE DO BENEFICIÁRIO' : '',
    value: notes.length ? notes.map((note) => `• ${note}`).join('\n') : '',
    detail: additionalInfo.length
      ? `INFORMAÇÕES ADICIONAIS\n${additionalInfo.join('\n')}`
      : undefined,
    fraction: 1,
    style: { size: 7.5, lineGap: 3 },
  };
  const amountCells = [
    '(-) DESCONTO / ABATIMENTO',
    '(-) OUTRAS DEDUÇÕES',
    '(+) MORA / MULTA',
    '(+) OUTROS ACRÉSCIMOS',
    '(=) VALOR COBRADO',
  ].map((label) => [{ label, value: '', fraction: 1, shaded: label.startsWith('(=)') }]);
  const amountsHeight = amountCells.reduce(
    (sum, cells) => sum + canvas.rowHeight(cells, width * 0.33, 26),
    0,
  );
  const notesHeight = canvas.rowHeight([noteCell], width * 0.67, amountsHeight);
  if (notesHeight > canvas.pageHeight) {
    for (const [index, note] of notes.entries()) {
      canvas.row([
        {
          ...noteCell,
          label: index === 0 ? noteCell.label : '',
          value: `• ${note}`,
          detail: undefined,
        },
      ]);
    }
    for (const value of additionalInfo) {
      canvas.row([{ label: 'INFORMAÇÕES ADICIONAIS', value, fraction: 1 }]);
    }
    for (const cells of amountCells) canvas.row(cells);
  } else {
    const y = canvas.reserve(notesHeight);
    canvas.drawRow([noteCell], left, y, width * 0.67, notesHeight);
    let amountY = y;
    for (const cells of amountCells) {
      const height =
        canvas.rowHeight(cells, width * 0.33, 26) +
        (notesHeight - amountsHeight) / amountCells.length;
      canvas.drawRow(cells, left + width * 0.67, amountY, width * 0.33, height);
      amountY += height;
    }
    document.y = y + notesHeight;
  }
}

function renderBarcode(
  canvas: PdfFormCanvas,
  data: BoletoTemplateData,
  options: ResolvedPdfTemplateOptions,
  dependencies: PdfRendererDependencies,
): void {
  const { document, left, width, colors } = canvas;
  const showImage = options.includeBarcode && Boolean(data.payment.barcode);
  const caption = 'AUTENTICAÇÃO MECÂNICA / FICHA DE COMPENSAÇÃO';
  const height = (showImage ? options.barcode.height : 16) + 40;
  const y = canvas.reserve(height);
  if (showImage) {
    const barcode = (dependencies.renderBarcodePng ?? renderI2of5Png)(data.payment.barcode);
    document.image(barcode, left, y + 12, {
      width: Math.min(options.barcode.width, width),
      height: options.barcode.height,
    });
  } else {
    canvas.text(data.payment.barcode, left, y + 12, width, { size: 8, font: 'mono' });
  }
  canvas.text(caption, left, y + height - 16, width, {
    size: 6,
    color: colors.muted,
  });
  document.y = y + height;
}

function formatDate(value: Date): string {
  return value.toLocaleDateString('pt-BR', { timeZone: 'UTC' });
}

function wallet(data: BoletoTemplateData): string {
  return (
    data.additionalInfo?.Carteira ??
    data.additionalInfo?.carteira ??
    data.additionalInfo?.walletCode ??
    '-'
  );
}
