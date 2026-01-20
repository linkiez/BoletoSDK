---
applyTo: '**'
---

# BoletoSDK - Project Structure

## Core Principles

### 1. One File Per Export

- Each type/interface/enum/class in its own file
- File name matches export name (PascalCase)
- Examples: `BoletoHeader.ts` → `interface BoletoHeader`, `PaymentType.ts` → `enum PaymentType`

### 2. Root-Level Barrel Exports

- Every main folder has `index.ts` barrel that re-exports everything
- **ALWAYS import from root category, NEVER from subfolders**
- Subfolders are organizational, not import paths

### 3. Naming Conventions

- **Files**: PascalCase (matches export name)
- **Folders**: kebab-case
- **Interfaces/Types**: PascalCase, optional `I` prefix
- **Enums**: PascalCase
- **Classes**: PascalCase
- **Functions**: camelCase
- **Constants**: SCREAMING_SNAKE_CASE

## Directory Structure

```text
src/
├── index.ts                      # Public API exports
├── types/                        # Type definitions
│   ├── index.ts                  # Barrel: exports all types
│   ├── cnab240/                  # CNAB 240 specific types
│   ├── cnab400/                  # CNAB 400 specific types
│   ├── common/                   # Shared types
│   └── json/                     # JSON types (output/input)
├── enums/                        # Enumerators
│   ├── index.ts
│   ├── cnab240/
│   ├── cnab400/
│   └── common/
├── constants/                    # Constants
│   ├── index.ts
│   ├── bancos/
│   ├── cnab240/
│   └── cnab400/
├── utils/                        # Utility functions
│   ├── index.ts
│   ├── formatters/
│   ├── validators/
│   ├── parsers/
│   └── generators/
├── parsers/                      # CNAB → JSON parsers
│   ├── index.ts
│   ├── cnab240/
│   ├── cnab400/
│   └── CnabParserFactory.ts
├── generators/                   # JSON → CNAB generators
│   ├── index.ts
│   ├── cnab240/
│   ├── cnab400/
│   └── CnabGeneratorFactory.ts
├── validators/                   # Structure validators
│   ├── index.ts
│   ├── cnab240/
│   ├── cnab400/
│   └── common/
├── errors/                       # Custom errors
│   ├── index.ts
│   ├── CnabError.ts
│   ├── ParseError.ts
│   ├── ValidationError.ts
│   └── GenerationError.ts
└── schemas/                      # Zod schemas
    ├── index.ts
    ├── cnab240/
    ├── cnab400/
    └── common/
```

## Barrel Exports Pattern

Every `index.ts` re-exports all files from subfolders.

### Root Barrel (`/src/types/index.ts`)

```typescript
export * from './cnab240';
export * from './cnab400';
export * from './common';
export * from './json';
```

### Subfolder Barrel (`/src/types/cnab240/index.ts`)

```typescript
export * from './FileHeader';
export * from './BatchHeader';
export * from './SegmentA';
export * from './SegmentB';
export * from './SegmentJ';
export * from './BatchTrailer';
export * from './FileTrailer';
```

## Import Patterns

### ✅ CORRECT - Root-Level Imports

```typescript
import { FileHeader, SegmentA, BankSlip } from '@types';
import { BankCode, TaxIdType } from '@enums';
import { BANCO_BRASIL, LAYOUT_VERSION } from '@constants';
import { formatTaxId, validateDate, padLeft } from '@utils';
import { Cnab240Parser, Cnab400Parser } from '@parsers';
import { Cnab240Generator, Cnab400Generator } from '@generators';
import { Cnab240Validator, BankSlipValidator } from '@validators';
import { CnabError, ParseError } from '@errors';
```

### ❌ WRONG - Subfolder Imports

```typescript
// NEVER do this:
import { FileHeader } from '@types/cnab240';
import { formatTaxId } from '@utils/formatters';
import { BankCode } from '@enums/common';
```

## TypeScript Configuration

`tsconfig.json` path aliases:

```json
{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@types": ["src/types"],
      "@enums": ["src/enums"],
      "@constants": ["src/constants"],
      "@utils": ["src/utils"],
      "@parsers": ["src/parsers"],
      "@generators": ["src/generators"],
      "@validators": ["src/validators"],
      "@errors": ["src/errors"],
      "@schemas": ["src/schemas"]
    }
  }
}
```

## Code Conventions

### Types/Interfaces (`src/types/common/BankSlip.ts`)

```typescript
/**
 * Represents a Brazilian bank slip (boleto bancário)
 */
export interface BankSlip {
  documentNumber: string;
  ourNumber: string;
  amount: number;
  dueDate: Date;
  beneficiary: Beneficiary;
  payer: Payer;
}
```

### Enums (`src/enums/common/BankCode.ts`)

```typescript
/**
 * Brazilian bank codes (FEBRABAN)
 */
export enum BankCode {
  BANCO_DO_BRASIL = '001',
  SANTANDER = '033',
  ITAU = '341',
  BRADESCO = '237',
  CAIXA = '104',
}
```

### Constants (`src/constants/bancos/ITAU.ts`)

```typescript
export const ITAU_CODE = '341';
export const ITAU_NAME = 'Itaú Unibanco S.A.';
export const ITAU_CARTEIRA = '109';

export const ITAU_CONSTANTS = {
  code: ITAU_CODE,
  name: ITAU_NAME,
  carteira: ITAU_CARTEIRA,
} as const;
```

### Utils (`src/utils/formatters/formatTaxId.ts`)

```typescript
/**
 * Format CPF or CNPJ with punctuation
 * @param value - Raw CPF/CNPJ number
 * @returns Formatted CPF/CNPJ
 */
export function formatTaxId(value: string): string {
  const clean = value.replace(/\D/g, '');

  if (clean.length === 11) {
    return clean.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
  }

  if (clean.length === 14) {
    return clean.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, '$1.$2.$3/$4-$5');
  }

  return value;
}
```

### Classes (`src/parsers/cnab240/Cnab240Parser.ts`)

```typescript
import { CnabJson, FileHeader } from '@types';
import { CnabError } from '@errors';

/**
 * Parser for CNAB 240 format files
 */
export class Cnab240Parser {
  /**
   * Parse CNAB 240 file content to JSON
   */
  public parse(content: string): CnabJson {
    const lines = content.split('\n').filter(line => line.trim());
    if (lines.length === 0) throw new CnabError('Empty CNAB file');
    // Implementation...
  }
}
```

### Errors (`src/errors/CnabError.ts`)

```typescript
/**
 * Base error for CNAB operations
 */
export class CnabError extends Error {
  constructor(message: string, public readonly code?: string) {
    super(message);
    this.name = 'CnabError';
    Error.captureStackTrace(this, this.constructor);
  }
}
```

## Zod Schema Pattern

**Why Zod**: TypeScript-first, runtime validation, type inference, zero dependencies

### Schema Definition (`src/schemas/common/BankSlipSchema.ts`)

```typescript
import { z } from 'zod';

export const BankSlipSchema = z.object({
  documentNumber: z.string().min(1),
  ourNumber: z.string().min(1),
  amount: z.number().positive(),
  dueDate: z.date(),
  beneficiary: z.object({
    name: z.string(),
    taxId: z.string().length(11).or(z.string().length(14)),
  }),
  payer: z.object({
    name: z.string(),
    taxId: z.string().length(11).or(z.string().length(14)),
  }),
});

/**
 * Infer TypeScript type from schema
 */
export type BankSlip = z.infer<typeof BankSlipSchema>;
```

### Schema Usage (`src/validators/common/BankSlipValidator.ts`)

```typescript
import { BankSlipSchema } from '@schemas';
import { ValidationError } from '@errors';
import type { BankSlip } from '@types';

export function validateBankSlip(data: unknown): BankSlip {
  const result = BankSlipSchema.safeParse(data);

  if (!result.success) {
    throw new ValidationError('Validation failed', result.error.issues);
  }

  return result.data;
}

### CNAB Schemas (`src/schemas/cnab240/FileHeaderSchema.ts`)

```typescript
import { z } from 'zod';
import { BankCode } from '@enums';

export const FileHeaderSchema = z.object({
  bankCode: z.nativeEnum(BankCode),
  batchService: z.literal('0000'),
  recordType: z.literal('0'),
  companyTaxId: z.string().length(14),
  companyName: z.string().max(30),
  generationDate: z.date(),
  generationTime: z.string().regex(/^\d{6}$/),
  sequenceNumber: z.number().int().positive(),
});

export type FileHeader = z.infer<typeof FileHeaderSchema>;
```

### Schema Reuse Pattern

```typescript
import { z } from 'zod';
import { AddressSchema } from './AddressSchema';

export const PayerSchema = z.object({
  name: z.string().min(1),
  taxId: z.string().regex(/^\d{11}$|^\d{14}$/),
  address: AddressSchema, // Reuse
  email: z.string().email().optional(),
});

export type Payer = z.infer<typeof PayerSchema>;
```

### Schema with Transformation

```typescript
import { z } from 'zod';

export const CnabDateSchema = z.string()
  .length(8)
  .regex(/^\d{8}$/)
  .transform((val) => {
    const year = parseInt(val.substring(4, 8));
    const month = parseInt(val.substring(2, 4)) - 1;
    const day = parseInt(val.substring(0, 2));
    return new Date(year, month, day);
  });

// Usage: "20012026" → new Date(2026, 0, 20)
```

## Test Structure

```text
tests/
├── unit/
│   ├── utils/
│   │   ├── formatters/
│   │   ├── validators/
│   │   ├── parsers/
│   │   └── generators/
│   ├── parsers/
│   │   ├── cnab240/
│   │   └── cnab400/
│   ├── generators/
│   │   ├── cnab240/
│   │   └── cnab400/
│   └── validators/
├── integration/
│   ├── cnab240-to-json.test.ts
│   ├── json-to-cnab240.test.ts
│   ├── cnab400-to-json.test.ts
│   └── json-to-cnab400.test.ts
└── fixtures/
    ├── cnab240/
    ├── cnab400/
    └── json/
```

**Test Naming**: `{SourceFile}.test.ts` - mirrors `src/` structure

**Example**:

- Source: `src/utils/formatters/formatTaxId.ts`
- Test: `tests/unit/utils/formatters/formatTaxId.test.ts`


## JSDoc Requirements

All public exports MUST have JSDoc:

```typescript
/**
 * Parse CNAB 240 file header line
 *
 * @param line - Raw header line (240 characters)
 * @returns Parsed header object
 * @throws {ParseError} When line format is invalid
 *
 * @example
 * ```typescript
 * const header = parseFileHeader('00100000 ...');
 * console.log(header.bankCode); // '001'
 * ```
 */
export function parseFileHeader(line: string): FileHeader {
  // Implementation
}
```

## Public API Exports (`src/index.ts`)

```typescript
// Main classes
export { Cnab240Parser, Cnab400Parser } from '@parsers';
export { Cnab240Generator, Cnab400Generator } from '@generators';
export { CnabParserFactory } from '@parsers';
export { CnabGeneratorFactory } from '@generators';

// Validators
export { Cnab240Validator, Cnab400Validator, BankSlipValidator } from '@validators';

// Types (public API only)
export type {
  BankSlip,
  CnabJson,
  BoletoJson,
  ValidationResult,
  Beneficiary,
  Payer,
} from '@types';

// Enums (public API only)
export {
  BankCode,
  TaxIdType,
  SecurityType,
  InterestType,
} from '@enums';

// Utils (public API only)
export {
  formatTaxId,
  validateTaxId,
  validateBarcode,
  generateBarcode,
} from '@utils';

// Errors
export {
  CnabError,
  ParseError,
  ValidationError,
  GenerationError,
} from '@errors';

// Constants (public API only)
export {
  BANCO_BRASIL,
  ITAU,
  SANTANDER,
  BRADESCO,
} from '@constants';
```

## ESLint Rule - Enforce Barrel Imports

`.eslintrc.json`:

```json
{
  "rules": {
    "no-restricted-imports": [
      "error",
      {
        "patterns": [
          "@types/*",
          "@enums/*",
          "@constants/*",
          "@utils/*",
          "@parsers/*",
          "@generators/*",
          "@validators/*",
          "@errors/*"
        ]
      }
    ]
  }
}
```

**Prevents subfolder imports, enforces barrel usage.**

## Implementation Checklist

When creating new component:

- [ ] File in correct folder
- [ ] PascalCase filename matches export
- [ ] Complete JSDoc on export
- [ ] Added to subfolder `index.ts` (if exists)
- [ ] Added to main folder `index.ts`
- [ ] Tests created in mirrored location under `tests/unit/`
- [ ] Imports use root-level barrels (`@types`, not `@types/cnab240`)
- [ ] If public API: added to `src/index.ts`

## Complete Example Flow

### 1. Create Type (`src/types/common/Fine.ts`)

```typescript
export interface Fine {
  type: number;
  date: Date;
  percentage: number;
}
```

### 2. Add to Subfolder Barrel (`src/types/common/index.ts`)

```typescript
export * from './BankSlip';
export * from './Beneficiary';
export * from './Payer';
export * from './Address';
export * from './Fine'; // ← Add this
```

### 3. Use in Code

```typescript
import { Fine, BankSlip } from '@types';

const fine: Fine = {
  type: 1,
  date: new Date(),
  percentage: 2.5,
};
```

Barrel at `src/types/index.ts` automatically exports everything.

---

## Summary - Golden Rules

1. ✅ **One file = one primary export**
2. ✅ **Barrels in ALL main folders**
3. ✅ **Always import from root** (`@types`, never `@types/cnab240`)
4. ✅ **PascalCase for files** (matches export name)
5. ✅ **JSDoc mandatory** on public exports
6. ✅ **Tests mirror `src/` structure**
7. ✅ **Public API controlled** via `src/index.ts`
8. ✅ **Subfolders are organizational**, not directly importable

---

**Last update**: 2026-01-20
**Version**: 1.0.0
