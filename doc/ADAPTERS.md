# Adapters Guide

This guide explains how bank-specific adapters work in BoletoSDK and how to use the current Itaú adapter.

## Why adapters exist

The SDK core is bank-agnostic for CNAB parsing and generation.
Adapters isolate bank-specific behavior such as:

- Wallet code rules
- Instruction and occurrence mappings
- Bank-only field extraction
- Additional business validation

This keeps core APIs stable while allowing bank-specific evolution.

## Current availability

- Itaú adapter: available
- Bradesco, BB, Caixa, Santander: planned

## Import options

```typescript
import { ItauAdapter, createItauAdapter } from '@linkiez/boleto-sdk';
```

## Quick start

```typescript
import { createItauAdapter } from '@linkiez/boleto-sdk';

const adapter = createItauAdapter();

adapter.assertSupportedWallet('109');

const wallet = adapter.getWalletConfig('109');
// {
//   code: '109',
//   description: 'Simple collection without registration',
//   cnab240PortfolioCode: '109',
//   cnab400WalletType: 'I'
// }
```

## Our number helper (Itaú)

```typescript
import { createItauAdapter } from '@linkiez/boleto-sdk';

const adapter = createItauAdapter();

const result = adapter.buildOurNumber('12345678');
// {
//   baseNumber: '12345678',
//   checkDigit: 2,
//   formatted: '123456782'
// }
```

## CNAB400 enrichment

Use enrichment to combine generic parser output with Itaú-specific metadata.

```typescript
import { createItauAdapter } from '@linkiez/boleto-sdk';
import { readFileSync } from 'node:fs';

const adapter = createItauAdapter();
const content = readFileSync('tests/fixtures/cnab400/itau-remessa-sample1.ret', 'utf8');

const details = adapter.buildRemittanceDetailsFromContent(content);

for (const detail of details) {
  if (!detail.validation.isValid) {
    console.log(detail.validation.errors);
  }
}
```

For return files:

```typescript
const returnDetails = adapter.buildReturnDetailsFromContent(returnContent);
```

Each enriched item includes:

- Generic CNAB400 detail record
- Parsed Itaú-only fields
- Wallet metadata when supported
- Instruction/occurrence/liquidation mappings when available
- Validation result

## CNAB240 enrichment

You can enrich from raw content or from parsed structures.

```typescript
import { createItauAdapter, parseCnab240 } from '@linkiez/boleto-sdk';

const adapter = createItauAdapter();

const parsed = parseCnab240(cnab240Content);
const enrichedFromFile = adapter.buildCnab240DetailsFromFile(parsed);
const enrichedFromContent = adapter.buildCnab240DetailsFromContent(cnab240Content);
```

Each CNAB240 enriched item includes:

- Parsed detail (segments P/Q/R)
- Wallet resolution based on portfolio code
- Occurrence mapping when recognized
- Validation summary

## Wallet support

The current Itaú adapter supports:

- 109
- 112
- 115
- 180

Use `isSupportedWallet` for non-throwing checks and `assertSupportedWallet` for guarded flows.

## Error behavior

Adapter methods can throw when:

- Wallet is unsupported and assertion is used
- Invalid instruction/occurrence code is mapped directly
- CNAB line/content is invalid for parser constraints
- Our number base is empty or non-numeric

Recommended pattern:

```typescript
try {
  const data = adapter.buildReturnDetailsFromContent(content);
  // process
} catch (error) {
  // log, tag and continue according to your pipeline policy
}
```

## Generic contract

All bank adapters implement `IBankAdapter`:

```typescript
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
```

This enables polymorphic usage when additional bank adapters are introduced.

## Related docs

- API: [API-REFERENCE.md](API-REFERENCE.md)
- Bank differences: [BANK_DIFFERENCES.md](BANK_DIFFERENCES.md)
- Examples: [EXAMPLES.md](EXAMPLES.md)
- Roadmap: [../ROADMAP.md](../ROADMAP.md)
