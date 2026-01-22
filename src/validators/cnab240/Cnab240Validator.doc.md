# Cnab240Validator

## Overview

Provides structural validation for CNAB240 files, including batch integrity, segment sequence, and record count consistency.

## Responsibilities

- Validate file header and trailer presence.
- Validate batches, including header/trailer consistency.
- Validate segment sequence (P, Q, optional R).
- Validate record counts at batch and file level.
- Validate file shape with Zod schema.

## Inputs and outputs

- Inputs:
  - `Cnab240File`
- Outputs:
  - `ValidationResult` with `isValid` and `errors`.

## Main flow

```mermaid
flowchart TD
  A[validateCnab240File] --> B[validateFileStructure]
  B --> C[Validate file header/trailer]
  B --> D[Validate batches]
  D --> E[Validate details and segment sequence]
  D --> F[Validate batch record counts]
  B --> G[Validate file trailer counts]
  C --> H[Aggregate errors]
  D --> H
  G --> H
  H --> I[ValidationResult]
```

## Error handling and edge cases

- Missing `fileHeader` or `fileTrailer`.
- Empty `batches` collection.
- Missing batch header or trailer.
- Invalid segment codes or record types.
- Invalid segment sequence (non-consecutive sequential numbers).
- Mismatched batch or file record counts.
- Zod schema validation errors are reported with field paths.

## Examples

```ts
import { validateCnab240File } from '@/validators/cnab240';

const result = validateCnab240File(file);
if (!result.isValid) {
  console.error(result.errors);
}
```

## Dependencies and integrations

- Uses `RECORD_TYPE` from constants.
- Uses `ValidationResult` from common validators.
- Operates on `Cnab240File`, `Batch`, and `DetailRecord` types.
