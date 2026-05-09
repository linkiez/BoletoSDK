# 🎫 BoletoSDK

Brazilian bank slip (boleto) & CNAB processing library with type safety, validation, and ready-to-render assets.

[![npm version](https://badge.fury.io/js/@linkiez%2Fboleto-sdk.svg)](https://www.npmjs.com/package/@linkiez/boleto-sdk)
[![CI](https://github.com/linkiez/BoletoSDK/workflows/CI/badge.svg)](https://github.com/linkiez/BoletoSDK/actions)
[![Coverage](https://img.shields.io/codecov/c/github/linkiez/BoletoSDK)](https://codecov.io/gh/linkiez/BoletoSDK)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.3-blue.svg)](https://www.typescriptlang.org/)

Parse, generate, and validate CNAB 240/400 files with consistent APIs.

## 🌟 Highlights

- CNAB 240/400 parsing, generation, and validation
- Boleto assets: barcode, PIX QR, HTML/PDF (pt-BR labels)
- Bank constants, layout validation, and robust tests

## 🧾 Boleto Generation

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
  bank: { code: '341', name: 'ITAU UNIBANCO SA' },
};

const html = buildBoletoHtml(boletoData, { layout: 'detailed' });
const pdf = await generateBoletoPdfBuffer(boletoData, { includePixQr: true });
```

## 🚀 Quick Start

```bash
npm install @linkiez/boleto-sdk
```

```typescript
import { parseCnab, generateCnab } from '@linkiez/boleto-sdk';

const parsed = parseCnab(content);
const output = generateCnab(parsed);
```

```typescript
import {
  generateBarcode,
  generatePixQRCode,
  generateBoletoPdfBuffer,
} from '@linkiez/boleto-sdk';

const { barcode, digitableLine } = generateBarcode({
  bankCode: '341',
  dueDate: new Date('2025-02-10'),
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

const pdf = await generateBoletoPdfBuffer({
  beneficiary: { name: 'ACME CORP', document: '12345678000195', address: 'Avenida 1' },
  payer: { name: 'Joao da Silva', document: '12345678901', address: 'Rua 2' },
  payment: {
    documentNumber: 'DOC-001',
    ourNumber: '12345678',
    amount: 150.5,
    dueDate: new Date('2025-02-10'),
    barcode,
    digitableLine,
    pix: { payload: pix.payload },
  },
  bank: { code: '341', name: 'ITAU UNIBANCO SA' },
});
```

## 📚 Documentation

### Core

- [API Reference](doc/API-REFERENCE.md)
- [CNAB240 Guide](doc/CNAB240_GUIDE.md)
- [CNAB400 Usage Guide](doc/CNAB400-USAGE-GUIDE.md)
- [Boleto Generation Guide](doc/BOLETO-GENERATION.md)
- [Examples](doc/EXAMPLES.md)

### Specs and Validation

- [CNAB240 FEBRABAN Spec](doc/CNAB240-FEBRABAN.md)
- [CNAB400 Positions Validation](doc/CNAB400_POSITIONS_VALIDATION.md)
- [Segment Positions Validation](doc/SEGMENT_POSITIONS_VALIDATION.md)
- [Business Rules](doc/BUSINESS_RULES.md)
- [Business Rules Sources](doc/BUSINESS_RULES_SOURCES.md)

### Supporting Docs

- [Bank Differences](doc/BANK_DIFFERENCES.md)
- [FAQ](doc/FAQ.md)
- [Migration](doc/MIGRATION.md)
- [SonarQube](doc/SONARQUBE.md)
- [CNAB400 Bank Samples](doc)

### Project

- [Architecture](ARCHITECTURE.md)
- [Testing](TESTING.md)
- [Contributing](CONTRIBUTING.md)
- [Roadmap](ROADMAP.md)

## 🛠️ Development

See [CONTRIBUTING.md](CONTRIBUTING.md) and [TESTING.md](TESTING.md) for setup, workflows, and conventions.

## 📜 License

APACHE. See [LICENSE](LICENSE).

## 🔗 Links

- [NPM Package](https://www.npmjs.com/package/@linkiez/boleto-sdk)
- [Report Issues](https://github.com/linkiez/BoletoSDK/issues)
