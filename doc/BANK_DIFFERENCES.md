# Bank-Specific Differences in CNAB Files

**Last Updated**: 2026-01-20

This document details the specific differences between Brazilian banks when implementing CNAB files, even when following FEBRABAN standards.

---

## Table of Contents

1. [Overview](#overview)
2. [Common Differences](#common-differences)
3. [Bank-Specific Details](#bank-specific-details)
4. [Implementation Strategy](#implementation-strategy)
5. [Validation Rules](#validation-rules)

---

## Overview

While FEBRABAN defines standard CNAB layouts (240 and 400), each bank implements:

- **Specific field interpretations** in "bank use" areas
- **Custom validation rules** for their own fields
- **Proprietary check digit algorithms**
- **Bank-specific occurrence/instruction codes**
- **Different wallet (carteira) configurations**

### Bank-Specific Documentation Available

This project includes detailed CNAB400 layout documentation for:

- **[Itaú (341)](./CNAB400-ITAU.md)** - Complete CNAB400 specifications
- **[C6 Bank (336)](./CNAB400-C6BANK.md)** - Complete CNAB400 specifications
- **[Caixa (104)](./CNAB400-CAIXA.md)** - Complete CNAB400 specifications
- **[Santander (033)](./CNAB400-SANTANDER.md)** - Complete CNAB400 specifications

### Why This Matters

Understanding these differences is critical for:

- ✅ Correct file generation
- ✅ Proper validation
- ✅ Accurate parsing
- ✅ Bank acceptance/rejection prevention

---

## Common Differences

### 1. Our Number (Nosso Número)

The "our number" field uniquely identifies a bank slip within the bank's system.

| Bank | Format | Length | Check Digit | Algorithm |
| ---- | ------ | ------ | ----------- | --------- |
| **Itaú (341)** | NNNNNNNN-D | 8 + 1 | Yes | Modulo 10 |
| **Bradesco (237)** | NNNNNNNNNNN-D | 11 + 1 | Yes | Modulo 11 |
| **Banco do Brasil (001)** | NNNNNNNNNNNNNNNNN | 17 | No | - |
| **Caixa (104)** | NNNNNNNNNNNNNN-D | 14 + 1 | Yes | Modulo 11 |
| **Santander (033)** | NNNNNNNNNNNNN | 13 | No | - |

**Example - Itaú**:

```typescript
// Input: 12345678
// Check digit calculation (Modulo 10)
const checkDigit = calculateItauCheckDigit('12345678'); // '9'
// Result: 12345678-9
```

**Example - Bradesco**:

```typescript
// Input: 12345678901
// Check digit calculation (Modulo 11)
const checkDigit = calculateBradescoCheckDigit('12345678901'); // 'P'
// Result: 12345678901-P
```

### 2. Wallet Codes (Carteiras)

Each bank uses different wallet codes to identify service types.

#### Itaú (341)

| Code | Description | Registered | CNAB Type |
| ---- | ----------- | ---------- | --------- |
| 109 | Direct Collection | Yes | 240/400 |
| 112 | Assigned Collection | Yes | 240/400 |
| 115 | Without Registration | No | 400 only |
| 180 | Direct Collection | Yes | 240 |

#### Bradesco (237)

| Code | Description | Variation | CNAB Type |
| ---- | ----------- | --------- | --------- |
| 09 | Direct Collection | 019 | 240/400 |
| 19 | Without Registration | - | 400 only |
| 26 | Express Collection | - | 240/400 |

#### Banco do Brasil (001)

| Code | Description | Variation | CNAB Type |
| ---- | ----------- | --------- | --------- |
| 11 | Registered | 019, 027 | 240/400 |
| 12 | Without Registration | - | 400 only |
| 17 | Direct Collection | 019 | 240/400 |
| 31 | Caução | - | 240/400 |

#### Caixa (104)

| Code | Description | Registered | CNAB Type |
| ---- | ----------- | ---------- | --------- |
| CR | Quick Registered | Yes | 240/400 |
| SR | Without Registration | No | 240/400 |
| CS | SIGCB Registered | Yes | 240 |

### 3. Barcode Calculation

Different banks may use different algorithms for barcode check digits.

**Standard FEBRABAN Barcode**: 47 digits

- Positions 1-3: Bank code
- Position 4: Currency code (9 = Real)
- Position 5: Check digit (DV)
- Positions 6-9: Due date factor
- Positions 10-19: Amount (10 digits, last 2 decimals)
- Positions 20-44: Free field (bank-specific)

**Check Digit Algorithms**:

```typescript
// Modulo 11 (most common)
function calculateBarcodeCheckDigitMod11(barcode: string): string {
  const sequence = '2329876543298765432987654329876543298765432';
  let sum = 0;

  for (let i = 0; i < barcode.length; i++) {
    sum += parseInt(barcode[i]) * parseInt(sequence[i]);
  }

  const remainder = sum % 11;
  const dv = 11 - remainder;

  if (dv === 0 || dv === 1 || dv === 10 || dv === 11) return '1';
  return dv.toString();
}

// Modulo 10 (some banks)
function calculateBarcodeCheckDigitMod10(barcode: string): string {
  let sum = 0;
  let multiplier = 2;

  for (let i = barcode.length - 1; i >= 0; i--) {
    let digit = parseInt(barcode[i]) * multiplier;
    sum += digit > 9 ? Math.floor(digit / 10) + (digit % 10) : digit;
    multiplier = multiplier === 2 ? 1 : 2;
  }

  const remainder = sum % 10;
  return remainder === 0 ? '0' : (10 - remainder).toString();
}
```

### 4. Occurrence Codes

Banks extend FEBRABAN standard occurrence codes with their own.

**FEBRABAN Standard Codes** (common to all):

| Code | Description |
| ---- | ----------- |
| 02 | Entry confirmed |
| 03 | Entry rejected |
| 06 | Liquidation |
| 09 | Low (automatic) |
| 10 | Low requested |

**Bank-Specific Extensions**:

#### Itaú Additional Codes

| Code | Description |
| ---- | ----------- |
| 15 | Liquidation in bank slip |
| 16 | Low by paid via Itaú |
| 24 | Inclusion of payer address |
| 28 | Tariff entry debit |
| 73 | Confirmed discount change |

#### Bradesco Additional Codes

| Code | Description |
| ---- | ----------- |
| 12 | Abatement granted |
| 13 | Abatement cancelled |
| 20 | Protest confirmed |
| 21 | Protest sustained |
| 34 | Low for payment in bank slip |

### 5. Instruction Codes

**Generic Instructions** (FEBRABAN):

| Code | Description |
| ---- | ----------- |
| 01 | Protest after N days overdue |
| 02 | Low after N days overdue |
| 03 | Grant discount after due date |
| 04 | Grant abatement |

**Bank-Specific Instructions**:

#### Itaú Specific

| Code | Description |
| ---- | ----------- |
| 07 | Protest in N days |
| 09 | Do not protest |
| 11 | Do not receive after N days |
| 12 | Collection with protest electronic |
| 18 | Automatic low after N days |

#### Bradesco Specific

| Code | Description |
| ---- | ----------- |
| 06 | Protest on day X |
| 15 | Receive only with our number |
| 16 | Receive only if same day |
| 42 | Transfer to discount |
| 45 | Automatic low after 15 days |

---

## Bank-Specific Details

### Itaú (Bank Code 341)

**File Layout**: CNAB400-ITAU (custom) and CNAB240 (standard)

**Key Characteristics**:

1. **Our Number**: 8 digits + check digit (modulo 10)
2. **Wallets**: 109, 112, 115, 180
3. **Registration**: Most wallets require registration except 115
4. **Special Fields**:
   - DAC calculation is mandatory
   - Agency and account have specific formats
   - Portfolio code must match contracted service

**CNAB400 Specifics**:

```typescript
interface ItauCnab400Detail {
  // Standard fields
  recordType: '1';
  ourNumber: string; // 8 digits
  ourNumberDac: string; // 1 digit (modulo 10)
  wallet: '109' | '112' | '115' | '180';

  // Itaú-specific fields (positions vary)
  portfolioCode: string; // Position 108
  instructionCode1: string; // Position 157-158
  instructionCode2: string; // Position 159-160

  // Agency/Account format
  agency: string; // 4 digits
  account: string; // 5 digits
  accountDac: string; // 1 digit
}
```

**CNAB240 Specifics**:

- Segment P: Additional validations on wallet code
- Segment Q: Extended payer information
- Segment R: Specific discount/fine rules

**Validation Rules**:

```typescript
function validateItauOurNumber(ourNumber: string): boolean {
  if (!/^\d{8}$/.test(ourNumber)) return false;

  const dac = calculateItauCheckDigit(ourNumber);
  // Additional validation logic
  return true;
}

function calculateItauCheckDigit(value: string): string {
  const sequence = '21212121';
  let sum = 0;

  for (let i = 0; i < value.length; i++) {
    let digit = parseInt(value[i]) * parseInt(sequence[i]);
    sum += digit > 9 ? Math.floor(digit / 10) + (digit % 10) : digit;
  }

  const remainder = sum % 10;
  return remainder === 0 ? '0' : (10 - remainder).toString();
}
```

### Bradesco (Bank Code 237)

**File Layout**: CNAB400 and CNAB240 (both standard FEBRABAN)

**Key Characteristics**:

1. **Our Number**: 11 digits + check digit (modulo 11)
2. **Wallets**: 09, 19, 26
3. **Wallet Variation**: Required field
4. **Special Fields**:
   - Bank use fields contain specific codes
   - Different message limits

**CNAB400 Specifics**:

```typescript
interface BradescoCnab400Detail {
  recordType: '1';
  ourNumber: string; // 11 digits
  ourNumberDac: string; // 1 digit (modulo 11)
  wallet: '09' | '19' | '26';
  walletVariation: string; // 3 digits

  // Bradesco-specific
  companyCode: string; // 20 positions
  instructionCode1: string;
  instructionCode2: string;
}
```

**Validation Rules**:

```typescript
function validateBradescoOurNumber(ourNumber: string, wallet: string): boolean {
  if (!/^\d{11}$/.test(ourNumber)) return false;

  // Wallet-specific validation
  if (wallet === '09' || wallet === '26') {
    // Must be registered
    return validateRegistered(ourNumber);
  }

  return true;
}

function calculateBradescoCheckDigit(value: string): string {
  const sequence = '2765432765432';
  let sum = 0;

  for (let i = 0; i < value.length; i++) {
    sum += parseInt(value[i]) * parseInt(sequence[i]);
  }

  const remainder = sum % 11;

  if (remainder === 0) return '0';
  if (remainder === 1) return 'P';
  return (11 - remainder).toString();
}
```

### Banco do Brasil (Bank Code 001)

**File Layout**: CNAB400 and CNAB240 (FEBRABAN standard)

**Key Characteristics**:

1. **Our Number**: 17 digits (no check digit in file)
2. **Wallets**: 11, 12, 17, 31
3. **Wallet Variation**: 019, 027 (depends on contract)
4. **Agreement Number**: Critical for file acceptance

**CNAB240 Specifics**:

```typescript
interface BBCnab240SegmentP {
  // Standard segment P fields
  wallet: '11' | '12' | '17' | '31';
  walletVariation: '019' | '027';
  agreementNumber: string; // 7 digits (critical!)
  ourNumber: string; // 17 digits

  // BB-specific validations
  companyCode: string; // Must match agreement
}
```

**Validation Rules**:

```typescript
function validateBBOurNumber(ourNumber: string): boolean {
  // BB uses 17 digits, no check digit in file
  if (!/^\d{17}$/.test(ourNumber)) return false;

  // First 7 digits must match agreement number
  return true;
}

function validateBBAgreement(agreementNumber: string, ourNumber: string): boolean {
  return ourNumber.startsWith(agreementNumber);
}
```

### Caixa Econômica Federal (Bank Code 104)

**File Layout**: CNAB240 (primary) and CNAB400

**Key Characteristics**:

1. **Our Number**: 14 digits + check digit
2. **Wallets**: CR (Quick Registered), SR (Without Registration), CS (SIGCB)
3. **SIGCB Integration**: Specific for Caixa system
4. **Special Validation**: Strict rules on registration

**CNAB240 Specifics**:

```typescript
interface CaixaCnab240SegmentP {
  wallet: 'CR' | 'SR' | 'CS';
  ourNumber: string; // 14 digits
  ourNumberDac: string; // 1 digit (modulo 11)

  // Caixa-specific
  modalityCode: string; // 2 digits
  identificationCode: string; // Agreement code
}
```

**Validation Rules**:

```typescript
function validateCaixaOurNumber(ourNumber: string): boolean {
  if (!/^\d{14}$/.test(ourNumber)) return false;

  const dac = calculateCaixaCheckDigit(ourNumber);
  return dac.length === 1;
}

function calculateCaixaCheckDigit(value: string): string {
  // Modulo 11 with specific sequence
  const multipliers = [2, 3, 4, 5, 6, 7, 8, 9, 2, 3, 4, 5, 6, 7];
  let sum = 0;

  for (let i = 0; i < value.length; i++) {
    sum += parseInt(value[i]) * multipliers[i];
  }

  const remainder = sum % 11;

  if (remainder === 0 || remainder === 1) return '0';
  return (11 - remainder).toString();
}
```

### Santander (Bank Code 033)

**File Layout**: CNAB400 and CNAB240

**Key Characteristics**:

1. **Our Number**: 13 digits (7 + 6 sequential)
2. **No Check Digit** in file
3. **IoF Code**: Required for insurance slips
4. **Specific Registration Rules**

**CNAB240 Specifics**:

```typescript
interface SantanderCnab240SegmentP {
  ourNumber: string; // 13 digits (7 fixed + 6 sequential)
  wallet: string; // 101, 102, 201

  // Santander-specific
  iofCode: string; // For insurance
  originCode: string; // Document origin
}
```

---

## Implementation Strategy

### BoletoSDK Approach

**Phase 1: Generic Base** (Current - v1.0.0)

```typescript
// Works with any bank, basic validation
import { parseCnab, generateCnab } from '@linkiez/boleto-sdk';

const parsed = parseCnab(cnabContent);
// Returns: generic structure, bank fields as strings
```

**Phase 2: Bank Adapters** (Current - v1.1.0 in progress)

```typescript
// Bank-specific enrichment and validation helpers
import { createItauAdapter } from '@linkiez/boleto-sdk';

const adapter = createItauAdapter();

adapter.assertSupportedWallet('109');

const ourNumber = adapter.buildOurNumber('12345678');
// { baseNumber: '12345678', checkDigit: 2, formatted: '123456782' }

const remittanceDetails = adapter.buildRemittanceDetailsFromContent(cnab400RemittanceContent);
const returnDetails = adapter.buildReturnDetailsFromContent(cnab400ReturnContent);
const cnab240Details = adapter.buildCnab240DetailsFromContent(cnab240Content);
```

### Adapter Architecture

```typescript
// Current SDK adapter interface
interface IBankAdapter<
  TWalletConfig,
  TRemittanceDetail,
  TReturnDetail,
  TCnab240Detail
> {
  isSupportedWallet(walletCode: string): boolean;
  assertSupportedWallet(walletCode: string): void;
  getWalletConfig(walletCode: string): TWalletConfig | undefined;
  buildRemittanceDetailsFromContent(content: string): TRemittanceDetail[];
  buildReturnDetailsFromContent(content: string): TReturnDetail[];
  buildCnab240DetailsFromContent(content: string): TCnab240Detail[];
}

// Example: Itaú Adapter
class ItauAdapter implements IBankAdapter {
  isSupportedWallet(walletCode: string): boolean {
    return ['109', '112', '115', '180'].includes(walletCode);
  }

  assertSupportedWallet(walletCode: string): void {
    if (!this.isSupportedWallet(walletCode)) {
      throw new Error(`Unsupported Itaú wallet code: ${walletCode}`);
    }
  }

  formatOurNumber(baseNumber: string): string {
    // Uses Itau modulo 10 check digit helper
    const checkDigit = this.calculateModulo10(baseNumber);
    return `${baseNumber}${checkDigit}`;
  }

  private calculateModulo10(value: string): number {
    // Simplified snippet for documentation purposes.
    return 0;
  }

  buildRemittanceDetailsFromContent(content: string) {
    // Returns Itaú-enriched CNAB400 remittance details
    return [];
  }

  buildReturnDetailsFromContent(content: string) {
    // Returns Itaú-enriched CNAB400 return details
    return [];
  }

  buildCnab240DetailsFromContent(content: string) {
    // Returns Itaú-enriched CNAB240 details
    return [];
  }

  // ... other methods
}
```

---

## Validation Rules

### Generic Validation (Base SDK)

```typescript
// Always executed, regardless of bank
function validateGenericCnabStructure(file: CnabFile): ValidationResult {
  const errors: string[] = [];

  // Header exists
  if (!file.header) errors.push('Missing file header');

  // Trailer exists
  if (!file.trailer) errors.push('Missing file trailer');

  // Has details
  if (!file.details || file.details.length === 0) {
    errors.push('No detail records found');
  }

  // Record counts match
  const expectedCount = file.details.length + 2; // header + trailer
  if (file.trailer.recordCount !== expectedCount) {
    errors.push(`Record count mismatch: expected ${expectedCount}, got ${file.trailer.recordCount}`);
  }

  return {
    isValid: errors.length === 0,
    errors,
    warnings: []
  };
}
```

### Bank-Specific Validation (Adapters)

```typescript
// Executed in a bank-specific validation layer
class ItauValidationService {
  validate(file: CnabFile): ValidationResult {
    const errors: string[] = [];
    const warnings: string[] = [];

    // Validate bank code
    if (file.header.bankCode !== '341') {
      errors.push('Bank code must be 341 for Itaú');
    }

    // Validate each detail
    file.details.forEach((detail, index) => {
      // Our number format
      if (!this.validateOurNumber(detail.ourNumber)) {
        errors.push(`Detail ${index}: invalid our number format`);
      }

      // Wallet validation
      if (!this.isSupportedWallet(detail.wallet)) {
        errors.push(`Detail ${index}: invalid wallet code ${detail.wallet}`);
      }

      // DAC validation
      const expectedDac = this.calculateOurNumberCheckDigit(detail.ourNumber);
      if (detail.ourNumberDac !== expectedDac) {
        errors.push(`Detail ${index}: invalid check digit`);
      }

      // Wallet-specific rules
      if (detail.wallet === '115') {
        // No registration wallet
        if (detail.requiresRegistration) {
          warnings.push(`Detail ${index}: wallet 115 does not require registration`);
        }
      }
    });

    return {
      isValid: errors.length === 0,
      errors,
      warnings
    };
  }

  private isSupportedWallet(wallet: string): boolean {
    return ['109', '112', '115', '180'].includes(wallet);
  }

  private validateOurNumber(value: string): boolean {
    return /^\d{8}$/.test(value);
  }

  private calculateOurNumberCheckDigit(value: string): string {
    return '0';
  }
}
```

---

## Summary

### Key Takeaways

1. **Base standard is universal** - FEBRABAN CNAB240/400 works across all banks
2. **Bank-specific fields matter** - "Bank use" areas contain critical information
3. **Validation varies** - Each bank has unique rules beyond FEBRABAN
4. **Our number is critical** - Format and calculation differ significantly
5. **Adapters solve complexity** - Isolate bank logic without coupling core

### SDK Implementation Timeline

| Version | Capability |
| ------- | ---------- |
| **v1.0.0** | Generic parsing/generation for all banks |
| **v1.1.0** | Itaú adapter with full validation |
| **v1.2.0** | Bradesco adapter |
| **v1.3.0** | Banco do Brasil adapter |
| **v1.4.0** | Caixa adapter |
| **v2.0.0** | All major banks + community adapters |

### For Contributors

When adding bank support:

1. **Research** - Get official bank documentation
2. **Map fields** - Identify bank-specific areas
3. **Extract logic** - Isolate calculation algorithms
4. **Test with real files** - Validate against actual bank files
5. **Document** - Add to this guide

---

## References

- **FEBRABAN**: [Portal FEBRABAN](https://portal.febraban.org.br/)
- **Itaú**: See [CNAB400-ITAU.md](./CNAB400-ITAU.md)
- **CNAB240 Standard**: See [CNAB240-FEBRABAN.md](./CNAB240-FEBRABAN.md)

---

**Maintained by**: BoletoSDK Team
**Contributions**: Welcome! Please submit PRs with bank-specific details.
