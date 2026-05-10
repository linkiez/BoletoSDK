# ItauWalletValidator

## Overview

Validates Ita\u00fa wallet codes accepted by this SDK.

## Responsibilities

- Define supported wallet codes.
- Provide boolean validation helper.
- Provide assertion helper for invalid wallets.

## Inputs and outputs

- Inputs:
  - `walletCode: string`
- Outputs:
  - `isValidItauWallet`: type guard boolean
  - `assertValidItauWallet`: throws on invalid input

## API / Signature

```ts
export const ITAU_SUPPORTED_WALLETS: readonly ItauWalletCode[];
export function isValidItauWallet(walletCode: string): walletCode is ItauWalletCode;
export function assertValidItauWallet(walletCode: string): void;
```

## Main flow

```mermaid
flowchart TD
  A[walletCode] --> B{3 numeric digits?}
  B -- No --> C[invalid]
  B -- Yes --> D{in supported set?}
  D -- Yes --> E[valid]
  D -- No --> C
```

## Error handling and edge cases

- Rejects non-numeric values.
- Rejects numeric values outside the supported set.
- Assertion throws a clear error with provided code.

## Examples

```ts
isValidItauWallet('109'); // true
isValidItauWallet('999'); // false
assertValidItauWallet('112'); // no throw
```

## Dependencies and integrations

- Uses `ItauWalletCode` from adapter types.
