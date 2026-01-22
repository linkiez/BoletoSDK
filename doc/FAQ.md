# FAQ

## What is CNAB?

CNAB is a Brazilian banking standard for exchanging remittance and return files between companies and banks.

## Which formats are supported?

BoletoSDK supports CNAB240 and CNAB400, including parsing and generation for remittance and return files.

## How do I detect the format automatically?

Use the factory parser:

```typescript
import { parseCnab } from '@linkiez/boleto-sdk';

const parsed = parseCnab(content);
```

## How do I generate a file?

Use the format-specific generator or the factory generator:

```typescript
import { generateCnab } from '@linkiez/boleto-sdk';

const content = generateCnab(parsedData);
```

## Why are my lines not 240/400 characters?

CNAB requires fixed-length lines. Ensure all required fields are provided and correctly typed. The generators validate line lengths and throw errors when the output size is invalid.

## Are bank-specific layouts supported?

The SDK provides bank-agnostic parsing and generation for common layouts. Bank-specific details can be layered via constants and validation rules.

## Where can I find CNAB specifications?

See the reference documents in the doc folder:

- CNAB240 FEBRABAN reference
- CNAB400 bank-specific references (Itaú, Bradesco, Caixa, Santander)
