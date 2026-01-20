---
applyTo: '**'
---

# English (en_US) Language Standards for BoletoSDK

**ALL content in this project MUST be in English (en_US).**

Public SDK for international use - all code, docs, comments, and content must be English.

## Code (100% English)

### Variables, Functions, Classes, Interfaces
```typescript
// ✅ CORRECT
class BoletoGenerator {
  private bankCode: string;

  public generateBarcode(amount: number): string {
    // Implementation
  }
}

// ❌ WRONG
class GeradorBoleto {
  private codigoBanco: string;
  public gerarCodigoBarras(valor: number): string { }
}
```

### Comments and Documentation

```typescript
// ✅ CORRECT - English comments
/**
 * Validates the bank code according to FEBRABAN standards
 * @param bankCode - Three-digit bank code
 * @returns true if valid, false otherwise
 */
function validateBankCode(bankCode: string): boolean {
  // Check if code has exactly 3 digits
  return /^\d{3}$/.test(bankCode);
}
```

## Error Messages and Logs (100% English)

```typescript
// ✅ CORRECT
throw new Error('Invalid bank code: must be 3 digits');
console.error('Failed to generate barcode');
logger.warn('Barcode checksum mismatch');

// ❌ WRONG - Portuguese
throw new Error('Código do banco inválido');
```

## Documentation (100% English)

- README.md - English only
- All `/doc` markdown - English only
- Code examples - English

### JSDoc Pattern
```typescript
// ✅ CORRECT
/**
 * Represents a Brazilian bank slip (boleto bancário)
 *
 * @example
 * ```typescript
 * const boleto = new Boleto({
 *   amount: 100.50,
 *   dueDate: new Date('2026-02-01'),
 *   beneficiary: 'Company Name'
 * });
 * ```
 */
export class Boleto {
  // ...
}
```

### 4. Test Files (100% English)

```typescript
// ✅ CORRECT
describe('BoletoGenerator', () => {
  it('should generate valid barcode for given amount', () => {
    const generator = new BoletoGenerator();
    const barcode = generator.generateBarcode(100.50);
    expect(barcode).toMatch(/^\d{47}$/);
  });

  it('should throw error when amount is negative', () => {
    const generator = new BoletoGenerator();
    expect(() => generator.generateBarcode(-10)).toThrow('Amount must be positive');
  });
});

// ❌ WRONG
describe('GeradorBoleto', () => {
  it('deve gerar código de barras válido para valor informado', () => {
    const gerador = new GeradorBoleto();
    const codigoBarras = gerador.gerarCodigoBarras(100.50);
    expect(codigoBarras).toMatch(/^\d{47}$/);
  });
});
```

### 5. Git Commits (English)

```bash
# ✅ CORRECT
git commit -m "feat: add CNAB 240 parser"
git commit -m "fix: correct barcode checksum calculation"
git commit -m "docs: update README with installation instructions"
git commit -m "refactor: simplify bank code validation logic"

# ❌ WRONG - Portuguese
git commit -m "feat: adicionar parser CNAB 240"
```

**Types**: `feat`, `fix`, `docs`, `refactor`, `test`, `chore`, `perf`, `ci`, `build`, `style`

## Configuration Files (English)

**package.json:**
```json
{
  "name": "boleto-sdk",
  "description": "Brazilian bank slip (boleto) generation and parsing library",
  "keywords": ["boleto", "banking", "brazil", "cnab", "barcode"],
  "author": "Your Name",
  "license": "MIT"
}
```

**Comments in config files:**
```javascript
// jest.config.js
module.exports = {
  // Run tests in Node environment
  testEnvironment: 'node',

  // Collect coverage from source files
  collectCoverageFrom: ['src/**/*.ts'],
};
```

### 7. Type Definitions and Interfaces (English)

```typescript
// ✅ CORRECT
export interface BoletoData {
  /** Bank code (3 digits) */
  bankCode: string;

  /** Due date for payment */
  dueDate: Date;

  /** Payment amount in BRL */
  amount: number;

  /** Beneficiary name */
  beneficiary: string;

  /** Payer name */
  payer: string;
}

export type BarcodeFormat = 'standard' | 'compact';
export type PaymentStatus = 'pending' | 'paid' | 'overdue' | 'cancelled';
```

### 8. Enums and Constants (English)

```typescript
export enum BankCode {
  BANCO_DO_BRASIL = '001',
  BRADESCO = '237',
  ITAU = '341',
  SANTANDER = '033',
  CAIXA = '104',
}

export const DEFAULT_CURRENCY = 'BRL';
export const BARCODE_LENGTH = 47;
export const MAX_AMOUNT = 999999999.99;
```

## Domain-Specific Terms


✅ Acceptable Brazilian terms (industry-standard):
- CNAB (Centro Nacional de Automação Bancária)
- FEBRABAN (Federação Brasileira de Bancos)
- Boleto (can be kept as is, but explain in comments)
- PIX (payment system name)

**Translate descriptive terms:**

```typescript
class BarcodeGenerator {
  // Generates barcode according to FEBRABAN standards
  // CNAB: Brazilian National Bank Automation Center
  generateCNABBarcode(): string { }
}

const FEBRABAN_SPEC_VERSION = '10'; // Brazilian Banking Federation specification
```

## API Response Messages (English)

```typescript
// ✅ CORRECT
return {
  success: true,
  message: 'Boleto generated successfully',
  data: boletoData
};

return {
  success: false,
  error: 'Invalid due date: must be a future date',
  code: 'INVALID_DUE_DATE'
};

// ❌ WRONG
return {
  success: true,
  message: 'Boleto gerado com sucesso',
  data: boletoData
};
```

## Enforcement Checklist

Before committing:

- [ ] Variable/function/class names in English
- [ ] Code comments in English
- [ ] JSDoc/TSDoc in English
- [ ] Error messages in English
- [ ] Log messages in English
- [ ] Test descriptions in English
- [ ] Commit message in English (Conventional Commits)
- [ ] README and docs in English
- [ ] Type definitions in English
- [ ] Config file comments in English

## Rationale

Public SDK/library requirements:
1. International developer audience
2. Industry standards compliance (SDKs use English)
3. Global open-source collaboration
4. npm/package registry discoverability
5. TypeScript/JavaScript ecosystem alignment

## Domain Glossary

| Portuguese | English | Notes |
|------------|---------|-------|
| Boleto bancário | Bank slip / Boleto | Keep "Boleto" as proper term |
| Código de barras | Barcode | Always translate |
| Beneficiário | Beneficiary | Always translate |
| Pagador | Payer | Always translate |
| Cedente | Assignor | Always translate |
| Sacado | Drawee | Always translate |
| Vencimento | Due date | Always translate |
| Valor | Amount | Always translate |
| Nosso número | Our number | Keep as "nossoNumero" in code, explain in comments |
| Carteira | Portfolio/Wallet | Translate or explain |
| Agência | Branch / Agency | Always translate |
| Conta | Account | Always translate |
| Dígito verificador | Check digit / Checksum | Always translate |

## Example Implementation

### Generator (`src/boleto/generator.ts`)

```typescript
import { BoletoData, BarcodeFormat } from './types';

/**
 * Generates bank slips (boletos) according to FEBRABAN standards
 */
export class BoletoGenerator {
  /**
   * Generates a barcode from boleto data
   * @param data - Boleto information including amount, dates, and parties
   * @param format - Barcode format (standard 47 digits or compact)
   * @throws {Error} If data validation fails
   */
  public generateBarcode(data: BoletoData, format: BarcodeFormat = 'standard'): string {
    this.validateBoletoData(data);
    const checkDigit = this.calculateCheckDigit(data);
    return this.buildBarcode(data, checkDigit, format);
  }

  private validateBoletoData(data: BoletoData): void {
    if (data.amount <= 0) throw new Error('Amount must be greater than zero');
    if (data.dueDate < new Date()) throw new Error('Due date must be in the future');
    if (!/^\d{3}$/.test(data.bankCode)) throw new Error('Bank code must be 3 digits');
  }
}
```

### Tests (`tests/boleto/generator.test.ts`)

```typescript
import { BoletoGenerator } from '../src/boleto/generator';
import { BoletoData } from '../src/boleto/types';

describe('BoletoGenerator', () => {
  let generator: BoletoGenerator;

  beforeEach(() => {
    generator = new BoletoGenerator();
  });

  describe('generateBarcode', () => {
    it('should generate valid barcode for valid boleto data', () => {
      const data: BoletoData = {
        bankCode: '341',
        amount: 150.00,
        dueDate: new Date('2026-03-01'),
        beneficiary: 'ACME Corp',
        payer: 'John Doe'
      };

      expect(generator.generateBarcode(data)).toMatch(/^\d{47}$/);
    });

    it('should throw error when amount is negative', () => {
      const data: BoletoData = { /* ... */ amount: -10 /* ... */ };
      expect(() => generator.generateBarcode(data))
        .toThrow('Amount must be greater than zero');
    });

    it('should throw error when due date is in the past', () => {
      const data: BoletoData = { /* ... */ dueDate: new Date('2020-01-01') /* ... */ };
      expect(() => generator.generateBarcode(data))
        .toThrow('Due date must be in the future');
    });
  });
});
```

---

**This is an international SDK project. English is mandatory for all content.**
