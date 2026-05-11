# Examples

This document provides practical examples for parsing and generating CNAB files.

## Parse CNAB with Auto-Detection

```typescript
import { readFileSync } from 'node:fs';
import { parseCnab } from '@linkiez/boleto-sdk';

const content = readFileSync('file.cnab', 'utf-8');
const parsed = parseCnab(content);

console.log(parsed);
```

## Generate CNAB240

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
  batches: [],
  fileTrailer: {
    bankCode: '341',
    batchNumber: '9999',
    recordType: '9',
    totalBatches: 0,
    totalRecords: 2,
  },
};

const content = generateCnab240(file);
```

## Generate CNAB400

```typescript
import { generateCnab400 } from '@linkiez/boleto-sdk';
import type { Cnab400File } from '@linkiez/boleto-sdk';

const file: Cnab400File = {
  header: {
    recordType: '0',
    operationType: '1',
    bankCode: '341',
    companyName: 'ACME Corp',
    generationDate: new Date('2026-02-01'),
    sequenceNumber: 1,
  },
  details: [
    {
      recordType: '1',
      ourNumber: '12345678',
      amount: 150.0,
      dueDate: new Date('2026-03-15'),
      payerName: 'John Doe',
      sequentialNumber: 2,
    },
  ],
  trailer: {
    recordType: '9',
    totalRecords: 3,
    totalAmount: 150.0,
    sequentialNumber: 3,
  },
};

const content = generateCnab400(file);
```

## Round Trip (Generate → Parse)

```typescript
import { generateCnab240, parseCnab240 } from '@linkiez/boleto-sdk';

const content = generateCnab240(file);
const parsed = parseCnab240(content);

console.log(parsed.fileHeader.bankCode);
```

## Validation

```typescript
import { validateCnab240File } from '@linkiez/boleto-sdk';

validateCnab240File(file);
```

## Itaú Adapter - Wallet and Our Number

```typescript
import { createItauAdapter } from '@linkiez/boleto-sdk';

const adapter = createItauAdapter();

adapter.assertSupportedWallet('109');

const ourNumber = adapter.buildOurNumber('12345678');
console.log(ourNumber.formatted); // 123456782
```

## Itaú Adapter - CNAB400 Enrichment

```typescript
import { readFileSync } from 'node:fs';
import { createItauAdapter } from '@linkiez/boleto-sdk';

const adapter = createItauAdapter();
const remittance = readFileSync('tests/fixtures/cnab400/itau-remessa-sample1.ret', 'utf-8');
const retorno = readFileSync('tests/fixtures/cnab400/itau-retorno-sample1.ret', 'utf-8');

const remittanceDetails = adapter.buildRemittanceDetailsFromContent(remittance);
const returnDetails = adapter.buildReturnDetailsFromContent(retorno);

console.log(remittanceDetails[0]?.wallet?.code);
console.log(returnDetails[0]?.occurrence?.description);
```

## Itaú Adapter - CNAB240 Enrichment

```typescript
import { readFileSync } from 'node:fs';
import { createItauAdapter } from '@linkiez/boleto-sdk';

const adapter = createItauAdapter();
const cnab240Content = readFileSync('input.cnab240', 'utf-8');

const details = adapter.buildCnab240DetailsFromContent(cnab240Content);
console.log(details.length);
```
