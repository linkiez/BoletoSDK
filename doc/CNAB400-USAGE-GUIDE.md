# CNAB400 Usage Guide

Complete guide for using CNAB400 parser and generator with real-world examples.

## Table of Contents

1. [Overview](#overview)
2. [REMESSA vs RETORNO](#remessa-vs-retorno)
3. [Parsing Files](#parsing-files)
4. [Generating Files](#generating-files)
5. [Field Mapping Reference](#field-mapping-reference)
6. [Real-World Examples](#real-world-examples)
7. [Best Practices](#best-practices)
8. [Troubleshooting](#troubleshooting)

---

## Overview

CNAB400 (Centro Nacional de Automação Bancária - 400 bytes) is a standardized file format used by Brazilian banks for bank slip (boleto) processing. Each line in a CNAB400 file is exactly **400 characters** long.

### File Structure

Every CNAB400 file contains:

1. **Header Record** (Type 0) - 1 line
2. **Detail Records** (Type 1) - N lines
3. **Penalty Records** (Type 2) - Optional, only in REMESSA
4. **Trailer Record** (Type 9) - 1 line

**Example**:

```
0 ← Header (Type 0)
1 ← Detail (Type 1)
1 ← Detail (Type 1)
2 ← Penalty (Type 2) - Optional
1 ← Detail (Type 1)
9 ← Trailer (Type 9)
```

---

## REMESSA vs RETORNO

### REMESSA (Remittance - Operation Type '1')

**Purpose**: Send payment instructions TO the bank

**Use Cases**:

- Register new bank slips
- Update existing slips (change due date, amount, etc.)
- Cancel slips
- Apply discounts or penalties
- Request printing by bank

**Key Characteristics**:

- Operation Type: `'1'`
- Contains **instruction codes** (what the bank should do)
- May include **penalty records** (Type 2) for fines/fees
- No payment information (that comes in RETORNO)
- No occurrence codes

**Example Header**:

```
Position 002: '1' (REMESSA)
Position 003-009: 'REMESSA'
```

### RETORNO (Return - Operation Type '2')

**Purpose**: Receive payment status FROM the bank

**Use Cases**:

- Payment confirmations
- Rejection notifications
- Status updates (overdue, paid, canceled)
- Bank fees and charges
- Error messages

**Key Characteristics**:

- Operation Type: `'2'`
- Contains **occurrence codes** (what happened)
- Includes payment dates and amounts
- Has `creationDate` field (REMESSA does not)
- No instruction codes
- No penalty records

**Example Header**:

```
Position 002: '2' (RETORNO)
Position 003-009: 'RETORNO'
Position 114-119: '210126' (creation date DDMMYY)
```

### Critical Differences

The SDK **automatically handles** these differences:

| Aspect                   | REMESSA           | RETORNO           |
| ------------------------ | ----------------- | ----------------- |
| **Operation Type**       | '1'               | '2'               |
| **Direction**            | Company → Bank    | Bank → Company    |
| **Due Date Position**    | 121-126           | 147-152           |
| **Amount Position**      | 127-139           | 153-165           |
| **Bank Code Position**   | 140-142           | 120-122           |
| **Has Instruction Code** | ✅ Yes (157-160)  | ❌ No             |
| **Has Occurrence Code**  | ❌ No             | ✅ Yes (109-110)  |
| **Has Creation Date**    | ❌ No             | ✅ Yes (114-119)  |
| **Has Penalty Records**  | ✅ Optional       | ❌ No             |

---

## Parsing Files

### Basic Parsing

The parser automatically detects file type:

```typescript
import { parseCnab400 } from '@linkiez/boleto-sdk';
import { readFileSync } from 'fs';

const content = readFileSync('arquivo.ret', 'utf-8');
const parsed = parseCnab400(content);

// Check what type of file it is
if (parsed.header.operationType === '1') {
  console.log('This is a REMESSA file');
} else if (parsed.header.operationType === '2') {
  console.log('This is a RETORNO file');
}
```

### Parse REMESSA File

```typescript
const remessaContent = readFileSync('remessa.ret', 'utf-8');
const remessa = parseCnab400(remessaContent);

// Header information
console.log('Bank:', remessa.header.bankCode);              // "341" (Itaú)
console.log('Company:', remessa.header.companyName);        // "JCM INDUSTRIA..."
console.log('Generation Date:', remessa.header.generationDate);

// Detail records
remessa.details.forEach((detail, index) => {
  console.log(`\nSlip ${index + 1}:`);
  console.log('  Our Number:', detail.ourNumber);
  console.log('  Document:', detail.documentNumber);
  console.log('  Amount: R$', (detail.amount / 100).toFixed(2));
  console.log('  Due Date:', detail.dueDate?.toLocaleDateString('pt-BR'));
  console.log('  Payer:', detail.payerName);

  // Instruction codes (REMESSA-specific)
  console.log('  Instruction 1:', detail.instructionCode1);
  console.log('  Instruction 2:', detail.instructionCode2);
});

// Penalty records (if present)
if (remessa.penaltyRecords && remessa.penaltyRecords.length > 0) {
  console.log('\nPenalty Records:');
  remessa.penaltyRecords.forEach((penalty) => {
    switch (penalty.penaltyCode) {
      case '1':
        console.log('  No penalty');
        break;
      case '2':
        console.log(`  Penalty: ${penalty.penaltyValue}% after ${penalty.penaltyDate?.toLocaleDateString()}`);
        break;
      case '3':
        console.log(`  Penalty: R$ ${(penalty.penaltyValue! / 100).toFixed(2)} after ${penalty.penaltyDate?.toLocaleDateString()}`);
        break;
    }
  });
}

// Trailer
console.log('\nTotal Records:', remessa.trailer.totalRecords);
console.log('Sequential Number:', remessa.trailer.sequentialNumber);
```

### Parse RETORNO File

```typescript
const retornoContent = readFileSync('retorno.ret', 'utf-8');
const retorno = parseCnab400(retornoContent);

// Header information (RETORNO has creationDate)
console.log('Bank:', retorno.header.bankCode);
console.log('Generation Date:', retorno.header.generationDate);
console.log('Creation Date:', retorno.header.creationDate);  // Only in RETORNO

// Detail records
retorno.details.forEach((detail, index) => {
  console.log(`\nSlip ${index + 1}:`);
  console.log('  Our Number:', detail.ourNumber);
  console.log('  Document:', detail.documentNumber);
  console.log('  Amount: R$', (detail.amount / 100).toFixed(2));

  // Occurrence code (RETORNO-specific)
  console.log('  Occurrence:', detail.occurrenceCode);

  // Occurrence code meanings (common values):
  switch (detail.occurrenceCode) {
    case '02':
      console.log('  ✓ Entry confirmed');
      break;
    case '06':
      console.log('  ✓ Payment confirmed');
      console.log('  Payment Date:', detail.paymentDate?.toLocaleDateString());
      break;
    case '09':
      console.log('  ⚠ Slip sent to protest');
      break;
    case '10':
      console.log('  ⚠ Slip protested');
      break;
    case '03':
      console.log('  ✗ Entry rejected');
      break;
    default:
      console.log('  ? Unknown occurrence');
  }
});
```

---

## Generating Files

### Generate REMESSA File

Complete example with all required fields:

```typescript
import { generateCnab400, Cnab400File } from '@linkiez/boleto-sdk';

const remessaData: Cnab400File = {
  header: {
    recordType: '0',
    operationType: '1',  // REMESSA
    operationLiteral: 'REMESSA',
    serviceCode: '01',
    serviceLiteral: 'COBRANCA',
    agency: '4897',
    account: '17450',
    accountDigit: '6',
    companyName: 'JCM INDUSTRIA E COMERCIO DE METAIS LTDA',
    bankCode: '341',  // Itaú
    bankName: 'BANCO ITAU SA',
    generationDate: new Date('2026-01-21'),
    sequenceNumber: 1
  },
  details: [
    {
      recordType: '1',
      companyRegistrationNumber: '12345678000195',  // CNPJ
      agency: '4897',
      account: '17450',
      accountDigit: '6',
      companyControl: 'DOC001',  // Internal control number
      ourNumber: '12345678',     // Bank slip number
      portfolioCode: '109',      // Itaú portfolio
      occurrenceCode: '01',      // 01 = Entry registration
      documentNumber: 'NF-001',  // Invoice number
      dueDate: new Date('2026-02-28'),
      amount: 15000,             // R$ 150.00 (amount in cents)
      bankCode: '341',
      speciesCode: '01',         // Duplicata Mercantil
      acceptance: 'N',           // Not accepted
      issueDate: new Date('2026-01-21'),
      instructionCode1: '00',    // No instruction
      instructionCode2: '00',

      // Interest (optional)
      interestAmount: 0,

      // Discount (optional)
      discountDate: undefined,
      discountAmount: 0,

      // IOF (optional)
      iofAmount: 0,

      // Rebate (optional)
      rebateAmount: 0,

      // Payer information
      payerRegistrationType: '02',  // 02 = CNPJ
      payerTaxId: '98765432000100',
      payerName: 'ACME CORPORATION LTDA',
      payerAddress: 'RUA EXEMPLO 123 SALA 456',
      payerCity: 'SAO PAULO',
      payerState: 'SP',
      payerPostalCode: '01310100',

      sequentialNumber: 1
    },
    {
      recordType: '1',
      companyRegistrationNumber: '12345678000195',
      agency: '4897',
      account: '17450',
      accountDigit: '6',
      companyControl: 'DOC002',
      ourNumber: '12345679',
      portfolioCode: '109',
      occurrenceCode: '01',
      documentNumber: 'NF-002',
      dueDate: new Date('2026-03-15'),
      amount: 25000,  // R$ 250.00
      bankCode: '341',
      speciesCode: '01',
      acceptance: 'N',
      issueDate: new Date('2026-01-21'),
      instructionCode1: '00',
      instructionCode2: '00',
      interestAmount: 0,
      discountAmount: 0,
      iofAmount: 0,
      rebateAmount: 0,
      payerRegistrationType: '01',  // 01 = CPF
      payerTaxId: '12345678901',
      payerName: 'JOHN DOE',
      payerAddress: 'AV PAULISTA 1000 APT 123',
      payerCity: 'SAO PAULO',
      payerState: 'SP',
      payerPostalCode: '01310100',
      sequentialNumber: 2
    }
  ],
  trailer: {
    recordType: '9',
    totalRecords: 0,  // Can be blank (will be calculated)
    sequentialNumber: 3
  }
};

const cnabContent = generateCnab400(remessaData);

// Save to file
import { writeFileSync } from 'fs';
writeFileSync('remessa_generated.ret', cnabContent, 'utf-8');

console.log('✓ REMESSA file generated successfully');
console.log('Lines:', cnabContent.split('\n').filter(l => l.length > 0).length);
```

### Generate REMESSA with Penalty Records

```typescript
import { generateCnab400, Cnab400File, PenaltyRecord } from '@linkiez/boleto-sdk';

const penaltyRecords: PenaltyRecord[] = [
  {
    recordType: '2',
    penaltyCode: '2',  // 2 = Percentage
    penaltyDate: new Date('2026-03-01'),  // Effective from this date
    penaltyValue: 200,  // 2.00% (200 basis points)
    sequentialNumber: 2  // Must increment sequentially
  },
  {
    recordType: '2',
    penaltyCode: '3',  // 3 = Fixed amount
    penaltyDate: new Date('2026-03-05'),
    penaltyValue: 500,  // R$ 5.00 (in cents)
    sequentialNumber: 4
  }
];

const remessaWithPenalty: Cnab400File = {
  header: { /* ... */ sequenceNumber: 1 },
  details: [ /* ... detail with sequentialNumber: 1 */ ],
  penaltyRecords: penaltyRecords,
  trailer: { /* ... */ sequentialNumber: 5 }  // After all records
};

const cnabContent = generateCnab400(remessaWithPenalty);
```

**Important Notes on Penalty Records**:

- Type 2 records are **optional** and only used in REMESSA
- They always come **after** their related detail record
- Sequential numbers must **increment** across all record types
- `penaltyDate` uses **DDMMYYYY** format (8 characters, not 6 like other dates)
- Penalty values are in **cents** for fixed amounts, or **basis points** for percentages

### Generate RETORNO File

```typescript
const retornoData: Cnab400File = {
  header: {
    recordType: '0',
    operationType: '2',  // RETORNO
    operationLiteral: 'RETORNO',
    serviceCode: '01',
    serviceLiteral: 'COBRANCA',
    agency: '4897',
    account: '17450',
    accountDigit: '6',
    companyName: 'JCM INDUSTRIA E COMERCIO DE METAIS LTDA',
    bankCode: '341',
    bankName: 'BANCO ITAU SA',
    generationDate: new Date('2026-01-22'),
    sequenceNumber: 16702,
    creationDate: new Date('2026-01-22')  // Only in RETORNO
  },
  details: [
    {
      recordType: '1',
      companyRegistrationNumber: '12345678000195',
      agency: '4897',
      account: '17450',
      accountDigit: '6',
      ourNumber: '12345678',
      portfolioCode: '109',
      occurrenceCode: '06',  // 06 = Payment confirmed
      documentNumber: 'NF-001',
      dueDate: new Date('2026-02-28'),
      amount: 15000,  // Amount paid
      bankCode: '341',
      paymentDate: new Date('2026-02-27'),  // Payment date (RETORNO-specific)
      sequentialNumber: 1
    }
  ],
  trailer: {
    recordType: '9',
    totalRecords: 1,
    sequentialNumber: 3
  }
};

const retornoContent = generateCnab400(retornoData);
```

---

## Field Mapping Reference

### Common Header Fields (Both REMESSA and RETORNO)

| Field              | Position  | Type   | Description                       |
| ------------------ | --------- | ------ | --------------------------------- |
| recordType         | 001       | N(1)   | Always '0' for header             |
| operationType      | 002       | N(1)   | '1' = REMESSA, '2' = RETORNO      |
| operationLiteral   | 003-009   | X(7)   | 'REMESSA' or 'RETORNO'            |
| serviceCode        | 010-011   | N(2)   | '01' = Cobrança                   |
| serviceLiteral     | 012-026   | X(15)  | 'COBRANCA'                        |
| agency             | 027-030   | N(4)   | Agency number                     |
| zeros              | 031-032   | N(2)   | '00'                              |
| account            | 033-037   | N(5)   | Account number                    |
| accountDigit       | 038       | N(1)   | Account check digit               |
| companyName        | 047-076   | X(30)  | Company name                      |
| bankCode           | 077-079   | N(3)   | Bank code (341 = Itaú)            |
| bankName           | 080-094   | X(15)  | Bank name                         |
| generationDate     | 095-100   | N(6)   | File generation date (DDMMYY)     |
| sequenceNumber     | 111-115   | N(5)   | Sequential file number            |

### RETORNO-Only Header Fields

| Field           | Position  | Type   | Description                    |
| --------------- | --------- | ------ | ------------------------------ |
| creationDate    | 114-119   | N(6)   | Credit date (DDMMYY)           |

### REMESSA Detail Fields (Type 1)

| Field                      | Position  | Type    | Description                     |
| -------------------------- | --------- | ------- | ------------------------------- |
| recordType                 | 001       | N(1)    | Always '1'                      |
| companyRegistrationNumber  | 002-017   | N(14)   | CPF/CNPJ                        |
| agency                     | 018-021   | N(4)    | Agency                          |
| account                    | 024-028   | N(5)    | Account                         |
| accountDigit               | 029       | N(1)    | Account digit                   |
| companyControl             | 038-062   | X(25)   | Internal control                |
| ourNumber                  | 063-070   | N(8)    | Bank slip number                |
| portfolioCode              | 084-086   | N(3)    | Portfolio code                  |
| occurrenceCode             | 109-110   | N(2)    | Occurrence (01=Entry)           |
| documentNumber             | 111-120   | X(10)   | Document number                 |
| **dueDate**                | **121-126** | **N(6)** | **Due date (DDMMYY)**        |
| **amount**                 | **127-139** | **N(13)** | **Amount (cents)**           |
| **bankCode**               | **140-142** | **N(3)** | **Bank code**                |
| speciesCode                | 148-149   | N(2)    | Species code                    |
| acceptance                 | 150       | X(1)    | A=Accepted, N=Not               |
| issueDate                  | 151-156   | N(6)    | Issue date (DDMMYY)             |
| **instructionCode1**       | **157-158** | **N(2)** | **Instruction code 1**       |
| **instructionCode2**       | **159-160** | **N(2)** | **Instruction code 2**       |
| interestAmount             | 161-173   | N(13)   | Interest (cents)                |
| discountDate               | 174-179   | N(6)    | Discount date (DDMMYY)          |
| discountAmount             | 180-192   | N(13)   | Discount (cents)                |
| iofAmount                  | 193-205   | N(13)   | IOF (cents)                     |
| rebateAmount               | 206-218   | N(13)   | Rebate (cents)                  |
| payerRegistrationType      | 219-220   | N(2)    | 01=CPF, 02=CNPJ                 |
| payerTaxId                 | 221-234   | N(14)   | CPF/CNPJ                        |
| payerName                  | 235-264   | X(30)   | Payer name                      |
| payerAddress               | 275-314   | X(40)   | Address                         |
| payerCity                  | 327-334   | X(15)   | City                            |
| payerState                 | 352-353   | X(2)    | State (SP, RJ, etc.)            |
| payerPostalCode            | 335-351   | N(8)    | Postal code                     |
| sequentialNumber           | 395-400   | N(6)    | Sequential record number        |

### RETORNO Detail Fields (Type 1)

| Field              | Position    | Type    | Description                     |
| ------------------ | ----------- | ------- | ------------------------------- |
| recordType         | 001         | N(1)    | Always '1'                      |
| ourNumber          | 063-070     | N(8)    | Bank slip number                |
| portfolioCode      | 084-086     | N(3)    | Portfolio code                  |
| **occurrenceCode** | **109-110** | **N(2)** | **What happened (06=Paid)**  |
| documentNumber     | 111-120     | X(10)   | Document number                 |
| **bankCode**       | **120-122** | **N(3)** | **Bank code**                |
| **dueDate**        | **147-152** | **N(6)** | **Due date (DDMMYY)**        |
| **amount**         | **153-165** | **N(13)** | **Amount (cents)**           |
| paymentDate        | 176-181     | N(6)    | Payment date (DDMMYY)           |
| sequentialNumber   | 395-400     | N(6)    | Sequential record number        |

**Bold fields** indicate position differences between REMESSA and RETORNO.

---

## Real-World Examples

### Example 1: Process Payments from RETORNO

```typescript
import { parseCnab400 } from '@linkiez/boleto-sdk';
import { readFileSync } from 'fs';

const retornoContent = readFileSync('retorno_20260121.ret', 'utf-8');
const retorno = parseCnab400(retornoContent);

// Filter paid slips
const paidSlips = retorno.details.filter(detail => detail.occurrenceCode === '06');

console.log(`Found ${paidSlips.length} payments`);

// Process each payment
paidSlips.forEach(slip => {
  const amountPaid = slip.amount / 100;
  const paymentDate = slip.paymentDate?.toLocaleDateString('pt-BR');

  console.log(`\nSlip ${slip.ourNumber}:`);
  console.log(`  Document: ${slip.documentNumber}`);
  console.log(`  Amount: R$ ${amountPaid.toFixed(2)}`);
  console.log(`  Payment Date: ${paymentDate}`);

  // Update your database
  // await updateInvoiceAsPaid(slip.documentNumber, amountPaid, slip.paymentDate);
});
```

### Example 2: Generate REMESSA for New Invoices

```typescript
import { generateCnab400, Cnab400File, DetailRecord } from '@linkiez/boleto-sdk';

// Your invoices from database
const invoices = [
  { id: 'INV-001', customerId: 123, amount: 150.00, dueDate: '2026-02-28' },
  { id: 'INV-002', customerId: 456, amount: 250.00, dueDate: '2026-03-15' }
];

// Get customer data
async function getCustomer(id: number) {
  // Query your database
  return {
    name: 'ACME CORPORATION LTDA',
    taxId: '98765432000100',
    address: 'RUA EXEMPLO 123',
    city: 'SAO PAULO',
    state: 'SP',
    postalCode: '01310100'
  };
}

// Build detail records
const details: DetailRecord[] = [];
for (let i = 0; i < invoices.length; i++) {
  const invoice = invoices[i];
  const customer = await getCustomer(invoice.customerId);

  details.push({
    recordType: '1',
    companyRegistrationNumber: '12345678000195',
    agency: '4897',
    account: '17450',
    accountDigit: '6',
    companyControl: invoice.id,
    ourNumber: (1000000 + i).toString(),  // Sequential our number
    portfolioCode: '109',
    occurrenceCode: '01',  // Entry registration
    documentNumber: invoice.id,
    dueDate: new Date(invoice.dueDate),
    amount: Math.round(invoice.amount * 100),  // Convert to cents
    bankCode: '341',
    speciesCode: '01',
    acceptance: 'N',
    issueDate: new Date(),
    instructionCode1: '00',
    instructionCode2: '00',
    interestAmount: 0,
    discountAmount: 0,
    iofAmount: 0,
    rebateAmount: 0,
    payerRegistrationType: customer.taxId.length === 11 ? '01' : '02',
    payerTaxId: customer.taxId,
    payerName: customer.name,
    payerAddress: customer.address,
    payerCity: customer.city,
    payerState: customer.state,
    payerPostalCode: customer.postalCode,
    sequentialNumber: i + 1
  });
}

// Build complete file
const remessaData: Cnab400File = {
  header: {
    recordType: '0',
    operationType: '1',
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
  details: details,
  trailer: {
    recordType: '9',
    totalRecords: details.length,
    sequentialNumber: details.length + 2  // Header + details + trailer
  }
};

const cnabContent = generateCnab400(remessaData);

// Save to file
import { writeFileSync } from 'fs';
const filename = `remessa_${new Date().toISOString().split('T')[0]}.ret`;
writeFileSync(filename, cnabContent, 'utf-8');

console.log(`✓ Generated ${filename} with ${details.length} slips`);
```

### Example 3: Round-Trip with Modifications

```typescript
import { parseCnab400, generateCnab400 } from '@linkiez/boleto-sdk';

// Parse original file
const originalContent = readFileSync('remessa_original.ret', 'utf-8');
const parsed = parseCnab400(originalContent);

// Modify specific records
parsed.details.forEach(detail => {
  // Add 2% interest after due date
  if (!detail.interestAmount || detail.interestAmount === 0) {
    detail.interestAmount = Math.round(detail.amount * 0.02);
  }

  // Add instruction to protest after 10 days
  detail.instructionCode1 = '09';  // Protest after N days
  detail.instructionCode2 = '10';  // 10 days
});

// Generate new file with modifications
const modifiedContent = generateCnab400(parsed);
writeFileSync('remessa_modified.ret', modifiedContent, 'utf-8');

// Verify modifications
const verified = parseCnab400(modifiedContent);
console.log('Original slips:', parsed.details.length);
console.log('Modified slips:', verified.details.length);
console.log('First slip interest:', verified.details[0].interestAmount);
console.log('✓ Modifications applied successfully');
```

---

## Best Practices

### 1. Always Validate Input

```typescript
import { validateCnab400File, ValidationError } from '@linkiez/boleto-sdk';

try {
  const validData = validateCnab400File(data);
  const cnabContent = generateCnab400(validData);
} catch (error) {
  if (error instanceof ValidationError) {
    console.error('Validation errors:');
    error.issues?.forEach(issue => {
      console.error(`  ${issue.path.join('.')}: ${issue.message}`);
    });
  }
}
```

### 2. Handle Sequential Numbers Correctly

Sequential numbers must increment across **all** record types:

```typescript
const data: Cnab400File = {
  header: { sequenceNumber: 1 },        // Line 1
  details: [
    { sequentialNumber: 1 },            // Line 2
    { sequentialNumber: 2 }             // Line 3
  ],
  penaltyRecords: [
    { sequentialNumber: 3 }             // Line 4 (if present)
  ],
  trailer: { sequentialNumber: 4 }      // Line 5
};
```

### 3. Convert Amounts Correctly

All amounts in CNAB files are in **cents** (integers):

```typescript
// Convert from BRL to cents
const amountInBRL = 150.50;
const amountInCents = Math.round(amountInBRL * 100);  // 15050

// Convert from cents to BRL
const cents = 15050;
const brl = cents / 100;  // 150.50
console.log(`R$ ${brl.toFixed(2)}`);  // "R$ 150.50"
```

### 4. Handle Dates Properly

```typescript
// Parse dates from CNAB (DDMMYY format)
const dateStr = '280226';  // 28/02/2026
const day = parseInt(dateStr.substring(0, 2));
const month = parseInt(dateStr.substring(2, 4)) - 1;  // Month is 0-indexed
const year = 2000 + parseInt(dateStr.substring(4, 6));
const date = new Date(year, month, day);

// Format dates for CNAB
function formatDateCnab(date: Date): string {
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = String(date.getFullYear()).slice(-2);
  return `${day}${month}${year}`;
}
```

### 5. Use Type Safety

```typescript
import type { Cnab400File, DetailRecord, PenaltyRecord } from '@linkiez/boleto-sdk';

// TypeScript will catch errors at compile time
const detail: DetailRecord = {
  recordType: '1',
  // ... TypeScript ensures all required fields are present
  amount: 15000,  // Type error if you use string instead of number
  dueDate: new Date(),  // Type error if you use string
};
```

### 6. Log and Monitor

```typescript
import { parseCnab400, ParseError } from '@linkiez/boleto-sdk';

function processCnabFile(filename: string) {
  try {
    console.log(`[INFO] Processing ${filename}`);
    const content = readFileSync(filename, 'utf-8');
    const parsed = parseCnab400(content);

    console.log(`[INFO] Parsed ${parsed.details.length} records`);
    console.log(`[INFO] Operation type: ${parsed.header.operationType === '1' ? 'REMESSA' : 'RETORNO'}`);

    return parsed;
  } catch (error) {
    if (error instanceof ParseError) {
      console.error(`[ERROR] Parse failed at line ${error.line}: ${error.message}`);
    } else {
      console.error(`[ERROR] Failed to process ${filename}:`, error);
    }
    throw error;
  }
}
```

---

## Troubleshooting

### Error: "Invalid line length"

**Cause**: CNAB400 lines must be exactly 400 characters.

**Solution**:

```typescript
// Check line lengths
const lines = content.split('\n').filter(l => l.length > 0);
lines.forEach((line, i) => {
  if (line.length !== 400) {
    console.error(`Line ${i + 1} has ${line.length} characters (expected 400)`);
  }
});
```

### Error: "Invalid short date format"

**Cause**: Date string is not 6 characters (DDMMYY).

**Solution**: Ensure dates are formatted correctly:

```typescript
// Wrong
const date = '2026-01-21';  // ISO format

// Correct
const date = '210126';  // DDMMYY format
```

### Parser Returns Unexpected Values

**Issue**: Field values are not what you expect.

**Solution**: Check if you're using the correct format (REMESSA vs RETORNO):

```typescript
const parsed = parseCnab400(content);

if (parsed.header.operationType === '1') {
  // REMESSA - has instruction codes
  console.log(parsed.details[0].instructionCode1);
} else {
  // RETORNO - has occurrence codes
  console.log(parsed.details[0].occurrenceCode);
}
```

### Sequential Numbers Don't Match

**Issue**: Trailer shows different totalRecords than actual count.

**Solution**:

```typescript
// Count actual detail records
const actualCount = parsed.details.length;
const trailerCount = parsed.trailer.totalRecords;

if (actualCount !== trailerCount && trailerCount !== 0) {
  console.warn(`Warning: Trailer says ${trailerCount} but found ${actualCount} records`);
}

// Note: Some banks leave totalRecords blank (0), which is acceptable
```

### Amount Conversion Issues

**Issue**: Amounts display incorrectly.

**Solution**: Always divide by 100 when displaying, multiply by 100 when generating:

```typescript
// Display
const displayAmount = parsed.details[0].amount / 100;
console.log(`R$ ${displayAmount.toFixed(2)}`);

// Generate
const inputAmount = 150.50;  // User input
const cnabAmount = Math.round(inputAmount * 100);  // 15050
```

### Encoding Problems

**Issue**: Special characters (ç, ã, õ) appear garbled.

**Solution**: Use UTF-8 encoding:

```typescript
import { readFileSync, writeFileSync } from 'fs';

// Read with explicit encoding
const content = readFileSync('arquivo.ret', 'utf-8');

// Write with explicit encoding
writeFileSync('arquivo.ret', cnabContent, 'utf-8');
```

---

## Summary

This guide covered:

- ✅ REMESSA vs RETORNO differences
- ✅ Parsing both file types
- ✅ Generating both file types
- ✅ Working with penalty records
- ✅ Field position reference
- ✅ Real-world examples
- ✅ Best practices
- ✅ Troubleshooting common issues

For more information:

- [Bank-Specific Layouts](./BANK_DIFFERENCES.md)
- [CNAB400 Itaú Layout Notes](./CNAB400-ITAU.md)
- [API Reference](./API-REFERENCE.md)

---

**Last Updated**: 2026-01-21
