import type { BoletoTemplateData } from '@templates/BoletoTemplate';
import { formatMoney } from '@utils/formatters';
import PDFDocument from 'pdfkit';
import { renderPixQrCodePng } from '../qrcode/QRCodeRenderer';

export interface BoletoPdfOptions {
  title?: string;
  author?: string;
  includePixQr?: boolean;
  pageSize?: string | [number, number];
  layout?: 'simple' | 'instructions' | 'detailed';
  compress?: boolean;
}

export async function generateBoletoPdfBuffer(
  data: BoletoTemplateData,
  options: BoletoPdfOptions = {},
): Promise<Buffer> {
  const pdf = new PDFDocument({
    size: options.pageSize ?? 'A4',
    margin: 40,
    compress: options.compress ?? true,
    info: {
      Title: options.title ?? 'Boleto',
      Author: options.author ?? 'BoletoSDK',
    },
  });

  const chunks: Buffer[] = [];

  pdf.on('data', (chunk: Buffer) => chunks.push(chunk));

  const title = options.title ?? 'Boleto';
  const layout = options.layout ?? 'detailed';
  const showInstructions = layout !== 'simple';
  const showAdditionalInfo = layout === 'detailed';

  pdf.fontSize(18).text(title, { align: 'center' });
  pdf.moveDown();

  pdf.fontSize(12).text(`Banco: ${data.bank.code} - ${data.bank.name}`);
  pdf.text(`Beneficiário: ${data.beneficiary.name}`);
  pdf.text(`Pagador: ${data.payer.name}`);
  pdf.text(`Valor: ${formatMoney(data.payment.amount)}`);
  pdf.text(`Vencimento: ${formatDateIso(data.payment.dueDate)}`);
  pdf.moveDown();

  pdf.fontSize(11).text(`Linha digitável: ${data.payment.digitableLine}`);
  pdf.fontSize(9).text(`Código de barras: ${data.payment.barcode}`);
  pdf.moveDown();

  if (showInstructions) {
    pdf.fontSize(12).text('Instruções', { underline: true });
    if (data.instructions && data.instructions.length > 0) {
      data.instructions.forEach((instruction) => {
        pdf.fontSize(10).text(`- ${instruction}`);
      });
    } else {
      pdf.fontSize(10).text('Sem instruções');
    }
    pdf.moveDown();
  }

  if (showAdditionalInfo) {
    pdf.fontSize(12).text('Informações adicionais', { underline: true });
    const entries = Object.entries(data.additionalInfo ?? {});
    if (entries.length > 0) {
      entries.forEach(([key, value]) => {
        pdf.fontSize(10).text(`${key}: ${value}`);
      });
    } else {
      pdf.fontSize(10).text('Sem informações adicionais');
    }
    pdf.moveDown();
  }

  if (options.includePixQr && data.payment.pix?.payload) {
    pdf.fontSize(12).text('PIX', { underline: true });
    pdf.fontSize(9).text(data.payment.pix.payload);

    const qrPng = await renderPixQrCodePng(data.payment.pix.payload, {
      width: 120,
      margin: 1,
    });

    pdf.image(qrPng, {
      width: 120,
      height: 120,
    });
  }

  pdf.end();

  return await new Promise((resolve, reject) => {
    pdf.on('end', () => resolve(Buffer.concat(chunks)));
    pdf.on('error', reject);
  });
}

function formatDateIso(value: Date): string {
  return value.toISOString().slice(0, 10);
}
