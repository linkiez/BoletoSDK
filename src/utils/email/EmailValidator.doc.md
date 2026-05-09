# EmailValidator

## Overview

Validates email addresses used by boleto email delivery flows.

## Responsibilities

- Validate a single email address with a simplified RFC-compatible pattern.
- Filter a list of email addresses down to valid entries.

## Inputs and outputs

- Inputs:
  - Email string or array of email strings.
- Outputs:
  - `boolean` for single validation.
  - `string[]` for filtered lists.

## API / Signature

```ts
export function isValidEmail(email: string): boolean;
export function filterValidEmails(emails: string[]): string[];
```

## Error handling and edge cases

- Returns `false` for empty strings, non-string values, and malformed addresses.
- Trims whitespace before validation.

## Examples

```ts
import { isValidEmail, filterValidEmails } from '@utils/email';

const valid = isValidEmail('customer@example.com');
const filtered = filterValidEmails(['good@example.com', 'bad']);
```
