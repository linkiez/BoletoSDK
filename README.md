# 🎫 BoletoSDK

## Professional Brazilian Bank Slip (Boleto) & CNAB File Processing Library

[![npm version](https://badge.fury.io/js/@linkiez%2Fboleto-sdk.svg)](https://www.npmjs.com/package/@linkiez/boleto-sdk)
[![CI](https://github.com/linkiez/BoletoSDK/workflows/CI/badge.svg)](https://github.com/linkiez/BoletoSDK/actions)
[![Coverage](https://img.shields.io/codecov/c/github/linkiez/BoletoSDK)](https://codecov.io/gh/linkiez/BoletoSDK)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.3-blue.svg)](https://www.typescriptlang.org/)

**Parse**, **generate**, and **validate** CNAB files with type safety and zero dependencies.

---

## 🌟 Features

### 🔒 Type-Safe

Full TypeScript support with strict typing, autocomplete, and compile-time validation.

### 🏦 Bank-Agnostic

Works with any Brazilian bank. Extensible architecture for bank-specific features.

### ⚡ Zero Dependencies

No external dependencies in production. Lightweight and fast.

### 📋 CNAB 240 & 400

Complete support for both FEBRABAN CNAB formats with bidirectional conversion.

### ✅ Auto-Validation

Built-in validation using Zod schemas. Catch errors before processing.

### 🧪 Test-Driven

Developed with TDD. Over 90% test coverage on all critical paths.

---

## 📦 Installation

```bash
npm install @linkiez/boleto-sdk
```

```bash
yarn add @linkiez/boleto-sdk
```

```bash
pnpm add @linkiez/boleto-sdk
```

**Requirements**: Node.js >= 18.0.0

---

## 🚀 Quick Start

### Parse CNAB Files

```typescript
import { parseCnab } from '@linkiez/boleto-sdk';

// Auto-detect format (CNAB240 or CNAB400)
const cnabContent = readFileSync('remessa.txt', 'utf-8');
const parsed = parseCnab(cnabContent);

console.log(parsed.header.bankCode); // "341"
console.log(parsed.batches.length);  // 5
```

### Generate CNAB Files

```typescript
import { generateCnab } from '@linkiez/boleto-sdk';

const data = {
  header: {
    bankCode: '341',
    companyName: 'ACME Corp',
    // ... other fields
  },
  batches: [
    {
      header: { /* ... */ },
      details: [
        {
          ourNumber: '12345678',
          amount: 150.00,
          dueDate: new Date('2026-03-01'),
          payer: {
            name: 'John Doe',
            taxId: '12345678901'
          }
        }
      ],
      trailer: { /* ... */ }
    }
  ],
  trailer: { /* ... */ }
};

const cnabFile = generateCnab(data, '240');
writeFileSync('remessa.ret', cnabFile);
```

### Validate Data

```typescript
import { validateBankSlip } from '@linkiez/boleto-sdk';

try {
  const slip = validateBankSlip({
    documentNumber: '12345',
    amount: 100.50,
    dueDate: new Date('2026-12-31'),
    beneficiary: { name: 'Company', taxId: '12345678000195' },
    payer: { name: 'Customer', taxId: '12345678901' }
  });

  console.log('✓ Valid bank slip');
} catch (error) {
  console.error('✗ Validation failed:', error.message);
}
```

---

## 🎯 Base Infrastructure (Phase 0)

The SDK provides a robust foundation with type-safe utilities, validation, and error handling:

### Error Handling

```typescript
import { CnabError, ValidationError, ParseError } from '@linkiez/boleto-sdk';

try {
  // Your CNAB processing code
} catch (error) {
  if (error instanceof ValidationError) {
    console.error('Validation failed:', error.issues);
  } else if (error instanceof ParseError) {
    console.error('Parse error at line:', error.line);
  }
}
```

### Type-Safe Validation with Zod

```typescript
import { AddressSchema, TaxIdSchema, BeneficiarySchema } from '@linkiez/boleto-sdk';

// Validate address
const address = AddressSchema.parse({
  street: 'Av Paulista',
  number: '1000',
  city: 'São Paulo',
  state: 'SP',
  postalCode: '01310100'
});

// Validate tax ID (CPF/CNPJ) with checksum
const taxId = TaxIdSchema.parse('12345678901'); // Validates modulo 11

// Validate beneficiary
const beneficiary = BeneficiarySchema.parse({
  name: 'ACME Corp',
  taxId: '12345678000195',
  address: { city: 'São Paulo', state: 'SP' },
  bankAccount: { bankCode: '341', branch: '0001', account: '12345' }
});
```

### Utility Functions

```typescript
import { 
  formatTaxId, 
  formatMoney, 
  validateTaxId, 
  calculateModulo11,
  parseDate,
  padLeft,
  padRight 
} from '@linkiez/boleto-sdk';

// Format CPF/CNPJ
formatTaxId('12345678901');      // "123.456.789-01"
formatTaxId('12345678000195');   // "12.345.678/0001-95"

// Format money
formatMoney(1234.56);  // "R$ 1.234,56"

// Validate tax ID with checksum
validateTaxId('12345678901');  // true/false

// Calculate check digits
calculateModulo11('341', [2, 3, 4, 5, 6, 7, 8, 9]);  // "5"

// Parse CNAB dates
parseDate('31122025');  // Date(2025-12-31)

// String padding
padLeft('341', 5, '0');   // "00341"
padRight('ACME', 30, ' '); // "ACME                          "
```

### Bank Constants

```typescript
import { BANKS, getBankInfo, BankCode } from '@linkiez/boleto-sdk';

// Get bank information
const itau = getBankInfo('341');
console.log(itau.name);    // "Itaú Unibanco"
console.log(itau.ispb);    // "60701190"

// Use enum for type safety
const bankCode: BankCode = BankCode.ITAU; // "341"

// All supported banks
console.log(Object.keys(BANKS)); // ["001", "033", "104", "237", "341", "756"]
```

### Enums and Constants

```typescript
import { 
  DocumentType, 
  SpeciesCode, 
  AcceptanceType,
  CurrencyCode,
  MovementType 
} from '@linkiez/boleto-sdk';

const docType = DocumentType.DUPLICATA;  // "DM"
const species = SpeciesCode.DUPLICATA_MERCANTIL;  // "02"
const currency = CurrencyCode.REAL;  // "09"
```

---

## 📚 Documentation

### Core Concepts

- **[CNAB 240 - FEBRABAN](./doc/CNAB240-FEBRABAN.md)** - Complete CNAB240 specification
- **[Bank-Specific Differences](./doc/BANK_DIFFERENCES.md)** - Detailed guide on bank-specific implementations
- **[Roadmap](./ROADMAP.md)** - Development roadmap and project phases

### Bank-Specific CNAB400 Layouts

- **[CNAB 400 - Itaú](./doc/CNAB400-ITAU.md)** - Itaú CNAB400 layout documentation
- **[CNAB 400 - C6 Bank](./doc/CNAB400-C6BANK.md)** - C6 Bank CNAB400 layout documentation
- **[CNAB 400 - Caixa](./doc/CNAB400-CAIXA.md)** - Caixa Econômica Federal CNAB400 layout documentation
- **[CNAB 400 - Santander](./doc/CNAB400-SANTANDER.md)** - Santander CNAB400 layout documentation

### API Reference

```typescript
// Parsing
parseCnab(content: string): CnabFile
parseCnab240(content: string): Cnab240File
parseCnab400(content: string): Cnab400File

// Generation
generateCnab(data: CnabFile, type: '240' | '400'): string
generateCnab240(data: Cnab240File): string
generateCnab400(data: Cnab400File): string

// Validation
validateCnabFile(file: CnabFile): ValidationResult
validateBankSlip(slip: BankSlip): BankSlip
validateTaxId(taxId: string): boolean
validateBarcode(barcode: string): boolean

// Utilities
formatTaxId(taxId: string): string // "123.456.789-01"
formatMoney(amount: number): string // "R$ 1.234,56"
calculateCheckDigit(value: string): string
```

### Type Definitions

```typescript
interface BankSlip {
  documentNumber: string;
  ourNumber: string;
  amount: number;
  dueDate: Date;
  beneficiary: Beneficiary;
  payer: Payer;
  fine?: Fine;
  interest?: Interest;
  discount?: Discount;
}

interface Cnab240File {
  fileHeader: FileHeader;
  batches: Batch[];
  fileTrailer: FileTrailer;
}

interface Cnab400File {
  header: FileHeader;
  details: DetailRecord[];
  trailer: FileTrailer;
}
```

Full API documentation available in the [docs](./docs) folder.

---

## 🏗️ Architecture

This SDK follows **SOLID principles** with a **bank-agnostic design**:

```text
┌─────────────────────────────────────────────┐
│           Public API Layer                  │
│  parseCnab() | generateCnab() | validate()  │
└──────────────────┬──────────────────────────┘
                   │
┌──────────────────▼──────────────────────────┐
│          Factory Pattern                    │
│  CnabParserFactory | CnabGeneratorFactory   │
└──────────────────┬──────────────────────────┘
                   │
        ┌──────────┴──────────┐
        │                     │
┌───────▼────────┐   ┌────────▼───────┐
│  CNAB240       │   │  CNAB400       │
│  - Parser      │   │  - Parser      │
│  - Generator   │   │  - Generator   │
│  - Validator   │   │  - Validator   │
└───────┬────────┘   └────────┬───────┘
        │                     │
        └──────────┬──────────┘
                   │
┌──────────────────▼──────────────────────────┐
│        Common Utilities & Types             │
│  Formatters | Validators | Schemas | Enums  │
└─────────────────────────────────────────────┘
```

**Design Principles**:

- ✅ Single Responsibility - Each class has one job
- ✅ Open/Closed - Extend without modifying core
- ✅ Liskov Substitution - Interfaces are interchangeable
- ✅ Interface Segregation - Small, focused interfaces
- ✅ Dependency Inversion - Depend on abstractions

**Design Principles**:

- ✅ Single Responsibility - Each class has one job
- ✅ Open/Closed - Extend without modifying core
- ✅ Liskov Substitution - Interfaces are interchangeable
- ✅ Interface Segregation - Small, focused interfaces
- ✅ Dependency Inversion - Depend on abstractions

See [ARCHITECTURE.md](./.github/instructions/architecture.instructions.md) for details.

---

## 🗺️ Roadmap

This project follows a **BASE → CNAB400 → CNAB240** development flow:

| Phase | Status | Deliverable |
| ----- | ------ | ----------- |
| **Phase 0: Base Infrastructure** | 🔄 In Progress | Common types, utils, validators, schemas |
| **Phase 1: CNAB400** | ⏳ Planned | Complete CNAB400 parsing & generation |
| **Phase 2: CNAB240** | ⏳ Planned | Complete CNAB240 parsing & generation |
| **Phase 3: Testing & Docs** | ⏳ Planned | 90%+ coverage, full documentation |
| **Phase 4: Release** | ⏳ Planned | v1.0.0 on npm |

**Current Focus**: Building foundational utilities and type system.

See the full [ROADMAP.md](./ROADMAP.md) for detailed breakdown.

---

## 🧪 Development

### Prerequisites

- **Node.js** >= 18.0.0
- **Yarn** 4.x (Berry)

### Setup

```bash
# Clone repository
git clone https://github.com/linkiez/BoletoSDK.git
cd BoletoSDK

# Install dependencies
yarn install

# Run tests
yarn test

# Watch mode
yarn test:watch

# Coverage report
yarn test:coverage

# Lint & format
yarn lint
yarn format

# Build
yarn build
```

### Project Structure

```text
BoletoSDK/
├── src/
│   ├── constants/      # Bank codes, CNAB constants
│   ├── enums/          # Enums (CNAB240, CNAB400, common)
│   ├── errors/         # Custom error classes
│   ├── generators/     # CNAB file generators
│   ├── parsers/        # CNAB file parsers
│   ├── schemas/        # Zod validation schemas
│   ├── types/          # TypeScript type definitions
│   ├── utils/          # Formatters, validators, helpers
│   └── validators/     # Business logic validators
├── tests/
│   ├── fixtures/       # Real CNAB files for testing
│   ├── integration/    # End-to-end tests
│   └── unit/           # Unit tests
└── doc/                # CNAB specifications
```

---

## 🤝 Contributing

Contributions are welcome! Here's how you can help:

### Reporting Issues

Found a bug or have a feature request? [Open an issue](https://github.com/linkiez/BoletoSDK/issues/new).

### Pull Requests

1. **Fork** the repository
2. **Create** a feature branch: `git checkout -b feat/amazing-feature`
3. **Commit** using [Conventional Commits](https://www.conventionalcommits.org/):

   ```text
   feat: add support for bank XYZ
   fix: correct barcode check digit calculation
   docs: update CNAB240 examples
   ```

4. **Push** to your fork: `git push origin feat/amazing-feature`
5. **Open** a Pull Request

### Commit Convention

This project uses [semantic-release](https://github.com/semantic-release/semantic-release) for automated versioning:

| Type | Description | Version Bump |
| ---- | ----------- | ------------ |
| `feat:` | New feature | Minor |
| `fix:` | Bug fix | Patch |
| `docs:` | Documentation only | - |
| `perf:` | Performance improvement | Patch |
| `refactor:` | Code refactoring | - |
| `test:` | Test updates | - |
| `chore:` | Maintenance | - |
| `BREAKING CHANGE:` | Breaking API change | Major |

### Development Guidelines

- ✅ Write tests first (TDD)
- ✅ Follow TypeScript strict mode
- ✅ Maintain 90%+ test coverage
- ✅ Use English for all code/docs
- ✅ Follow existing code style
- ✅ Update documentation

See [CONTRIBUTING.md](./CONTRIBUTING.md) for detailed guidelines.

---

## 📊 Project Status

### Test Coverage

```text
Statements   : 85% (target: 90%)
Branches     : 80% (target: 85%)
Functions    : 90% (target: 90%)
Lines        : 85% (target: 90%)
```

### Code Quality

[![Quality Gate Status](https://sonarcloud.io/api/project_badges/measure?project=linkiez_BoletoSDK&metric=alert_status)](https://sonarcloud.io/dashboard?id=linkiez_BoletoSDK)
[![Maintainability Rating](https://sonarcloud.io/api/project_badges/measure?project=linkiez_BoletoSDK&metric=sqale_rating)](https://sonarcloud.io/dashboard?id=linkiez_BoletoSDK)
[![Security Rating](https://sonarcloud.io/api/project_badges/measure?project=linkiez_BoletoSDK&metric=security_rating)](https://sonarcloud.io/dashboard?id=linkiez_BoletoSDK)

---

## 📜 License

This project is licensed under the **MIT License** - see the [LICENSE](LICENSE) file for details.

### What this means

✅ **Commercial use**
✅ **Modification**
✅ **Distribution**
✅ **Private use**

---

## 🙏 Acknowledgments

- **[FEBRABAN](https://portal.febraban.org.br/)** - For CNAB240 specification
- **Brazilian Banking Community** - For domain knowledge and support
- **Open Source Contributors** - For making this possible

---

## 🔗 Links

- **Documentation**: [./docs](./docs)
- **Roadmap**: [ROADMAP.md](./ROADMAP.md)
- **Architecture**: [architecture.instructions.md](./.github/instructions/architecture.instructions.md)
- **NPM Package**: [@linkiez/boleto-sdk](https://www.npmjs.com/package/@linkiez/boleto-sdk)
- **Report Issues**: [GitHub Issues](https://github.com/linkiez/BoletoSDK/issues)

---

**Built with ❤️ by [Linkiez](https://github.com/linkiez)**

If this project helps you, consider giving it a ⭐ on [GitHub](https://github.com/linkiez/BoletoSDK)!
