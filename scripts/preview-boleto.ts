/* eslint-disable no-console */
import fs from 'node:fs';
import path from 'node:path';
import 'tsconfig-paths/register';
import { generateBarcode } from '../src/generators/barcode/BarcodeGenerator';
import { generatePixPayload } from '../src/generators/qrcode/PixPayloadGenerator';
import { renderPixQrCodeSvg } from '../src/generators/qrcode/QRCodeRenderer';
import { IndustrialIntegrityTemplate } from '../src/templates/IndustrialIntegrityTemplate';

async function main(): Promise<void> {
  const { barcode, digitableLine } = generateBarcode({
    bankCode: '341',
    dueDate: new Date('2025-02-10'),
    amount: 150.5,
    freeField: '1234567890123456789012345',
  });

  const pixPayload = generatePixPayload({
    key: '12345678000195',
    amount: 150.5,
    merchantName: 'ACME CORP',
    merchantCity: 'SAO PAULO',
    transactionId: 'INV001',
    description: 'Pagamento de boleto',
  });

  const pixQrCodeSvg = await renderPixQrCodeSvg(pixPayload, { width: 220 });

  const data = {
    beneficiary: {
      name: 'ACME CORP LTDA',
      document: '12.345.678/0001-95',
      address: 'Avenida Principal, 1000',
    },
    payer: {
      name: 'Joao da Silva',
      document: '123.456.789-01',
      address: 'Rua do Sol, 10',
    },
    payment: {
      documentNumber: 'DOC-001',
      ourNumber: '12345678',
      amount: 150.5,
      dueDate: new Date('2025-02-10'),
      barcode,
      digitableLine,
      pix: {
        payload: pixPayload,
        qrCodeSvg: pixQrCodeSvg,
      },
    },
    bank: {
      code: '341',
      name: 'ITAU UNIBANCO SA',
    },
    instructions: ['Pagar antes do vencimento.'],
    additionalInfo: {
      Referencia: 'INV-001',
      Carteira: '109',
    },
  };

  const html = new IndustrialIntegrityTemplate().render(data);
  const outputDir = path.resolve(__dirname, '../preview');
  fs.mkdirSync(outputDir, { recursive: true });

  const htmlPath = path.join(outputDir, 'boleto.html');
  const pdfPath = path.join(outputDir, 'boleto.pdf');

  fs.writeFileSync(htmlPath, html, 'utf8');
  await renderHtmlFileToPdf(htmlPath, pdfPath);

  console.log(`HTML preview written to ${htmlPath}`);
  console.log(`PDF preview written to ${pdfPath}`);
}

async function renderHtmlFileToPdf(htmlPath: string, pdfPath: string): Promise<void> {
  // Dynamic import keeps runtime optional for non-preview SDK usage.
  const playwright = await import('playwright');
  const browser = await playwright.chromium.launch({ headless: true });

  try {
    const page = await browser.newPage();
    await page.goto(`file://${htmlPath}`, { waitUntil: 'networkidle' });
    await page.pdf({
      path: pdfPath,
      format: 'A4',
      printBackground: true,
      margin: { top: '0', right: '0', bottom: '0', left: '0' },
    });
  } finally {
    await browser.close();
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
