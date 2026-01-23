/* eslint-disable no-console */
import fs from 'fs';
import path from 'path';
import 'tsconfig-paths/register';
import { generateBarcode } from '../src/generators/barcode/BarcodeGenerator';
import { generateBoletoPdfBuffer } from '../src/generators/pdf/BoletoPdfGenerator';
import { generatePixPayload } from '../src/generators/qrcode/PixPayloadGenerator';
import { renderPixQrCodeSvg } from '../src/generators/qrcode/QRCodeRenderer';
import { buildBoletoHtml } from '../src/templates/HtmlTemplateBuilder';

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

  const pixQrCodeSvg = await renderPixQrCodeSvg(pixPayload, { width: 140 });

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

  const html = buildBoletoHtml(data, { layout: 'detailed' });
  const pdf = await generateBoletoPdfBuffer(data, {
    includePixQr: true,
    layout: 'detailed',
  });

  const outputDir = path.resolve(__dirname, '../preview');
  fs.mkdirSync(outputDir, { recursive: true });

  const htmlPath = path.join(outputDir, 'boleto.html');
  const pdfPath = path.join(outputDir, 'boleto.pdf');

  fs.writeFileSync(htmlPath, html, 'utf8');
  fs.writeFileSync(pdfPath, pdf);

  console.log(`HTML preview written to ${htmlPath}`);
  console.log(`PDF preview written to ${pdfPath}`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
