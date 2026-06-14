import type { BoletoTemplateData } from '@templates/BoletoTemplate';
import { renderI2of5Png } from '@generators/barcode/BarcodeRenderer';
import { formatMoney } from '@utils/formatters';
import type PDFDocument from 'pdfkit';
import { validatePixPayload } from '../qrcode/PixPayloadValidator';
import { renderPixQrCodePng } from '../qrcode/QRCodeRenderer';
import { derivePdfLayoutFlags, type ResolvedPdfTemplateOptions } from './PdfTemplate';

const PIX_QR_SIZE = 120;

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

/**
 * Renders boleto sections into an existing PDF document instance.
 *
 * @param document - Active PDFKit document.
 * @param data - Boleto template data.
 * @param options - Resolved rendering options.
 * @param dependencies - Optional dependencies for rendering integrations.
 */
export async function renderBoletoToPdf(
  document: InstanceType<typeof PDFDocument>,
  data: BoletoTemplateData,
  options: ResolvedPdfTemplateOptions,
  dependencies: PdfRendererDependencies = {},
): Promise<void> {
  const { showInstructions, showAdditionalInfo } = derivePdfLayoutFlags(options.layout);
  const fonts = dependencies.fonts;
  const dueDate = formatDateBr(data.payment.dueDate);
  const amount = formatMoney(data.payment.amount);
  const pageLeft = document.page.margins.left;
  const pageRight = document.page.width - document.page.margins.right;
  const usableWidth = pageRight - pageLeft;

  setBoldFont(document, fonts);
  document.fontSize(19).fillColor('#121315').text('INDUSTRIAL INTEGRITY', pageLeft, document.y, {
    width: usableWidth,
    align: 'left',
  });
  setRegularFont(document, fonts);
  document.fontSize(10).fillColor('#46464B').text('FICHA DE COMPENSACAO', pageLeft, document.y, {
    width: usableWidth,
    align: 'left',
  });

  setBoldFont(document, fonts);
  document
    .fontSize(11)
    .fillColor('#121315')
    .text(`${data.bank.code} - ${data.bank.name}`, pageLeft, document.y - 13, {
      width: usableWidth,
      align: 'right',
    });

  document.moveDown();

  drawCardRow(document, fonts, [
    {
      label: 'Beneficiario',
      value: `${data.beneficiary.name} - ${data.beneficiary.document}`,
      width: usableWidth * 0.5,
    },
    { label: 'Vencimento', value: dueDate, width: usableWidth * 0.25 },
    { label: 'Valor', value: amount, width: usableWidth * 0.25 },
  ]);
  drawCardRow(document, fonts, [
    {
      label: 'Pagador',
      value: `${data.payer.name} - ${data.payer.document}`,
      width: usableWidth,
    },
  ]);

  document.moveDown(0.8);
  document
    .moveTo(pageLeft, document.y)
    .lineTo(pageRight, document.y)
    .dash(3, { space: 2 })
    .strokeColor('#C7C6CB')
    .lineWidth(1)
    .stroke()
    .undash();

  document.moveDown(0.6);
  setMonoFont(document, fonts);
  document.rect(pageLeft, document.y, usableWidth, 22).lineWidth(1).strokeColor('#121315').stroke();
  document
    .fontSize(13)
    .fillColor('#121315')
    .text(data.payment.digitableLine, pageLeft + 8, document.y + 7, {
      width: usableWidth - 16,
      align: 'center',
    });
  document.moveDown(1.8);

  drawCardRow(document, fonts, [
    {
      label: 'Local de Pagamento',
      value: 'Pagavel em qualquer banco ate o vencimento.',
      width: usableWidth * 0.7,
    },
    { label: 'Vencimento', value: dueDate, width: usableWidth * 0.3 },
  ]);
  drawCardRow(document, fonts, [
    {
      label: 'Numero Documento',
      value: data.payment.documentNumber,
      width: usableWidth * 0.35,
    },
    {
      label: 'Nosso Numero',
      value: data.payment.ourNumber,
      width: usableWidth * 0.35,
    },
    {
      label: 'Carteira',
      value: data.additionalInfo?.Carteira ?? '-',
      width: usableWidth * 0.3,
    },
  ]);

  if (options.includeBarcode && data.payment.barcode) {
    const barcodeRenderer = dependencies.renderBarcodePng ?? renderI2of5Png;
    const barcodePng = barcodeRenderer(data.payment.barcode);
    document.moveDown(0.6);
    document.image(barcodePng, pageLeft + 6, document.y, {
      width: options.barcode.width,
      height: options.barcode.height,
    });
    setMonoFont(document, fonts);
    document
      .fontSize(10)
      .fillColor('#121315')
      .text(data.payment.barcode, pageLeft, document.y + options.barcode.height + 4, {
        width: usableWidth,
        align: 'center',
      });
    document.moveDown(2.3);
  } else {
    setMonoFont(document, fonts);
    document.fontSize(9).text(`Codigo de barras: ${data.payment.barcode}`);
  }

  document.moveDown();

  if (showInstructions) {
    setBoldFont(document, fonts);
    document.fontSize(12).text('Instrucoes', { underline: true });
    if (data.instructions && data.instructions.length > 0) {
      data.instructions.forEach((instruction) => {
        setRegularFont(document, fonts);
        document.fontSize(10).text(`- ${instruction}`);
      });
    } else {
      setRegularFont(document, fonts);
      document.fontSize(10).text('Sem instrucoes');
    }
    document.moveDown();
  }

  if (showAdditionalInfo) {
    setBoldFont(document, fonts);
    document.fontSize(12).text('Informacoes adicionais', { underline: true });
    const additionalInfo: Record<string, string> = data.additionalInfo ?? {};
    const entries = Object.entries(additionalInfo);
    if (entries.length > 0) {
      entries.forEach(([key, value]) => {
        setRegularFont(document, fonts);
        document.fontSize(10).text(`${key}: ${value}`);
      });
    } else {
      setRegularFont(document, fonts);
      document.fontSize(10).text('Sem informacoes adicionais');
    }
    document.moveDown();
  }

  if (!options.includePixQr || !data.payment.pix?.payload) {
    return;
  }

  setBoldFont(document, fonts);
  document.fontSize(12).text('PIX', { underline: true });
  setMonoFont(document, fonts);
  document.fontSize(9).text(data.payment.pix.payload);

  validatePixPayload(data.payment.pix.payload);

  const qrRenderer = dependencies.renderPixQrCodePng ?? renderPixQrCodePng;
  const qrPng = await qrRenderer(data.payment.pix.payload, {
    width: PIX_QR_SIZE,
    margin: 1,
  });

  document.image(qrPng, {
    width: PIX_QR_SIZE,
    height: PIX_QR_SIZE,
  });
}

function formatDateBr(value: Date): string {
  return value.toLocaleDateString('pt-BR', { timeZone: 'UTC' });
}

function drawCardRow(
  document: PDFKit.PDFDocument,
  fonts: PdfRendererFonts | undefined,
  cells: Array<{ label: string; value: string; width: number }>,
): void {
  const startX = document.page.margins.left;
  const startY = document.y;
  const rowHeight = 36;
  let offsetX = startX;

  cells.forEach((cell, index) => {
    const width =
      index === cells.length - 1
        ? document.page.width - document.page.margins.right - offsetX
        : cell.width;

    document.rect(offsetX, startY, width, rowHeight).lineWidth(0.8).strokeColor('#77767B').stroke();

    setRegularFont(document, fonts);
    document
      .fontSize(8)
      .fillColor('#46464B')
      .text(cell.label, offsetX + 5, startY + 4, { width: width - 10, align: 'left' });

    setBoldFont(document, fonts);
    document
      .fontSize(10)
      .fillColor('#121315')
      .text(cell.value, offsetX + 5, startY + 16, { width: width - 10, align: 'left' });

    offsetX += width;
  });

  document.y = startY + rowHeight;
}

function setRegularFont(document: PDFKit.PDFDocument, fonts: PdfRendererFonts | undefined): void {
  document.font(fonts?.regular ?? 'Helvetica');
}

function setBoldFont(document: PDFKit.PDFDocument, fonts: PdfRendererFonts | undefined): void {
  document.font(fonts?.bold ?? 'Helvetica-Bold');
}

function setMonoFont(document: PDFKit.PDFDocument, fonts: PdfRendererFonts | undefined): void {
  document.font(fonts?.mono ?? 'Courier');
}
