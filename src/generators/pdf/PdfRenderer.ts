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

  setBoldFont(document, fonts);
  document.fontSize(18).text(options.title, { align: 'center' });
  document.moveDown();

  setRegularFont(document, fonts);
  document.fontSize(12).text(`Banco: ${data.bank.code} - ${data.bank.name}`);
  document.text(`Beneficiário: ${data.beneficiary.name}`);
  document.text(`Pagador: ${data.payer.name}`);
  document.text(`Valor: ${formatMoney(data.payment.amount)}`);
  document.text(`Vencimento: ${formatDateIso(data.payment.dueDate)}`);
  document.moveDown();

  setMonoFont(document, fonts);
  document.fontSize(11).text(`Linha digitável: ${data.payment.digitableLine}`);

  if (options.includeBarcode && data.payment.barcode) {
    const barcodeRenderer = dependencies.renderBarcodePng ?? renderI2of5Png;
    const barcodePng = barcodeRenderer(data.payment.barcode);
    document.image(barcodePng, {
      width: options.barcode.width,
      height: options.barcode.height,
    });
  } else {
    document.fontSize(9).text(`Código de barras: ${data.payment.barcode}`);
  }

  document.moveDown();

  if (showInstructions) {
    setBoldFont(document, fonts);
    document.fontSize(12).text('Instruções', { underline: true });
    if (data.instructions && data.instructions.length > 0) {
      data.instructions.forEach((instruction) => {
        setRegularFont(document, fonts);
        document.fontSize(10).text(`- ${instruction}`);
      });
    } else {
      setRegularFont(document, fonts);
      document.fontSize(10).text('Sem instruções');
    }
    document.moveDown();
  }

  if (showAdditionalInfo) {
    setBoldFont(document, fonts);
    document.fontSize(12).text('Informações adicionais', { underline: true });
    const additionalInfo: Record<string, string> = data.additionalInfo ?? {};
    const entries = Object.entries(additionalInfo);
    if (entries.length > 0) {
      entries.forEach(([key, value]) => {
        setRegularFont(document, fonts);
        document.fontSize(10).text(`${key}: ${value}`);
      });
    } else {
      setRegularFont(document, fonts);
      document.fontSize(10).text('Sem informações adicionais');
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

function formatDateIso(value: Date): string {
  return value.toISOString().slice(0, 10);
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
