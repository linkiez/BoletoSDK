# API Reference

Complete reference for all public APIs in BoletoSDK.

## Table of Contents

1. [Parser Functions](#parser-functions)
2. [Generator Functions](#generator-functions)
3. [Validator Functions](#validator-functions)
4. [Type Definitions](#type-definitions)
5. [Error Classes](#error-classes)
6. [Utility Functions](#utility-functions)

---

## Parser Functions

### `parseCnab400()`

Parse a CNAB400 file (REMESSA or RETORNO) into typed JSON.

**Signature**:

```typescript
function parseCnab400(content: string): Cnab400File
```

**Parameters**:

| Parameter | Type     | Description                           |
| --------- | -------- | ------------------------------------- |
| `content` | `string` | Complete CNAB400 file content (UTF-8) |

**Returns**: `Cnab400File` - Parsed and validated CNAB data

**Throws**:

- `ParseError` - Invalid file format, wrong line length, or malformed data
- `ValidationError` - Data doesn't match schema (post-parse validation)

**Example**:

```typescript
import { parseCnab400 } from '@linkiez/boleto-sdk';
import { readFileSync } from 'fs';

const content = readFileSync('arquivo.ret', 'utf-8');
const parsed = parseCnab400(content);

console.log('Bank:', parsed.header.bankCode);
console.log('Type:', parsed.header.operationType === '1' ? 'REMESSA' : 'RETORNO');
console.log('Records:', parsed.details.length);
```

**Behavior**:

- Automatically detects REMESSA (type '1') vs RETORNO (type '2')
- Parses penalty records (Type 2) if present in REMESSA
- Validates line lengths (must be exactly 400 characters)
- Accepts blank `totalRecords` in trailer (treats as 0)
- Converts dates from DDMMYY to `Date` objects
- Converts amounts from strings to numbers (cents)

**Format Detection**:

The parser determines format from position 2 (`operationType`):

- `'1'` → REMESSA (uses `parseDetailRecord()`)
- `'2'` → RETORNO (uses `parseReturnDetailRecord()`)

**Related Functions**:

- `validateCnab400File()` - Validate before parsing
- `generateCnab400()` - Generate CNAB from parsed data

---

## Generator Functions

### `generateCnab400()`

Generate a CNAB400 file (REMESSA or RETORNO) from typed JSON.

**Signature**:

```typescript
function generateCnab400(data: Cnab400File): string
```

**Parameters**:

| Parameter | Type           | Description                              |
| --------- | -------------- | ---------------------------------------- |
| `data`    | `Cnab400File`  | Complete CNAB data structure to generate |

**Returns**: `string` - Complete CNAB400 file content (400 chars per line, newline-separated)

**Throws**:

- `GenerationError` - Invalid data or missing required fields
- `ValidationError` - Data doesn't match schema (pre-generation validation)

**Example**:

```typescript
import { generateCnab400, Cnab400File } from '@linkiez/boleto-sdk';

const data: Cnab400File = {
  header: {
    recordType: '0',
    operationType: '1',  // REMESSA
    operationLiteral: 'REMESSA',
    serviceCode: '01',
    serviceLiteral: 'COBRANCA',
    agency: '4897',
    account: '17450',
    accountDigit: '6',
    companyName: 'MY COMPANY LTDA',
    bankCode: '341',
    bankName: 'BANCO ITAU SA',
    generationDate: new Date(),
    sequenceNumber: 1
  },
  details: [
    {
      recordType: '1',
      // ... all required fields
      sequentialNumber: 1
    }
  ],
  trailer: {
    recordType: '9',
    totalRecords: 1,
    sequentialNumber: 2
  }
};

const cnabContent = generateCnab400(data);
console.log('Lines:', cnabContent.split('\n').filter(l => l.length > 0).length);
```

**Behavior**:

- Automatically routes to correct generator based on `operationType`:
  - `'1'` → `generateDetailRecordRemessa()` for REMESSA
  - `'2'` → `generateDetailRecord()` for RETORNO
- Includes penalty records if present in REMESSA files
- Validates all lines are exactly 400 characters
- Formats dates as DDMMYY (6 characters)
- Formats penalty dates as DDMMYYYY (8 characters)
- Pads/truncates strings to match specification
- Converts `Date` objects to DDMMYY format
- Converts amounts (numbers) to zero-padded strings

**Format Routing**:

```typescript
const isRemessa = data.header.operationType === '1';

const detailLines = data.details.map((detail, index) => {
  return isRemessa
    ? generateDetailRecordRemessa(detail, data.header)
    : generateDetailRecord(detail, data.header);
});
```

**Validation**:

All generated lines are validated:

```typescript
if (line.length !== 400) {
  throw new GenerationError(`Generated line has ${line.length} characters (expected 400)`);
}
```

**Related Functions**:

- `validateCnab400File()` - Validate before generating
- `parseCnab400()` - Parse generated file

---

## Validator Functions

### `validateCnab400File()`

Validate a CNAB400 data structure against schema.

**Signature**:

```typescript
function validateCnab400File(data: unknown): Cnab400File
```

**Parameters**:

| Parameter | Type      | Description                    |
| --------- | --------- | ------------------------------ |
| `data`    | `unknown` | Data to validate (type-unsafe) |

**Returns**: `Cnab400File` - Validated and typed data

**Throws**:

- `ValidationError` - Data doesn't match schema
  - Contains `issues` array with detailed error messages
  - Each issue has `path`, `message`, and `code`

**Example**:

```typescript
import { validateCnab400File, ValidationError } from '@linkiez/boleto-sdk';

try {
  const validData = validateCnab400File(untrustedData);
  console.log('✓ Data is valid');
} catch (error) {
  if (error instanceof ValidationError) {
    console.error('Validation errors:');
    error.issues?.forEach(issue => {
      console.error(`  ${issue.path.join('.')}: ${issue.message}`);
    });
  }
}
```

**Validation Rules**:

**Header**:

- `recordType`: Must be '0'
- `operationType`: Must be '1' or '2'
- `operationLiteral`: Must be 'REMESSA' or 'RETORNO'
- `bankCode`: Must be 3-digit string
- `generationDate`: Must be valid Date
- `creationDate`: Optional, only for RETORNO

**Detail Records**:

- `recordType`: Must be '1'
- `amount`: Must be positive number
- `dueDate`: Optional Date
- `ourNumber`: Required string (max 8 chars)
- `documentNumber`: Required string (max 10 chars)
- `payerTaxId`: Must match CPF (11 digits) or CNPJ (14 digits) pattern

**Penalty Records** (REMESSA only):

- `recordType`: Must be '2'
- `penaltyCode`: Must be '1', '2', or '3'
- `penaltyDate`: Must be valid Date
- `penaltyValue`: Required number (percentage or amount in cents)

**Trailer**:

- `recordType`: Must be '9'
- `totalRecords`: Optional number (can be 0)
- `sequentialNumber`: Required number

**Related Functions**:

- `parseCnab400()` - Parse with automatic validation
- `generateCnab400()` - Generate with automatic validation

---

## Type Definitions

### `Cnab400File`

Complete CNAB400 file structure.

```typescript
interface Cnab400File {
  header: FileHeader;
  details: DetailRecord[];
  penaltyRecords?: PenaltyRecord[];  // Optional, REMESSA only
  trailer: FileTrailer;
}
```

---

### `FileHeader`

Header record (Type 0).

```typescript
interface FileHeader {
  recordType: '0';
  operationType: '1' | '2';  // '1' = REMESSA, '2' = RETORNO
  operationLiteral: string;  // 'REMESSA' or 'RETORNO'
  serviceCode: string;       // '01' = Cobrança
  serviceLiteral: string;    // 'COBRANCA'
  agency: string;            // 4 digits
  zeros?: string;            // '00'
  account: string;           // 5 digits
  accountDigit: string;      // 1 digit
  blanks1?: string;
  companyName: string;       // 30 chars
  bankCode: string;          // 3 digits (e.g., '341' = Itaú)
  bankName: string;          // 15 chars
  generationDate: Date;      // File generation date
  blanks2?: string;
  sequenceNumber: number;    // Sequential file number
  creationDate?: Date;       // RETORNO only - position 114-119
  blanks3?: string;
}
```

**Key Fields**:

- `operationType`: Determines REMESSA ('1') vs RETORNO ('2')
- `creationDate`: Only present in RETORNO files
- `bankCode`: Identifies the bank (341 = Itaú, 001 = Banco do Brasil, etc.)

---

### `DetailRecord`

Detail record (Type 1).

```typescript
interface DetailRecord {
  recordType: '1';
  companyRegistrationNumber?: string;  // CPF/CNPJ (14 digits)
  agency?: string;                     // 4 digits
  zeros1?: string;
  account?: string;                    // 5 digits
  accountDigit?: string;               // 1 digit
  blanks1?: string;
  companyControl?: string;             // Internal control (25 chars)
  ourNumber: string;                   // Bank slip number (8 digits)
  blanks2?: string;
  portfolioCode?: string;              // 3 digits (e.g., '109' for Itaú)
  blanks3?: string;
  occurrenceCode?: string;             // 2 digits
  documentNumber?: string;             // 10 chars
  dueDate?: Date;                      // Payment due date
  amount: number;                      // Amount in cents
  bankCode?: string;                   // 3 digits
  blanks4?: string;
  speciesCode?: string;                // 2 digits ('01' = Duplicata)
  acceptance?: string;                 // 'A' = Yes, 'N' = No
  issueDate?: Date;                    // Slip issue date
  instructionCode1?: string;           // REMESSA only - 2 digits
  instructionCode2?: string;           // REMESSA only - 2 digits
  interestAmount?: number;             // Interest in cents
  discountDate?: Date;                 // Discount expiry date
  discountAmount?: number;             // Discount in cents
  iofAmount?: number;                  // IOF in cents
  rebateAmount?: number;               // Rebate in cents
  payerRegistrationType?: string;      // '01' = CPF, '02' = CNPJ
  payerTaxId?: string;                 // CPF (11) or CNPJ (14)
  payerName?: string;                  // 30 chars
  blanks5?: string;
  payerAddress?: string;               // 40 chars
  blanks6?: string;
  payerPostalCode?: string;            // 8 digits
  payerCity?: string;                  // 15 chars
  blanks7?: string;
  payerState?: string;                 // 2 chars (e.g., 'SP')
  blanks8?: string;
  paymentDate?: Date;                  // RETORNO only - actual payment date
  blanks9?: string;
  sequentialNumber: number;            // Sequential record number
}
```

**Format Differences**:

| Field             | REMESSA Position | RETORNO Position | Notes                            |
| ----------------- | ---------------- | ---------------- | -------------------------------- |
| `dueDate`         | 121-126          | 147-152          | Different positions!             |
| `amount`          | 127-139          | 153-165          | Different positions!             |
| `bankCode`        | 140-142          | 120-122          | Different positions!             |
| `instructionCode1`| 157-158          | N/A              | REMESSA only                     |
| `instructionCode2`| 159-160          | N/A              | REMESSA only                     |
| `occurrenceCode`  | 109-110          | 109-110          | RETORNO typically uses this      |
| `paymentDate`     | N/A              | 176-181          | RETORNO only                     |

---

### `PenaltyRecord`

Penalty record (Type 2) - REMESSA only.

```typescript
interface PenaltyRecord {
  recordType: '2';
  penaltyCode: '1' | '2' | '3';  // 1=None, 2=Percentage, 3=Fixed amount
  penaltyDate?: Date;            // Effective from date (DDMMYYYY format!)
  penaltyValue?: number;         // Percentage (basis points) or amount (cents)
  blanks?: string;               // 371 blank positions
  sequentialNumber: number;      // Sequential record number
}
```

**Penalty Codes**:

- `'1'`: No penalty
- `'2'`: Percentage penalty (e.g., 200 = 2.00%)
- `'3'`: Fixed amount penalty (e.g., 500 = R$ 5.00)

**Important**: `penaltyDate` uses **DDMMYYYY** format (8 characters), not DDMMYY like other dates.

**Example**:

```typescript
const penalty: PenaltyRecord = {
  recordType: '2',
  penaltyCode: '2',                    // Percentage
  penaltyDate: new Date('2026-03-01'),
  penaltyValue: 200,                   // 2.00% (200 basis points)
  sequentialNumber: 3
};
```

---

### `FileTrailer`

Trailer record (Type 9).

```typescript
interface FileTrailer {
  recordType: '9';
  totalRecords: number;       // Total detail records (can be 0/blank)
  blanks?: string;
  sequentialNumber: number;   // Sequential record number
}
```

**Note**: Many banks leave `totalRecords` blank (parsed as 0), which is acceptable.

---

## Error Classes

### `ParseError`

Thrown when parsing CNAB content fails.

```typescript
class ParseError extends CnabError {
  constructor(message: string, line?: number);
  
  line?: number;  // Line number where error occurred (1-indexed)
}
```

**Example**:

```typescript
import { parseCnab400, ParseError } from '@linkiez/boleto-sdk';

try {
  const parsed = parseCnab400(content);
} catch (error) {
  if (error instanceof ParseError) {
    console.error(`Parse error at line ${error.line}: ${error.message}`);
  }
}
```

**Common Causes**:

- Invalid line length (not 400 characters)
- Invalid record type (not '0', '1', '2', or '9')
- Malformed dates (not DDMMYY format)
- Missing header or trailer

---

### `ValidationError`

Thrown when data doesn't match schema.

```typescript
class ValidationError extends CnabError {
  constructor(message: string, issues?: z.ZodIssue[]);
  
  issues?: z.ZodIssue[];  // Detailed validation errors from Zod
}
```

**Zod Issue Structure**:

```typescript
interface ZodIssue {
  path: (string | number)[];  // Field path (e.g., ['details', 0, 'amount'])
  message: string;            // Error message
  code: string;               // Error code (e.g., 'invalid_type')
}
```

**Example**:

```typescript
import { validateCnab400File, ValidationError } from '@linkiez/boleto-sdk';

try {
  const validated = validateCnab400File(data);
} catch (error) {
  if (error instanceof ValidationError) {
    error.issues?.forEach(issue => {
      console.error(`Field ${issue.path.join('.')}: ${issue.message}`);
    });
  }
}
```

**Common Issues**:

- `invalid_type`: Wrong data type (e.g., string instead of number)
- `too_small`: Number/string is below minimum
- `too_big`: Number/string exceeds maximum
- `invalid_string`: String doesn't match pattern (e.g., tax ID format)

---

### `GenerationError`

Thrown when generating CNAB content fails.

```typescript
class GenerationError extends CnabError {
  constructor(message: string, field?: string);
  
  field?: string;  // Field name that caused error
}
```

**Example**:

```typescript
import { generateCnab400, GenerationError } from '@linkiez/boleto-sdk';

try {
  const cnabContent = generateCnab400(data);
} catch (error) {
  if (error instanceof GenerationError) {
    console.error(`Generation error in field '${error.field}': ${error.message}`);
  }
}
```

**Common Causes**:

- Generated line length ≠ 400 characters
- Missing required fields
- Invalid data types
- Date formatting errors

---

### `CnabError`

Base error class for all CNAB-related errors.

```typescript
class CnabError extends Error {
  constructor(
    message: string,
    code?: string,
    context?: Record<string, unknown>
  );
  
  code?: string;                      // Error code
  context?: Record<string, unknown>;  // Additional context
}
```

**Example**:

```typescript
import { CnabError } from '@linkiez/boleto-sdk';

try {
  // ... CNAB operations
} catch (error) {
  if (error instanceof CnabError) {
    console.error(`CNAB Error [${error.code}]: ${error.message}`);
    console.error('Context:', error.context);
  }
}
```

---

## Utility Functions

### `formatDate()`

Format a Date object as DDMMYY string.

**Signature**:

```typescript
function formatDate(date: Date): string
```

**Example**:

```typescript
import { formatDate } from '@linkiez/boleto-sdk/utils';

const formatted = formatDate(new Date('2026-01-21'));
console.log(formatted);  // "210126"
```

---

### `parseDate()`

Parse a DDMMYY string into a Date object.

**Signature**:

```typescript
function parseDate(dateStr: string): Date | undefined
```

**Example**:

```typescript
import { parseDate } from '@linkiez/boleto-sdk/utils';

const date = parseDate('210126');
console.log(date?.toLocaleDateString('pt-BR'));  // "21/01/2026"
```

---

### `padLeft()` / `padRight()`

Pad strings to specific length.

**Signatures**:

```typescript
function padLeft(value: string | number, length: number, char?: string): string
function padRight(value: string | number, length: number, char?: string): string
```

**Example**:

```typescript
import { padLeft, padRight } from '@linkiez/boleto-sdk/utils';

console.log(padLeft('123', 8, '0'));      // "00000123"
console.log(padRight('ITAU', 15, ' '));   // "ITAU           "
```

---

### `validateTaxId()`

Validate CPF or CNPJ format.

**Signature**:

```typescript
function validateTaxId(taxId: string): boolean
```

**Example**:

```typescript
import { validateTaxId } from '@linkiez/boleto-sdk/utils';

console.log(validateTaxId('12345678901'));     // true (CPF - 11 digits)
console.log(validateTaxId('12345678000195'));  // true (CNPJ - 14 digits)
console.log(validateTaxId('123'));             // false (invalid length)
```

---

## Summary

This API reference covered:

- ✅ Parser functions (`parseCnab400`)
- ✅ Generator functions (`generateCnab400`)
- ✅ Validator functions (`validateCnab400File`)
- ✅ Type definitions (interfaces and types)
- ✅ Error classes (ParseError, ValidationError, GenerationError)
- ✅ Utility functions (date formatting, padding, validation)

For usage examples, see:

- [CNAB400 Usage Guide](./CNAB400-USAGE-GUIDE.md)
- [README Examples](../README.md#cnab400-complete-guide)

---

**Last Updated**: 2026-01-21
