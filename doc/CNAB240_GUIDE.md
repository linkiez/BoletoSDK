# CNAB240 Guide

This guide explains how to parse and generate CNAB240 files using BoletoSDK.

## Overview

CNAB240 is a fixed-length (240 characters) file format used by Brazilian banks for remittance and return files. A CNAB240 file is structured as:

- File Header (record type 0)
- One or more batches
- File Trailer (record type 9)

Each batch contains:

- Batch Header (record type 1)
- Detail records (segments P, Q, optional R)
- Batch Trailer (record type 5)

## Quick Start

### Parse a CNAB240 File

```typescript
import { parseCnab240 } from '@linkiez/boleto-sdk';

const content = readFileSync('file.cnab', 'utf-8');
const file = parseCnab240(content);

console.log(file.fileHeader.bankCode);
console.log(file.batches.length);
```

### Generate a CNAB240 File

```typescript
import { generateCnab240 } from '@linkiez/boleto-sdk';
import type { Cnab240File } from '@linkiez/boleto-sdk';

const file: Cnab240File = {
  fileHeader: {
    bankCode: '341',
    batchNumber: '0000',
    recordType: '0',
    companyRegistrationType: '2',
    companyRegistrationNumber: '12345678000195',
    agency: '1234',
    agencyDigit: '5',
    account: '123456',
    accountDigit: '7',
    companyName: 'ACME Corp',
    bankName: 'BANCO ITAU SA',
    fileCode: '1',
    generationDate: new Date('2026-01-15'),
    sequentialNumber: 1,
    layoutVersion: '087',
  },
  batches: [
    {
      header: {
        bankCode: '341',
        batchNumber: 1,
        recordType: '1',
        operationType: 'C',
        serviceType: '01',
        companyRegistrationType: '2',
        companyRegistrationNumber: '12345678000195',
        agency: '1234',
        agencyDigit: '5',
        account: '123456',
        accountDigit: '7',
        companyName: 'ACME Corp',
      },
      details: [
        {
          segmentP: {
            bankCode: '341',
            batchNumber: 1,
            recordType: '3',
            sequentialNumber: 1,
            segmentCode: 'P',
            occurrenceCode: '01',
            agency: '1234',
            agencyDigit: '5',
            account: '123456',
            accountDigit: '7',
            fullAccountDigit: '8',
            ourNumber: '12345678901234567890',
            portfolioCode: '109',
            documentNumber: 'DOC001',
            dueDate: new Date('2026-02-15'),
            amount: 100.5,
            collectionAgency: '0',
            collectionAgencyDigit: '',
            speciesCode: '01',
            acceptance: 'N',
            issueDate: new Date('2026-01-15'),
            interestCode: '0',
            interestDate: new Date('2026-02-16'),
            interestAmount: 0,
            discountCode: '0',
            discountDate: new Date('2026-02-10'),
            discountAmount: 0,
            iofAmount: 0,
            rebateAmount: 0,
            protestCode: '3',
            protestDays: 0,
            writeOffCode: '0',
            writeOffDays: 0,
            currencyCode: '09',
          },
          segmentQ: {
            bankCode: '341',
            batchNumber: 1,
            recordType: '3',
            sequentialNumber: 2,
            segmentCode: 'Q',
            occurrenceCode: '01',
            payerRegistrationType: '1',
            payerTaxId: '12345678901',
            payerName: 'John Doe',
            payerAddress: 'Street Test 123',
            payerNeighborhood: 'Centro',
            payerPostalCode: '12345678',
            payerCity: 'Sao Paulo',
            payerState: 'SP',
          },
        },
      ],
      trailer: {
        bankCode: '341',
        batchNumber: 1,
        recordType: '5',
        totalRecords: 4,
      },
    },
  ],
  fileTrailer: {
    bankCode: '341',
    batchNumber: '9999',
    recordType: '9',
    totalBatches: 1,
    totalRecords: 6,
  },
};

const content = generateCnab240(file);
```

## Optional Segment R

Segment R is optional and adds discount and fine information. Include `segmentR` on a detail only when needed.

```typescript
segmentR: {
  bankCode: '341',
  batchNumber: 1,
  recordType: '3',
  sequentialNumber: 3,
  segmentCode: 'R',
  occurrenceCode: '01',
  discount2Code: '1',
  discount2Date: new Date('2026-02-10'),
  discount2Amount: 5,
}
```

## Validation

Validation happens in multiple layers:

- Structure and required fields (generators)
- Zod schemas (runtime validation)
- Business rules (validators)

Use validators explicitly when you receive input from external sources.

```typescript
import { validateCnab240File } from '@linkiez/boleto-sdk';

const validated = validateCnab240File(file);
```

## Common Pitfalls

- Ensure all lines are exactly 240 characters
- Use sequential numbers consistently (within each batch)
- Always include both segments P and Q
- Only include Segment R when needed

## References

- [CNAB240 FEBRABAN reference](CNAB240-FEBRABAN.md)
- [Segment positions validation](SEGMENT_POSITIONS_VALIDATION.md)
