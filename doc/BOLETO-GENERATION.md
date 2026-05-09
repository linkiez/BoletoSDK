# Boleto Generation Guide

This guide covers the boleto generation workflow in BoletoSDK: barcode creation, HTML rendering, PDF rendering, PIX QR payload generation, and email assembly.

## Table of Contents

1. [Data Model](#data-model)
2. [Barcode Generation](#barcode-generation)
3. [HTML Generation](#html-generation)
4. [PDF Generation](#pdf-generation)
5. [PIX QR Code Generation](#pix-qr-code-generation)
6. [Email Generation](#email-generation)
7. [End-to-End Example](#end-to-end-example)

## Data Model

Most boleto rendering APIs consume `BoletoTemplateData`.

```typescript
interface BoletoTemplateData {
  beneficiary: {
    name: string;
    document: string;
    address: string;
  };
  payer: {
    name: string;
    document: string;
    address: string;
  };
  payment: {
    documentNumber: string;
    ourNumber: string;
    amount: number;
    dueDate: Date;
    barcode: string;
    digitableLine: string;
    pix?: {
      payload: string;
      qrCodeSvg?: string;
    };
  };
  bank: {
    code: string;
    name: string;
    logo?: string;
  };
  instructions?: string[];
  additionalInfo?: Record<string, string>;
}
```

Keep the barcode and digitable line consistent with the same boleto payload. HTML, PDF, and email helpers only render and package the data you pass in.

## Barcode Generation

Use `generateBarcode()` to build the standard boleto barcode and its digitable line.

```typescript
import { generateBarcode } from '@linkiez/boleto-sdk';

const result = generateBarcode({
  bankCode: '341',
  currencyCode: '9',
  dueDate: new Date('2026-02-28'),
  amount: 150.5,
  freeField: '1234567890123456789012345',
});

console.log(result.barcode);
console.log(result.digitableLine);
```

The helper validates the numeric fields, calculates the check digit, and returns both the barcode and the digitable line in a single result.

## HTML Generation

Use `buildBoletoHtml()` to produce a print-friendly boleto HTML document.

```typescript
import { buildBoletoHtml } from '@linkiez/boleto-sdk';

const html = buildBoletoHtml(boletoData, {
  title: 'Boleto Bancário',
  heading: 'ACME Corp',
  layout: 'detailed',
});
```

When you only have a PIX payload (without pre-rendered SVG), use `buildBoletoHtmlWithPixQrCode()`.

```typescript
import { buildBoletoHtmlWithPixQrCode } from '@linkiez/boleto-sdk';

const html = await buildBoletoHtmlWithPixQrCode({
  ...boletoData,
  payment: {
    ...boletoData.payment,
    pix: {
      payload: '000201...',
    },
  },
});
```

Supported layout modes:

- `simple` - compact rendering with minimal instructions
- `instructions` - includes instruction blocks
- `detailed` - includes instructions and additional boleto metadata

The generated document includes print-oriented CSS, barcode presentation, optional PIX content, and standard boleto sections such as receipt and compensation slip areas.

## PDF Generation

Use `generateBoletoPdfBuffer()` or `generateBoletoPdfStream()` for a single boleto, and `generateBoletosPdfBuffer()` or `generateBoletosPdfStream()` for batched rendering.

```typescript
import { generateBoletoPdfBuffer } from '@linkiez/boleto-sdk';

const pdf = await generateBoletoPdfBuffer(boletoData, {
  title: 'Boleto Bancário',
  author: 'BoletoSDK',
  subject: 'Boleto para pagamento',
  keywords: 'boleto,pdf,payment',
  includePixQr: true,
  includeBarcode: true,
  layout: 'detailed',
  boletosPerPage: 1,
});
```

Common options include:

- `title`, `author`, `subject`, `keywords`, `creator` - PDF metadata
- `includePixQr` - renders PIX content when available
- `includeBarcode` - toggles barcode image rendering
- `barcode` - adjusts barcode width and height
- `layout` - controls the boleto section visibility
- `boletosPerPage` - batch layout control
- `margins`, `bleed`, `sectionSpacing`, `fonts` - layout and typography tuning

Use the stream variants when you want to pipe the output directly to storage, HTTP responses, or further processing.

If rendering fails during streaming, the returned stream emits `error` and consumers should handle it.

```typescript
import { generateBoletosPdfStream } from '@linkiez/boleto-sdk';

const stream = await generateBoletosPdfStream(batch, { includePixQr: true });

stream.on('error', (error) => {
  console.error('PDF generation failed:', error.message);
});
```

## PIX QR Code Generation

Use `generatePixQRCode()` to build a PIX payload and optionally render a QR code string.

```typescript
import { generatePixQRCode } from '@linkiez/boleto-sdk';

const pix = generatePixQRCode(
  {
    key: '12345678000195',
    amount: 150.5,
    merchantName: 'ACME CORP',
    merchantCity: 'SAO PAULO',
    transactionId: 'INV001',
  },
  {
    renderer: (payload) => payload,
  },
);
```

The returned payload can be embedded in boleto HTML, PDF, or email bodies.

## Email Generation

Use `generateBoletoEmail()` to assemble a ready-to-send email template.

```typescript
import { generateBoletoEmail } from '@linkiez/boleto-sdk';

const email = generateBoletoEmail({
  to: 'customer@example.com',
  boleto: boletoData,
  pdfBuffer,
  htmlContent: html,
  subjectPrefix: 'Boleto',
});
```

Attachments are optional. Provide a PDF buffer, HTML content, or both depending on the delivery channel.

## End-to-End Example

```typescript
import {
  buildBoletoHtml,
  generateBarcode,
  generateBoletoEmail,
  generateBoletoPdfBuffer,
  generatePixQRCode,
} from '@linkiez/boleto-sdk';

const barcode = generateBarcode({
  bankCode: '341',
  currencyCode: '9',
  dueDate: new Date('2026-02-28'),
  amount: 150.5,
  freeField: '1234567890123456789012345',
});

const pix = generatePixQRCode({
  key: '12345678000195',
  amount: 150.5,
  merchantName: 'ACME CORP',
  merchantCity: 'SAO PAULO',
  transactionId: 'INV001',
});

const boletoData = {
  beneficiary: {
    name: 'ACME CORP',
    document: '12345678000195',
    address: 'Avenida 1, 1000',
  },
  payer: {
    name: 'Joao da Silva',
    document: '12345678901',
    address: 'Rua 2, 200',
  },
  payment: {
    documentNumber: 'DOC-001',
    ourNumber: '12345678',
    amount: 150.5,
    dueDate: new Date('2026-02-28'),
    barcode: barcode.barcode,
    digitableLine: barcode.digitableLine,
    pix: { payload: pix.payload },
  },
  bank: {
    code: '341',
    name: 'ITAU UNIBANCO SA',
  },
  instructions: ['Do not accept payment after due date.'],
};

const html = buildBoletoHtml(boletoData, { layout: 'detailed' });
const pdf = await generateBoletoPdfBuffer(boletoData, { includePixQr: true });
const email = generateBoletoEmail({
  to: 'customer@example.com',
  boleto: boletoData,
  pdfBuffer: pdf,
  htmlContent: html,
});
```

## Notes

- Keep `barcode`, `digitableLine`, and `payment.amount` in sync.
- Prefer UTC-safe `Date` values when building boleto payloads.
- Use HTML for browser rendering and PDF for archival or print delivery.
